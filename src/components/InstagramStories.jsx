import React from 'react';
import { motion } from 'framer-motion';

export default function InstagramStories() {
  const stories = [
    { id: 1, image: '/assets/images/jogja_tugu.jpg' },
    { id: 2, image: '/assets/images/jogja_keraton.jpg' },
    { id: 3, image: '/assets/images/jogja_tamansari.jpg' },
    { id: 4, image: '/assets/images/jogja_prambanan.jpg' },
    { id: 5, image: '/assets/images/jogja_ratuboko.jpg' },
    { id: 6, image: '/assets/images/jogja_merapi.jpg' },
    { id: 7, image: '/assets/images/jogja_kotagede.jpg' },
    { id: 8, image: '/assets/images/jogja_batik.jpg' },
    { id: 9, image: '/assets/images/jogja_malioboro.jpg' },
    { id: 10, image: '/assets/images/jogja_gudeg.jpg' },
  ];

  // Duplicate for seamless infinite loop
  const marqueeItems = [...stories, ...stories, ...stories];

  return (
    <section style={{
      width: '100%',
      background: '#ffffff',
      padding: '5rem 0 4rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* SECTION HEADER */}
      <div style={{
        textAlign: 'center',
        maxWidth: '750px',
        margin: '0 auto 3rem auto',
        padding: '0 2rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#556877',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '0.8rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
          Galeri Visual JogjaKrama
        </motion.div>

        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
          fontWeight: 800,
          color: '#051926',
          lineHeight: 1.15,
          letterSpacing: '-0.02em'
        }}>
          Potret Keindahan Budaya, Alam &<br />Kuliner Asli Yogyakarta
        </h2>
      </div>

      {/* INFINITE SCROLLING MARQUEE GALLERY (Edge fade mask removed!) */}
      <div style={{
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 35,
            ease: 'linear'
          }}
          style={{
            display: 'flex',
            gap: '1.2rem',
            whiteSpace: 'nowrap',
            willChange: 'transform'
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              style={{
                width: '180px',
                height: '280px',
                borderRadius: '20px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                background: '#f1f5f9'
              }}
            >
              <img 
                src={item.image} 
                alt={`Foto galeri ${idx + 1}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* SUBTEXT BELOW MARQUEE */}
      <div style={{
        textAlign: 'center',
        marginTop: '2.5rem',
        color: '#64748b',
        fontSize: '0.88rem',
        fontWeight: 500
      }}>
        Tandai <span style={{ color: '#051926', fontWeight: 700 }}>@jogjakrama.official</span> agar foto Anda berkesempatan ditampilkan.
      </div>
    </section>
  );
}
