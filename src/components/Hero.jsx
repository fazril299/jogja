import React from 'react';
import { motion } from 'framer-motion';
import { LANDMARKS } from '../data/landmarks';

export default function Hero({ onOpenBooking, onOpenNearMe, onSelectLandmark }) {
  return (
    <div className="hero-wrapper">
      {/* Background Image */}
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
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'brightness(0.96) contrast(1.06) saturate(1.14) sepia(0.14)',
            imageRendering: 'auto',
            transform: 'translateZ(0)',
            display: 'block'
          }}
        />
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

      {/* Central Content Area */}
      <main className="hero-main">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="hero-left-col"
        >
          {/* Tagline */}
          <span className="hero-tagline">
            Eksplorasi Pusaka &amp; Kuliner Jogja
          </span>

          {/* Main Headline */}
          <h1 className="hero-headline">
            <span style={{ display: 'block' }}>Warisan Tradisi.</span>
            <span style={{ display: 'block' }}>Cita Rasa Autentik.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Jelajahi keagungan Keraton, megahnya candi-candi bersejarah, dan kekayaan tradisi Jogja lengkap dengan panduan{' '}
            <strong style={{ color: '#f3c97e' }}>Radar GPS Kuliner</strong>{' '}
            untuk menemukan kelezatan lokal terdekatmu.
          </p>

        </motion.div>

        {/* Right Column / Centered Pills on Mobile — Destination Pills */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hero-pills-col"
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
              className="hero-pill-wrapper"
            >
              <div
                className="hero-feature-pill"
                onClick={() => {
                  const landmark = LANDMARKS.find((l) => l.id === item.id) || LANDMARKS[idx];
                  if (onSelectLandmark) onSelectLandmark(landmark);
                }}
              >
                <div className="hero-feature-pill-thumb">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="hero-feature-pill-title">{item.title}</span>
                  <span className="hero-feature-pill-subtitle">{item.subtitle}</span>
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
          style={{ position: 'relative', display: 'block', width: '100%', height: '75px' }}
        >
          <path d="M0,90 L1440,90 L1440,0 C1080,75 360,75 0,0 Z" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
