import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Search,
  Share2,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { CULTURAL_EVENTS } from '../data/culturalEventsData';

export default function KalenderAcaraPage({ isOpen, onClose, onSelectPlace }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedPeriod, setSelectedPeriod] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  if (!isOpen) return null;

  const categories = ['Semua', 'Upacara Keraton', 'Pertunjukan Seni', 'Festival Rakyat', 'Pameran Seni'];

  const periods = [
    { label: 'Semua Periode', value: 'Semua' },
    { label: 'Maret – April', value: 'mar-apr', months: [2, 3] },
    { label: 'Mei – Juni', value: 'mei-jun', months: [4, 5] },
    { label: 'Juli – Agustus', value: 'jul-agu', months: [6, 7] },
    { label: 'September – Oktober', value: 'sep-okt', months: [8, 9] }
  ];

  const filteredEvents = CULTURAL_EVENTS.filter((ev) => {
    const matchCat = selectedCategory === 'Semua' || ev.category === selectedCategory;

    let matchPeriod = true;
    if (selectedPeriod !== 'Semua') {
      const activeP = periods.find((p) => p.value === selectedPeriod);
      if (activeP && activeP.months) {
        matchPeriod = activeP.months.includes(ev.monthIndex);
      }
    }

    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      ev.name.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.district.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.highlight.toLowerCase().includes(q) ||
      ev.jawaCalendar.toLowerCase().includes(q);

    return matchCat && matchPeriod && matchQuery;
  });

  const handleCopySchedule = (ev) => {
    const text = `[Agenda Acara Jogja]\n${ev.name}\nTanggal: ${ev.dayDate} ${ev.monthName} ${ev.year} (${ev.jawaCalendar})\nWaktu: ${ev.time}\nLokasi: ${ev.location} (${ev.district})\nTata Krama: ${ev.tips}\nSumber: ${ev.source}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99995] bg-[#F8F9FA] overflow-y-auto text-black"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* Hero Section with Upacara Adat Photo Background (Top padded for global floating navbar) */}
        <section className="relative overflow-hidden bg-black text-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 border-b border-neutral-800">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/images/real_bregada_gunungan.jpg"
              alt="Upacara Adat Kirab Grebeg Prajurit Keraton Yogyakarta"
              className="w-full h-full object-cover object-center scale-105 opacity-80"
            />
          </div>
          {/* Modern Cinematic Contrast Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] m-0 max-w-2xl leading-tight">
              Kalender Acara Tradisi Jogja
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-xl m-0 leading-relaxed font-normal">
              Jadwal resmi perayaan upacara adat, prosesi grebeg keraton, dan festival budaya D.I. Yogyakarta 2025–2026.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-neutral-300">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                11 Agenda Terverifikasi
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                Data Resmi Keraton &amp; Dispar DIY
              </span>
            </div>
          </div>
        </section>

        {/* Filter & Controls Section — Premium Editorial */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4 space-y-0">

          {/* ── Search Bar ── full-width, dark glass */}
          <div className="relative w-full mb-6">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari acara, lokasi, atau upacara adat…"
              className="w-full pl-14 pr-12 py-4 rounded-2xl border border-neutral-200 bg-white shadow-sm text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ── Period Selector ── bold tab-strip style */}
          <div className="flex items-center gap-0 border-b border-neutral-200 overflow-x-auto scrollbar-none mb-5">
            {periods.map((p) => {
              const active = selectedPeriod === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedPeriod(p.value)}
                  className={`relative px-5 py-3 text-xs font-extrabold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'text-black'
                      : 'text-neutral-400 hover:text-black'
                  }`}
                  style={{ letterSpacing: '0.08em' }}
                >
                  {p.label}
                  {active && (
                    <motion.div
                      layoutId="period-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Category Chips ── amber accent on active */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 shrink-0 pr-1" style={{ letterSpacing: '0.12em' }}>
              Filter
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              );
            })}

            {/* Results count — inline right side */}
            <span className="ml-auto shrink-0 text-[11px] font-semibold text-neutral-400 whitespace-nowrap">
              {filteredEvents.length} acara ditemukan
            </span>
          </div>

          {/* Clean Grid Cards (Bungee Framer Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredEvents.map((ev) => (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[24px] border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group cursor-pointer"
                onClick={() => setActiveModalEvent(ev)}
              >
                {/* Visual Cover Photo - Clean Full Bleed (No Overlays) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                    alt={ev.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Card Content - Pure Minimalist Typography */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Date Stamp */}
                    <p className="text-[13px] sm:text-[14px] text-neutral-500 font-normal tracking-normal mb-2">
                      {ev.monthName} {ev.dayDate}, {ev.year}
                    </p>

                    {/* Event Headline */}
                    <h3 className="text-lg sm:text-[20px] font-bold text-neutral-950 leading-snug tracking-tight m-0 line-clamp-2 group-hover:text-amber-800 transition-colors">
                      {ev.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-dashed border-neutral-300 p-6 space-y-3">
              <Calendar size={32} className="mx-auto text-neutral-400" />
              <h3 className="text-sm font-extrabold text-black m-0">
                Tidak ada agenda yang cocok dengan filter
              </h3>
              <p className="text-xs text-neutral-600 m-0">
                Coba ubah kata kunci pencarian atau pilih kategori dan periode lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSelectedPeriod('Semua');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Detailed Event Modal (Ultra-sleek, luxury dialog with permanent docked actions) */}
        <AnimatePresence>
          {activeModalEvent && (
            <div
              className="fixed inset-0 z-[100010] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
              onClick={() => setActiveModalEvent(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl border border-neutral-200/90 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-black overflow-hidden"
              >
                {/* Modal Cover Image (Header) */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-950 shrink-0">
                  <img
                    src={activeModalEvent.image || '/assets/images/real_grebeg_prajurit.jpg'}
                    alt={activeModalEvent.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges & Close Button */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        {activeModalEvent.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/25">
                        <ShieldCheck size={12} className="text-white" />
                        <span>{activeModalEvent.status}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalEvent(null)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-md active:scale-95"
                      aria-label="Tutup Detail"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Bottom Header Overlay: Highlight & Title */}
                  <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 mb-1.5">
                      <Sparkles size={12} className="text-white" />
                      <span>{activeModalEvent.highlight}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight m-0 font-['Outfit'] drop-shadow-sm">
                      {activeModalEvent.name}
                    </h3>
                  </div>
                </div>

                {/* Modal Body (Scrollable with smooth overscroll) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin">
                  {/* Parameter Grid (3 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Schedule */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        <Calendar size={13} className="text-black" />
                        <span>Jadwal Masehi</span>
                      </div>
                      <div>
                        <strong className="text-black text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.dayDate} {activeModalEvent.monthName} {activeModalEvent.year}
                        </strong>
                        <div className="text-[11px] text-neutral-600 mt-0.5 font-medium flex items-center gap-1">
                          <Clock size={11} className="text-neutral-500 shrink-0" />
                          <span>{activeModalEvent.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Javanese Calendar */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        <Sparkles size={13} className="text-black" />
                        <span>Kalender Jawa</span>
                      </div>
                      <div>
                        <strong className="text-black text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.jawaCalendar}
                        </strong>
                        <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                          {activeModalEvent.badge}
                        </div>
                      </div>
                    </div>

                    {/* Region / District */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        <MapPin size={13} className="text-black" />
                        <span>Wilayah &amp; Posisi</span>
                      </div>
                      <div>
                        <strong className="text-black text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.district}
                        </strong>
                        <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                          Daerah Istimewa Yogyakarta
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                        Titik Lokasi Utama
                      </span>
                      <strong className="text-black text-xs sm:text-sm block leading-snug mt-0.5">
                        {activeModalEvent.location}
                      </strong>
                      <span className="text-[11px] text-neutral-600 block mt-0.5">
                        Kawasan {activeModalEvent.district}, D.I. Yogyakarta
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider m-0 flex items-center gap-1.5">
                      <span>Tentang Upacara &amp; Makna Tradisi</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed m-0 font-normal">
                      {activeModalEvent.description}
                    </p>
                  </div>

                  {/* Cultural Etiquette / Tata Krama (Advisory Card) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-950 text-xs sm:text-sm">
                      <AlertCircle size={15} className="text-amber-800 shrink-0" />
                      <span>Tata Krama &amp; Ketentuan Berkunjung:</span>
                    </div>
                    <p className="text-amber-900/90 leading-relaxed m-0 text-xs font-normal">
                      {activeModalEvent.tips}
                    </p>
                    <div className="pt-1 text-[10px] text-amber-800/80 font-medium flex items-center gap-1">
                      <ShieldCheck size={11} className="text-amber-800 shrink-0" />
                      <span>Patuhi arahan abdi dalem / petugas guna menjaga kesucian dan kelancaran upacara adat.</span>
                    </div>
                  </div>

                  {/* Attribution Source */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                    <ShieldCheck size={13} className="text-neutral-500 shrink-0" />
                    <span>Rujukan Data Resmi: <strong className="text-neutral-800 font-bold">{activeModalEvent.source}</strong></span>
                  </div>
                </div>

                {/* Permanent Sticky Action Footer (Never cut off) */}
                <div className="px-5 sm:px-7 py-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 z-20">
                  <button
                    type="button"
                    onClick={() => setActiveModalEvent(null)}
                    className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Tutup
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopySchedule(activeModalEvent)}
                      className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-black text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      {copiedId === activeModalEvent.id ? (
                        <>
                          <Check size={14} className="text-black" />
                          <span>Jadwal Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} className="text-black" />
                          <span>Salin Jadwal</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${activeModalEvent.name} ${activeModalEvent.location} Yogyakarta`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all no-underline shadow-xs cursor-pointer active:scale-95"
                    >
                      <MapPin size={14} className="text-white" />
                      <span>Buka di Peta</span>
                      <ExternalLink size={12} className="text-white/70" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
