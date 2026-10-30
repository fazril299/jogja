import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bot,
  Camera,
  Landmark,
  Calendar,
  MapPin,
  Radio,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Footer from './Footer';


// =========================================================================
// DATA: SUMBER DATA RESMI & VERIFIKASI (Verifiable Sources)
// Photos clearly visualize each institution - NO DUPLICATES!
// =========================================================================
const DATA_SOURCES = [
  {
    sourceName: 'Kagungan Dalem Karaton Ngayogyakarta Hadiningrat',
    shortTitle: 'Karaton Ngayogyakarta',
    authority: 'Tepas Dwarapura & Kawedanan Hageng Punakawan',
    image: '/assets/images/sumber_keraton.jpg',
    photoLabel: 'Upacara Adat Bangsal Kencana Karaton Ngayogyakarta',
    isAiGenerated: true,
    verifiedData: [
      'Paugeran resmi dan jadwal upacara Hajad Dalem (Grebeg, Sekaten, dan Labuhan).',
      'Sistem penanggalan Jawa Sultan Agungan (Tahun Jawa, Windu, dan Wuku).',
      'Filosofi Sumbu Filosofis serta tata laku busana adat dan motif batik larangan.'
    ]
  },
  {
    sourceName: 'Balai Pelestarian Kebudayaan (BPK Wilayah X)',
    shortTitle: 'Balai Pelestarian Kebudayaan',
    authority: 'Kementerian Kebudayaan & Unit Warisan Dunia UNESCO',
    image: '/assets/images/sumber_bpk_prambanan.jpg',
    photoLabel: 'Ekskavasi & Pelestarian Cagar Budaya Candi Prambanan',
    isAiGenerated: true,
    verifiedData: [
      'Inventarisasi zona cagar budaya dan pelestarian candi Hindu-Buddha Prambanan.',
      'Sinkronisasi jadwal pementasan Sendratari Ramayana dan reservasi panggung terbuka resmi.',
      'Panduan jalur zonasi inti dan penyangga warisan cagar budaya dunia UNESCO.'
    ]
  },
  {
    sourceName: 'Dinas Kebudayaan (Kundha Kabudayan) DIY',
    shortTitle: 'Dinas Kebudayaan DIY',
    authority: 'Pemerintah Daerah Daerah Istimewa Yogyakarta',
    image: '/assets/images/sumber_dinas_kebudayaan.jpg',
    photoLabel: 'Kantor Resmi Dinas Kebudayaan DIY (Jl. Cendana No. 11)',
    isAiGenerated: false,
    verifiedData: [
      'Inventarisasi cagar budaya terdaftar, warisan budaya takbenda (WBTb), dan kawasan pusaka.',
      'Standarisasi paugeran upacara adat, tata busana tradisional, dan pelestarian bahasa Jawa.',
      'Regulasi pelindungan dan tata kelola cagar budaya di Daerah Istimewa Yogyakarta.'
    ]
  },
  {
    sourceName: 'Dinas Pariwisata Daerah Istimewa Yogyakarta',
    shortTitle: 'Dinas Pariwisata DIY',
    authority: 'Pemerintah Daerah Daerah Istimewa Yogyakarta',
    image: '/assets/images/sumber_dinas_pariwisata.jpg',
    photoLabel: 'Kantor Resmi Dinas Pariwisata Daerah Istimewa Yogyakarta',
    isAiGenerated: false,
    verifiedData: [
      'Publikasi resmi kalender perhelatan pariwisata daerah (Visiting Jogja Calendar of Events).',
      'Pedoman keamanan, fasilitas, dan etika kunjungan wisatawan di destinasi wisata Yogyakarta.',
      'Sinkronisasi informasi tarif resmi, jam operasional, dan direktori destinasi pariwisata.'
    ]
  }
];

// =========================================================================
// DATA: CARA MENGOPTIMALKAN FITUR
// Completely fresh, non-repeating photos visualizing each action!
// =========================================================================
const OPTIMIZATION_TIPS = [
  {
    action: 'Aktifkan Layanan Lokasi untuk Rekomendasi Kuliner Terdekat',
    target: 'Radar Kuliner',
    image: '/assets/images/feature_radar_kuliner.jpg',
    visualDesc: 'Pusat Kuliner Malioboro',
    tip: 'Akses menu "Kuliner" dan berikan izin penentu lokasi pada perangkat Anda. Hamemayu akan menghitung jarak meter secara presisi menggunakan formula Haversine untuk menampilkan destinasi kuliner legendaris terdekat dengan kepastian daftar menu dan tarif yang transparan.'
  },
  {
    action: 'Selaraskan Rencana Perjalanan dengan Kalender Upacara Adat',
    target: 'Kalender Tradisi',
    image: '/assets/images/feature_kalender_tradisi.jpg',
    visualDesc: 'Kirab Gunungan Grebeg',
    tip: 'Pastikan waktu kunjungan Anda selaras dengan agenda kebudayaan daerah. Periksa tab "Kalender" untuk mengetahui jadwal pasti pelaksanaan Grebeg, Sekaten, maupun Sendratari Ramayana bulan purnama sebelum menetapkan tanggal perjalanan.'
  },
  {
    action: 'Pahami Ketentuan Busana dan Etika Sebelum Mengunjungi Situs Sakral',
    target: 'Panduan Adab',
    image: '/assets/images/feature_panduan_adab.jpg',
    visualDesc: 'Batik Tulis Tradisional',
    tip: 'Sebelum melangkah ke kawasan Keraton, Tamansari, atau makam raja-raja, luangkan waktu membaca Jurnal Adab untuk memastikan busana Anda memenuhi standar kepatutan dan tidak mengenakan motif batik larangan kasultanan.'
  }
];

