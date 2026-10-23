import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  MapPin,
  Radio,
  BookOpen,
  CheckCircle2,
  Database,
  Sliders,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Footer from './Footer';

// =========================================================================
// DATA: 5 FITUR UTAMA HAMEMAYU (Expanding Horizontal Louvers - Non-Card)
// Visual must instantly communicate what the feature is before reading!
// Set of 5 UNIQUE photos - NO REPETITION!
// =========================================================================
const HAMEMAYU_FEATURES_LOUVER = [
  {
    id: 'radar-kuliner',
    badge: 'Radar Kuliner',
    title: 'Radar Kuliner Terverifikasi & Tarif Transparan',
    tagline: 'Transparansi daftar menu resmi: cita rasa otentik dengan kepastian harga wajar.',
    image: '/assets/images/jogja_gudeg.jpg',
    desc: 'Menghubungkan posisi GPS perangkat Anda dengan kurasi destinasi kuliner legendaris terdekat (radius 5–10 km). Dilengkapi informasi jarak presisi serta transparansi daftar harga menu resmi guna melindungi hak konsumen dan mewujudkan kenyamanan berwisata.'
  },
  {
    id: 'kalender-kasultanan',
    badge: 'Kalender Tradisi',
    title: 'Kalender Upacara Adat Kasultanan',
    tagline: 'Rujukan primer agenda Hajad Dalem & prosesi sakral Karaton Ngayogyakarta.',
    image: '/assets/images/real_bregada_keraton.jpg',
    desc: 'Sentralisasi jadwal resmi pelaksanaan upacara Grebeg, Sekaten, dan Labuhan dari Karaton Ngayogyakarta Hadiningrat. Menyajikan tanggal penanggalan Masehi, kalender Jawa Sultan Agungan, titik kumpul masyarakat, serta panduan tata susila saat menghadiri prosesi.'
  },
  {
    id: 'peta-cagar',
    badge: 'Peta Cagar Budaya',
    title: 'Peta Interaktif 5 Wilayah Cagar Budaya DIY',
    tagline: 'Eksplorasi spasial Kawasan Cagar Budaya & Warisan Dunia UNESCO.',
    image: '/assets/images/jogja_prambanan.jpg',
    desc: 'Peta digital interaktif berbasis koordinat presisi yang memetakan Kawasan Sumbu Filosofis UNESCO, kompleks percandian purbakala, pesanggrahan bersejarah, hingga bentang alam pesisir selatan dengan rute terintegrasi ke navigasi digital.'
  },
  {
    id: 'jurnal-adab',
    badge: 'Panduan Tata Krama',
    title: 'Jurnal Tata Krama & Adab Busana Keraton',
    tagline: 'Pedoman etika kesantunan bertamu & pemahaman motif batik larangan.',
    image: '/assets/images/real_tari_srimanganti.jpg',
    desc: 'Panduan tata busana kepatutan saat memasuki kawasan sakral keraton dan makam raja Mataram, pemahaman mendalam mengenai filosofi motif batik larangan kasultanan, serta pembekalan kosakata bahasa Jawa krama halus sehari-hari.'
  },
  {
    id: 'paspor-budaya',
    badge: 'Paspor Penjelajah',
    title: 'Paspor Budaya & Lencana Penjelajah Tradisi',
    tagline: 'Buku saku digital rekam jejak apresiasi warisan cagar budaya.',
    image: '/assets/images/real_ramayana_stage.jpg',
    desc: 'Buku saku digital interaktif untuk mendokumentasikan jejak penjelajahan situs cagar budaya Anda di Yogyakarta, mengapresiasi pencapaian melalui koleksi lencana tradisi, serta merencanakan rute eksplorasi budaya secara terstruktur.'
  }
];

