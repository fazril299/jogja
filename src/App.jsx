import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CommunityProvider } from './context/CommunityContext';
import { CultureBookProvider } from './context/CultureBookContext';
import { CULTURAL_PLACES, JOGJA_GPS_ZONES } from './data/culturalData';
import { isSupabaseConfigured, fetchPlacesFromSupabase } from './lib/supabase';

// Auth & Core Modals
import AuthModal from './components/AuthModal';

// Core Blueprint Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import MostLovedDestinations from './components/MostLovedDestinations';
import HandcraftedPackages from './components/HandcraftedPackages';
import OfficialSources from './components/OfficialSources';
import TravelFAQ from './components/TravelFAQ';
import InstagramStories from './components/InstagramStories';
import CTAHeroBanner from './components/CTAHeroBanner';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import ErrorBoundary from './components/ErrorBoundary';

// Cultural Platform Dedicated Modules (Direct imports for instant, seamless zero-latency switching)
import PlaceStorybook from './components/PlaceStorybook';
import NearMeModal from './components/NearMeModal';
import MyCultureBookModal from './components/MyCultureBookModal';
import KalenderAcaraPage from './components/KalenderAcaraPage';
import JurnalBudayaPage from './components/JurnalBudayaPage';
import TentangKamiPage from './components/TentangKamiPage';
import AdminModal from './components/AdminModal';
import ShareExperienceModal from './components/ShareExperienceModal';
import InteractiveMapModal from './components/InteractiveMapModal';
import MascotTourGuide from './components/MascotTourGuide';

