import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, MapPin, Gem, Landmark, Mountain } from 'lucide-react';

export default function MostLovedDestinations({
  onOpenBooking,
  onOpenJapanDetail,
  onOpenSwissDetail,
  onOpenParisDetail,
  onOpenNYDetail,
  onOpenPrambananDetail,
  onSelectPlaceById
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  // Deteksi layar kecil agar sebaran kipas kartu (spread) otomatis presisi
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 5 Destinasi Ikonik Yogyakarta (Arsitektur Fanned Deck dengan Kartu #FAF6EE & Teks Hitam)
  const destinations = [
    {
      id: 'keraton-yogyakarta',
      shortName: 'Keraton',
      title: 'Keraton & Tamansari',
      fullTitle: 'Keraton & Tamansari Yogyakarta',
      category: 'Poros Sumbu Filosofis UNESCO',
      tagline: 'Pusat kosmologi Kasultanan Mataram Islam, istana air sakral Tamansari, dan keluhuran tradisi warisan dunia.',
      cardDesc: 'Pusat kosmologi Kasultanan Mataram dan istana air sakral Tamansari.',
      bgImage: '/assets/images/jogja_keraton.jpg',
      imagePosition: 'center 45%',
      cardBg: '#FAF6EE',
      textColor: '#000000',
      accentColor: '#000000',
      symbolType: 'crown', // Sesuai foto Regol Danapratapa / Istana Kasultanan
      onClick: onOpenJapanDetail
    },
    {
      id: 'malioboro-tugu',
      shortName: 'Malioboro',
      title: 'Malioboro & Tugu',
      fullTitle: 'Malioboro & Tugu Pal Putih',
      category: 'Denyut Kehidupan & Kota Pusaka',
      tagline: 'Simbol garis kosmologis utara, denyut malam legendaris Pasar Beringharjo, sentra batik, dan aroma arang Kopi Joss.',
      cardDesc: 'Simbol garis kosmologis utara, pasar Beringharjo, dan Kopi Joss.',
      bgImage: '/assets/images/jogja_malioboro.jpg',
      imagePosition: 'center 50%',
      cardBg: '#FAF6EE',
      textColor: '#000000',
      accentColor: '#000000',
      symbolType: 'map-pin', // Sesuai foto plang Jl. Malioboro & titik pusat kota
      onClick: onOpenSwissDetail
    },
    {
      id: 'kotagede',
      shortName: 'Kotagede',
      title: 'Warisan Kotagede',
      fullTitle: 'Warisan Pusaka Kotagede 1586',
      category: 'Ibu Kota Awal Mataram 1586',
      tagline: 'Lorong bersejarah arsitektur Rumah Kalang, makam pendiri Mataram Islam, serta kriya perak yang mendunia.',
      cardDesc: 'Arsitektur Rumah Kalang, makam Mataram, dan kriya perak dunia.',
      bgImage: '/assets/images/jogja_kotagede.jpg',
      imagePosition: 'center 72%',
      cardBg: '#FAF6EE',
      textColor: '#000000',
      accentColor: '#000000',
      symbolType: 'gem', // Sesuai foto kriya perak Kotagede & warisan Mataram
      onClick: onOpenParisDetail
    },
    {
      id: 'prambanan-ratuboko',
      shortName: 'Prambanan',
      title: 'Prambanan & Ratu Boko',
      fullTitle: 'Candi Prambanan & Keraton Ratu Boko',
      category: 'Warisan Dunia UNESCO Abad ke-9',
      tagline: 'Candi Hindu tertinggi di Indonesia berpadu dengan pesona matahari terbenam di gerbang batu Keraton Ratu Boko.',
      cardDesc: 'Candi Hindu tertinggi berpadu pesona senja Keraton Ratu Boko.',
      bgImage: '/assets/images/jogja_prambanan.jpg',
      imagePosition: 'center 40%',
      cardBg: '#FAF6EE',
      textColor: '#000000',
      accentColor: '#000000',
      symbolType: 'landmark', // Sesuai foto kemegahan Candi Prambanan abad ke-9
      onClick: onOpenPrambananDetail || (() => onSelectPlaceById && onSelectPlaceById('prambanan-ratuboko'))
    },
    {
      id: 'merapi-kaliurang',
      shortName: 'Merapi',
      title: 'Merapi & Kaliurang',
      fullTitle: 'Merapi, Kaliurang & Ullen Sentalu',
      category: 'Poros Kosmis Utara & Sejarah Keraton',
      tagline: 'Kemegahan gunung sakral Mataram, pesona koleksi seni budaya Museum Ullen Sentalu, dan kesejukan lereng utara.',
      cardDesc: 'Gunung sakral Mataram, Museum Ullen Sentalu, dan lereng sejuk.',
      bgImage: '/assets/images/jogja_merapi.jpg',
      imagePosition: 'center 38%',
      cardBg: '#FAF6EE',
      textColor: '#000000',
      accentColor: '#000000',
      symbolType: 'mountain', // Sesuai foto puncak vulkanik Gunung Merapi
      onClick: onOpenNYDetail
    }
  ];

  const total = destinations.length;
  const activeDest = destinations[activeIdx];
  const targetIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  // =========================================================================
  // NATIVE CSS STICKY SCROLL CONTROLLER
  // Outer track 350vh -> scroll drives synchronized card progression 0 to 4
  // =========================================================================
  useEffect(() => {
    let rafId = null;

    const updateScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist));
      const newIdx = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
      setActiveIdx((prev) => (prev !== newIdx ? newIdx : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [total]);

  // Smooth scroll to card's exact position on the scroll track
  const goToDestination = useCallback((targetIndex) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;

    const targetProgress = (targetIndex + 0.5) / total;
    const targetY = sectionTop + targetProgress * scrollableDist;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    setActiveIdx(targetIndex);
  }, [total]);

  const handleOpenDetail = useCallback((destToOpen = activeDest) => {
    if (destToOpen.onClick) {
      destToOpen.onClick();
    } else if (onSelectPlaceById) {
      onSelectPlaceById(destToOpen.id);
    } else if (onOpenBooking) {
      onOpenBooking(destToOpen);
    }
  }, [activeDest, onOpenBooking, onSelectPlaceById]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeIdx < total - 1) {
          goToDestination(activeIdx + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeIdx > 0) {
          goToDestination(activeIdx - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, goToDestination, total]);

  // Render Iconic Symbols disesuaikan dengan foto masing-masing destinasi
  const renderSymbol = (type) => {
    switch (type) {
      case 'crown':
        return <Crown size={18} strokeWidth={2.3} />;
      case 'map-pin':
        return <MapPin size={18} strokeWidth={2.3} />;
      case 'gem':
        return <Gem size={18} strokeWidth={2.3} />;
      case 'landmark':
        return <Landmark size={18} strokeWidth={2.3} />;
      case 'mountain':
        return <Mountain size={18} strokeWidth={2.3} />;
      default:
        return <Crown size={18} strokeWidth={2.3} />;
    }
  };

  // Base Fan Angles & Offsets (Fanned Deck Structure)
  const baseRotations = isMobile ? [-9, -4.5, 0, 4.5, 9] : [-14, -7, 0, 7, 14];
  const baseYOffsets = [12, 3, 0, 3, 12];
  const spacing = isMobile ? 54 : 112;

  return (
    <section
      id="destinations-section"
      ref={sectionRef}
      className="relative w-full h-[350vh] bg-white"
    >
      {/* =========================================================================
          NATIVE STICKY FULL-SCREEN VIEWPORT CONTAINER (100VH - 1 SECTION)
          Visually pins to screen while native scroll smoothly advances the cards
          ========================================================================= */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-8 bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-[1140px] mx-auto w-full flex flex-col justify-center my-auto py-2">

          {/* =========================================================================
              SYNCED HEADER (Persis Pola Synced Deck dengan teks 'Research' di Gambar 2)
              ========================================================================= */}
          <div className="mb-4 sm:mb-6 max-w-[1040px] mx-auto w-full px-2">
            <div className="space-y-1 max-w-xl">
              {/* Big Synced Title (Sesuai teks besar 'Research' di Gambar 2) */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${activeDest.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2d180c] font-['Outfit'] m-0 leading-tight"
                >
                  {activeDest.title}
                </motion.h2>
              </AnimatePresence>

              {/* Synced Description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`tagline-${activeDest.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="text-xs sm:text-[13px] text-neutral-600 m-0 line-clamp-1 max-w-lg"
                >
                  {activeDest.tagline}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================================
              FRAMER SYNCED DECK — 3D OVERLAPPING FANNED CARDS (PERSIS GAMBAR 2)
              Cards fan out with angles, point/hover/click straightens & brings to front
              ========================================================================= */}
          <div className="relative w-full max-w-[1040px] mx-auto h-[360px] sm:h-[390px] md:h-[415px] pt-6 flex items-center justify-center select-none group">
            <div className="relative w-full h-full flex items-center justify-center">
              {destinations.map((dest, idx) => {
                const isSelected = activeIdx === idx;
                const isHovered = hoveredIdx === idx;
                const isFront = targetIdx === idx;

                // Physics kalkulasi posisi fanned deck:
                // Kartu di depan: rotate: 0, lift: -28px, scale: 1.05
                // Kartu samping: merekah ke kiri/kanan dan tetap miring
                let x = (idx - 2) * spacing;
                let y = baseYOffsets[idx];
                let rotate = baseRotations[idx];
                let scale = 0.95;
                let zIndex = 10;

                if (isFront) {
                  x = (idx - 2) * spacing;
                  y = -26;
                  rotate = 0;
                  scale = isMobile ? 1.03 : 1.06;
                  zIndex = 50;
                } else if (idx < targetIdx) {
                  x = (idx - 2) * spacing - (isMobile ? 10 : 22);
                  rotate = baseRotations[idx] - 2;
                  y = baseYOffsets[idx];
                  scale = 0.94;
                  zIndex = 10 + idx;
                } else if (idx > targetIdx) {
                  x = (idx - 2) * spacing + (isMobile ? 10 : 22);
                  rotate = baseRotations[idx] + 2;
                  y = baseYOffsets[idx];
                  scale = 0.94;
                  zIndex = 10 + (total - idx);
                }

                return (
                  <motion.div
                    key={dest.id}
                    animate={{
                      x,
                      y,
                      rotate,
                      scale,
                      zIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 23,
                      mass: 0.75
                    }}
                    onMouseEnter={() => {
                      setActiveIdx(idx);
                      setHoveredIdx(idx);
                    }}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIdx(idx);
                      handleOpenDetail(dest);
                    }}
                    style={{
                      position: 'absolute',
                      backgroundColor: dest.cardBg,
                      color: dest.textColor,
                      transformOrigin: 'bottom center',
                      boxShadow: isFront
                        ? '0 24px 48px -10px rgba(45, 24, 12, 0.16), 0 8px 20px -4px rgba(45, 24, 12, 0.08)'
                        : '0 12px 28px -8px rgba(45, 24, 12, 0.1), 0 4px 10px -2px rgba(45, 24, 12, 0.04)'
                    }}
                    className={`w-[235px] sm:w-[255px] md:w-[270px] h-[335px] sm:h-[360px] md:h-[385px] rounded-[26px] sm:rounded-[30px] p-4 sm:p-5 flex flex-col justify-between select-none cursor-pointer border ${
                      isFront ? 'border-[#D9CEBA] ring-1 ring-[#D9CEBA]/60' : 'border-[#E8DFC9]'
                    } transition-shadow duration-300`}
                    title={dest.title}
                  >
                    {/* TOP ROW: Icon Symbol on Left (sesuai foto masing-masing) */}
                    <div>
                      <div className="flex items-center mb-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-black/5 text-black">
                          {renderSymbol(dest.symbolType)}
                        </div>
                      </div>

                      {/* PHOTO THUMBNAIL (Memadukan keindahan foto Jogja dengan layout kartu Gambar 2) */}
                      <div className="w-full h-[120px] sm:h-[135px] md:h-[145px] rounded-[18px] overflow-hidden bg-black/5 shadow-2xs mb-2.5">
                        <img
                          src={dest.bgImage}
                          alt={dest.title}
                          style={{ objectPosition: dest.imagePosition || 'center center' }}
                          draggable={false}
                          className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* BOTTOM CONTENT: Bold Title & 2-Line Text & Link (Persis Gambar 2) */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base md:text-[17px] font-bold font-['Outfit'] leading-tight m-0 text-black">
                        {dest.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs leading-relaxed text-black/75 line-clamp-2 m-0">
                        {dest.cardDesc}
                      </p>

                      <div className="pt-1.5 flex items-center justify-between text-[11px] font-bold text-black">
                        <span>{isSelected ? "Buka Direktori Lengkap" : "Pilih Kartu"}</span>
                        <span className="font-bold">→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
