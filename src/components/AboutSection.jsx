import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomPillButton from './CustomPillButton';

export default function AboutSection({ onOpenBooking, onOpenAboutUs }) {
  // 4 Slideshow Images for the About section tall photo
  const slideshowImages = [
    { src: "/assets/images/jogja_keraton.jpg", alt: "Keraton Yogyakarta" },
    { src: "/assets/images/jogja_prambanan.jpg", alt: "Candi Prambanan" },
    { src: "/assets/images/jogja_merapi.jpg", alt: "Lereng Gunung Merapi & Kaliurang" },
    { src: "/assets/images/jogja_tugu.jpg", alt: "Suasana Malam Malioboro & Tugu Jogja" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slideshowImages.length]);

  return (
    <div style={{ width: '100%', background: '#ffffff', color: '#0b1a26' }}>
      
      {/* =========================================================================
          SECTION 1: ABOUT US (FILOSOFI YOGYAKARTA - EXACT FRAMER TEMPLATE)
          ========================================================================= */}
      <section id="about-section" style={{ padding: '6rem 2rem 4rem 2rem' }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
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

          {/* Right Column: Clean 4-Photo Slideshow Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              width: '100%',
              height: '560px',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
              background: '#051d2d'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slideshowImages[currentSlide].src}
                alt={slideshowImages[currentSlide].alt}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EXPLORE BY EXPERIENCE (4 PILAR WISATA & BUDAYA JOGJA)
          ========================================================================= */}
      <section style={{ padding: '4rem 2rem 6rem 2rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Header Tag & Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.8rem',
            alignItems: 'start',
            marginBottom: '4.5rem'
          }}>
            
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            paddingTop: '1.5rem'
          }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Temukan destinasi lain di Yogyakarta.
            </span>

            <div style={{ flexGrow: 1, height: '1px', background: '#e2e8f0', margin: '0 1rem' }} />

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
