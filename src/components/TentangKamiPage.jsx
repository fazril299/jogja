import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  X,
  Sparkles,
  Calendar,
  MapPin,
  Film,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

// =========================================================================
// DATA: 5 DIMENSI LIPUTAN JOGJAKRAMA (Expanding Horizontal Louver Ribbon - Non-Card)
// =========================================================================
const JOGJAKRAMA_PILLARS_LOUVER = [
  {
    id: 'cagar-budaya',
    badge: 'Fokus 01 • Cagar Budaya',
    title: 'Pelestarian Sumbu Filosofis',
    mission: 'Dokumentasi Warisan Dunia UNESCO',
    image: '/assets/images/jogja_keraton.jpg',
    tagline: 'Mengenalkan makna filosofis di balik setiap gerbang batu, bangsal, dan tugu pusaka.',
    desc: 'JogjaKrama mendokumentasikan situs cagar budaya dari Panggung Krapyak hingga lereng Merapi bukan sekadar sebagai obyek foto, melainkan sebagai ruang hidup bertata ruang kosmologis yang sarat doa para leluhur Mataram.'
  },
  {
    id: 'kuliner-jujur',
    badge: 'Fokus 02 • Radar Kuliner',
    title: 'Perlindungan Harga Jujur',
    mission: 'Menghapus Kekhawatiran Harga "Nuthuk"',
    image: '/assets/images/jogja_gudeg.jpg',
    tagline: 'Memastikan wisatawan menikmati kuliner otentik dengan transparansi menu dan keramahan sejati.',
    desc: 'Banyak pelancong ragu mencicipi warung tradisional karena takut harga dinaikkan sepihak. JogjaKrama mengurasi dapur legendaris dan angkringan rakyat yang konsisten menyajikan rasa otentik dengan harga wajar dan menu terbuka.'
  },
  {
    id: 'upacara-adat',
    badge: 'Fokus 03 • Kalender Adat',
    title: 'Penjadwalan Upacara Kasultanan',
    mission: 'Rujukan Prosesi Sakral & Grebeg',
    image: '/assets/images/real_bregada_gunungan.jpg',
    tagline: 'Jadwal terverifikasi dari sumber resmi Kasultanan Ngayogyakarta Hadiningrat.',
    desc: 'Upacara adat adalah momentum sakral permohonan keselamatan kosmis. JogjaKrama menyediakan rincian tanggal, jam, titik kumpul, dan adab menghadiri prosesi agar masyarakat dapat menyaksikan tanpa mengganggu kekhidmatan Abdi Dalem.'
  },
  {
    id: 'unggah-ungguh',
    badge: 'Fokus 04 • Tata Krama',
    title: 'Edukasi Unggah-Ungguh & Etika',
    mission: 'Menjadi Tamu yang Dihormati Warga Lokal',
    image: '/assets/images/real_batik_keraton.jpg',
    tagline: 'Panduan tata busana adat, pantangan motif batik keraton, dan adab bertamu santun.',
    desc: 'Yogyakarta dibangun di atas pilar kesopanan (andhap asor). JogjaKrama menyajikan panduan praktis tentang busana yang pantas di tempat sakral, pantangan adat keraton, hingga frasa bahasa Jawa krama halus sehari-hari.'
  },
  {
    id: 'seni-kolosal',
    badge: 'Fokus 05 • Seni Pertunjukan',
    title: 'Panggung Tradisi & Komunitas',
    mission: 'Mendukung Seniman & Ruang Ekspresi',
    image: '/assets/images/real_ramayana_ballet.jpg',
    tagline: 'Menghubungkan generasi muda dengan denyut seni tari, karawitan, dan pergelaran wayang.',
    desc: 'Dari Sendratari Ramayana berlatar Candi Prambanan hingga pementasan uyon-uyon di bangsal keraton, JogjaKrama mempromosikan karya seni adiluhung agar terus diapresiasi lintas generasi.'
  }
];

