import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Hero({ onOpenBooking, onOpenNearMe }) {
  const heroRef = useRef(null);

  // 1. SCROLL PHYSICS
  const { scrollY } = useScroll();

  // Parallax turun halus & memudar seiring scroll (untuk teks)
  const contentScrollY = useTransform(scrollY, [0, 600], [0, 90]);
  const contentOpacity = useTransform(scrollY, [0, 350, 700], [1, 0.75, 0.2]);
  const contentY = useSpring(contentScrollY, { stiffness: 120, damping: 24 });

  // Jojo Scroll Physics (Slowmo & Silky Smooth, turun hanya sampai sebatas setengah badan / pinggang saja)
  // Ditransformasi perlahan ke 235px di rentang scroll [0, 750] sehingga Jojo turun slowmo sebatas pinggang
  const mascotScrollY = useTransform(scrollY, [0, 750], [0, 235]);
  // Opacity tetap solid (1.0) selama scroll exit agar setengah badan atas Jojo tetap tampil jelas
  const mascotOpacity = useTransform(scrollY, [0, 650, 950], [1, 1, 0.5]);
  // Spring Slowmo: stiffness 48, damping 22, mass 1.2 memberikan efek glide slow-motion yang sangat halus dan berbobot
  const mascotY = useSpring(mascotScrollY, { stiffness: 48, damping: 22, mass: 1.2 });

  // Background Parallax
  const bgScale = useTransform(scrollY, [0, 700], [1.0, 1.06]);

  return (
    <header
      id="hero-section"
      ref={heroRef}
      className="sticky top-0 z-10 w-full h-screen min-h-[100dvh] relative flex items-center justify-center bg-[#060a10] select-none overflow-hidden"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* 1. BACKGROUND IMAGE: Panorama Candi Warisan Mataram */}
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

        {/* Ambient Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 10, 16, 0.45) 0%, rgba(6, 10, 16, 0.12) 35%, rgba(6, 10, 16, 0.7) 100%)'
          }}
        />
      </div>

      {/* 2. LAYER BELAKANG: GRAND TITLE "Yogyakarta" (z-10 di belakang Jojo) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: contentY,
          opacity: contentOpacity
        }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4 select-none"
      >
        <h1
          className="text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[9.5rem] xl:text-[11rem] font-serif font-normal tracking-[-0.035em] leading-none text-[#FBF7EE] drop-shadow-[0_18px_45px_rgba(0,0,0,0.7)] select-none m-0 text-center"
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
          }}
        >
          Yogyakarta
        </h1>
      </motion.div>

      {/* 3. LAYER DEPAN: MASCOT JOJO FULL BODY (z-20 di depan teks Yogyakarta, turun slowmo & smooth sampai sebatas pinggang) */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex items-end justify-center overflow-visible">
        {/* Entrance motion container: Masuk meluncur halus saat web dibuka */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 85,
            damping: 20,
            mass: 0.85,
            delay: 0.25
          }}
          className="relative flex flex-col items-center justify-end"
        >
          {/* Scroll exit motion container: Turun slowmo & super smooth sebatas pinggang (setengah badan) */}
          <motion.div
            style={{
              y: mascotY,
              opacity: mascotOpacity
            }}
            className="relative flex items-end justify-center pb-2 sm:pb-3 md:pb-4"
          >
            <img
              src="/assets/images/mascot_welcome.webp"
              alt="Jojo si Pemandu Budaya Yogyakarta"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="h-[67vh] sm:h-[69vh] md:h-[71vh] lg:h-[72vh] max-h-[760px] w-auto object-contain select-none filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 3.5. LAYER DEPAN JOJO: OUTLINE KHUSUS HURUF TENGAH ("yak") (z-25 di depan Jojo agar huruf terbaca utuh) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: contentY,
          opacity: contentOpacity
        }}
        className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none px-4 select-none"
        aria-hidden="true"
      >
        <span
          className="text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[9.5rem] xl:text-[11rem] font-serif font-normal tracking-[-0.035em] leading-none select-none m-0 text-center"
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
          }}
        >
          {/* "Yog" di belakang Jojo (huruf "g" tertutup sebagian secara simetris seperti "a") */}
          <span className="invisible">Yog</span>
          {/* Khusus huruf tengah "yak": Outline tipis berongga transparan */}
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: '1.5px rgba(251, 247, 238, 0.95)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))'
            }}
          >
            yak
          </span>
          {/* "arta" di belakang Jojo (huruf "a" kedua tertutup sebagian secara simetris seperti "g") */}
          <span className="invisible">arta</span>
        </span>
      </motion.div>

      {/* 4. BOTTOM BAR: Tombol CTA di Samping Kanan */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: contentY,
          opacity: contentOpacity
        }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 md:bottom-10 md:right-14 z-30 pointer-events-none"
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
