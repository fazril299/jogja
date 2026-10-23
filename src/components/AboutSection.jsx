import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function AboutSection({ onOpenBooking, onOpenAboutUs }) {

  // Pure photographic images of iconic Yogyakarta landmarks with custom focus positions
  const slideshowImages = [
    {
      src: "/assets/images/jogja_prambanan.jpg",
      alt: "Candi Prambanan Yogyakarta",
      position: "center center"
    },
    {
      src: "/assets/images/jogja_keraton.jpg",
      alt: "Regol Danapratapa Keraton Yogyakarta",
      position: "center 45%"
    },
    {
      src: "/assets/images/jogja_merapi.jpg",
      alt: "Gunung Merapi Yogyakarta",
      position: "center 38%"
    },
    {
      src: "/assets/images/jogja_tugu.jpg",
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
    <>
      {/* =========================================================================
          SECTION 1: ABOUT US (FILOSOFI YOGYAKARTA - CLEAN MONOCHROME)
          ========================================================================= */}
      <section id="about-section" className="min-h-screen px-4 sm:px-8 py-20 sm:py-24 bg-white text-black flex flex-col justify-center relative">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center my-auto">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-black text-xs font-semibold border border-neutral-200 mb-3 shadow-2xs">
                <img 
                  src="/images/icon_culture.svg" 
                  alt="" 
                  className="h-4 w-4 object-contain opacity-85" 
                />
                <span>Eksplorasi Khusus D.I. Yogyakarta</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black font-['Outfit'] tracking-tight leading-[1.15] mb-3">
                Menyingkap Falsafah, Tata Krama &amp; Cita Rasa Asli Yogyakarta
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4 max-w-lg font-normal">
                Dari Sumbu Filosofis Keraton Ngayogyakarta hingga lereng Gunung Merapi, setiap kawasan menyimpan kisah yang berharga. Temukan kuliner khas melalui panduan berbasis lokasi, lengkap dengan informasi yang membantu Anda memilih tempat makan secara bijak.
              </p>

              {onOpenAboutUs && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={onOpenAboutUs}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 text-white border border-black text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span>Pelajari Selengkapnya Tentang Nilai &amp; Sumbu Filosofis</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Landscape Card (Keraton Ratu Boko) */}
            <div className="mt-2 w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-neutral-200 group bg-neutral-900">
              <img 
                src="/assets/images/jogja_ratuboko.jpg" 
                alt="Keraton Ratu Boko & Sumbu Filosofis Yogyakarta" 
                className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700 select-none"
              />
            </div>
          </motion.div>

          {/* Right Column: Pure Photo Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] rounded-[28px] overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-950"
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

      {/* =========================================================================
          SECTION 2: EXPLORE BY EXPERIENCE (4 PILAR WISATA & BUDAYA JOGJA - CLEAN B&W)
          ========================================================================= */}
      <section className="min-h-screen px-4 sm:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 bg-white text-black flex flex-col justify-center relative">
        <div className="max-w-[1240px] mx-auto w-full flex flex-col justify-center gap-5 sm:gap-6 my-auto">
          
          {/* Header Tag, Title, & Action Button (Moved to the empty upper-right space) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 text-black text-xs font-semibold border border-neutral-200 shadow-2xs">
                <img 
                  src="/images/icon_all.svg" 
                  alt="Ikon ragam pengalaman wisata" 
                  className="h-4 w-4 object-contain opacity-85"
                />
                <span>Jelajahi Berdasarkan Minat</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-['Outfit'] m-0 leading-tight">
                Empat Dimensi Keistimewaan Yogyakarta
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 m-0 max-w-xl font-normal">
                Kurasi ragam keistimewaan Daerah Istimewa Yogyakarta dari pusat keraton hingga bentang alam sakral.
              </p>
            </div>

            {/* 'Lihat Pilihan Perjalanan' Button placed cleanly in the top right empty space */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 group shrink-0 self-start sm:self-auto"
            >
              <span>Lihat Pilihan Perjalanan</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* =========================================================================
              ASYMMETRIC 4-DIMENSI BENTO ARCHITECTURAL SHOWCASE (CLEAN BLACK & WHITE UI)
              ========================================================================= */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            
            {/* PILLAR 1: Tall Vertical Monolith (Budaya & Sejarah Mataram) */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-[38%] flex flex-col justify-between p-5 rounded-[24px] bg-white border border-neutral-200 shadow-sm hover:border-black transition-all group"
            >
              {/* Photo with UNESCO badge (Pure Black & White Badge) */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100">
                <img
                  src="/assets/images/jogja_keraton.jpg"
                  alt="Budaya & Sejarah Keraton Ngayogyakarta"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold tracking-wide shadow-sm">
                  Warisan Dunia UNESCO
                </span>
              </div>

              {/* Information */}
              <div className="pt-4 space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-black font-['Outfit'] m-0 leading-snug">
                  Budaya &amp; Sejarah Mataram
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                  Keraton Ngayogyakarta, Istana Air Tamansari, Candi Prambanan, dan Sumbu Filosofis warisan leluhur.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-semibold text-black bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                    Keraton
                  </span>
                  <span className="text-[10px] font-semibold text-black bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                    Tamansari
                  </span>
                  <span className="text-[10px] font-semibold text-black bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                    Prambanan
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COMPOSITION: Panoramic Ribbon + 2 Split Complementary Tiles */}
            <div className="lg:w-[62%] flex flex-col gap-4">
              
              {/* PILLAR 2: Panoramic Horizontal Ribbon (Wisata Alam & Hiburan) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[24px] bg-white border border-neutral-200 shadow-sm hover:border-black transition-all group"
              >
                <div className="w-full sm:w-[42%] h-36 sm:h-38 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-100 shrink-0">
                  <img
                    src="/assets/images/jogja_merapi.jpg"
                    alt="Lereng Merapi & Bentang Alam Jogja"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      Lansekap Kosmis Utara &amp; Selatan
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-black font-['Outfit'] m-0 leading-snug">
                      Wisata Alam &amp; Hiburan
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed m-0 font-normal line-clamp-2">
                      Udara sejuk Kaliurang lereng Merapi, Gumuk Pasir Parangtritis, hingga tebing karst eksotis Gunungkidul.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2.5 text-[10px] font-medium text-neutral-500">
                    <span>• Lereng Merapi</span>
                    <span>• Gumuk Pasir</span>
                    <span>• Tebing Karst</span>
                  </div>
                </div>
              </motion.div>

              {/* BOTTOM ROW: Split 2 Bespoke Facet Tiles */}
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* PILLAR 3: Gastronomic Tasting Capsule (Kuliner Otentik) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 flex items-center gap-3.5 p-4 rounded-[24px] bg-white border border-neutral-200 shadow-sm hover:border-black transition-all group"
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shrink-0 shadow-2xs">
                    <img
                      src="/assets/images/jogja_gudeg.jpg"
                      alt="Kuliner Khas Yogyakarta"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span className="inline-block text-[10px] font-bold text-black bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      Bebas Getok Harga
                    </span>
                    <h4 className="text-sm font-bold text-black font-['Outfit'] m-0 leading-snug">
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
                  className="flex-1 flex items-center gap-3.5 p-4 rounded-[24px] bg-white border border-neutral-200 shadow-sm hover:border-black transition-all group"
                >
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100 shrink-0 shadow-2xs">
                    <img
                      src="/assets/images/jogja_kotagede.jpg"
                      alt="Kampung Wisata Kotagede"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span className="inline-block text-[10px] font-bold text-black bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full">
                      Adat &amp; Unggah-Ungguh
                    </span>
                    <h4 className="text-sm font-bold text-black font-['Outfit'] m-0 leading-snug">
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



        </div>
      </section>
    </>
  );
}