// =========================================================================
// DATA: LATAR BELAKANG & PROBLEM-SOLVING THREAD (Vertical Axis - Non-Card)
// =========================================================================
const PROBLEM_SOLVING_STEPS = [
  {
    step: '01',
    problem: 'Keresahan Harga Tidak Wajar ("Nuthuk")',
    solution: 'Kurasi Kuliner Terverifikasi & Radar GPS',
    image: '/assets/images/jogja_gudeg.jpg',
    summary: 'Ketakutan akan pedagang yang menaikkan harga sepihak sering kali merusak pengalaman berwisata di Jogja. JogjaKrama hadir dengan prinsip verifikasi langsung ke lapangan, mencatat kisaran harga riil, dan hanya merekomendasikan tempat makan yang jujur dan transparan.'
  },
  {
    step: '02',
    problem: 'Pelanggaran Adab di Kawasan Sakral Tanpa Sengaja',
    solution: 'Panduan Praktis Tata Busana & Etika Bertamu',
    image: '/assets/images/jogja_keraton.jpg',
    summary: 'Banyak pengunjung yang melanggar aturan di Keraton atau upacara adat bukan karena berniat buruk, melainkan murni karena tidak tahu. JogjaKrama merangkum etika berpakaian sopan, pantangan motif batik larangan, dan tata krama berfoto dengan abdi dalem secara gamblang.'
  },
  {
    step: '03',
    problem: 'Informasi Budaya yang Tersebar & Sering Tidak Akurat',
    solution: 'Sentralisasi Data Resmi Kasultanan & Disbud DIY',
    image: '/assets/images/real_gunungan_grebeg.jpg',
    summary: 'Jadwal prosesi upacara adat seperti Grebeg, Sekaten, dan Labuhan sering simpang siur di media sosial. JogjaKrama menyatukan data resmi kalender Masehi dan kalender Sultan Agungan agar pengunjung mendapatkan jadwal yang pasti dan terpercaya.'
  }
];

// =========================================================================
// DATA: PRINSIP OPERASIONAL & NILAI INTEGRITAS (Pure Typography Columns)
// =========================================================================
const CORE_COMMITMENTS = [
  {
    number: '01',
    title: 'Tanpa Endorsement Berbayar (100% Objektif)',
    desc: 'JogjaKrama tidak menerima bayaran atau sponsor berbayar dari tempat makan maupun destinasi. Setiap rekomendasi murni didasarkan pada kualitas rasa, sejarah otentik, dan kejujuran pelayanan.'
  },
  {
    number: '02',
    title: 'Penghormatan Penuh pada Paugeran Adat',
    desc: 'Kami menyelaraskan seluruh materi dengan paugeran Kasultanan Ngayogyakarta Hadiningrat dan berkonsultasi dengan para pemerhati budaya lokal agar kesakralan tradisi tidak terdistorsi menjadi komersialisasi murahan.'
  },
  {
    number: '03',
    title: 'Akses Terbuka & Ramah Semua Kalangan',
    desc: 'Platform ini dirancang sebagai sarana edukasi publik terbuka bagi siapa saja — baik wisatawan domestik, mancanegara, mahasiswa rantau, maupun warga lokal yang ingin mendalami keistimewaan kotanya sendiri.'
  }
];

// =========================================================================
// DATA: FILM REEL CITRA DOKUMENTASI JOGJAKRAMA (Non-Card Panoramic Filmstrip)
// =========================================================================
const FIELD_DOCUMENTATION_REEL = [
  {
    code: 'JK-DOC-01',
    label: 'Dokumentasi Upacara',
    title: 'Kirab Ageng Prajurit Kasultanan',
    location: 'Pagelaran Keraton Yogyakarta',
    image: '/assets/images/real_bregada_gunungan.jpg'
  },
  {
    code: 'JK-DOC-02',
    label: 'Riset Kuliner',
    title: 'Dapur Anglo & Resep Turun Temurun',
    location: 'Sentra Kuliner Wijilan & Jejeran',
    image: '/assets/images/jogja_gudeg.jpg'
  },
  {
    code: 'JK-DOC-03',
    label: 'Pusaka & Kriya',
    title: 'Canting, Malam & Makna Motif Larangan',
    location: 'Batik Tradisional Giri Sekar',
    image: '/assets/images/real_batik_keraton.jpg'
  },
  {
    code: 'JK-DOC-04',
    label: 'Seni Pertunjukan',
    title: 'Sendratari Klasik Gagrak Yogyakarta',
    location: 'Panggung Terbuka Prambanan',
    image: '/assets/images/real_ramayana_ballet.jpg'
  },
  {
    code: 'JK-DOC-05',
    label: 'Ruang Publik',
    title: 'Etika Bertamu & Keseharian Warga',
    location: 'Kawasan Malioboro & Kotagede',
    image: '/assets/images/jogja_malioboro.jpg'
  }
];

