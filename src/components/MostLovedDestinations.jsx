import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function MostLovedDestinations({
  onOpenBooking,
  onOpenJapanDetail,
  onOpenSwissDetail,
  onOpenParisDetail,
  onOpenNYDetail
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);

  const destinations = [
    {
      id: 'keraton-yogyakarta',
      shortName: 'Keraton & Tamansari',
      title: 'Keraton & Tamansari Yogyakarta',
      category: 'Poros Sumbu Filosofis UNESCO',
      tagline: 'Pusat kosmologi Kasultanan Mataram Islam, istana air sakral Tamansari, dan keluhuran tradisi warisan dunia.',
      bgImage: '/assets/images/jogja_keraton.jpg',
      imagePosition: 'center 45%',
      onClick: onOpenJapanDetail
    },
    {
      id: 'malioboro-tugu',
      shortName: 'Malioboro & Tugu',
      title: 'Malioboro & Tugu Pal Putih',
      category: 'Denyut Kehidupan & Kota Pusaka',
      tagline: 'Simbol garis kosmologis utara, denyut malam legendaris Pasar Beringharjo, sentra batik, dan aroma arang Kopi Joss.',
      bgImage: '/assets/images/jogja_malioboro.jpg',
      imagePosition: 'center 50%',
      onClick: onOpenSwissDetail
    },
    {
      id: 'kotagede',
      shortName: 'Warisan Kotagede',
      title: 'Warisan Pusaka Kotagede',
      category: 'Ibu Kota Awal Mataram 1586',
      tagline: 'Lorong bersejarah arsitektur Rumah Kalang, makam pendiri Mataram Islam, serta kriya perak yang mendunia.',
      bgImage: '/assets/images/jogja_kotagede.jpg',
      imagePosition: 'center 72%',
      onClick: onOpenParisDetail
    },
    {
      id: 'merapi-kaliurang',
      shortName: 'Merapi & Kaliurang',
      title: 'Merapi, Kaliurang & Ullen Sentalu',
      category: 'Poros Kosmis Utara & Sejarah Keraton',
      tagline: 'Kemegahan gunung sakral Mataram, pesona koleksi seni budaya Museum Ullen Sentalu, dan kesejukan lereng utara.',
      bgImage: '/assets/images/jogja_merapi.jpg',
      imagePosition: 'center 38%',
      onClick: onOpenNYDetail
    }
  ];

  const total = destinations.length;
  const activeDest = destinations[activeIdx];

  // =========================================================================
  // NATIVE CSS STICKY SCROLL CONTROLLER
  // 1. Outer section provides 350vh scroll track
  // 2. Inner viewport is sticky top-0 h-screen (visually pins to screen 100%)
  // 3. Smooth segment calculation with hysteresis to completely eliminate flickering
  // =========================================================================
  useEffect(() => {
    let rafId = null;

    const updateScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      // Progress from 0.0 to 1.0 within the pinned section
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist));

      // Divide scroll track into equal segments with hysteresis dead-zones:
      let newIdx = 0;
      if (progress < 0.28) newIdx = 0;
      else if (progress < 0.58) newIdx = 1;
      else if (progress < 0.88) newIdx = 2;
      else newIdx = 3;

      setActiveIdx((prev) => (prev !== newIdx ? newIdx : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    // Calculate immediately on mount
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
  const goToDestination = useCallback((targetIdx) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;

    // Target midpoint of the target card's segment
    const targetProgress = (targetIdx + 0.5) / total;
    const targetY = sectionTop + targetProgress * scrollableDist;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }, [total]);

  const handleOpenDetail = useCallback(() => {
    if (activeDest.onClick) {
      activeDest.onClick();
    } else if (onOpenBooking) {
      onOpenBooking(activeDest);
    }
  }, [activeDest, onOpenBooking]);

  // Keyboard navigation when user is on this section
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

  return (
    <section
      id="destinations-section"
      ref={sectionRef}
      className="relative w-full h-[350vh] bg-[#FAF6EE]"
    >
      {/* =========================================================================
          NATIVE STICKY FULL-SCREEN VIEWPORT CONTAINER
          Visually pins to the screen 100% stationary while scrolling through cards
          ========================================================================= */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-8 bg-[#FAF6EE] border-b border-[#D9CEBA] overflow-hidden">
        <div className="max-w-[1140px] mx-auto w-full flex flex-col justify-center my-auto py-3 sm:py-5">
          
          {/* =========================================================================
              HEADER (Displays current active destination info with stable height)
              ========================================================================= */}
          <div className="relative z-30 text-center max-w-2xl mx-auto space-y-1.5 mb-6 sm:mb-8 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#8c532b] text-xs font-semibold border border-[#E8DFC9] shadow-2xs pointer-events-auto">
              <Sparkles size={12} className="text-[#8c532b]" />
              <span>Kawasan Ikonik Yogyakarta • Destinasi 0{activeIdx + 1} / 0{total}</span>
            </div>

            {/* Stable height container so title transitions never shift the card stack */}
            <div className="min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${activeDest.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2d180c] font-['Outfit'] m-0 leading-tight"
                >
                  {activeDest.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Stable height container for tagline */}
            <div className="min-h-[1.25rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`tagline-${activeDest.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs sm:text-sm text-neutral-600 m-0 line-clamp-1 max-w-xl mx-auto"
                >
                  {activeDest.tagline}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================================
              TIME MACHINE 3D CARD STACK VIEWPORT (STRICTLY NO LOOPING)
              Clean, minimal, vertically centered card deck with all 4 cards stacked
              ========================================================================= */}
          <div className="relative w-full max-w-[960px] mx-auto h-[320px] sm:h-[380px] md:h-[430px] lg:h-[470px] xl:h-[500px] pt-10 sm:pt-12 flex items-center justify-center select-none group">
            {/* Stacked Cards Deck (Strictly 4 cards, zero looping) */}
            <div className="relative w-full h-[280px] sm:h-[340px] md:h-[390px] lg:h-[430px] xl:h-[460px] flex items-center justify-center">
              {destinations.map((dest, idx) => {
                const t = idx - activeIdx; // t < 0 past, t === 0 front, t > 0 behind
                const isPast = t < 0;
                const isFront = t === 0;

                // Balanced Framer Time Machine Spring Physics for 4 Stacked Cards
                const scale = isPast ? 1.04 : Math.max(0.78, 1 - t * 0.055);
                const yOffset = -14; // Controlled, elegant upward offset
                const y = isPast ? 32 : t * yOffset;
                const opacity = isPast ? 0 : 1;
                const zIndex = 1000 - idx;

                return (
                  <motion.div
                    key={dest.id}
                    initial={false}
                    animate={{
                      y,
                      scale,
                      opacity
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 26,
                      mass: 0.6
                    }}
                    onClick={(e) => {
                      if (isFront) {
                        handleOpenDetail();
                      } else if (t > 0) {
                        e.stopPropagation();
                        goToDestination(idx);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      transformOrigin: 'top center',
                      zIndex,
                      pointerEvents: isPast ? 'none' : 'auto',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)'
                    }}
                    className={`rounded-[24px] sm:rounded-[32px] overflow-hidden border-2 border-[#E8DFC9] bg-neutral-900 shadow-2xl select-none ${
                      isFront
                        ? 'cursor-pointer group/card'
                        : 'cursor-pointer hover:border-amber-300/80 transition-colors'
                    }`}
                    title={isFront ? "Klik untuk melihat direktori destinasi lengkap" : `Buka ${dest.shortName}`}
                  >
                    {/* Image Canvas with Precise Framing */}
                    <img
                      src={cardImageSrc(dest)}
                      alt={dest.title}
                      style={{ objectPosition: dest.imagePosition || 'center center' }}
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      className={`w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 ${
                        isFront ? 'group-hover/card:scale-[1.015]' : ''
                      }`}
                    />

                    {/* Depth dimmer overlay without heavy GPU blur flicker */}
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                      style={{
                        opacity: isFront ? 0 : Math.min(0.35, t * 0.12)
                      }}
                    />

                    {/* Top Rim Light Reflection */}
                    <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

                    {/* Deep Shadow on bottom edge */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
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

// Helper to safely get image source
function cardImageSrc(dest) {
  return dest.bgImage || '/assets/images/jogja_keraton.jpg';
}
