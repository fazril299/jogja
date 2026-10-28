import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // 5 Destinasi Ikonik Yogyakarta (Warna Spektrum Otentik Si Jojo Tanpa Hijau + Ikon Asli Jogja)
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
      cardBg: '#E8CAAC', // Coksu Lurik Si Jojo
      textColor: '#2D180C',
      accentColor: '#2D180C',
      iconSrc: '/assets/icons/icon_all.svg', // Ikon Batik Keraton / Sumbu Filosofis Asli Pengguna
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
      cardBg: '#F0C254', // Emas Bros Keraton & Pin Tugu Si Jojo
      textColor: '#2D180C',
      accentColor: '#2D180C',
      iconSrc: '/assets/icons/icon_soul.svg', // Ikon Sayap Denyut Jiwa Jogja Asli Pengguna
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
      cardBg: '#D5C4B4', // Perak Antik Kotagede & Kamera Vintage Jojo
      textColor: '#22150A',
      accentColor: '#22150A',
      iconSrc: '/assets/icons/icon_culture.svg', // Ikon Pusaka Budaya Asli Pengguna
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
      cardBg: '#DE7445', // Oranye Paruh Ramah Si Jojo & Senja Ratu Boko
      textColor: '#FFFFFF',
      accentColor: '#FFFFFF',
      iconSrc: '/assets/icons/icon_culture.svg', // Ikon Cagar Budaya Asli Pengguna
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
      cardBg: '#4A2B18', // Cokelat Tua Lurik & Gagang Keris Si Jojo (Bukan Hijau)
      textColor: '#FFFFFF',
      accentColor: '#FFFFFF',
      iconSrc: '/assets/icons/icon_nature.svg', // Ikon Bentang Alam Asli Pengguna
      onClick: onOpenNYDetail
    }
  ];

  const total = destinations.length;
  const activeDest = destinations[activeIdx];
  const targetIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

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
        setActiveIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

    // Touch swipe gesture for mobile
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      // swipe left -> next card
      setActiveIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
    } else if (diff < -35) {
      // swipe right -> prev card
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
    }
    touchStartX.current = null;
  };

  // Base Fan Angles & Offsets (Fanned Deck Structure)
  const baseRotations = isMobile ? [-7, -3.5, 0, 3.5, 7] : [-14, -7, 0, 7, 14];
  const baseYOffsets = isMobile ? [8, 2, 0, 2, 8] : [12, 3, 0, 3, 12];
  const spacing = isMobile ? 36 : 112;

  return (
    <section
      id="destinations-section"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 bg-[#FAF6EE] border-b border-[#D9CEBA]/60 overflow-hidden"
    >
      <div className="max-w-[1140px] mx-auto w-full px-4 sm:px-8">
        {/* =========================================================================
            SYNCED HEADER
            ========================================================================= */}
        <div className="mb-4 sm:mb-6 max-w-[1040px] mx-auto w-full px-2">
          <div className="space-y-1 max-w-xl">
            {/* Big Synced Title */}
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
                className="text-xs sm:text-[13px] text-[#554E46] m-0 line-clamp-1 max-w-lg"
              >
                {activeDest.tagline}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================================
            FRAMER 3D OVERLAPPING FANNED CARDS (BEBAS SCROLL TRAPPING)
            ========================================================================= */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-[1040px] mx-auto h-[290px] sm:h-[370px] md:h-[435px] pt-1 sm:pt-4 flex items-center justify-center select-none group"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {destinations.map((dest, idx) => {
              const isSelected = activeIdx === idx;
              const isHovered = hoveredIdx === idx;
              const isFront = targetIdx === idx;

              // Physics kalkulasi posisi fanned deck:
              let x = (idx - 2) * spacing;
              let y = baseYOffsets[idx];
              let rotate = baseRotations[idx];
              let scale = 0.95;
              let zIndex = 10;

              if (isFront) {
                x = (idx - 2) * spacing;
                y = isMobile ? -14 : -24;
                rotate = 0;
                scale = isMobile ? 1.02 : 1.06;
                zIndex = 50;
              } else if (idx < targetIdx) {
                x = (idx - 2) * spacing - (isMobile ? 6 : 22);
                rotate = baseRotations[idx] - 2;
                y = baseYOffsets[idx];
                scale = 0.94;
                zIndex = 10 + idx;
              } else if (idx > targetIdx) {
                x = (idx - 2) * spacing + (isMobile ? 6 : 22);
                rotate = baseRotations[idx] + 2;
                y = baseYOffsets[idx];
                scale = 0.94;
                zIndex = 10 + (total - idx);
              }

              const isLightText = dest.textColor === '#FFFFFF';

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
                    if (activeIdx === idx) {
                      handleOpenDetail(dest);
                    } else {
                      setActiveIdx(idx);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    backgroundColor: dest.cardBg,
                    color: dest.textColor,
                    transformOrigin: 'bottom center',
                    boxShadow: isFront
                      ? '0 24px 48px -10px rgba(45, 24, 12, 0.18), 0 8px 20px -4px rgba(45, 24, 12, 0.08)'
                      : '0 12px 28px -8px rgba(45, 24, 12, 0.1), 0 4px 10px -2px rgba(45, 24, 12, 0.04)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)'
                  }}
                  className={`w-[180px] sm:w-[235px] md:w-[270px] h-[260px] sm:h-[335px] md:h-[385px] rounded-[22px] sm:rounded-[26px] md:rounded-[30px] p-3 sm:p-4 md:p-5 flex flex-col justify-between select-none cursor-pointer border ${
                    isFront ? 'border-white/40 ring-2 ring-black/10' : 'border-black/10'
                  } transition-shadow duration-300`}
                  title={dest.title}
                >
                  {/* TOP ROW: Ikon Budaya */}
                  <div>
                    <div className="flex items-center mb-2.5">
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-1 sm:p-1.5 transition-colors"
                        style={{
                          backgroundColor: isLightText ? 'rgba(255, 255, 255, 0.22)' : 'rgba(45, 24, 12, 0.08)'
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 sm:w-[17px] sm:h-[17px]"
                          style={{
                            backgroundColor: dest.textColor,
                            maskImage: `url(${dest.iconSrc})`,
                            WebkitMaskImage: `url(${dest.iconSrc})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center'
                          }}
                        />
                      </div>
                    </div>

                    {/* PHOTO THUMBNAIL */}
                    <div className="w-full h-[88px] sm:h-[120px] md:h-[145px] rounded-[14px] sm:rounded-[18px] overflow-hidden bg-black/10 shadow-2xs mb-1.5 sm:mb-2.5">
                      <img
                        src={dest.bgImage}
                        alt={dest.title}
                        style={{ objectPosition: dest.imagePosition || 'center center' }}
                        draggable={false}
                        className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* BOTTOM CONTENT: Bold Title & 2-Line Text & Link */}
                  <div className="space-y-1">
                    <h3
                      className="text-xs sm:text-base md:text-[17px] font-bold font-['Outfit'] leading-tight m-0"
                      style={{ color: dest.textColor }}
                    >
                      {dest.title}
                    </h3>
                    <p
                      className="text-[10px] sm:text-xs leading-snug font-medium line-clamp-2 m-0"
                      style={{
                        color: dest.textColor,
                        opacity: isLightText ? 0.92 : 0.82
                      }}
                    >
                      {dest.cardDesc}
                    </p>

                    <div
                      className="pt-1 flex items-center justify-between text-[10px] sm:text-[11px] font-bold"
                      style={{ color: dest.textColor }}
                    >
                      <span>{isSelected ? "Buka Direktori Lengkap" : "Pilih Kartu"}</span>
                      <span className="font-bold">→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Pagination Indicators (5 Dots) */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3 select-none">
          {destinations.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`Lihat kartu ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer border-none p-0 ${
                activeIdx === i ? 'w-5 bg-[#8c532b]' : 'w-1.5 bg-[#D9CEBA]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
