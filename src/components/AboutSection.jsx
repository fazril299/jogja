import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CustomPillButton from './CustomPillButton';

export default function AboutSection({ onOpenBooking, onOpenAboutUs }) {

  // Pure photographic images of iconic Yogyakarta landmarks
  const slideshowImages = [
    "/assets/images/jogja_prambanan.jpg",
    "/assets/images/jogja_keraton.jpg",
    "/assets/images/jogja_merapi.jpg",
    "/assets/images/jogja_tugu.jpg"
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
    <>
      {/* =========================================================================
          SECTION 1: ABOUT US (FILOSOFI YOGYAKARTA - EXACT FRAMER TEMPLATE)
          ========================================================================= */}
      <section id="about-section" className="web-section-100vh px-4 sm:px-8 pt-28 sm:pt-32 pb-8 bg-white text-[#2d180c]">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-1 max-h-[78vh] my-auto">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#8c532b',
              marginBottom: '1rem'
            }}>
              <img 
                src="/images/icon_culture.svg" 
                alt="" 
                style={{ height: '24px', width: '24px', objectFit: 'contain', opacity: 0.8 }} 
              />
              Eksplorasi Khusus D.I. Yogyakarta
            </div>

            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.9rem, 3.8vw, 3.1rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.2rem',
              color: '#2d180c',
              letterSpacing: '-0.02em'
            }}>
              Menyingkap Falsafah, Tata Krama & Cita Rasa Asli Yogyakarta
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '500px'
            }}>
              Dari Sumbu Filosofis Keraton Ngayogyakarta hingga lereng Gunung Merapi, setiap kawasan menyimpan kisah yang berharga. Temukan kuliner khas melalui panduan berbasis lokasi, lengkap dengan informasi yang membantu Anda memilih tempat makan secara bijak.
            </p>

            {onOpenAboutUs && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={onOpenAboutUs}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF6EE] hover:bg-[#F5EEDC] text-[#8c532b] border border-[#E8DFC9] text-xs font-semibold transition-all cursor-pointer active:scale-95"
                >
                  <span>Pelajari Selengkapnya Tentang Nilai &amp; Sumbu Filosofis</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* Bottom Landscape Card matching exact template */}
            <div style={{
              marginTop: '2.5rem',
              width: '100%',
              height: 'clamp(180px, 30vh, 220px)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.08)'
            }}>
              <img 
                src="/assets/images/jogja_ratuboko.jpg" 
                alt="Keraton Ratu Boko & Sumbu Filosofis Yogyakarta" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </motion.div>

          {/* Right Column: Pure Photo Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[320px] sm:h-[440px] lg:h-[560px] rounded-[28px] overflow-hidden shadow-2xl bg-[#0b1a26]"
          >
            {/* Base Layer: Previous photo (100% solid, prevents black flashes) */}
            <img
              src={slideshowImages[prevIndex]}
              alt="Keindahan Budaya Yogyakarta"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                zIndex: 1
              }}
            />

            {/* Active Layer: Current photo dissolving cleanly */}
            {currentIndex !== prevIndex && (
              <motion.img
                key={currentIndex}
                src={slideshowImages[currentIndex]}
                alt="Keindahan Budaya Yogyakarta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  zIndex: 2
                }}
              />
            )}
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EXPLORE BY EXPERIENCE (4 PILAR WISATA & BUDAYA JOGJA)
          ========================================================================= */}
      <section className="web-section-100vh px-4 sm:px-8 pt-28 sm:pt-32 pb-8 bg-[#FAF6EE]">
        <div className="max-w-[1240px] mx-auto w-full flex-1 max-h-[78vh] flex flex-col justify-between my-auto">
          
          {/* Header Tag & Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-1 mb-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#8c532b] text-xs font-semibold border border-[#E8DFC9] shadow-2xs">
              <img 
                src="/images/icon_all.svg" 
                alt="Ikon ragam pengalaman wisata" 
                className="h-4 w-4 object-contain opacity-85"
              />
              <span>Jelajahi Berdasarkan Minat</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2d180c] font-['Outfit'] m-0 leading-tight">
              Empat Dimensi Keistimewaan Yogyakarta
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 m-0 max-w-xl mx-auto">
              Kurasi ragam keistimewaan Daerah Istimewa Yogyakarta dari pusat keraton hingga bentang alam sakral.
            </p>
          </motion.div>

          {/* =========================================================================
              ASYMMETRIC 4-DIMENSI BENTO ARCHITECTURAL SHOWCASE (VARIATIF & NON-BERJEJER!)
              ========================================================================= */}
          <div className="flex flex-col lg:flex-row gap-3.5 my-2 flex-1 max-h-[58vh] min-h-[350px]">
            
            {/* PILLAR 1: Tall Vertical Monolith (Budaya & Sejarah Mataram) */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-[38%] h-full flex flex-col justify-between p-4 rounded-[26px] bg-white border border-[#E8DFC9] shadow-xs hover:border-[#8c532b]/60 transition-all group"
            >
              {/* Arched Photo with UNESCO badge */}
              <div className="relative w-full flex-1 min-h-[160px] max-h-[220px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100">
                <img
                  src="/assets/images/jogja_keraton.jpg"
                  alt="Budaya & Sejarah Keraton Ngayogyakarta"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#8c532b] text-white text-[10px] font-bold tracking-wide shadow-xs">
                  Warisan Dunia UNESCO
                </span>
              </div>

              {/* Information */}
              <div className="pt-3 space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-[#2d180c] font-['Outfit'] m-0 leading-snug">
                  Budaya &amp; Sejarah Mataram
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                  Keraton Ngayogyakarta, Istana Air Tamansari, Candi Prambanan, dan Sumbu Filosofis warisan leluhur.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-semibold text-[#8c532b] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    Keraton
                  </span>
                  <span className="text-[10px] font-semibold text-[#8c532b] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    Tamansari
                  </span>
                  <span className="text-[10px] font-semibold text-[#8c532b] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    Prambanan
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COMPOSITION: Panoramic Ribbon + 2 Split Complementary Tiles */}
            <div className="lg:w-[62%] h-full flex flex-col gap-3.5">
              
              {/* PILLAR 2: Panoramic Horizontal Ribbon (Wisata Alam & Hiburan) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 flex flex-col sm:flex-row items-center gap-3.5 p-3.5 rounded-[24px] bg-white border border-[#E8DFC9] shadow-xs hover:border-emerald-600/40 transition-all group"
              >
                <div className="w-full sm:w-[42%] h-32 sm:h-full min-h-[110px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-100 shrink-0">
                  <img
                    src="/assets/images/jogja_merapi.jpg"
                    alt="Lereng Merapi & Bentang Alam Jogja"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Lansekap Kosmis Utara &amp; Selatan
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#2d180c] font-['Outfit'] m-0 leading-snug">
                      Wisata Alam &amp; Hiburan
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                      Udara sejuk Kaliurang lereng Merapi, Gumuk Pasir Parangtritis, hingga tebing karst eksotis Gunungkidul.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-[10px] font-medium text-emerald-700">
                    <span>• Lereng Merapi</span>
                    <span>• Gumuk Pasir</span>
                    <span>• Tebing Karst</span>
                  </div>
                </div>
              </motion.div>

              {/* BOTTOM ROW: Split 2 Bespoke Facet Tiles */}
              <div className="flex-1 flex flex-col sm:flex-row gap-3.5 min-h-[135px]">
                
                {/* PILLAR 3: Gastronomic Tasting Capsule (Kuliner Otentik) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 flex items-center gap-3 p-3.5 rounded-[24px] bg-[#FCF9F2] border border-[#E5DAC8] shadow-xs hover:border-amber-600/40 transition-all group"
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-neutral-900 border border-amber-200 shrink-0 shadow-2xs">
                    <img
                      src="/assets/images/jogja_gudeg.jpg"
                      alt="Kuliner Khas Yogyakarta"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                      Bebas Getok Harga
                    </span>
                    <h4 className="text-sm font-bold text-[#2d180c] font-['Outfit'] m-0 leading-snug">
                      Pilihan Kuliner Terverifikasi
                    </h4>
                    <p className="text-[11px] text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                      Gudeg kayu bakar Wijilan, Sate Klathak Jejeran, Brongkos &amp; Kopi Joss.
                    </p>
                  </div>
                </motion.div>

                {/* PILLAR 4: Living Heritage & Unggah-Ungguh Charter (Kampung Wisata) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex-1 flex items-center gap-3 p-3.5 rounded-[24px] bg-white border border-[#E8DFC9] shadow-xs hover:border-[#8c532b]/40 transition-all group"
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100 shrink-0 shadow-2xs">
                    <img
                      src="/assets/images/jogja_kotagede.jpg"
                      alt="Kampung Wisata Kotagede"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="inline-block text-[10px] font-bold text-[#8c532b] bg-[#FAF6EE] border border-[#E8DFC9] px-2 py-0.5 rounded-full">
                      Adat &amp; Unggah-Ungguh
                    </span>
                    <h4 className="text-sm font-bold text-[#2d180c] font-['Outfit'] m-0 leading-snug">
                      Kampung Wisata &amp; Krama
                    </h4>
                    <p className="text-[11px] text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                      Lorong perak Kotagede, gerabah Kasongan, dan keluhuran tata krama Mataram.
                    </p>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

          {/* Section Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200/80 text-center sm:text-left">
            <span className="text-xs font-medium text-neutral-500">
              Temukan seluruh katalog destinasi dan rute budaya di Yogyakarta.
            </span>

            <CustomPillButton 
              label="Lihat Pilihan Perjalanan"
              onClick={onOpenBooking} 
            />
          </div>

        </div>
      </section>
    </>
  );
}
