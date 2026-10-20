import React from 'react';
import { motion } from 'framer-motion';

export default function InstagramStories() {
  const stories = [
    { id: 1, image: '/assets/images/jogja_tugu.jpg', title: 'Tugu Pal Putih', category: 'Sumbu Filosofis' },
    { id: 2, image: '/assets/images/jogja_keraton.jpg', title: 'Keraton Ngayogyakarta', category: 'Warisan UNESCO' },
    { id: 3, image: '/assets/images/jogja_tamansari.jpg', title: 'Istana Air Tamansari', category: 'Cagar Budaya' },
    { id: 4, image: '/assets/images/real_gunungan_grebeg.jpg', title: 'Hajad Dalem Grebeg', category: 'Tradisi Keraton' },
    { id: 5, image: '/assets/images/jogja_prambanan.jpg', title: 'Candi Prambanan', category: 'Mahakarya Abad ke-9' },
    { id: 6, image: '/assets/images/real_ramayana_stage.jpg', title: 'Sendratari Ramayana', category: 'Seni Pertunjukan' },
    { id: 7, image: '/assets/images/jogja_ratuboko.jpg', title: 'Senja Ratu Boko', category: 'Arkeologi Mataram' },
    { id: 8, image: '/assets/images/jogja_merapi.jpg', title: 'Gunung Merapi', category: 'Poros Kosmis Utara' },
    { id: 9, image: '/assets/images/real_tari_srimanganti.jpg', title: 'Tari Klasik Srimanganti', category: 'Kesenian Keraton' },
    { id: 10, image: '/assets/images/jogja_kotagede.jpg', title: 'Warisan Kotagede', category: 'Ibu Kota Mataram' },
    { id: 11, image: '/assets/images/real_bregada_keraton.jpg', title: 'Bregada Prajurit', category: 'Kawal Pusaka' },
    { id: 12, image: '/assets/images/real_batik_keraton.jpg', title: 'Batik Tulis Pusaka', category: 'Kriya Warisan' },
    { id: 13, image: '/assets/images/jogja_batik.jpg', title: 'Kampung Batik Giriloyo', category: 'Sentra Batik Tulis' },
    { id: 14, image: '/assets/images/jogja_malioboro.jpg', title: 'Malam Malioboro', category: 'Denyut Kota' },
    { id: 15, image: '/assets/images/jogja_gudeg.jpg', title: 'Gudeg Kering Wijilan', category: 'Kuliner Legendaris' },
    { id: 16, image: '/assets/images/real_artjog.jpg', title: 'ARTJOG Contemporary Art', category: 'Pameran Seni' },
    { id: 17, image: '/assets/images/real_bekakak_gamping.jpg', title: 'Upacara Saparan Bekakak', category: 'Adat Istiadat' },
    { id: 18, image: '/assets/images/jogja_kasongan.jpg', title: 'Gerabah Kasongan', category: 'Kriya Tanah Liat' },
    { id: 19, image: '/assets/images/jogja_upacara_adat.jpg', title: 'Prosesi Adat Kasultanan', category: 'Paugeran Budaya' },
    { id: 20, image: '/assets/images/jogja_parangtritis.jpg', title: 'Pantai Parangtritis', category: 'Poros Segara Kidul' }
  ];

  // Duplicate for seamless infinite loop
  const marqueeItems = [...stories, ...stories];

  return (
    <section style={{
      width: '100%',
      maxWidth: '100vw',
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
            color: '#8c532b',
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
          Galeri Visual Faktual JogjaKrama
        </motion.div>

        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
          fontWeight: 800,
          color: '#2d180c',
          lineHeight: 1.15,
          letterSpacing: '-0.02em'
        }}>
          Potret Keindahan Budaya, Alam &<br />Kuliner Asli Yogyakarta
        </h2>
      </div>

      {/* INFINITE SCROLLING MARQUEE GALLERY */}
      <style>{`
        @keyframes jogjaMarqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .jogja-marquee-track {
          display: flex;
          gap: 1.25rem;
          white-space: nowrap;
          width: max-content;
          will-change: transform;
          animation: jogjaMarqueeScroll 45s linear infinite;
        }
        .jogja-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div style={{
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="jogja-marquee-track">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              style={{
                width: '190px',
                height: '290px',
                borderRadius: '22px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                background: '#f1f5f9',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <img 
                src={item.image} 
                alt={`${item.title} - ${item.category}`} 
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 10, 9, 0.85) 0%, rgba(12, 10, 9, 0.25) 45%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1rem 0.85rem',
                  pointerEvents: 'none'
                }}
              >
                <span style={{
                  color: '#fef08a',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.2rem'
                }}>
                  {item.category}
                </span>
                <span style={{
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  whiteSpace: 'normal'
                }}>
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBTEXT BELOW MARQUEE */}
      <div style={{
        textAlign: 'center',
        marginTop: '2.5rem',
        color: '#64748b',
        fontSize: '0.88rem',
        fontWeight: 500
      }}>
        Tandai <span style={{ color: '#051926', fontWeight: 700 }}>@jogjakrama.official</span> agar foto dokumentasi budaya Anda berkesempatan dikurasi.
      </div>
    </section>
  );
}
