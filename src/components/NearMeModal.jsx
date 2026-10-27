import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Navigation,
  X,
  Check,
  Map,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Compass,
  Utensils,
  Clock,
  Tag,
  ExternalLink,
  Info,
  BookOpen
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JOGJA_GPS_ZONES } from '../data/culturalData';
import {
  KOTA_YOGYAKARTA_OUTLINE,
  KEMANTREN_LIST,
  KOTA_YOGYAKARTA_CENTER,
  KOTA_YOGYAKARTA_BOUNDS,
  MAP_REGION_LABELS
} from '../data/kotaYogyakartaBoundary';

// Batas Geografis Ketat (Geo-Fence Lock) Provinsi Daerah Istimewa Yogyakarta & Kota Yogyakarta
const JOGJA_MAX_BOUNDS = [
  [-8.22, 110.00], // Barat Daya
  [-7.52, 110.86]  // Timur Laut
];

// Menghitung jarak geodetik nyata (Haversine Formula) dalam satuan meter
function getHaversineMeters(coordA, coordB) {
  if (!coordA || !coordB) return null;
  const R = 6371000; // meter
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(coordB.lat - coordA.lat);
  const dLng = toRad(coordB.lng - coordA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coordA.lat)) *
      Math.cos(toRad(coordB.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatDistanceLabel(meters, suffix = '') {
  if (meters === null || meters === undefined) return '';
  const distStr =
    meters < 1000
      ? `${meters} m`
      : meters < 10000
      ? `${(meters / 1000).toFixed(2)} km`
      : `${(meters / 1000).toFixed(1)} km`;
  return suffix ? `${distStr} ${suffix}` : distStr;
}

// Konfigurasi Tile Basemap Super Cepat (Google Maps HD Edge CDN, Instant Render, Tajam Hingga Zoom 20)
function getTileLayerConfig(layer) {
  if (layer === 'satellite') {
    return {
      url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      maxNativeZoom: 20,
      attribution: '&copy; Google Maps'
    };
  }
  if (layer === 'osm-standard') {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    };
  }
  // Default: Google Streets HD (Super Cepat, Edge CDN, Tajam Hingga Zoom 20 Tanpa Pecah)
  return {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    maxNativeZoom: 20,
    attribution: '&copy; Google Maps &bull; Peta Detail Yogyakarta'
  };
}

export default function NearMeModal({
  isOpen,
  onClose,
  places = [],
  onSelectPlace,
  autoDetectedZoneId,
  userLiveCoords,
  isOutsideJogja,
  outsideJogjaCoords,
  userLiveAddress,
  gpsErrorMsg,
  onRefreshDeviceGps,
  isGpsLoading
}) {
  const [selectedZoneId, setSelectedZoneId] = useState(
    autoDetectedZoneId || JOGJA_GPS_ZONES[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusLimitKm, setRadiusLimitKm] = useState(10); // Radius rekomendasi: 5 KM atau 10 KM
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardDropdown = (id, e) => {
    e?.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const [activeMapLayer, setActiveMapLayer] = useState('google-streets'); // Default: Google Maps HD Super Cepat
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true); // Panel floating drawer di dalam peta
  const initialCameraSetRef = useRef(false);

  // Refs untuk Peta Interaktif Leaflet + Tile Basemap + Boundary Layer
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const boundaryLayerRef = useRef(null);
  const layerGroupRef = useRef(null);

  // Re-render Leaflet tiles saat panel samping peta dibuka/ditutup
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isSidePanelOpen]);

  // Sinkronisasi saat GPS mendeteksi wilayah terdekat di dalam D.I. Yogyakarta
  useEffect(() => {
    if (autoDetectedZoneId) {
      const validZone = JOGJA_GPS_ZONES.find((z) => z.id === autoDetectedZoneId);
      if (validZone) {
        setSelectedZoneId(validZone.id);
      }
    }
  }, [autoDetectedZoneId]);

  const activeZone =
    JOGJA_GPS_ZONES.find((z) => z.id === selectedZoneId) || JOGJA_GPS_ZONES[0];

  const wisataAnchor = activeZone.wisataAnchor || {
    trackCode: 'WISATA-A',
    name: activeZone.wilayahName,
    address: activeZone.kabupaten,
    coordinates: activeZone.coordinates
  };

  // Titik acuan radius di Jogja: GPS asli jika di Jogja, atau Track Point Wisata jika di luar Jogja
  const referenceCoordInJogja = userLiveCoords || wisataAnchor.coordinates;

  // Filter tempat berdasarkan kata kunci dan radius pencarian
  const filteredItems = activeZone.kulinerList.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.trackPointCode &&
        item.trackPointCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tasteProfile &&
        item.tasteProfile.toLowerCase().includes(searchQuery.toLowerCase()));

    const distMeters = getHaversineMeters(referenceCoordInJogja, item.coordinates);
    const matchesRadius =
      distMeters === null || distMeters <= radiusLimitKm * 1000;

    return matchesSearch && matchesRadius;
  });

  // Reset kartu yang terbuka jika tidak ada di hasil filter baru
  useEffect(() => {
    if (selectedCardId && !filteredItems.some((i) => i.id === selectedCardId)) {
      setSelectedCardId(null);
    }
  }, [selectedZoneId, searchQuery, radiusLimitKm, filteredItems, selectedCardId]);

  // Tutup dengan tombol ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeItem =
    filteredItems.find((i) => i.id === selectedCardId) || null;

  // Inisialisasi Peta Leaflet Berpusat di Kota Yogyakarta (Sesuai Foto 1)
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id && !mapInstanceRef.current) {
      delete mapContainerRef.current._leaflet_id;
    }

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: KOTA_YOGYAKARTA_CENTER,
          zoom: 13,
          minZoom: 10,
          maxZoom: 19,
          maxBounds: JOGJA_MAX_BOUNDS,
          maxBoundsViscosity: 0.75,
          zoomControl: false
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Layer Tile Basemap HD (Google Maps HD: Super Cepat, Edge CDN, Tajam Hingga Zoom 20)
        const tileCfg = getTileLayerConfig(activeMapLayer);
        const tileLyr = L.tileLayer(tileCfg.url, {
          maxZoom: tileCfg.maxZoom,
          maxNativeZoom: tileCfg.maxNativeZoom,
          subdomains: tileCfg.subdomains,
          attribution: tileCfg.attribution,
          updateWhenIdle: false,
          updateWhenZooming: false,
          keepBuffer: 6
        });

        tileLyr.addTo(map);
        tileLayerRef.current = tileLyr;

        // Layer Boundary Khusus Kota Yogyakarta (Garis Batas Merah & Label Wilayah Sesuai Foto 1)
        const boundaryGroup = L.layerGroup().addTo(map);
        boundaryLayerRef.current = boundaryGroup;

        // 1. Garis Batas Merah Keliling Resmi Kota Yogyakarta (Persis Foto 1)
        L.polygon(KOTA_YOGYAKARTA_OUTLINE, {
          color: '#E53935', // Garis Batas Administrasi Resmi
          weight: 3.5,
          opacity: 0.95,
          fillColor: '#FFEBEE',
          fillOpacity: 0.04,
          lineJoin: 'round',
          lineCap: 'round',
          interactive: false
        }).addTo(boundaryGroup);

        // 2. Garis Batas 13 Kemantren Dalam Kota Yogyakarta (Garis Halus Tipis Seperti Foto 1)
        KEMANTREN_LIST.forEach((kem) => {
          L.polygon(kem.coordinates, {
            color: '#B0A8A0',
            weight: 1.2,
            dashArray: '3, 4',
            opacity: 0.6,
            fillOpacity: 0,
            interactive: false
          }).addTo(boundaryGroup);

        });

        // Layer Pin Kuliner & Track Point
        layerGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        // Inisialisasi posisi awal: jika ada kawasan aktif (cth. Malioboro), langsung set view
        if (activeZone && activeZone.coordinates) {
          map.setView([activeZone.coordinates.lat, activeZone.coordinates.lng], 15.5);
        } else {
          map.fitBounds(KOTA_YOGYAKARTA_BOUNDS, {
            padding: [30, 30],
            maxZoom: 14
          });
        }

        // Invalidate size cepat sekali setelah layout terpasang
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 80);
      } catch (err) {
        console.error('[NearMeModal] Error initializing Leaflet map:', err);
      }

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [isOpen]);

  // Efek ganti basemap tile ketika activeMapLayer berubah
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const tileCfg = getTileLayerConfig(activeMapLayer);
    const newTile = L.tileLayer(tileCfg.url, {
      maxZoom: tileCfg.maxZoom,
      maxNativeZoom: tileCfg.maxNativeZoom,
      subdomains: tileCfg.subdomains,
      attribution: tileCfg.attribution,
      updateWhenIdle: false,
      updateWhenZooming: false,
      keepBuffer: 6
    });

    newTile.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [activeMapLayer]);

  // Render Track Point Wisata Utama + Lingkaran Radius + Pin Kuliner Terdekat + Kamera FlyTo
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 0. Pusat Kawasan Terpilih (Anchor Wisata: Malioboro, Keraton, Kotagede, dll.)
    if (wisataAnchor?.coordinates) {
      const anchorLatLng = [wisataAnchor.coordinates.lat, wisataAnchor.coordinates.lng];

      // Lingkaran radius area kuliner
      L.circle(anchorLatLng, {
        radius: (radiusLimitKm || 5) * 1000,
        color: '#C99B52',
        weight: 1.5,
        opacity: 0.45,
        dashArray: '5, 8',
        fillColor: '#C99B52',
        fillOpacity: 0.05
      }).addTo(group);

      const zoneAnchorIcon = L.divIcon({
        className: 'zone-anchor-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;filter:drop-shadow(0 6px 14px rgba(44,34,30,0.3));">
            <div style="background:#2C221E;color:#E5B869;padding:4px 10px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:1.5px solid #C99B52;margin-bottom:3px;display:flex;align-items:center;gap:5px;letter-spacing:0.02em;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#E5B869;"></span>
              <span>Pusat ${activeZone.wilayahName.split(',')[0]}</span>
            </div>
            <svg width="28" height="36" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 0C8.06 0 0 8.06 0 18C0 30.25 16.1 42.7 17.21 43.54C17.68 43.89 18.32 43.89 18.79 43.54C19.9 42.7 36 30.25 36 18C36 8.06 27.94 0 18 0Z" fill="#2C221E" stroke="#C99B52" stroke-width="2"/>
              <circle cx="18" cy="18" r="7" fill="#C99B52"/>
              <circle cx="18" cy="18" r="3.5" fill="#FAF8F5"/>
            </svg>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const anchorMarker = L.marker(anchorLatLng, {
        icon: zoneAnchorIcon,
        zIndexOffset: 850
      }).bindPopup(
        `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:6px;color:#2C221E;">
          <div style="font-size:10px;font-weight:800;color:#8A5D26;text-transform:uppercase;">PUSAT KAWASAN</div>
          <div style="font-size:13px;font-weight:800;color:#2C221E;margin:2px 0;">${wisataAnchor.name}</div>
          <div style="font-size:11px;color:#786B5E;">${wisataAnchor.address}</div>
        </div>`
      );

      anchorMarker.on('click', () => {
        setSelectedCardId(null);
        map.flyTo(anchorLatLng, 16, { duration: 0.65 });
      });

      group.addLayer(anchorMarker);
    }

    // 1. Jika Pengguna Sedang Berada di Dalam Wilayah D.I. Yogyakarta, Tampilkan Titik GPS Asli
    if (userLiveCoords && typeof userLiveCoords.lat === 'number') {
      const userLatLng = [userLiveCoords.lat, userLiveCoords.lng];
      const accRadius = Math.max(userLiveCoords.accuracy || 25, 18);

      L.circle(userLatLng, {
        radius: accRadius,
        color: '#C99B52',
        weight: 1.5,
        opacity: 0.8,
        fillColor: '#E5B869',
        fillOpacity: 0.16
      }).addTo(group);

      if (activeItem?.coordinates) {
        L.polyline(
          [userLatLng, [activeItem.coordinates.lat, activeItem.coordinates.lng]],
          {
            color: '#C99B52',
            weight: 2.5,
            opacity: 0.85,
            dashArray: '5, 8'
          }
        ).addTo(group);
      }

      const userGpsIcon = L.divIcon({
        className: 'real-user-gps-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
            <div style="background:#2C221E;color:#FAF8F5;padding:4px 10px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 6px 18px rgba(44,34,30,0.35);border:1.5px solid #C99B52;margin-bottom:4px;letter-spacing:0.02em;">
              Posisi Anda (±${userLiveCoords.accuracy || 15} m)
            </div>
            <div style="width:16px;height:16px;border-radius:50%;background:#C99B52;border:3px solid #FAF8F5;box-shadow:0 0 0 6px rgba(201,155,82,0.35);"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      L.marker(userLatLng, { icon: userGpsIcon, zIndexOffset: 1200 })
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:6px 4px;color:#2C221E;">
            <div style="font-size:10px;font-weight:800;color:#8A5D26;text-transform:uppercase;letter-spacing:0.04em;">LOKASI GPS DI D.I. YOGYAKARTA</div>
            <div style="font-size:12px;font-weight:800;color:#2C221E;margin:4px 0;font-family:monospace;">${userLiveCoords.lat.toFixed(6)}, ${userLiveCoords.lng.toFixed(6)}</div>
            <div style="font-size:11px;color:#786B5E;">Akurasi Sensor: ±${userLiveCoords.accuracy} meter</div>
            ${userLiveAddress ? `<div style="font-size:11px;color:#2C221E;margin-top:4px;">${userLiveAddress}</div>` : ''}
          </div>`
        )
        .addTo(group);
    }

    // 2. Marker Setiap Tempat Rekomendasi Kuliner (Pin Elegan Emas & Espresso)
    filteredItems.forEach((item) => {
      if (!item.coordinates) return;
      const isSelected = activeItem && activeItem.id === item.id;

      const markerHtml = isSelected
        ? `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;filter:drop-shadow(0 8px 18px rgba(44,34,30,0.35));">
            <div style="background:#2C221E;color:#FAF8F5;padding:5px 12px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:1.5px solid #C99B52;margin-bottom:3px;display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#C99B52;"></span>
              <span>${item.name}</span>
            </div>
            <svg width="34" height="42" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 0C8.06 0 0 8.06 0 18C0 30.25 16.1 42.7 17.21 43.54C17.68 43.89 18.32 43.89 18.79 43.54C19.9 42.7 36 30.25 36 18C36 8.06 27.94 0 18 0Z" fill="#2C221E"/>
              <circle cx="18" cy="18" r="8" fill="#C99B52"/>
              <circle cx="18" cy="18" r="4.5" fill="#FAF8F5"/>
            </svg>
          </div>
        `
        : `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
            <div style="background:rgba(255,255,255,0.96);backdrop-filter:blur(6px);color:#2C221E;padding:4px 10px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 14px rgba(44,34,30,0.14);border:1.5px solid #D6A756;margin-bottom:2px;display:flex;align-items:center;gap:5px;">
              <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#C99B52;"></span>
              <span>${item.name.split('(')[0].trim()}</span>
            </div>
            <svg width="22" height="28" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 5px rgba(44,34,30,0.18));">
              <path d="M18 0C8.06 0 0 8.06 0 18C0 30.25 16.1 42.7 17.21 43.54C17.68 43.89 18.32 43.89 18.79 43.54C19.9 42.7 36 30.25 36 18C36 8.06 27.94 0 18 0Z" fill="#FAF8F5" stroke="#C99B52" stroke-width="2.5"/>
              <circle cx="18" cy="18" r="5" fill="#C99B52"/>
            </svg>
          </div>
        `;

      const itemIcon = L.divIcon({
        className: 'jogja-tp-marker',
        html: markerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], {
        icon: itemIcon,
        zIndexOffset: isSelected ? 1000 : 500
      });

      marker.on('click', () => {
        setSelectedCardId(item.id);
        map.flyTo([item.coordinates.lat, item.coordinates.lng], 16.5, { duration: 0.65 });
      });

      group.addLayer(marker);
    });

    // 3. KAMERA POV BERPINDAH SESUAI PILIHAN USER:
    // Jika memilih tempat spesifik -> fokus ke koordinat tempat tersebut
    // Jika memilih kawasan (contoh Malioboro) -> POV kamera langsung terbang ke Malioboro
    if (activeItem?.coordinates) {
      map.flyTo(
        [activeItem.coordinates.lat, activeItem.coordinates.lng],
        16.5,
        { duration: 0.6 }
      );
    } else if (activeZone?.coordinates) {
      if (!initialCameraSetRef.current) {
        initialCameraSetRef.current = true;
      } else {
        map.flyTo(
          [activeZone.coordinates.lat, activeZone.coordinates.lng],
          15.5,
          { duration: 0.6 }
        );
      }
    }
  }, [
    isOpen,
    activeZone,
    activeItem,
    filteredItems.length,
    searchQuery,
    radiusLimitKm,
    userLiveCoords,
    userLiveAddress
  ]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          zIndex: 9990,
          backgroundColor: '#FAF8F5',
          color: '#2C221E',
          overflow: 'hidden',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* =========================================================================
            KANVAS UTAMA PETA (FULL 100VH x 100VW)
            ========================================================================= */}
        <div
          ref={mapContainerRef}
          id="leaflet-kuliner-map"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />

        {/* =========================================================================
            FLOATING ACTION TOOLS DI KANAN ATAS (Z-INDEX 995)
            Tombol Cepat: Fokus Kota, Ganti Basemap, Lacak GPS, dan Tutup
            ========================================================================= */}
        <div className="absolute top-20 sm:top-24 right-3 sm:right-6 z-[995] flex flex-col gap-2">
          {/* Tombol Fokus Kota Yogyakarta */}
          <button
            type="button"
            onClick={() => {
              setSelectedCardId(null);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.fitBounds(KOTA_YOGYAKARTA_BOUNDS, {
                  padding: [30, 30],
                  maxZoom: 14
                });
              }
            }}
            className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Tampilkan Seluruh Kota Yogyakarta"
          >
            <Compass size={18} className="group-hover:rotate-45 transition-transform" />
          </button>

          {/* Tombol Ganti Layer Peta */}
          <button
            type="button"
            onClick={() =>
              setActiveMapLayer((prev) =>
                prev === 'google-streets'
                  ? 'satellite'
                  : prev === 'satellite'
                  ? 'osm-standard'
                  : 'google-streets'
              )
            }
            className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={`Ganti Tampilan Peta (${
              activeMapLayer === 'google-streets'
                ? 'Aktif: Google Streets HD (Super Cepat)'
                : activeMapLayer === 'satellite'
                ? 'Aktif: Google Satellite HD'
                : 'Aktif: Standar OSM'
            })`}
          >
            <Layers size={18} />
          </button>

          {/* Tombol Lacak GPS Real-Time */}
          {onRefreshDeviceGps && (
            <button
              type="button"
              onClick={onRefreshDeviceGps}
              className={`w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center transition-all cursor-pointer ${
                isGpsLoading
                  ? 'text-[#C99B52] animate-spin'
                  : 'text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95'
              }`}
              title="Perbarui Deteksi Lokasi GPS"
            >
              <Navigation size={17} />
            </button>
          )}

          {/* Tombol Tutup Peta & Kembali */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#786B5E] hover:text-[#2C221E] hover:bg-[#FAF8F5] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Tutup Peta"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================================================================
            FLOATING LEFT DRAWER / EXPLORER PANEL (Z-INDEX 995)
            Header Bersih Tanpa Titik Merah, Filter Kawasan, & Daftar Kuliner
            ========================================================================= */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -35 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 sm:top-24 left-3 sm:left-5 bottom-4 sm:bottom-6 w-[360px] sm:w-[410px] max-w-[calc(100vw-24px)] z-[995] bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E2D7C7] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Top Header: Desain Bersih & Elegan */}
              <div className="p-4 border-b border-[#EAE3D6] bg-white/95">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF5EC] border border-[#E5DDD1] flex items-center justify-center shrink-0 shadow-xs text-[#2C221E]">
                      <Utensils size={20} className="text-[#2C221E]" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-outfit font-extrabold text-base sm:text-lg text-[#2C221E] m-0 tracking-tight leading-tight">
                        Radar Kuliner Jogja
                      </h2>
                      <p className="text-[11px] text-[#786B5E] m-0 mt-0.5 font-medium truncate flex items-center gap-1">
                        <span>Menemukan <strong className="text-[#2C221E] font-bold">{filteredItems.length} kuliner</strong> di</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCardId(null);
                            if (mapInstanceRef.current && activeZone.coordinates) {
                              mapInstanceRef.current.flyTo(
                                [activeZone.coordinates.lat, activeZone.coordinates.lng],
                                15.5,
                                { duration: 0.8 }
                              );
                            }
                          }}
                          className="inline-flex items-center gap-0.5 text-[#8A5D26] hover:text-[#2C221E] font-bold underline decoration-dotted cursor-pointer"
                          title={`Pindahkan kamera ke pusat ${activeZone.wilayahName.split(',')[0]}`}
                        >
                          <MapPin size={10} className="text-[#C99B52]" />
                          <span>{activeZone.wilayahName.split(',')[0]}</span>
                        </button>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidePanelOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#FAF5EC] hover:bg-[#EAE1D2] text-[#6E6053] hover:text-[#2C221E] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Lipat Panel"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>

                {/* Search Input Box */}
                <div className="relative mb-3">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A5D26]"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari gudeg, sate klatak, bakpia..."
                    className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2D7C7] text-[#2C221E] placeholder:text-[#9C8F84] focus:outline-none focus:border-[#C99B52] focus:bg-white focus:ring-2 focus:ring-[#C99B52]/20 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EAE1D2] hover:bg-[#D5C9B5] text-[#2C221E] flex items-center justify-center p-0 cursor-pointer transition-colors"
                      title="Hapus pencarian"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>

                {/* Chips Pilihan Kawasan (Klik untuk memindahkan kamera POV ke lokasi tersebut) */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {JOGJA_GPS_ZONES.map((zone) => {
                        const isSelected = zone.id === activeZone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => {
                              setSelectedZoneId(zone.id);
                              setSelectedCardId(null);
                              // POV KAMERA LANGSUNG BERPINDAH KE LOKASI KAWASAN YANG DIKLIK (MISAL: MALIOBORO)
                              if (mapInstanceRef.current && zone.coordinates) {
                                mapInstanceRef.current.flyTo(
                                  [zone.coordinates.lat, zone.coordinates.lng],
                                  15.5,
                                  { duration: 0.85 }
                                );
                              }
                            }}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#2C221E] text-[#FAF8F5] shadow-xs ring-1 ring-[#C99B52]/40 scale-105'
                                : 'bg-[#FAF8F5] text-[#5C4E43] border border-[#E5DDD1] hover:bg-[#F3ECE3] hover:text-[#2C221E]'
                            }`}
                          >
                            {zone.wilayahName.split(',')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F0EAE1]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5D26]">
                      Radius Pencarian
                    </span>
                    <div className="inline-flex items-center p-0.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD1]">
                      {[5, 10].map((km) => (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setRadiusLimitKm(km)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            radiusLimitKm === km
                              ? 'bg-[#2C221E] text-white shadow-xs'
                              : 'text-[#786B5E] hover:text-[#2C221E]'
                          }`}
                        >
                          {km} KM
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable List Tempat Kuliner */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 px-4 text-xs text-[#786B5E]">
                    Tidak ada kuliner dalam pencarian atau radius ini.
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isSelected = activeItem && activeItem.id === item.id;
                    const isExpanded = expandedCards[item.id] !== undefined ? expandedCards[item.id] : isSelected;
                    const distMeters = userLiveCoords
                      ? getHaversineMeters(userLiveCoords, item.coordinates)
                      : getHaversineMeters(wisataAnchor.coordinates, item.coordinates);
                    const distLabel =
                      distMeters !== null
                        ? formatDistanceLabel(distMeters, userLiveCoords ? 'dari Anda' : '')
                        : item.distanceFromWisata;

                    return (
                      <div
                        key={item.id}
                        id={`kuliner-card-${item.id}`}
                        onClick={() => {
                          const willSelect = !isSelected;
                          setSelectedCardId(willSelect ? item.id : null);
                          // POV KAMERA BERPINDAH KE TEMPAT TERSEBUT
                          if (mapInstanceRef.current && item.coordinates) {
                            if (willSelect) {
                              mapInstanceRef.current.flyTo(
                                [item.coordinates.lat, item.coordinates.lng],
                                16.5,
                                { duration: 0.7 }
                              );
                            } else if (activeZone?.coordinates) {
                              mapInstanceRef.current.flyTo(
                                [activeZone.coordinates.lat, activeZone.coordinates.lng],
                                15.5,
                                { duration: 0.7 }
                              );
                            }
                          }
                        }}
                        className={`p-3 rounded-2xl cursor-pointer transition-all border group ${
                          isSelected
                            ? 'bg-[#FAF6EE] border-[#C99B52] shadow-md ring-1 ring-[#C99B52]/40'
                            : 'bg-white border-[#EAE3D6] hover:border-[#C99B52] hover:bg-[#FCFAF8]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Foto Thumbnail */}
                          {item.image && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E5DDD1] bg-[#F5EFE6] shadow-2xs">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <h3 className="font-outfit font-bold text-xs sm:text-sm text-[#2C221E] leading-snug m-0 group-hover:text-[#8A5D26] transition-colors">
                                {item.name}
                              </h3>
                              <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-[#8A5D26] bg-[#FAF4E8] border border-[#EFE0C7] px-2 py-0.5 rounded-full">
                                <MapPin size={9} className="text-[#C99B52]" />
                                {distLabel}
                              </span>
                            </div>

                            {/* Badge Kategori & Label */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              {item.category && (
                                <span className="text-[9px] font-bold text-[#8A5D26] bg-[#F5EDE1] px-1.5 py-0.5 rounded-md border border-[#EFE3CF]">
                                  {item.category}
                                </span>
                              )}
                              {item.verdictLabel && (
                                <span className="text-[9px] text-[#786B5E] font-medium truncate">
                                  • {item.verdictLabel}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#786B5E] leading-relaxed line-clamp-1 mb-1">
                              {item.spotName}
                            </p>

                            {/* Jam Buka & Kisaran Harga Nyata */}
                            {(item.operatingHours || item.priceRange) && (
                              <div className="flex items-center gap-2.5 flex-wrap text-[10px] text-[#6E6053] mt-1 pt-1 border-t border-[#F0E9DF]">
                                {item.operatingHours && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock size={10} className="text-[#C99B52] shrink-0" />
                                    <span>{item.operatingHours}</span>
                                  </span>
                                )}
                                {item.priceRange && (
                                  <span className="inline-flex items-center gap-1 font-semibold text-[#8A5D26]">
                                    <Tag size={10} className="text-[#C99B52] shrink-0" />
                                    <span>{item.priceRange}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tombol Dropdown Info Lebih Lanjut */}
                        <button
                          type="button"
                          onClick={(e) => toggleCardDropdown(item.id, e)}
                          className={`w-full mt-2.5 px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-bold transition-all border cursor-pointer ${
                            isExpanded
                              ? 'bg-[#8A5D26]/12 text-[#8A5D26] border-[#8A5D26]/30'
                              : 'bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#786B5E] hover:text-[#2C221E] border-[#EFE4D0]'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Info size={12} className={isExpanded ? 'text-[#8A5D26]' : 'text-[#C99B52]'} />
                            <span>{isExpanded ? 'Tutup Info Lengkap' : 'Info Lebih Lanjut'}</span>
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#8A5D26]' : 'text-[#786B5E]'}`}
                          />
                        </button>

                        {/* Collapsible Dropdown Content */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pt-2.5 pb-1 space-y-2">
                                {/* Cita Rasa Pusaka */}
                                {item.tasteProfile && (
                                  <div className="text-[10px] text-[#5C4E43] bg-[#FAF6EE] border border-[#EFE4D0] p-2 rounded-xl">
                                    <div className="flex items-center gap-1 font-bold text-[#8A5D26] uppercase text-[9px] mb-1 tracking-wider">
                                      <Utensils size={10} />
                                      <span>Profil Cita Rasa Otentik:</span>
                                    </div>
                                    <p className="m-0 leading-relaxed text-[#5C4E43]">{item.tasteProfile}</p>
                                  </div>
                                )}

                                {/* Catatan Ulasan Lokal & Sejarah */}
                                {item.honestReview && (
                                  <div className="text-[10px] text-[#6B5E54] bg-[#F7F2E7] border border-[#EADFCB] p-2 rounded-xl">
                                    <div className="flex items-center gap-1 font-bold text-[#2C221E] text-[9px] uppercase tracking-wider mb-1">
                                      <BookOpen size={11} className="text-[#C99B52]" />
                                      <span>Catatan Sejarah & Ulasan:</span>
                                    </div>
                                    <p className="m-0 leading-relaxed text-[#6B5E54]">{item.honestReview}</p>
                                  </div>
                                )}

                                {/* Detail Alamat & Koordinat Presisi */}
                                <div className="text-[10px] text-[#786B5E] bg-[#FAF8F5] border border-[#EFE8DD] p-2 rounded-xl space-y-1">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin size={11} className="text-[#C99B52] shrink-0 mt-0.5" />
                                    <span className="leading-snug text-[#2C221E] font-medium">{item.spotName}</span>
                                  </div>
                                  {item.coordinates && (
                                    <div className="text-[9px] text-[#8A5D26] font-mono pl-4">
                                      Koordinat GPS: {item.coordinates.lat.toFixed(6)}, {item.coordinates.lng.toFixed(6)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Tombol Aksi Langsung di Dalam Kartu */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EAE3D6]/70 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCardId(item.id);
                              if (mapInstanceRef.current && item.coordinates) {
                                mapInstanceRef.current.flyTo(
                                  [item.coordinates.lat, item.coordinates.lng],
                                  16.5,
                                  { duration: 0.7 }
                                );
                              }
                            }}
                            className="text-[10px] font-bold text-[#8A5D26] hover:text-[#2C221E] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Map size={11} />
                            <span>{isSelected ? 'Terpilih di Peta' : 'Fokus di Peta'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (userLiveCoords && item.coordinates) {
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&origin=${userLiveCoords.lat},${userLiveCoords.lng}&destination=${item.coordinates.lat},${item.coordinates.lng}&travelmode=driving`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              } else {
                                const query = item.coordinates
                                  ? `${item.coordinates.lat},${item.coordinates.lng}`
                                  : `${item.name} ${item.spotName}`;
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }
                            }}
                            className="py-1 px-2.5 rounded-full bg-[#2C221E] hover:bg-[#C99B52] hover:text-[#2C221E] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Navigation size={10} />
                            <span>Petunjuk Rute</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* =========================================================================
            TOMBOL TAB BUKA PANEL SAAT PANEL DITUTUP
            ========================================================================= */}
        {!isSidePanelOpen && (
          <button
            type="button"
            onClick={() => setIsSidePanelOpen(true)}
            className="absolute top-20 sm:top-24 left-3 sm:left-5 z-[995] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-extrabold text-[#2C221E] cursor-pointer hover:bg-[#FAF8F5] border border-[#E2D7C7] hover:border-[#C99B52] transition-all"
          >
            <Utensils size={15} className="text-[#2C221E]" strokeWidth={2.2} />
            <span>Daftar Kuliner ({filteredItems.length})</span>
          </button>
        )}

        {/* =========================================================================
            FLOATING BOTTOM HIGHLIGHT CARD SAAT TEMPAT TERPILIH & PANEL TERTUTUP (CLEAN DESIGN)
            ========================================================================= */}
        <AnimatePresence>
          {activeItem && !isSidePanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 w-[min(94%,470px)] z-[998] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(44,34,30,0.18)] border border-[#EAE3D6] p-4 sm:p-5 overflow-hidden"
            >
              {/* Header: Foto + Judul + Tombol Tutup */}
              <div className="flex items-start gap-3.5 mb-3">
                {activeItem.image && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E8DFC9] bg-[#FAF6EE] shadow-xs">
                    <img
                      src={activeItem.image}
                      alt={activeItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeItem.category && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A5D26] bg-[#FAF4E8] border border-[#EFE0C7] px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C99B52]" />
                          {activeItem.category}
                        </span>
                      )}
                      {activeItem.verdictLabel && (
                        <span className="text-[10px] font-semibold text-[#786B5E]">
                          • {activeItem.verdictLabel}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCardId(null)}
                      className="w-7 h-7 rounded-full bg-[#FAF5EC] hover:bg-[#EAE1D2] text-[#6E6053] hover:text-[#2C221E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Tutup Popup"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <h3 className="font-outfit font-extrabold text-sm sm:text-base text-[#2C221E] m-0 leading-snug truncate">
                    {activeItem.name}
                  </h3>

                  <p className="text-[11px] text-[#786B5E] mt-0.5 line-clamp-1 flex items-center gap-1">
                    <MapPin size={11} className="text-[#C99B52] shrink-0" />
                    <span>{activeItem.spotName}</span>
                  </p>

                  {/* Jam Operasional & Kisaran Harga Real */}
                  {(activeItem.operatingHours || activeItem.priceRange) && (
                    <div className="flex items-center gap-2.5 text-[10px] text-[#6E6053] mt-1.5 flex-wrap">
                      {activeItem.operatingHours && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#EFE6D6]">
                          <Clock size={10} className="text-[#C99B52]" />
                          <span>{activeItem.operatingHours}</span>
                        </span>
                      )}
                      {activeItem.priceRange && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#EFE6D6] font-semibold text-[#8A5D26]">
                          <Tag size={10} className="text-[#C99B52]" />
                          <span>{activeItem.priceRange}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Deskripsi & Cita Rasa */}
              {activeItem.tasteProfile && (
                <div className="text-[11px] text-[#5C4E43] bg-[#FAF7F2] border border-[#EFEBE4] px-3 py-2 rounded-2xl mb-2.5 leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-[#8A5D26] mb-0.5 text-[10px]">
                    <Utensils size={11} />
                    <span>Profil Cita Rasa Otentik:</span>
                  </div>
                  <p className="m-0">{activeItem.tasteProfile}</p>
                </div>
              )}

              {/* Catatan Sejarah & Ulasan */}
              {activeItem.honestReview && (
                <div className="text-[11px] text-[#6B5E54] bg-[#F7F2E7] border border-[#EADFCB] px-3 py-2 rounded-2xl mb-3 leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-[#2C221E] text-[10px] mb-0.5">
                    <BookOpen size={11} className="text-[#C99B52]" />
                    <span>Catatan Sejarah & Ulasan:</span>
                  </div>
                  <p className="m-0">{activeItem.honestReview}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F2ECE3]">
                <button
                  type="button"
                  onClick={() => {
                    if (userLiveCoords && activeItem.coordinates) {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${userLiveCoords.lat},${userLiveCoords.lng}&destination=${activeItem.coordinates.lat},${activeItem.coordinates.lng}&travelmode=driving`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    } else {
                      const query = activeItem.coordinates
                        ? `${activeItem.coordinates.lat},${activeItem.coordinates.lng}`
                        : `${activeItem.name} ${activeItem.spotName}`;
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#2C221E] hover:bg-[#C99B52] hover:text-[#2C221E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Navigation size={13} />
                  <span>Petunjuk Arah Google Maps</span>
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeItem.coordinates?.lat},${activeItem.coordinates?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-full border border-[#E2D7C7] hover:bg-[#FAF6EE] text-xs font-bold text-[#786B5E] hover:text-[#2C221E] transition-colors"
                >
                  Buka Peta ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
