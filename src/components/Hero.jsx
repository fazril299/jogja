import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const heroRef = useRef(null);

  // 1. SCROLL PHYSICS (Persis sesuai struktur Framer VitaBoost)
  const { scrollY } = useScroll();

  // Tugu Jogja meluncur turun ke bawah seiring scroll
  // Saat section kedua (putih) naik ke atas, Tugu bergerak turun sehingga section putih
  // memotong dan menutupi badan Tugu secara horizontal presisi seperti di VitaBoost
  const tuguScrollY = useTransform(
    scrollY,
    [0, 100, 250, 400, 600, 800],
    [0, 60, 140, 240, 360, 480]
  );
  const tuguScrollScale = useTransform(scrollY, [0, 800], [1, 0.95]);

  const tuguY = useSpring(tuguScrollY, { stiffness: 220, damping: 28, mass: 0.6 });
  const tuguScale = useSpring(tuguScrollScale, { stiffness: 220, damping: 28, mass: 0.6 });

  // Teks Raksasa "Yogyakarta": Parallax turun perlahan ke bawah & memudar
  const textScrollY = useTransform(scrollY, [0, 600], [0, 140]);
  const textOpacity = useTransform(scrollY, [0, 250, 600], [1, 0.7, 0.2]);
  const textY = useSpring(textScrollY, { stiffness: 180, damping: 28 });

  // Elemen UI Bawah (Glass Card Kiri & Editorial Copy Kanan): fade out & slide down saat scroll
  const bottomUiScrollY = useTransform(scrollY, [0, 220], [0, 40]);
  const bottomUiOpacity = useTransform(scrollY, [0, 100, 220], [1, 0.4, 0]);
  const bottomUiY = useSpring(bottomUiScrollY, { stiffness: 220, damping: 28 });

  // Background Parallax
  const bgScale = useTransform(scrollY, [0, 700], [1.08, 1.18]);

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

    mouseTiltY.set(x * 8); // rotateY
    mouseTiltX.set(-y * 5); // rotateX
  };

  const handleMouseLeave = () => {
    mouseTiltX.set(0);
    mouseTiltY.set(0);
  };

  const keratonLandmark = LANDMARKS.find((l) => l.id === 'keraton-yogyakarta') || LANDMARKS[0];

  return (
    <header
      id="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 z-10 w-full h-[95vh] min-h-[640px] flex flex-col justify-between bg-[#0d0906] select-none"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '95vh',
        overflow: 'visible' // Wajib overflow visible agar Tugu ditutupi secara fisik oleh section berikutnya
      }}
    >
      {/* 1. BACKGROUND IMAGE: Full-bleed Senja Jogja dengan Dark Vignette Natural */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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

        {/* Ambient Gradient Overlay: Mempertahankan kontras teks dan kehangatan senja */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14, 9, 6, 0.4) 0%, rgba(14, 9, 6, 0.1) 40%, rgba(10, 6, 4, 0.65) 100%)'
          }}
        />
      </div>

      {/* 2. GIANT TYPOGRAPHY: "Yogyakarta" di Belakang Tugu (Tepat di Tengah Layar) */}
      <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none px-4" style={{ overflow: 'visible' }}>
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: textY,
            opacity: textOpacity
          }}
          className="relative flex items-center justify-center text-center"
        >
          <h1
            className="text-[14.5vw] sm:text-[13.5vw] md:text-[12.8vw] lg:text-[12.2vw] xl:text-[11.8vw] font-serif font-medium tracking-[-0.04em] leading-none text-[#FBF7EE] drop-shadow-[0_20px_45px_rgba(0,0,0,0.45)] whitespace-nowrap select-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
            }}
          >
            Yogyakarta
          </h1>
        </motion.div>
      </div>

      {/* 3. CENTERPIECE: TUGU JOGJA 3D (TEGAK 100%, OVERFLOW VISIBLE, MELUNCUR TURUN & DITUTUPI SECTION BERIKUTNYA) */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: 1200, overflow: 'visible' }}
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
            rotateX: springTiltX,
            rotateY: springTiltY,
            transformStyle: 'preserve-3d'
          }}
          className="relative flex items-center justify-center pointer-events-auto"
        >
          {/* Double Layer 3D Contact Shadow di Bawah Alas Tugu */}
          <div className="absolute -bottom-6 w-36 sm:w-52 h-8 bg-black/80 blur-md rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 w-64 sm:w-96 h-14 bg-black/50 blur-2xl rounded-full pointer-events-none" />

          {/* Objek Tugu Jogja Bersih & Tegak 100% */}
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
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.75))'
            }}
            className="h-[58vh] sm:h-[66vh] md:h-[72vh] lg:h-[78vh] xl:h-[82vh] max-h-[820px] w-auto object-contain select-none transition-transform duration-100 ease-out will-change-transform"
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
    </header>
  );
}
