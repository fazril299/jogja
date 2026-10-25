import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const heroRef = useRef(null);

  // Scroll Physics for Root Sticky Curtain Transition
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  // VitaBoost Scroll Physics on Tugu: meluncur turun ke bawah section saat di-scroll
  const tuguScrollYRaw = useTransform(scrollY, [0, 500], [0, 220]);
  const tuguScrollScaleRaw = useTransform(scrollY, [0, 500], [1, 0.92]);
  const tuguScrollRotateZRaw = useTransform(scrollY, [0, 500], [0, 0]);

  const tuguY = useSpring(tuguScrollYRaw, { stiffness: 100, damping: 25 });
  const tuguScale = useSpring(tuguScrollScaleRaw, { stiffness: 100, damping: 25 });
  const tuguRotateZ = useSpring(tuguScrollRotateZRaw, { stiffness: 100, damping: 25 });

  return (
    <motion.div
      id="hero-section"
      ref={heroRef}
      style={{
        scale: heroScale,
        opacity: heroOpacity
      }}
      className="sticky top-0 w-full h-screen min-h-screen h-[100dvh] min-h-[100dvh] z-10 overflow-hidden flex flex-col justify-center bg-[#0d0906]"
    >
      {/* Background Image: Senja Jogja with Zoom-In (scale-125) and balanced thin dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
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
          className="scale-125 transition-transform duration-700 ease-out"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 45%',
            display: 'block',
            transform: 'scale(1.25)',
            transformOrigin: 'center center'
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
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 my-auto pt-24 sm:pt-28 pb-8">
        
        {/* Kolom Kiri (lg:col-span-4 xl:col-span-4): Headline & Filosofi */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 xl:col-span-4 flex flex-col items-start text-left z-10"
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

        {/* Kolom Tengah (lg:col-span-4 xl:col-span-4): Tugu Jogja Animasi VitaBoost (+30% Ukuran) */}
        <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-center relative my-4 lg:my-0 z-20 pointer-events-none">
          {/* Outer Layer: VitaBoost Entry Spring (scale: 0.6 -> 1, rotate: 20deg -> 0deg, stiffness: 200, damping: 60) + Scroll Physics */}
          <motion.div
            initial={{ opacity: 0.001, scale: 0.6, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 60,
              mass: 1.2,
              delay: 0.1
            }}
            style={{
              y: tuguY,
              scale: tuguScale,
              rotateZ: tuguRotateZ
            }}
            className="relative flex items-center justify-center"
          >
            {/* Ambient Warm Amber Glow behind Tugu (Statis Lembut) */}
            <div className="absolute w-64 h-80 sm:w-80 sm:h-[480px] rounded-full bg-amber-400/25 blur-3xl pointer-events-none -z-10" />

            {/* Objek Tugu (+30% Dominan) - Diam dan Statis Sepenuhnya Setelah Mendarat */}
            <img
              src="/tugu_jogja.webp"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = 'true';
                  e.currentTarget.src = '/assets/images/tugu_jogja.webp';
                }
              }}
              alt="Tugu Pal Putih Yogyakarta"
              className="w-auto h-[540px] sm:h-[620px] md:h-[700px] lg:h-[760px] xl:h-[820px] max-h-[85vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)] pointer-events-auto select-none"
            />
          </motion.div>
        </div>

        {/* Kolom Kanan (lg:col-span-4 xl:col-span-4): Destination Pills & Interactive Hint */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 xl:col-span-4 flex flex-col items-center lg:items-end w-full z-10"
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
