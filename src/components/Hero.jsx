import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const heroRef = useRef(null);

  // 1. Mouse coordinates for 3D Tilt with perspective 1200px
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // 3D Tilt: rotateX [10, -10] from top to bottom, rotateY [-12, 12] from left to right
  const rotateXRaw = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateYRaw = useTransform(mouseX, [0, 1], [-12, 12]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 120, damping: 20 });

  // 2. Scroll Physics & Sticky Curtain Transitions
  const { scrollY } = useScroll();

  // Root Hero section fades and scales down as user scrolls
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  // Tugu scroll physics with useSpring (stiffness: 100, damping: 25)
  // y: 0 -> -120, scale: [1, 1.12, 0.95], rotateZ: 0 -> -6
  const tuguScrollYRaw = useTransform(scrollY, [0, 500], [0, -120]);
  const tuguScrollScaleRaw = useTransform(scrollY, [0, 250, 500], [1, 1.12, 0.95]);
  const tuguScrollRotateZRaw = useTransform(scrollY, [0, 500], [0, -6]);

  const tuguY = useSpring(tuguScrollYRaw, { stiffness: 100, damping: 25 });
  const tuguScale = useSpring(tuguScrollScaleRaw, { stiffness: 100, damping: 25 });
  const tuguRotateZ = useSpring(tuguScrollRotateZRaw, { stiffness: 100, damping: 25 });

  return (
    <motion.div
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        scale: heroScale,
        opacity: heroOpacity
      }}
      className="sticky top-0 h-screen w-full z-10 overflow-hidden flex flex-col justify-center bg-[#0d0906]"
    >
      {/* Background Image: Senja Jogja with balanced thin dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
      >
        <img
          src="/bg_senja_jogja.webp"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = 'true';
              e.currentTarget.src = '/assets/images/bg_senja_jogja.webp';
            }
          }}
          alt="Senja Yogyakarta"
          fetchPriority="high"
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block'
          }}
        />
        {/* Balanced Thin Dark Overlay so text is readable while sunset stays vibrant */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(12, 8, 5, 0.48) 0%, rgba(12, 8, 5, 0.25) 45%, rgba(10, 6, 4, 0.6) 100%)'
          }}
        />
      </motion.div>

      {/* Central Content Area: 3 Columns Desktop Grid */}
      <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 my-auto pt-24 sm:pt-28 pb-8">
        
        {/* Kolom Kiri (lg:col-span-5): Headline & Filosofi */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-start text-left z-10"
        >
          {/* Tagline */}
          <span className="hero-tagline">
            Eksplorasi Pusaka &amp; Kuliner Jogja
          </span>

          {/* Main Headline */}
          <h1 className="hero-headline !text-3xl sm:!text-4xl lg:!text-5xl xl:!text-[3.25rem] !leading-[1.08] !tracking-tight">
            <span style={{ display: 'block' }}>Warisan Tradisi.</span>
            <span style={{ display: 'block' }}>Cita Rasa Autentik.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle !text-xs sm:!text-sm lg:!text-[14.5px] !leading-relaxed !text-neutral-200/90 !max-w-lg !mt-3">
            Jelajahi keagungan Keraton, megahnya candi-candi bersejarah, dan kekayaan tradisi Jogja lengkap dengan panduan{' '}
            <strong style={{ color: '#f3c97e' }}>Radar GPS Kuliner</strong>{' '}
            untuk menemukan kelezatan lokal terdekatmu.
          </p>
        </motion.div>

        {/* Kolom Tengah (lg:col-span-3): Tugu Jogja 3D Physics (VitaBoost style) */}
        <div className="lg:col-span-3 flex items-center justify-center relative my-4 lg:my-0 z-20 pointer-events-none">
          {/* Wrapper Luar: VitaBoost Entry Spring + Scroll physics + 3D Mouse Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 180, rotateZ: -18, rotateX: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateZ: 0, rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 45,
              damping: 11,
              mass: 1.1,
              delay: 0.35
            }}
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d',
              y: tuguY,
              scale: tuguScale,
              rotateZ: tuguRotateZ,
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            className="relative flex items-center justify-center"
          >
            {/* Pulsing Warm Amber Glow behind Tugu */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.65, 0.35]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-56 h-72 sm:w-72 sm:h-96 rounded-full bg-amber-400/30 blur-3xl pointer-events-none -z-10"
            />

            {/* Wrapper Dalam: Idle Floating with Variants (activated after entry bounce) */}
            <motion.img
              src="/tugu_jogja.webp"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = 'true';
                  e.currentTarget.src = '/assets/images/tugu_jogja.webp';
                }
              }}
              alt="Tugu Pal Putih Yogyakarta"
              variants={{
                initial: { y: 0, rotate: 0 },
                visible: {
                  y: [0, -12, 0],
                  rotate: [-1.2, 1.2, -1.2],
                  transition: {
                    y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" }
                  }
                }
              }}
              initial="initial"
              animate="visible"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="w-auto h-[440px] sm:h-[490px] md:h-[570px] lg:h-[600px] max-h-[70vh] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] pointer-events-auto select-none cursor-pointer"
            />
          </motion.div>
        </div>

        {/* Kolom Kanan (lg:col-span-4): Destination Pills & Interactive Hint */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 flex flex-col items-center lg:items-end w-full z-10"
        >
          <div className="hero-pills-col w-full flex flex-col gap-3">
            {[
              {
                id: 'keraton-yogyakarta',
                title: 'Keraton & Tamansari',
                subtitle: 'Sumbu Filosofis UNESCO',
                image: '/assets/images/jogja_keraton.jpg'
              },
              {
                id: 'malioboro-tugu',
                title: 'Malioboro & Tugu',
                subtitle: 'Kopi Joss & Batik',
                image: '/assets/images/jogja_malioboro.jpg'
              },
              {
                id: 'kotagede',
                title: 'Warisan Kotagede',
                subtitle: 'Mataram 1586 & Perak',
                image: '/assets/images/jogja_kotagede.jpg'
              },
              {
                id: 'merapi-kaliurang',
                title: 'Merapi & Kaliurang',
                subtitle: 'Ullen Sentalu & Jadah Tempe',
                image: '/assets/images/jogja_merapi.jpg'
              }
            ].map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`hero-pill-wrapper ${isFirst ? 'hero-pill-wrapper--first' : ''}`}
                >
                  <div
                    className={`hero-feature-pill ${isFirst ? 'hero-feature-pill--hinted' : ''}`}
                    onClick={() => {
                      const landmark = LANDMARKS.find((l) => l.id === item.id) || LANDMARKS[idx];
                      if (onSelectLandmark) onSelectLandmark(landmark);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.title} - ${item.subtitle}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const landmark = LANDMARKS.find((l) => l.id === item.id) || LANDMARKS[idx];
                        if (onSelectLandmark) onSelectLandmark(landmark);
                      }
                    }}
                  >
                    {/* Petunjuk / Hint khusus container pertama */}
                    {isFirst && (
                      <motion.div
                        className="hero-pill-floating-hint"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85, duration: 0.45, ease: 'easeOut' }}
                      >
                        <div className="hero-hint-content">
                          <Sparkles size={12} className="hero-hint-sparkle" />
                          <span className="hero-hint-text">Ayo Klik Aku!</span>
                        </div>
                        <div className="hero-hint-arrow-down" />
                      </motion.div>
                    )}

                    <div className="hero-feature-pill-thumb">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="hero-feature-pill-title">{item.title}</span>
                      <span className="hero-feature-pill-subtitle">{item.subtitle}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
