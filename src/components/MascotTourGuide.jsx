import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';

/**
 * MASCOT CONFIGURATION FOR ALL HOME SECTIONS & DEDICATED PAGES (EXCEPT SECTION 1 - HERO)
 */
const MASCOT_CONFIG = {
  // ── DEDICATED PAGES ──
  'tentang': {
    type: 'page',
    sectionName: 'Mengenal Hamemayu Hayuning Bawana',
    image: '/assets/images/mascot_jogja.jpg',
    badge: 'Pemandu Filosofi Luhur',
    headline: 'Falsafah Luhur Kehidupan Jogja',
    message: 'Sugeng Rawuh di laman Mengenal Hamemayu! Mari pelajari makna luhur falsafah hidup masyarakat Yogyakarta yang menjunjung tinggi keharmonisan alam, manusia, dan Sang Pencipta.',
    funFact: 'Falsafah ini menjadi dasar tata ruang sumbu filosofis kota Yogyakarta sejak 1755 oleh Sultan Hamengku Buwono I.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'kalender': {
    type: 'page',
    sectionName: 'Agenda Budaya Kasultanan 2025',
    image: '/assets/images/mascot_official.jpg',
    badge: 'Kurator Agenda Keraton',
    headline: 'Jadwal Upacara & Seni 2025',
    message: 'Ini dia agenda upacara sakral Keraton & pentas seni budaya Jogja! Silakan klik salah satu tanggal atau gunakan filter kategori warna di atas tabel ya, Lur!',
    funFact: 'Upacara Grebeg diselenggarakan 3 kali setahun: Grebeg Syawal (Idul Fitri), Grebeg Maulud (Maulid Nabi), dan Grebeg Besar (Idul Adha).',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'jurnal': {
    type: 'page',
    sectionName: 'Panduan Adab & Esai Budaya',
    image: '/assets/images/mascot_faq.jpg',
    badge: 'Pemandu Tata Krama',
    headline: 'Etika Bertamu & Pantangan Busana',
    message: 'Sebelum berkunjung ke Keraton dan cagar budaya sakral, pahami adab andhap asor dan tata cara berpakaian sopan yang benar di panduan ini, Lur.',
    funFact: 'Di kawasan Keraton Yogyakarta dilarang mengenakan motif batik Parang Rusak Barong yang dikhususkan bagi Sri Sultan.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'storybook': {
    type: 'page',
    sectionName: 'Eksplorasi Destinasi Pusaka',
    image: '/assets/images/mascot_destinations.jpg',
    badge: 'Pemandu Destinasi Ikonik',
    headline: 'Jelajahi Sejarah & Galeri Pusaka',
    message: 'Selamat datang di lembar cerita destinasi! Nikmati narasi sejarah otentik, foto sudut terbaik, rute GPS, dan ulasan sesama pelancong.',
    funFact: 'Setiap sudut arsitektur Keraton dan Tamansari memiliki filosofi dan fungsi pertahanan yang sangat cerdik.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'kuliner': {
    type: 'page',
    sectionName: 'Radar GPS Kuliner Legendaris',
    image: '/assets/images/mascot_packages.jpg',
    badge: 'Kurator Cita Rasa Jogja',
    headline: 'Sensasi Kuliner Otentik DIY',
    message: 'Wah, aroma sedapnya tercium! Gunakan radar GPS ini untuk menemukan warung kuliner legendaris terdekat dalam radius 5–10 KM.',
    funFact: 'Kopi Joss disajikan dengan arang panas membara yang bermanfaat mengikat zat asam dan menghangatkan lambung.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'paspor': {
    type: 'page',
    sectionName: 'Paspor Budaya & Lencana',
    image: '/assets/images/mascot_packages.jpg',
    badge: 'Koleksi Petualangan',
    headline: 'Kumpulkan Stempel & Lencana!',
    message: 'Buka paspor ini saat berkunjung ke cagar budaya untuk mengklaim stempel kehadiran dan membuka lencana penjelajah sejati!',
    funFact: 'Tersedia 15+ lencana budaya unik dari tingkat Abdi Dalem Muda hingga Warga Kehormatan Mataram.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },
  'peta': {
    type: 'page',
    sectionName: 'Peta Budaya & Cagar Wisata',
    image: '/assets/images/mascot_destinations.jpg',
    badge: 'Peta Interaktif DIY',
    headline: 'Navigasi 5 Wilayah Yogyakarta',
    message: 'Pantau sebaran cagar budaya, candi, keraton, dan sentra kerajinan di Kota Jogja, Sleman, Bantul, Kulon Progo, dan Gunungkidul.',
    funFact: 'Yogyakarta membentang dari puncak Gunung Merapi di utara hingga Samudra Hindia di selatan.',
    ctaText: 'Ke Beranda',
    actionTarget: 'home'
  },

  // ── HOMEPAGE SECTIONS (EXCEPT SECTION 1 - HERO) ──
  'about-section': {
    type: 'section',
    sectionNumber: 2,
    totalSections: 7,
    sectionName: 'Filosofi & Nilai Luhur Jogja',
    image: '/assets/images/mascot_jogja.jpg',
    badge: 'Sugeng Rawuh!',
    headline: 'Kenali Jiwa & Filosofi Jogja',
    message: 'Monggo dipirsani lur! Ini adalah akar filosofi Hamemayu Hayuning Bawana dan 4 pilar pusaka Mataram.',
    funFact: 'Sumbu Filosofis Jogja kini resmi diakui UNESCO sebagai Warisan Budaya Dunia!',
    ctaText: 'Lihat Destinasi',
    actionTarget: 'destinations-section'
  },
  'destinations-section': {
    type: 'section',
    sectionNumber: 3,
    totalSections: 7,
    sectionName: 'Destinasi Ikonik Pilihan',
    image: '/assets/images/mascot_destinations.jpg',
    badge: 'Ayo Intip Poros Filosofis!',
    headline: '4 Destinasi Pusaka Wajib Dikunjungi',
    message: 'Lihat teropong saya, lur! Dari Keraton, Tamansari, Malioboro hingga Gunung Merapi terhubung dalam satu garis kosmologis sakral.',
    funFact: 'Garis imajiner Kraton membentang lurus 6 km dari Panggung Krapyak hingga Tugu Pal Putih.',
    ctaText: 'Lihat Paket Wisata',
    actionTarget: 'packages'
  },
  'packages': {
    type: 'section',
    sectionNumber: 4,
    totalSections: 7,
    sectionName: 'Ekspedisi Budaya & Kuliner',
    image: '/assets/images/mascot_packages.jpg',
    badge: 'Rekomendasi Mantap!',
    headline: 'Paket Jelajah & Cita Rasa Otentik',
    message: 'Saya bawakan besek oleh-oleh dan kuliner khas! Semua paket di sini sudah terkurasi lengkap dengan pemandu bersertifikasi.',
    funFact: 'Gudeg Wijilan dimasak dengan kayu bakar selama 24 jam untuk cita rasa kering yang tahan lama!',
    ctaText: 'Cek Rujukan Resmi',
    actionTarget: 'official-sources'
  },
  'official-sources': {
    type: 'section',
    sectionNumber: 5,
    totalSections: 7,
    sectionName: 'Legalitas & Rujukan Resmi',
    image: '/assets/images/mascot_official.jpg',
    badge: 'Terverifikasi Resmi',
    headline: 'Data Valid dari Keraton & UNESCO',
    message: 'Pegang piagam resmi ini, lur! Seluruh data sejarah, paugeran, dan agenda upacara kami rujuk langsung dari sumber berwenang.',
    funFact: 'Kawedanan Radya Kartiyasa adalah divisi resmi Keraton yang mengelola arsip dan naskah kuno manuskrip Jawa.',
    ctaText: 'Tanya Pemandu',
    actionTarget: 'faq-section'
  },
  'faq-section': {
    type: 'section',
    sectionNumber: 6,
    totalSections: 7,
    sectionName: 'Panduan & Tanya Jawab',
    image: '/assets/images/mascot_faq.jpg',
    badge: 'Punya Pertanyaan, Lur?',
    headline: 'Jawaban & Tips Praktis Bertamu',
    message: 'Lampu ide saya menyala! Ada pertanyaan seputar tiket, adab pakaian batik, atau waktu terbaik nonton upacara adat? Semua ada jawabannya di sini.',
    funFact: 'Di area Keraton dilarang memakai motif batik Parang Rusak Barong yang dikhususkan bagi Sri Sultan.',
    ctaText: 'Lihat Cerita Wisata',
    actionTarget: 'stories-section'
  },
  'stories-section': {
    type: 'section',
    sectionNumber: 7,
    totalSections: 7,
    sectionName: 'Momen Cerita Budaya',
    image: '/assets/images/mascot_stories.jpg',
    badge: 'Abadikan Momenmu!',
    headline: 'Bagikan Kenangan di Tanah Mataram',
    message: 'Kamera saya siap jepret! Ayo simpan momen terindahmu saat berkunjung ke Yogyakarta dan jadilah bagian dari pelestari budaya.',
    funFact: 'Lebih dari 10.000 wisatawan telah membagikan cerita dan stempel paspor budayanya di Hamemayu!',
    ctaText: 'Mulai Petualangan',
    actionTarget: 'cta-section'
  },
  'cta-section': {
    type: 'section',
    sectionNumber: 7,
    totalSections: 7,
    sectionName: 'Mulai Petualanganmu',
    image: '/assets/images/mascot_stories.jpg',
    badge: 'Sampai Jumpa di Pelataran!',
    headline: 'Siap Menjelajahi Keagungan Jogja?',
    message: 'Maturnuwun sudah berkelana bersama Jojo! Klik tombol di bawah untuk pesan tur atau simpan paspor budayamu sekarang.',
    funFact: 'Semboyan Jogja Berhati Nyaman senantiasa menyambut kehadiran Anda dengan kehangatan khas masyarakat Jawa.',
    ctaText: 'Kembali ke Atas',
    actionTarget: 'about-section'
  }
};

const ORDERED_SECTIONS = [
  'about-section',
  'destinations-section',
  'packages',
  'official-sources',
  'faq-section',
  'stories-section',
  'cta-section'
];

export default function MascotTourGuide({ currentView = 'home', selectedPlace, onNavigateSection }) {
  const [activeKey, setActiveKey] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [showHintToast, setShowHintToast] = useState(false);
  const [transitionBurst, setTransitionBurst] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const toastTimeoutRef = useRef(null);
  const prevKeyRef = useRef(null);
  const containerRef = useRef(null);

  // Sound effect
  const playTransitionSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  };

  // Trigger transition burst and gentle toast hint when key changes
  const triggerTransition = (newKey) => {
    if (newKey !== activeKey) {
      setTransitionBurst(true);
      setTimeout(() => setTransitionBurst(false), 900);
      playTransitionSound();
      prevKeyRef.current = activeKey;
      setActiveKey(newKey);

      // Show brief gentle toast hint (3.5s) if speech bubble is not open
      if (!isBubbleVisible) {
        setShowHintToast(true);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setShowHintToast(false);
        }, 3500);
      }
    }
  };

  // Click outside to collapse speech bubble so it never obstructs reading
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsBubbleVisible(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsBubbleVisible(false);
      }
    };

    if (isBubbleVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBubbleVisible]);

  // Clean up toast timeout
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Effect: Page-level tracking OR Homepage scroll-level tracking
  useEffect(() => {
    // 1. If currently on a dedicated page (tentang, kalender, jurnal, storybook, kuliner, paspor, peta)
    if (currentView && currentView !== 'home') {
      triggerTransition(currentView);
      return;
    }

    // 2. If currently on homepage, listen to scroll across sections 2-7
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById('hero-section');
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom + scrollY : window.innerHeight * 0.7;

      // Section 1 (Hero) -> HIDE MASCOT
      if (scrollY < heroBottom - 180) {
        if (activeKey !== null) {
          setActiveKey(null);
        }
        return;
      }

      // Check which section is in viewport
      let currentInView = null;
      let minDistance = Infinity;

      ORDERED_SECTIONS.forEach((secId) => {
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 3 - window.innerHeight / 2);
          if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.15) {
            if (dist < minDistance) {
              minDistance = dist;
              currentInView = secId;
            }
          }
        }
      });

      // Default to about-section if past hero
      const targetSec = currentInView || 'about-section';
      triggerTransition(targetSec);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, activeKey, soundEnabled]);

  const handleActionClick = (target) => {
    if (target === 'home') {
      if (onNavigateSection) onNavigateSection('about-section');
      return;
    }
    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (onNavigateSection) {
      onNavigateSection(target);
    }
  };

  // If in Section 1 (Hero) or no valid key, hide mascot
  if (!activeKey || !MASCOT_CONFIG[activeKey]) {
    return null;
  }

  const currentConfig = MASCOT_CONFIG[activeKey];
  const isSection = currentConfig.type === 'section';

  return (
    <aside
      ref={containerRef}
      aria-label="Pemandu Budaya Jojo"
      className="fixed bottom-3 sm:bottom-5 right-3 sm:right-6 pointer-events-auto select-none font-['Plus_Jakarta_Sans',sans-serif]"
      style={{ zIndex: 900 }}
    >
      <div className="relative flex flex-col items-end">
        {/* ── BURST TRANSITION PARTICLES EFFECT ── */}
        <AnimatePresence>
          {transitionBurst && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute -inset-6 rounded-full border border-amber-400/80 bg-amber-400/10 pointer-events-none z-0"
            >
              <div className="absolute top-1 left-4 text-amber-500 font-extrabold text-[10px]">✨</div>
              <div className="absolute bottom-2 left-1 text-amber-600 font-extrabold text-[10px]">✦</div>
              <div className="absolute top-2 right-2 text-amber-500 font-extrabold text-[10px]">✨</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INTERACTIVE REDESIGNED GUIDE POPOVER CARD ── */}
        <AnimatePresence mode="wait">
          {isBubbleVisible && (
            <motion.div
              key={`speech-bubble-${activeKey}`}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="mb-2.5 w-[295px] sm:w-[335px] max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_16px_45px_rgba(45,24,12,0.18)] border border-[#E8DFC9] text-[#2d180c] relative z-10"
            >
              {/* Header Bar - Redesigned luxury cultural banner */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#E8DFC9]/70">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8c532b]" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8c532b] font-['Outfit']">
                    Jojo si Pemandu Budaya
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded-md text-neutral-400 hover:text-[#8c532b] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                    title={soundEnabled ? 'Matikan Suara Transisi' : 'Aktifkan Suara Gamelan'}
                    aria-label="Toggle Sound"
                  >
                    {soundEnabled ? <Volume2 size={13} className="text-[#8c532b]" /> : <VolumeX size={13} />}
                  </button>

                  {/* Close Bubble */}
                  <button
                    type="button"
                    onClick={() => setIsBubbleVisible(false)}
                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                    title="Tutup Panduan"
                    aria-label="Tutup"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Progress/Location Badge */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[#786154] mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#FAF6EE] text-[#8c532b] border border-[#E8DFC9]">
                  {isSection ? `Bagian ${currentConfig.sectionNumber} dari ${currentConfig.totalSections}` : currentConfig.badge}
                </span>
                <span className="truncate max-w-[160px] text-right font-medium text-neutral-500">
                  {currentConfig.sectionName}
                </span>
              </div>

              {/* Headline & Friendly Message */}
              <div className="space-y-1 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-extrabold text-[#2d180c] font-['Outfit']">
                  <Sparkles size={13} className="text-amber-500 shrink-0" />
                  <span className="leading-snug">{currentConfig.headline}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed m-0 font-normal">
                  {currentConfig.message}
                </p>
              </div>

              {/* Cultural Fun Fact Box */}
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFC9]/80 text-[10.5px] sm:text-[11px] text-[#786154] flex items-start gap-1.5">
                <span className="font-bold text-[#8c532b] shrink-0">💡 Info Budaya:</span>
                <span className="leading-relaxed text-neutral-700">{currentConfig.funFact}</span>
              </div>

              {/* Action Footer (Previous ChevronUp & ChevronDown completely removed) */}
              <div className="mt-3 pt-2.5 border-t border-[#E8DFC9]/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsBubbleVisible(false)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-800 font-medium transition-colors cursor-pointer"
                >
                  Sembunyikan
                </button>

                <button
                  type="button"
                  onClick={() => handleActionClick(currentConfig.actionTarget)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8c532b] hover:bg-[#704222] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer"
                >
                  <span>{currentConfig.ctaText}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── COMPACT, NON-OBSTRUCTIVE FLOATING TRIGGER DOCK (PILL) ── */}
        <div className="relative flex items-center gap-2">
          {/* Gentle Floating Hint Toast (auto disappears in 3.5s when section changes) */}
          <AnimatePresence>
            {showHintToast && !isBubbleVisible && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: 12, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                onClick={() => {
                  setIsBubbleVisible(true);
                  setShowHintToast(false);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#8c532b] border border-[#E8DFC9] shadow-md hover:bg-[#FAF6EE] text-[11px] font-semibold cursor-pointer transition-transform hover:scale-105"
                title="Klik untuk membuka pesan Jojo"
              >
                <Sparkles size={12} className="text-amber-500" />
                <span className="truncate max-w-[170px]">{currentConfig.headline}</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Floating Pill Trigger */}
          <motion.button
            type="button"
            onClick={() => {
              setIsBubbleVisible(!isBubbleVisible);
              setShowHintToast(false);
              if (!isBubbleVisible) playTransitionSound();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`group flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full transition-all duration-200 shadow-md border cursor-pointer ${
              isBubbleVisible
                ? 'bg-[#8c532b] text-white border-amber-600/60 shadow-[0_6px_20px_rgba(140,83,43,0.35)]'
                : 'bg-white/95 backdrop-blur-md text-[#2d180c] border-[#E8DFC9] hover:bg-[#FAF6EE] hover:border-[#D5C2A5]'
            }`}
            title={isBubbleVisible ? 'Tutup Jojo' : 'Buka Jojo • Pemandu Budaya'}
            aria-label="Jojo Pemandu Budaya"
          >
            {/* Mini Circular Disc */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-amber-500/50 bg-[#FAF6EE] shrink-0 shadow-2xs">
              <img
                src={currentConfig.image}
                alt={`Jojo - ${currentConfig.sectionName}`}
                className="w-full h-full object-cover object-top select-none"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>

            {/* Compact Text Badge */}
            <div className="flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className={`text-[11px] font-bold font-['Outfit'] ${isBubbleVisible ? 'text-white' : 'text-[#2d180c]'}`}>
                  Jojo
                </span>
                <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-full ${
                  isBubbleVisible ? 'bg-white/20 text-white' : 'bg-[#F5EEDC] text-[#8c532b]'
                }`}>
                  Pemandu
                </span>
              </div>
              <span className={`text-[9.5px] font-medium truncate max-w-[95px] sm:max-w-[130px] ${
                isBubbleVisible ? 'text-amber-100' : 'text-neutral-500'
              }`}>
                {currentConfig.sectionName}
              </span>
            </div>

            {/* Sparkle Icon */}
            <Sparkles
              size={13}
              className={`shrink-0 transition-transform group-hover:rotate-12 ${
                isBubbleVisible ? 'text-amber-200' : 'text-amber-500'
              }`}
            />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
