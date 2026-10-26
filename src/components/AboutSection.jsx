import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, LayoutGrid } from 'lucide-react';
import CardsCascade from './CardsCascade';

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
          SECTION 3: EMPAT DIMENSI KEISTIMEWAAN YOGYAKARTA (CARDS CASCADE FRAMER)
          ========================================================================= */}
      <CardsCascade
        onOpenBooking={onOpenBooking}
        onSelectPlaceById={onSelectPlaceById}
        onOpenNearMe={onOpenNearMe}
      />
    </>
  );
}
