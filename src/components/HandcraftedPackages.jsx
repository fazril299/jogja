import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HandcraftedPackages({ id, onOpenBooking, onOpenTourDetail }) {
  const packages = [
    {
      id: 'prambanan-ratuboko',
      title: 'Prambanan & Ratu Boko',
      badge: 'Prambanan & Ratu Boko',
      subtitle: 'Sleman • Candi & Senja Bukit Boko',
      summary: 'Kemegahan candi Hindu abad ke-9 & panorama senja bukit Mataram Kuno.',
      image: '/assets/images/jogja_prambanan.webp'
    },
    {
      id: 'wijilan-prawirotaman',
      title: 'Kuliner Wijilan & Jejeran',
      badge: 'Kuliner Wijilan & Jejeran',
      subtitle: 'Kota Yogyakarta • Gudeg Pusaka & Sate Klathak',
      summary: 'Gudeg resep pusaka kuali tanah liat & sate klathak otentik dengan kepastian tarif.',
      image: '/assets/images/jogja_gudeg.webp'
    },
    {
      id: 'kasongan-imogiri',
      title: 'Kasongan, Giriloyo & Imogiri',
      badge: 'Kasongan & Imogiri',
      subtitle: 'Bantul • Gerabah & Batik Tulis',
      summary: 'Sentra kerajinan gerabah tanah liat & batik tulis warisan leluhur Yogyakarta.',
      image: '/assets/images/jogja_batik.webp'
    },
    {
      id: 'parangtritis-gunungkidul',
      title: 'Parangtritis & Gunungkidul',
      badge: 'Parangtritis & Geopark',
      subtitle: 'Gunungkidul • Gumuk Pasir & Geopark',
      summary: 'Fenomena gumuk pasir langka & gugusan tebing karang samudra pesisir selatan.',
      image: '/assets/images/jogja_parangtritis.webp'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = (pkg) => {
    if (onOpenTourDetail) {
      onOpenTourDetail(pkg);
    } else if (onOpenBooking) {
      onOpenBooking(pkg);
    }
  };

  return (
    <section
      id={id || 'packages'}
      className="border-b border-[#D9CEBA]/60 bg-[#FAF6EE] flex flex-col justify-center px-4 sm:px-8 py-6 sm:py-10 md:py-12 box-border relative"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 mb-3 sm:mb-6">
          <div>
            <h2 className="font-['Outfit'] text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D180C] leading-tight tracking-tight m-0">
              Destinasi Pilihan Yogyakarta
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#2D180C]/70 m-0 max-w-md sm:text-right leading-relaxed">
            Arahkan kursor atau pilih bilah instrumen untuk menelaah destinasi budaya unggulan.
          </p>
        </div>

        {/* Panoramic Expanding Destination Louvers (Tirai Akordion Foto 1 - Sesuai Tema Foto 2) */}
        <div className="relative w-full h-[410px] sm:h-[460px] md:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden border border-[#D9CEBA] shadow-lg bg-neutral-900 flex flex-col md:flex-row mt-1 mb-2 sm:my-2">
          {packages.map((pkg, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={pkg.id}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden border-b md:border-b-0 md:border-r border-white/20 last:border-none ${
                  isActive
                    ? 'md:flex-[4] lg:flex-[5] flex-[3]'
                    : 'md:flex-[1] flex-[1] hover:brightness-110'
                }`}
              >
                {/* Destination Photo */}
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                    isActive ? 'scale-100' : 'scale-110 brightness-75'
                  }`}
                />

                {/* Atmospheric Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15 pointer-events-none" />

                {/* Collapsed Ribbon Tag (Vertikal saat panel tertutup) */}
                {!isActive && (
                  <div className="absolute inset-0 flex md:flex-col items-center justify-center p-4 text-white z-10 pointer-events-none">
                    <span className="md:-rotate-90 md:origin-center md:whitespace-nowrap text-xs sm:text-sm font-bold font-['Outfit'] tracking-wider uppercase text-neutral-200 drop-shadow-md">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Active Expanded Content (Panel Terbuka Lebar) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end text-white z-20 pointer-events-none"
                    >
                      <div className="max-w-xl space-y-2.5">
                        {/* Title (Font Outfit Extrabold) */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Outfit'] m-0 leading-tight drop-shadow-md">
                          {pkg.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed m-0 font-normal line-clamp-3 sm:line-clamp-none">
                          {pkg.summary}
                        </p>

                        {/* Interactive Action Button */}
                        <div className="pt-2 pointer-events-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(pkg);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#2D180C] text-xs sm:text-sm font-bold transition-all duration-200 shadow-md active:scale-95 cursor-pointer group/btn"
                          >
                            <span>Buka Panduan Budaya</span>
                            <ArrowRight size={14} className="text-[#8c532b] transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
