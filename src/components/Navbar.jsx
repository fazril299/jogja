import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, LogIn, LogOut, Heart, Camera, ChevronDown, Sparkles, Shield } from 'lucide-react';
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
    width: 280,
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

const NAV_ITEMS = [
  { id: 'destinasi', label: 'Destinasi' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'kuliner', label: 'Kuliner' }
];

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
  }
];

export default function Navbar({
  onGoHome,
  onOpenAboutUs,
  onOpenDestinations,
  onOpenTours,
  onOpenNearMe,
  onOpenMap,
  onOpenCultureBook,
  onOpenAdmin,
  onSelectPlaceById
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('destinasi');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [subFilter, setSubFilter] = useState('Populer');
  const closeTimerRef = useRef(null);

  const { currentUser, openLogin, isAdmin } = useAuth();

  const handleTabMouseEnter = useCallback((id) => {
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
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeAll = () => {
    setHoveredTab(null);
    setMobileMenuOpen(false);
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
    }
  };

  const isOpen = hoveredTab !== null;
  const displayedDestinations =
    subFilter === 'Populer' ? DESTINASI_POPULER : DESTINASI_WARISAN;

  return (
    <>
      {/* Top-Right Auth / Profile Pill (Direct Click Opens Full Profile Page) */}
      {/* Top-Right Auth / Profile Pill (Direct Click Opens Full Profile Page) */}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 100002,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem'
        }}
      >
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              closeAll();
              if (onOpenAdmin) onOpenAdmin();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              height: '48px',
              padding: '0 1.15rem',
              borderRadius: '100px',
              backgroundColor: '#18181b',
              color: '#fef08a',
              border: '1px solid rgba(201, 155, 82, 0.45)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25), 0 0 10px rgba(201, 155, 82, 0.15)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c99b52';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#18181b';
              e.currentTarget.style.color = '#fef08a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Buka Panel Pengelola Budaya (Khusus Administrator)"
          >
            <Shield size={14} className="text-amber-400" />
            <span>Admin CMS</span>
          </button>
        )}

        {currentUser && !currentUser.isGuest ? (
          <button
            type="button"
            onClick={() => {
              closeAll();
              if (onOpenCultureBook) onOpenCultureBook();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              height: '48px',
              padding: '0.35rem 1.05rem 0.35rem 0.45rem',
              borderRadius: '100px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
              color: '#09090b',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition:
                'background-color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c99b52';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#09090b';
            }}
            title="Buka Profil Saya"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #e5b869'
              }}
            />
            <span>{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              openLogin({
                benefitType: 'general',
                title: 'Selamat Datang di JogjaKrama',
                description:
                  'Akses penuh ke fitur Wishlist destinasi, ulasan pengunjung, serta galeri momen budaya Yogyakarta.'
              })
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '48px',
              padding: '0 1.35rem',
              borderRadius: '100px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0,0,0,0.04)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition:
                'background-color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c99b52';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
          >
            <LogIn size={14} strokeWidth={2.2} />
            <span>Masuk</span>
          </button>
        )}
      </div>

      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 100001 }}
      >
      <motion.div
        className="pointer-events-auto bg-white overflow-hidden flex flex-col will-change-transform"
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
            aria-label="JogjaKrama Beranda"
            style={{ width: 22, height: 22, background: 'none', border: 'none', padding: 0 }}
            transition={SPRING_TRANSITION}
          >
            <img
              src="/images/icon_culture.svg"
              alt="JogjaKrama"
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
                hoveredTab === item.id || (activeTab === item.id && !hoveredTab);
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

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="sm:hidden w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-black ml-3 cursor-pointer"
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
                        alt="JogjaKrama"
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
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Dropdown Menu (Matches Sneks mobile dropdown) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl p-2.5 border border-gray-100 shadow-xl space-y-0.5 z-50"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ border: 'none' }}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </button>
            ))}

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  if (onOpenAdmin) onOpenAdmin();
                }}
                className="w-full py-2 px-3 rounded-xl text-left font-bold text-[12px] flex items-center justify-between transition-colors cursor-pointer bg-amber-500 text-neutral-950 mt-1"
                style={{ border: 'none' }}
              >
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin CMS</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