export default function TentangKamiPage({
  isOpen,
  onClose,
  onOpenKalender,
  onOpenMap,
  onOpenNearMe,
  onOpenJurnal,
  onOpenCultureBook
}) {
  const [activeSourceIndex, setActiveSourceIndex] = React.useState(0);
  const [activeTipIndex, setActiveTipIndex] = React.useState(0);
  const containerRef = useRef(null);

  // Reset scroll when opened & lock document body/html overflow to eliminate double scrollbar
  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [isOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-[#FBF9F5] text-[#1C1917] overflow-y-auto scroll-smooth"
        style={{
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
        }}
      >
        {/* =========================================================================
            SECTION 1 (100VH): FILOSOFI NAMA WEB "HAMEMAYU"
            Foto: Keraton Bangsal Kencono (NO NUMBERS, NO YELLOW BANNER)
            ========================================================================= */}
        <section
          id="section-filosofi"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-24 sm:pt-28 pb-6 box-border relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-2">
            {/* Left Column: Narrative & Values */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] font-['Outfit'] tracking-tight leading-[1.15] m-0">
                Terinspirasi dari Falsafah Luhur: <span className="text-[#8c532b]">Hamemayu Hayuning Bawana.</span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-neutral-600 leading-relaxed max-w-2xl font-normal m-0">
                Nama <strong className="text-neutral-900 font-bold">Hamemayu</strong> berakar dari ajaran adiluhung pendiri Kasultanan Ngayogyakarta Hadiningrat, Sri Sultan Hamengku Buwono I. Konsep luhur <em className="text-neutral-900 font-semibold not-italic">"Hamemayu"</em> bermakna ikhtiar memperindah, merawat, dan memelihara keharmonisan semesta dunia (<em className="text-neutral-900 font-semibold not-italic">Hayuning Bawana</em>) agar senantiasa lestari, tenteram, dan memberi kemaslahatan bagi sesama.
              </p>

              {/* VARIATIVE COMPONENT: Continuous Value Strip Ribbon with Hairline Dividers (Non-card!) */}
              <div className="bg-[#FAF6EE]/90 border border-[#E8DFC9] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8DFC9] gap-3 sm:gap-0 mt-1">
                <div className="sm:px-3 first:pl-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#8c532b]">
                    <Landmark size={14} />
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-['Outfit'] m-0">
                      Harmoni Budaya
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 m-0 leading-snug">
                    Menjaga keluhuran adat dan keselarasan tradisi masyarakat Mataram.
                  </p>
                </div>

                <div className="sm:px-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#8c532b]">
                    <ShieldCheck size={14} />
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-['Outfit'] m-0">
                      Keadilan Informasi
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 m-0 leading-snug">
                    Transparansi tarif resmi kuliner &amp; keaslian cagar budaya.
                  </p>
                </div>

                <div className="sm:px-3 last:pr-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#8c532b]">
                    <BookOpen size={14} />
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-['Outfit'] m-0">
                      Etika Kesantunan
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 m-0 leading-snug">
                    Membekali adab bertamu agar wisatawan senantiasa disambut hangat.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Paduraksa Arch Frame (Variatif!) */}
            <div className="lg:col-span-5 h-full max-h-[380px] sm:max-h-[440px] flex items-center justify-center">
              <div className="relative w-full h-full rounded-t-[100px] rounded-b-3xl overflow-hidden border-2 border-[#E8DFC9] shadow-xl bg-neutral-900 flex flex-col justify-end p-5 sm:p-7">
                <img
                  src="/assets/images/jogja_keraton.jpg"
                  alt="Kagungan Dalem Keraton Ngayogyakarta Hadiningrat"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-1.5 text-white">
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] m-0 leading-snug">
                    Kagungan Dalem Karaton Ngayogyakarta
                  </h3>
                  <p className="text-[11px] text-neutral-200 leading-relaxed m-0 font-normal">
                    Pusat kosmologi kebudayaan yang menginspirasi tata nilai perlindungan tradisi dan transparansi publik platform Hamemayu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="w-full flex justify-center pt-3 pb-2 mt-auto">
            <button
              type="button"
              onClick={() => scrollToSection('section-sumber-data')}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-[#8c532b] transition-colors cursor-pointer py-1"
            >
              <span>Telusuri Sumber Data Resmi</span>
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2 (100VH): DAPAT DATA DARI MANA SAJA?
            Dossier Sumber Data Sahih (Tamansari, Ratu Boko, Kotagede - NO NUMBERS)
            ========================================================================= */}
        <section
          id="section-sumber-data"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-neutral-200/80 pb-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
                Fakta Langsung dari Sumbernya
              </h3>
            </div>
            <p className="text-xs text-neutral-500 m-0 max-w-md">
              Pilih institusi di bawah untuk melihat rujukan resmi dan data yang telah diverifikasi.
            </p>
          </div>

          {/* VARIATIVE COMPONENT: Split Archival Register & Live Provenance Stage (Non-card!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[300px] my-3 items-stretch">
            {/* Left Column (5 Cols): 4 Institutional Destination Registers (Tightly spaced) */}
            <div className="lg:col-span-5 flex flex-col justify-start gap-2 sm:gap-2.5">
              {DATA_SOURCES.map((src, idx) => {
                const isSelected = activeSourceIndex === idx;
                return (
                  <button
                    key={src.sourceName}
                    type="button"
                    onClick={() => setActiveSourceIndex(idx)}
                    onMouseEnter={() => setActiveSourceIndex(idx)}
                    className={`cursor-pointer p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 border flex items-center justify-between text-left w-full ${
                      isSelected
                        ? 'bg-[#FAF6EE] border-[#8c532b] shadow-xs ring-1 ring-[#8c532b]/30'
                        : 'bg-white hover:bg-neutral-50/80 border-neutral-200/80'
                    }`}
                  >
                    <div className="pr-3 space-y-0.5 min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isSelected ? 'text-[#8c532b]' : 'text-neutral-500'
                      }`}>
                        {src.shortTitle}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] font-['Outfit'] m-0 leading-snug truncate">
                        {src.sourceName}
                      </h4>
                    </div>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-[#8c532b] text-white' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      <ChevronRight size={15} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column (7 Cols): Clean Photographic Showcase Stage (100% Clean: Zero Badges, Zero Text Overlay) */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-2xs flex flex-col">
              {/* Perfectly Proportioned Photo Frame with AI / Dokumen Badge */}
              <div className="relative h-44 sm:h-52 lg:h-56 w-full bg-neutral-900 shrink-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={DATA_SOURCES[activeSourceIndex].image}
                    src={DATA_SOURCES[activeSourceIndex].image}
                    alt={DATA_SOURCES[activeSourceIndex].photoLabel}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center select-none"
                  />
                </AnimatePresence>

                {/* Penanda Transparansi Foto: AI vs Dokumentasi Asli */}
                <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                  {DATA_SOURCES[activeSourceIndex].isAiGenerated ? (
                    <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 border border-white/20 shadow-xs">
                      <Bot size={12} className="text-white/85" />
                      <span>Visual Dibuat dengan Bantuan AI</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-neutral-200 text-[10px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-xs">
                      <Camera size={11} className="text-emerald-400" />
                      <span>Foto Dokumentasi Asli</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Points Certificate below the clean photo */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-center space-y-2 bg-[#FAF6EE]/30">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider block">
                      {DATA_SOURCES[activeSourceIndex].photoLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#1C1917] font-['Outfit'] m-0">
                      {DATA_SOURCES[activeSourceIndex].sourceName}
                    </h4>
                  </div>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider block">
                    Data yang Diverifikasi &amp; Disinkronkan:
                  </span>
                  <ul className="space-y-1.5 m-0 list-none p-0">
                    {DATA_SOURCES[activeSourceIndex].verifiedData.map((dItem, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 font-normal leading-relaxed">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{dItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Transparansi AI */}
          <p className="text-[10.5px] text-neutral-400 m-0 text-center">
            * Sebagian visual pendukung dibuat menggunakan bantuan kecerdasan buatan (AI) untuk representasi ilustrasi, dengan data yang diverifikasi dari rujukan resmi.
          </p>

          {/* Scroll Hint */}
          <div className="w-full flex justify-center pt-2 pb-1 mt-auto">
            <button
              type="button"
              onClick={() => scrollToSection('section-panduan')}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-[#8c532b] transition-colors cursor-pointer py-1"
            >
              <span>Telusuri Panduan Penggunaan</span>
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4 (100VH): PANDUAN PENGGUNAAN LAYANAN
            Photos: Malioboro, Gunungan Grebeg, Batik Sepuh, Tugu (NO NUMBERS)
            ========================================================================= */}
        <section
          id="section-panduan"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-neutral-200/80 pb-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
                Alur Panduan Penggunaan Layanan Hamemayu
              </h3>
            </div>
            <p className="text-xs text-neutral-500 m-0">
              Pilih tahapan di bawah untuk membuka panduan langkah demi langkah.
            </p>
          </div>

          {/* VARIATIVE COMPONENT: Horizontal Route Node Stepper */}
          <div className="flex items-center justify-between gap-2 my-2 py-1.5 border-b border-neutral-200/60">
            {OPTIMIZATION_TIPS.map((tip, idx) => {
              const isSelected = activeTipIndex === idx;
              return (
                <button
                  key={tip.target}
                  type="button"
                  onClick={() => setActiveTipIndex(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer border text-xs font-semibold ${
                    isSelected
                      ? 'bg-[#8c532b] text-white border-[#8c532b] shadow-xs'
                      : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200/80'
                  }`}
                >
                  <span className="truncate">{tip.target}</span>
                </button>
              );
            })}
          </div>

          {/* VARIATIVE COMPONENT: Dynamic Split Spotlight Stage (Non-card!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[300px] my-3 items-stretch">
            {/* Left: Cinematic Authentic Photo Stage */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm relative min-h-[260px] sm:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={OPTIMIZATION_TIPS[activeTipIndex].image}
                  src={OPTIMIZATION_TIPS[activeTipIndex].image}
                  alt={OPTIMIZATION_TIPS[activeTipIndex].action}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center select-none"
                />
              </AnimatePresence>
              <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 border border-white/20 shadow-xs">
                  <Bot size={12} className="text-white/85" />
                  <span>Visual Bantuan AI</span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Action Guidance Panel */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-base sm:text-lg font-bold text-[#1C1917] font-['Outfit'] m-0 leading-snug">
                  {OPTIMIZATION_TIPS[activeTipIndex].action}
                </h4>
                <div className="p-4 rounded-xl bg-[#FAF6EE]/80 border-l-4 border-l-[#8c532b] text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {OPTIMIZATION_TIPS[activeTipIndex].tip}
                </div>
              </div>

              {/* Prev / Next Step Navigation Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setActiveTipIndex((prev) => (prev > 0 ? prev - 1 : OPTIMIZATION_TIPS.length - 1))}
                  className="text-xs font-semibold text-neutral-600 hover:text-[#8c532b] inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={15} />
                  <span>Tahap Sebelumnya</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {OPTIMIZATION_TIPS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTipIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeTipIndex === i ? 'w-5 bg-[#8c532b]' : 'w-1.5 bg-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTipIndex((prev) => (prev < OPTIMIZATION_TIPS.length - 1 ? prev + 1 : 0))}
                  className="text-xs font-semibold text-[#8c532b] hover:text-[#724222] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Tahap Berikutnya</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

        </section>


        {/* ACTION LAUNCH DOCK (Tanpa Tombol Peta Cagar Budaya) */}
        <div className="w-full px-4 sm:px-8 max-w-7xl mx-auto my-6 box-border">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] border border-[#E8DFC9] flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center lg:text-left">
              <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider block">
                Jelajahi Yogyakarta Bersama Hamemayu
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#1C1917] font-['Outfit'] m-0">
                Akses Langsung Layanan Utama Hamemayu
              </h4>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              {onOpenNearMe && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNearMe();
                  }}
                  className="py-2 px-3.5 rounded-full bg-[#8c532b] hover:bg-[#724222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Radio size={13} />
                  <span>Radar Kuliner</span>
                </button>
              )}

              {onOpenKalender && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenKalender();
                  }}
                  className="py-2 px-3.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Calendar size={13} />
                  <span>Kalender Upacara</span>
                </button>
              )}

              {onOpenJurnal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenJurnal();
                  }}
                  className="py-2 px-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen size={13} />
                  <span>Panduan Adab</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: INSTITUTIONAL FOOTER (AS REQUESTED: "TAMBAH FOOTER JUGA")
            ========================================================================= */}
        <Footer
          onOpenAboutUs={() => {}}
          onOpenNearMe={() => {
            onClose();
            onOpenNearMe?.();
          }}
          onOpenMap={() => {
            onClose();
            onOpenMap?.();
          }}
          onOpenCultureBook={() => {
            onClose();
            onOpenCultureBook?.();
          }}
          onOpenCultureEvents={() => {
            onClose();
            onOpenKalender?.();
          }}
          onOpenCultureJournals={() => {
            onClose();
            onOpenJurnal?.();
          }}
          onOpenKalenderAcara={() => {
            onClose();
            onOpenKalender?.();
          }}
          onOpenJurnalBudaya={() => {
            onClose();
            onOpenJurnal?.();
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
