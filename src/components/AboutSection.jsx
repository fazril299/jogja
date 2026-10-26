import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, LayoutGrid } from 'lucide-react';

export default function AboutSection({ onOpenBooking, onOpenAboutUs, onSelectPlaceById, onOpenNearMe }) {

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
      <section id="about-section" className="min-h-screen px-4 sm:px-8 py-20 sm:py-24 bg-white text-[#1A1A1A] flex flex-col justify-center relative border-b border-stone-200">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] text-black text-xs font-semibold border border-[#D9CEBA] mb-3 shadow-2xs">
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
          SECTION 3: EMPAT DIMENSI KEISTIMEWAAN YOGYAKARTA (WARM BENTO GRID)
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#FAF6EE] text-[#1A1A1A] flex flex-col justify-center relative border-b border-[#D9CEBA]">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 sm:gap-10">
          
          {/* Header: Pill Badge, Title, & Subtitle */}
          <div className="text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D9CEBA] text-[#333] text-xs font-medium shadow-2xs">
              <LayoutGrid className="w-3.5 h-3.5 text-neutral-600" />
              <span>Jelajahi Berdasarkan Minat</span>
            </div>

            <h2
              style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
              className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#1A1A1A] tracking-tight leading-tight mt-3 mb-2"
            >
              Empat Dimensi Keistimewaan Yogyakarta
            </h2>

            <p className="text-xs sm:text-sm text-[#554E46] max-w-xl mx-auto leading-relaxed font-normal">
              Kurasi ragam keistimewaan Daerah Istimewa Yogyakarta dari pusat keraton hingga bentang alam sakral.
            </p>
          </div>

          {/* Bento Grid Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
            
            {/* PILLAR 1: Tall Vertical Monolith (Budaya & Sejarah Mataram) */}
            <div className="lg:col-span-5 bg-[#FAF7F0] border border-[#D9CEBA] rounded-[28px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200">
                  <img
                    src="/assets/images/jogja_keraton.jpg"
                    alt="Budaya & Sejarah Mataram"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="mt-5">
                  <h3
                    style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
                    className="text-2xl sm:text-[26px] font-normal text-[#1A1A1A] leading-tight"
                  >
                    Budaya &amp; Sejarah Mataram
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#554E46] mt-2.5 leading-relaxed font-normal">
                    Keraton Ngayogyakarta, Istana Air Tamansari, Candi Prambanan, dan Sumbu Filosofis warisan leluhur.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-2 flex items-center justify-between text-xs sm:text-sm font-medium text-[#1A1A1A]">
                <button
                  type="button"
                  onClick={() => onSelectPlaceById ? onSelectPlaceById('keraton-yogyakarta') : (onOpenBooking && onOpenBooking())}
                  className="inline-flex items-center gap-1.5 hover:text-[#9B6B28] transition-colors cursor-pointer group/btn"
                >
                  <span>Jelajahi Sejarah</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPlaceById ? onSelectPlaceById('merapi-kaliurang') : (onOpenBooking && onOpenBooking())}
                  className="inline-flex items-center gap-1.5 hover:text-[#9B6B28] transition-colors cursor-pointer group/btn"
                >
                  <span>Lihat Alam</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Panoramic Green Card + 2 Bottom Tiles */}
            <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
              
              {/* PILLAR 2: Panoramic Horizontal Ribbon (Wisata Alam & Hiburan) */}
              <div className="bg-[#153023] rounded-[28px] p-5 sm:p-6 text-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all flex flex-col sm:flex-row items-center gap-5 sm:gap-6 flex-1 group">
                <div className="w-full sm:w-[46%] aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 shrink-0">
                  <img
                    src="/assets/images/jogja_merapi.jpg"
                    alt="Wisata Alam & Hiburan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between h-full w-full py-1">
                  <div>
                    <h3
                      style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
                      className="text-xl sm:text-[22px] font-normal text-white leading-tight"
                    >
                      Wisata Alam &amp; Hiburan
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#D1E0D7] mt-2 leading-relaxed font-normal">
                      Udara sejuk Kaliurang lereng Merapi, Gumuk Pasir Parangtritis, hingga tebing karst eksotis Gunungkidul.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#9BB6A4] mt-3 font-normal">
                      <span>• Lereng Merapi</span>
                      <span>• Gumuk Pasir</span>
                      <span>• Tebing Karst</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs sm:text-sm font-medium text-white">
                    <button
                      type="button"
                      onClick={() => onSelectPlaceById ? onSelectPlaceById('merapi-kaliurang') : (onOpenBooking && onOpenBooking())}
                      className="inline-flex items-center gap-1.5 hover:text-[#A7D8B8] transition-colors cursor-pointer group/btn"
                    >
                      <span>Lihat Alam</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPlaceById ? onSelectPlaceById('merapi-kaliurang') : (onOpenBooking && onOpenBooking())}
                      className="hover:translate-x-1 transition-transform text-white/80 hover:text-white cursor-pointer"
                      aria-label="Lihat Alam"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Split 2 Tiles (Kuliner & Kampung Wisata) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* PILLAR 3: Kuliner Legendaris */}
                <div className="bg-[#FAF7F0] border border-[#D9CEBA] rounded-[28px] p-4 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-2xl overflow-hidden bg-neutral-200 shrink-0">
                      <img
                        src="/assets/images/jogja_gudeg.jpg"
                        alt="Kuliner Legendaris"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
                        className="text-base sm:text-[18px] font-normal text-[#1A1A1A] leading-snug"
                      >
                        Kuliner Legendaris
                      </h4>
                      <p className="text-xs text-[#554E46] mt-1 line-clamp-2 leading-relaxed font-normal">
                        Gudeg kayu bakar Wijilan, Sate Klathak Jejeran, Brongkos &amp; Kopi
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={onOpenNearMe}
                      className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-medium text-[#1A1A1A] hover:text-[#9B6B28] transition-colors cursor-pointer group/btn"
                    >
                      <span>Eksplorasi Rasa</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>

                {/* PILLAR 4: Kampung Wisata & ... */}
                <div className="bg-[#FAF7F0] border border-[#D9CEBA] rounded-[28px] p-4 sm:p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-2xl overflow-hidden bg-neutral-200 shrink-0">
                      <img
                        src="/assets/images/jogja_kotagede.jpg"
                        alt="Kampung Wisata & ..."
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}
                        className="text-base sm:text-[18px] font-normal text-[#1A1A1A] leading-snug"
                      >
                        Kampung Wisata &amp; ...
                      </h4>
                      <p className="text-xs text-[#554E46] mt-1 line-clamp-2 leading-relaxed font-normal">
                        Lorong perak Kotagede, gerabah Kasongan, dan keluhuran tata krama...
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => onSelectPlaceById ? onSelectPlaceById('kotagede') : (onOpenBooking && onOpenBooking())}
                      className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-medium text-[#1A1A1A] hover:text-[#9B6B28] transition-colors cursor-pointer group/btn"
                    >
                      <span>Kunjungi Kampung</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
