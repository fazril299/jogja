import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        padding: isMobile ? '1.5rem 1.25rem 2rem' : '2rem 2rem 2.5rem 2rem',
        backgroundColor: '#140e08'
      }}
    >
      {/* Hardware-Accelerated SVG Micro-Contrast & Edge Sharpening untuk Ketajaman Foto Setara 4K DSLR */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="jogja-photo-uhd-sharpen" colorInterpolationFilters="sRGB">
            <feConvolveMatrix
              order="3 3"
              preserveAlpha="true"
              kernelMatrix="0 -0.28 0 -0.28 2.12 -0.28 0 -0.28 0"
            />
          </filter>
        </defs>
      </svg>

      {/* =========================================================================
          ULTRA-HD WARM SUNRISE BACKGROUND (Cerah, Hangat & Tajam)
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
      >
        <img
          src="/assets/images/jogja_hero_stupa_uhd.jpg"
          alt="Borobudur & Mataram Stupa Warm Sunrise Ultra HD"
          fetchPriority="high"
          decoding="sync"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'url(#jogja-photo-uhd-sharpen) brightness(0.96) contrast(1.06) saturate(1.14) sepia(0.14)',
            imageRendering: 'auto',
            transform: 'translateZ(0)',
            display: 'block'
          }}
        />

        {/* Lapisan Nuansa Hangat Lembut (Tidak Terlalu Gelap, Detail Stupa & Langit Tetap Terang Jelas) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 46% 42%, rgba(245, 178, 86, 0.14) 0%, rgba(28, 19, 10, 0.22) 68%, rgba(18, 12, 6, 0.38) 100%), linear-gradient(180deg, rgba(20, 14, 7, 0.24) 0%, rgba(28, 18, 8, 0.16) 45%, rgba(24, 15, 7, 0.28) 80%, rgba(16, 10, 5, 0.42) 100%)',
            pointerEvents: 'none'
          }}
        />
      </motion.div>

      {/* Central Content Area — 2-Column Split */}
      <main
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1360px',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.3fr) minmax(0, 0.9fr)',
          gap: isMobile ? '2rem' : '4rem',
          alignItems: 'center',
          zIndex: 10,
          padding: isMobile ? '5.5rem 0 2.5rem 0' : '7rem 2rem 3rem 2rem'
        }}
      >
        {/* Left Column: Big Statement Headline, Subtitle, Pill Button */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}
        >
          {/* Warm Gold Tagline Accent matching SASANA */}
          <span
            style={{
              fontSize: isMobile ? '0.68rem' : '0.78rem',
              fontWeight: 700,
              letterSpacing: isMobile ? '0.08em' : '0.16em',
              textTransform: 'uppercase',
              color: '#e5b869',
              marginBottom: '0.9rem',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
              maxWidth: isMobile ? '280px' : 'none',
              lineHeight: 1.5
            }}
          >
            PUSAKA BUDAYA & RADAR KULINER D.I. YOGYAKARTA
          </span>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Instrument Sans', Georgia, serif",
              fontSize: isMobile ? 'clamp(2.6rem, 9vw, 3.4rem)' : 'clamp(3.2rem, 6.2vw, 5.9rem)',
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#fffdf9',
              marginBottom: '1.6rem',
              textShadow: '0 4px 32px rgba(12, 8, 3, 0.75)'
            }}
          >
            <span style={{ display: 'block' }}>Jiwa Budaya Jogja.</span>
            <span style={{ display: 'block' }}>Rasa Asli Mataram.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
              fontWeight: 400,
              color: 'rgba(255, 248, 235, 0.92)',
              lineHeight: 1.6,
              marginBottom: '2.4rem',
              maxWidth: '580px',
              textShadow: '0 2px 18px rgba(12, 8, 3, 0.8)'
            }}
          >
            Jelajahi warisan budaya D.I. Yogyakarta, dari Sumbu Filosofis Keraton dan Kotagede hingga lereng Merapi. Gunakan <strong style={{ color: '#f3c97e' }}>Radar GPS Kuliner</strong> untuk menemukan rekomendasi kuliner di sekitar Anda.
          </p>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                height: '52px',
                padding: '0 2.2rem',
                backgroundColor: '#c99b52',
                color: '#fffdf9',
                borderRadius: '100px',
                border: '1px solid rgba(255, 236, 200, 0.35)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.96rem',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                boxShadow: '0 12px 35px rgba(15, 9, 3, 0.45)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#fffdf9' }}>●</span>
              <span>Jelajahi Budaya Jogja</span>
              <span style={{ fontSize: '0.7rem', color: '#fffdf9' }}>●</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column / Mobile Pill Strip: Feature Pills */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 35, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={
            isMobile
              ? {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '0.75rem',
                  overflowX: 'auto',
                  overflowY: 'visible',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  width: '100%',
                  paddingBottom: '0.5rem',
                  paddingLeft: '0.25rem',
                  paddingRight: '0.25rem'
                }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  alignItems: 'flex-end',
                  width: '100%'
                }
          }
        >
          {[
            {
              id: 'keraton-yogyakarta',
              title: 'Keraton & Tamansari',
              subtitle: 'Sumbu Filosofis UNESCO',
              image: '/assets/images/jogja_keraton.jpg'
            },
            {
              id: 'malioboro-tugu',
              title: 'Malioboro & Tugu',
              subtitle: 'Kopi Joss & Batik',
              image: '/assets/images/jogja_malioboro.jpg'
            },
            {
              id: 'kotagede',
              title: 'Warisan Kotagede',
              subtitle: 'Mataram 1586 & Perak',
              image: '/assets/images/jogja_kotagede.jpg'
            },
            {
              id: 'merapi-kaliurang',
              title: 'Merapi & Kaliurang',
              subtitle: 'Ullen Sentalu & Jadah Tempe',
              image: '/assets/images/jogja_merapi.jpg'
            }
          ].map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={
                isMobile
                  ? { flexShrink: 0, display: 'flex', justifyContent: 'center' }
                  : { width: '100%', display: 'flex', justifyContent: 'flex-end' }
              }
            >
              <div
                className={isMobile ? 'hero-feature-pill hero-feature-pill--mobile' : 'hero-feature-pill'}
                onClick={() => {
                  const landmark = LANDMARKS.find((l) => l.id === item.id) || LANDMARKS[idx];
                  if (onSelectLandmark) onSelectLandmark(landmark);
                }}
              >
                {/* Circular Thumbnail Photo */}
                <div className="hero-feature-pill-thumb">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Title & Subtitle Text */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="hero-feature-pill-title">
                    {item.title}
                  </span>
                  <span className="hero-feature-pill-subtitle">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Curved Bottom Divider */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 15,
          pointerEvents: 'none'
        }}
      >
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '75px'
          }}
        >
          <path d="M0,90 L1440,90 L1440,0 C1080,75 360,75 0,0 Z" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
