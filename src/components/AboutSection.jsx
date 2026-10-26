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
      <section id="about-section" className="min-h-screen px-4 sm:px-8 py-20 sm:py-24 bg-[#FAF6EE] text-[#1A1A1A] flex flex-col justify-center relative border-b border-[#D9CEBA]/60">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center my-auto">
          
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
