import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Navigation, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JOGJA_GPS_ZONES } from '../data/culturalData';

// Batas Geografis Ketat (Geo-Fence Lock) Provinsi Daerah Istimewa Yogyakarta
const JOGJA_MAX_BOUNDS = [
  [-8.22, 110.00], // Barat Daya (Pesisir Selatan Kulon Progo - Gunungkidul)
  [-7.52, 110.86]  // Timur Laut (Puncak Gunung Merapi - Prambanan Timur)
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

  // Refs untuk Peta Interaktif Leaflet + Google Tiles (Terkunci 100% di D.I. Yogyakarta)
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

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

  // Pilih otomatis kartu pertama saat wilayah, radius, atau filter berubah
  useEffect(() => {
    if (filteredItems.length > 0) {
      const exists = filteredItems.some((i) => i.id === selectedCardId);
      if (!exists) {
        setSelectedCardId(filteredItems[0].id);
      }
    }
  }, [selectedZoneId, searchQuery, radiusLimitKm]);

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
    filteredItems.find((i) => i.id === selectedCardId) ||
    filteredItems[0] ||
    activeZone.kulinerList[0];

  // Inisialisasi Peta Google Maps Road Tiles Terkunci 100% di Wilayah D.I. Yogyakarta
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = activeItem?.coordinates || activeZone.coordinates;
      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: 14,
        minZoom: 11,
        maxZoom: 19,
        maxBounds: JOGJA_MAX_BOUNDS,
        maxBoundsViscosity: 1.0, // Terkunci 100% di wilayah D.I. Yogyakarta
        zoomControl: true
      });

      // Esri World Street Map: Peta jalan resmi jernih, estetik hangat, bebas watermark & tanpa API key
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &bull; Peta Pusaka & Kuliner D.I. Yogyakarta'
        }
      ).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size beberapa kali untuk memastikan render mulus setelah animasi modal
      [50, 150, 300, 600, 1000].forEach((delay) => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });

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
          layerGroupRef.current = null;
        }
      };
    }
  }, [isOpen]);

  // Render Track Point Wisata Utama + Lingkaran Radius + Pin Kuliner Terdekat
  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    group.clearLayers();

    const anchorLatLng = [
      wisataAnchor.coordinates.lat,
      wisataAnchor.coordinates.lng
    ];

    // 0. Jika Pengguna Sedang Berada di Dalam Wilayah D.I. Yogyakarta, Tampilkan Titik GPS Asli
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
            color: '#9E1C64',
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
              📍 Posisi Panjenengan (±${userLiveCoords.accuracy || 15} m)
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
            ${userLiveAddress ? `<div style="font-size:11px;color:#2C221E;margin-top:4px;">📍 ${userLiveAddress}</div>` : ''}
          </div>`
        )
        .addTo(group);
    }

    // Marker Setiap Tempat Rekomendasi Kuliner
    filteredItems.forEach((item) => {
      if (!item.coordinates) return;
      const isSelected = activeItem && activeItem.id === item.id;

      const markerHtml = isSelected
        ? `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
            <div style="background:#2C221E;color:#FAF8F5;padding:5px 12px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 8px 24px rgba(44,34,30,0.3);border:1.5px solid #C99B52;margin-bottom:4px;display:flex;align-items:center;gap:4px;">
              <span style="color:#E8B86D;">✦</span>
              <span>${item.name}</span>
            </div>
            <svg width="34" height="42" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 14px rgba(158,28,100,0.45));">
              <path d="M18 0C8.06 0 0 8.06 0 18C0 30.25 16.1 42.7 17.21 43.54C17.68 43.89 18.32 43.89 18.79 43.54C19.9 42.7 36 30.25 36 18C36 8.06 27.94 0 18 0Z" fill="#9E1C64"/>
              <circle cx="18" cy="18" r="8" fill="#C99B52"/>
              <circle cx="18" cy="18" r="4.5" fill="#FAF8F5"/>
            </svg>
          </div>
        `
        : `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);cursor:pointer;">
            <div style="background:#FAF8F5;color:#2C221E;padding:4px 10px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 4px 14px rgba(44,34,30,0.12);border:1.5px solid #C99B52;">
              <span>${item.name.split('(')[0].trim()}</span>
            </div>
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
      });

      group.addLayer(marker);
    });

    // Fokuskan Kamera Peta ke Tempat yang Sedang Dipilih
    map.setMaxBounds(JOGJA_MAX_BOUNDS);
    if (activeItem?.coordinates) {
      map.flyTo(
        [activeItem.coordinates.lat, activeItem.coordinates.lng],
        15,
        { duration: 0.65 }
      );
    } else {
      map.flyTo(anchorLatLng, 15, { duration: 0.65 });
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99990,
          backgroundColor: '#FAF8F5',
          color: '#2C221E',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* =========================================================================
            MAIN 2-COLUMN SPLIT LAYOUT (GPS KHUSUS JOGJA + RADIUS 5-10 KM)
            ========================================================================= */}
        <div
          style={{
            maxWidth: '1420px',
            margin: '0 auto',
            padding: '6.2rem clamp(1.5rem, 4vw, 3.5rem) 4rem clamp(1.5rem, 4vw, 3.5rem)'
          }}
        >
          {/* Bar Pilihan Wilayah Wisata & Radius */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2.25rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #EAE3D6'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#8A5D26',
                  marginRight: '0.25rem',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>ꦏꦮꦱꦤ꧀</span>
                <span>• Kawasan:</span>
              </span>
              {JOGJA_GPS_ZONES.map((zone) => {
                const isSelected = zone.id === activeZone.id;
                const distInJogja =
                  userLiveCoords && zone.wisataAnchor?.coordinates
                    ? getHaversineMeters(userLiveCoords, zone.wisataAnchor.coordinates)
                    : null;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    style={{
                      padding: '0.48rem 1rem',
                      borderRadius: '9999px',
                      backgroundColor: isSelected ? '#2C221E' : '#FFFFFF',
                      color: isSelected ? '#FAF8F5' : '#5C4E43',
                      border: isSelected ? '1.5px solid #C99B52' : '1px solid #E5DDD1',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(44, 34, 30, 0.16)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {zone.wilayahName.split(',')[0]}
                    {distInJogja !== null ? ` (${formatDistanceLabel(distInJogja)})` : ''}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[5, 10].map((km) => (
                <button
                  key={km}
                  onClick={() => setRadiusLimitKm(km)}
                  style={{
                    padding: '0.42rem 0.95rem',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    border: radiusLimitKm === km ? '1.5px solid #9E1C64' : '1px solid #E5DDD1',
                    backgroundColor: radiusLimitKm === km ? '#9E1C64' : '#FFFFFF',
                    color: radiusLimitKm === km ? '#FFFFFF' : '#786B5E',
                    boxShadow: radiusLimitKm === km ? '0 4px 14px rgba(158, 28, 100, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Radius {km} KM
                </button>
              ))}

              <button
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '9999px',
                  backgroundColor: '#2C221E',
                  color: '#FAF8F5',
                  border: '1.5px solid #C99B52',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(44, 34, 30, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={14} />
                <span>Tutup</span>
              </button>
            </div>
          </div>

          {/* 2-Column Grid: Left Store List + Right Rounded Map */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2.75rem',
              alignItems: 'start'
            }}
          >
            {/* =====================================================================
                LEFT COLUMN: TITLE, RESULTS COUNT, SEARCH & CARDS
                ===================================================================== */}
            <div style={{ maxWidth: '540px', width: '100%' }}>
              {/* Badge Khas Jogja */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#F3ECE3',
                  border: '1px solid #E2D7C7',
                  color: '#8A5D26',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem'
                }}
              >
                <img
                  src="/images/icon_culinary.svg"
                  alt="Kuliner Jogja"
                  style={{ width: '15px', height: '15px' }}
                />
                <span>ꦏꦸꦭꦶꦤꦺꦂ ꦔꦪꦺꦴꦒꦾꦏꦂꦠ • RADAR KULINER PUSAKA JOGJA</span>
              </div>

              <h1
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(2.3rem, 3.8vw, 3.1rem)',
                  fontWeight: 800,
                  color: '#2C221E',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.1,
                  margin: '0 0 0.4rem 0'
                }}
              >
                Cita Rasa & Kuliner Khas Jogja
              </h1>

              <div
                style={{
                  fontSize: '0.92rem',
                  color: '#6B5E54',
                  lineHeight: 1.5,
                  marginBottom: '1rem'
                }}
              >
                <span style={{ color: '#8A5D26', fontWeight: 600 }}>ꦲꦺꦴꦭꦺꦃꦲꦺꦴꦭꦺꦃ</span> • Angkringan legendaris, gudeg resep keraton, dan hidangan pusaka autentik berjarak dekat.
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.88rem',
                  color: '#6B5E54',
                  marginBottom: '1.25rem'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#C99B52'
                  }}
                />
                <span>
                  Menemukan <strong style={{ color: '#2C221E', fontWeight: 800 }}>{filteredItems.length} kuliner pilihan</strong> di sekitar{' '}
                  <strong style={{ color: '#2C221E' }}>{activeZone.wilayahName.split(',')[0]}</strong>
                </span>
              </div>

              {/* Search Input Box */}
              <div
                style={{
                  position: 'relative',
                  marginBottom: '1.5rem'
                }}
              >
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8A5D26'
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari gudeg, sate klatak, kopi joss, bakpia..."
                  aria-label="Cari tempat atau kuliner khas Jogja"
                  style={{
                    width: '100%',
                    padding: '0.88rem 1.15rem 0.88rem 2.85rem',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2D7C7',
                    fontSize: '0.9rem',
                    color: '#2C221E',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(44, 34, 30, 0.04)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#C99B52')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2D7C7')}
                />
              </div>

              {/* Vertical List of Store / Place Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {filteredItems.map((item) => {
                  const isSelected = activeItem && activeItem.id === item.id;
                  const metersFromWisata = getHaversineMeters(
                    wisataAnchor.coordinates,
                    item.coordinates
                  );
                  const metersFromUserGps = userLiveCoords
                    ? getHaversineMeters(userLiveCoords, item.coordinates)
                    : null;
                  const realDistanceLabel =
                    metersFromUserGps !== null
                      ? formatDistanceLabel(metersFromUserGps, 'dari posisi Anda')
                      : formatDistanceLabel(metersFromWisata, `dari ${activeZone.wilayahName.split(',')[0]}`) ||
                        item.distanceFromWisata;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCardId(item.id)}
                      style={{
                        borderRadius: '22px',
                        padding: '1.45rem 1.55rem',
                        backgroundColor: '#FFFFFF',
                        border: isSelected ? '1.5px solid #C99B52' : '1px solid #EAE3D6',
                        boxShadow: isSelected
                          ? '0 12px 32px rgba(44, 34, 30, 0.09)'
                          : '0 4px 14px rgba(44, 34, 30, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.22s ease',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          marginBottom: '0.35rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                            {item.trackPointCode && (
                              <span
                                style={{
                                  backgroundColor: '#F5EFE6',
                                  color: '#8A5D26',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px'
                                }}
                              >
                                {item.trackPointCode}
                              </span>
                            )}
                            <h3
                              style={{
                                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                                fontSize: '1.18rem',
                                fontWeight: 700,
                                color: '#2C221E',
                                margin: 0,
                                lineHeight: 1.25
                              }}
                            >
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            backgroundColor: '#FDF2F7',
                            color: '#9E1C64',
                            border: '1px solid #F6D5E5',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '0.28rem 0.65rem',
                            borderRadius: '9999px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <MapPin size={11} />
                          {realDistanceLabel}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '0.84rem',
                          color: '#786B5E',
                          marginBottom: '0.4rem',
                          lineHeight: 1.45
                        }}
                      >
                        {item.spotName}
                      </div>

                      {/* Profil Rasa & Ulasan Otentik (Khas Jogja) */}
                      {item.tasteProfile && (
                        <div
                          style={{
                            marginTop: '0.65rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '12px',
                            backgroundColor: '#FAF6EE',
                            border: '1px solid #EFE4D0',
                            fontSize: '0.82rem',
                            color: '#5C4E43',
                            lineHeight: 1.45
                          }}
                        >
                          <strong
                            style={{
                              color: '#8A5D26',
                              display: 'block',
                              fontSize: '0.72rem',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              marginBottom: '0.2rem'
                            }}
                          >
                            ꦕꦶꦠꦫꦱ • Cita Rasa Pusaka
                          </strong>
                          {item.tasteProfile}
                        </div>
                      )}

                      {item.verdictLabel && (
                        <div style={{ marginTop: '0.55rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#8A5D26',
                              backgroundColor: '#F5EFE6',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px'
                            }}
                          >
                            ✓ {item.verdictLabel}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          height: '1px',
                          backgroundColor: '#EAE3D6',
                          margin: '0.95rem 0'
                        }}
                      />

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${item.coordinates?.lat},${item.coordinates?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#8A5D26',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <span>Lihat detail lokasi di Google Maps</span>
                      </a>

                      {isSelected && (
                        <button
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
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  query
                                )}`,
                                '_blank',
                                'noopener,noreferrer'
                              );
                            }
                          }}
                          style={{
                            marginTop: '1rem',
                            width: '100%',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '9999px',
                            backgroundColor: '#2C221E',
                            color: '#FAF8F5',
                            border: '1.5px solid #C99B52',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 6px 18px rgba(44, 34, 30, 0.16)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#C99B52';
                            e.currentTarget.style.color = '#2C221E';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2C221E';
                            e.currentTarget.style.color = '#FAF8F5';
                          }}
                        >
                          <Navigation size={15} />
                          <span>
                            {userLiveCoords
                              ? `Buka Rute Menuju Lokasi (${formatDistanceLabel(metersFromUserGps)})`
                              : 'Buka Petunjuk Arah di Google Maps'}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =====================================================================
                RIGHT COLUMN: CLEAN ROUNDED GOOGLE MAP (DENGAN AKSEN KHAS JOGJA)
                ===================================================================== */}
            <div
              style={{
                position: 'sticky',
                top: '5.5rem',
                width: '100%',
                height: 'clamp(520px, calc(100vh - 130px), 780px)',
                borderRadius: '30px',
                overflow: 'hidden',
                border: '1.5px solid #E5DDD1',
                boxShadow: '0 14px 44px rgba(44, 34, 30, 0.08)',
                backgroundColor: '#FAF8F5'
              }}
            >
              {/* Badge Terkunci Jogja di Pojok Peta */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 1000,
                  backgroundColor: 'rgba(44, 34, 30, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#E8B86D',
                  padding: '0.42rem 0.9rem',
                  borderRadius: '9999px',
                  border: '1px solid #C99B52',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
              >
                <span>ꦔꦪꦺꦴꦒꦾꦏꦂꦠ</span>
                <span>• Radar D.I. Yogyakarta</span>
              </div>

              <div
                ref={mapContainerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FAF8F5'
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
