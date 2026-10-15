import React from 'react';
import CustomPillButton from './CustomPillButton';

export default function CTAHeroBanner({ onOpenBooking }) {
  return (
    <section
      style={{
        width: '100%',
        position: 'relative',
        background: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* MAIN CTA HERO BANNER */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(440px, 55vh, 560px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '2.5rem 0'
        }}
      >
        {/* Background Image (Yogyakarta Ratu Boko & Prambanan Heritage Landscape) */}
        <img
          src="/assets/images/jogja_ratuboko.jpg"
          alt="Keraton Ratu Boko Yogyakarta"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.88) saturate(1.1)',
            opacity: 1
          }}
        />

        {/* TOP PURE WHITE FADE OVERLAY */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0) 40%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Center Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '750px',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)',
            color: '#ffffff'
          }}
        >
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.2rem',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 4px 25px rgba(0,0,0,0.5)'
            }}
          >
            Jelajahi Tempatnya,
            <br />
            Kenali Budayanya.
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#ffffff',
              fontWeight: 500,
              marginBottom: '2.5rem',
              lineHeight: 1.5,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)'
            }}
          >
            Di balik setiap tempat ada masyarakat, ada tradisi luhur, dan ada sejarah yang hidup.
            <br />
            Mulai perjalanan eksplorasi budaya Anda hari ini.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CustomPillButton label="Mulai Eksplorasi Sekarang" onClick={onOpenBooking} />
          </div>
        </div>
      </div>
    </section>
  );
}
