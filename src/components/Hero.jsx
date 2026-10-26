import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const heroRef = useRef(null);

  // 1. SCROLL PHYSICS (Mendengarkan native window scroll)
  const { scrollY } = useScroll();

  // Root hero sticky curtain cover physics
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.2]);

  // Pergerakan Tugu Meluncur Turun ke Bawah (Downwards Translation seperti botol VitaBoost)
  // Responsif instan terhadap scroll
  const tuguScrollY = useTransform(scrollY, [0, 150, 300, 500, 750], [0, 85, 175, 275, 360]);
  const tuguScrollScale = useTransform(scrollY, [0, 750], [1, 0.92]);
  const tuguScrollRotateX = useTransform(scrollY, [0, 750], [0, 6]); // subtle 3D lean back saat turun

  // Spring interpolator yang responsif namun luwes
  const tuguY = useSpring(tuguScrollY, { stiffness: 220, damping: 30, mass: 0.6 });
  const tuguScale = useSpring(tuguScrollScale, { stiffness: 220, damping: 30, mass: 0.6 });
  const tuguRotateX = useSpring(tuguScrollRotateX, { stiffness: 220, damping: 30, mass: 0.6 });

  // Teks Raksasa "Yogyakarta": Parallax ke bawah & memudar
  const textScrollY = useTransform(scrollY, [0, 600], [0, 120]);
  const textOpacity = useTransform(scrollY, [0, 240, 520], [1, 0.55, 0.1]);
  const textY = useSpring(textScrollY, { stiffness: 180, damping: 28 });

  // Elemen UI Bawah (Glass Card Kiri & Editorial Copy Kanan): fade out & slide down saat scroll
  const bottomUiScrollY = useTransform(scrollY, [0, 260], [0, 45]);
  const bottomUiOpacity = useTransform(scrollY, [0, 160, 280], [1, 0.4, 0]);
  const bottomUiY = useSpring(bottomUiScrollY, { stiffness: 200, damping: 28 });

  // Background Parallax
  const bgScale = useTransform(scrollY, [0, 700], [1.15, 1.25]);

  // 2. INTERACTIVE 3D MOUSE PARALLAX TILT (Efek Kedalaman 3D seperti Framer)
  const mouseTiltX = useMotionValue(0);
  const mouseTiltY = useMotionValue(0);
  const mouseGlowX = useMotionValue(50);
  const mouseGlowY = useMotionValue(50);

  const springTiltX = useSpring(mouseTiltX, { stiffness: 140, damping: 22 });
  const springTiltY = useSpring(mouseTiltY, { stiffness: 140, damping: 22 });

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 sampai 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 sampai 0.5

    // Rotasi 3D halus (maksimal 4.5 derajat agar tetap tegak berwibawa)
    mouseTiltY.set(x * 9); // rotateY
    mouseTiltX.set(-y * 6); // rotateX
    mouseGlowX.set(50 + x * 30);
    mouseGlowY.set(50 + y * 30);
  };

  const handleMouseLeave = () => {
    mouseTiltX.set(0);
    mouseTiltY.set(0);
    mouseGlowX.set(50);
    mouseGlowY.set(50);
  };

  const keratonLandmark = LANDMARKS.find((l) => l.id === 'keraton-yogyakarta') || LANDMARKS[0];

  return (
    <motion.section
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        scale: heroScale,
        opacity: heroOpacity
      }}
      className="sticky top-0 z-0 w-full h-[100vh] min-h-[640px] max-h-screen overflow-hidden flex flex-col justify-between bg-[#0d0906] select-none"
    >
      {/* 1. BACKGROUND: Senja Jogja Parallax + Subtle Dark Vignette Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <motion.img
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
            scale: bgScale
          }}
          className="absolute inset-0 w-full h-full object-cover object-[center_45%]"
        />

        {/* Ambient Gradient Overlay: Mempertahankan warna sunset Jogja & kontras teks */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 9, 6, 0.45) 0%, rgba(14, 9, 6, 0.12) 42%, rgba(10, 6, 4, 0.7) 100%)'
          }}
        />

        {/* Dynamic Warm Radial Glow di balik Tugu */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/18 blur-3xl pointer-events-none" />
      </motion.div>

      {/* 2. GIANT TYPOGRAPHY: "Yogyakarta" di Belakang Tugu (Tepat di Tengah Layar) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: textY,
            opacity: textOpacity
          }}
          className="relative flex items-center justify-center text-center"
        >
          {/* Subtle Golden Heritage Sparkle Accent di Samping Teks */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 4, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-6 sm:-top-10 -left-4 sm:-left-10 text-amber-300/50 pointer-events-none select-none hidden sm:block"
          >
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md" />
          </motion.div>

          <h1
            className="text-[14.5vw] sm:text-[13.5vw] md:text-[12.8vw] lg:text-[12.2vw] xl:text-[11.8vw] font-serif font-medium tracking-[-0.04em] leading-none text-[#FBF7EE] drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)] whitespace-nowrap select-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
            }}
          >
            Yogyakarta
          </h1>
        </motion.div>
      </div>

      {/* 3. CENTERPIECE: TUGU JOGJA 3D (TEGAK, 3D LIGHTING & MOUSE TILT, MELUNCUR TURUN SAAT SCROLL) */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ perspective: 1200 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{
            y: tuguY,
            scale: tuguScale,
            rotateX: tuguRotateX,
            rotateY: springTiltY,
            transformStyle: 'preserve-3d'
          }}
          className="relative flex items-center justify-center pointer-events-auto"
        >
          {/* Double Layer 3D Contact Shadow di Bawah Alas Tugu */}
          <div className="absolute -bottom-6 w-36 sm:w-52 h-8 bg-black/80 blur-md rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 w-64 sm:w-96 h-14 bg-black/50 blur-2xl rounded-full pointer-events-none" />

          {/* 3D Golden Dusk Rim-Light Ambient Aura di sekitar Tugu */}
          <div className="absolute inset-0 -m-4 rounded-3xl bg-amber-400/10 blur-2xl pointer-events-none" />

          {/* Objek Tugu Jogja dengan Multi-Layer 3D Depth Shadow & Lighting Filter */}
          <img
            src="/tugu_jogja.webp"
            onError={(e) => {
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = 'true';
                e.currentTarget.src = '/assets/images/tugu_jogja.webp';
              }
            }}
            alt="Tugu Pal Putih Yogyakarta"
            style={{
              filter:
                'drop-shadow(0 20px 45px rgba(0,0,0,0.85)) drop-shadow(0 0 35px rgba(245, 180, 80, 0.28))'
            }}
            className="h-[58vh] sm:h-[66vh] md:h-[72vh] lg:h-[78vh] xl:h-[82vh] max-h-[820px] w-auto object-contain select-none transition-transform duration-100 ease-out will-change-transform"
          />

          {/* 3D Specular Highlight Sheen (Kilau Cahaya Dinamis Mengikuti Mouse/Tilt) */}
          <motion.div
            style={{
              background:
                'radial-gradient(ellipse at 45% 35%, rgba(255,235,180,0.18) 0%, rgba(255,255,255,0) 65%)'
            }}
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
          />
        </motion.div>
      </div>

      {/* 4. SPACER ATAS (Untuk menjaga navbar tidak tabrakan di mobile) */}
      <div className="w-full h-20 sm:h-24 pointer-events-none" />

      {/* 5. FLOATING BOTTOM UI (VitaBoost Exact Layout):
             - Kiri Bawah: Frosted Glass Card Keraton & Tamansari
             - Kanan Bawah: Editorial Description + White Luxury Pill CTA Button
      */}
      <motion.div
        style={{
          y: bottomUiY,
          opacity: bottomUiOpacity
        }}
        className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-12 lg:pb-14 flex flex-col md:flex-row items-center md:items-end justify-between gap-5 sm:gap-6 pointer-events-none"
      >
        {/* Kiri Bawah: Floating Glass Card (Keraton & Tamansari) */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            if (onSelectLandmark) onSelectLandmark(keratonLandmark);
          }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="group pointer-events-auto cursor-pointer flex items-center gap-3.5 sm:gap-4 p-2.5 sm:p-3 pr-4 sm:pr-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-black/55 hover:border-white/35 max-w-[340px] sm:max-w-[370px] w-full sm:w-auto"
          role="button"
          tabIndex={0}
          aria-label="Eksplorasi Keraton dan Tamansari"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onSelectLandmark) onSelectLandmark(keratonLandmark);
            }
          }}
        >
          {/* Thumbnail Keraton Jogja */}
          <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-xl overflow-hidden flex-shrink-0 border border-white/20 shadow-inner">
            <img
              src="/assets/images/jogja_keraton.jpg"
              alt="Keraton & Tamansari"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
          </div>

          {/* Info Card */}
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-white font-semibold text-sm sm:text-[15px] leading-snug truncate font-sans tracking-tight">
              Keraton &amp; Tamansari
            </span>
            <span className="text-amber-200/90 text-xs sm:text-[13px] leading-tight font-medium mt-1">
              Sumbu Filosofis UNESCO
            </span>
          </div>

          {/* Arrow Button */}
          <div className="ml-auto w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-white group-hover:text-stone-900 text-white transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </motion.div>

        {/* Kanan Bawah: Editorial Description & Pill Action Button */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col items-center md:items-end text-center md:text-right gap-3.5 max-w-sm sm:max-w-md w-full md:w-auto"
        >
          <p className="text-neutral-200/90 text-xs sm:text-sm md:text-[14.5px] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-sans">
            Jelajahi keagungan Keraton, megahnya candi bersejarah, dan kekayaan tradisi Jogja dengan panduan{' '}
            <span className="text-amber-300 font-medium">Radar GPS</span> terintegrasi.
          </p>

          {/* White Luxury Pill Button (Persis VitaBoost) */}
          <motion.button
            onClick={onOpenBooking}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-stone-900 font-semibold text-sm sm:text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:bg-[#faf7f2] transition-all duration-200 cursor-pointer"
          >
            <span>Eksplorasi Destinasi</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
