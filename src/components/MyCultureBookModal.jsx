import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Check,
  Heart,
  Trash2,
  Plus,
  ShieldCheck,
  Award,
  Compass,
  Sparkles,
  Navigation,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  LogOut,
  LogIn
} from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';
import { useAuth } from '../context/AuthContext';
import { CULTURAL_BADGES, CULTURAL_QUESTS, BADGE_TIERS } from '../data/badgeQuestData';
import { getHaversineDistance } from '../utils/gpsSecurity';

export default function MyCultureBookModal({
  isOpen,
  onClose,
  places = [],
  onSelectPlace,
  userLiveCoords,
  userLiveAddress,
  onRefreshGps,
  isGpsLoading
}) {
  const [activeTab, setActiveTab] = useState('badges-quests'); // Default langsung ke panduan badge
  const [selectedNotePlaceId, setSelectedNotePlaceId] = useState(
    places[0]?.id || 'keraton-yogyakarta'
  );
  const [noteInput, setNoteInput] = useState('');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  // Verifikasi GPS State
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [verifyingPlaceId, setVerifyingPlaceId] = useState(null);

  const {
    cultureBook,
    getStats,
    hasStamp,
    verifyGpsVisit,
    saveUserNote,
    isBadgeUnlocked,
    isGpsVerified,
    getVerifiedVisitData,
    getBadgeTierStats
  } = useCultureBook();
  const { currentUser, openLogin, logout } = useAuth();

  if (!isOpen) return null;

  const totalPlaces = places.length || 6;
  const stats = getStats(totalPlaces);
  const tierStats = getBadgeTierStats ? getBadgeTierStats() : {
    umum: { total: 2, unlocked: 1 },
    langka: { total: 3, unlocked: 1 },
    epic: { total: 2, unlocked: 0 },
    legendaris: { total: 2, unlocked: 2 }
  };

  const isGuest = !currentUser || currentUser.isGuest;
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('192.168.'));
  const displayName =
    currentUser && !currentUser.isGuest ? currentUser.name : 'Penjelajah Jogja';
  const displayRole =
    currentUser && !currentUser.isGuest
      ? (currentUser.role === 'admin' || currentUser.email === 'admin@jogjakrama.id' || currentUser.email === 'fazrielmuliyael@gmail.com'
          ? `${currentUser.email || 'Admin'} • Administrator Sistem @ JogjaKrama`
          : `${currentUser.email || 'Member'} • Penjelajah Budaya @ JogjaKrama`)
      : 'Profil Penjelajah @ Mode Tamu';
  const displayAvatar =
    currentUser?.avatar || '/assets/images/jogja_batik.jpg';

  // 4 Ikon Badge Bulat Asli Eastward Berwarna Khas Jogja
  const portfolioBadges = [
    { id: 'b-cul', title: 'Warisan Budaya', bg: '#2C221E', iconSrc: '/images/icon_culture.svg' },
    { id: 'b-kul', title: 'Kuliner Otentik', bg: '#9E1C64', iconSrc: '/images/icon_culinary.svg' },
    { id: 'b-sou', title: 'Jiwa & Tradisi', bg: '#C99B52', iconSrc: '/images/icon_all.svg' },
    { id: 'b-nat', title: 'Wisata Alam', bg: '#6E473B', iconSrc: '/images/icon_nature.svg' }
  ];
  const headerMiniBadges = portfolioBadges;

  const skillTags = [
    'Sumbu Filosofis UNESCO',
    'Warisan Mataram Islam',
    'Sentra Gudeg Wijilan',
    'Kerajinan Perak Kotagede',
    'Gerabah Kasongan',
    'Lereng Merapi'
  ];

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    saveUserNote(selectedNotePlaceId, noteInput.trim());
    setNoteInput('');
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2200);
  };

  // Handler Klaim Badge Langsung via Sensor GPS Nyata (Dengan Dukungan Simulasi Dev Localhost)
  const handleClaimBadgeViaGps = (place, forceSimulatedCoords = null) => {
    if (!place) return;
    setVerifyingPlaceId(place.id);
    setVerificationFeedback(null);

    const executeVerification = (coords) => {
      const res = verifyGpsVisit(place, coords, currentUser?.id || 'guest');
      setVerifyingPlaceId(null);
      if (res.success) {
        setVerificationFeedback({
          type: 'success',
          title: 'Klaim Badge Sukses!',
          message: res.message,
          placeName: place.name,
          unlockedBadges: res.unlockedBadges
        });
      } else {
        setVerificationFeedback({
          type: 'error',
          title: 'Klaim Lokasi Belum Memenuhi Syarat',
          message: res.message,
          distanceMeters: res.distanceMeters,
          placeName: place.name
        });
      }
    };

    if (forceSimulatedCoords) {
      executeVerification(forceSimulatedCoords);
      return;
    }

    if (userLiveCoords && typeof userLiveCoords.lat === 'number') {
      executeVerification(userLiveCoords);
    } else {
      if (onRefreshGps) onRefreshGps();
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const live = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 15),
              isMocked: pos.mocked || pos.coords.isMocked,
              timestamp: pos.timestamp || Date.now()
            };
            executeVerification(live);
          },
          () => {
            setVerifyingPlaceId(null);
            setVerificationFeedback({
              type: 'error',
              title: 'Izin Sensor GPS Ditolak',
              message: 'Izinkan akses lokasi di browser untuk memverifikasi bahwa Anda berada di lokasi cagar budaya.'
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setVerifyingPlaceId(null);
        setVerificationFeedback({
          type: 'error',
          title: 'Sensor GPS Tidak Tersedia',
          message: 'Perangkat atau browser ini tidak mendukung pembacaan koordinat Geolocation.'
        });
      }
    }
  };



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99995,
          backgroundColor: '#FAF8F5',
          color: '#2C221E',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: 'clamp(1rem, 2.5vw, 2rem)'
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            paddingTop: '3.5rem',
            paddingBottom: '3.5rem'
          }}
        >
          {/* ===================================================================
              TOP PROFILE HEADER CARD
              =================================================================== */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EAE4DC',
              boxShadow: '0 8px 28px rgba(44, 34, 30, 0.04)',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}
          >
            {/* Banner Keraton */}
            <div
              style={{
                position: 'relative',
                height: '150px',
                backgroundColor: '#2C221E',
                overflow: 'hidden'
              }}
            >
              <img
                src="/assets/images/jogja_tamansari.jpg"
                alt="Yogyakarta Heritage Banner"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                  display: 'block'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(44, 34, 30, 0.6) 0%, rgba(44, 34, 30, 0.25) 55%, rgba(44, 34, 30, 0.55) 100%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  zIndex: 10
                }}
              >
                {!isGuest && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 241, 242, 0.95)',
                      border: '1px solid #FECDD3',
                      color: '#BE123C',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(44, 34, 30, 0.12)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.15s ease'
                    }}
                    title="Keluar dari akun"
                  >
                    <LogOut size={13} />
                    <span>Keluar Akun</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(250, 248, 245, 0.95)',
                    border: '1px solid #E5DEC9',
                    color: '#2C221E',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(44, 34, 30, 0.12)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <X size={14} />
                  <span>Tutup Profil</span>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ padding: '0 clamp(1.25rem, 3vw, 2.5rem) 1.5rem', position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '-44px',
                  marginBottom: '1rem'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '3.5px solid #FFFFFF',
                    boxShadow: '0 6px 18px rgba(44, 34, 30, 0.14)',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '999px',
                      backgroundColor: '#FAF6EE',
                      border: '1px solid #E5D7BE',
                      color: '#8A5D26',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    <Sparkles size={13} color="#8A5D26" />
                    <span>Paspor Budaya D.I. Yogyakarta</span>
                  </div>

                  {!isGuest ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '999px',
                        backgroundColor: '#FFF1F2',
                        border: '1px solid #FECDD3',
                        color: '#BE123C',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Keluar dari akun"
                    >
                      <LogOut size={13} />
                      <span>Keluar Akun</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openLogin({
                          benefitType: 'general',
                          title: 'Masuk ke JogjaKrama',
                          description: 'Simpan riwayat kunjungan dan koleksi badge Anda secara permanen.'
                        })
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '999px',
                        backgroundColor: '#2C221E',
                        border: '1px solid #2C221E',
                        color: '#FAF8F5',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Masuk atau Buat Akun"
                    >
                      <LogIn size={13} />
                      <span>Masuk Akun</span>
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                    fontWeight: 800,
                    color: '#2C221E',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {displayName}
                </h2>
                <span
                  style={{
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    backgroundColor: '#FAF6EE',
                    border: '1px solid #E5DEC9',
                    color: '#8A5D26',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  {isGuest ? 'Mode Tamu' : 'Penjelajah Terdaftar'}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#6E5D52', marginTop: '0.25rem', fontWeight: 500 }}>
                {displayRole}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.8rem',
                  color: '#786B5E',
                  marginTop: '0.45rem'
                }}
              >
                <MapPin size={13} color="#9E1C64" />
                <span>
                  {userLiveAddress
                    ? `Lokasi: ${userLiveAddress}`
                    : 'Daerah Istimewa Yogyakarta, Indonesia'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginTop: '1.1rem',
                  paddingTop: '0.9rem',
                  borderTop: '1px solid #F2EDE4',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A5D26', marginRight: '0.25rem' }}>
                  Ikon Warisan:
                </span>
                {portfolioBadges.map((b) => (
                  <div
                    key={b.id}
                    title={b.title}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: b.bg,
                      border: '1.5px solid rgba(44, 34, 30, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(44, 34, 30, 0.12)'
                    }}
                  >
                    <img
                      src={b.iconSrc}
                      alt={b.title}
                      style={{
                        width: '16px',
                        height: '16px',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===================================================================
              MAIN 2-COLUMN GRID (Sidebar Kiri + Konten Utama Kanan)
              =================================================================== */}
          <div className="paspor-main-grid">
            <style>{`
              .paspor-main-grid {
                display: grid;
                grid-template-columns: 310px minmax(0, 1fr);
                gap: 1.5rem;
                align-items: start;
              }
              @media (max-width: 900px) {
                .paspor-main-grid {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>

            {/* =================================================================
                KOLOM KIRI: STATUS KOLEKSI & CHECKLIST TEMPAT GPS
                ================================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* KARTU 1: RINGKASAN KOLEKSI BADGE */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EAE4DC',
                  padding: '1.25rem',
                  boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#2C221E',
                    paddingBottom: '0.75rem',
                    marginBottom: '0.85rem',
                    borderBottom: '1px solid #F2EDE4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={16} color="#8A5D26" />
                    <span>Koleksi Badge Saya</span>
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#8A5D26',
                      backgroundColor: '#FAF6EE',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      border: '1px solid #E5D7BE'
                    }}
                  >
                    {(cultureBook.unlockedBadgeIds || []).length} / {CULTURAL_BADGES.length} Terbuka
                  </span>
                </div>

                {/* Progress bar perolehan */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F4EFE6', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.9rem' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round(((cultureBook.unlockedBadgeIds || []).length / CULTURAL_BADGES.length) * 100)}%`,
                      backgroundColor: '#2C221E',
                      borderRadius: '999px'
                    }}
                  />
                </div>

                {/* 4 Ikon Bulat Khas Jogja Asli (Tanpa Emoji) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  {portfolioBadges.map((badge) => (
                    <div
                      key={badge.id}
                      title={badge.title}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: badge.bg,
                          border: '1.5px solid rgba(44, 34, 30, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 3px 8px rgba(44, 34, 30, 0.12)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <img
                          src={badge.iconSrc}
                          alt={badge.title}
                          style={{
                            width: '20px',
                            height: '20px',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: '#6E5D52',
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}
                      >
                        {badge.title}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('badges-quests')}
                  style={{
                    marginTop: '0.9rem',
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: '#2C221E',
                    color: '#FAF8F5',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>Cara Klaim Badge Lengkap</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* KARTU 2: CHECKLIST TEMPAT DIKUNJUNGI (GPS CHECK-IN) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EAE4DC',
                  padding: '1.25rem',
                  boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#2C221E',
                    paddingBottom: '0.75rem',
                    marginBottom: '0.65rem',
                    borderBottom: '1px solid #F2EDE4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Checklist Tempat GPS</span>
                  <span
                    style={{
                      padding: '0.18rem 0.6rem',
                      borderRadius: '999px',
                      backgroundColor: '#F4EFE6',
                      color: '#2C221E',
                      fontSize: '0.74rem',
                      fontWeight: 700
                    }}
                  >
                    {stats.gpsVerifiedCount || cultureBook.visitedPlaces.length}/{totalPlaces}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {places.map((place, index) => {
                    const isGpsDone = isGpsVerified(place.id);
                    const distNow = userLiveCoords && place.coordinates
                      ? getHaversineDistance(userLiveCoords, place.coordinates)
                      : null;

                    return (
                      <div
                        key={place.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.65rem 0',
                          borderBottom:
                            index < places.length - 1 ? '1px solid #F5F1EA' : 'none'
                        }}
                      >
                        <div
                          onClick={() => onSelectPlace && onSelectPlace(place)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: 0,
                            cursor: 'pointer'
                          }}
                          title={`Buka Cerita & Informasi ${place.name}`}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: isGpsDone ? '#2C221E' : '#F4EFE6',
                              color: isGpsDone ? '#FFFFFF' : '#786B5E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              flexShrink: 0
                            }}
                          >
                            {index + 1}
                          </div>
                          <span
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: '#3D312A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#8A5D26')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#3D312A')}
                          >
                            {place.name.split('&')[0]}
                          </span>
                        </div>

                        {isGpsDone ? (
                          <div
                            title="Telah Dikunjungi"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#DCFCE7',
                              border: '1px solid #BBF7D0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Check size={14} color="#15803D" strokeWidth={3} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleClaimBadgeViaGps(place)}
                            disabled={verifyingPlaceId === place.id}
                            style={{
                              padding: '0.26rem 0.6rem',
                              borderRadius: '6px',
                              backgroundColor: distNow !== null && distNow <= 1500 ? '#2C221E' : '#FAF8F5',
                              border: distNow !== null && distNow <= 1500 ? '1px solid #C99B52' : '1px solid #DCD3C6',
                              color: distNow !== null && distNow <= 1500 ? '#FAF8F5' : '#8A5D26',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              flexShrink: 0,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {verifyingPlaceId === place.id ? 'Memeriksa...' : distNow !== null && distNow <= 1500 ? 'Klaim Sekarang' : 'Cek GPS'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KARTU 3: KATEGORI BUDAYA */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EAE4DC',
                  padding: '1.25rem'
                }}
              >
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#2C221E',
                    paddingBottom: '0.75rem',
                    marginBottom: '0.85rem',
                    borderBottom: '1px solid #F2EDE4'
                  }}
                >
                  Kategori Budaya
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {skillTags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DCD3C6',
                        color: '#3D312A',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================================
                KOLOM KANAN: TAB CONTENT & PANDUAN CARA DAPAT BADGE
                ================================================================= */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #EAE4DC',
                padding: 'clamp(1.25rem, 2.5vw, 2rem)'
              }}
            >
              {/* Tab Navigation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.75rem',
                  borderBottom: '1px solid #F2EDE4',
                  marginBottom: '1.5rem',
                  overflowX: 'auto'
                }}
              >
                {[
                  {
                    id: 'badges-quests',
                    label: `Koleksi & Cara Klaim Badge (${(cultureBook.unlockedBadgeIds || []).length}/${CULTURAL_BADGES.length})`
                  },
                  { id: 'background', label: 'Ringkasan Profil' },
                  {
                    id: 'wishlist',
                    label: `Wishlist (${cultureBook.favorites?.length || 0})`
                  },
                  {
                    id: 'notes',
                    label: `Catatan (${Object.keys(cultureBook.userNotes || {}).length})`
                  }
                ].map((tab) => {
                  const isAct = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '0.15rem 0 0.85rem 0',
                        background: 'none',
                        border: 'none',
                        borderBottom: isAct
                          ? '2.5px solid #2C221E'
                          : '2.5px solid transparent',
                        color: isAct ? '#2C221E' : '#786B5E',
                        fontSize: '0.84rem',
                        fontWeight: isAct ? 800 : 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* FEEDBACK TOAST / ALERT UNTUK VERIFIKASI GPS */}
              {verificationFeedback && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor:
                      verificationFeedback.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    border: `1.5px solid ${
                      verificationFeedback.type === 'success' ? '#BBF7D0' : '#FECACA'
                    }`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  {verificationFeedback.type === 'success' ? (
                    <CheckCircle2 size={20} color="#15803D" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} color="#B91C1C" style={{ marginTop: '2px', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        color: verificationFeedback.type === 'success' ? '#15803D' : '#B91C1C',
                        marginBottom: '0.2rem'
                      }}
                    >
                      {verificationFeedback.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: verificationFeedback.type === 'success' ? '#166534' : '#991B1B',
                        lineHeight: 1.5
                      }}
                    >
                      {verificationFeedback.message}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationFeedback(null)}
                    style={{ background: 'none', border: 'none', color: '#786B5E', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* ===============================================================
                  TAB 1: KOLEKSI BADGE & CARA KLAIM (FOKUS UTAMA)
                  =============================================================== */}
              {activeTab === 'badges-quests' && (
                <div>
                  {/* HERO BANNER: 3 LANGKAH CARA MENDAPATKAN BADGE */}
                  <div
                    style={{
                      padding: '1.35rem 1.5rem',
                      borderRadius: '16px',
                      backgroundColor: '#FAF8F5',
                      border: '1.5px solid #EAE0D0',
                      marginBottom: '2rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <Compass size={18} color="#8A5D26" />
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#2C221E',
                          margin: 0
                        }}
                      >
                        Cara Mendapatkan Badge Budaya
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#6E5D52', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                      Badge cagar budaya Yogyakarta hanya dapat dibuka saat Anda benar-benar berada di lokasi fisik melalui sistem GPS asli:
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #ECE4D8'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8A5D26', backgroundColor: '#FAF6EE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            Langkah 1
                          </span>
                          <strong style={{ fontSize: '0.8rem', color: '#2C221E' }}>Kunjungi Lokasi</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.74rem', color: '#6E5D52', lineHeight: 1.45 }}>
                          Datang langsung ke cagar budaya target (Keraton, Malioboro, Kotagede, Prambanan, dll).
                        </p>
                      </div>

                      <div
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #ECE4D8'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8A5D26', backgroundColor: '#FAF6EE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            Langkah 2
                          </span>
                          <strong style={{ fontSize: '0.8rem', color: '#2C221E' }}>Buka Aplikasi</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.74rem', color: '#6E5D52', lineHeight: 1.45 }}>
                          Pastikan izin lokasi browser aktif dalam radius maksimal 1.5 KM dari titik cagar budaya.
                        </p>
                      </div>

                      <div
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #ECE4D8'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#8A5D26', backgroundColor: '#FAF6EE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            Langkah 3
                          </span>
                          <strong style={{ fontSize: '0.8rem', color: '#2C221E' }}>Klik Klaim GPS</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.74rem', color: '#6E5D52', lineHeight: 1.45 }}>
                          Tekan tombol "Klaim Badge GPS". Sistem memvalidasi koordinat sah dan badge langsung tersimpan permanen!
                        </p>
                      </div>
                    </div>

                    {/* Sensor Live Bar */}
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #EAE0D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.76rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#5C4E43' }}>
                        <MapPin size={14} color="#9E1C64" />
                        <span>
                          {userLiveCoords
                            ? 'Lokasi Aktif: Terhubung ke Wilayah D.I. Yogyakarta'
                            : 'Lokasi belum terdeteksi. Izinkan akses GPS untuk mengklaim badge.'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={onRefreshGps}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '999px',
                          backgroundColor: '#2C221E',
                          color: '#FAF8F5',
                          border: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Sinkronkan GPS</span>
                      </button>
                    </div>
                  </div>

                  {/* TOOLBAR UJI COBA GPS LOCALHOST KHUSUS DEVELOPER */}
                  {isLocalhost && (
                    <div
                      style={{
                        marginBottom: '1.5rem',
                        padding: '1rem 1.25rem',
                        borderRadius: '14px',
                        backgroundColor: '#FFFBEB',
                        border: '1.5px dashed #D97706',
                        color: '#92400E'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', fontWeight: 800, fontSize: '0.82rem' }}>
                        <Sparkles size={15} color="#D97706" />
                        <span>Mode Uji Coba GPS Localhost (Aktif)</span>
                      </div>
                      <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.74rem', lineHeight: 1.45, color: '#78350F' }}>
                        Saat pengujian di komputer/laptop localhost, Anda dapat mengklik tombol simulasi destinasi di bawah ini untuk menguji klaim tiap badge secara instan tanpa terhambat batas wilayah nyata:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                        {places.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              const simCoords = {
                                ...p.coordinates,
                                accuracy: 12,
                                isSimulated: true,
                                timestamp: Date.now()
                              };
                              handleClaimBadgeViaGps(p, simCoords);
                            }}
                            disabled={verifyingPlaceId === p.id}
                            style={{
                              padding: '0.32rem 0.75rem',
                              borderRadius: '999px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D97706',
                              color: '#92400E',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                            }}
                          >
                            {verifyingPlaceId === p.id ? 'Menguji...' : `Uji Klaim: ${p.name.split('&')[0].trim()}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KATALOG DAFTAR BADGE & CARA DAPATNYA */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#2C221E',
                          margin: 0
                        }}
                      >
                        Daftar Badge & Panduan Klaim
                      </h3>

                      <span style={{ fontSize: '0.74rem', color: '#786B5E' }}>
                        Buka badge dengan mengunjungi cagar budaya secara nyata
                      </span>
                    </div>

                    {/* Grid Kartu Badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {CULTURAL_BADGES.map((badge) => {
                        const isUnlocked = isBadgeUnlocked(badge.id);
                        const targetPlace = places.find((p) => p.id === badge.targetPlaceId);
                        const maxRadius = badge.maxRadiusMeters || 1500;

                        // Jarak GPS nyata sesuai sensor perangkat
                        const distNow = userLiveCoords && targetPlace?.coordinates
                          ? getHaversineDistance(userLiveCoords, targetPlace.coordinates)
                          : null;
                        const isInRange = distNow !== null && distNow <= maxRadius;

                        return (
                          <div
                            key={badge.id}
                            style={{
                              padding: '1.25rem 1.45rem',
                              borderRadius: '16px',
                              backgroundColor: '#FFFFFF',
                              border: isUnlocked
                                ? '1.5px solid #2C221E'
                                : isInRange
                                ? '1.5px solid #059669'
                                : '1px solid #EAE3D6',
                              boxShadow: isUnlocked
                                ? '0 8px 24px rgba(44, 34, 30, 0.06)'
                                : '0 2px 8px rgba(44, 34, 30, 0.02)',
                              position: 'relative'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                marginBottom: '0.65rem',
                                flexWrap: 'wrap'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                {/* Ikon Badge Bulat Asli Eastward Mewah (Bukan Emoji) */}
                                <div
                                  style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    backgroundColor: isUnlocked ? badge.bg : '#EAE3D6',
                                    border: `1.5px solid ${isUnlocked ? '#2C221E' : '#DCD3C6'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: isUnlocked ? '0 4px 12px rgba(44, 34, 30, 0.15)' : 'none'
                                  }}
                                >
                                  <img
                                    src={badge.iconSrc}
                                    alt={badge.name}
                                    style={{
                                      width: '22px',
                                      height: '22px',
                                      objectFit: 'contain',
                                      filter: isUnlocked
                                        ? 'brightness(0) invert(1)'
                                        : 'brightness(0) opacity(0.35)'
                                    }}
                                  />
                                </div>

                                <div>
                                  <h4
                                    style={{
                                      fontSize: '1rem',
                                      fontWeight: 800,
                                      color: '#2C221E',
                                      margin: 0
                                    }}
                                  >
                                    {badge.name}
                                  </h4>
                                  <div style={{ fontSize: '0.76rem', color: '#8A5D26', fontWeight: 600, marginTop: '0.15rem' }}>
                                    {badge.subtitle}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {isUnlocked ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.35rem 0.85rem',
                                      borderRadius: '999px',
                                      backgroundColor: '#DCFCE7',
                                      color: '#15803D',
                                      fontSize: '0.76rem',
                                      fontWeight: 800
                                    }}
                                  >
                                    <Check size={14} color="#15803D" strokeWidth={2.5} />
                                    <span>Sudah Dikoleksi</span>
                                  </span>
                                ) : isInRange ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.35rem 0.85rem',
                                      borderRadius: '999px',
                                      backgroundColor: '#FEF3C7',
                                      color: '#92400E',
                                      fontSize: '0.76rem',
                                      fontWeight: 800
                                    }}
                                  >
                                    <Sparkles size={14} color="#92400E" />
                                    <span>Dalam Radius • Siap Diklaim!</span>
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.35rem 0.85rem',
                                      borderRadius: '999px',
                                      backgroundColor: '#F1F5F9',
                                      color: '#64748B',
                                      fontSize: '0.76rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    <Lock size={13} color="#64748B" />
                                    <span>Belum Dikunjungi</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: '#6E5D52', margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
                              {badge.lore}
                            </p>

                            {/* Kotak Cara Mendapatkan yang Jelas */}
                            <div
                              style={{
                                padding: '0.85rem 1rem',
                                borderRadius: '12px',
                                backgroundColor: isUnlocked ? '#FAF8F5' : isInRange ? '#F0FDF4' : '#FAF8F5',
                                border: isUnlocked ? '1px solid #ECE4D8' : isInRange ? '1px solid #BBF7D0' : '1px solid #ECE4D8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                              }}
                            >
                              <div style={{ flex: 1, minWidth: '220px' }}>
                                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2C221E', marginBottom: '0.2rem' }}>
                                  📍 Cara Mendapatkan:
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#5C4E43', lineHeight: 1.45 }}>
                                  {badge.caraMendapatkan}
                                </div>
                                {distNow !== null && !isUnlocked && (
                                  <div
                                    style={{
                                      marginTop: '0.35rem',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      color: isInRange ? '#15803D' : '#8A5D26'
                                    }}
                                  >
                                    {isInRange
                                      ? `✓ Posisi Anda terdeteksi berjarak ${distNow} m (Di dalam radius klaim < ${maxRadius >= 1000 ? (maxRadius / 1000).toFixed(1) + ' KM' : maxRadius + ' M'})`
                                      : `Posisi Anda saat ini: berjarak ${(distNow / 1000).toFixed(1)} km (Radius toleransi < ${maxRadius >= 1000 ? (maxRadius / 1000).toFixed(1) + ' KM' : maxRadius + ' M'})`}
                                  </div>
                                )}
                              </div>

                              {targetPlace && (
                                <div>
                                  {isUnlocked ? (
                                    <button
                                      type="button"
                                      onClick={() => onSelectPlace(targetPlace)}
                                      style={{
                                        padding: '0.45rem 0.95rem',
                                        borderRadius: '999px',
                                        backgroundColor: '#FAF8F5',
                                        border: '1px solid #DCD3C6',
                                        color: '#2C221E',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Buka Cerita Tempat
                                    </button>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                      <button
                                      type="button"
                                      onClick={() => handleClaimBadgeViaGps(targetPlace)}
                                      disabled={verifyingPlaceId === targetPlace.id}
                                      style={{
                                        padding: '0.5rem 1.15rem',
                                        borderRadius: '999px',
                                        backgroundColor: isInRange ? '#2C221E' : '#FAF8F5',
                                        color: isInRange ? '#FAF8F5' : '#8A5D26',
                                        border: isInRange ? '1.5px solid #C99B52' : '1px solid #DCD3C6',
                                        fontSize: '0.76rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        boxShadow: isInRange ? '0 4px 12px rgba(44, 34, 30, 0.15)' : 'none',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <Navigation size={13} />
                                      <span>
                                        {verifyingPlaceId === targetPlace.id
                                          ? 'Memeriksa GPS...'
                                          : isInRange
                                          ? 'Klaim Badge Sekarang'
                                          : 'Cek Lokasi GPS'}
                                      </span>
                                    </button>

                                    {isLocalhost && !isUnlocked && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const simCoords = {
                                            ...targetPlace.coordinates,
                                            accuracy: 10,
                                            isSimulated: true,
                                            timestamp: Date.now()
                                          };
                                          handleClaimBadgeViaGps(targetPlace, simCoords);
                                        }}
                                        disabled={verifyingPlaceId === targetPlace.id}
                                        style={{
                                          padding: '0.5rem 0.95rem',
                                          borderRadius: '999px',
                                          backgroundColor: '#FEF3C7',
                                          color: '#92400E',
                                          border: '1px dashed #D97706',
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.35rem'
                                        }}
                                        title="Uji klaim langsung badge ini di localhost"
                                      >
                                        <Sparkles size={12} color="#D97706" />
                                        <span>Uji Klaim (Dev)</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </div>

                  {/* MISI & QUEST BUDAYA */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2C221E', margin: 0 }}>
                        Misi & Quest Budaya
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: '#786B5E' }}>
                        Selesaikan rangkaian kunjungan untuk membuka badge tingkat tinggi
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {CULTURAL_QUESTS.map((quest) => {
                        const questStatus = (cultureBook.questsStatus || {})[quest.id] || { isCompleted: false };
                        const completedCount = quest.requiredPlaceIds.filter((pId) =>
                          cultureBook.visitedPlaces.includes(pId) || isGpsVerified(pId)
                        ).length;
                        const isDone = completedCount === quest.requiredPlaceIds.length;

                        return (
                          <div
                            key={quest.id}
                            style={{
                              padding: '1.15rem 1.25rem',
                              borderRadius: '14px',
                              backgroundColor: '#FFFFFF',
                              border: isDone ? '1.5px solid #2C221E' : '1px solid #EAE3D6'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2C221E', margin: 0 }}>
                                {quest.title}
                              </h4>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  color: isDone ? '#15803D' : '#8A5D26',
                                  backgroundColor: isDone ? '#DCFCE7' : '#FAF6EE',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '999px'
                                }}
                              >
                                {isDone ? '✓ Selesai' : `${completedCount}/${quest.requiredPlaceIds.length} Lokasi`}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.76rem', color: '#6E5D52', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                              {quest.description}
                            </p>

                            <div style={{ fontSize: '0.72rem', color: '#8A5D26', fontWeight: 700, marginBottom: '0.55rem' }}>
                              Cara Selesaikan: {quest.caraMendapatkan}
                            </div>

                            {/* Checklist titik */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {quest.requiredPlaceIds.map((pId) => {
                                const pl = places.find((p) => p.id === pId);
                                const isGps = isGpsVerified(pId);
                                return (
                                  <div
                                    key={pId}
                                    style={{
                                      padding: '0.35rem 0.65rem',
                                      borderRadius: '8px',
                                      backgroundColor: '#FAF8F5',
                                      border: '1px solid #ECE4D8',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      fontSize: '0.72rem',
                                      color: isGps ? '#15803D' : '#3D312A',
                                      fontWeight: isGps ? 800 : 600
                                    }}
                                  >
                                    {isGps ? <CheckCircle2 size={13} color="#15803D" /> : <Lock size={12} color="#94A3B8" />}
                                    <span>{pl?.name.split('&')[0] || pId}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RINGKASAN PROFIL */}
              {activeTab === 'background' && (
                <div>
                  <div style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #F2EDE4' }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2C221E', margin: '0 0 0.65rem 0' }}>
                      Tentang Profil Saya
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#5C4E43', margin: '0 0 0.75rem 0', lineHeight: 1.6 }}>
                      Catatan perjalanan budaya, filosofi keraton, serta ragam kuliner otentik Daerah Istimewa Yogyakarta:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.78rem', color: '#5C4E43', lineHeight: 1.8 }}>
                      <li>Penjelajah sumbu filosofis UNESCO dari Krapyak hingga Tugu</li>
                      <li>Pengagum arsitektur Mataram Islam di Kotagede dan candi Prambanan</li>
                      <li>Penikmat kopi joss Lik Man dan gudeg basah legendaris</li>
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2C221E', margin: '0 0 0.85rem 0' }}>
                      Stempel Paspor Budaya ({cultureBook.stamps?.length || 0})
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                      {cultureBook.stamps.map((stamp, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.9rem',
                            borderRadius: '12px',
                            border: '1px solid #EAE4DC',
                            backgroundColor: '#FAF8F5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: '#2C221E',
                              color: '#FAF8F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              flexShrink: 0
                            }}
                          >
                            {stamp.symbol || 'JK'}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C221E' }}>
                              {stamp.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#786B5E' }}>
                              {new Date(stamp.unlockedAt).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2C221E', margin: '0 0 0.85rem 0' }}>
                    Destinasi Impian ({cultureBook.favorites?.length || 0})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                    {cultureBook.favorites.map((favId) => {
                      const place = places.find((p) => p.id === favId);
                      if (!place) return null;
                      return (
                        <div
                          key={favId}
                          onClick={() => onSelectPlace(place)}
                          style={{
                            borderRadius: '12px',
                            border: '1px solid #EAE4DC',
                            overflow: 'hidden',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ height: '110px', position: 'relative' }}>
                            <img
                              src={place.thumbnail || place.coverImage}
                              alt={place.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div style={{ padding: '0.75rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2C221E', margin: '0 0 0.2rem 0' }}>
                              {place.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#786B5E' }}>
                              {place.province}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: CATATAN */}
              {activeTab === 'notes' && (
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2C221E', margin: '0 0 0.85rem 0' }}>
                    Catatan Refleksi Pengunjung
                  </h3>

                  <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                    <select
                      value={selectedNotePlaceId}
                      onChange={(e) => setSelectedNotePlaceId(e.target.value)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #DCD3C6',
                        fontSize: '0.78rem',
                        color: '#2C221E',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      {places.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <textarea
                      rows={3}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Tulis refleksi atau pengalaman Anda di sini..."
                      style={{
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #DCD3C6',
                        fontSize: '0.78rem',
                        color: '#2C221E',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 700 }}>
                        {noteSavedToast ? '✓ Catatan Berhasil Disimpan!' : ''}
                      </span>
                      <button
                        type="submit"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          backgroundColor: '#2C221E',
                          color: '#FAF8F5',
                          border: 'none',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(cultureBook.userNotes || {}).map(([pId, noteText]) => {
                      const pl = places.find((p) => p.id === pId);
                      return (
                        <div
                          key={pId}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #ECE4D8'
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2C221E', marginBottom: '0.2rem' }}>
                            {pl?.name || pId}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#5C4E43', lineHeight: 1.5 }}>
                            “{noteText}”
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
