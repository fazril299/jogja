import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const officialSources = [
  {
    title: 'Sumbu Kosmologi Yogyakarta',
    detail: 'Terdaftar sebagai Warisan Dunia UNESCO pada 2023. Poros utara–selatannya membentang sekitar 6 km, menghubungkan Gunung Merapi, Keraton, dan Samudra Hindia.',
    source: 'UNESCO',
    href: 'https://whc.unesco.org/en/list/1671/',
    iconSrc: '/assets/icons/icon_culture.svg'
  },
  {
    title: 'Keraton Yogyakarta',
    detail: 'Sebagian kawasan Keraton terbuka untuk kunjungan publik dan dikelola oleh Kawedanan Radya Kartiyasa.',
    source: 'Situs resmi wisata Keraton',
    href: 'https://tourism.kratonjogja.id/id-ID/destination',
    iconSrc: '/assets/icons/icon_soul.svg'
  },
  {
    title: 'Museum Ullen Sentalu',
    detail: 'Buka Selasa–Minggu, pukul 08.30–16.30 WIB. Tur terakhir dimulai pukul 15.15 WIB; museum tutup pada hari Senin.',
    source: 'Situs resmi Museum Ullen Sentalu',
    href: 'https://www.ullensentalu.com/berkunjung.html',
    iconSrc: '/assets/icons/icon_nature.svg'
  }
];

export default function OfficialSources() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [spreadDistance, setSpreadDistance] = useState(380);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Jarak kosong (gap) 28px (antara 24px - 32px)
        const gap = 28;
        const dist = (width + gap) / 3;
        setSpreadDistance(dist);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Konfigurasi animasi Stack to Spread untuk masing-masing card
  const getCardAnim = (index) => {
    // Pada mobile (< 768px), matikan efek bertumpuk agar tersusun rapi ke bawah
    if (!isDesktop) {
      return {
        x: 0,
        rotate: 0,
        scale: 1,
        zIndex: 1
      };
    }

    // Card kiri (card ke-1): z-10, scale: 0.96, terlihat keluar ~115px dengan kemiringan lembut -2.5°
    if (index === 0) {
      return {
        x: isHovered ? 0 : spreadDistance - 115,
        rotate: isHovered ? 0 : -2.5,
        scale: isHovered ? 1 : 0.96,
        zIndex: 10
      };
    }

    // Card tengah (card ke-2): z-30, scale: 1, x: 0 (paling depan & tegak)
    if (index === 1) {
      return {
        x: 0,
        rotate: 0,
        scale: 1,
        zIndex: 30
      };
    }

    // Card kanan (card ke-3): z-20, scale: 0.96, terlihat keluar ~115px dengan kemiringan lembut +2.5°
    return {
      x: isHovered ? 0 : -(spreadDistance - 115),
      rotate: isHovered ? 0 : 2.5,
      scale: isHovered ? 1 : 0.96,
      zIndex: 20
    };
  };

  const springTransition = {
    type: 'spring',
    stiffness: 240,
    damping: 24
  };

  return (
    <section
      id="official-sources"
      className="w-full px-4 sm:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 bg-[#FAF6EE] text-[#1A1A1A] relative border-b border-[#D9CEBA]/60"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <header style={{ maxWidth: '720px', marginBottom: 'clamp(0.75rem, 1.8vw, 1rem)' }}>
          <p style={{ margin: '0 0 0.4rem', color: '#8c532b', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Referensi Resmi
          </p>
          <h2 style={{ margin: '0 0 0.45rem', fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', lineHeight: 1.2, color: '#2d180c' }}>
            Informasi yang dapat diperiksa
          </h2>
          <p style={{ margin: 0, color: '#64766d', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Fakta berikut dirujuk langsung ke pengelola atau lembaga terkait. Periksa sumber resmi untuk pembaruan informasi kunjungan.
          </p>
        </header>

        {/* Container Area Card Interaktif Stack to Spread */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 w-full relative py-1"
        >
          {officialSources.map(({ title, detail, source, href, iconSrc }, idx) => {
            const anim = getCardAnim(idx);

            return (
              <motion.article
                key={title}
                animate={{
                  x: anim.x,
                  rotate: anim.rotate,
                  scale: anim.scale,
                  zIndex: anim.zIndex
                }}
                transition={springTransition}
                whileHover={isHovered ? { y: -4 } : {}}
                className="h-full min-h-[250px] sm:min-h-[270px] flex flex-col justify-between"
                style={{
                  minWidth: 0,
                  padding: 'clamp(1.1rem, 3vw, 1.4rem)',
                  border: '1px solid #C7AE98',
                  borderRadius: '24px',
                  background: '#E6D2C1',
                  boxShadow: isHovered
                    ? '0 12px 32px rgba(45, 24, 12, 0.12)'
                    : '0 4px 18px rgba(45, 24, 12, 0.05)'
                }}
              >
                <div>
                  <img src={iconSrc} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.9 }} />
                  <h3 style={{ margin: '0.85rem 0 0.55rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3, color: '#000000' }}>
                    {title}
                  </h3>
                  <p style={{ margin: '0 0 1rem', color: 'rgba(0, 0, 0, 0.8)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {detail}
                  </p>
                </div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#000000',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    paddingTop: '0.5rem'
                  }}
                >
                  {source} <ExternalLink size={14} aria-hidden="true" />
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}