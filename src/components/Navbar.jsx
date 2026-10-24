import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, LogIn, LogOut, ChevronDown, Sparkles, Shield, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 500,
  damping: 60,
  mass: 1
};

const CONTENT_TRANSITION = {
  duration: 0.18,
  ease: [0.44, 0, 0.56, 1]
};

const CONTAINER_VARIANTS = {
  closed: {
    width: 372,
    borderRadius: 100,
    paddingTop: 0,
    paddingRight: 24,
    paddingBottom: 0,
    paddingLeft: 26,
    boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
    transition: SPRING_TRANSITION
  },
  open: {
    width: 416,
    borderRadius: 28,
    paddingTop: 0,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 26,
    boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)',
    transition: SPRING_TRANSITION
  }
};

const HEADER_VARIANTS = {
  closed: {
    paddingTop: 14,
    paddingBottom: 14,
    height: 48,
    transition: SPRING_TRANSITION
  },
  open: {
    paddingTop: 22,
    paddingBottom: 14,
    height: 56,
    transition: SPRING_TRANSITION
  }
};

const PROFILE_CONTAINER_VARIANTS = {
  closed: (custom) => ({
    width: custom?.isLoggedIn ? 154 : 124,
    borderRadius: 100,
    paddingTop: 0,
    paddingRight: 14,
    paddingBottom: 0,
    paddingLeft: 12,
    boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
    transition: SPRING_TRANSITION
  }),
  open: {
    width: 320,
    borderRadius: 24,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
    transition: SPRING_TRANSITION
  }
};

const PROFILE_HEADER_VARIANTS = {
  closed: {
    height: 48,
    transition: SPRING_TRANSITION
  },
  open: {
    height: 52,
    transition: SPRING_TRANSITION
  }
};

const DESTINASI_POPULER = [
  {
    id: 'keraton-yogyakarta',
    name: 'Keraton & Tamansari',
    subtitle: 'Pusat Filosofi Kasultanan & Istana Air',
    image: '/assets/images/jogja_keraton.jpg'
  },
  {
    id: 'malioboro-tugu',
    name: 'Malioboro & Tugu Jogja',
    subtitle: 'Jantung Kota, Batik & Angkringan',
    image: '/assets/images/jogja_malioboro.jpg'
  },
  {
    id: 'merapi-kaliurang',
    name: 'Merapi & Kaliurang',
    subtitle: 'Ullen Sentalu & Lereng Merapi',
    image: '/assets/images/jogja_merapi.jpg'
  }
];

const DESTINASI_WARISAN = [
  {
    id: 'kotagede',
    name: 'Warisan Kotagede',
    subtitle: 'Ibu Kota Mataram Kuno & Perak',
    image: '/assets/images/jogja_kotagede.jpg'
  },
  {
    id: 'prambanan-ratuboko',
    name: 'Prambanan & Ratu Boko',
    subtitle: 'Mahakarya Candi Hindu & Senja',
    image: '/assets/images/jogja_prambanan.jpg'
  },
  {
    id: 'parangtritis-gunungkidul',
    name: 'Parangtritis & Segara Kidul',
    subtitle: 'Pantai Selatan & Tebing Karst',
    image: '/assets/images/jogja_parangtritis.jpg'
  },
  {
    id: 'kasongan-imogiri',
    name: 'Kasongan & Makam Imogiri',
    subtitle: 'Sentra Kriya Gerabah & Perbukitan Suci',
    image: '/assets/images/jogja_batik.jpg'
  }
];

const KULINER_FEATURES = [
  {
    id: 'nearMe',
    name: 'Radar GPS Kuliner Jogja',
    hours: 'Radius 5–10 KM • Pelacakan Real-Time',
    image: '/assets/images/jogja_gudeg.jpg'
  },
  {
    id: 'map',
    name: 'Peta Budaya & Cagar Wisata DIY',
    hours: 'Peta Interaktif • 5 Wilayah Kabupaten/Kota',
    image: '/assets/images/jogja_keraton.jpg'
  }
];

