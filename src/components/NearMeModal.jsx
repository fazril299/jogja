import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Navigation,
  X,
  ChevronDown,
  ChevronLeft,
  Layers,
  Compass,
  Utensils,
  Clock,
  Tag,
  Info,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Heart,
  Calendar
} from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JOGJA_GPS_ZONES } from '../data/culturalData';
import GoFoodBadge from './GoFoodBadge';
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

// Koordinat Titik Nol Kilometer Yogyakarta (Acuan default jarak ketika GPS belum aktif)
const TITIK_NOL_YOGYAKARTA = { lat: -7.8013, lng: 110.3647 };

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

// Rekomendasi Menu Khas Otentik Yogyakarta untuk Maskot Jojo di Radar Kuliner
function getSignatureFood(item) {
  if (!item) return 'Gudeg nangka legit & aneka kuliner legendaris Jogja!';

  const mapping = {
    'kopi-joss-lik-man': 'Kopi Joss arang & Sego Kucing',
    'lumpia-samijaya': 'Lumpia Basah / Goreng Samijaya',
    'gudeg-mbok-lindu': 'Gudeg Basah Mbok Lindu Sosrowijayan',
    'oseng-mercon-bu-narti': 'Oseng-Oseng Mercon Pedas Gurih',
    'gudeg-yu-djum': 'Gudeg Kering Sentra Wijilan 167',
    'bale-raos': 'Bebek Suwar-Suwir & Masakan Sultan',
    'brongkos-handayani': 'Brongkos Daging Sapi Kuah Kluwek',
    'bakmi-pak-pele': 'Bakmi Jawa Godhog / Goreng Pak Pele',
    'bakmi-mbah-gito': 'Bakmi Jawa Anglo Tradisional Mbah Gito',
    'kipo-bu-djito': 'Kue Kipo Pusaka Asli Kotagede',
    'tempo-gelato': 'Gelato Artisan Rempah & Buah Tropis',
    'sate-karang': 'Sate Sapi & Lontong Sayur Lodeh',
    'jadah-tempe': 'Jadah Tempe Gurih Mbah Carik Kaliurang',
    'kopi-klotok': 'Kopi Klotok & Pisang Goreng Crispy',
    'jejamuran': 'Sate Jamur & Tongseng Jamur Spesial',
    'saoto-bathok': 'Saoto Bathok Daging Batok Kelapa',
    'sate-klathak-pak-pong': 'Sate Klathak Jeruji Besi Pleret',
    'mangut-lele': 'Mangut Lele Asap Dapur Mbok Marto',
    'mie-lethek': 'Bakmi Lethek Singkong Tradisional',
    'ingkung-kuali': 'Ingkung Ayam Kampung Kuali Tanah Liat',
    'ikan-bakar-depok': 'Ikan Bakar Segar Tangkapan Pantai Depok',
    'seafood-bu-narti': 'Seafood Cumi & Kepiting Saus Padang',
    'bukit-paralayang': 'Wedang Jahe Rempah & Mendoan Hangat',
    'bakmi-soto-mbok-nem': 'Soto Ayam Kampung & Bakmi Jawa'
  };

  return mapping[item.id] || `${item.name} dengan cita rasa khas tradisi Jogja`;
}

