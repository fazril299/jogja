import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const heroRef = useRef(null);

  // Scroll tracking untuk Sticky Curtain Hero
  const { scrollY } = useScroll();

  // Root hero parallax & fade saat tertutup section di bawahnya
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.94]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0.15]);

  // VitaBoost Scroll Physics - Tugu Meluncur Turun ke Bawah (Downwards Translation)
  // Kurva kecepatan diekstrak langsung dari Framer VitaBoost
  const tuguScrollYRaw = useTransform(
    scrollY,
    [0, 100, 200, 300, 400, 500, 700],
    [0, 74.7, 143.8, 186.0, 208.4, 216.6, 220.5]
  );
  const tuguScaleRaw = useTransform(scrollY, [0, 600], [1, 0.93]);

  // Spring smoothing untuk pergerakan Tugu yang ultra-smooth seperti Framer
  const tuguY = useSpring(tuguScrollYRaw, { stiffness: 120, damping: 28, mass: 0.8 });
  const tuguScale = useSpring(tuguScaleRaw, { stiffness: 120, damping: 28, mass: 0.8 });

  // Teks Raksasa "Yogyakarta": parallax ke bawah lebih lambat dan perlahan memudar
  const textYRaw = useTransform(scrollY, [0, 500], [0, 85]);
  const textOpacity = useTransform(scrollY, [0, 280, 520], [1, 0.65, 0.15]);
  const textY = useSpring(textYRaw, { stiffness: 100, damping: 26 });

  // Elemen UI Bawah (Glass Card Kiri & Editorial Copy Kanan): fade out & slide down saat scroll
  const bottomUiYRaw = useTransform(scrollY, [0, 260], [0, 35]);
  const bottomUiOpacity = useTransform(scrollY, [0, 180, 300], [1, 0.45, 0]);
  const bottomUiY = useSpring(bottomUiYRaw, { stiffness: 120, damping: 26 });

  // Background Parallax
  const bgScaleRaw = useTransform(scrollY, [0, 600], [1.18, 1.28]);
  const bgScale = useSpring(bgScaleRaw, { stiffness: 80, damping: 25 });

  const keratonLandmark = LANDMARKS.find((l) => l.id === 'keraton-yogyakarta') || LANDMARKS[0];

  return (
    <motion.section
      id="hero-section"
      ref={heroRef}
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

        {/* Ambient Gradient Overlay: Menjaga warna sunset tetap hangat & kontras teks optimal */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 9, 6, 0.45) 0%, rgba(14, 9, 6, 0.15) 45%, rgba(10, 6, 4, 0.65) 100%)'
          }}
        />

        {/* Radial Warm Glow di belakang Tugu */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </motion.div>

      {/* 2. GIANT TYPOGRAPHY: "Yogyakarta" di Belakang Tugu (Tepat di Tengah Layar) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: textY,
            opacity: textOpacity
          }}
          className="relative flex items-center justify-center text-center"
        >
          {/* Subtle Heritage Leaf/Motif Accents di Samping Teks (seperti motif VitaBoost) */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 4, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-6 sm:-top-10 -left-4 sm:-left-10 text-amber-200/40 pointer-events-none select-none hidden sm:block"
          >
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md" />
          </motion.div>

          <h1
            className="text-[14.5vw] sm:text-[13.5vw] md:text-[12.8vw] lg:text-[12.2vw] xl:text-[11.8vw] font-serif font-medium tracking-[-0.04em] leading-none text-[#FBF7EE] drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] whitespace-nowrap select-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
            }}
          >
            Yogyakarta
          </h1>
        </motion.div>
      </div>

      {/* 3. CENTERPIECE: Tugu Jogja - Berdiri TEGAK (0deg) di Tengah & Meluncur Turun Saat Scroll */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
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
            rotate: 0 // 100% TEGAK LURUS sesuai instruksi Fazriell
          }}
          className="relative flex items-center justify-center"
        >
          {/* Soft Shadow di Belakang Tugu */}
          <div className="absolute -bottom-8 w-44 sm:w-60 h-10 bg-black/60 blur-2xl rounded-full pointer-events-none" />

          {/* Asset Tugu Jogja: Tegak, Dominan & Terpusat */}
          <img
            src="/tugu_jogja.webp"
            onError={(e) => {
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = 'true';
                e.currentTarget.src = '/assets/images/tugu_jogja.webp';
              }
            }}
            alt="Tugu Pal Putih Yogyakarta"
            className="h-[58vh] sm:h-[66vh] md:h-[72vh] lg:h-[78vh] xl:h-[82vh] max-h-[820px] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] pointer-events-auto select-none transition-transform"
          />
        </motion.div>
      </div>

      {/* 4. SPACER ATAS (Untuk menjaga navbar tidak tabrakan di mobile) */}
      <div className="w-full h-20 sm:h-24 pointer-events-none" />

      {/* 5. FLOATING BOTTOM UI (VitaBoost Exact Layout):
             - Kiri Bawah: Frosted Glass Card Keraton & Tamansari dengan thumbnail & arrow
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
          className="group pointer-events-auto cursor-pointer flex items-center gap-3.5 sm:gap-4 p-2.5 sm:p-3 pr-4 sm:pr-5 rounded-2xl bg-black/35 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:bg-black/50 hover:border-white/35 max-w-[340px] sm:max-w-[370px] w-full sm:w-auto"
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
