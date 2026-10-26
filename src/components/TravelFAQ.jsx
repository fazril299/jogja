import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function TravelFAQ({ id }) {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleQuestion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const leftQuestions = [
    {
      idx: 0,
      q: 'Bagaimana cara kerja Radar GPS Kuliner Yogyakarta?',
      a: 'Aktifkan GPS atau pilih wilayah kunjungan, seperti Malioboro, Keraton, Kotagede, Kaliurang, atau Bantul. Sistem akan menampilkan rekomendasi kuliner dalam radius yang dipilih beserta informasi penilaiannya.'
    },
    {
      idx: 1,
      q: 'Bagaimana memastikan harga makanan di sekitar Malioboro?',
      a: 'Periksa menu dan daftar harga sebelum memesan. Pilih tempat makan yang mencantumkan harga secara jelas, termasuk di kawasan Teras Malioboro, atau tanyakan harga kepada penjual terlebih dahulu.'
    },
    {
      idx: 2,
      q: 'Apa pilihan kuliner gurih jika saya kurang menyukai makanan manis?',
      a: 'Beberapa pilihan yang dapat dipertimbangkan antara lain Sate Klathak Pak Pong atau Pak Bari di Jejeran, Mangut Lele Asap Mbah Marto, Sate Ratu, Bakmi Jawa Mbah Gito, dan Soto Bathok Mbah Katro.'
    },
    {
      idx: 3,
      q: 'Apa tata krama yang perlu diperhatikan saat mengunjungi Keraton dan Makam Imogiri?',
      a: 'Kenakan pakaian berlengan yang menutup lutut, lepaskan topi dan kacamata hitam saat memasuki bangsal, serta patuhi petunjuk petugas. Ikuti ketentuan pakaian adat yang berlaku di area tertentu.'
    }
  ];

  const rightQuestions = [
    {
      idx: 4,
      q: 'Jenis gudeg apa yang sesuai dijadikan oleh-oleh untuk perjalanan jauh?',
      a: 'Gudeg kering dari kawasan Wijilan, seperti Gudeg Yu Djum, dapat menjadi pilihan. Mintalah sambal krecek dikemas terpisah dan ikuti petunjuk penyimpanan dari penjual.'
    },
    {
      idx: 5,
      q: 'Kapan waktu yang disarankan untuk mengunjungi Museum Ullen Sentalu dan Candi Prambanan?',
      a: 'Museum Ullen Sentalu dapat dikunjungi pada pagi hari; pastikan jadwal operasionalnya sebelum berangkat karena museum tutup pada hari Senin. Untuk Candi Prambanan dan Keraton Ratu Boko, kunjungan pada sore hari memberi kesempatan menikmati suasana menjelang matahari terbenam.'
    },
    {
      idx: 6,
      q: 'Bagaimana memilih gerai bakpia yang tepercaya di Yogyakarta?',
      a: 'Belilah dari gerai resmi, seperti Bakpia Kurnia Sari, Bakpia Pathok 25, atau Bakpia Juwara Satoe. Periksa alamat dan informasi gerai melalui kanal resmi sebelum berkunjung.'
    },
    {
      idx: 7,
      q: 'Bagaimana cara mendapatkan Stempel Paspor Budaya Yogyakarta?',
      a: 'Setiap kali Anda membaca tuntas bab wilayah di Katalog Destinasi Jogja, Anda dapat menyimpan lencana stempel wilayah tersebut ke dalam "Paspor Budaya Jogja" milik Anda.'
    }
  ];

  const renderFaqCard = (item) => {
    const isOpen = openIdx === item.idx;
    return (
      <div
        key={item.idx}
        onClick={() => toggleQuestion(item.idx)}
        style={{
          background: '#E6D2C1',
          border: '1px solid #C7AE98',
          borderRadius: '24px',
          padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.6rem)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isOpen ? '0 12px 32px rgba(45, 24, 12, 0.12)' : '0 4px 18px rgba(45, 24, 12, 0.05)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            fontWeight: 700,
            color: '#000000',
            lineHeight: 1.35
          }}>
            {item.q}
          </h3>
          <div style={{
            color: '#000000',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isOpen ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(0, 0, 0, 0.82)',
                lineHeight: 1.55,
                fontWeight: 500
              }}>
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id={id || "faq-section"} className="web-section-100vh w-full bg-[#FAF6EE] px-4 sm:px-8 pt-16 sm:pt-20 pb-8 relative flex flex-col border-b border-neutral-200">
      <div style={{
        maxWidth: '1240px',
        margin: 'auto auto',
        maxHeight: '78vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%'
      }}>
        {/* SECTION HEADER */}
        <div style={{
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto clamp(1.2rem, 3vw, 2rem) auto'
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
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Tanya Jawab Wisata & Kuliner DIY
          </motion.div>

          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#2d180c',
            lineHeight: 1.15,
            letterSpacing: '-0.02em'
          }}>
            Hal Penting Sebelum Anda<br />Menjelajahi Yogyakarta
          </h2>
        </div>

        {/* 2-COLUMN ACCORDION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {leftQuestions.map((item) => renderFaqCard(item))}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {rightQuestions.map((item) => renderFaqCard(item))}
          </div>
        </div>

      </div>
    </section>
  );
}
