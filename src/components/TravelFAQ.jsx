import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function TravelFAQ() {
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
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '1.25rem 1.6rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isOpen ? '0 10px 30px rgba(0, 0, 0, 0.06)' : '0 2px 10px rgba(0, 0, 0, 0.02)'
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
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#051926',
            lineHeight: 1.3
          }}>
            {item.q}
          </h3>
          <div style={{
            color: '#64748b',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isOpen ? <Minus size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
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
                color: '#64748b',
                lineHeight: 1.5,
                fontWeight: 400
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
    <section style={{
      width: '100%',
      background: '#ffffff',
      padding: '4rem 2.5rem 6.5rem 2.5rem',
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Tanya Jawab Wisata & Kuliner DIY
          </motion.div>

          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#051926',
            lineHeight: 1.15,
            letterSpacing: '-0.02em'
          }}>
            Hal Penting Sebelum Anda<br />Menjelajahi Yogyakarta
          </h2>
        </div>

        {/* 2-COLUMN ACCORDION GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.2rem',
          alignItems: 'start'
        }}>
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
