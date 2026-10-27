import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Hero({ onOpenBooking, onOpenNearMe }) {
  const heroRef = useRef(null);

  // 1. SCROLL PHYSICS
  const { scrollY } = useScroll();

  // Parallax turun halus & memudar seiring scroll
  const contentScrollY = useTransform(scrollY, [0, 600], [0, 110]);
  const contentOpacity = useTransform(scrollY, [0, 300, 650], [1, 0.75, 0.15]);
  const contentY = useSpring(contentScrollY, { stiffness: 180, damping: 28 });

  // Background Parallax - Dimulai dari scale 1.0 presisi tanpa pembesaran awal agar tetap tajam (tidak burem)
  const bgScale = useTransform(scrollY, [0, 700], [1.0, 1.07]);

  // 2. INTERACTIVE 3D MOUSE PARALLAX TILT
  const mouseTiltX = useMotionValue(0);
  const mouseTiltY = useMotionValue(0);

  const springTiltX = useSpring(mouseTiltX, { stiffness: 140, damping: 22 });
  const springTiltY = useSpring(mouseTiltY, { stiffness: 140, damping: 22 });

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseTiltY.set(x * 6); // rotateY
    mouseTiltX.set(-y * 4); // rotateX
  };

  const handleMouseLeave = () => {
    mouseTiltX.set(0);
    mouseTiltY.set(0);
  };

  return (
    <header
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 z-10 w-full h-screen min-h-[100dvh] flex flex-col justify-between bg-[#060a10] select-none"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '100vh',
        overflow: 'visible'
      }}
    >
      {/* 1. BACKGROUND IMAGE: Panorama Candi Warisan Mataram (Ultra-HD WebP Tajam) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          src="/assets/images/bg_candi_hero.webp"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = 'true';
              e.currentTarget.src = '/assets/images/bg_candi_hero.webp';
            }
          }}
          alt="Candi Warisan Mataram Yogyakarta"
          fetchPriority="high"
          decoding="async"
          style={{
            scale: bgScale
          }}
          className="absolute inset-0 w-full h-full object-cover object-[center_50%] will-change-transform"
        />

        {/* Ambient Gradient Overlay: Mempertahankan kontras teks dan ketajaman arsitektur candi */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 10, 16, 0.48) 0%, rgba(6, 10, 16, 0.12) 32%, rgba(6, 10, 16, 0.72) 100%)'
          }}
        />
      </div>

      {/* 2. TOP SPACING (Untuk menjaga jarak navbar aman di mobile & desktop) */}
      <div className="w-full h-20 sm:h-24 md:h-28 pointer-events-none" />

      {/* 3. HERO CONTENT STAGE (Jarak proporsional antara Judul, Subjudul, Deskripsi, dan Tombol CTA) */}
      <div
        className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 my-auto flex flex-col items-center text-center pointer-events-none"
        style={{ perspective: 1200 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: contentY,
            opacity: contentOpacity,
            rotateX: springTiltX,
            rotateY: springTiltY,
            transformStyle: 'preserve-3d'
          }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Grand Title: "Yogyakarta" */}
          <h1
            className="text-[13vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.2rem] font-serif font-normal tracking-[-0.035em] leading-[0.94] text-[#FBF7EE] drop-shadow-[0_18px_40px_rgba(0,0,0,0.65)] select-none m-0"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
            }}
          >
            Yogyakarta
          </h1>

          {/* Subtitle Tagline */}
          <p className="text-amber-100/95 text-sm sm:text-base md:text-lg font-medium tracking-wide mt-3 sm:mt-4 max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] font-sans">
            Harmoni Cagar Budaya Candi, Keagungan Keraton &amp; Jiwa Tradisi Jawa
          </p>

          {/* Editorial Description (Jarak seimbang & tidak terlalu jauh) */}
          <p className="text-neutral-200/90 text-xs sm:text-sm md:text-[14.5px] leading-relaxed max-w-lg sm:max-w-xl md:max-w-2xl mt-2.5 sm:mt-3 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-sans">
            Jelajahi keagungan Keraton, megahnya candi bersejarah, dan kekayaan tradisi Jogja dengan panduan{' '}
            <span className="text-amber-300 font-semibold">Radar GPS</span> terintegrasi.
          </p>
        </motion.div>
      </div>

      {/* 4. BOTTOM BAR: Tombol CTA di Samping Kanan */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: contentY,
          opacity: contentOpacity
        }}
        className="relative z-20 w-full px-6 sm:px-10 md:px-14 pb-8 sm:pb-10 flex justify-end items-center pointer-events-none"
      >
        <motion.button
          onClick={onOpenBooking}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group pointer-events-auto inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-stone-900 font-semibold text-xs sm:text-sm shadow-[0_12px_30px_rgba(0,0,0,0.45)] hover:bg-[#faf7f2] transition-all duration-200 cursor-pointer"
        >
          <span>Eksplorasi Destinasi</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </motion.div>
    </header>
  );
}