// Konfigurasi Penyedia Peta Satelit & Jalan Raya HD
function getTileLayerConfig(layerType) {
  if (layerType === 'satellite') {
    return {
      url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      maxNativeZoom: 20,
      attribution: '&copy; Google Maps &bull; Citra Satelit Hybrid HD'
    };
  }
  if (layerType === 'osm-standard') {
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
  onUpdateUserCoords,
  isGpsLoading,
  eventTarget = null,
  onClearEventTarget
}) {
  const [selectedZoneId, setSelectedZoneId] = useState(
    autoDetectedZoneId || JOGJA_GPS_ZONES[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusLimitKm, setRadiusLimitKm] = useState(10); // Radius rekomendasi: 5 KM atau 10 KM
  const [onlyGofoodFilter, setOnlyGofoodFilter] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [activeNavRouteId, setActiveNavRouteId] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistanceMeters, setRouteDistanceMeters] = useState(null);
  const [routeDurationMinutes, setRouteDurationMinutes] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [showGpsRequiredPrompt, setShowGpsRequiredPrompt] = useState(false);

  const toggleCardDropdown = (id, e) => {
    e?.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const [activeMapLayer, setActiveMapLayer] = useState('google-streets'); // Default: Google Maps HD Super Cepat
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true); // Panel floating drawer di dalam peta
  const [isMobilePopupCollapsed, setIsMobilePopupCollapsed] = useState(false); // Mobile: popup sisi atas (bisa ditutup/buka)
  const [localUserCoords, setLocalUserCoords] = useState(null); // Lokasi live instan dari browser
  const [isGpsRequesting, setIsGpsRequesting] = useState(false); // Status loading saat dialog izin browser muncul
  const [gpsErrorMessage, setGpsErrorMessage] = useState(''); // Pesan error verifikasi GPS

  // Otomatis buka popup mobile saat marker atau item kuliner dipilih
  useEffect(() => {
    if (selectedCardId) {
      setIsMobilePopupCollapsed(false);
    }
  }, [selectedCardId]);

  // Wishlist & Auth integration
  const { isFavorite, toggleFavorite } = useCultureBook();
  const { requireAuth } = useAuth();

  const handleCulinaryWishlistToggle = (e, item) => {
    e.stopPropagation();
    requireAuth(
      () => {
        toggleFavorite(item.id);
      },
      {
        benefitType: 'wishlist',
        title: 'Simpan ke Wishlist',
        description: `Masuk ke akun Anda untuk menyimpan ${item.name} ke Wishlist pribadi Anda.`
      }
    );
  };
  const initialCameraSetRef = useRef(false);
  const lastCenteredNavRouteIdRef = useRef(null);
  const lastCenteredCardIdRef = useRef(null);

  // Status ketersediaan sensor GPS pengguna
  const effectiveUserCoords = localUserCoords || userLiveCoords;
  const hasUserGps = !!(effectiveUserCoords && typeof effectiveUserCoords.lat === 'number');
  const isUserInJogja = effectiveUserCoords && effectiveUserCoords.inJogja !== false;
  const currentReferenceCoord = (hasUserGps && isUserInJogja) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;

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

  useEffect(() => {
    if (eventTarget) {
      setSelectedCardId(eventTarget.id);
      setShowGpsRequiredPrompt(false);
      setIsSidePanelOpen(true);
    }
  }, [eventTarget]);

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

  // Filter & Urutkan tempat berdasarkan jarak terdekat (dari User jika GPS aktif, atau dari Titik 0 KM jika GPS mati)
  const filteredItems = useMemo(() => {
    return activeZone.kulinerList
      .map((item) => {
        const distMeters = getHaversineMeters(currentReferenceCoord, item.coordinates);
        return {
          ...item,
          realDistanceMeters: distMeters,
          distanceLabel: hasUserGps
            ? formatDistanceLabel(distMeters, 'dari Anda')
            : formatDistanceLabel(distMeters, 'dari Titik Nol')
        };
      })
      .filter((item) => {
        if (onlyGofoodFilter && !item.hasGofood) return false;
        const matchesSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.trackPointCode &&
            item.trackPointCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.tasteProfile &&
            item.tasteProfile.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRadius =
          item.realDistanceMeters === null || item.realDistanceMeters <= radiusLimitKm * 1000;

        return matchesSearch && matchesRadius;
      })
      .sort((a, b) => {
        // 1. Prioritas Utama: Tempat yang punya GoFood otomatis muncul di urutan paling atas
        if (a.hasGofood && !b.hasGofood) return -1;
        if (!a.hasGofood && b.hasGofood) return 1;
        // 2. Dalam kelompok yang sama, urutkan berdasarkan jarak terdekat
        return (a.realDistanceMeters || 0) - (b.realDistanceMeters || 0);
      });
  }, [activeZone, currentReferenceCoord, hasUserGps, searchQuery, radiusLimitKm, onlyGofoodFilter]);

  const activeItem = useMemo(() => {
    if (eventTarget && selectedCardId === eventTarget.id) {
      const origin = (hasUserGps && effectiveUserCoords) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;
      const distMeters = eventTarget.coordinates
        ? getHaversineMeters(origin, eventTarget.coordinates)
        : null;
      return {
        id: eventTarget.id,
        name: eventTarget.name,
        category: `Acara Budaya • ${eventTarget.category}`,
        spotName: `${eventTarget.location}, ${eventTarget.district}`,
        locationAddress: `${eventTarget.location}, ${eventTarget.district}, D.I. Yogyakarta`,
        coordinates: eventTarget.coordinates,
        image: eventTarget.image,
        operatingHours: eventTarget.time,
        priceRange: 'Sesuai Ketentuan Acara',
        verdictLabel: 'Agenda Resmi CoE DIY',
        realDistanceMeters: distMeters,
        distanceLabel: hasUserGps
          ? formatDistanceLabel(distMeters, 'dari Anda')
          : formatDistanceLabel(distMeters, 'dari Titik Nol'),
        description: eventTarget.description,
        isCulturalEvent: true,
        dateFull: eventTarget.dateFull,
        shortTip: eventTarget.shortTip
      };
    }
    return activeZone.kulinerList.find((i) => i.id === selectedCardId) || null;
  }, [activeZone, selectedCardId, eventTarget, effectiveUserCoords, hasUserGps]);

  const activeNavTarget = useMemo(() => {
    if (!activeNavRouteId) return null;
    if (eventTarget && activeNavRouteId === eventTarget.id) {
      return {
        id: eventTarget.id,
        name: eventTarget.name,
        coordinates: eventTarget.coordinates
      };
    }
    return activeZone.kulinerList.find((item) => item.id === activeNavRouteId) || null;
  }, [activeNavRouteId, activeZone, eventTarget]);

  const navDistMeters = useMemo(() => {
    if (!activeNavTarget || !activeNavTarget.coordinates) return null;
    const origin = (hasUserGps && effectiveUserCoords) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;
    return getHaversineMeters(origin, activeNavTarget.coordinates);
  }, [activeNavTarget, effectiveUserCoords, hasUserGps]);

  const navEstMinutes = useMemo(() => {
    if (!navDistMeters) return 5;
    return Math.max(1, Math.round(navDistMeters / 80)); // Kecepatan jalan santai ~80 m/menit
  }, [navDistMeters]);

  // Fetch rute jalur jalan raya sebenarnya dari OSRM (Open Source Routing Machine)
  useEffect(() => {
    if (!activeNavTarget?.coordinates) {
      setRouteCoordinates([]);
      setRouteDistanceMeters(null);
      setRouteDurationMinutes(null);
      setIsRouteLoading(false);
      return;
    }

    const origin = (hasUserGps && effectiveUserCoords) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;
    const target = activeNavTarget.coordinates;

    let isMounted = true;
    setIsRouteLoading(true);

    const osrmUrl = "https://router.project-osrm.org/route/v1/driving/" + origin.lng + "," + origin.lat + ";" + target.lng + "," + target.lat + "?overview=full&geometries=geojson";

    fetch(osrmUrl)
      .then((res) => {
        if (!res.ok) throw new Error("OSRM response status " + res.status);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.code === "Ok" && data.routes && data.routes[0]) {
          const route = data.routes[0];
          // GeoJSON OSRM: [lng, lat] -> Leaflet format: [lat, lng]
          const latLngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRouteCoordinates(latLngs);
          const realMeters = Math.round(route.distance);
          setRouteDistanceMeters(realMeters);
          // Estimasi waktu jalan kaki: jarak rute / ~75 m/menit (~4.5 km/jam)
          setRouteDurationMinutes(Math.max(1, Math.round(realMeters / 75)));
        } else {
          throw new Error("OSRM did not return valid routes");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("[NearMeModal] Fallback ke jalur lurus:", err);
        setRouteCoordinates([
          [origin.lat, origin.lng],
          [target.lat, target.lng]
        ]);
        const straightMeters = getHaversineMeters(origin, target);
        setRouteDistanceMeters(straightMeters);
        setRouteDurationMinutes(Math.max(1, Math.round(straightMeters / 75)));
      })
      .finally(() => {
        if (isMounted) setIsRouteLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeNavTarget, effectiveUserCoords, hasUserGps]);

  // Helper mulai rute default dari Titik Nol KM Yogyakarta
  const handleStartRouteFromTitikNol = (target = activeItem) => {
    setShowGpsRequiredPrompt(false);
    setGpsErrorMessage('');
    if (target && target.id) {
      setActiveNavRouteId(target.id);
      setIsMobilePopupCollapsed(true);
      if (mapInstanceRef.current && target.coordinates) {
        mapInstanceRef.current.fitBounds(
          [
            [TITIK_NOL_YOGYAKARTA.lat, TITIK_NOL_YOGYAKARTA.lng],
            [target.coordinates.lat, target.coordinates.lng]
          ],
          { padding: [60, 60], maxZoom: 17 }
        );
      }
    }
  };

  // Handler tombol "Nyalakan GPS": Meminta persetujuan izin akses lokasi resmi dari browser
  const handleRequestEnableGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsErrorMessage('Sensor lokasi GPS tidak didukung di browser ini.');
      return;
    }

    if (window.isSecureContext === false) {
      setGpsErrorMessage(
        'Akses GPS diblokir oleh browser karena situs dibuka via HTTP tanpa SSL. Silakan gunakan "Rute dari Titik Nol", atau buka via HTTPS.'
      );
      return;
    }

    setIsGpsRequesting(true);
    setGpsErrorMessage('');

    // Periksa status izin jika browser mendukung Permissions API
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'denied') {
          setIsGpsRequesting(false);
          setGpsErrorMessage(
            'Izin lokasi diblokir di browser. Ketuk ikon gembok di samping alamat web (URL), lalu ubah izin Lokasi menjadi "Izinkan".'
          );
        }
      }).catch(() => {});
    }

    const handlePosSuccess = (pos) => {
      setIsGpsRequesting(false);
      setShowGpsRequiredPrompt(false);
      setGpsErrorMessage('');

      const { latitude, longitude, accuracy } = pos.coords;
      const inJogja = latitude >= -8.22 && latitude <= -7.52 && longitude >= 110.00 && longitude <= 110.86;

      const newFix = {
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy || 0),
        inJogja: inJogja,
        timestamp: new Date(pos.timestamp || Date.now()).toLocaleTimeString('id-ID')
      };

      setLocalUserCoords(newFix);

      if (onUpdateUserCoords) {
        onUpdateUserCoords(pos);
      }

      // Validasi Lokasi: Rute GPS HANYA bisa digunakan jika pengguna berada di dalam wilayah Jogja
      if (!inJogja) {
        setShowGpsRequiredPrompt(true);
        setGpsErrorMessage(
          'Anda berada di luar wilayah Jogja, rute hanya dapat digunakan jika anda berada didalam wilayah jogja.'
        );
        return;
      }

      // Jika berada di dalam wilayah Jogja, mulai rute dari GPS
      setShowGpsRequiredPrompt(false);
      setGpsErrorMessage('');

      const target = activeItem;
      if (target && target.id) {
        lastCenteredNavRouteIdRef.current = null;
        setActiveNavRouteId(target.id);
        setIsMobilePopupCollapsed(true);

        const originCoords = [latitude, longitude];

        if (mapInstanceRef.current && target.coordinates) {
          mapInstanceRef.current.fitBounds(
            [
              originCoords,
              [target.coordinates.lat, target.coordinates.lng]
            ],
            { padding: [60, 60], maxZoom: 17 }
          );
        }
      }
    };

    const handlePosError = (err) => {
      setIsGpsRequesting(false);
      console.warn('GPS Request error:', err);
      let msg = 'Lokasi GPS belum dapat dibaca.';
      if (err.code === 1) {
        msg = 'Izin lokasi belum diberikan di browser. Pastikan Anda menekan "Izinkan" saat browser memunculkan pop-up izin, atau ketuk ikon gembok di address bar browser.';
      } else if (err.code === 2) {
        msg = 'Sensor lokasi perangkat tidak aktif. Pastikan fitur Lokasi / GPS di menu setelan HP Anda sudah menyala.';
      } else if (err.code === 3) {
        msg = 'Waktu pencarian sinyal GPS habis. Coba tekan "Nyalakan GPS" lagi atau gunakan "Rute dari Titik Nol".';
      }
      setGpsErrorMessage(msg);
    };

    // Beri batas waktu 15 detik agar pengguna leluasa melihat pop-up native browser dan menekan "Izinkan"
    navigator.geolocation.getCurrentPosition(
      handlePosSuccess,
      (errHigh) => {
        // Jika error kode 1 (PERMISSION_DENIED), jangan panggil ulang karena pengguna sudah menolak
        if (errHigh.code === 1) {
          handlePosError(errHigh);
          return;
        }

        console.warn('Percobaan 1 (high accuracy) timeout/gagal, mencoba mode jaringan (low accuracy):', errHigh);
        navigator.geolocation.getCurrentPosition(
          handlePosSuccess,
          handlePosError,
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  // Handler klik Petunjuk Rute: Jika belum ada GPS, munculkan verifikasi pilihan GPS vs Titik 0
  const handleStartRoute = (item) => {
    if (!item) return;

    lastCenteredNavRouteIdRef.current = null;

    // 1. Jika pengguna sudah memiliki sensor GPS aktif
    if (hasUserGps && effectiveUserCoords) {
      // Validasi Lokasi: Rute GPS HANYA bisa digunakan jika berada di dalam wilayah Jogja
      if (!isUserInJogja) {
        setShowGpsRequiredPrompt(true);
        setGpsErrorMessage(
          'Anda berada di luar wilayah Jogja, rute hanya dapat digunakan jika anda berada didalam wilayah jogja.'
        );
        return;
      }

      setShowGpsRequiredPrompt(false);
      setGpsErrorMessage('');
      setActiveNavRouteId(item.id);
      setIsMobilePopupCollapsed(true);

      const originCoords = [effectiveUserCoords.lat, effectiveUserCoords.lng];

      if (mapInstanceRef.current && item.coordinates) {
        mapInstanceRef.current.fitBounds(
          [
            originCoords,
            [item.coordinates.lat, item.coordinates.lng]
          ],
          { padding: [60, 60], maxZoom: 17 }
        );
      }
      return;
    }

    // 2. Jika GPS belum aktif: Selalu tampilkan opsi verifikasi (Nyalakan GPS atau Titik Nol)
    setGpsErrorMessage('');
    setShowGpsRequiredPrompt(true);
  };

  const handleEndRoute = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveNavRouteId(null);
    setRouteCoordinates([]);
    setRouteDistanceMeters(null);
    setRouteDurationMinutes(null);
    setIsRouteLoading(false);
  };

  // Tutup dengan tombol ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Kunci scroll body & documentElement untuk menghilangkan scrollbar dan scroll hantu di halaman kuliner
  // Scroll lock is handled centrally by App.jsx

  // Inisialisasi Peta Leaflet Berpusat di Kota Yogyakarta
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

        // Layer Tile Basemap HD (Terkunci hanya unduh tile area Yogyakarta, hemat data & memori)
        const tileCfg = getTileLayerConfig(activeMapLayer);
        const tileLyr = L.tileLayer(tileCfg.url, {
          bounds: JOGJA_MAX_BOUNDS,
          maxZoom: tileCfg.maxZoom,
          maxNativeZoom: tileCfg.maxNativeZoom,
          subdomains: tileCfg.subdomains,
          attribution: tileCfg.attribution,
          updateWhenIdle: true,
          updateWhenZooming: false,
          keepBuffer: 2
        });

        tileLyr.addTo(map);
        tileLayerRef.current = tileLyr;

        // Layer Boundary Khusus Kota Yogyakarta
        const boundaryGroup = L.layerGroup().addTo(map);
        boundaryLayerRef.current = boundaryGroup;

        // 1. Garis Batas Merah Keliling Resmi Kota Yogyakarta
        L.polygon(KOTA_YOGYAKARTA_OUTLINE, {
          color: '#E53935',
          weight: 3.5,
          opacity: 0.95,
          fillColor: '#FFEBEE',
          fillOpacity: 0.04,
          lineJoin: 'round',
          lineCap: 'round',
          interactive: false
        }).addTo(boundaryGroup);

        // 2. Garis Batas 13 Kemantren Dalam Kota Yogyakarta
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
      bounds: JOGJA_MAX_BOUNDS,
      maxZoom: tileCfg.maxZoom,
      maxNativeZoom: tileCfg.maxNativeZoom,
      subdomains: tileCfg.subdomains,
      attribution: tileCfg.attribution,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2
    });

    newTile.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [activeMapLayer]);

  // Render Track Point Wisata Utama + Lingkaran Radius + Pin Kuliner Terdekat + Rute Live
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

    // 1. Posisi Pengguna / GPS & Titik Nol KM Jogja
    if (effectiveUserCoords && typeof effectiveUserCoords.lat === 'number') {
      const userLatLng = [effectiveUserCoords.lat, effectiveUserCoords.lng];
      const accRadius = Math.max(effectiveUserCoords.accuracy || 25, 18);

      L.circle(userLatLng, {
        radius: accRadius,
        color: '#2563EB',
        weight: 1.5,
        opacity: 0.6,
        fillColor: '#3B82F6',
        fillOpacity: 0.12
      }).addTo(group);

      // Clean Royal Cobalt Blue User Pin (Standar Peta Navigasi Modern)
      const userGpsIcon = L.divIcon({
        className: 'real-user-gps-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
            <div style="background:#1E293B;color:#fff;padding:2px 8px;border-radius:6px;font-family:'Plus Jakarta Sans',sans-serif;font-size:9px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:1px solid #3B82F6;margin-bottom:3px;letter-spacing:0.02em;">
              Posisi Anda (±${effectiveUserCoords.accuracy || 15} m)
            </div>
            <div style="width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      L.marker(userLatLng, { icon: userGpsIcon, zIndexOffset: 1200 })
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:6px 4px;color:#2C221E;">
            <div style="font-size:10px;font-weight:800;color:#2563EB;text-transform:uppercase;letter-spacing:0.04em;">SENSOR GPS AKTIF</div>
            <div style="font-size:12px;font-weight:800;color:#2C221E;margin:4px 0;font-family:monospace;">${effectiveUserCoords.lat.toFixed(6)}, ${effectiveUserCoords.lng.toFixed(6)}</div>
            <div style="font-size:11px;color:#786B5E;">Akurasi Sensor: ±${effectiveUserCoords.accuracy} meter</div>
            ${userLiveAddress ? `<div style="font-size:11px;color:#2C221E;margin-top:4px;">${userLiveAddress}</div>` : ''}
          </div>`
        )
        .addTo(group);
    } else {
      // Titik Nol Kilometer Yogyakarta (Penanda acuan default ketika GPS belum aktif)
      const nolIcon = L.divIcon({
        className: 'titik-nol-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
            <div style="background:#4A3B32;color:#fff;padding:2px 7px;border-radius:6px;font-family:'Plus Jakarta Sans',sans-serif;font-size:9px;font-weight:700;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,0.2);margin-bottom:2px;">
              Titik Nol KM Jogja
            </div>
            <div style="width:12px;height:12px;border-radius:50%;background:#8c532b;border:2px solid #FAF8F5;box-shadow:0 0 0 4px rgba(140,83,43,0.2);"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      L.marker([TITIK_NOL_YOGYAKARTA.lat, TITIK_NOL_YOGYAKARTA.lng], { icon: nolIcon, zIndexOffset: 800 })
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px;color:#2C221E;">
            <div style="font-size:10px;font-weight:800;color:#8A5D26;text-transform:uppercase;">ACUAN JARAK DEFAULT</div>
            <div style="font-size:12px;font-weight:800;color:#2C221E;margin:2px 0;">Titik Nol Kilometer Yogyakarta</div>
            <div style="font-size:11px;color:#786B5E;">Nyalakan GPS untuk menghitung rute langsung dari posisi Anda saat ini.</div>
          </div>`
        )
        .addTo(group);
    }

    // Garis Rute Aktif (Polyline Line Track) Langsung di Peta
    if (activeNavTarget?.coordinates) {
      const origin = (hasUserGps && effectiveUserCoords) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;
      const originLatLng = [origin.lat, origin.lng];
      const targetLatLng = [activeNavTarget.coordinates.lat, activeNavTarget.coordinates.lng];

      // Gunakan koordinat rute jalan raya dari OSRM jika sudah tersedia, atau fallback origin->target
      const trackPoints = routeCoordinates && routeCoordinates.length > 0
        ? routeCoordinates
        : [originLatLng, targetLatLng];

      // Route Casing Line (Kontras Gelap Mataram)
      L.polyline(trackPoints, {
        color: '#2d180c',
        weight: 6.5,
        opacity: 0.88,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(group);

      // Core Glowing Path (Emas Mataram Mengikuti Lekukan Jalan)
      L.polyline(trackPoints, {
        color: '#D4AF37',
        weight: 3.8,
        opacity: 1,
        dashArray: '7, 7',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(group);
    }

    // Marker Khusus Acara Budaya (Event Target dari Kalender)
    if (eventTarget && eventTarget.coordinates) {
      const isSelected = activeItem && activeItem.id === eventTarget.id;
      const eventMarkerHtml = `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;filter:drop-shadow(0 8px 18px rgba(44,34,30,0.45));">
          <div style="background:linear-gradient(135deg, #2d180c 0%, #432311 100%);color:#FDE047;padding:5px 12px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:2px solid #F59E0B;margin-bottom:3px;display:flex;align-items:center;gap:6px;">
            <span>👑</span>
            <span>${eventTarget.name.slice(0, 24)}${eventTarget.name.length > 24 ? '...' : ''}</span>
          </div>
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.06 0 0 8.06 0 18C0 30.25 16.1 42.7 17.21 43.54C17.68 43.89 18.32 43.89 18.79 43.54C19.9 42.7 36 30.25 36 18C36 8.06 27.94 0 18 0Z" fill="#2d180c"/>
            <circle cx="18" cy="18" r="8" fill="#F59E0B"/>
            <circle cx="18" cy="18" r="4.5" fill="#FFFBEB"/>
          </svg>
        </div>
      `;

      const eventIcon = L.divIcon({
        className: 'jogja-event-marker',
        html: eventMarkerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const eventMarker = L.marker([eventTarget.coordinates.lat, eventTarget.coordinates.lng], {
        icon: eventIcon,
        zIndexOffset: isSelected ? 1500 : 1200
      });

      eventMarker.on('click', () => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        setSelectedCardId(eventTarget.id);
        setShowGpsRequiredPrompt(false);
        if (isMobile) {
          setIsSidePanelOpen(false); // Mobile: jangan buka side panel besar, biarkan peta terlihat & buka popup Google Maps
        } else {
          setIsSidePanelOpen(true); // Desktop: kembalikan behavior asli desktop (buka sidebar detail)
        }
        map.flyTo([eventTarget.coordinates.lat, eventTarget.coordinates.lng], 16.5, { duration: 0.65 });
      });

      group.addLayer(eventMarker);
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
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        setSelectedCardId(item.id);
        setShowGpsRequiredPrompt(false);
        if (isMobile) {
          setIsSidePanelOpen(false); // Mobile: jangan buka side panel besar, biarkan peta terlihat & buka popup Google Maps
        } else {
          setIsSidePanelOpen(true); // Desktop: kembalikan behavior asli desktop (buka sidebar detail)
        }
        map.flyTo([item.coordinates.lat, item.coordinates.lng], 16.5, { duration: 0.65 });
      });

      group.addLayer(marker);
    });

    // 3. KAMERA POV BERPINDAH: Hanya fokuskan SATU KALI saat rute/item berubah,
    // JANGAN panggil fitBounds berulang-ulang setiap kali sensor GPS bergetar agar user bebas menggeser peta!
    if (activeNavTarget?.coordinates) {
      if (lastCenteredNavRouteIdRef.current !== activeNavTarget.id) {
        lastCenteredNavRouteIdRef.current = activeNavTarget.id;
        const origin = (hasUserGps && isUserInJogja) ? effectiveUserCoords : TITIK_NOL_YOGYAKARTA;
        const pts = (routeCoordinates && routeCoordinates.length > 1)
          ? routeCoordinates
          : [
              [origin.lat, origin.lng],
              [activeNavTarget.coordinates.lat, activeNavTarget.coordinates.lng]
            ];
        map.fitBounds(L.latLngBounds(pts), { padding: [70, 70], maxZoom: 17 });
      }
    } else if (activeItem?.coordinates) {
      lastCenteredNavRouteIdRef.current = null;
      if (lastCenteredCardIdRef.current !== activeItem.id) {
        lastCenteredCardIdRef.current = activeItem.id;
        map.flyTo(
          [activeItem.coordinates.lat, activeItem.coordinates.lng],
          16.5,
          { duration: 0.6 }
        );
      }
    } else if (eventTarget?.coordinates && !activeNavTarget) {
      lastCenteredNavRouteIdRef.current = null;
      lastCenteredCardIdRef.current = null;
      map.flyTo([eventTarget.coordinates.lat, eventTarget.coordinates.lng], 16, { duration: 0.7 });
    } else if (activeZone?.coordinates) {
      lastCenteredNavRouteIdRef.current = null;
      lastCenteredCardIdRef.current = null;
      if (!initialCameraSetRef.current) {
        initialCameraSetRef.current = true;
      }
    }
  }, [
    isOpen,
    activeZone,
    activeItem,
    activeNavRouteId,
    activeNavTarget,
    routeCoordinates,
    filteredItems.length,
    searchQuery,
    radiusLimitKm,
    effectiveUserCoords,
    userLiveCoords,
    localUserCoords,
    hasUserGps,
    userLiveAddress,
    eventTarget
  ]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 w-full h-full overflow-hidden select-none no-scrollbar touch-none"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          zIndex: 9990,
          backgroundColor: '#FAF8F5',
          color: '#2C221E',
          overflow: 'hidden',
          overscrollBehavior: 'none',
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
            NAVIGATION HUD BAR (RUTE AKTIF LIVE)
            - Mobile: Di atas navbar bawah dan center (bottom-[72px] inset-x-3 max-w-md mx-auto)
            - Desktop: Kanan/tengah atas (sm:top-24 sm:left-1/2)
            - Menampilkan Jarak Rute & Tombol Jelas 'Akhiri Rute'
            ========================================================================= */}
        <AnimatePresence>
          {activeNavRouteId && activeNavTarget && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed sm:absolute bottom-[72px] sm:bottom-auto sm:top-24 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md mx-auto z-[100010] bg-[#FAF6EE]/95 backdrop-blur-xl text-[#2D180C] px-3.5 sm:px-5 py-2.5 rounded-2xl sm:rounded-full shadow-[0_12px_36px_rgba(45,24,12,0.22)] border border-[#C7AE98] flex items-center justify-between gap-3 pointer-events-auto select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8C532B] animate-pulse shrink-0 ring-4 ring-[#8C532B]/20" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-[#2D180C] truncate leading-tight">
                    {activeNavTarget.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5 leading-none">
                    <span className="text-[#8C532B] font-extrabold shrink-0">
                      {isRouteLoading && routeDistanceMeters === null
                        ? 'Mencari rute jalan...'
                        : routeDistanceMeters !== null
                        ? formatDistanceLabel(routeDistanceMeters)
                        : navDistMeters !== null
                        ? formatDistanceLabel(navDistMeters)
                        : 'Menghitung...'}
                    </span>
                    <span className="text-[#8C532B]/40">•</span>
                    <span className="text-[#786154] font-medium shrink-0">
                      ± {routeDurationMinutes ?? navEstMinutes} menit
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Akhiri Rute (Jelas, Kontras Tinggi, & Mengakhiri Line Track) */}
              <button
                type="button"
                onClick={handleEndRoute}
                className="px-3.5 py-2 sm:py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                title="Hentikan petunjuk rute dan hilangkan garis rute di peta"
              >
                <X size={13} strokeWidth={2.5} />
                <span>Akhiri Rute</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            FLOATING ACTION TOOLS:
            - Desktop: Kanan atas (sm:top-24 sm:right-6)
            - Mobile: Kanan bawah di atas navbar bawah (geser ke atas saat rute aktif)
            ========================================================================= */}
        <div
          className={`absolute right-3 sm:right-6 z-[995] flex flex-col gap-2 transition-all duration-300 ${
            activeNavRouteId
              ? 'bottom-[130px] sm:bottom-auto sm:top-24'
              : 'bottom-20 sm:bottom-auto sm:top-24'
          }`}
        >
          {/* Tombol Fokus Kota Yogyakarta */}
          <button
            type="button"
            onClick={() => {
              setSelectedCardId(null);
              setShowGpsRequiredPrompt(false);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.fitBounds(KOTA_YOGYAKARTA_BOUNDS, {
                  padding: [30, 30],
                  maxZoom: 14
                });
              }
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Tampilkan Seluruh Kota Yogyakarta"
          >
            <Compass size={17} className="group-hover:rotate-45 transition-transform" />
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={`Ganti Tampilan Peta (${
              activeMapLayer === 'google-streets'
                ? 'Aktif: Google Streets HD (Super Cepat)'
                : activeMapLayer === 'satellite'
                ? 'Aktif: Google Satellite HD'
                : 'Aktif: Standar OSM'
            })`}
          >
            <Layers size={17} />
          </button>

          {/* Tombol Lacak GPS Real-Time */}
          {onRefreshDeviceGps && (
            <button
              type="button"
              onClick={onRefreshDeviceGps}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center transition-all cursor-pointer ${
                (isGpsLoading || isGpsRequesting)
                  ? 'text-[#C99B52] animate-spin'
                  : 'text-[#2C221E] hover:bg-[#FAF8F5] hover:text-[#8A5D26] hover:scale-105 active:scale-95'
              }`}
              title="Perbarui Deteksi Lokasi GPS"
            >
              <Navigation size={16} />
            </button>
          )}

          {/* Tombol Tutup Peta & Kembali */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D7C7] shadow-lg flex items-center justify-center text-[#786B5E] hover:text-[#2C221E] hover:bg-[#FAF8F5] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Tutup Peta"
          >
            <X size={17} />
          </button>
        </div>

        {/* =========================================================================
            FLOATING LEFT DRAWER / EXPLORER PANEL (Z-INDEX 995)
            DUA MODE:
            1. Single Destination Full Sidebar View (Ketika 1 destinasi diklik)
            2. Multi-item Explorer List View (Ketika belum ada destinasi terpilih)
            ========================================================================= */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -35 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:flex absolute sm:bottom-6 sm:top-24 sm:left-5 sm:h-auto sm:max-h-none sm:w-[420px] sm:max-w-[420px] z-[995] bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E2D7C7] shadow-[0_12px_36px_rgba(44,34,30,0.18)] flex-col overflow-hidden transition-all"
            >
              {activeItem ? (
                /* ===================================================================
                   1. SINGLE DESTINATION FULL SIDEBAR VIEW (DESKTOP DETAIL)
                   =================================================================== */
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Top Bar with Back and Close */}
                  <div className="p-3.5 sm:p-4 border-b border-[#EAE3D6] bg-white/95 flex items-center justify-between gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCardId(null);
                        setShowGpsRequiredPrompt(false);
                        if (onClearEventTarget) onClearEventTarget();
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#8A5D26] hover:text-[#2C221E] bg-[#FAF5EC] hover:bg-[#EAE1D2] px-3 py-1.5 rounded-xl border border-[#E5DDD1] transition-all cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>{activeItem.isCulturalEvent ? 'Buka Radar Kuliner' : 'Daftar Kuliner'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCardId(null);
                        setShowGpsRequiredPrompt(false);
                      }}
                      className="w-8 h-8 rounded-full bg-[#FAF5EC] hover:bg-[#EAE1D2] text-[#6E6053] hover:text-[#2C221E] flex items-center justify-center transition-all cursor-pointer"
                      title="Keluar dari Informasi Destinasi"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Scrollable Single Destination Details */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {/* Hero Image */}
                    {activeItem.image && (
                      <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-[#E5DDD1] bg-[#F5EFE6] shadow-xs shrink-0">
                        <img
                          src={activeItem.image}
                          alt={activeItem.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {activeItem.category && (
                          <span className="absolute top-3 left-3 bg-[#2C221E]/90 backdrop-blur-md text-[#FAF8F5] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#C99B52]/40 shadow-xs">
                            {activeItem.category}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title & Spot */}
                    <div>
                      <h2 className="font-outfit font-extrabold text-base sm:text-lg text-[#2C221E] m-0 leading-tight">
                        {activeItem.name}
                      </h2>
                      <p className="text-xs text-[#786B5E] m-0 mt-1 flex items-center gap-1.5 font-medium">
                        <MapPin size={13} className="text-[#C99B52] shrink-0" />
                        <span>{activeItem.spotName}</span>
                      </p>
                    </div>

                    {/* Tanggal Acara Budaya (Jika Event) */}
                    {activeItem.dateFull && (
                      <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#E8DFC9] flex items-center gap-2.5 text-xs text-[#2d180c]">
                        <Calendar size={14} className="text-[#8c532b] shrink-0" />
                        <span className="font-semibold">{activeItem.dateFull}</span>
                      </div>
                    )}

                    {/* 2x2 Meta Grid (Jarak, Jam Buka, Kisaran Harga, Kategori) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Jarak */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <div className="text-[10px] font-bold text-[#8A5D26] uppercase tracking-wider mb-1">
                          Jarak
                        </div>
                        <div className="text-xs font-bold text-[#2C221E] truncate">
                          {activeItem.distanceLabel || 'Terdeteksi'}
                        </div>
                        <div className="text-[9px] text-[#786B5E] mt-0.5">
                          {hasUserGps ? 'Dari lokasi GPS Anda' : 'Dari Titik Nol KM'}
                        </div>
                      </div>

                      {/* Jam Buka */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <div className="text-[10px] font-bold text-[#8A5D26] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock size={11} className="text-[#C99B52]" />
                          <span>Jam Operasional</span>
                        </div>
                        <div className="text-xs font-bold text-[#2C221E] truncate">
                          {activeItem.operatingHours || '08:00 - 21:00 WIB'}
                        </div>
                        <div className="text-[9px] text-[#786B5E] mt-0.5">Setiap Hari</div>
                      </div>

                      {/* Kisaran Harga */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <div className="text-[10px] font-bold text-[#8A5D26] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Tag size={11} className="text-[#C99B52]" />
                          <span>Kisaran Harga</span>
                        </div>
                        <div className="text-xs font-bold text-[#2C221E] truncate">
                          {activeItem.priceRange || 'Rp 15rb - Rp 35rb'}
                        </div>
                        <div className="text-[9px] text-[#786B5E] mt-0.5">Per Porsi / Menu</div>
                      </div>

                      {/* Kategori / Verifikasi */}
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <div className="text-[10px] font-bold text-[#8A5D26] uppercase tracking-wider mb-1">
                          Kategori
                        </div>
                        <div className="text-xs font-bold text-[#2C221E] truncate">
                          {activeItem.category || 'Kuliner Legendaris'}
                        </div>
                        <div className="text-[9px] text-[#786B5E] mt-0.5">
                          {activeItem.verdictLabel || 'Rekomendasi Utama'}
                        </div>
                      </div>
                    </div>

                    {/* Profil Cita Rasa Otentik */}
                    {activeItem.tasteProfile && (
                      <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EFE4D0] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#8A5D26] uppercase text-[10px] tracking-wider">
                          <Utensils size={12} />
                          <span>Profil Cita Rasa Otentik</span>
                        </div>
                        <p className="text-xs text-[#5C4E43] leading-relaxed m-0">
                          {activeItem.tasteProfile}
                        </p>
                      </div>
                    )}

                    {/* Catatan Sejarah & Ulasan */}
                    {activeItem.honestReview && (
                      <div className="p-3.5 rounded-2xl bg-[#F7F2E7] border border-[#EADFCB] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#2C221E] uppercase text-[10px] tracking-wider">
                          <BookOpen size={12} className="text-[#C99B52]" />
                          <span>Catatan Sejarah & Ulasan</span>
                        </div>
                        <p className="text-xs text-[#6B5E54] leading-relaxed m-0">
                          {activeItem.honestReview}
                        </p>
                      </div>
                    )}

                    {/* Detail Alamat & Titik Koordinat Presisi */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DD] space-y-1.5 text-xs">
                      <div className="flex items-start gap-2 text-[#2C221E]">
                        <MapPin size={14} className="text-[#C99B52] shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{activeItem.spotName}</span>
                      </div>
                      {activeItem.coordinates && (
                        <div className="text-[10px] text-[#8A5D26] font-mono pl-5">
                          Koordinat: {activeItem.coordinates.lat.toFixed(6)}, {activeItem.coordinates.lng.toFixed(6)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sticky Bottom Action Buttons with Instant GPS Alert */}
                  <div className="p-3.5 sm:p-4 border-t border-[#EAE3D6] bg-white/95 shrink-0 flex flex-col gap-2.5">
                    {/* In-Card GPS Alert (Tampil seketika di atas tombol rute) */}
                    <AnimatePresence>
                      {showGpsRequiredPrompt && !hasUserGps && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] space-y-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-[#92400E]">
                              <AlertCircle size={14} className="text-[#D97706] shrink-0" />
                              <span>Akses GPS Diperlukan untuk Navigasi Rute</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowGpsRequiredPrompt(false)}
                              className="text-[#92400E] hover:text-[#78350F] p-0.5"
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <p className="text-[11px] leading-relaxed m-0 text-[#78350F]">
                            Pilih titik awal rute: nyalakan sensor GPS Anda untuk rute real-time, atau mulai dari Titik Nol KM Yogyakarta.
                          </p>
                          {gpsErrorMessage && (
                            <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300 text-[11px] text-amber-900 leading-snug space-y-1.5">
                              <div>{gpsErrorMessage}</div>
                              <button
                                type="button"
                                onClick={() => handleStartRouteFromTitikNol(activeItem)}
                                className="w-full py-1 px-2 rounded-md bg-[#92400E] hover:bg-[#78350F] text-white text-[10px] font-bold transition-colors cursor-pointer text-center"
                              >
                                Gunakan Rute Titik Nol Sekarang
                              </button>
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              disabled={isGpsRequesting}
                              onClick={handleRequestEnableGps}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                            >
                              {isGpsRequesting ? (
                                <>
                                  <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                  <span>Menghubungkan GPS...</span>
                                </>
                              ) : (
                                <span>Nyalakan GPS Perangkat</span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartRouteFromTitikNol(activeItem)}
                              className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#78350F] text-[10px] font-bold border border-[#FDE68A] transition-colors cursor-pointer shrink-0"
                              title="Tampilkan rute menggunakan Titik Nol KM sebagai titik awal default"
                            >
                              Rute dari Titik Nol
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

{/* Tombol Pemesanan GoFood Resmi (Hanya untuk destinasi kuliner, bukan agenda budaya) */}
                    {!activeItem.isCulturalEvent && (
                      <div className="flex items-center gap-2">
                        <a
                          href={activeItem.hasGofood ? activeItem.gofoodUrl : `https://gofood.co.id/search?q=${encodeURIComponent(activeItem.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#EE2737] hover:bg-[#d61e2d] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                          title={`Pesan ${activeItem.name} langsung di GoFood`}
                        >
                          <GoFoodBadge
                            size="md"
                            showExternalIcon={true}
                            rating={activeItem.hasGofood ? activeItem.gofoodRating : undefined}
                            reviews={activeItem.hasGofood ? activeItem.gofoodReviews : undefined}
                            tier={activeItem.hasGofood ? activeItem.gofoodTier : undefined}
                            showRating={Boolean(activeItem.hasGofood && activeItem.gofoodRating)}
                          />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => handleCulinaryWishlistToggle(e, activeItem)}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isFavorite(activeItem.id)
                              ? 'bg-rose-50 border-rose-200 text-rose-500'
                              : 'border-[#E2D7C7] hover:bg-[#FAF6EE] text-[#786B5E] hover:text-[#2C221E]'
                          }`}
                          title={isFavorite(activeItem.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                        >
                          <Heart size={16} fill={isFavorite(activeItem.id) ? '#f43f5e' : 'none'} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {activeNavRouteId === activeItem.id ? (
                        <button
                          type="button"
                          onClick={handleEndRoute}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <X size={14} />
                          <span>Akhiri Panduan Rute</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartRoute(activeItem)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#2C221E] hover:bg-[#C99B52] hover:text-[#2C221E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <Navigation size={14} />
                          <span>Petunjuk Rute</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (mapInstanceRef.current && activeItem.coordinates) {
                            mapInstanceRef.current.flyTo(
                              [activeItem.coordinates.lat, activeItem.coordinates.lng],
                              17,
                              { duration: 0.7 }
                            );
                          }
                        }}
                        className="w-10 h-10 rounded-xl border border-[#E2D7C7] hover:bg-[#FAF6EE] text-[#786B5E] hover:text-[#2C221E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Fokus di Peta"
                      >
                        <Compass size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ===================================================================
                   2. MULTI-ITEM EXPLORER LIST VIEW
                   =================================================================== */
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Drawer Top Header */}
                  <div className="p-4 border-b border-[#EAE3D6] bg-white/95 shrink-0">
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
                        <ChevronLeft size={16} className="hidden sm:block" />
                        <ChevronDown size={16} className="sm:hidden" />
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

                    {/* Chips Pilihan Kawasan */}
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
                                  setShowGpsRequiredPrompt(false);
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

                      {/* Filter Chip Cepat: Semua vs GoFood Partner Resmi (Solid Luxury Look) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#F0EAE1]">
                        <button
                          type="button"
                          onClick={() => setOnlyGofoodFilter(false)}
                          style={{
                            flex: 1,
                            padding: '0.45rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            backgroundColor: !onlyGofoodFilter ? '#2C221E' : '#FFFFFF',
                            color: !onlyGofoodFilter ? '#FFFFFF' : '#2C221E',
                            border: '1.5px solid #2C221E',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <span>Semua Kuliner</span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '999px',
                              backgroundColor: !onlyGofoodFilter ? '#FFFFFF' : '#2C221E',
                              color: !onlyGofoodFilter ? '#2C221E' : '#FFFFFF',
                              lineHeight: 1
                            }}
                          >
                            {activeZone.kulinerList.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOnlyGofoodFilter((prev) => !prev)}
                          title="Tampilkan hanya kuliner mitra resmi GoFood"
                          style={{
                            flex: 1,
                            padding: '0.45rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.45rem',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            backgroundColor: onlyGofoodFilter ? '#EE2737' : '#FFFFFF',
                            color: onlyGofoodFilter ? '#FFFFFF' : '#EE2737',
                            border: '1.5px solid #EE2737',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {/* Official GoFood Logo Disc (Spoon & Fork) */}
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '999px',
                              backgroundColor: onlyGofoodFilter ? '#FFFFFF' : '#EE2737',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" style={{ width: '10px', height: '10px' }}>
                              <path
                                d="M9 4V10C9 10.55 8.55 11 8 11C7.45 11 7 10.55 7 10V4C7 3.45 7.45 3 8 3C8.55 3 9 3.45 9 4ZM6 4V8C6 8.55 5.55 9 5 9C4.45 9 4 8.55 4 8V4C4 3.45 4.45 3 5 3C5.55 3 6 3.45 6 4ZM10 4V8C10 8.55 9.55 9 9 9C8.45 9 8 8.55 8 8V4C8 3.45 8.45 3 9 3C9.55 3 10 3.45 10 4ZM7 11V20C7 20.55 6.55 21 6 21C5.45 21 5 20.55 5 20V11C4.4 10.6 4 10 4 9.3V4H10V9.3C10 10 9.6 10.6 9 11V20C9 20.55 8.55 21 8 21C7.45 21 7 20.55 7 20Z"
                                fill={onlyGofoodFilter ? '#EE2737' : '#FFFFFF'}
                              />
                              <path
                                d="M16 3C14.34 3 13 4.79 13 7C13 8.78 13.9 10.28 15.17 10.77V20C15.17 20.55 15.62 21 16.17 21C16.72 21 17.17 20.55 17.17 20V10.77C18.44 10.28 19.34 8.78 19.34 7C19.34 4.79 18 3 16 3Z"
                                fill={onlyGofoodFilter ? '#EE2737' : '#FFFFFF'}
                              />
                            </svg>
                          </span>

                          {/* Official Typography "gofood" */}
                          <span style={{ letterSpacing: '-0.02em', fontSize: '0.78rem' }}>
                            <strong style={{ fontWeight: 900 }}>go</strong>
                            <span style={{ fontWeight: 700 }}>food</span>
                          </span>

                          {/* Counter Badge Solid */}
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '999px',
                              backgroundColor: onlyGofoodFilter ? '#FFFFFF' : '#EE2737',
                              color: onlyGofoodFilter ? '#EE2737' : '#FFFFFF',
                              lineHeight: 1
                            }}
                          >
                            {activeZone.kulinerList.filter((k) => k.hasGofood).length}
                          </span>
                        </button>
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
                        const isExpanded = !!expandedCards[item.id];

                        return (
                          <div
                            key={item.id}
                            id={`kuliner-card-${item.id}`}
                            onClick={() => {
                              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                              setSelectedCardId(item.id);
                              setShowGpsRequiredPrompt(false);
                              if (isMobile) {
                                setIsSidePanelOpen(false); // Mobile: tutup drawer & tampilkan popup Google Maps
                              }
                              // Desktop: biarkan side panel terbuka dengan detail item yang dipilih
                              if (mapInstanceRef.current && item.coordinates) {
                                mapInstanceRef.current.flyTo(
                                  [item.coordinates.lat, item.coordinates.lng],
                                  16.5,
                                  { duration: 0.7 }
                                );
                              }
                            }}
                            className="p-3 rounded-2xl cursor-pointer transition-all border group bg-white border-[#EAE3D6] hover:border-[#C99B52] hover:bg-[#FCFAF8] shadow-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              {/* Foto Thumbnail + Official GoFood Badge */}
                              {item.image && (
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E5DDD1] bg-[#F5EFE6] shadow-2xs">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  {item.hasGofood && (
                                    <div className="absolute top-1 left-1 z-10 scale-90 origin-top-left">
                                      <GoFoodBadge size="xs" showExternalIcon={false} rating={item.gofoodRating} />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1.5 mb-1">
                                  <h3 className="font-outfit font-bold text-xs sm:text-sm text-[#2C221E] leading-snug m-0 group-hover:text-[#8A5D26] transition-colors">
                                    {item.name}
                                  </h3>
                                  <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold text-[#8A5D26] bg-[#FAF4E8] border border-[#EFE0C7] px-2 py-0.5 rounded-full">
                                    <MapPin size={9} className="text-[#C99B52]" />
                                    {item.distanceLabel}
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
                                        <Tag size={10} className="text-[#C99B52]" />
                                        <span>{item.priceRange}</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Tombol Dropdown Info Ringkas */}
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
                                <span>{isExpanded ? 'Tutup Info Ringkas' : 'Info Ringkas'}</span>
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
                                    {item.tasteProfile && (
                                      <div className="text-[10px] text-[#5C4E43] bg-[#FAF6EE] border border-[#EFE4D0] p-2 rounded-xl">
                                        <div className="flex items-center gap-1 font-bold text-[#8A5D26] uppercase text-[9px] mb-1 tracking-wider">
                                          <Utensils size={10} />
                                          <span>Profil Cita Rasa Otentik:</span>
                                        </div>
                                        <p className="m-0 leading-relaxed text-[#5C4E43]">{item.tasteProfile}</p>
                                      </div>
                                    )}

                                    {item.honestReview && (
                                      <div className="text-[10px] text-[#6B5E54] bg-[#F7F2E7] border border-[#EADFCB] p-2 rounded-xl">
                                        <div className="flex items-center gap-1 font-bold text-[#2C221E] text-[9px] uppercase tracking-wider mb-1">
                                          <BookOpen size={11} className="text-[#C99B52]" />
                                          <span>Catatan Sejarah & Ulasan:</span>
                                        </div>
                                        <p className="m-0 leading-relaxed text-[#6B5E54]">{item.honestReview}</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Tombol Aksi di Kartu */}
                            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#EAE3D6]/70 mt-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleCulinaryWishlistToggle(e, item)}
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                    isFavorite(item.id)
                                      ? 'text-rose-500 bg-rose-50'
                                      : 'text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200'
                                  }`}
                                  title={isFavorite(item.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                                >
                                  <Heart size={12} fill={isFavorite(item.id) ? '#f43f5e' : 'none'} />
                                </button>
                                <span className="text-[10px] font-bold text-[#8A5D26] group-hover:text-[#2C221E] flex items-center gap-0.5">
                                  <span>Detail</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {item.hasGofood ? (
                                  <a
                                    href={item.gofoodUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="cursor-pointer inline-flex"
                                    title={`Pesan ${item.name} langsung di GoFood`}
                                  >
                                    <GoFoodBadge size="sm" showExternalIcon={true} rating={item.gofoodRating} reviews={item.gofoodReviews} tier={item.gofoodTier} />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-[#786B5E] bg-[#FAF6EE] border border-[#EFE6D6] px-2 py-0.5 rounded-full font-medium">
                                    Dine-in / Lokasi
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCardId(item.id);
                                    handleStartRoute(item);
                                  }}
                                  className="py-1 px-2.5 rounded-full bg-[#2C221E] hover:bg-[#C99B52] hover:text-[#2C221E] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Navigation size={10} />
                                  <span>Petunjuk Rute</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
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
            className="hidden sm:flex absolute sm:top-24 sm:left-5 z-[995] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl items-center gap-2 text-xs font-extrabold text-[#2C221E] cursor-pointer hover:bg-[#FAF8F5] border border-[#E2D7C7] hover:border-[#C99B52] transition-all"
          >
            <Utensils size={15} className="text-[#2C221E]" strokeWidth={2.2} />
            <span>Daftar Kuliner ({filteredItems.length})</span>
          </button>
        )}

        {/* =========================================================================
            BOTTOM HIGHLIGHT CARD: DESKTOP ASLI vs MOBILE GOOGLE MAPS
            - Desktop: Tampilan asli warm Jogja (hidden sm:block)
            - Mobile: Tampilan persis Google Maps (sm:hidden)
            ========================================================================= */}
        <AnimatePresence>
          {activeItem && !isSidePanelOpen && (
            <>
              {/* --- 1. TAMPILAN ASLI DESKTOP (WIDGET WARM MATARAM JOGJA) --- */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="hidden sm:block absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 w-[min(94%,470px)] z-[998] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(44,34,30,0.18)] border border-[#EAE3D6] p-4 sm:p-5 overflow-hidden"
              >
                {/* Header: Foto + Judul + Tombol Tutup */}
                <div className="flex items-start gap-3.5 mb-3">
                  {activeItem.image && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-[#E8DFC9] bg-[#FAF6EE] shadow-xs">
                      <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {activeItem.hasGofood && (
                        <div className="absolute top-1.5 left-1.5 z-10 scale-90 origin-top-left">
                          <GoFoodBadge size="xs" showExternalIcon={false} rating={activeItem.gofoodRating} />
                        </div>
                      )}
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
                        onClick={() => {
                          setSelectedCardId(null);
                          setShowGpsRequiredPrompt(false);
                        }}
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-1 border-t border-[#F2ECE3]">
                  {/* In-Card GPS Alert (Desktop Bottom Card) */}
                  <AnimatePresence>
                    {showGpsRequiredPrompt && !hasUserGps && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#92400E]">
                            <AlertCircle size={14} className="text-[#D97706] shrink-0" />
                            <span>Akses GPS Diperlukan untuk Navigasi Rute</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowGpsRequiredPrompt(false)}
                            className="text-[#92400E] hover:text-[#78350F] p-0.5 cursor-pointer"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <p className="text-[11px] leading-relaxed m-0 text-[#78350F]">
                          Aktifkan sensor lokasi perangkat Anda, atau tampilkan rute mulai dari Titik Nol KM Yogyakarta.
                        </p>
                        {gpsErrorMessage && (
                          <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300 text-[11px] text-amber-900 leading-snug space-y-1.5">
                            <div>{gpsErrorMessage}</div>
                            <button
                              type="button"
                              onClick={() => handleStartRouteFromTitikNol(activeItem)}
                              className="w-full py-1 px-2 rounded-md bg-[#92400E] hover:bg-[#78350F] text-white text-[10px] font-bold transition-colors cursor-pointer text-center"
                            >
                              Gunakan Rute Titik Nol Sekarang
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            disabled={isGpsRequesting}
                            onClick={handleRequestEnableGps}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                          >
                            {isGpsRequesting ? (
                              <>
                                <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                <span>Menghubungkan GPS...</span>
                              </>
                            ) : (
                              <span>Nyalakan GPS Perangkat</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartRouteFromTitikNol(activeItem)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#78350F] text-[10px] font-bold border border-[#FDE68A] transition-colors cursor-pointer shrink-0"
                            title="Tampilkan rute menggunakan Titik Nol KM sebagai titik awal default"
                          >
                            Rute dari Titik Nol
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2">
                    {!activeItem?.isCulturalEvent && (
                      <a
                        href={activeItem?.hasGofood ? activeItem.gofoodUrl : `https://gofood.co.id/search?q=${encodeURIComponent(activeItem?.name || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer shrink-0 inline-flex transition-transform hover:scale-105 active:scale-95"
                        title={`Pesan ${activeItem?.name} di GoFood Resmi`}
                      >
                        <GoFoodBadge
                          size="md"
                          showExternalIcon={true}
                          rating={activeItem?.hasGofood ? activeItem.gofoodRating : undefined}
                          reviews={activeItem?.hasGofood ? activeItem.gofoodReviews : undefined}
                          tier={activeItem?.hasGofood ? activeItem.gofoodTier : undefined}
                          showRating={Boolean(activeItem?.hasGofood && activeItem?.gofoodRating)}
                        />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (activeNavRouteId === activeItem.id) {
                          handleEndRoute();
                        } else {
                          handleStartRoute(activeItem);
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#2C221E] hover:bg-[#C99B52] hover:text-[#2C221E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <Navigation size={13} />
                      <span>{activeNavRouteId === activeItem.id ? 'Akhiri Rute' : 'Petunjuk Rute'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSidePanelOpen(true)}
                      className="px-3.5 py-2.5 rounded-full border border-[#E2D7C7] hover:bg-[#FAF6EE] text-xs font-bold text-[#786B5E] hover:text-[#2C221E] transition-colors cursor-pointer"
                    >
                      Buka Detail
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =========================================================================
            MOBILE TOP POPUP (COLLAPSIBLE / ACCORDION TOP SHEET)
            - Pindah ke sisi atas (< 640px)
            - Ringkas, rapi, tidak memenuhkan layar
            - Dapat diklik untuk menutup ke atas (slide up) atau membuka (slide down)
            - Jojo di-hide, tanpa ornamen berlebih
            ========================================================================= */}
        <div className="sm:hidden fixed top-3 left-3 right-3 z-[998] pointer-events-auto">
          <AnimatePresence mode="wait">
            {activeItem ? (
              /* --- A. MODE DETAIL KULINER TERPILIH (MOBILE TOP) --- */
              isMobilePopupCollapsed ? (
                /* 1. Collapsed Pill (Tertutup ke atas - Minimalis ~40px) */
                <motion.div
                  key="active-collapsed"
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobilePopupCollapsed(false)}
                  className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8DFC9] shadow-md p-2 flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] select-none"
                  title="Ketuk untuk membuka detail kuliner"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {activeItem.image ? (
                      <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="w-7 h-7 rounded-lg object-cover shrink-0 border border-[#E8DFC9]"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-[#8c532b]/10 text-[#8c532b] flex items-center justify-center shrink-0">
                        <Utensils size={13} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Outfit'] font-bold text-xs text-[#2d180c] truncate m-0 leading-tight">
                        {activeItem.name}
                      </h3>
                      <p className="text-[10px] text-[#786154] truncate m-0 flex items-center gap-1 leading-none mt-0.5">
                        <span className="font-semibold text-[#8c532b]">{activeItem.distanceLabel || 'Terdekat'}</span>
                        <span>•</span>
                        <span>{activeItem.category || 'Kuliner'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-[#8c532b] bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#E8DFC9] flex items-center gap-0.5">
                      <span>Buka</span>
                      <ChevronDown size={12} />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCardId(null);
                        setShowGpsRequiredPrompt(false);
                        if (onClearEventTarget) onClearEventTarget();
                      }}
                      className="w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer"
                      title="Tutup Pilihan"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* 2. Expanded Card (Terbuka ke bawah - Kompak & Ringkas max-h-[48vh] +2% panjang ke bawah) */
                <motion.div
                  key="active-expanded"
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E8DFC9] shadow-xl flex flex-col max-h-[48vh] overflow-hidden"
                >
                  {/* Accordion Toggle Bar (Tapping folds it up) */}
                  <div
                    onClick={() => setIsMobilePopupCollapsed(true)}
                    className="py-1.5 px-3 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between cursor-pointer hover:bg-[#F2ECE1] select-none shrink-0"
                    title="Ketuk untuk menutup popup ke atas"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8c532b]" />
                      <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider">
                        Detail Kuliner Terpilih
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#8c532b]">
                      <span>Tutup ke atas</span>
                      <ChevronDown size={13} className="rotate-180" />
                    </div>
                  </div>

                  {/* Body Content - Detail Lengkap Dapat Dilihat & Di-scroll */}
                  <div className="p-3 overflow-y-auto overscroll-contain space-y-2.5 flex-1 touch-pan-y [scrollbar-width:thin] [scrollbar-color:#C99B52_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#C99B52]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {/* Header: Foto + Nama + Kategori + Tombol X */}
                    <div className="flex items-start gap-2.5">
                      {activeItem.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8DFC9] bg-[#FAF6EE] shadow-2xs">
                          <img
                            src={activeItem.image}
                            alt={activeItem.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          {activeItem.hasGofood && (
                            <div className="absolute top-1 left-1 scale-75 origin-top-left">
                              <GoFoodBadge size="xs" showExternalIcon={false} rating={activeItem.gofoodRating} />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          {activeItem.category && (
                            <span className="text-[9px] font-bold text-[#8c532b] bg-[#FAF6EE] border border-[#E8DFC9] px-1.5 py-0.5 rounded">
                              {activeItem.category}
                            </span>
                          )}
                          {activeItem.verdictLabel && (
                            <span className="text-[9px] text-[#786154] font-medium truncate">
                              • {activeItem.verdictLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="font-['Outfit'] font-bold text-xs sm:text-sm text-[#2d180c] leading-snug m-0">
                          {activeItem.name}
                        </h3>
                        <p className="text-[10px] text-[#786154] m-0 mt-0.5 flex items-center gap-1">
                          <MapPin size={10} className="text-[#8c532b] shrink-0" />
                          <span className="truncate">{activeItem.spotName}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCardId(null);
                          setShowGpsRequiredPrompt(false);
                          if (onClearEventTarget) onClearEventTarget();
                        }}
                        className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center shrink-0 cursor-pointer"
                        title="Tutup Pilihan"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Chips Meta: Jam Operasional, Kisaran Harga, Jarak Real */}
                    <div className="flex items-center gap-1.5 text-[10px] text-[#786154] flex-wrap">
                      {activeItem.operatingHours && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#E8DFC9]">
                          <Clock size={10} className="text-[#8c532b]" />
                          <span>{activeItem.operatingHours}</span>
                        </span>
                      )}
                      {activeItem.priceRange && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#E8DFC9] font-bold text-[#8c532b]">
                          <Tag size={10} className="text-[#8c532b]" />
                          <span>{activeItem.priceRange}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#E8DFC9] font-semibold text-[#2d180c]">
                        <MapPin size={10} className="text-[#8c532b]" />
                        <span>{activeItem.distanceLabel || 'Terdekat'}</span>
                      </span>
                    </div>

                    {/* Tanggal Acara jika ada (Event Target) */}
                    {activeItem.dateFull && (
                      <div className="p-2 rounded-xl bg-[#FAF5EC] border border-[#E8DFC9] flex items-center gap-2 text-[10px] text-[#2d180c]">
                        <Calendar size={12} className="text-[#8c532b] shrink-0" />
                        <span className="font-semibold">{activeItem.dateFull}</span>
                      </div>
                    )}

                    {/* Deskripsi Lengkap Destinasi / Acara */}
                    {activeItem.description && (
                      <div className="text-[11px] text-[#4A3E37] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8DFC9] space-y-1 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-[#8c532b] uppercase text-[9px] tracking-wider">
                          <Info size={11} className="text-[#8c532b]" />
                          <span>Deskripsi Destinasi:</span>
                        </div>
                        <p className="m-0 leading-relaxed">{activeItem.description}</p>
                      </div>
                    )}

                    {/* Profil Cita Rasa Otentik */}
                    {activeItem.tasteProfile && (
                      <div className="text-[11px] text-[#5C4E43] bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EFE4D0] space-y-1 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-[#8A5D26] uppercase text-[9px] tracking-wider">
                          <Utensils size={11} className="text-[#C99B52]" />
                          <span>Profil Cita Rasa Otentik:</span>
                        </div>
                        <p className="m-0 leading-relaxed text-[#5C4E43]">{activeItem.tasteProfile}</p>
                      </div>
                    )}

                    {/* Catatan Sejarah & Filosofi Kuliner */}
                    {activeItem.honestReview && (
                      <div className="text-[11px] text-[#6B5E54] bg-[#F7F2E7] p-2.5 rounded-xl border border-[#EADFCB] space-y-1 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-[#2C221E] text-[9px] uppercase tracking-wider">
                          <BookOpen size={11} className="text-[#C99B52]" />
                          <span>Catatan Sejarah & Filosofi:</span>
                        </div>
                        <p className="m-0 leading-relaxed text-[#6B5E54]">{activeItem.honestReview}</p>
                      </div>
                    )}

                    {/* Tips Kunjungan jika ada */}
                    {activeItem.shortTip && (
                      <div className="text-[10.5px] text-[#78350F] bg-[#FFFBEB] p-2 rounded-xl border border-[#FDE68A] flex items-start gap-1.5 leading-relaxed">
                        <AlertCircle size={12} className="text-[#D97706] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Tips: </span>
                          <span>{activeItem.shortTip}</span>
                        </div>
                      </div>
                    )}

                    {/* Detail Alamat Lengkap & Titik Koordinat */}
                    <div className="text-[10px] text-[#786154] bg-white p-2 rounded-xl border border-[#EFE8DD] flex items-start gap-1.5 leading-snug">
                      <MapPin size={11} className="text-[#C99B52] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-[#2d180c]">{activeItem.locationAddress || activeItem.spotName}</div>
                        {activeItem.coordinates && (
                          <div className="text-[9px] text-[#8c532b] font-mono mt-0.5">
                            Koordinat: {activeItem.coordinates.lat.toFixed(5)}, {activeItem.coordinates.lng.toFixed(5)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section with GPS Prompt */}
                  <div className="p-2.5 border-t border-[#F0EAE1] bg-white flex flex-col gap-2 shrink-0">
                    {/* In-Card GPS Alert untuk Mobile (Nyalakan GPS & Rute dari Titik Nol) */}
                    <AnimatePresence>
                      {showGpsRequiredPrompt && !hasUserGps && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] space-y-1.5 shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#92400E]">
                              <AlertCircle size={13} className="text-[#D97706] shrink-0" />
                              <span>Akses GPS Diperlukan untuk Navigasi Rute</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowGpsRequiredPrompt(false)}
                              className="text-[#92400E] hover:text-[#78350F] p-0.5 cursor-pointer"
                              title="Tutup Peringatan GPS"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <p className="text-[10px] leading-relaxed m-0 text-[#78350F]">
                            Pilih titik awal rute: nyalakan sensor GPS Anda untuk rute real-time, atau mulai dari Titik Nol KM Yogyakarta.
                          </p>
                          {gpsErrorMessage && (
                            <div className="p-1.5 rounded-lg bg-amber-100/90 border border-amber-300 text-[10px] text-amber-900 leading-snug">
                              {gpsErrorMessage}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              type="button"
                              disabled={isGpsRequesting}
                              onClick={handleRequestEnableGps}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-[10px] font-bold transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                            >
                              {isGpsRequesting ? (
                                <>
                                  <div className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                  <span>Menghubungkan...</span>
                                </>
                              ) : (
                                <span>Nyalakan GPS</span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowGpsRequiredPrompt(false);
                                setActiveNavRouteId(activeItem.id);
                                setIsMobilePopupCollapsed(true);
                                if (mapInstanceRef.current && activeItem.coordinates) {
                                  mapInstanceRef.current.fitBounds(
                                    [
                                      [TITIK_NOL_YOGYAKARTA.lat, TITIK_NOL_YOGYAKARTA.lng],
                                      [activeItem.coordinates.lat, activeItem.coordinates.lng]
                                    ],
                                    { padding: [50, 50], maxZoom: 17 }
                                  );
                                }
                              }}
                              className="px-2 py-1.5 rounded-lg bg-white/95 hover:bg-white text-[#78350F] text-[10px] font-bold border border-[#FDE68A] transition-colors cursor-pointer shrink-0"
                              title="Tampilkan rute menggunakan Titik Nol KM sebagai titik awal default"
                            >
                              Rute dari Titik Nol
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fixed Bottom Action Bar - Selalu terlihat dan tidak tenggelam oleh scroll */}
                  <div className="p-2.5 bg-[#FAF8F5] border-t border-[#E8DFC9] flex items-center gap-2 shrink-0">
                    {!activeItem.isCulturalEvent && (
                      <a
                        href={activeItem.hasGofood ? activeItem.gofoodUrl : `https://gofood.co.id/search?q=${encodeURIComponent(activeItem.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex transition-transform hover:scale-105 active:scale-95"
                        title={`Pesan ${activeItem.name} di GoFood`}
                      >
                        <GoFoodBadge
                          size="sm"
                          showExternalIcon={true}
                          rating={activeItem.hasGofood ? activeItem.gofoodRating : undefined}
                          reviews={activeItem.hasGofood ? activeItem.gofoodReviews : undefined}
                          tier={activeItem.hasGofood ? activeItem.gofoodTier : undefined}
                          showRating={Boolean(activeItem.hasGofood && activeItem.gofoodRating)}
                        />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (activeNavRouteId === activeItem.id) {
                          handleEndRoute();
                        } else {
                          handleStartRoute(activeItem);
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                        activeNavRouteId === activeItem.id
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : 'bg-[#2d180c] hover:bg-[#8c532b]'
                      }`}
                    >
                      <Navigation size={12} />
                      <span>{activeNavRouteId === activeItem.id ? 'Akhiri Rute' : 'Petunjuk Rute'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCulinaryWishlistToggle(e, activeItem)}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        isFavorite(activeItem.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-[#E8DFC9] text-[#786154]'
                      }`}
                      title={isFavorite(activeItem.id) ? 'Hapus dari Wishlist' : 'Simpan Wishlist'}
                    >
                      <Heart size={14} fill={isFavorite(activeItem.id) ? '#f43f5e' : 'none'} />
                    </button>
                  </div>
                </motion.div>
              )
            ) : (
              /* --- B. MODE EXPLORER / DAFTAR KULINER (MOBILE TOP) --- */
              isMobilePopupCollapsed ? (
                /* 1. Collapsed Search Pill (Tertutup ke atas - Minimalis ~40px) */
                <motion.div
                  key="list-collapsed"
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobilePopupCollapsed(false)}
                  className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8DFC9] shadow-md p-2 flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] select-none"
                  title="Ketuk untuk mencari atau melihat daftar kuliner"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-[#8c532b]/10 text-[#8c532b] flex items-center justify-center shrink-0">
                      <Search size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-['Outfit'] font-bold text-xs text-[#2d180c] truncate m-0 leading-tight">
                        {searchQuery ? `Cari: "${searchQuery}"` : `Radar Kuliner ${activeZone.wilayahName.split(',')[0]}`}
                      </h3>
                      <p className="text-[10px] text-[#786154] truncate m-0 leading-none mt-0.5">
                        {filteredItems.length} Tempat • Ketuk untuk buka daftar
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#8c532b] bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#E8DFC9] flex items-center gap-0.5 shrink-0">
                    <span>Daftar</span>
                    <ChevronDown size={12} />
                  </span>
                </motion.div>
              ) : (
                /* 2. Expanded Search Drawer (Terbuka ke bawah - Kompak max-h-[46vh]) */
                <motion.div
                  key="list-expanded"
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E8DFC9] shadow-xl flex flex-col max-h-[46vh] overflow-hidden"
                >
                  {/* Accordion Toggle Bar */}
                  <div
                    onClick={() => setIsMobilePopupCollapsed(true)}
                    className="py-1.5 px-3 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between cursor-pointer hover:bg-[#F2ECE1] select-none shrink-0"
                    title="Ketuk untuk menutup popup ke atas"
                  >
                    <div className="flex items-center gap-1.5">
                      <Utensils size={13} className="text-[#8c532b]" />
                      <span className="font-['Outfit'] text-xs font-bold text-[#2d180c]">
                        Radar Kuliner ({filteredItems.length} Tempat)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#8c532b]">
                      <span>Tutup ke atas</span>
                      <ChevronDown size={13} className="rotate-180" />
                    </div>
                  </div>

                  {/* Search Bar & Kawasan Chips */}
                  <div className="p-2.5 pb-2 border-b border-[#F0EAE1] space-y-1.5 shrink-0 bg-white">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c532b]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari gudeg, kopi joss, bakpia..."
                        className="w-full pl-7 pr-7 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E8DFC9] text-[#2d180c] placeholder:text-neutral-400 focus:outline-none focus:border-[#8c532b]"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Zone Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                      {JOGJA_GPS_ZONES.map((zone) => {
                        const isSelected = zone.id === activeZone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => {
                              setSelectedZoneId(zone.id);
                              setSelectedCardId(null);
                              setShowGpsRequiredPrompt(false);
                              if (mapInstanceRef.current && zone.coordinates) {
                                mapInstanceRef.current.flyTo([zone.coordinates.lat, zone.coordinates.lng], 15.5, { duration: 0.7 });
                              }
                            }}
                            className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#2d180c] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#786154] border border-[#E8DFC9]'
                            }`}
                          >
                            {zone.wilayahName.split(',')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* List Tempat Kuliner */}
                  <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
                    {filteredItems.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#786154]">
                        Tidak ada kuliner dalam pencarian ini.
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedCardId(item.id);
                            setShowGpsRequiredPrompt(false);
                            if (mapInstanceRef.current && item.coordinates) {
                              mapInstanceRef.current.flyTo([item.coordinates.lat, item.coordinates.lng], 16.5, { duration: 0.7 });
                            }
                          }}
                          className="p-2 rounded-xl border border-[#E8DFC9] bg-white hover:border-[#8c532b] hover:bg-[#FAF8F5] transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#E8DFC9]"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-['Outfit'] font-bold text-xs text-[#2d180c] truncate m-0 leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-[#786154] truncate m-0 flex items-center gap-1 mt-0.5">
                              <span className="font-bold text-[#8c532b]">{item.distanceLabel}</span>
                              <span>•</span>
                              <span>{item.category || item.spotName}</span>
                            </p>
                          </div>
                          <span className="text-[#8c532b] text-xs font-bold shrink-0">→</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* =========================================================================
            FLOATING MASKOT JOJO (PANDUAN KULINER GUDEG) DI KANAN BAWAH GPS
            (Hanya pada desktop layar besar lg:flex, tersembunyi penuh di layar mobile)
            ========================================================================= */}
        <div className="hidden lg:flex absolute bottom-6 right-7 z-[996] pointer-events-none flex-col items-end select-none">
          {/* Bubble Chat Panduan Kuliner */}
          <motion.div
            key={activeItem ? activeItem.id : 'default-kuliner'}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D9CBB7] shadow-[0_12px_28px_rgba(44,34,30,0.18)] rounded-2xl p-3 sm:p-3.5 max-w-[240px] sm:max-w-[280px] mb-1 relative mr-3 sm:mr-6"
          >
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#8A5D26] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C99B52]" />
              <span>Panduan Kuliner</span>
            </div>

            <p className="text-xs sm:text-[13px] font-bold text-[#2C221E] leading-snug m-0">
              Cobain {getSignatureFood(activeItem)}
            </p>

            <div
              className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/95 border-r border-b border-[#D9CBB7] rotate-45"
            />
          </motion.div>

          {/* Maskot Jojo Memegang Mangkuk Gudeg */}
          <div className="relative">
            <img
              src="/assets/images/mascot_gudeg.webp"
              alt="Jojo Panduan Kuliner Jogja"
              className="w-28 sm:w-36 md:w-44 h-auto object-contain pointer-events-none drop-shadow-[0_15px_25px_rgba(35,20,10,0.25)]"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
