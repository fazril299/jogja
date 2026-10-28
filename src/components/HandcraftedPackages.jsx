import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HandcraftedPackages({ id, onOpenBooking, onOpenTourDetail }) {
  const packages = [
    {
      id: 'prambanan-ratuboko',
      title: 'Prambanan & Ratu Boko',
      subtitle: 'Sleman • Candi & Senja Bukit Boko',
      summary: 'Kemegahan candi Hindu abad ke-9 & panorama senja bukit',
      image: '/assets/images/jogja_prambanan.jpg'
    },
    {
      id: 'wijilan-prawirotaman',
      title: 'Kuliner Wijilan & Jejeran',
      subtitle: 'Gudeg Kayu Bakar & Sate Klathak',
      summary: 'Gudeg resep pusaka kayu bakar & sate klathak otentik',
      image: '/assets/images/jogja_gudeg.jpg'
    },
    {
      id: 'kasongan-imogiri',
      title: 'Kasongan, Giriloyo & Imogiri',
      subtitle: 'Bantul • Gerabah & Batik Tulis',
      summary: 'Sentra kerajinan gerabah tanah liat & batik tulis warisan leluhur',
      image: '/assets/images/jogja_batik.jpg'
    },
    {
      id: 'parangtritis-gunungkidul',
      title: 'Parangtritis & Gunungkidul',
      subtitle: 'Gumuk Pasir & Geopark Karst',
      summary: 'Fenomena gumuk pasir langka & gugusan tebing karang samudra',
      image: '/assets/images/jogja_parangtritis.jpg'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const cardWidth = 270;
    const newIdx = Math.round(scrollLeft / (cardWidth + 14));
    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < packages.length) {
      setActiveIndex(newIdx);
    }
  };

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * (270 + 14),
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleCardClick = (pkg) => {
    if (onOpenTourDetail) {
      onOpenTourDetail(pkg);
    } else if (onOpenBooking) {
      onOpenBooking(pkg);
    }
  };

  return (
    <section id={id || "packages"} className="handcrafted-section web-section-100vh border-b border-[#D9CEBA]/60 bg-[#FAF6EE]">
      
      {/* ========================================================
          MOBILE VIEW (block lg:hidden): Opsi 1 - Horizontal Cinematic Reel
          Bersih tanpa badge mengambang, pas 1 layar, dengan gap bawah yang lega
          ======================================================== */}
      <div className="block lg:hidden w-full max-w-[440px] mx-auto pt-2 pb-6">
        
        {/* Section Header (Bersih tanpa eyebrow 4 Rute) */}
        <div className="px-4 mb-3.5">
          <h2 className="font-outfit text-2xl font-bold text-[#2d180c] leading-tight m-0 mb-1">
            Destinasi Pilihan
          </h2>
          <p className="text-xs text-[#7A6B58] font-medium m-0">
            Ekspedisi budaya, kuliner pusaka, kriya & pesisir Jogja
          </p>
        </div>

        {/* Horizontal Swipe Track (Foto bersih tanpa chip badge di atas) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 pb-2 pt-1"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(pkg)}
              className="w-[270px] shrink-0 h-[310px] rounded-[24px] overflow-hidden relative shadow-[0_12px_28px_rgba(45,24,12,0.16)] border border-black/10 bg-neutral-900 snap-center cursor-pointer select-none group"
            >
              {/* Full-bleed Photo */}
              <img
                src={pkg.image}
                alt={pkg.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Atmospheric Gradient Vignette (Non-Flat) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140b06] via-[#140b06]/40 to-transparent z-[2]" />

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-3.5 inset-x-3.5 z-[3] text-left text-white">
                <h3 className="font-outfit text-lg font-bold text-amber-50 leading-tight mb-1 drop-shadow-md">
                  {pkg.title}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed mb-2 font-normal">
                  {pkg.summary}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-amber-200 font-semibold">
                  <span>Buka Panduan Budaya</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Swipe Pagination Dots & Hint */}
        <div className="flex items-center justify-between px-4 mt-3.5 pt-2 border-t border-[#E8DFC9]/70">
          <div className="flex items-center gap-1.5">
            {packages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={`Lihat rute ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-[#8c532b]' : 'w-1.5 bg-[#D9CEBA]'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-[#7A6B58] flex items-center gap-1">
            <span>Geser untuk rute lain</span>
            <span>→</span>
          </span>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (hidden lg:block): 100% Desktop Asli Terjaga
          ======================================================== */}
      <div className="hidden lg:flex flex-col handcrafted-container">
        {/* SECTION HEADER */}
        <div className="handcrafted-header">
          {/* Sub-badge line mountain icon */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="handcrafted-eyebrow"
          >
            <img 
              src="/assets/icons/icon_culinary.svg"
              alt="Ikon katalog destinasi dan kuliner" 
              style={{ height: '26px', width: '26px', objectFit: 'contain', opacity: 0.85 }}
            />
            Katalog Wilayah & Kuliner DIY
          </motion.div>

          {/* Headline */}
          <h2 className="handcrafted-title">
            Destinasi Pilihan Yogyakarta
          </h2>
        </div>

        {/* 4 TOUR CARDS GRID */}
        <div className="handcrafted-grid">
          {packages.map((pkg, idx) => (
            <motion.button
              key={pkg.id}
              type="button"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.16, ease: 'easeOut' } }}
              className="handcrafted-card"
              onClick={() => handleCardClick(pkg)}
            >
              {/* Card Photo Container */}
              <div className="handcrafted-card-image">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                />
              </div>

              {/* Card Info Below Photo */}
              <div className="handcrafted-card-info">
                <div className="handcrafted-card-location">
                  {pkg.subtitle}
                </div>
                <h3 className="handcrafted-card-title">
                  {pkg.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* BOTTOM ROW (Informational guidance note) */}
        <div className="handcrafted-footer">
          <span className="handcrafted-footer-copy">
            Pilih salah satu destinasi di atas untuk menyingkap cerita budaya, sejarah, dan panduan lengkapnya.
          </span>
        </div>
      </div>

    </section>
  );
}