// =========================================================================
// DATA: SUMBER DATA RESMI & VERIFIKASI (Verifiable Sources)
// Photos clearly visualize each institution - NO DUPLICATES!
// =========================================================================
const DATA_SOURCES = [
  {
    sourceName: 'Kagungan Dalem Karaton Ngayogyakarta Hadiningrat',
    shortTitle: 'Keraton & Tamansari',
    authority: 'Tepas Dwarapura & Kawedanan Hageng Punakawan',
    image: '/assets/images/jogja_tamansari.jpg',
    photoLabel: 'Situs Tamansari & Keraton Mataram',
    verifiedData: [
      'Paugeran resmi dan jadwal upacara Hajad Dalem (Grebeg, Sekaten, dan Labuhan).',
      'Sistem penanggalan Jawa Sultan Agungan (Tahun Jawa, Windu, dan Wuku).',
      'Filosofi Sumbu Filosofis serta tata laku busana adat dan motif batik larangan.'
    ]
  },
  {
    sourceName: 'Balai Pelestarian Kebudayaan & Pengelola Prambanan',
    shortTitle: 'Candi Prambanan & Sambisari',
    authority: 'Kementerian Kebudayaan & Unit Warisan Dunia UNESCO',
    image: '/assets/images/jogja_prambanan.jpg',
    photoLabel: 'Kompleks Warisan Dunia Candi Prambanan',
    verifiedData: [
      'Inventarisasi zona cagar budaya dan pelestarian candi Hindu-Buddha Prambanan.',
      'Sinkronisasi jadwal pementasan Sendratari Ramayana dan reservasi panggung terbuka resmi.',
      'Panduan jalur zonasi inti dan penyangga warisan cagar budaya dunia UNESCO.'
    ]
  },
  {
    sourceName: 'Dinas Kebudayaan (Kundha Kabudayan) & Dinas Pariwisata DIY',
    shortTitle: 'Cagar Budaya Ratu Boko',
    authority: 'Pemerintah Daerah Daerah Istimewa Yogyakarta',
    image: '/assets/images/jogja_ratuboko.jpg',
    photoLabel: 'Kawasan Cagar Budaya Ratu Boko & Tebing Breksi',
    verifiedData: [
      'Inventaris cagar budaya terdaftar dan kawasan warisan dunia UNESCO.',
      'Direktori festival budaya daerah dan agenda kesenian tahunan resmi.',
      'Regulasi ketertiban, pelestarian, dan keselamatan kawasan cagar wisata sejarah.'
    ]
  },
  {
    sourceName: 'Riset Lapangan & Verifikasi Faktual Komunitas',
    shortTitle: 'Lorong Pusaka Kotagede',
    authority: 'Tim Riset Hamemayu, Paguyuban Kuliner & Pegiat Budaya Lokal',
    image: '/assets/images/jogja_kotagede.jpg',
    photoLabel: 'Pusaka Kotagede & Sentra Tradisi',
    verifiedData: [
      'Verifikasi langsung daftar menu fisik guna memastikan transparansi tarif bagi wisatawan.',
      'Validasi titik koordinat GPS riil menggunakan pencocokan satelit lokasi.',
      'Konfirmasi berkala dengan pengelola cagar budaya, juru kunci, dan pelaku tradisi.'
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
    image: '/assets/images/jogja_malioboro.jpg',
    visualDesc: 'Pusat Kuliner Malioboro',
    tip: 'Akses menu "Kuliner" dan berikan izin penentu lokasi pada perangkat Anda. Hamemayu akan menghitung jarak meter secara presisi menggunakan formula Haversine untuk menampilkan destinasi kuliner legendaris terdekat dengan kepastian daftar menu dan tarif yang transparan.'
  },
  {
    action: 'Selaraskan Rencana Perjalanan dengan Kalender Upacara Adat',
    target: 'Kalender Tradisi',
    image: '/assets/images/real_gunungan_grebeg.jpg',
    visualDesc: 'Kirab Gunungan Grebeg',
    tip: 'Pastikan waktu kunjungan Anda selaras dengan agenda kebudayaan daerah. Periksa tab "Kalender" untuk mengetahui jadwal pasti pelaksanaan Grebeg, Sekaten, maupun Sendratari Ramayana bulan purnama sebelum menetapkan tanggal perjalanan.'
  },
  {
    action: 'Pahami Ketentuan Busana dan Etika Sebelum Mengunjungi Situs Sakral',
    target: 'Panduan Adab',
    image: '/assets/images/jogja_batik.jpg',
    visualDesc: 'Batik Tulis Tradisional',
    tip: 'Sebelum melangkah ke kawasan Keraton, Tamansari, atau makam raja-raja, luangkan waktu membaca Jurnal Adab untuk memastikan busana Anda memenuhi standar kepatutan dan tidak mengenakan motif batik larangan kasultanan.'
  },
  {
    action: 'Manfaatkan Integrasi Navigasi Presisi Menuju Destinasi',
    target: 'Peta Cagar',
    image: '/assets/images/jogja_tugu.jpg',
    visualDesc: 'Tugu Pal Putih',
    tip: 'Setiap cagar budaya dan destinasi kuliner dilengkapi tombol terintegrasi ke Google Maps. Klik tombol tersebut untuk membuka panduan navigasi rute tercepat secara langsung dari posisi Anda.'
  }
];

// =========================================================================
// DATA: PRINSIP UTAMA HAMEMAYU (No numbers - pure typography & values)
// =========================================================================
const CORE_PRINCIPLES = [
  {
    title: 'Independensi Kurasi (Bebas Sponsor Komersial)',
    desc: 'Hamemayu beroperasi secara independen tanpa menerima imbalan promosi berbayar, titipan sponsor terselubung, maupun ulasan komersial dari tempat usaha. Setiap rujukan murni didasarkan pada keaslian nilai historis, mutu sajian, dan kepuasan publik.'
  },
  {
    title: 'Penghormatan terhadap Paugeran & Martabat Budaya',
    desc: 'Seluruh materi informasi diselaraskan dengan paugeran Kasultanan Ngayogyakarta Hadiningrat, mengedepankan edukasi kepatutan dan rasa hormat terhadap ruang sakral tanpa mengeksploitasi tradisi sebagai komoditas semata.'
  },
  {
    title: 'Integritas Informasi & Transparansi Data Publik',
    desc: 'Kami menjunjung tinggi keakuratan data secara faktual: kepastian kisaran tarif menu resmi, jadwal prosesi adat yang terverifikasi, serta panduan praktis yang dapat dipertanggungjawabkan demi kenyamanan wisatawan dan keharmonisan masyarakat lokal.'
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
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
  const [activeSourceIndex, setActiveSourceIndex] = React.useState(0);
  const [activeTipIndex, setActiveTipIndex] = React.useState(0);
  const containerRef = useRef(null);

  // Reset scroll when opened
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = 0;
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
          className="web-section-100vh min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto pt-24 sm:pt-28 pb-6 box-border relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 max-h-[82vh]">
            {/* Left Column: Narrative & Values */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EE] text-[#8c532b] border border-[#E8DFC9] text-xs font-semibold w-fit">
                <Sparkles size={13} className="text-[#8c532b]" />
                <span>Filosofi &amp; Nilai Luhur</span>
              </div>

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
                    <Sparkles size={14} />
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
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-200 text-[10px] font-mono font-semibold border border-amber-200/30 w-fit">
                    <span>Sumbu Filosofis UNESCO</span>
                  </div>
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
          <div className="w-full flex justify-center pt-2">
            <button
              type="button"
              onClick={() => scrollToSection('section-layanan')}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-[#8c532b] transition-colors cursor-pointer py-1"
            >
              <span>Telusuri Layanan &amp; Fitur</span>
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2 (100VH): LAYANAN & FITUR UNGGULAN
            Bilah Tirai Panorama (Expanding Louvers - NO NUMBERS, DISTINCT PHOTOS)
            ========================================================================= */}
        <section
          id="section-layanan"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-neutral-200/80 pb-2.5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c532b] block">
                Layanan Utama Platform
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0 mt-0.5">
                Layanan &amp; Fitur Unggulan Hamemayu
              </h3>
            </div>
            <p className="text-xs text-neutral-500 m-0">
              Arahkan kursor atau pilih bilah instrumen untuk menelaah fungsi setiap layanan budaya.
            </p>
          </div>

          {/* Panoramic Expanding Feature Louvers (NO NUMBERS ON COLLAPSED RIBBONS) */}
          <div className="relative w-full flex-1 max-h-[66vh] min-h-[300px] rounded-3xl overflow-hidden border border-neutral-300 shadow-sm bg-neutral-900 flex flex-col md:flex-row my-3">
            {HAMEMAYU_FEATURES_LOUVER.map((feature, index) => {
              const isActive = activeFeatureIndex === index;

              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeatureIndex(index)}
                  onMouseEnter={() => setActiveFeatureIndex(index)}
                  className={`relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden border-b md:border-b-0 md:border-r border-white/15 last:border-none ${
                    isActive
                      ? 'md:flex-[4] flex-[3]'
                      : 'md:flex-[1] flex-[1] hover:brightness-110'
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? 'scale-100' : 'scale-110 brightness-75'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15 pointer-events-none" />

                  {/* Collapsed Ribbon Tag (NO NUMBERS - JUST THE SERVICE TITLE) */}
                  {!isActive && (
                    <div className="absolute inset-0 flex md:flex-col items-center justify-center p-4 text-white z-10">
                      <span className="md:-rotate-90 md:origin-center md:whitespace-nowrap text-xs font-bold font-['Outfit'] tracking-wider uppercase text-neutral-200">
                        {feature.badge}
                      </span>
                    </div>
                  )}

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end text-white z-20 pointer-events-none"
                      >
                        <div className="max-w-xl space-y-2">
                          <h4 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit'] m-0 leading-tight">
                            {feature.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed m-0 font-normal line-clamp-3 sm:line-clamp-none">
                            {feature.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Scroll Hint */}
          <div className="w-full flex justify-center pt-1">
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
            SECTION 3 (100VH): DAPAT DATA DARI MANA SAJA?
            Dossier Sumber Data Sahih (Tamansari, Ratu Boko, Kotagede - NO NUMBERS)
            ========================================================================= */}
        <section
          id="section-sumber-data"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-neutral-200/80 pb-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200 mb-1">
                <Database size={13} className="text-[#8c532b]" />
                <span>Akuntabilitas Informasi &amp; Rujukan Resmi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
                Transparansi dan Rujukan Resmi Sumber Data
              </h3>
            </div>
            <p className="text-xs text-neutral-500 m-0 max-w-md">
              Pilih institusi pada register di bawah untuk menelaah dokumen rujukan dan ruang lingkup verifikasi faktual.
            </p>
          </div>

          {/* VARIATIVE COMPONENT: Split Archival Register & Live Provenance Stage (Non-card!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 max-h-[66vh] min-h-[300px] my-3 items-stretch">
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
              {/* Perfectly Proportioned, 100% Clean Photo Frame */}
              <div className="relative h-48 sm:h-56 lg:h-64 w-full bg-neutral-900 shrink-0 overflow-hidden">
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
              </div>

              {/* Verified Points Certificate below the clean photo */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-2.5 bg-[#FAF6EE]/30">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider block">
                      {DATA_SOURCES[activeSourceIndex].photoLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#1C1917] font-['Outfit'] m-0">
                      {DATA_SOURCES[activeSourceIndex].sourceName}
                    </h4>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium shrink-0 ml-2">
                    Rujukan 0{activeSourceIndex + 1} / 0{DATA_SOURCES.length}
                  </span>
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

          {/* Scroll Hint */}
          <div className="w-full flex justify-center pt-1">
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
          className="web-section-100vh min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-neutral-200/80 pb-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FAF6EE] text-[#8c532b] text-xs font-semibold border border-[#E8DFC9] mb-1">
                <Sliders size={13} className="text-[#8c532b]" />
                <span>Petunjuk Praktis Penggunaan</span>
              </div>
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
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-neutral-300'}`} />
                  <span className="truncate">{tip.target}</span>
                </button>
              );
            })}
          </div>

          {/* VARIATIVE COMPONENT: Dynamic Split Spotlight Stage (Non-card!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 max-h-[58vh] min-h-[280px] items-stretch my-2">
            {/* Left: Cinematic Authentic Photo Stage (100% Clean) */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm relative">
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
            </div>

            {/* Right: Detailed Action Guidance Panel */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] text-[#8c532b] text-xs font-semibold border border-[#E8DFC9] w-fit">
                  <span>Langkah Rekomendasi Wisatawan</span>
                </div>
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

          {/* Scroll Hint */}
          <div className="w-full flex justify-center pt-1">
            <button
              type="button"
              onClick={() => scrollToSection('section-prinsip')}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-[#8c532b] transition-colors cursor-pointer py-1"
            >
              <span>Telusuri Prinsip &amp; Akses Layanan</span>
              <ChevronDown size={14} className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5 (100VH): TIGA PRINSIP POKOK & AKSES LANGSUNG LAYANAN
            NO NUMBERS - Clean typography, icons, and CTA access buttons
            ========================================================================= */}
        <section
          id="section-prinsip"
          className="web-section-100vh min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto pt-16 pb-6 box-border relative overflow-hidden"
        >
          <div className="text-center max-w-2xl mx-auto space-y-1 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c532b] block">
              Prinsip &amp; Komitmen Integritas
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
              Piagam Komitmen Layanan Hamemayu
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed m-0">
              Komitmen etika yang senantiasa kami junjung tinggi dalam menyajikan informasi kebudayaan dan cagar sejarah.
            </p>
          </div>

          {/* VARIATIVE COMPONENT: Triad Manifesto Charter (Continuous with Hairline Dividers - No repetitive white card boxes!) */}
          <div className="rounded-2xl bg-white border border-neutral-200 shadow-2xs p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200/90 gap-4 md:gap-0 my-2">
            {CORE_PRINCIPLES.map((pr) => (
              <div
                key={pr.title}
                className="md:px-5 first:pl-0 last:pr-0 space-y-2 pt-2 md:pt-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FAF6EE] text-[#8c532b] flex items-center justify-center shrink-0 border border-[#E8DFC9]">
                    <ShieldCheck size={14} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] font-['Outfit'] m-0 leading-snug">
                    {pr.title}
                  </h4>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed m-0 font-normal">
                  {pr.desc}
                </p>
              </div>
            ))}
          </div>

          {/* VARIATIVE COMPONENT: Executive Floating Action Launch Dock */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] border border-[#E8DFC9] flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
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

              {onOpenMap && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMap();
                  }}
                  className="py-2 px-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <MapPin size={13} className="text-[#8c532b]" />
                  <span>Peta Cagar Budaya</span>
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

          <div className="text-center pt-2">
            <p className="text-[10px] text-neutral-400 font-mono m-0">
              Hamemayu • Merawat Keaslian Budaya, Keadilan Informasi, dan Etika Kesantunan Yogyakarta
            </p>
          </div>
        </section>

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
