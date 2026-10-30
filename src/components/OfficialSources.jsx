import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const officialSources = [
  {
    title: 'Sumbu Kosmologi Yogyakarta',
    shortTitle: 'Sumbu Kosmologi',
    category: 'UNESCO',
    detail: 'Terdaftar sebagai Warisan Dunia UNESCO pada 2023. Poros utara–selatannya membentang sekitar 6 km, menghubungkan Gunung Merapi, Keraton, dan Samudra Hindia.',
    source: 'UNESCO',
    href: 'https://whc.unesco.org/en/list/1671/',
    iconSrc: '/assets/icons/icon_culture.svg'
  },
  {
    title: 'Keraton Yogyakarta',
    shortTitle: 'Keraton Yogyakarta',
    category: 'Kasultanan',
    detail: 'Sebagian kawasan Keraton terbuka untuk kunjungan publik dan dikelola oleh Kawedanan Radya Kartiyasa.',
    source: 'Situs resmi wisata Keraton',
    href: 'https://tourism.kratonjogja.id/id-ID/destination',
    iconSrc: '/assets/icons/icon_soul.svg'
  },
  {
    title: 'Museum Ullen Sentalu',
    shortTitle: 'Museum Ullen Sentalu',
    category: 'Museum',
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

  // State untuk tumpukan interaktif di mobile (Opsi A)
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [touchStart, setTouchStart] = useState(null);

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

  // Konfigurasi animasi Stack to Spread untuk Desktop
  const getCardAnim = (index) => {
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

  // Interaksi Touch & Tap di Mobile
  const handleCardTap = (idx) => {
    if (idx === activeCardIndex) {
      // Jika mengetuk kartu terdepan, ganti urutan ke kartu berikutnya
      setActiveCardIndex((prev) => (prev + 1) % officialSources.length);
    } else {
      // Jika mengetuk kartu di belakang (kiri/kanan), bawa langsung ke depan
      setActiveCardIndex(idx);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      // Geser ke kiri: kartu berikutnya
      setActiveCardIndex((prev) => (prev + 1) % officialSources.length);
    } else if (diff < -40) {
      // Geser ke kanan: kartu sebelumnya
      setActiveCardIndex((prev) => (prev - 1 + officialSources.length) % officialSources.length);
    }
    setTouchStart(null);
  };

  return (
    <section
      id="official-sources"
      className="w-full px-4 sm:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 bg-[#FAF6EE] text-[#1A1A1A] relative border-b border-[#D9CEBA]/60"
    >
      {/* ========================================================
          MOBILE VIEW (block md:hidden): Opsi A - Ramping & Proporsional
          Tumpukan interaktif di tengah, tanpa slider dots, tanpa tombol buka
          ======================================================== */}
      <div className="block md:hidden w-full max-w-[390px] mx-auto text-left">
        {/* Section Header Ringkas */}
        <div className="mb-2 px-1">
          <h2 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-[#2D180C] leading-tight tracking-tight m-0 mb-1">
            Informasi yang dapat diperiksa
          </h2>
          <p className="text-xs text-[#2D180C]/70 font-normal m-0 leading-relaxed">
            Fakta dirujuk langsung ke pengelola atau lembaga resmi terkait.
          </p>
        </div>

        {/* Tumpukan Kartu Ramping (Stage tinggi ~190px, pas selayar) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[190px] flex items-center justify-center my-2"
        >
          {officialSources.map(({ title, shortTitle, category, detail, source, href, iconSrc }, idx) => {
            const diff = (idx - activeCardIndex + officialSources.length) % officialSources.length;
            
            let x = 0;
            let rotate = 0;
            let scale = 1;
            let zIndex = 30;
            let isFront = false;

            if (diff === 0) {
              // Kartu depan: tegak, fokus utama
              x = 0;
              rotate = 0;
              scale = 1;
              zIndex = 30;
              isFront = true;
            } else if (diff === 1) {
              // Kartu kanan: mengintip di kanan belakang
              x = 28;
              rotate = 8;
              scale = 0.94;
              zIndex = 20;
              isFront = false;
            } else {
              // Kartu kiri: mengintip di kiri belakang
              x = -28;
              rotate = -8;
              scale = 0.94;
              zIndex = 10;
              isFront = false;
            }

            return (
              <motion.article
                key={title}
                animate={{
                  x,
                  rotate,
                  scale,
                  zIndex
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 22
                }}
                onClick={() => handleCardTap(idx)}
                className={`absolute w-[225px] h-[160px] rounded-[18px] p-3.5 border transition-colors cursor-pointer select-none flex flex-col justify-between ${
                  isFront
                    ? 'bg-[#FCFBF7] border-[#C7AE98] shadow-[0_14px_30px_rgba(45,24,12,0.15)]'
                    : 'bg-[#E6D2C1] border-[#C7AE98] shadow-sm opacity-80'
                }`}
              >
                {/* Header Kartu: Ikon & Kategori Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center">
                    <img
                      src={iconSrc}
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#8c532b] bg-white/60 px-1.5 py-0.5 rounded">
                    {category}
                  </span>
                </div>

                {/* Konten Teks Padat & Rapi */}
                <div>
                  <h4 className="font-outfit text-xs font-bold text-[#2d180c] leading-snug mb-0.5">
                    {shortTitle}
                  </h4>
                  <p className="text-[10px] text-[#554E46] leading-relaxed line-clamp-2 font-normal m-0">
                    {detail}
                  </p>
                </div>

                {/* Footer Link Langsung ke Sumber Resmi */}
                <div className="pt-1.5 border-t border-[#E8DFC9] flex items-center justify-between">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8c532b] hover:underline"
                  >
                    <span>{source}</span>
                    <ExternalLink size={11} aria-hidden="true" />
                  </a>
                  {isFront && (
                    <span className="text-[9px] text-[#7A6B58] font-medium">
                      Ketuk kartu
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (hidden md:block): 100% Desktop Asli Terjaga
          ======================================================== */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto w-full flex flex-col">
          <header className="max-w-2xl mb-4 sm:mb-6">
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D180C] leading-tight tracking-tight m-0 mb-2">
              Informasi yang dapat diperiksa
            </h2>
            <p className="text-xs sm:text-sm text-[#2D180C]/70 m-0 leading-relaxed font-normal">
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
      </div>
    </section>
  );
}
