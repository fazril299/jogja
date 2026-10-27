import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function TravelFAQ({ id }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

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

  const renderFaqRow = (item, topBorderClass = '') => {
    const isOpen = openIdx === item.idx;
    return (
      <div
        key={item.idx}
        className={`border-b border-[#D9CEBA]/80 transition-colors duration-200 ${topBorderClass}`}
      >
        <button
          type="button"
          onClick={() => toggleQuestion(item.idx)}
          className="w-full text-left py-4 sm:py-5 px-1 sm:px-2 flex items-center justify-between gap-4 group focus:outline-none transition-all active:opacity-60"
          aria-expanded={isOpen}
        >
          <span
            className={`font-sans text-[0.98rem] sm:text-[1.08rem] font-medium leading-snug transition-colors duration-200 ${
              isOpen ? 'text-[#8C532B] font-semibold' : 'text-[#2D180C] group-hover:text-[#8C532B]'
            }`}
          >
            {item.q}
          </span>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isOpen ? 'bg-[#8C532B]/10 text-[#8C532B]' : 'bg-[#2D180C]/5 text-[#2D180C]/70 group-hover:bg-[#2D180C]/10'
            }`}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <ChevronDown size={17} strokeWidth={2.2} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-5 pt-1 px-1 sm:px-2 text-[0.9rem] sm:text-[0.95rem] text-[#2D180C]/80 leading-relaxed font-normal">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      id={id || "faq-section"}
      className="w-full min-h-screen bg-[#FAF6EE] px-4 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 relative flex flex-col justify-center border-b border-[#D9CEBA]/60"
    >
      <div className="max-w-[1140px] mx-auto w-full flex flex-col justify-center">
        {/* SECTION HEADER - Clean Apple Luxury Style */}
        <div className="text-center max-w-[720px] mx-auto mb-8 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-[#8C532B] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 px-3.5 py-1 rounded-full bg-[#8C532B]/8 border border-[#8C532B]/15"
          >
            <HelpCircle size={15} strokeWidth={2} />
            <span>Tanya Jawab Wisata & Kuliner</span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D180C] leading-tight tracking-tight">
            Hal Penting Sebelum Anda<br className="hidden sm:inline" /> Menjelajahi Yogyakarta
          </h2>
          <p className="text-sm sm:text-base text-[#2D180C]/70 mt-3 max-w-xl mx-auto leading-relaxed">
            Panduan esensial seputar tata krama budaya, kuliner autentik, dan tips praktis menjelajah Jogja.
          </p>
        </div>

        {/* DESKTOP: 2-COLUMN ACCORDION GRID / MOBILE: FIRST 4 QUESTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 items-start">
          {/* Left Column (Items 0-3: Always visible on both Mobile & Desktop) */}
          <div className="flex flex-col">
            {leftQuestions.map((item, idx) =>
              renderFaqRow(item, idx === 0 ? 'border-t border-[#D9CEBA]/80' : '')
            )}
          </div>

          {/* Right Column (Items 4-7: Always visible on Desktop) */}
          <div className="hidden md:flex flex-col">
            {rightQuestions.map((item, idx) =>
              renderFaqRow(item, idx === 0 ? 'md:border-t border-[#D9CEBA]/80' : '')
            )}
          </div>
        </div>

        {/* MOBILE ONLY: Smooth Expandable Sisa Pertanyaan (Items 4-7) */}
        <div className="md:hidden">
          <AnimatePresence initial={false}>
            {showAllMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col overflow-hidden"
              >
                {rightQuestions.map((item) => renderFaqRow(item, ''))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Apple-style Pill Expand Button */}
          <div className="pt-6 sm:pt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#8C532B] bg-[#8C532B]/8 hover:bg-[#8C532B]/15 active:scale-95 transition-all duration-200 border border-[#8C532B]/20 shadow-xs"
            >
              <span>
                {showAllMobile
                  ? 'Tampilkan Lebih Sedikit'
                  : `Lihat ${rightQuestions.length} Pertanyaan Lainnya`}
              </span>
              <motion.div
                animate={{ rotate: showAllMobile ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center"
              >
                <ChevronDown size={15} strokeWidth={2.4} />
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
