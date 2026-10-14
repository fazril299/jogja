import React from 'react';
import { motion } from 'framer-motion';
import CustomPillButton from './CustomPillButton';

export default function HandcraftedPackages({ onOpenBooking, onOpenTourDetail }) {
  const packages = [
    {
      id: 'prambanan-ratuboko',
      title: 'Prambanan & Ratu Boko',
      subtitle: 'Sleman • Candi & Senja Bukit Boko',
      image: '/assets/images/jogja_prambanan.jpg'
    },
    {
      id: 'wijilan-prawirotaman',
      title: 'Kuliner Wijilan & Jejeran',
      subtitle: 'Gudeg Kayu Bakar & Sate Klathak',
      image: '/assets/images/jogja_gudeg.jpg'
    },
    {
      id: 'kasongan-imogiri',
      title: 'Kasongan, Giriloyo & Imogiri',
      subtitle: 'Bantul • Gerabah & Batik Tulis',
      image: '/assets/images/jogja_batik.jpg'
    },
    {
      id: 'parangtritis-gunungkidul',
      title: 'Parangtritis & Gunungkidul',
      subtitle: 'Gumuk Pasir & Geopark Karst',
      image: '/assets/images/jogja_parangtritis.jpg'
    }
  ];

  return (
    <section className="handcrafted-section">
      <div className="handcrafted-container">
        {/* SECTION HEADER */}
        <div className="handcrafted-header">
          {/* Sub-badge line mountain icon */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="handcrafted-eyebrow"
          >
            <img 
              src="/images/icon_culinary.svg" 
              alt="Ikon katalog destinasi dan kuliner" 
              style={{ height: '26px', width: '26px', objectFit: 'contain', opacity: 0.85 }}
            />
            Katalog Wilayah & Kuliner DIY
          </motion.div>

          {/* Headline */}
          <h2 className="handcrafted-title">
            Destinasi Pilihan Yogyakarta
          </h2>
        </div>

        {/* 4 TOUR CARDS GRID */}
        <div className="handcrafted-grid">
          {packages.map((pkg, idx) => (
            <motion.button
              key={pkg.id}
              type="button"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.16, ease: 'easeOut' } }}
              className="handcrafted-card"
              onClick={() => {
                if (onOpenTourDetail) {
                  onOpenTourDetail(pkg);
                } else if (onOpenBooking) {
                  onOpenBooking(pkg);
                }
              }}
            >
              {/* Card Photo Container */}
              <div className="handcrafted-card-image">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                />
              </div>

              {/* Card Info Below Photo */}
              <div className="handcrafted-card-info">
                <div className="handcrafted-card-location">
                  {pkg.subtitle}
                </div>
                <h3 className="handcrafted-card-title">
                  {pkg.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* BOTTOM ROW (Left Text + Divider Line + Right CustomPillButton) */}
        <div className="handcrafted-footer">
          <span className="handcrafted-footer-copy">
            Pilih destinasi untuk melihat informasi selengkapnya.
          </span>

          <CustomPillButton 
            label="Buka Katalog Lengkap" 
            onClick={() => onOpenTourDetail ? onOpenTourDetail({ id: 'keraton-yogyakarta' }) : onOpenBooking()} 
            variant="dark"
          />
        </div>

      </div>
    </section>
  );
}
