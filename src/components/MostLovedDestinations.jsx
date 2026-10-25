import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Compass,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

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

  // Auto-play rotation (every 5s), pauses on hover so user can enjoy undisturbed
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % destinations.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, destinations.length]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % destinations.length);
  };

  const activeDest = destinations[activeIdx];

  const handleOpenDetail = () => {
    if (activeDest.onClick) {
      activeDest.onClick();
    } else if (onOpenBooking) {
      onOpenBooking(activeDest);
    }
  };

  return (
    <section
      id="destinations-section"
      ref={sectionRef}
      className="web-section-100vh px-4 sm:px-8 pt-24 sm:pt-28 pb-10 sm:pb-12 bg-[#FAF6EE] relative flex flex-col justify-center border-b border-[#D9CEBA]"
    >
      <div className="max-w-[1240px] mx-auto w-full flex flex-col justify-center gap-3.5 sm:gap-4 my-auto">
        
        {/* =========================================================================
            HEADER (OUTSIDE THE PHOTO: Displays current active destination info)
            ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto space-y-1 mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#8c532b] text-xs font-semibold border border-[#E8DFC9] shadow-2xs">
            <Sparkles size={12} className="text-[#8c532b]" />
            <span>Kawasan Ikonik Yogyakarta • Destinasi 0{activeIdx + 1} / 0{destinations.length}</span>
          </div>

          {/* Animated Destination Title on Photo Change */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${activeDest.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2d180c] font-['Outfit'] m-0 leading-tight"
            >
              {activeDest.title}
            </motion.h2>
          </AnimatePresence>

          {/* Animated Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`tagline-${activeDest.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm text-neutral-600 m-0 line-clamp-1 max-w-xl mx-auto"
            >
              {activeDest.tagline}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* =========================================================================
            CLEAN PHOTO VIEWPORT (GENEROUS PROPORTIONS & ACCURATE FRAMING)
            ========================================================================= */}
        <div 
          onClick={handleOpenDetail}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] xl:h-[660px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-2 border-[#E8DFC9] bg-neutral-900 cursor-pointer group select-none"
          title="Klik foto untuk membuka direktori lengkap"
        >
          {/* Pure, Uninterrupted Photographic Canvas with Precise Framing */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeDest.id}
              src={activeDest.bgImage}
              alt={activeDest.title}
              style={{ objectPosition: activeDest.imagePosition || 'center center' }}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover select-none group-hover:scale-[1.02] transition-transform duration-700"
            />
          </AnimatePresence>

          {/* Floating Left & Right Arrows (Subtle glassmorphic controls) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Berikutnya"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 active:scale-95"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* =========================================================================
            BOTTOM CONTROLS & NAVIGATION CAPSULES (OUTSIDE THE PHOTO)
            ========================================================================= */}
        <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Destination Selector Capsules */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {destinations.map((dest, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#2d180c] text-white border-[#2d180c] shadow-xs scale-105'
                      : 'bg-white text-neutral-600 border-[#E8DFC9] hover:bg-neutral-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-neutral-300'}`} />
                  <span>{dest.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Controls: Pause/Play toggle, Prev/Next & Detail Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Putar Otomatis" : "Jeda Otomatis"}
              aria-label={isPaused ? "Putar Otomatis" : "Jeda Otomatis"}
              className="w-8 h-8 rounded-full bg-white border border-[#E8DFC9] hover:bg-[#FAF6EE] text-[#2d180c] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              {isPaused ? <Play size={13} className="ml-0.5 text-emerald-600" /> : <Pause size={13} className="text-[#8c532b]" />}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              title="Destinasi Sebelumnya"
              aria-label="Destinasi Sebelumnya"
              className="w-8 h-8 rounded-full bg-white border border-[#E8DFC9] hover:bg-[#FAF6EE] text-[#2d180c] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              title="Destinasi Berikutnya"
              aria-label="Destinasi Berikutnya"
              className="w-8 h-8 rounded-full bg-white border border-[#E8DFC9] hover:bg-[#FAF6EE] text-[#2d180c] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              onClick={handleOpenDetail}
              className="ml-1 px-4 py-1.5 rounded-full bg-[#8c532b] hover:bg-[#a06034] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Compass size={13} />
              <span>Detail Destinasi</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

