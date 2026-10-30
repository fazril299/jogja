import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, BookOpen } from 'lucide-react';

export default function AboutSection({ onOpenBooking, onOpenAboutUs, onOpenJurnalBudaya }) {
  // Pure photographic images of iconic Yogyakarta landmarks with custom focus positions
  const slideshowImages = [
    {
      src: "/assets/images/jogja_prambanan.webp",
      alt: "Candi Prambanan Yogyakarta",
      position: "center center"
    },
    {
      src: "/assets/images/jogja_keraton.webp",
      alt: "Regol Danapratapa Keraton Yogyakarta",
      position: "center 45%"
    },
    {
      src: "/assets/images/jogja_merapi.webp",
      alt: "Gunung Merapi Yogyakarta",
      position: "center 38%"
    },
    {
      src: "/assets/images/jogja_tugu.webp",
      alt: "Tugu Pal Putih Yogyakarta",
      position: "center 12%" // Preserves the golden pinnacle / spire of Tugu Pal Putih without cropping
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  // Seamless auto-dissolve every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % slideshowImages.length;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [slideshowImages.length]);

  return (
    <section id="about-section" className="min-h-0 lg:min-h-screen px-4 sm:px-8 py-10 sm:py-16 lg:py-24 bg-[#FAF6EE] text-[#1A1A1A] flex flex-col justify-center relative border-b border-[#D9CEBA]/60">
      
      {/* ========================================================
          MOBILE VIEW (lg:hidden): Konsep A - Layered Editorial Overlap
          Menyatu dalam 1 layar, berdimensi 3D (non-flat), tanpa emoji & counter
          ======================================================== */}
      <div className="block lg:hidden w-full max-w-[420px] mx-auto">
        {/* 1. The Photographic Dissolve Canvas */}
        <div className="relative w-full h-[220px] sm:h-[260px] rounded-[24px] overflow-hidden shadow-[0_12px_24px_rgba(45,24,12,0.15)] bg-neutral-900 border border-black/5">
          {/* Base Layer: Previous photo */}
          <img
            src={slideshowImages[prevIndex].src}
            alt={slideshowImages[prevIndex].alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: slideshowImages[prevIndex].position,
              zIndex: 1
            }}
          />

          {/* Active Layer: Current photo dissolving cleanly */}
          {currentIndex !== prevIndex && (
            <motion.img
              key={currentIndex}
              src={slideshowImages[currentIndex].src}
              alt={slideshowImages[currentIndex].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: slideshowImages[currentIndex].position,
                zIndex: 2
              }}
            />
          )}

          {/* Vignette contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-[3]" />

          {/* UNESCO Cultural Badge (Minimalist SVG, no emojis) */}
          <div className="absolute top-3 left-3 z-[4] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20 shadow-xs">
            <svg className="w-3 h-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21v-8m0 0l-4-4m4 4l4-4M3 9l9-6 9 6v12H3V9z"/>
            </svg>
            <span>Sumbu Filosofis UNESCO</span>
          </div>
        </div>

        {/* 2. Overlapping Glassmorphic Text Card (Negative margin creates true 3D depth) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative -mt-10 mx-2 bg-[#FCFBF7] rounded-[22px] p-4 sm:p-5 border border-[#E8DFC9] shadow-[0_16px_36px_rgba(45,24,12,0.14)] z-10 text-left"
        >
          {/* Gold leaf accent bar */}
          <div className="w-10 h-1 bg-gradient-to-r from-[#8c532b] to-amber-300 rounded-full mb-2.5" />

          {/* Elegant Serif Title */}
          <h3 
            style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
            className="text-[22px] sm:text-2xl text-[#2d180c] leading-tight mb-1"
          >
            Hamemayu Hayuning Bawana
          </h3>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs font-bold text-[#8c532b] tracking-wide uppercase mb-2">
            Falsafah Luhur Kasultanan Mataram
          </p>

          {/* Concise Narrative */}
          <p className="text-[11px] sm:text-xs text-[#554E46] leading-relaxed mb-3.5 font-normal">
            Bukan sekadar destinasi, melainkan ruang hidup kebudayaan yang mengakar di garis imajiner pusaka dunia: membentang dari <strong className="text-[#2d180c] font-semibold">Gunung Merapi</strong>, <strong className="text-[#2d180c] font-semibold">Keraton</strong>, hingga <strong className="text-[#2d180c] font-semibold">Samudra Selatan</strong>.
          </p>

          {/* Integrated Action Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#E8DFC9]/70">
            <motion.button
              onClick={onOpenAboutUs}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-[#2d180c] text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#432311] transition-all"
            >
              <span>Pelajari Warisan</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
            </motion.button>

            <motion.button
              onClick={onOpenBooking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 sm:py-2.5 px-3 rounded-xl bg-white border border-[#E8DFC9] text-[#2d180c] text-[11px] sm:text-xs font-bold hover:bg-[#FAF6EE] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Direktori</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8c532b]" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (hidden lg:grid): 100% Desktop Asli Terjaga
          ======================================================== */}
      <div className="hidden lg:grid max-w-[1240px] mx-auto w-full lg:grid-cols-2 gap-14 items-center my-auto">
        
        {/* Left Column: Clean Editorial Manifesto with Interactive Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          {/* Elegant Serif Title */}
          <h2
            style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
            className="text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#1A1A1A] leading-[1.08] mb-5"
          >
            Hamemayu Hayuning Bawana
          </h2>

          {/* Filosofi Subtitle */}
          <p className="text-sm sm:text-base font-medium text-[#7A6B58] tracking-wide mb-6">
            Falsafah Luhur Kasultanan Ngayogyakarta Hadiningrat
          </p>

          {/* Editorial Body Text */}
          <div className="space-y-4 text-xs sm:text-[14px] leading-relaxed text-[#554E46] font-normal">
            <p>
              Yogyakarta bukan sekadar titik destinasi wisata, melainkan ruang hidup kebudayaan yang mengakar sejak era Mataram Kuno hingga Kesultanan Mataram Islam. Keindahan kota ini tertata dalam{' '}
              <strong className="text-[#1A1A1A] font-semibold">Sumbu Filosofis</strong>—garis lurus imajiner pusaka dunia UNESCO yang menghubungkan Gunung Merapi di utara, Tugu Golong Gilig, Keraton Ngayogyakarta, hingga Pantai Parangtritis di Samudra Selatan.
            </p>
            <p>
              Platform ini didedikasikan untuk merawat serta memperkenalkan keluhuran warisan adiluhung: mulai dari megahnya arsitektur candi abad ke-9, kesakralan istana air Tamansari, kehangatan denyut malam Malioboro, hingga sentra kriya perak Kotagede.
            </p>
          </div>

          {/* Minimalist Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              onClick={onOpenAboutUs}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A1A] text-white text-xs sm:text-sm font-medium tracking-wide hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
            >
              <span>Pelajari Warisan Budaya</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={onOpenBooking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 bg-white text-[#1A1A1A] text-xs sm:text-sm font-medium tracking-wide hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>Jelajahi Direktori</span>
              <ArrowUpRight className="w-4 h-4 text-stone-500" />
            </motion.button>

            {onOpenJurnalBudaya && (
              <motion.button
                onClick={onOpenJurnalBudaya}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100/90 text-[#8A5D26] text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#C99B52]" />
                <span>Baca Jurnal Budaya</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Right Column: Clean Photographic Dissolve Canvas */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl relative bg-stone-900 border border-stone-200"
        >
          {/* Base Layer: Previous photo */}
          <img
            src={slideshowImages[prevIndex].src}
            alt={slideshowImages[prevIndex].alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: slideshowImages[prevIndex].position,
              display: 'block',
              zIndex: 1
            }}
          />

          {/* Active Layer: Current photo dissolving cleanly */}
          {currentIndex !== prevIndex && (
            <motion.img
              key={currentIndex}
              src={slideshowImages[currentIndex].src}
              alt={slideshowImages[currentIndex].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slideshowImages[currentIndex].position,
                display: 'block',
                zIndex: 2
              }}
            />
          )}
        </motion.div>

      </div>
    </section>
  );
}