const KALENDER_PREVIEW = [
  {
    id: 'sekaten-grebeg-mulud',
    name: 'Hajad Dalem Sekaten & Grebeg Mulud',
    subtitle: '16 September 2025 • Upacara Keraton',
    image: '/assets/images/real_gunungan_grebeg.jpg'
  },
  {
    id: 'labuhan-merapi',
    name: 'Upacara Adat Labuhan Merapi',
    subtitle: '18 Maret 2025 • Lereng Merapi',
    image: '/assets/images/jogja_merapi.jpg'
  },
  {
    id: 'ramayana-ballet-prambanan',
    name: 'Sendratari Ramayana Prambanan',
    subtitle: 'Rutin Mei–Okt • Panggung Terbuka',
    image: '/assets/images/event_ramayana_ballet.jpg'
  }
];

const NAV_ITEMS = [
  { id: 'destinasi', label: 'Destinasi' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'kuliner', label: 'Kuliner' },
  { id: 'kalender', label: 'Kalender' }
];

export default function Navbar({
  onGoHome,
  onOpenAboutUs,
  onOpenDestinations,
  onOpenTours,
  onOpenNearMe,
  onOpenMap,
  onOpenCultureBook,
  onOpenCultureEvents,
  onOpenCultureJournals,
  onOpenKalenderAcara,
  onOpenJurnalBudaya,
  onOpenAdmin,
  onSelectPlaceById,
  currentView = 'home'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSelectedTab, setUserSelectedTab] = useState(null);
  const [prevView, setPrevView] = useState(currentView);

  // Sync state during render when currentView prop changes
  if (prevView !== currentView) {
    setPrevView(currentView);
    setUserSelectedTab(null);
  }

  const activeTab =
    userSelectedTab ??
    (currentView === 'kalender'
      ? 'kalender'
      : currentView === 'kuliner'
      ? 'kuliner'
      : currentView === 'tentang' || currentView === 'jurnal'
      ? 'tentang'
      : 'destinasi');

  const setActiveTab = (tab) => {
    setUserSelectedTab(tab);
  };

  const [hoveredTab, setHoveredTab] = useState(null);
  const [subFilter, setSubFilter] = useState('Populer');
  const closeTimerRef = useRef(null);

  const { currentUser, openLogin, isAdmin, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileTimerRef = useRef(null);

  const handleProfileMouseEnter = useCallback(() => {
    if (profileTimerRef.current) {
      clearTimeout(profileTimerRef.current);
      profileTimerRef.current = null;
    }
    setProfileOpen(true);
  }, []);

  const handleProfileMouseLeave = useCallback(() => {
    profileTimerRef.current = setTimeout(() => {
      setProfileOpen(false);
    }, 240);
  }, []);

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabMouseEnter = useCallback((id) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHoveredTab(id);
  }, []);

  const handleContainerMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setHoveredTab(null);
    }, 240);
  }, []);

  const handleContainerMouseEnter = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeAll = () => {
    setHoveredTab(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    closeAll();
    if (id === 'destinasi') {
      if (onOpenDestinations) {
        onOpenDestinations();
      } else if (onOpenAboutUs) {
        onOpenAboutUs();
      }
    } else if (id === 'tentang') {
      if (onOpenAboutUs) onOpenAboutUs();
    } else if (id === 'kuliner') {
      if (onOpenNearMe) onOpenNearMe();
    } else if (id === 'kalender') {
      if (onOpenKalenderAcara) {
        onOpenKalenderAcara();
      } else if (onOpenCultureEvents) {
        onOpenCultureEvents();
      }
    }
  };

  const isOpen = hoveredTab !== null && isDesktop;
  const displayedDestinations =
    subFilter === 'Populer' ? DESTINASI_POPULER : DESTINASI_WARISAN;

  return (
    <>
      {/* Top-Right Profile / Masuk Dynamic Island Pill */}
      <div
        className="hidden sm:flex"
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 100011,
          pointerEvents: 'auto'
        }}
      >
        <motion.div
          className="bg-white overflow-hidden flex flex-col will-change-transform border border-black/5"
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
          initial="closed"
          animate={profileOpen ? 'open' : 'closed'}
          custom={{ isLoggedIn: Boolean(currentUser && !currentUser.isGuest) }}
          variants={PROFILE_CONTAINER_VARIANTS}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Top Trigger Pill Header */}
          <motion.div
            layout
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-between w-full cursor-pointer select-none shrink-0"
            variants={PROFILE_HEADER_VARIANTS}
          >
            {currentUser && !currentUser.isGuest ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 border-[1.5px] border-[#e5b869]"
                />
                <span className="text-[13px] font-semibold text-[#09090b] truncate max-w-[85px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 text-black">
                  <LogIn size={14} strokeWidth={2.2} />
                </div>
                <span className="text-[13px] font-semibold text-[#09090b]">
                  Masuk
                </span>
              </div>
            )}

            <ChevronDown
              size={13}
              strokeWidth={2.4}
              className={`text-neutral-500 transition-transform duration-200 shrink-0 ${
                profileOpen ? 'rotate-180 text-black' : ''
              }`}
            />
          </motion.div>

          {/* Expanded Dropdown Content (Framer Spring Animation) */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                key="profile-dropdown-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING_TRANSITION}
                className="w-full flex flex-col overflow-hidden"
              >
                <div className="w-full h-px bg-neutral-100 shrink-0 mb-3" />

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={CONTENT_TRANSITION}
                  className="flex flex-col space-y-2 shrink-0"
                  style={{ width: 288 }}
                >
                  {/* User Info Card */}
                  {currentUser && !currentUser.isGuest ? (
                    <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-150 flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#c99b52]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-black truncate m-0 leading-tight">
                            {currentUser.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-medium truncate m-0 mt-0.5">
                            {isAdmin ? '👑 Administrator CMS' : 'Penjelajah Budaya'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          closeAll();
                          if (onOpenCultureBook) onOpenCultureBook();
                        }}
                        className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-[11px] font-bold text-black border border-neutral-200 transition-colors cursor-pointer"
                      >
                        Profil
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-left">
                      <p className="text-xs font-bold text-amber-950 m-0">
                        Tamu Penjelajah
                      </p>
                      <p className="text-[11px] text-amber-900/80 m-0 mt-0.5">
                        Masuk untuk menyimpan agenda budaya & momen favorit Anda.
                      </p>
                    </div>
                  )}

                  {/* Cultural Features: Jurnal Budaya */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-1 m-0">
                      Jurnal Budaya
                    </p>

                    {/* Jurnal Budaya */}
                    <button
                      type="button"
                      onClick={() => {
                        closeAll();
                        if (onOpenJurnalBudaya) {
                          onOpenJurnalBudaya();
                        } else if (onOpenCultureJournals) {
                          onOpenCultureJournals();
                        } else if (onOpenCultureBook) {
                          onOpenCultureBook();
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        currentView === 'jurnal'
                          ? 'bg-amber-50/90 border-[#c99b52] shadow-xs'
                          : 'bg-white hover:bg-neutral-50 border-neutral-100'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          currentView === 'jurnal'
                            ? 'bg-[#c99b52] text-white shadow-xs'
                            : 'bg-neutral-100 text-black group-hover:bg-neutral-200'
                        }`}
                      >
                        <BookOpen size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-bold truncate m-0 ${
                            currentView === 'jurnal' ? 'text-amber-950' : 'text-black'
                          }`}
                        >
                          Jurnal Budaya
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate m-0 font-medium">
                          Panduan Adat, Etika & Esai
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Admin CMS (if admin) */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          closeAll();
                          if (onOpenAdmin) onOpenAdmin();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100/80 text-left transition-all cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0">
                          <Shield size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-neutral-950 truncate m-0">
                            Admin CMS
                          </p>
                          <p className="text-[10px] text-neutral-600 truncate m-0 font-medium">
                            Kelola Konten & Data Budaya
                          </p>
                        </div>
                        <ChevronRight size={13} className="text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Footer Action (Login or Logout) */}
                  <div className="pt-1.5 border-t border-neutral-100">
                    {currentUser && !currentUser.isGuest ? (
                      <button
                        type="button"
                        onClick={() => {
                          closeAll();
                          if (logout) logout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Keluar Akun</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          closeAll();
                          openLogin({
                            benefitType: 'general',
                            title: 'Selamat Datang di Hamemayu',
                            description:
                              'Akses penuh ke fitur Wishlist destinasi, ulasan pengunjung, serta galeri momen budaya Yogyakarta.'
                          });
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <LogIn size={13} />
                        <span>Masuk / Daftar Akun</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Center Navigation Pill (Desktop & Tablet sm: and above) */}
      <div
        className="hidden sm:block fixed top-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 100010 }}
      >
        <motion.div
          className="pointer-events-auto bg-white overflow-hidden flex flex-col will-change-transform max-w-[calc(100vw-1.5rem)]"
          onMouseLeave={handleContainerMouseLeave}
          onMouseEnter={handleContainerMouseEnter}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={CONTAINER_VARIANTS}
        >
          {/* Top Pill Header Row */}
          <motion.div
            layout
            className="flex items-center justify-between w-full shrink-0"
            variants={HEADER_VARIANTS}
          >
            {/* Left Logo Button */}
            <motion.button
              layout
              type="button"
              onClick={() => {
                setActiveTab('destinasi');
                closeAll();
                if (onGoHome) {
                  onGoHome();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="shrink-0 text-black flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Hamemayu Beranda"
              style={{ width: 22, height: 22, background: 'none', border: 'none', padding: 0 }}
              transition={SPRING_TRANSITION}
            >
              <img
                src="/images/icon_culture.svg"
                alt="Hamemayu"
                style={{ width: 22, height: 22, objectFit: 'contain', display: 'block' }}
              />
            </motion.button>

            {/* Desktop Navigation Items */}
            <motion.div
              layout
              className="hidden sm:flex items-center"
              style={{ gap: 16, paddingLeft: 10 }}
              transition={SPRING_TRANSITION}
            >
              {NAV_ITEMS.map((item) => {
                const isHighlighted =
                  hoveredTab === item.id ||
                  (!hoveredTab && activeTab === item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => handleTabMouseEnter(item.id)}
                    className="relative cursor-pointer flex items-center justify-center leading-none"
                    style={{ padding: '4px 0', background: 'none', border: 'none' }}
                  >
                    <span
                      className="text-[13px] leading-none select-none tracking-normal inline-block"
                      style={{
                        color: isHighlighted ? '#000000' : '#8a8a8a',
                        fontWeight: isHighlighted ? 600 : 500,
                        transition: 'color 0.2s cubic-bezier(0.44, 0, 0.56, 1)'
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Mobile Actions: Quick Profile Avatar + Menu Toggle (Integrated cleanly) */}
            <div className="flex sm:hidden items-center gap-1.5 ml-auto">
              {currentUser && !currentUser.isGuest ? (
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (onOpenCultureBook) onOpenCultureBook();
                  }}
                  className="flex items-center gap-1.5 py-0.5 px-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-200/80"
                  aria-label="Profil Pengguna"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#c99b52]"
                  />
                  <span className="text-[11px] font-bold text-neutral-800 max-w-[65px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    openLogin({
                      benefitType: 'general',
                      title: 'Selamat Datang di Hamemayu',
                      description: 'Masuk untuk mengakses seluruh fitur budaya.'
                    });
                  }}
                  className="py-1 px-2.5 rounded-full bg-black text-white text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Masuk
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer"
                style={{ background: 'none', border: 'none' }}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <svg
                    width="18"
                    height="12"
                    viewBox="0 0 18 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <line x1="1" y1="2" x2="17" y2="2" />
                    <line x1="1" y1="10" x2="17" y2="10" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Expandable Dropdown Panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="dropdown-body"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING_TRANSITION}
                className="w-full flex flex-col overflow-hidden"
              >
                <div className="w-full h-px bg-[#e3e3e3] shrink-0" />

                <AnimatePresence mode="wait">
                  {/* TAB 1: DESTINASI (Matches Shop layout in Sneks) */}
                  {hoveredTab === 'destinasi' && (
                    <motion.div
                      key="p-destinasi"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={CONTENT_TRANSITION}
                      className="flex flex-col text-left space-y-3 shrink-0"
                      style={{ paddingTop: 12, width: 366 }}
                    >
                      {/* Segmented Filter Pill */}
                      <div className="bg-[#f0f0f0] p-1 rounded-full flex text-[12px] font-semibold">
                        {['Populer', 'Warisan'].map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setSubFilter(tab)}
                            className="flex-1 py-1 rounded-full text-center relative z-10 cursor-pointer"
                            style={{
                              color: subFilter === tab ? '#000000' : '#8a8a8a',
                              transition: 'color 0.15s',
                              background: 'none',
                              border: 'none'
                            }}
                          >
                            {subFilter === tab && (
                              <motion.div
                                layoutId="seg-nav"
                                className="absolute inset-0 bg-white rounded-full shadow-xs"
                                transition={SPRING_TRANSITION}
                                style={{ zIndex: -1 }}
                              />
                            )}
                            <span className="relative z-10 font-bold">{tab}</span>
                          </button>
                        ))}
                      </div>

                      <p
                        className="text-[14px] font-bold text-[#292929] pt-1"
                        style={{ margin: 0 }}
                      >
                        {subFilter === 'Populer' ? 'Destinasi Utama' : 'Koleksi Warisan'}
                      </p>

                      <div className="space-y-1">
                        {displayedDestinations.map((place) => (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => {
                              setActiveTab('destinasi');
                              closeAll();
                              if (onSelectPlaceById) {
                                onSelectPlaceById(place.id);
                              } else if (onOpenTours) {
                                onOpenTours();
                              }
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-[#f5f5f5] transition-colors text-left group cursor-pointer"
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <div className="w-[52px] h-[52px] bg-[#f2f2f2] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="min-w-0">
                              <p
                                className="text-[12px] font-bold text-black truncate"
                                style={{ margin: 0 }}
                              >
                                {place.name}
                              </p>
                              <p
                                className="text-[11px] text-[#8a8a8a] font-medium truncate mt-0.5"
                                style={{ margin: 0 }}
                              >
                                {place.subtitle}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('destinasi');
                          closeAll();
                          if (onOpenDestinations) {
                            onOpenDestinations();
                          } else if (onOpenAboutUs) {
                            onOpenAboutUs();
                          }
                        }}
                        className="w-full py-2.5 rounded-full bg-[#f0f0f0] hover:bg-[#e3e3e3] text-black text-[12px] font-bold text-center transition-colors cursor-pointer mt-1"
                        style={{ border: 'none' }}
                      >
                        Lihat semua
                      </button>
                    </motion.div>
                  )}

                  {/* TAB 2: TENTANG (Matches About us layout in Sneks) */}
                  {hoveredTab === 'tentang' && (
                    <motion.div
                      key="p-tentang"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={CONTENT_TRANSITION}
                      className="flex flex-col items-start text-left shrink-0"
                      style={{ paddingTop: 12, gap: 16, width: 366 }}
                    >
                      <h4
                        className="text-[14px] font-bold text-[#292929] leading-tight"
                        style={{ margin: 0 }}
                      >
                        Tentang kami
                      </h4>

                      <div
                        className="bg-white flex items-center justify-center"
                        style={{
                          padding: 18,
                          borderRadius: 17,
                          border: '1px solid rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        <img
                          src="/images/icon_culture.svg"
                          alt="Hamemayu"
                          style={{ width: 38, height: 38, objectFit: 'contain', display: 'block' }}
                        />
                      </div>

                      <p
                        className="text-[12px] text-[#616161] leading-[1.5] font-normal"
                        style={{ margin: 0 }}
                      >
                        Eksplorasi kurasi sumbu filosofis, cagar budaya, dan radar kuliner otentik Daerah Istimewa Yogyakarta.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('tentang');
                          closeAll();
                          if (onOpenAboutUs) onOpenAboutUs();
                        }}
                        className="px-[18px] py-[6px] rounded-full bg-[#2C221E] hover:bg-[#C99B52] active:scale-95 text-white text-[12px] font-semibold transition-all cursor-pointer inline-flex items-center justify-center leading-none"
                        style={{ height: 27, border: 'none' }}
                      >
                        Selengkapnya
                      </button>
                    </motion.div>
                  )}

                  {/* TAB 3: KULINER / LOKASI (Matches Stores layout in Sneks) */}
                  {hoveredTab === 'kuliner' && (
                    <motion.div
                      key="p-kuliner"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={CONTENT_TRANSITION}
                      className="flex flex-col text-left space-y-3 shrink-0"
                      style={{ paddingTop: 12, width: 366 }}
                    >
                      <p
                        className="text-[14px] font-bold text-[#292929]"
                        style={{ margin: 0 }}
                      >
                        Temukan lokasi & kuliner
                      </p>

                      <div className="space-y-1">
                        {KULINER_FEATURES.map((feature) => (
                          <button
                            key={feature.id}
                            type="button"
                            onClick={() => {
                              setActiveTab('kuliner');
                              closeAll();
                              if (feature.id === 'nearMe' && onOpenNearMe) onOpenNearMe();
                              if (feature.id === 'map' && onOpenMap) onOpenMap();
                              if (feature.id === 'cultureBook' && onOpenCultureBook)
                                onOpenCultureBook();
                            }}
                            className="w-full flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#f5f5f5] transition-colors text-left group cursor-pointer"
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <div className="w-[50px] h-[50px] rounded-[14px] overflow-hidden shrink-0 bg-[#f0f0f0] border border-black/5 shadow-2xs">
                              <img
                                src={feature.image}
                                alt={feature.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="eager"
                                decoding="async"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-[13px] font-bold text-black truncate tracking-tight"
                                style={{ margin: 0 }}
                              >
                                {feature.name}
                              </p>
                              <p
                                className="text-[12px] text-[#8a8a8a] font-normal mt-0.5"
                                style={{ margin: 0 }}
                              >
                                {feature.hours}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('kuliner');
                          closeAll();
                          if (onOpenNearMe) onOpenNearMe();
                        }}
                        className="w-full py-2.5 rounded-full bg-[#f0f0f0] hover:bg-[#e3e3e3] text-black text-[12px] font-bold text-center transition-colors cursor-pointer mt-1"
                        style={{ border: 'none' }}
                      >
                        Lihat semua
                      </button>
                    </motion.div>
                  )}

                  {/* TAB 4: KALENDER ACARA BUDAYA */}
                  {hoveredTab === 'kalender' && (
                    <motion.div
                      key="p-kalender"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={CONTENT_TRANSITION}
                      className="flex flex-col text-left space-y-3 shrink-0"
                      style={{ paddingTop: 12, width: 366 }}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className="text-[14px] font-bold text-[#292929]"
                          style={{ margin: 0 }}
                        >
                          Agenda Budaya Jogja
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          Data Resmi 2025/2026
                        </span>
                      </div>

                      <div className="space-y-1">
                        {KALENDER_PREVIEW.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab('kalender');
                              closeAll();
                              if (onOpenKalenderAcara) {
                                onOpenKalenderAcara();
                              } else if (onOpenCultureEvents) {
                                onOpenCultureEvents();
                              }
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-[#f5f5f5] transition-colors text-left group cursor-pointer"
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <div className="w-[52px] h-[52px] bg-[#f2f2f2] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-[12px] font-bold text-black truncate"
                                style={{ margin: 0 }}
                              >
                                {item.name}
                              </p>
                              <p
                                className="text-[11px] text-[#8a8a8a] font-medium truncate mt-0.5"
                                style={{ margin: 0 }}
                              >
                                {item.subtitle}
                              </p>
                            </div>
                            <ChevronRight size={13} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('kalender');
                          closeAll();
                          if (onOpenKalenderAcara) {
                            onOpenKalenderAcara();
                          } else if (onOpenCultureEvents) {
                            onOpenCultureEvents();
                          }
                        }}
                        className="w-full py-2.5 rounded-full bg-[#f0f0f0] hover:bg-[#e3e3e3] text-black text-[12px] font-bold text-center transition-colors cursor-pointer mt-1"
                        style={{ border: 'none' }}
                      >
                        Lihat semua
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* =========================================================================
          DEDICATED MOBILE FLOATING NAVBAR (Viewport < 640px)
          Unified, elegant pill that never collides, overlaps, or causes horizontal scroll
          ========================================================================= */}
      <div className="sm:hidden fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] max-w-sm pointer-events-auto z-[100010]">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-black/10 shadow-lg px-3.5 py-1.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            type="button"
            onClick={() => {
              closeAll();
              if (onGoHome) onGoHome();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 text-left"
          >
            <img
              src="/images/icon_culture.svg"
              alt="Hamemayu"
              className="w-5 h-5 object-contain"
            />
            <span className="font-extrabold text-[13px] tracking-tight text-neutral-900 font-['Outfit']">
              Hamemayu
            </span>
          </button>

          {/* Right Mobile Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick Calendar Button */}
            <button
              type="button"
              onClick={() => {
                closeAll();
                if (onOpenKalenderAcara) onOpenKalenderAcara();
                else if (onOpenCultureEvents) onOpenCultureEvents();
              }}
              aria-label="Kalender Acara"
              className={`h-7 px-2 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer border ${
                currentView === 'kalender'
                  ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200/70'
              }`}
              title="Kalender Acara Tradisi"
            >
              <Calendar size={13} className="text-amber-800" />
              <span>Acara</span>
            </button>

            {/* Quick Profile / Login Trigger */}
            {currentUser && !currentUser.isGuest ? (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-7 h-7 rounded-full overflow-hidden border border-amber-400 cursor-pointer shadow-2xs"
                title={currentUser.name}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  openLogin({
                    benefitType: 'general',
                    title: 'Selamat Datang di Hamemayu',
                    description: 'Akses penuh ke fitur Wishlist, ulasan, serta galeri momen budaya Yogyakarta.'
                  });
                }}
                className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-[11px] font-bold cursor-pointer transition-colors"
              >
                Masuk
              </button>
            )}

            {/* Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-black cursor-pointer bg-transparent border-none"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="1" y1="2" x2="17" y2="2" />
                  <line x1="1" y1="10" x2="17" y2="10" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mt-2 w-full max-h-[82vh] overflow-y-auto bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-2xl space-y-2 text-left"
            >
              {/* User Status Card */}
              {currentUser && !currentUser.isGuest ? (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate m-0">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate m-0">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeAll();
                      if (logout) logout();
                    }}
                    className="shrink-0 px-2 py-1 rounded-lg bg-neutral-200/70 hover:bg-rose-100 hover:text-rose-600 text-[11px] font-bold text-neutral-700 transition-colors cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 m-0">
                      Tamu Penjelajah
                    </p>
                    <p className="text-[10px] text-neutral-500 m-0">
                      Masuk untuk simpan paspor &amp; momen
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeAll();
                      openLogin({
                        benefitType: 'general',
                        title: 'Selamat Datang di Hamemayu',
                        description: 'Akses penuh ke paspor budaya & wishlist destinasi.'
                      });
                    }}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-black text-white text-[11px] font-bold cursor-pointer"
                  >
                    Masuk Akun
                  </button>
                </div>
              )}

              {/* Main Navigation Items */}
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  );
                })}
              </div>

              {/* Cultural Highlights */}
              <div className="pt-2 border-t border-neutral-100 space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 m-0 mb-1">
                  Fitur Budaya &amp; Kuliner
                </p>

                {/* Radar Kuliner GPS */}
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (onOpenNearMe) onOpenNearMe();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer text-amber-950 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Radar GPS Kuliner (Radius 5–10 KM)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
                </button>

                {/* Peta Budaya & Cagar Wisata DIY */}
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (onOpenMap) onOpenMap();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer text-cyan-950 bg-cyan-50/70 hover:bg-cyan-100/80 border border-cyan-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Peta Budaya &amp; Cagar Wisata DIY</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-800" />
                </button>

                {/* Jurnal Budaya */}
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (onOpenJurnalBudaya) onOpenJurnalBudaya();
                    else if (onOpenCultureJournals) onOpenCultureJournals();
                    else if (onOpenCultureBook) onOpenCultureBook();
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                    currentView === 'jurnal'
                      ? 'bg-amber-100 text-amber-950 font-black'
                      : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                    <span>Jurnal &amp; Panduan Budaya</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>

                {/* Paspor Budaya */}
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (onOpenCultureBook) onOpenCultureBook();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer text-neutral-800 hover:bg-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Paspor Budaya &amp; Lencana</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              </div>

              {/* Admin CMS */}
              {isAdmin && (
                <div className="pt-1.5 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      closeAll();
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer bg-neutral-900 text-amber-400"
                  >
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin CMS Portal</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </div>
              )}

              {/* Logout button for mobile dropdown */}
              {currentUser && !currentUser.isGuest && (
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    if (logout) logout();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-left font-bold text-[11px] text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer mt-1 pt-1 border-t border-gray-100"
                  style={{ border: 'none' }}
                >
                  <LogOut size={13} />
                  <span>Keluar Akun</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