export default function TentangKamiPage({
  isOpen,
  onClose,
  onOpenKalender,
  onOpenMap,
  onOpenJurnal
}) {
  const [activeLouverIndex, setActiveLouverIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[99995] bg-[#FBF9F5] text-[#1C1917] overflow-y-auto"
        style={{
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
        }}
      >
        {/* =========================================================================
            1. MINIMALIST TOP APP BAR (Consistent with KalenderAcaraPage & Landing Page)
            ========================================================================= */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={14} className="text-neutral-700" />
              <span>Kembali</span>
            </button>

            <div className="h-4 w-px bg-neutral-300 hidden sm:block" />

            <h1 className="text-sm sm:text-base font-bold text-[#1C1917] tracking-tight m-0 font-['Outfit']">
              Mengenal JogjaKrama
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Halaman Tentang"
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </header>

        {/* =========================================================================
            2. HERO SECTION: DEFINISI & IDENTITAS JOGJAKRAMA (Pure Typography & Mission)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-8 sm:pb-12">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EE] text-[#8c532b] border border-[#E8DFC9] text-xs font-semibold">
              <Sparkles size={13} className="text-[#8c532b]" />
              <span>Tentang Platform JogjaKrama</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1917] font-['Outfit'] tracking-tight leading-[1.12] m-0">
              Panduan Independen Kebudayaan, Cagar Warisan &amp; Kuliner Otentik Yogyakarta.
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl font-normal pt-1 m-0">
              <strong className="text-neutral-900 font-bold">JogjaKrama</strong> adalah inisiatif kurasi independen yang didedikasikan untuk membantu pelancong menikmati keistimewaan Yogyakarta secara beretika, transparan, dan mendalam — bebas dari kekhawatiran harga tak wajar (*anti-nuthuk*) serta kaya akan pemahaman tata krama (*unggah-ungguh*).
            </p>

            {/* Etymology / Filosofi Nama JogjaKrama (Non-card split banner) */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c532b] font-bold block">
                  Filosofi Penamaan
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
                  Dari Kata <span className="text-[#8c532b]">"Jogja"</span> &amp; <span className="text-[#8c532b]">"Krama"</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0 font-normal pt-1">
                  Menyatukan tanah keistimewaan (*Jogja*) dengan nilai kesopanan berbahasa serta beradab luhur (*Krama Alus / Tata Krama*).
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 shrink-0 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[#1C1917] font-['Outfit']">
                    Jogja
                  </span>
                  <span className="text-xs text-neutral-500 font-medium block">
                    Ruang Hidup Mataram
                  </span>
                </div>
                <span className="text-xl text-[#8c532b] font-light">+</span>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[#8c532b] font-['Outfit']">
                    Krama
                  </span>
                  <span className="text-xs text-neutral-500 font-medium block">
                    Tata Krama &amp; Etika Bertamu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. NON-CARD COMPONENT 1: EXPANDING LOUVER CURTAIN (5 Cakupan Liputan JogjaKrama)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c532b] block">
                Ruang Lingkup Platform
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0 mt-0.5">
                Lima Fokus Pelayanan JogjaKrama untuk Pengunjung
              </h3>
            </div>
            <p className="text-xs text-neutral-500 m-0">
              Arahkan kursor atau sentuh bilah untuk membaca fokus kurasi kami.
            </p>
          </div>

          {/* Panoramic Louver Ribbon (Single continuous expanding canvas, NOT separate cards) */}
          <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-neutral-300 shadow-sm bg-neutral-900 flex flex-col md:flex-row">
            {JOGJAKRAMA_PILLARS_LOUVER.map((pillar, index) => {
              const isActive = activeLouverIndex === index;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setActiveLouverIndex(index)}
                  onMouseEnter={() => setActiveLouverIndex(index)}
                  className={`relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden border-b md:border-b-0 md:border-r border-white/15 last:border-none ${
                    isActive
                      ? 'md:flex-[4] flex-[3]'
                      : 'md:flex-[1] flex-[1] hover:brightness-110'
                  }`}
                >
                  {/* Background Photo */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? 'scale-100' : 'scale-110 brightness-75'
                    }`}
                  />

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

                  {/* Collapsed Ribbon Tag */}
                  {!isActive && (
                    <div className="absolute inset-0 flex md:flex-col items-center justify-between p-4 text-white z-10">
                      <span className="text-[11px] font-mono text-amber-300 font-bold">
                        0{index + 1}
                      </span>
                      <span className="md:-rotate-90 md:origin-center md:whitespace-nowrap text-xs font-bold font-['Outfit'] tracking-wider uppercase text-neutral-200">
                        {pillar.title}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                  )}

                  {/* Expanded Active Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-20 pointer-events-none"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-amber-200 border border-white/20">
                            {pillar.badge}
                          </span>
                          <span className="text-[11px] text-white/80 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-md hidden sm:inline-block">
                            {pillar.mission}
                          </span>
                        </div>

                        {/* Bottom Narrative */}
                        <div className="max-w-xl space-y-2.5">
                          <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest block font-mono">
                            {pillar.tagline}
                          </span>
                          <h4 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] m-0 leading-tight">
                            {pillar.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed m-0 font-normal line-clamp-3 sm:line-clamp-none">
                            {pillar.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            4. NON-CARD COMPONENT 2: MENGAPA JOGJAKRAMA HADIR (Problem & Solution Thread)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c532b] block">
              Misi Nyata Kami
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
              Tiga Masalah Nyata yang Diselesaikan JogjaKrama
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0">
              Bukan sekadar buku petunjuk biasa. JogjaKrama dibangun untuk menyelesaikan keresahan wisatawan dan melindungi martabat budaya lokal.
            </p>
          </div>

          {/* Continuous Spatial Problem-Solution Axis (Non-card layout with circular aperture lens) */}
          <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-[17px] sm:before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#8c532b] before:via-neutral-300 before:to-[#8c532b]">
            {PROBLEM_SOLVING_STEPS.map((step) => (
              <div key={step.step} className="relative flex flex-col md:flex-row md:items-center gap-6 sm:gap-10">
                {/* Node on Axis */}
                <div className="absolute -left-[24px] sm:-left-[36px] top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#8c532b] flex items-center justify-center text-xs font-mono font-bold text-[#8c532b] shadow-sm z-10">
                  {step.step}
                </div>

                {/* Circular Aperture Lens */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md ring-1 ring-neutral-200">
                  <img
                    src={step.image}
                    alt={step.problem}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                      Solusi #{step.step}
                    </span>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 uppercase tracking-wider">
                      Tantangan: {step.problem}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0 pt-1">
                    Solusi JogjaKrama: <span className="text-[#8c532b]">{step.solution}</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0 font-normal max-w-2xl">
                    {step.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            5. NON-CARD COMPONENT 3: CINEMATIC FIELD DOCUMENTATION REEL (Pita Film Seluloid)
            ========================================================================= */}
        <section className="py-10 sm:py-14 bg-neutral-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-widest">
                <Film size={14} />
                <span>Dokumentasi Lapangan • Arsip Kurasi JogjaKrama</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit'] m-0">
                Bukti Kurasi Otentik Tanpa Rekayasa AI
              </h3>
            </div>
            <p className="text-xs text-neutral-400 m-0 max-w-sm">
              Semua foto, titik koordinat, dan catatan adab dikumpulkan langsung dari peninjauan lapangan dan narasumber terpercaya di Yogyakarta.
            </p>
          </div>

          {/* Letterbox Film Ribbon with Perforations (Non-card strip) */}
          <div className="flex items-center gap-4 px-4 sm:px-8 overflow-x-auto scrollbar-none pb-4 pt-2">
            {FIELD_DOCUMENTATION_REEL.map((item) => (
              <div
                key={item.code}
                className="relative shrink-0 w-[280px] sm:w-[340px] group cursor-pointer"
              >
                <div className="bg-black/90 p-2 sm:p-2.5 rounded-2xl border border-white/15 space-y-2 transition-transform duration-300 group-hover:scale-[1.02]">
                  {/* Sprocket Track */}
                  <div className="flex items-center justify-between px-1 text-[9px] font-mono text-neutral-500">
                    <span>{item.code}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1 rounded-sm bg-neutral-700" />
                      <span className="w-1.5 h-1 rounded-sm bg-neutral-700" />
                      <span className="w-1.5 h-1 rounded-sm bg-neutral-700" />
                    </div>
                    <span>KURASI LAPANGAN</span>
                  </div>

                  {/* Photo Frame */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-200 border border-white/10">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="px-1 pt-1">
                    <h5 className="text-xs sm:text-sm font-bold text-white font-['Outfit'] m-0 truncate group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h5>
                    <span className="text-[11px] text-neutral-400 block truncate mt-0.5">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. PRINSIP KERJA & INTEGRITAS JOGJAKRAMA (Editorial Columns)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 border-t border-neutral-200/80">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8c532b] block">
              Prinsip Integritas
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-['Outfit'] m-0">
              Tiga Komitmen Utama Tim JogjaKrama
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0">
              Pedoman moral yang kami pegang teguh dalam menyajikan setiap informasi kepada publik.
            </p>
          </div>

          {/* 3 Pure Typographic Columns with Hairline Top Borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {CORE_COMMITMENTS.map((comm) => (
              <div key={comm.number} className="space-y-3 pt-4 border-t-2 border-[#8c532b]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#8c532b]">
                    {comm.number}
                  </span>
                  <CheckCircle2 size={15} className="text-[#8c532b]" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#1C1917] font-['Outfit'] m-0">
                  {comm.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0 font-normal">
                  {comm.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. CALL TO ACTION: JELAJAHI FITUR PLATFORM
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-1.5">
              <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider block">
                Mulai Menggunakan JogjaKrama
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0">
                Gunakan Alat Panduan Kami Saat di Yogyakarta
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed m-0 font-normal">
                Pilih fitur yang Anda butuhkan untuk memandu perjalanan budaya Anda secara nyaman dan santun.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenKalender && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenKalender();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Calendar size={14} />
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
                  className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <MapPin size={14} className="text-[#8c532b]" />
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
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen size={14} />
                  <span>Panduan &amp; Adab</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
