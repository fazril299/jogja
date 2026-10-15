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
    <div id="about" style={{ width: '100%', background: '#ffffff', color: '#0b1a26' }}>
      
      {/* =========================================================================
          SECTION 1: ABOUT US (FILOSOFI YOGYAKARTA - EXACT FRAMER TEMPLATE)
          ========================================================================= */}
      <section id="about-section" className="py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
              color: '#475569',
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
              fontSize: 'clamp(2.2rem, 3.8vw, 3.1rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              marginBottom: '1.2rem',
              color: '#0b1a26',
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

            <CustomPillButton 
              label="Pelajari Lebih Lanjut" 
              onClick={onOpenAboutUs || onOpenBooking} 
            />

            {/* Bottom Landscape Card matching exact template */}
            <div style={{
              marginTop: '2.5rem',
              width: '100%',
              height: '220px',
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
      <section className="py-12 sm:py-20 px-4 sm:px-8 bg-white">
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Header Tag & Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.8rem'
            }}>
              <img 
                src="/images/icon_all.svg" 
                alt="Ikon ragam pengalaman wisata" 
                style={{ height: '24px', width: '24px', objectFit: 'contain', opacity: 0.8 }} 
              />
              Jelajahi Berdasarkan Minat
            </div>
            
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.3rem, 4.2vw, 3.3rem)',
              fontWeight: 800,
              color: '#0b1a26',
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              maxWidth: '750px',
              margin: '0 auto'
            }}>
              Empat Dimensi Keistimewaan Yogyakarta
            </h2>
          </motion.div>

          {/* 4 Experience Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-12 sm:mb-16">
            
            {/* Card 1: Budaya & Sejarah Mataram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div style={{
                width: '100%',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '1.2rem',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/assets/images/jogja_keraton.jpg" 
                  alt="Budaya & Sejarah Mataram" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0b1a26' }}>
                Budaya & Sejarah
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Keraton Ngayogyakarta, Istana Air Tamansari, Candi Prambanan, dan Sumbu Filosofis warisan dunia UNESCO.
              </p>
            </motion.div>

            {/* Card 2: Wisata Alam Merapi & Laut Selatan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0b1a26' }}>
                Wisata Alam & Hiburan
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55, marginBottom: '1.2rem' }}>
                Udara sejuk Kaliurang lereng Merapi, Gumuk Pasir Parangtritis, hingga tebing karst Gunungkidul.
              </p>
              <div style={{
                width: '100%',
                height: '290px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/assets/images/jogja_merapi.jpg" 
                  alt="Lereng Merapi & Alam Jogja" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            </motion.div>

            {/* Card 3: Kuliner Wajib & Legendaris */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div style={{
                width: '100%',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '1.2rem',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/assets/images/jogja_gudeg.jpg" 
                  alt="Rekomendasi kuliner Yogyakarta" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0b1a26' }}>
                Pilihan Kuliner Terverifikasi
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Gudeg kayu bakar Wijilan, Sate Klathak jeruji besi Jejeran, Brongkos Handayani, hingga Kopi Joss Tugu.
              </p>
            </motion.div>

            {/* Card 4: Kampung Wisata & Kriya */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0b1a26' }}>
                Kampung Wisata & Krama
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55, marginBottom: '1.2rem' }}>
                Lorong perak Kotagede, gerabah tanah liat Kasongan, dan tata krama unggah-ungguh masyarakat Jawa.
              </p>
              <div style={{
                width: '100%',
                height: '290px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/assets/images/jogja_kotagede.jpg" 
                  alt="Kampung Wisata Kotagede & Kasongan" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            </motion.div>

          </div>

          {/* Section Footer Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pt-6">
            <span className="text-[0.92rem] font-semibold text-[#64748b]">
              Temukan destinasi lain di Yogyakarta.
            </span>

            <div className="hidden sm:block flex-1 h-[1px] bg-[#e2e8f0] mx-4" />

            <CustomPillButton 
              label="Lihat Pilihan Perjalanan"
              onClick={onOpenBooking} 
            />
          </div>

        </div>
      </section>

    </div>
  );
}