// Menghitung jarak geodetik nyata (Haversine Formula) dalam satuan meter
export function calculateRealDistanceMeters(lat1, lng1, lat2, lng2) {
  if (
    typeof lat1 !== 'number' ||
    typeof lng1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lng2 !== 'number'
  ) {
    return null;
  }
  const R = 6371000; // Radius bumi dalam meter
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function formatRealDistance(meters) {
  if (meters === null || meters === undefined) return '';
  if (meters < 1000) return `${meters} m`;
  if (meters < 10000) return `${(meters / 1000).toFixed(2)} km`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Mengecek apakah koordinat GPS berada di dalam batas wilayah Provinsi D.I. Yogyakarta
export function isInsideJogjaBounds(lat, lng) {
  return lat >= -8.22 && lat <= -7.52 && lng >= 110.00 && lng <= 110.86;
}

// Mencari Zona Track Point Wisata Jogja terdekat berdasarkan jarak Haversine asli dari koordinat GPS perangkat
function findNearestJogjaZone(lat, lng) {
  let nearest = JOGJA_GPS_ZONES[0];
  let minMeters = Infinity;
  JOGJA_GPS_ZONES.forEach((zone) => {
    const anchorCoords = zone.wisataAnchor?.coordinates || zone.coordinates;
    const dist = calculateRealDistanceMeters(lat, lng, anchorCoords.lat, anchorCoords.lng);
    if (dist !== null && dist < minMeters) {
      minMeters = dist;
      nearest = zone;
    }
  });
  return { zone: nearest, distanceMeters: minMeters };
}

function NusantaraApp() {
  const [places, setPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem('hamemayu_places_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with master CULTURAL_PLACES so no chapters or fields are missing
          const defaultMap = new Map(CULTURAL_PLACES.map((p) => [p.id, p]));
          const merged = CULTURAL_PLACES.map((dp) => {
            const cached = parsed.find((p) => p.id === dp.id);
            return cached ? { ...dp, ...cached } : dp;
          });
          // Also include any user-created places from Admin
          parsed.forEach((p) => {
            if (!defaultMap.has(p.id)) {
              merged.push(p);
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.error('Error loading cached places:', e);
    }
    return CULTURAL_PLACES;
  });

  // Sync places to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hamemayu_places_v1', JSON.stringify(places));
    } catch (e) {
      console.error('Error saving places to cache:', e);
    }
  }, [places]);

  // Sync places dari Supabase Cloud (jika terhubung)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchPlacesFromSupabase().then((remotePlaces) => {
      if (remotePlaces && remotePlaces.length > 0) {
        const remoteIds = new Set(remotePlaces.map((p) => p.id));
        const merged = [
          ...remotePlaces.map((rp) => rp.details_json || rp),
          ...CULTURAL_PLACES.filter((cp) => !remoteIds.has(cp.id))
        ];
        setPlaces(merged);
      }
    });
  }, []);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [quickViewLandmark, setQuickViewLandmark] = useState(null);

  // Modals & Dedicated GPS Page States
  const [isNearMeOpen, setIsNearMeOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCultureBookOpen, setIsCultureBookOpen] = useState(false);
  const [cultureBookInitialTab, setCultureBookInitialTab] = useState('badges-quests');
  const [isKalenderAcaraOpen, setIsKalenderAcaraOpen] = useState(false);
  const [isKalenderPopupOpen, setIsKalenderPopupOpen] = useState(false);
  const [isJurnalBudayaOpen, setIsJurnalBudayaOpen] = useState(false);
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGlobalShareOpen, setIsGlobalShareOpen] = useState(false);

  const handleOpenCultureBookWithTab = (tab = 'badges-quests') => {
    setIsNearMeOpen(false);
    setSelectedPlace(null);
    setIsKalenderAcaraOpen(false);
    setIsKalenderPopupOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setCultureBookInitialTab(tab);
    setIsCultureBookOpen(true);
  };

  const handleOpenKalenderAcara = () => {
    setIsNearMeOpen(false);
    setIsCultureBookOpen(false);
    setSelectedPlace(null);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsKalenderPopupOpen(false);
    setIsKalenderAcaraOpen(true);
  };

  const handleOpenJurnalBudaya = () => {
    setIsNearMeOpen(false);
    setIsCultureBookOpen(false);
    setSelectedPlace(null);
    setIsKalenderAcaraOpen(false);
    setIsKalenderPopupOpen(false);
    setIsAboutPageOpen(false);
    setIsJurnalBudayaOpen(true);
  };

  const handleOpenAboutUs = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsKalenderPopupOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsCultureBookOpen(false);
    setIsNearMeOpen(false);
    setIsMapOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    setIsAboutPageOpen(true);
  };

  // REAL Hardware GPS Tracking States (Khusus Menyala di Wilayah D.I. Yogyakarta)
  const [autoDetectedZoneId, setAutoDetectedZoneId] = useState(JOGJA_GPS_ZONES[0].id);
  const [userLiveCoords, setUserLiveCoords] = useState(null); // Hanya terisi jika berada di dalam wilayah D.I. Yogyakarta
  const [isOutsideJogja, setIsOutsideJogja] = useState(false);
  const [outsideJogjaCoords, setOutsideJogjaCoords] = useState(null);
  const [userLiveAddress, setUserLiveAddress] = useState('');
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [showGpsNotification, setShowGpsNotification] = useState(false);
  const hasAutoOpenedGpsRef = useRef(false);
  const lastGeocodeCoordsRef = useRef({ lat: 0, lng: 0 });

  const activeGpsZone =
    JOGJA_GPS_ZONES.find((z) => z.id === autoDetectedZoneId) || JOGJA_GPS_ZONES[0];

  // Cari lokasi kuliner terdekat dalam radius 5-10 KM dari posisi di Jogja
  const recommendedFood = React.useMemo(() => {
    const foodList = activeGpsZone.kulinerList;
    if (!userLiveCoords || foodList.length === 0) {
      return foodList[0];
    }
    let closest = foodList[0];
    let minD = Infinity;
    foodList.forEach((item) => {
      if (item.coordinates) {
        const d = calculateRealDistanceMeters(
          userLiveCoords.lat,
          userLiveCoords.lng,
          item.coordinates.lat,
          item.coordinates.lng
        );
        if (d !== null && d <= 10000 && d < minD) {
          minD = d;
          closest = item;
        }
      }
    });
    return closest;
  }, [activeGpsZone, userLiveCoords]);

  // Reverse Geocoding Asli untuk menampilkan nama jalan/kelurahan nyata posisi perangkat
  const fetchRealAddressFromCoords = async (lat, lng) => {
    const movedMeters = calculateRealDistanceMeters(
      lastGeocodeCoordsRef.current.lat,
      lastGeocodeCoordsRef.current.lng,
      lat,
      lng
    );
    if (movedMeters !== null && movedMeters < 35 && userLiveAddress) return;
    lastGeocodeCoordsRef.current = { lat, lng };

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=id`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const shortParts = [
          addr.road || addr.pedestrian || addr.neighbourhood || addr.hamlet,
          addr.village || addr.suburb || addr.town,
          addr.city_district || addr.municipality || addr.city || addr.county,
          addr.state
        ].filter(Boolean);
        setUserLiveAddress(
          shortParts.length > 0 ? shortParts.join(', ') : data.display_name
        );
      }
    } catch {
      // Abaikan jika jaringan offline
    }
  };

  // Memproses hasil pembacaan sensor GPS asli: HANYA MENYALA JIKA DI DALAM WILAYAH D.I. YOGYAKARTA
  const handleRealPositionUpdate = (pos, shouldOpenModal = false) => {
    setIsGpsLoading(false);

    const { latitude, longitude, accuracy, altitude, speed, heading } = pos.coords;
    const inJogja = isInsideJogjaBounds(latitude, longitude);
    const timeStr = new Date(pos.timestamp || Date.now()).toLocaleTimeString('id-ID');

    fetchRealAddressFromCoords(latitude, longitude);

    // JIKA PENGGUNA BERADA DI LUAR WILAYAH D.I. YOGYAKARTA -> GPS TIDAK DAPAT DIGUNAKAN / MATI
    if (!inJogja) {
      setIsOutsideJogja(true);
      setOutsideJogjaCoords({
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy || 0),
        timestamp: timeStr
      });
      setUserLiveCoords(null);
      setShowGpsNotification(false);
      setGpsErrorMsg(
        'Lokasi Anda saat ini terdeteksi berada di luar wilayah D.I. Yogyakarta. Sesuai penguncian wilayah, fitur pelacakan GPS tidak dapat digunakan di luar Jogja dan hanya menyala otomatis saat Anda berada di wilayah D.I. Yogyakarta (Radius Rekomendasi 5–10 KM).'
      );
      return;
    }

    // JIKA PENGGUNA BERADA DI DALAM WILAYAH D.I. YOGYAKARTA -> GPS MENYALA AKTIF (RADIUS 5-10 KM)
    setIsOutsideJogja(false);
    setOutsideJogjaCoords(null);
    setGpsErrorMsg('');

    const realFix = {
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy || 0),
      altitude: altitude ? Math.round(altitude) : null,
      speed: speed ? (speed * 3.6).toFixed(1) : null,
      heading: heading ? Math.round(heading) : null,
      inJogja: true,
      timestamp: timeStr
    };

    setUserLiveCoords(realFix);

    const { zone: nearestZone } = findNearestJogjaZone(latitude, longitude);
    setAutoDetectedZoneId(nearestZone.id);
    setShowGpsNotification(true);

    if (shouldOpenModal && !hasAutoOpenedGpsRef.current) {
      hasAutoOpenedGpsRef.current = true;
      setIsNearMeOpen(true);
    }
  };

  // Fungsi Lacak GPS Hardware Asli (Hanya Aktif Jika di Wilayah D.I. Yogyakarta)
  const triggerDeviceGpsDetection = (autoOpenPage = false) => {
    if (!('geolocation' in navigator)) {
      setGpsErrorMsg('Browser perangkat ini tidak mendukung sensor Geolocation GPS.');
      return;
    }

    setIsGpsLoading(true);
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleRealPositionUpdate(pos, autoOpenPage);
      },
      () => {
        navigator.geolocation.getCurrentPosition(
          (posFallback) => {
            handleRealPositionUpdate(posFallback, autoOpenPage);
          },
          (errFinal) => {
            setIsGpsLoading(false);
            if (errFinal.code === 1) {
              setGpsErrorMsg(
                'Izin lokasi GPS ditolak di browser. Klik ikon gembok/lokasi di address bar browser lalu pilih "Allow / Izinkan" untuk memeriksa apakah Anda berada di wilayah D.I. Yogyakarta.'
              );
            } else if (errFinal.code === 2) {
              setGpsErrorMsg(
                'Sensor lokasi perangkat sedang tidak aktif. Pastikan Location Service di perangkat Anda menyala.'
              );
            } else {
              setGpsErrorMsg(
                'Waktu tunggu pembacaan sensor GPS habis. Klik "Cek Ulang Lokasi GPS" untuk memeriksa ulang.'
              );
            }
          },
          { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };


  // Cek sekali saat aplikasi dibuka: hanya menyalakan GPS jika pengguna di wilayah D.I. Yogyakarta
  useEffect(() => {
    triggerDeviceGpsDetection(false);
  }, []);

  // Hanya pasang active hardware tracking watcher saat modal/peta Near Me sedang aktif dibuka
  useEffect(() => {
    let watchId = null;
    if (isNearMeOpen && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          handleRealPositionUpdate(pos, false);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
      );
    }

    return () => {
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isNearMeOpen]);

  // Lock body & html scroll when any full-screen overlay or modal is active to eliminate double scrollbars
  const isAnyOverlayActive = Boolean(
    isKalenderAcaraOpen ||
    isNearMeOpen ||
    selectedPlace ||
    isJurnalBudayaOpen ||
    isCultureBookOpen ||
    isAdminOpen ||
    isGlobalShareOpen ||
    quickViewLandmark ||
    isMapOpen
  );

  useEffect(() => {
    if (isAnyOverlayActive) {
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [isAnyOverlayActive]);

  // Progressive smooth scroll helper to guarantee viewport moves to section even after unmounting full-screen modals
  const smoothScrollToSection = (sectionId, offset = 85) => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsKalenderPopupOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsNearMeOpen(false);
    setIsCultureBookOpen(false);
    setIsMapOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);

    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };

    performScroll();
    requestAnimationFrame(performScroll);
    setTimeout(performScroll, 50);
    setTimeout(performScroll, 150);
    setTimeout(performScroll, 320);
  };

  // Navigation handlers
  const handleGoHome = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsKalenderPopupOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsNearMeOpen(false);
    setIsCultureBookOpen(false);
    setIsMapOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    const container = document.querySelector('.app-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToDestinations = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsNearMeOpen(false);
    setIsCultureBookOpen(false);
    setIsMapOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    smoothScrollToSection('destinations-section', 85);
  };

  const handleScrollToAbout = () => {
    handleOpenAboutUs();
  };

  const handleOpenNearMe = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsCultureBookOpen(false);
    setIsMapOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    setIsNearMeOpen(true);
  };

  const handleOpenMap = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsCultureBookOpen(false);
    setIsNearMeOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    setIsMapOpen(true);
  };

  const handleOpenAdmin = () => {
    setSelectedPlace(null);
    setQuickViewLandmark(null);
    setIsKalenderAcaraOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsCultureBookOpen(false);
    setIsNearMeOpen(false);
    setIsMapOpen(false);
    setIsGlobalShareOpen(false);
    setIsAdminOpen(true);
  };

  const handleOpenShareModal = () => {
    setIsGlobalShareOpen(true);
  };

  const handleSelectPlaceById = (id) => {
    setQuickViewLandmark(null);
    setIsCultureBookOpen(false);
    setIsNearMeOpen(false);
    setIsMapOpen(false);
    setIsKalenderAcaraOpen(false);
    setIsJurnalBudayaOpen(false);
    setIsAboutPageOpen(false);
    setIsAdminOpen(false);
    setIsGlobalShareOpen(false);
    const found = places.find((p) => p.id === id) || places[0];
    if (found) {
      setSelectedPlace(found);
    }
  };

  const handleOpenMapWithPlace = (place) => {
    setSelectedPlace(place);
    setIsMapOpen(true);
  };

  const handleAddNewPlace = (newPlace) => {
    setPlaces((prev) => [newPlace, ...prev.filter((p) => p.id !== newPlace.id)]);
  };

  const handleDeletePlace = (placeId) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    if (selectedPlace?.id === placeId) {
      setSelectedPlace(null);
    }
  };

  const realDistToRecommendedFood =
    userLiveCoords && recommendedFood?.coordinates
      ? calculateRealDistanceMeters(
          userLiveCoords.lat,
          userLiveCoords.lng,
          recommendedFood.coordinates.lat,
          recommendedFood.coordinates.lng
        )
      : null;

  return (
    <div
      className="app-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: "visible",
        background: '#FAF6EE'
      }}
    >
      {/* =========================================================================
          NOTIFIKASI REAL-TIME GPS PERANGKAT (HANYA MUNCUL JIKA GPS ASLI TERDETEKSI)
          ========================================================================= */}
      <AnimatePresence>
        {showGpsNotification && userLiveCoords && !isNearMeOpen && !selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto w-auto sm:w-[410px] max-w-[calc(100vw-1.5rem)] z-[9990] bg-white text-[#09090b] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-[#0066ff]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ● GPS LIVE AKTIF (±{userLiveCoords.accuracy}m)
              </span>
              <button
                onClick={() => setShowGpsNotification(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                Tutup
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0066ff', fontWeight: 700, marginBottom: '0.35rem' }}>
              Posisi Anda: {userLiveCoords.lat.toFixed(6)}, {userLiveCoords.lng.toFixed(6)}
              {realDistToRecommendedFood !== null && ` (${formatRealDistance(realDistToRecommendedFood)} ke lokasi)`}
            </div>

            {userLiveAddress && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.76rem', color: '#52525b', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                <MapPin size={12} color="#000000" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{userLiveAddress}</span>
              </div>
            )}

            <h4 style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontSize: '1.18rem', fontWeight: 700, color: '#09090b', margin: '0 0 0.2rem 0' }}>
              {recommendedFood?.name}
            </h4>

            <div style={{ fontSize: '0.82rem', color: '#71717a', marginBottom: '0.4rem', lineHeight: 1.4 }}>
              Zona Terdekat: {activeGpsZone.wisataAnchor?.trackCode || 'WISATA'} ({activeGpsZone.wilayahName.split(',')[0]}) • {recommendedFood?.spotName}
            </div>

            <div style={{ height: '1px', backgroundColor: '#e4e4e7', margin: '0.75rem 0' }} />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${recommendedFood?.coordinates?.lat},${recommendedFood?.coordinates?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginBottom: '0.9rem', color: '#2563eb', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
            >
              Periksa informasi terbaru di Google Maps
            </a>

            <button
              onClick={() => setIsNearMeOpen(true)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '9999px',
                backgroundColor: '#0066ff',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Buka Peta & Lacak GPS Real-Time
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SINGLE PERSISTENT TOP GLASS PILL NAVBAR (Visible on ALL pages, hidden only when popup modal is active) */}
      {!isKalenderPopupOpen && (
        <Navbar
          currentView={
            selectedPlace
              ? 'storybook'
              : isKalenderAcaraOpen
              ? 'kalender'
              : isJurnalBudayaOpen
              ? 'jurnal'
              : isAboutPageOpen
              ? 'tentang'
              : isNearMeOpen
              ? 'kuliner'
              : 'home'
          }
          onOpenBooking={() => handleSelectPlaceById('keraton-yogyakarta')}
          onSelectPlaceById={handleSelectPlaceById}
          onGoHome={handleGoHome}
          onOpenDestinations={handleScrollToDestinations}
          onOpenAboutUs={handleOpenAboutUs}
          onOpenTours={() => handleSelectPlaceById('keraton-yogyakarta')}
          onOpenBlogs={() => handleOpenCultureBookWithTab('jurnal')}
          onOpenNearMe={handleOpenNearMe}
          onOpenMap={handleOpenMap}
          onOpenCultureBook={() => handleOpenCultureBookWithTab('badges-quests')}
          onOpenCultureEvents={handleOpenKalenderAcara}
          onOpenCultureJournals={handleOpenJurnalBudaya}
          onOpenKalenderAcara={handleOpenKalenderAcara}
          onOpenJurnalBudaya={handleOpenJurnalBudaya}
          onOpenAdmin={handleOpenAdmin}
          onOpenShareModal={handleOpenShareModal}
        />
      )}

      {/* 2. FULL-BLEED OCEAN VIDEO HERO WITH 4 YOGYAKARTA FLOATING PILLS & GPS TRIGGER */}
      <Hero
        onOpenBooking={() => handleSelectPlaceById('keraton-yogyakarta')}
        onOpenNearMe={handleOpenNearMe}
        onSelectLandmark={(landmark) => {
          const match = places.find((p) => p.id === landmark.id);
          if (match) {
            setSelectedPlace(match);
          } else {
            setQuickViewLandmark(landmark);
          }
        }}
      />

      {/* CURTAIN OVERLAP CONTAINER FOR SECTIONS AFTER HERO */}
      <div className="relative z-20 w-full bg-[#FAF6EE] text-[#1a1a1a]">
        {/* 3. ABOUT SECTION - YOGYAKARTA MANIFESTO & EXPLORE BY EXPERIENCE */}
        <AboutSection
          onOpenBooking={handleScrollToDestinations}
          onOpenAboutUs={handleScrollToAbout}
          onSelectPlaceById={handleSelectPlaceById}
          onOpenNearMe={handleOpenNearMe}
        />

        {/* 4. PINNED 400VH 3D TILT DESTINATIONS WITH FAN-OUT PHOTOS (YOGYAKARTA ICONS) */}
        <MostLovedDestinations
          onOpenBooking={() => handleSelectPlaceById('keraton-yogyakarta')}
          onOpenJapanDetail={() => handleSelectPlaceById('keraton-yogyakarta')}
          onOpenSwissDetail={() => handleSelectPlaceById('malioboro-tugu')}
          onOpenParisDetail={() => handleSelectPlaceById('kotagede')}
          onOpenNYDetail={() => handleSelectPlaceById('merapi-kaliurang')}
          onOpenPrambananDetail={() => handleSelectPlaceById('prambanan-ratuboko')}
          onSelectPlaceById={handleSelectPlaceById}
        />

        {/* 5. HANDCRAFTED YOGYAKARTA CULTURAL & CULINARY EXPEDITIONS */}
        <HandcraftedPackages
          id="packages"
          onOpenBooking={() => handleSelectPlaceById('keraton-yogyakarta')}
          onOpenTourDetail={(pkg) => handleSelectPlaceById(pkg?.id || 'keraton-yogyakarta')}
        />

        {/* 6. INFORMASI DENGAN RUJUKAN RESMI */}
        <OfficialSources />

        {/* 7. TRAVEL FAQ */}
        <TravelFAQ id="faq-section" />

        {/* 8. INSTAGRAM STORIES PHOTO MARQUEE */}
        <InstagramStories onSelectPlaceById={handleSelectPlaceById} />

        {/* 9. CTA HERO BANNER & CONTINUOUS TICKER */}
        <CTAHeroBanner onOpenBooking={handleScrollToDestinations} />

        {/* 10. MODERN DARK FOOTER */}
        <Footer
          onOpenAboutUs={handleOpenAboutUs}
          onOpenNearMe={handleOpenNearMe}
          onOpenMap={handleOpenMap}
          onOpenCultureBook={() => handleOpenCultureBookWithTab('badges-quests')}
          onOpenCultureEvents={handleOpenKalenderAcara}
          onOpenCultureJournals={handleOpenJurnalBudaya}
          onOpenKalenderAcara={handleOpenKalenderAcara}
          onOpenJurnalBudaya={handleOpenJurnalBudaya}
          onOpenAdmin={handleOpenAdmin}
          onOpenShareModal={handleOpenShareModal}
          onSelectPlaceById={(placeId) => handleSelectPlaceById(placeId)}
        />
      </div>

      {/* 11. DYNAMIC CULTURAL MASCOT TOUR GUIDE (JOJO) - PRESENT ON ALL PAGES (EXCEPT HERO SECTION) */}
      {!isKalenderPopupOpen && (
        <MascotTourGuide
          currentView={
            selectedPlace
              ? 'storybook'
              : isKalenderAcaraOpen
              ? 'kalender'
              : isJurnalBudayaOpen
              ? 'jurnal'
              : isAboutPageOpen
              ? 'tentang'
              : isNearMeOpen
              ? 'kuliner'
              : isCultureBookOpen
              ? 'paspor'
              : isMapOpen
              ? 'peta'
              : 'home'
          }
          selectedPlace={selectedPlace}
          onNavigateSection={(secId) => smoothScrollToSection(secId, 85)}
        />
      )}

      {/* =========================================================================
          MODALS & DEDICATED FULL-SCREEN PAGES
          ========================================================================= */}

      {/* Dedicated Modals & Full-Screen Pages */}
        {/* Interactive Yogyakarta Destinations & Place Storybook Page */}
        <AnimatePresence>
          {selectedPlace && (
            <ErrorBoundary onReset={() => setSelectedPlace(null)}>
              <PlaceStorybook
                place={selectedPlace}
                places={places}
                onSelectPlace={(p) => setSelectedPlace(p)}
                onBack={() => setSelectedPlace(null)}
                onOpenMapWithPlace={handleOpenMapWithPlace}
                onOpenCultureBook={() => setIsCultureBookOpen(true)}
              />
            </ErrorBoundary>
          )}
        </AnimatePresence>

        {/* Quick View Modal for Floating Landmark Cards */}
        <QuickViewModal
          landmark={quickViewLandmark}
          onClose={() => setQuickViewLandmark(null)}
          onBookLandmark={(lm) => {
            const targetId = lm?.id || quickViewLandmark?.id;
            if (targetId) {
              handleSelectPlaceById(targetId);
            } else {
              handleScrollToExplore();
            }
            setQuickViewLandmark(null);
          }}
          onViewFullItinerary={() => {
            if (quickViewLandmark) {
              handleSelectPlaceById(quickViewLandmark.id);
            }
            setQuickViewLandmark(null);
          }}
        />

        {/* HALAMAN KHUSUS GPS REAL-TIME AKURAT (TERKUNCI KHUSUS WILAYAH JOGJA & RADIUS 5-10 KM) */}
        {isNearMeOpen && (
          <NearMeModal
            isOpen={isNearMeOpen}
            onClose={() => setIsNearMeOpen(false)}
            places={places}
            onSelectPlace={(place) => setSelectedPlace(place)}
            autoDetectedZoneId={autoDetectedZoneId}
            userLiveCoords={userLiveCoords}
            isOutsideJogja={isOutsideJogja}
            outsideJogjaCoords={outsideJogjaCoords}
            userLiveAddress={userLiveAddress}
            gpsErrorMsg={gpsErrorMsg}
            onRefreshDeviceGps={() => triggerDeviceGpsDetection(false)}
            isGpsLoading={isGpsLoading}
          />
        )}

        {/* My Culture Book (Paspor Budaya) Drawer */}
        {isCultureBookOpen && (
          <MyCultureBookModal
            isOpen={isCultureBookOpen}
            initialTab={cultureBookInitialTab}
            onClose={() => setIsCultureBookOpen(false)}
            places={places}
            userLiveCoords={userLiveCoords}
            userLiveAddress={userLiveAddress}
            onRefreshGps={() => triggerDeviceGpsDetection(false)}
            isGpsLoading={isGpsLoading}
            onSelectPlace={(place) => {
              setIsCultureBookOpen(false);
              setSelectedPlace(place);
            }}
          />
        )}

        {/* HALAMAN DEDIKASI 1: KALENDER ACARA BUDAYA JOGJA (DATA REAL, TANGGAL, JAM, BULAN, TAHUN) */}
        {isKalenderAcaraOpen && (
          <KalenderAcaraPage
            isOpen={isKalenderAcaraOpen}
            onClose={() => {
              setIsKalenderAcaraOpen(false);
              setIsKalenderPopupOpen(false);
            }}
            onPopupChange={setIsKalenderPopupOpen}
            onSelectPlace={(place) => {
              setIsKalenderAcaraOpen(false);
              setIsKalenderPopupOpen(false);
              setSelectedPlace(place);
            }}
          />
        )}

        {/* HALAMAN DEDIKASI 2: JURNAL BUDAYA & PANDUAN CARA BERBUDAYA DENGAN BENAR (FOTO ASSET & CONTOH) */}
        {isJurnalBudayaOpen && (
          <JurnalBudayaPage
            isOpen={isJurnalBudayaOpen}
            onClose={() => setIsJurnalBudayaOpen(false)}
          />
        )}

        {/* HALAMAN DEDIKASI 3: TENTANG KAMI & PENGENALAN FITUR WEB HAMEMAYU */}
        {isAboutPageOpen && (
          <TentangKamiPage
            isOpen={isAboutPageOpen}
            onClose={() => setIsAboutPageOpen(false)}
            onOpenKalender={handleOpenKalenderAcara}
            onOpenMap={handleOpenMap}
            onOpenNearMe={handleOpenNearMe}
            onOpenJurnal={handleOpenJurnalBudaya}
            onOpenCultureBook={() => handleOpenCultureBookWithTab('badges-quests')}
          />
        )}

        {/* Admin Panel & CMS Modal */}
        {isAdminOpen && (
          <AdminModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            places={places}
            onAddNewPlace={handleAddNewPlace}
            onDeletePlace={handleDeletePlace}
          />
        )}

        {/* Global Authentication Modal (Login / Register with Benefit Triggers) */}
        <AuthModal />

        {/* Global Share Experience Modal */}
        {isGlobalShareOpen && (
          <ShareExperienceModal
            isOpen={isGlobalShareOpen}
            onClose={() => setIsGlobalShareOpen(false)}
            places={places}
          />
        )}

        {/* Peta Budaya & Cagar Wisata DIY Modal */}
        {isMapOpen && (
          <InteractiveMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => {
              setIsMapOpen(false);
              setSelectedPlace(place);
            }}
          />
        )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CultureBookProvider>
          <CommunityProvider>
            <NusantaraApp />
          </CommunityProvider>
        </CultureBookProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
