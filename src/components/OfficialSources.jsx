import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const officialSources = [
  {
    title: 'Sumbu Kosmologi Yogyakarta',
    detail: 'Terdaftar sebagai Warisan Dunia UNESCO pada 2023. Poros utara–selatannya membentang sekitar 6 km, menghubungkan Gunung Merapi, Keraton, dan Samudra Hindia.',
    source: 'UNESCO',
    href: 'https://whc.unesco.org/en/list/1671/',
    iconSrc: '/images/icon_culture.svg'
  },
  {
    title: 'Keraton Yogyakarta',
    detail: 'Sebagian kawasan Keraton terbuka untuk kunjungan publik dan dikelola oleh Kawedanan Radya Kartiyasa.',
    source: 'Situs resmi wisata Keraton',
    href: 'https://tourism.kratonjogja.id/id-ID/destination',
    iconSrc: '/images/icon_soul.svg'
  },
  {
    title: 'Museum Ullen Sentalu',
    detail: 'Buka Selasa–Minggu, pukul 08.30–16.30 WIB. Tur terakhir dimulai pukul 15.15 WIB; museum tutup pada hari Senin.',
    source: 'Situs resmi Museum Ullen Sentalu',
    href: 'https://www.ullensentalu.com/berkunjung.html',
    iconSrc: '/images/icon_nature.svg'
  }
];

export default function OfficialSources() {
  return (
    <section style={{ width: '100%', padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)', background: '#f7f8f5', color: '#173f36' }}>
      <div style={{ width: '100%', maxWidth: '1180px', margin: '0 auto' }}>
        <header style={{ maxWidth: '720px', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <p style={{ margin: '0 0 0.65rem', color: '#a94e35', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Referensi Resmi
          </p>
          <h2 style={{ margin: '0 0 0.7rem', fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.2 }}>
            Informasi yang dapat diperiksa
          </h2>
          <p style={{ margin: 0, color: '#64766d', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Fakta berikut dirujuk langsung ke pengelola atau lembaga terkait. Periksa sumber resmi untuk pembaruan informasi kunjungan.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
          {officialSources.map(({ title, detail, source, href, iconSrc }) => (
            <motion.article
              key={title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.16 }}
              style={{ minWidth: 0, padding: 'clamp(1.1rem, 3vw, 1.4rem)', border: '1px solid #dce4de', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <img src={iconSrc} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', opacity: 0.82 }} />
                <h3 style={{ margin: '0.85rem 0 0.55rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', lineHeight: 1.3 }}>{title}</h3>
                <p style={{ margin: '0 0 1rem', color: '#52665d', fontSize: '0.88rem', lineHeight: 1.6 }}>{detail}</p>
              </div>
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#8b3d2a', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', paddingTop: '0.5rem' }}>
                {source} <ExternalLink size={14} aria-hidden="true" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}