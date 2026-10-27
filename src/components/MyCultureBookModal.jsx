import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  LogIn,
  Calendar,
  BookOpen,
  ExternalLink,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';
import { useAuth } from '../context/AuthContext';
import { CULTURAL_BADGES, CULTURAL_QUESTS, BADGE_TIERS } from '../data/badgeQuestData';
import { CULTURAL_EVENTS, CULTURAL_JOURNALS } from '../data/culturalEventsData';
import { getHaversineDistance } from '../utils/gpsSecurity';

export default function MyCultureBookModal({
  isOpen,
  onClose,
  places = [],
  onSelectPlace,
  userLiveCoords,
  userLiveAddress,
  onRefreshGps,
  isGpsLoading,
  initialTab = 'badges-quests',
  onOpenQuestCatalog
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'badges-quests');
  const [selectedNotePlaceId, setSelectedNotePlaceId] = useState(
    places[0]?.id || 'keraton-yogyakarta'
  );
  const [noteInput, setNoteInput] = useState('');
  const [noteSavedToast, setNoteSavedToast] = useState(false);
  const [mobileSectionTab, setMobileSectionTab] = useState(
    initialTab === 'events'
      ? 'events'
      : initialTab === 'jurnal'
      ? 'jurnal'
      : initialTab === 'background'
      ? 'destinasi'
      : initialTab === 'wishlist'
      ? 'wishlist'
      : initialTab === 'notes'
      ? 'catatan'
      : 'badges'
  );

  // Filter & Search untuk Event & Jurnal Budaya
  const [eventCategoryFilter, setEventCategoryFilter] = useState('Semua');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [journalSearchQuery, setJournalSearchQuery] = useState('');

  // Verifikasi GPS State
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [verifyingPlaceId, setVerifyingPlaceId] = useState(null);
  const [showGuideDetail, setShowGuideDetail] = useState(false);
  const [badgeFilterType, setBadgeFilterType] = useState('all'); // 'all' | 'quests' | 'badges'

  // Sync tab saat initialTab berubah atau modal dibuka
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      if (initialTab === 'events') {
        setMobileSectionTab('events');
      } else if (initialTab === 'jurnal') {
        setMobileSectionTab('jurnal');
      } else if (initialTab === 'badges-quests') {
        setMobileSectionTab('badges');
      } else if (initialTab === 'background') {
        setMobileSectionTab('destinasi');
      } else if (initialTab === 'wishlist') {
        setMobileSectionTab('wishlist');
      } else if (initialTab === 'notes') {
        setMobileSectionTab('catatan');
      }
    }
  }, [initialTab, isOpen]);

  const {
    cultureBook,
    getStats,
    hasStamp,
    verifyGpsVisit,
    saveUserNote,
    isBadgeUnlocked,
    isGpsVerified,
    getVerifiedVisitData,
    getBadgeTierStats,
    resetAllBadges
  } = useCultureBook();
  const { currentUser, openLogin } = useAuth();

  const isGuest = !currentUser || currentUser.isGuest;

  // Paspor Budaya display info
  const displayName = isGuest
    ? 'Tamu Penjelajah'
    : (currentUser?.email === 'fazriel@admin.com'
        ? 'Admin'
        : (currentUser?.name || 'Penjelajah Budaya'));

  const displayRole = isGuest
    ? 'Tamu Penjelajah Budaya @ Hamemayu'
    : (currentUser && (currentUser.role === 'admin' || currentUser.email === 'fazriel@admin.com' || currentUser.email === 'admin@hamemayu.id' || currentUser.email === 'fazrielmuliyael@gmail.com')
        ? `${currentUser.email || 'Admin'} • Administrator Sistem @ Hamemayu`
        : `${currentUser?.email || 'Member'} • Penjelajah Budaya @ Hamemayu`);

  const displayAvatar =
    currentUser?.avatar || (isGuest ? 'https://api.dicebear.com/7.x/initials/svg?seed=Guest' : '/assets/images/jogja_batik.jpg');

  useEffect(() => {
    if (
      currentUser?.name &&
      !currentUser.isGuest &&
      currentUser.authenticated
    ) {
      try {
        localStorage.setItem('hamemayu_passport_user_name', currentUser.name);
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem('hamemayu_passport_user_name');
      } catch (e) {}
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const totalPlaces = places.length || 6;
  const stats = getStats(totalPlaces);
  const tierStats = getBadgeTierStats ? getBadgeTierStats() : {
    umum: { total: 2, unlocked: 1 },
    langka: { total: 3, unlocked: 1 },
    epic: { total: 2, unlocked: 0 },
    legendaris: { total: 2, unlocked: 2 }
  };

  // 4 Ikon Badge Bulat Asli Eastward Berwarna Khas Jogja
  const portfolioBadges = [
    { id: 'b-cul', title: 'Warisan Budaya', bg: '#2C221E', iconSrc: '/assets/icons/icon_culture.svg' },
    { id: 'b-kul', title: 'Kuliner Otentik', bg: '#9E1C64', iconSrc: '/assets/icons/icon_culinary.svg' },
    { id: 'b-sou', title: 'Jiwa & Tradisi', bg: '#C99B52', iconSrc: '/assets/icons/icon_all.svg' },
    { id: 'b-nat', title: 'Wisata Alam', bg: '#6E473B', iconSrc: '/assets/icons/icon_nature.svg' }
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

  const filteredEvents = CULTURAL_EVENTS.filter((ev) => {
    const matchCat =
      eventCategoryFilter === 'Semua' || ev.category === eventCategoryFilter;
    const q = eventSearchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      ev.name.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.highlight.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const filteredJournals = CULTURAL_JOURNALS.filter((jr) => {
    const q = journalSearchQuery.trim().toLowerCase();
    return (
      !q ||
      jr.title.toLowerCase().includes(q) ||
      jr.excerpt.toLowerCase().includes(q) ||
      jr.category.toLowerCase().includes(q) ||
      (jr.tags && jr.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    saveUserNote(selectedNotePlaceId, noteInput.trim());
    setNoteInput('');
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2200);
  };

  // Handler Klaim Badge Langsung via Sensor GPS Nyata
  const handleClaimBadgeViaGps = (place) => {
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
              title: 'Akses Lokasi Belum Aktif',
              message: 'Aktifkan izin lokasi pada browser Anda agar kehadiran Anda di cagar budaya Yogyakarta dapat diverifikasi secara otomatis.'
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setVerifyingPlaceId(null);
        setVerificationFeedback({
          type: 'error',
          title: 'Fitur Lokasi Tidak Didukung',
          message: 'Perangkat atau browser Anda saat ini tidak mendukung deteksi lokasi otomatis.'
        });
      }
    }
  };



  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99995,
          backgroundColor: '#FAF8F5',
          color: '#2C221E',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: 'clamp(0.5rem, 2vw, 1.75rem)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            width: '100%',
            margin: '0 auto',
            paddingTop: 'clamp(1.25rem, 2.5vw, 2.25rem)',
            paddingBottom: '3.5rem',
            boxSizing: 'border-box'
          }}
        >
          {/* ===================================================================
              MOBILE-SPECIFIC PROFILE VIEW (100% LUXURY & COMFORTABLE FOR TOUCH)
              =================================================================== */}
          <div className="block sm:hidden pb-14">
            {/* Top Profile Card */}
            <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-sm overflow-hidden mb-3">
              {/* Banner Keraton Tamansari */}
              <div className="relative h-28 bg-[#2C221E] overflow-hidden">
                <img
                  src="/assets/images/jogja_tamansari.jpg"
                  alt="Yogyakarta Heritage Banner"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Top Action Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center cursor-pointer shadow-sm border border-white/20"
                    aria-label="Tutup Profil"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="px-4 pb-4 pt-1 relative">
                {/* Avatar */}
                <div className="flex items-end justify-between -mt-9 mb-2.5">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Name & Role */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl font-extrabold text-[#2C221E] font-['Outfit'] m-0 tracking-tight">
                    {displayName}
                  </h2>
                </div>

                <p className="text-xs text-neutral-500 font-medium truncate mb-1">
                  {displayRole}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 mb-3">
                  <MapPin size={11} className="text-[#9E1C64] flex-shrink-0" />
                  <span className="truncate">
                    {userLiveAddress || 'Daerah Istimewa Yogyakarta, Indonesia'}
                  </span>
                </div>

                {/* 3-Stats Ribbon */}
                <div className="grid grid-cols-3 gap-2 p-2 bg-[#FAF8F5] rounded-2xl border border-[#ECE4D8] mb-3">
                  <div className="text-center py-1">
                    <span className="block text-xs font-black text-[#2C221E]">
                      {(cultureBook.unlockedBadgeIds || []).length}/{CULTURAL_BADGES.length}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500">Badge</span>
                  </div>
                  <div className="text-center py-1 border-x border-[#ECE4D8]">
                    <span className="block text-xs font-black text-[#2C221E]">
                      {stats.gpsVerifiedCount || cultureBook.visitedPlaces.length}/{totalPlaces}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500">Destinasi</span>
                  </div>
                  <div className="text-center py-1">
                    <span className="block text-xs font-black text-[#2C221E]">
                      {cultureBook.favorites?.length || 0}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500">Wishlist</span>
                  </div>
                </div>

                {/* 4 Ikon Warisan */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-[#8A5D26]">Ikon Warisan Budaya:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {portfolioBadges.map((b) => (
                      <div
                        key={b.id}
                        className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs shrink-0"
                        style={{ backgroundColor: b.bg }}
                        title={b.title}
                      >
                        <img
                          src={b.iconSrc}
                          alt={b.title}
                          className="w-3.5 h-3.5 object-contain brightness-0 invert"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex items-center bg-[#EFE9DF] p-1 rounded-2xl mb-3 gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'badges', label: 'Badge' },
                { id: 'events', label: 'Kalender Acara' },
                { id: 'jurnal', label: 'Jurnal' },
                { id: 'destinasi', label: `Destinasi (${stats.gpsVerifiedCount || cultureBook.visitedPlaces.length}/${totalPlaces})` },
                { id: 'wishlist', label: `Wishlist (${cultureBook.favorites?.length || 0})` },
                { id: 'catatan', label: `Catatan (${Object.keys(cultureBook.userNotes || {}).length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileSectionTab(tab.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap cursor-pointer ${
                    mobileSectionTab === tab.id
                      ? 'bg-[#2C221E] text-white shadow-sm'
                      : 'text-[#6E5D52] hover:text-[#2C221E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT 1: BADGES */}
            {mobileSectionTab === 'badges' && (
              <div className="space-y-3">
                {/* Card Ringkasan & 4 Kategori */}
                <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2EDE4]">
                    <span className="text-xs font-bold text-[#2C221E] flex items-center gap-1.5">
                      <Award size={14} className="text-[#8A5D26]" />
                      <span>Koleksi Lencana Saya</span>
                    </span>
                    <span className="text-[11px] font-extrabold text-[#8A5D26] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#E5D7BE]">
                      {(cultureBook.unlockedBadgeIds || []).length} / {CULTURAL_BADGES.length} Terbuka
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#F4EFE6] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#2C221E] rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(((cultureBook.unlockedBadgeIds || []).length / CULTURAL_BADGES.length) * 100)}%`
                      }}
                    />
                  </div>

                  {/* 4 Ikon Bulat */}
                  <div className="grid grid-cols-4 gap-2">
                    {portfolioBadges.map((badge) => (
                      <div key={badge.id} className="flex flex-col items-center gap-1 text-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: badge.bg }}
                        >
                          <img
                            src={badge.iconSrc}
                            alt={badge.title}
                            className="w-5 h-5 object-contain brightness-0 invert"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-600 leading-tight">
                          {badge.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 Preview Misi Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-extrabold text-[#2C221E]">
                      Misi Quest Terdekat
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenQuestCatalog && onOpenQuestCatalog()}
                      className="text-[10.5px] font-bold text-[#8A5D26]"
                    >
                      Lihat Semua ({CULTURAL_QUESTS.length}) »
                    </button>
                  </div>

                  {CULTURAL_QUESTS.slice(0, 2).map((quest) => {
                    const completedCount = quest.requiredPlaceIds.filter((pId) =>
                      cultureBook.visitedPlaces.includes(pId) || isGpsVerified(pId)
                    ).length;
                    const isDone = completedCount === quest.requiredPlaceIds.length;
                    return (
                      <div
                        key={quest.id}
                        onClick={() => onOpenQuestCatalog && onOpenQuestCatalog()}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-[#EAE4DC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#2C221E] truncate max-w-[200px]">
                            {quest.title}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FAF6EE] text-[#8A5D26] border border-[#E5DEC9]'
                            }`}
                          >
                            {isDone ? 'Selesai' : `${completedCount}/${quest.requiredPlaceIds.length}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-tight">
                          {quest.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: DESTINASI CHECKLIST */}
            {mobileSectionTab === 'destinasi' && (
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-sm">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2EDE4]">
                  <span className="text-xs font-bold text-[#2C221E]">
                    Destinasi Warisan Budaya
                  </span>
                  <span className="text-[11px] font-extrabold text-[#2C221E] bg-[#F4EFE6] px-2 py-0.5 rounded-full">
                    {stats.gpsVerifiedCount || cultureBook.visitedPlaces.length}/{totalPlaces} Terbuka
                  </span>
                </div>

                <div className="divide-y divide-[#F5F1EA]">
                  {places.map((place, index) => {
                    const isGpsDone = isGpsVerified(place.id);
                    const distNow = userLiveCoords && place.coordinates
                      ? getHaversineDistance(userLiveCoords, place.coordinates)
                      : null;

                    return (
                      <div
                        key={place.id}
                        className="py-2.5 flex items-center justify-between gap-2"
                      >
                        <div
                          onClick={() => {
                            if (onSelectPlace) {
                              onClose();
                              onSelectPlace(place);
                            }
                          }}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                              isGpsDone
                                ? 'bg-[#2C221E] text-white'
                                : 'bg-[#F4EFE6] text-[#786B5E]'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-xs font-bold text-[#3D312A] truncate">
                            {place.name}
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          {isGpsDone ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                              <Check size={11} strokeWidth={3} />
                              <span>Dikunjungi</span>
                            </span>
                          ) : distNow !== null && distNow <= 1500 ? (
                            <button
                              type="button"
                              onClick={() => handleClaimBadgeViaGps(place)}
                              disabled={verifyingPlaceId === place.id}
                              className="px-2.5 py-1 rounded-lg bg-[#2C221E] text-[#FAF8F5] text-[10px] font-bold border border-[#C99B52] cursor-pointer"
                            >
                              {verifyingPlaceId === place.id ? 'Memproses...' : 'Klaim'}
                            </button>
                          ) : (
                            <div
                              onClick={() => {
                                if (onSelectPlace) {
                                  onClose();
                                  onSelectPlace(place);
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200 cursor-pointer"
                            >
                              <Lock size={10} />
                              <span>Terkunci</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: WISHLIST */}
            {mobileSectionTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-sm space-y-2">
                <div className="text-xs font-bold text-[#2C221E] pb-2 border-b border-[#F2EDE4]">
                  Wishlist Favorit ({cultureBook.favorites?.length || 0})
                </div>

                {(!cultureBook.favorites || cultureBook.favorites.length === 0) ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">
                    <Heart size={24} className="mx-auto mb-1 opacity-40 text-rose-500" />
                    <span>Belum ada destinasi favorit yang disimpan.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cultureBook.favorites.map((placeId) => {
                      const pl = places.find((p) => p.id === placeId);
                      if (!pl) return null;
                      return (
                        <div
                          key={placeId}
                          onClick={() => {
                            if (onSelectPlace) {
                              onClose();
                              onSelectPlace(pl);
                            }
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 cursor-pointer border border-neutral-100"
                        >
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {pl.name}
                          </span>
                          <ChevronRight size={14} className="text-neutral-400 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: CATATAN */}
            {mobileSectionTab === 'catatan' && (
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-sm space-y-3">
                <div className="text-xs font-bold text-[#2C221E] pb-2 border-b border-[#F2EDE4]">
                  Catatan Kunjungan Budaya
                </div>

                <form onSubmit={handleSaveNote} className="space-y-2">
                  <select
                    value={selectedNotePlaceId}
                    onChange={(e) => setSelectedNotePlaceId(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Tuliskan pengalaman atau catatan personal Anda..."
                    rows={3}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 bg-white"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#2C221E] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Simpan Catatan
                  </button>
                </form>

                {/* Daftar Catatan */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  {Object.entries(cultureBook.userNotes || {}).map(([pId, noteText]) => {
                    const pl = places.find((p) => p.id === pId);
                    return (
                      <div key={pId} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4D8]">
                        <div className="text-xs font-extrabold text-[#2C221E]">{pl?.name || pId}</div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">“{noteText}”</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EVENTS (MOBILE) */}
            {mobileSectionTab === 'events' && (
              <div className="space-y-3">
                {/* Header notice */}
                <div className="bg-[#FAF6EE] border border-[#E5D7BE] p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-[#8A5D26]" />
                    <span className="text-xs font-extrabold text-[#2C221E]">Kalender Event Budaya DIY</span>
                  </div>
                  <p className="text-[11px] text-[#6E5D52] m-0 leading-relaxed">
                    Jadwal upacara adat sakral, festival seni, dan pergelaran tradisi Jogja dengan data resmi dari Kraton Yogyakarta & Dinas Pariwisata DIY.
                  </p>
                </div>

                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={eventSearchQuery}
                      onChange={(e) => setEventSearchQuery(e.target.value)}
                      placeholder="Cari upacara, pertunjukan, lokasi..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#EAE4DC] text-[#2C221E] focus:outline-none focus:border-[#C99B52]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['Semua', 'Upacara Keraton', 'Pertunjukan Seni', 'Festival Rakyat', 'Pameran Seni'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEventCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                          eventCategoryFilter === cat
                            ? 'bg-[#2C221E] text-white'
                            : 'bg-white text-neutral-600 border border-[#EAE4DC]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Events List */}
                <div className="space-y-2.5">
                  {filteredEvents.map((ev) => {
                    const isExpanded = expandedEventId === ev.id;
                    return (
                      <div
                        key={ev.id}
                        className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-xs space-y-2 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-[#E5DEC9] text-[#8A5D26] text-[10px] font-bold">
                            <Calendar size={10} />
                            <span>{ev.dateDisplay}</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                            {ev.category}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-[#2C221E] m-0 leading-snug">
                            {ev.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[#8A5D26] mt-0.5 m-0">
                            {ev.highlight}
                          </p>
                        </div>

                        <div className="flex items-start gap-1.5 text-[11px] text-[#6E5D52]">
                          <MapPin size={12} className="text-[#8A5D26] shrink-0 mt-0.5" />
                          <span className="truncate">{ev.location} ({ev.district})</span>
                        </div>

                        {/* Collapsed/Expanded Section */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-[#F2EDE4] space-y-2.5">
                            <p className="text-xs text-neutral-700 leading-relaxed m-0">
                              {ev.description}
                            </p>

                            <div className="bg-[#FAF6EE] border border-[#E5DEC9] rounded-xl p-2.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#8A5D26] mb-0.5">
                                <AlertCircle size={12} className="text-[#8A5D26] shrink-0" />
                                <span>Tata Krama &amp; Ketentuan Kunjungan:</span>
                              </div>
                              <p className="text-[11px] text-[#6E5D52] m-0 leading-relaxed">
                                {ev.tips}
                              </p>
                            </div>

                            <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
                              <span>Sumber: {ev.source}</span>
                              <span className="font-bold text-neutral-700 inline-flex items-center gap-1">
                                <Check size={11} className="text-emerald-600" />
                                <span>Data Resmi</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Accordion Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                          className="w-full py-1.5 px-2 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF6EE] border border-[#EAE0D0] text-[#6E5D52] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]"
                        >
                          <span>{isExpanded ? 'Tutup Detail' : 'Lihat Detail & Tata Krama'}</span>
                          <ChevronDown
                            size={13}
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    );
                  })}

                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8 text-xs text-neutral-500 bg-white rounded-2xl border border-dashed border-neutral-200">
                      Tidak ada event yang cocok dengan filter pencarian Anda.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: JURNAL (MOBILE) */}
            {mobileSectionTab === 'jurnal' && (
              <div className="space-y-3">
                <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={14} className="text-black" />
                    <span className="text-xs font-extrabold text-black">Jurnal Budaya &amp; Folklor Jogja</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 m-0 leading-relaxed">
                    Kumpulan esai budaya, kajian arsitektur warisan, dan panduan tata krama bersumber dari publikasi resmi D.I. Yogyakarta.
                  </p>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={journalSearchQuery}
                    onChange={(e) => setJournalSearchQuery(e.target.value)}
                    placeholder="Cari esai, filosofi, tata krama..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-neutral-200 text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-3">
                  {filteredJournals.map((jr) => (
                    <div
                      key={jr.id}
                      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs"
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-neutral-100">
                        <img
                          src={jr.image}
                          alt={jr.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {jr.category}
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-black text-[10px] font-bold flex items-center gap-1">
                          <Clock size={10} />
                          <span>{jr.readTime}</span>
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <h4 className="text-sm font-extrabold text-black m-0 leading-snug">
                          {jr.title}
                        </h4>

                        <p className="text-xs text-neutral-700 leading-relaxed m-0">
                          {jr.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {jr.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-medium text-neutral-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400">
                            {jr.author} • {jr.date}
                          </span>
                          <a
                            href={jr.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-black hover:underline"
                          >
                            <span>Baca Lengkap</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredJournals.length === 0 && (
                    <div className="text-center py-8 text-xs text-neutral-500 bg-white rounded-2xl border border-dashed border-neutral-200">
                      Tidak ada artikel jurnal yang cocok dengan pencarian Anda.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================
              DESKTOP VIEW (100% UNCHANGED ORIGINAL 2-COLUMN DASHBOARD)
              =================================================================== */}
          <div className="hidden sm:block">
            {/* TOP PROFILE HEADER CARD */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #EAE4DC',
              boxShadow: '0 8px 28px rgba(44, 34, 30, 0.04)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              width: '100%'
            }}
          >
            {/* Banner Keraton - Compact Luxury */}
            <div
              style={{
                position: 'relative',
                height: 'clamp(85px, 13vw, 115px)',
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
                    'linear-gradient(90deg, rgba(44, 34, 30, 0.65) 0%, rgba(44, 34, 30, 0.25) 55%, rgba(44, 34, 30, 0.55) 100%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  zIndex: 10
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(250, 248, 245, 0.95)',
                    border: '1px solid #E5DEC9',
                    color: '#2C221E',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(44, 34, 30, 0.12)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.15s ease'
                  }}
                  aria-label="Tutup Profil"
                >
                  <X size={13} />
                  <span>Tutup</span>
                </button>
              </div>
            </div>

            {/* Profile Info - Streamlined Compact Layout */}
            <div style={{ padding: '0 clamp(0.85rem, 2vw, 1.75rem) 0.9rem', position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginTop: '-36px',
                  marginBottom: '0.65rem'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #FFFFFF',
                    boxShadow: '0 4px 14px rgba(44, 34, 30, 0.12)',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Mini Ikon Warisan Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#FAF8F5', padding: '0.2rem 0.45rem', borderRadius: '999px', border: '1px solid #ECE4D8' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8A5D26', paddingRight: '0.2rem' }}>
                      Ikon:
                    </span>
                    {portfolioBadges.map((b) => (
                      <div
                        key={b.id}
                        title={b.title}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: b.bg,
                          border: '1px solid rgba(44, 34, 30, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={b.iconSrc}
                          alt={b.title}
                          style={{
                            width: '11px',
                            height: '11px',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {isGuest && (
                    <button
                      type="button"
                      onClick={() =>
                        openLogin({
                          benefitType: 'general',
                          title: 'Masuk ke Hamemayu',
                          description: 'Simpan riwayat kunjungan dan koleksi badge Anda secara permanen.'
                        })
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        backgroundColor: '#2C221E',
                        border: '1px solid #2C221E',
                        color: '#FAF8F5',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Masuk atau Buat Akun"
                    >
                      <LogIn size={12} />
                      <span>Masuk Akun</span>
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(1.2rem, 2vw, 1.55rem)',
                    fontWeight: 800,
                    color: '#2C221E',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {displayName}
                </h2>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '0.78rem',
                  color: '#6E5D52',
                  marginTop: '0.2rem',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ fontWeight: 500 }}>{displayRole}</span>
                <span style={{ color: '#D9CEBA' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#786B5E' }}>
                  <MapPin size={12} color="#9E1C64" />
                  <span>
                    {userLiveAddress
                      ? `Lokasi: ${userLiveAddress}`
                      : 'Daerah Istimewa Yogyakarta, Indonesia'}
                  </span>
                </div>
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
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
              }
              @media (max-width: 900px) {
                .paspor-main-grid {
                  grid-template-columns: minmax(0, 1fr);
                  gap: 1rem;
                }
              }
            `}</style>

            {/* =================================================================
                KOLOM KIRI: STATUS KOLEKSI & CHECKLIST TEMPAT GPS
                ================================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* KARTU 1: RINGKASAN KOLEKSI BADGE */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EAE4DC',
                  padding: 'clamp(0.85rem, 2.5vw, 1.25rem)',
                  boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
                  width: '100%',
                  boxSizing: 'border-box'
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(0.2rem, 1.5vw, 0.45rem)', marginBottom: '0.85rem', width: '100%' }}>
                  {portfolioBadges.map((badge) => (
                    <div
                      key={badge.id}
                      title={badge.title}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        minWidth: 0,
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: 'clamp(36px, 10vw, 42px)',
                          height: 'clamp(36px, 10vw, 42px)',
                          borderRadius: '50%',
                          backgroundColor: badge.bg,
                          border: '1.5px solid rgba(44, 34, 30, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 3px 8px rgba(44, 34, 30, 0.12)',
                          transition: 'transform 0.15s ease',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={badge.iconSrc}
                          alt={badge.title}
                          style={{
                            width: 'clamp(16px, 4.5vw, 20px)',
                            height: 'clamp(16px, 4.5vw, 20px)',
                            objectFit: 'contain',
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 'clamp(0.55rem, 1.8vw, 0.65rem)',
                          fontWeight: 700,
                          color: '#6E5D52',
                          textAlign: 'center',
                          lineHeight: 1.15,
                          wordBreak: 'break-word',
                          maxWidth: '100%'
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
                  padding: 'clamp(0.85rem, 2.5vw, 1.25rem)',
                  boxShadow: '0 4px 16px rgba(44, 34, 30, 0.03)',
                  width: '100%',
                  boxSizing: 'border-box'
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
                  <span>Destinasi Warisan Budaya</span>
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
                    {stats.gpsVerifiedCount || cultureBook.visitedPlaces.length}/{totalPlaces} Terbuka
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
                            flex: 1,
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
                        ) : distNow !== null && distNow <= 1500 ? (
                          <button
                            type="button"
                            onClick={() => handleClaimBadgeViaGps(place)}
                            disabled={verifyingPlaceId === place.id}
                            style={{
                              padding: '0.26rem 0.65rem',
                              borderRadius: '6px',
                              backgroundColor: '#2C221E',
                              border: '1px solid #C99B52',
                              color: '#FAF8F5',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              flexShrink: 0,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {verifyingPlaceId === place.id ? 'Memproses...' : 'Klaim Badge'}
                          </button>
                        ) : (
                          <div
                            onClick={() => onSelectPlace && onSelectPlace(place)}
                            style={{
                              padding: '0.22rem 0.55rem',
                              borderRadius: '6px',
                              backgroundColor: '#FAF8F5',
                              border: '1px solid #ECE4D8',
                              color: '#8A7B6E',
                              fontSize: '0.67rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              flexShrink: 0,
                              whiteSpace: 'nowrap',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title={`Buka info & cerita ${place.name}`}
                          >
                            <Lock size={10} color="#A89A8D" />
                            <span>Terkunci</span>
                          </div>
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
                padding: 'clamp(0.85rem, 2.5vw, 2rem)',
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflowX: 'hidden'
              }}
            >
              {/* Tab Navigation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  borderBottom: '1px solid #F2EDE4',
                  marginBottom: '1.5rem',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  maxWidth: '100%'
                }}
              >
                {[
                  {
                    id: 'badges-quests',
                    label: `Misi Quest & Badge (${(cultureBook.unlockedBadgeIds || []).length}/${CULTURAL_BADGES.length})`
                  },
                  { id: 'events', label: 'Kalender Acara Budaya' },
                  { id: 'jurnal', label: 'Jurnal & Panduan Budaya' },
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
                  {/* MINI PREVIEW 1: MISI QUEST AKTIF (2 KARTU BERDAMPINGAN) */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2C221E', margin: 0 }}>
                        Misi Quest Aktif ({CULTURAL_QUESTS.length})
                      </h4>

                      <button
                        type="button"
                        onClick={() => onOpenQuestCatalog && onOpenQuestCatalog()}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8A5D26',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <span>Lihat Semua Misi</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {CULTURAL_QUESTS.slice(0, 2).map((quest) => {
                        const completedCount = quest.requiredPlaceIds.filter(
                          (pId) => cultureBook.visitedPlaces.includes(pId) || isGpsVerified(pId)
                        ).length;
                        const isDone = completedCount === quest.requiredPlaceIds.length;
                        return (
                          <div
                            key={quest.id}
                            style={{
                              padding: '0.9rem 1rem',
                              borderRadius: '12px',
                              backgroundColor: '#FAF8F5',
                              border: isDone ? '1.5px solid #15803D' : '1px solid #ECE4D8',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                              <div>
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8A5D26', display: 'block' }}>
                                  {quest.aksara}
                                </span>
                                <strong style={{ fontSize: '0.84rem', color: '#2C221E', lineHeight: 1.3 }}>
                                  {quest.title}
                                </strong>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  color: isDone ? '#15803D' : '#8A5D26',
                                  backgroundColor: isDone ? '#DCFCE7' : '#FAF6EE',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '999px',
                                  flexShrink: 0
                                }}
                              >
                                {isDone ? '✓ Selesai' : `${completedCount}/${quest.requiredPlaceIds.length} Lokasi`}
                              </span>
                            </div>

                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#6E5D52', lineHeight: 1.4 }}>
                              {quest.description}
                            </p>

                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {quest.requiredPlaceIds.map((pId) => {
                                const pl = places.find((p) => p.id === pId);
                                const isGps = isGpsVerified(pId);
                                return (
                                  <span
                                    key={pId}
                                    style={{
                                      padding: '0.2rem 0.45rem',
                                      borderRadius: '6px',
                                      backgroundColor: '#FFFFFF',
                                      border: '1px solid #ECE4D8',
                                      fontSize: '0.68rem',
                                      color: isGps ? '#15803D' : '#5C4E43',
                                      fontWeight: isGps ? 800 : 600,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    {isGps ? <CheckCircle2 size={10} color="#15803D" /> : <Lock size={9} color="#94A3B8" />}
                                    <span>{pl?.name.split('&')[0] || pId}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MINI PREVIEW 2: 9 KOIN LENCANA WARISAN (GRID KOMPAK) */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#2C221E', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Award size={15} color="#8A5D26" />
                        <span>Koleksi 9 Lencana Warisan ({cultureBook.unlockedBadgeIds?.length || 0}/9)</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => onOpenQuestCatalog && onOpenQuestCatalog()}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8A5D26',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <span>Buka Detail Semua Lencana</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.65rem' }}>
                      {CULTURAL_BADGES.map((badge) => {
                        const isUnlocked = isBadgeUnlocked(badge.id);
                        return (
                          <div
                            key={badge.id}
                            onClick={() => onOpenQuestCatalog && onOpenQuestCatalog()}
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderRadius: '12px',
                              backgroundColor: '#FFFFFF',
                              border: isUnlocked ? '1.5px solid #2C221E' : '1px solid #ECE4D8',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: badge.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <img
                                src={badge.iconSrc}
                                alt={badge.name}
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  objectFit: 'contain',
                                  filter: 'brightness(0) invert(1)'
                                }}
                              />
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2C221E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {badge.name}
                              </div>
                              <span style={{ fontSize: '0.66rem', color: isUnlocked ? '#15803D' : '#94A3B8', fontWeight: isUnlocked ? 700 : 500 }}>
                                {isUnlocked ? '✓ Terbuka' : 'Terkunci'}
                              </span>
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
                      <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {noteSavedToast ? (
                          <>
                            <Check size={12} color="#15803D" />
                            <span>Catatan Berhasil Disimpan!</span>
                          </>
                        ) : ''}
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

              {/* =================================================================
                  TAB CONTENT 2: KALENDER EVENT BUDAYA (DATA REAL)
                  ================================================================= */}
              {activeTab === 'events' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Header Box */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      backgroundColor: '#FAF6EE',
                      border: '1px solid #E5D7BE',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            backgroundColor: '#C99B52',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Calendar size={15} />
                        </div>
                        <h3
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: '#2C221E',
                            margin: 0,
                            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
                          }}
                        >
                          Kalender Event & Agenda Budaya Real Yogyakarta
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#6E5D52', margin: 0, lineHeight: 1.6 }}>
                        Jadwal upacara adat, peringatan hari besar Keraton Ngayogyakarta, dan festival seni tahunan dengan kurasi data terverifikasi dari sumber resmi Kasultanan & Dinas Pariwisata DIY.
                      </p>
                    </div>

                    <div
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '999px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5D7BE',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#8A5D26',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{CULTURAL_EVENTS.length} Agenda Terverifikasi</span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Category Filter Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Semua', 'Upacara Keraton', 'Pertunjukan Seni', 'Festival Rakyat', 'Pameran Seni'].map((cat) => {
                        const isSelected = eventCategoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setEventCategoryFilter(cat)}
                            style={{
                              padding: '0.4rem 0.85rem',
                              borderRadius: '999px',
                              backgroundColor: isSelected ? '#2C221E' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#6E5D52',
                              border: isSelected ? '1px solid #2C221E' : '1px solid #EAE4DC',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Search Input */}
                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search
                        size={14}
                        color="#9CA3AF"
                        style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        type="text"
                        value={eventSearchQuery}
                        onChange={(e) => setEventSearchQuery(e.target.value)}
                        placeholder="Cari agenda atau tempat..."
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem 0.45rem 2rem',
                          borderRadius: '10px',
                          border: '1px solid #EAE4DC',
                          fontSize: '0.78rem',
                          color: '#2C221E',
                          backgroundColor: '#FFFFFF',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Events Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {filteredEvents.map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          borderRadius: '14px',
                          border: '1px solid #EAE4DC',
                          backgroundColor: '#FFFFFF',
                          padding: '1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.85rem',
                          boxShadow: '0 2px 10px rgba(44, 34, 30, 0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                backgroundColor: '#F5F5F5',
                                border: '1px solid #E5E5E5',
                                color: '#000000',
                                fontSize: '0.7rem',
                                fontWeight: 800
                              }}
                            >
                              <Calendar size={11} />
                              <span>{ev.dateDisplay}</span>
                            </span>

                            <span
                              style={{
                                padding: '0.2rem 0.55rem',
                                borderRadius: '999px',
                                backgroundColor: '#F5F5F5',
                                color: '#525252',
                                fontSize: '0.68rem',
                                fontWeight: 700
                              }}
                            >
                              {ev.category}
                            </span>
                          </div>

                          <div>
                            <h4
                              style={{
                                fontSize: '0.92rem',
                                fontWeight: 800,
                                color: '#000000',
                                margin: 0,
                                lineHeight: 1.4
                              }}
                            >
                              {ev.name}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.74rem', fontWeight: 700, color: '#8A5D26', marginTop: '0.2rem' }}>
                              <span>{ev.highlight}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.74rem', color: '#171717' }}>
                            <MapPin size={12} color="#000000" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>{ev.location} ({ev.district})</span>
                          </div>

                          <p style={{ fontSize: '0.76rem', color: '#262626', margin: 0, lineHeight: 1.55 }}>
                            {ev.description}
                          </p>

                          <div
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderRadius: '10px',
                              backgroundColor: '#F5F5F5',
                              border: '1px solid #E5E5E5',
                              fontSize: '0.72rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800, color: '#000000', marginBottom: '0.2rem' }}>
                              <AlertCircle size={12} color="#000000" />
                              <span>Tata Krama &amp; Saran:</span>
                            </div>
                            <div style={{ color: '#262626', lineHeight: 1.45 }}>
                              {ev.tips}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            paddingTop: '0.65rem',
                            borderTop: '1px solid #E5E5E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.68rem',
                            color: '#737373'
                          }}
                        >
                          <span style={{ fontStyle: 'italic' }}>Rujukan: {ev.source}</span>
                          <span style={{ color: '#000000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Check size={11} color="#000000" />
                            <span>Data Terverifikasi</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredEvents.length === 0 && (
                    <div
                      style={{
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        backgroundColor: '#FAF8F5',
                        borderRadius: '14px',
                        border: '1px dashed #DCD3C6',
                        color: '#786B5E',
                        fontSize: '0.82rem'
                      }}
                    >
                      Tidak ada event budaya yang cocok dengan kata kunci atau kategori yang Anda pilih.
                    </div>
                  )}
                </div>
              )}

              {/* =================================================================
                  TAB CONTENT 3: JURNAL & ESAI BUDAYA JOGJA
                  ================================================================= */}
              {activeTab === 'jurnal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Header Box */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E5E5E5',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <BookOpen size={15} />
                        </div>
                        <h3
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: '#000000',
                            margin: 0,
                            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
                          }}
                        >
                          Jurnal Budaya & Narasi Tradisi Yogyakarta
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#525252', margin: 0, lineHeight: 1.6 }}>
                        Kurasi artikel resmi, esai filosofis Kasultanan Mataram, dan catatan perjalanan mendalam mengenai cagar budaya dan kuliner otentik Yogyakarta.
                      </p>
                    </div>

                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search
                        size={14}
                        color="#9CA3AF"
                        style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        type="text"
                        value={journalSearchQuery}
                        onChange={(e) => setJournalSearchQuery(e.target.value)}
                        placeholder="Cari judul atau topik jurnal..."
                        style={{
                          width: '100%',
                          padding: '0.45rem 0.75rem 0.45rem 2rem',
                          borderRadius: '10px',
                          border: '1px solid #E5E5E5',
                          fontSize: '0.78rem',
                          color: '#000000',
                          backgroundColor: '#FFFFFF',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Journal Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.15rem' }}>
                    {filteredJournals.map((jr) => (
                      <div
                        key={jr.id}
                        style={{
                          borderRadius: '16px',
                          border: '1px solid #E5E5E5',
                          backgroundColor: '#FFFFFF',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div style={{ position: 'relative', height: '160px', width: '100%', backgroundColor: '#000000', overflow: 'hidden' }}>
                          <img
                            src={jr.image}
                            alt={jr.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                          <span
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(0,0,0,0.65)',
                              color: '#FFFFFF',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            {jr.category}
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              right: '10px',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(255,255,255,0.92)',
                              color: '#000000',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            <Clock size={11} />
                            <span>{jr.readTime}</span>
                          </span>
                        </div>

                        <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            <h4
                              style={{
                                fontSize: '0.94rem',
                                fontWeight: 800,
                                color: '#000000',
                                margin: 0,
                                lineHeight: 1.45
                              }}
                            >
                              {jr.title}
                            </h4>
                            <p style={{ fontSize: '0.78rem', color: '#404040', margin: 0, lineHeight: 1.6 }}>
                              {jr.excerpt}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                              {jr.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#F5F5F5',
                                    border: '1px solid #E5E5E5',
                                    fontSize: '0.68rem',
                                    color: '#171717'
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div
                            style={{
                              paddingTop: '0.75rem',
                              borderTop: '1px solid #E5E5E5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>
                              <span>{jr.author}</span>
                              <span style={{ display: 'block', fontSize: '0.65rem' }}>{jr.date}</span>
                            </div>

                            <a
                              href={jr.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                backgroundColor: '#F5F5F5',
                                border: '1px solid #E5E5E5',
                                color: '#000000',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#000000';
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#F5F5F5';
                                e.currentTarget.style.color = '#000000';
                              }}
                            >
                              <span>Baca Artikel</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredJournals.length === 0 && (
                    <div
                      style={{
                        padding: '3rem 1.5rem',
                        textAlign: 'center',
                        backgroundColor: '#FAF8F5',
                        borderRadius: '14px',
                        border: '1px dashed #DCD3C6',
                        color: '#786B5E',
                        fontSize: '0.82rem'
                      }}
                    >
                      Tidak ada artikel jurnal yang cocok dengan pencarian Anda.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div> {/* closes hidden sm:block */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
