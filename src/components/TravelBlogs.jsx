import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

export default function TravelBlogs() {
  const blogs = [
    {
      id: 'prawirotaman',
      title: 'Menjelajah Prawirotaman, Kawasan Wisata Urban Yogyakarta',
      excerpt: 'Prawirotaman berkembang dari kawasan permukiman menjadi area wisata dengan kafe, galeri seni, kerajinan, dan kuliner.',
      date: '5 Agustus 2025',
      source: 'Dinas Pariwisata DIY',
      href: 'https://visitingjogja.jogjaprov.go.id/43132/menjelajah-prawirotaman-surga-wisata-urban-di-jantung-yogyakarta/'
    },
    {
      id: 'kotabaru',
      title: 'Ruang Publik dan Kawasan Bersejarah Kotabaru',
      excerpt: 'Kenali Taman Kotabaru, jalur pedestrian, dan ruang publik di kawasan bersejarah Yogyakarta.',
      date: '3 Juni 2025',
      source: 'Dinas Pariwisata DIY',
      href: 'https://visitingjogja.jogjaprov.go.id/42678/jelajahi-space-publik-di-sekitar-kotabaru-heritage-santai-dan-ramah-pejalan-kaki/'
    }
  ];

  return (
    <section style={{
      width: '100%',
      background: '#ffffff',
      padding: '4rem 2.5rem 5rem 2.5rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        {/* SECTION HEADER */}
        <div style={{
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto 3.5rem auto'
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
            <BookOpen size={18} aria-hidden="true" />
            Jurnal Budaya & Kuliner Jogja
          </motion.div>

          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#2d180c',
            lineHeight: 1.15,
            letterSpacing: '-0.02em'
          }}>
            Catatan Perjalanan, Tata Krama, dan Kuliner Yogyakarta
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {blogs.map((blog, idx) => (
            <motion.a
              key={blog.id}
              href={blog.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.16, ease: 'easeOut' } }}
              style={{
                display: 'flex',
                minHeight: '220px',
                flexDirection: 'column',
                padding: '1.5rem',
                border: '1px solid #d8e0da',
                borderRadius: '6px',
                background: '#f7f8f5',
                color: '#173f36',
                textDecoration: 'none'
              }}
            >
              <span style={{ color: '#a94e35', fontSize: '0.78rem', fontWeight: 700 }}>{blog.date}</span>
              <h3 style={{ margin: '0.8rem 0 0.55rem', fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', lineHeight: 1.25 }}>{blog.title}</h3>
              <p style={{ margin: '0 0 1.5rem', color: '#64766d', fontSize: '0.9rem', lineHeight: 1.55 }}>{blog.excerpt}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: 'auto', fontSize: '0.82rem', fontWeight: 700 }}>
                Baca di {blog.source} <ExternalLink size={14} aria-hidden="true" />
              </span>
            </motion.a>
          ))}
        </div>

        {/* BOTTOM ROW (Left Text + Divider Line + Right CustomPillButton) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#556877',
            whiteSpace: 'nowrap'
          }}>
            Baca artikel pilihan tentang budaya dan kuliner Yogyakarta.
          </span>

          <div style={{
            flex: 1,
            minWidth: '150px',
            height: '1px',
            background: '#e2e8f0'
          }} />

          <a
            href="https://visitingjogja.jogjaprov.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#173f36', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}
          >
            Buka Portal Pariwisata DIY <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
}
