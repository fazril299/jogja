import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Compass,
  ArrowRight,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { CULTURAL_EVENTS } from '../data/culturalEventsData';
import { CULTURAL_PLACES } from '../data/culturalData';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Months that contain official cultural events in the dataset
const ACTIVE_EVENT_MONTH_INDICES = [2, 4, 5, 6, 7, 8, 9]; // Mar, Mei, Jun, Jul, Ags, Sep, Okt

const CATEGORIES = [
  'Semua Kategori',
  'Upacara Keraton',
  'Pertunjukan Seni',
  'Festival Rakyat',
  'Pameran Seni'
];

const DISTRICTS = [
  'Semua Wilayah',
  'Kota Yogyakarta',
  'Sleman',
  'Bantul'
];

export default function KalenderAcaraPage({ isOpen, onClose, onSelectPlace }) {
  // Calendar state
  const [realToday] = useState(() => new Date());
  const [activeYear, setActiveYear] = useState(() => new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState(() => {
    const curMonth = new Date().getMonth();
    return ACTIVE_EVENT_MONTH_INDICES.includes(curMonth) ? curMonth : 2; // Default to Maret
  });
  const [selectedDay, setSelectedDay] = useState(18); // Default to iconic event date (Labuhan / Grebeg)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedDistrict, setSelectedDistrict] = useState('Semua Wilayah');

  // Interactive modal & copy state
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Month list with event counts for current year
  const eventMonths = useMemo(() => {
    return ACTIVE_EVENT_MONTH_INDICES.map((mIdx) => {
      const count = CULTURAL_EVENTS.filter((ev) => ev.monthIndex === mIdx).length;
      return {
        index: mIdx,
        name: MONTH_NAMES[mIdx],
        count
      };
    });
  }, []);

  // Calendar cells matrix (7 columns x N weeks)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(activeYear, activeMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

    const cells = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        month: activeMonth === 0 ? 11 : activeMonth - 1,
        year: activeMonth === 0 ? activeYear - 1 : activeYear,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: activeMonth,
        year: activeYear,
        isCurrentMonth: true
      });
    }

    // Next month padding to complete 7-day row
    const remainingCells = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        day: i,
        month: activeMonth === 11 ? 0 : activeMonth + 1,
        year: activeMonth === 11 ? activeYear + 1 : activeYear,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return cells;
  }, [activeYear, activeMonth]);

  // Map events to date keys
  const eventsByDateKey = useMemo(() => {
    const map = {};
    calendarCells.forEach((cell) => {
      const key = `${cell.year}-${cell.month}-${cell.day}`;
      if (!map[key]) {
        const matches = CULTURAL_EVENTS.filter((ev) => {
          const matchDate = ev.monthIndex === cell.month && parseInt(ev.dayDate, 10) === cell.day;
          const matchCat = selectedCategory === 'Semua Kategori' || ev.category === selectedCategory;
          const matchDist =
            selectedDistrict === 'Semua Wilayah' ||
            (ev.district && ev.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
          const q = searchQuery.trim().toLowerCase();
          const matchQuery =
            !q ||
            ev.name.toLowerCase().includes(q) ||
            ev.location.toLowerCase().includes(q) ||
            ev.category.toLowerCase().includes(q) ||
            ev.jawaCalendar.toLowerCase().includes(q) ||
            ev.shortDesc.toLowerCase().includes(q);

          return matchDate && matchCat && matchDist && matchQuery;
        }).map((ev) => ({
          ...ev,
          year: String(cell.year),
          dateFull: `${ev.dayDate} ${ev.monthName} ${cell.year} • ${ev.time}`
        }));
        map[key] = matches;
      }
    });
    return map;
  }, [calendarCells, selectedCategory, selectedDistrict, searchQuery]);

  // Events in the active month
  const activeMonthEvents = useMemo(() => {
    return CULTURAL_EVENTS.filter((ev) => {
      const matchMonth = ev.monthIndex === activeMonth;
      const matchCat = selectedCategory === 'Semua Kategori' || ev.category === selectedCategory;
      const matchDist =
        selectedDistrict === 'Semua Wilayah' ||
        (ev.district && ev.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ev.name.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.jawaCalendar.toLowerCase().includes(q) ||
        ev.shortDesc.toLowerCase().includes(q);

      return matchMonth && matchCat && matchDist && matchQuery;
    }).map((ev) => ({
      ...ev,
      year: String(activeYear),
      dateFull: `${ev.dayDate} ${ev.monthName} ${activeYear} • ${ev.time}`
    }));
  }, [activeYear, activeMonth, selectedCategory, selectedDistrict, searchQuery]);

  // Selected date events
  const selectedDateKey = `${activeYear}-${activeMonth}-${selectedDay}`;
  const selectedDayEvents = eventsByDateKey[selectedDateKey] || [];

  // Navigation handlers
  const handlePrevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear((y) => y - 1);
    } else {
      setActiveMonth((m) => m - 1);
    }
    const targetMonth = activeMonth === 0 ? 11 : activeMonth - 1;
    const firstEv = CULTURAL_EVENTS.find((ev) => ev.monthIndex === targetMonth);
    setSelectedDay(firstEv ? parseInt(firstEv.dayDate, 10) : 1);
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear((y) => y + 1);
    } else {
      setActiveMonth((m) => m + 1);
    }
    const targetMonth = activeMonth === 11 ? 0 : activeMonth + 1;
    const firstEv = CULTURAL_EVENTS.find((ev) => ev.monthIndex === targetMonth);
    setSelectedDay(firstEv ? parseInt(firstEv.dayDate, 10) : 1);
  };

  const handleSelectMonth = (monthIdx) => {
    setActiveMonth(monthIdx);
    const firstEv = CULTURAL_EVENTS.find((ev) => ev.monthIndex === monthIdx);
    setSelectedDay(firstEv ? parseInt(firstEv.dayDate, 10) : 1);
  };

  const handleGoToToday = () => {
    const now = new Date();
    setActiveYear(now.getFullYear());
    setActiveMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  const handleCellClick = (cell) => {
    if (cell.isPrevMonth) {
      if (activeMonth === 0) {
        setActiveMonth(11);
        setActiveYear((y) => y - 1);
      } else {
        setActiveMonth((m) => m - 1);
      }
    } else if (cell.isNextMonth) {
      if (activeMonth === 11) {
        setActiveMonth(0);
        setActiveYear((y) => y + 1);
      } else {
        setActiveMonth((m) => m + 1);
      }
    }
    setSelectedDay(cell.day);
  };

  const handleCopySchedule = (ev) => {
    const text = `[Agenda Budaya Yogyakarta]\n${ev.name}\nTanggal: ${ev.dayDate} ${ev.monthName} ${ev.year || activeYear} (${ev.jawaCalendar})\nWaktu: ${ev.time}\nLokasi: ${ev.location} (${ev.district})\nAdab & Tata Krama: ${ev.tips}\nSumber: ${ev.source}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Find associated cultural place for deep exploration
  const getAssociatedPlace = (ev) => {
    if (!ev) return null;
    if (ev.id.includes('merapi')) {
      return CULTURAL_PLACES.find((p) => p.id === 'merapi-kaliurang');
    }
    if (ev.id.includes('prambanan') || ev.id.includes('ramayana')) {
      return CULTURAL_PLACES.find((p) => p.id === 'prambanan-ratuboko');
    }
    if (ev.id.includes('grebeg') || ev.id.includes('sekaten') || ev.id.includes('keraton') || ev.id.includes('tapa-bisu') || ev.id.includes('jamasan')) {
      return CULTURAL_PLACES.find((p) => p.id === 'keraton-yogyakarta');
    }
    if (ev.id.includes('batik')) {
      return CULTURAL_PLACES.find((p) => p.id === 'kotagede') || CULTURAL_PLACES[0];
    }
    return CULTURAL_PLACES[0];
  };

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
            1. MINIMALIST TOP APP BAR (Ultra-clean, No Clutter)
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
              Kalender Budaya Jogja
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Halaman Kalender"
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </header>

        {/* =========================================================================
            2. HERO BANNER: UPACARA ADAT & TRADISI KASULTANAN (Photographic Editorial)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2">
          <div className="relative overflow-hidden rounded-3xl min-h-[200px] sm:min-h-[260px] md:min-h-[280px] flex flex-col justify-end p-6 sm:p-10 border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-neutral-900">
            {/* Authentic Upacara Adat Kirab Grebeg Prajurit Photo */}
            <img
              src="/assets/images/real_bregada_gunungan.jpg"
              alt="Upacara Adat Kirab Grebeg Prajurit Keraton Yogyakarta"
              className="absolute inset-0 w-full h-full object-cover object-center scale-100"
            />
            {/* Soft Dark Gradient Overlay for optimal readability while keeping photo vivid and natural */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Typography Content */}
            <div className="relative z-10 max-w-2xl space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block">
                Upacara &amp; Tradisi Kasultanan
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] m-0 leading-tight">
                Kalender Upacara &amp; Tradisi Jogja
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl m-0 leading-relaxed font-normal">
                Jadwal prosesi upacara adat sakral, kirab gunungan grebeg, dan agenda perayaan seni budaya Kraton Ngayogyakarta Hadiningrat.
              </p>
            </div>

            {/* Subtle photo caption tag on bottom right */}
            <div className="absolute bottom-4 right-5 hidden sm:flex items-center gap-1.5 text-[11px] text-white/80 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <span>Kirab Grebeg Prajurit &amp; Gunungan Keraton</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. SEARCH & FILTER STRIP
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari prosesi upacara (misal: Sekaten, Grebeg, Ramayana, Labuhan)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-neutral-900 text-xs placeholder:text-neutral-400 focus:outline-none focus:border-[#8c532b] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter size={13} className="text-[#8c532b] ml-1 mr-0.5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 focus:outline-none focus:border-[#8c532b] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 focus:outline-none focus:border-[#8c532b] cursor-pointer"
                >
                  {DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CLEAN PAPAN KALENDER (Interactive Calendar + Day Inspector)
            ========================================================================= */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
          {/* Month Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 shrink-0 pr-1">
              Bulan Acara:
            </span>
            {eventMonths.map((m) => {
              const isActive = activeMonth === m.index;
              return (
                <button
                  key={m.index}
                  type="button"
                  onClick={() => handleSelectMonth(m.index)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 inline-flex items-center gap-2 border active:scale-95 ${
                    isActive
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
                  }`}
                >
                  <span>{m.name}</span>
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold inline-flex items-center justify-center ${
                      isActive
                        ? 'bg-[#8c532b] text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {m.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2-Column Responsive Layout: Left Calendar Grid / Right Agenda Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN: Clean Minimalist Calendar Grid ── */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
              {/* Calendar Navigation Header */}
              <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Bulan Sebelumnya"
                    className="w-9 h-9 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="px-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0 leading-tight">
                      {MONTH_NAMES[activeMonth]} {activeYear}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Bulan Berikutnya"
                    className="w-9 h-9 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToToday}
                    className="ml-2 px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-black text-xs font-semibold transition-all cursor-pointer active:scale-95 border border-neutral-200"
                    title="Kembali ke Hari Ini"
                  >
                    Hari Ini
                  </button>
                </div>

                {/* Clean Legend */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8c532b]" />
                    <span className="text-[11px]">Ada Tradisi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    <span className="text-[11px]">Terpilih</span>
                  </div>
                </div>
              </div>

              {/* 7-Days Weekday Header */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                {DAY_NAMES.map((dayName, idx) => (
                  <div
                    key={dayName}
                    className={`text-[11px] font-semibold py-1 uppercase tracking-wider ${
                      idx === 0 ? 'text-rose-500 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Calendar Matrix Cells */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                {calendarCells.map((cell, idx) => {
                  const cellKey = `${cell.year}-${cell.month}-${cell.day}`;
                  const cellEvents = eventsByDateKey[cellKey] || [];
                  const hasEvent = cellEvents.length > 0;
                  const isSelected =
                    cell.isCurrentMonth && cell.day === selectedDay;

                  const isRealToday =
                    cell.isCurrentMonth &&
                    cell.day === realToday.getDate() &&
                    cell.month === realToday.getMonth() &&
                    cell.year === realToday.getFullYear();

                  return (
                    <button
                      key={`${cellKey}-${idx}`}
                      type="button"
                      onClick={() => handleCellClick(cell)}
                      className={`relative aspect-square sm:aspect-auto sm:min-h-[76px] p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between items-start transition-all cursor-pointer border text-left active:scale-[0.98] ${
                        !cell.isCurrentMonth
                          ? 'opacity-25 bg-transparent border-transparent text-neutral-300 pointer-events-none'
                          : isSelected
                          ? 'bg-black text-white border-black font-bold shadow-md z-10'
                          : hasEvent
                          ? 'bg-[#FAF6EE] border-[#E8DFC9] text-[#1C1917] hover:border-[#8c532b] hover:bg-[#F5EEDC]'
                          : 'bg-white border-neutral-100 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-200'
                      }`}
                    >
                      {/* Top Row: Date Number & Dot */}
                      <div className="w-full flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isSelected
                              ? 'text-white font-black'
                              : hasEvent
                              ? 'text-[#8c532b] font-black'
                              : 'text-neutral-800'
                          }`}
                        >
                          {cell.day}
                        </span>

                        {hasEvent && cell.isCurrentMonth && (
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected
                                ? 'bg-[#E5C378]'
                                : 'bg-[#8c532b]'
                            }`}
                          />
                        )}
                      </div>

                      {/* Bottom Row: Micro Status Label */}
                      <div className="w-full mt-auto pt-1">
                        {isRealToday && cell.isCurrentMonth ? (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none inline-block ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            Hari Ini
                          </span>
                        ) : hasEvent && cell.isCurrentMonth ? (
                          <span
                            className={`text-[10px] font-semibold truncate block leading-tight ${
                              isSelected
                                ? 'text-neutral-300'
                                : 'text-[#8c532b]'
                            }`}
                          >
                            {cellEvents.length > 1
                              ? `${cellEvents.length} Acara`
                              : cellEvents[0].category.replace('Upacara ', '')}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Agenda Details for Selected Date ── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Selected Date Card */}
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8c532b] block">
                      Agenda Tanggal Terpilih
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-['Outfit'] m-0 leading-tight mt-0.5">
                      {selectedDay} {MONTH_NAMES[activeMonth]} {activeYear}
                    </h4>
                    {selectedDay === realToday.getDate() &&
                      activeMonth === realToday.getMonth() &&
                      activeYear === realToday.getFullYear() && (
                        <span className="text-[10px] font-semibold text-[#8c532b] bg-[#8c532b]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                          Hari Ini
                        </span>
                      )}
                  </div>

                  {selectedDayEvents.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] text-[#8c532b] text-xs font-bold border border-[#E8DFC9] shrink-0">
                      <Sparkles size={12} className="text-[#8c532b]" />
                      <span>{selectedDayEvents.length} Prosesi</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium shrink-0">
                      Bebas Agenda
                    </span>
                  )}
                </div>

                {/* If selected date has event(s) */}
                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDayEvents.map((ev) => {
                      const associatedPlace = getAssociatedPlace(ev);
                      return (
                        <div
                          key={ev.id}
                          className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/80 p-4 sm:p-5 space-y-4 hover:border-[#8c532b]/50 transition-colors"
                        >
                          {/* Event Image */}
                          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-100">
                            <img
                              src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                              alt={ev.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                                {ev.category}
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 left-3 right-3 text-white">
                              <span className="text-[11px] font-medium text-amber-200 line-clamp-1">
                                {ev.jawaCalendar}
                              </span>
                            </div>
                          </div>

                          {/* Title & Coordinates */}
                          <div>
                            <h5 className="text-base sm:text-lg font-bold text-[#1C1917] leading-snug m-0 font-['Outfit']">
                              {ev.name}
                            </h5>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-neutral-600">
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} className="text-[#8c532b]" />
                                <span>{ev.time}</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} className="text-[#8c532b]" />
                                <span className="line-clamp-1">{ev.location}</span>
                              </span>
                            </div>
                          </div>

                          {/* Short Description */}
                          <p className="text-xs text-neutral-600 leading-relaxed m-0 font-normal">
                            {ev.shortDesc}
                          </p>

                          {/* Action Buttons */}
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveModalEvent(ev)}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer text-center shadow-xs active:scale-95 inline-flex items-center justify-center gap-1.5"
                            >
                              <span>Detail &amp; Adab Adat</span>
                              <ExternalLink size={12} />
                            </button>

                            {associatedPlace && onSelectPlace && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (onClose) onClose();
                                  onSelectPlace(associatedPlace);
                                }}
                                className="p-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold transition-all cursor-pointer active:scale-95 shrink-0 inline-flex items-center gap-1.5"
                                title={`Jelajahi ${associatedPlace.name}`}
                              >
                                <Compass size={14} className="text-[#8c532b]" />
                                <span className="hidden sm:inline">Cagar Budaya</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleCopySchedule(ev)}
                              aria-label="Salin Jadwal"
                              className="p-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-all cursor-pointer active:scale-95 shrink-0"
                              title="Salin Rincian Agenda"
                            >
                              {copiedId === ev.id ? (
                                <Check size={14} className="text-emerald-600" />
                              ) : (
                                <Share2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State with Curated Month Recommendations */
                  <div className="py-6 px-4 text-center space-y-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                    <div className="w-10 h-10 rounded-2xl bg-white text-neutral-500 flex items-center justify-center mx-auto border border-neutral-200">
                      <CalendarIcon size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-neutral-800 m-0">
                        Tidak Ada Prosesi pada Tanggal Ini
                      </p>
                      <p className="text-xs text-neutral-500 m-0 max-w-xs mx-auto leading-relaxed">
                        Pilih tanggal bertitik cokelat pada kalender atau klik salah satu agenda di bawah:
                      </p>
                    </div>

                    {/* Quick Jump to Events in Active Month */}
                    {activeMonthEvents.length > 0 && (
                      <div className="pt-2 text-left space-y-2">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                          Agenda di Bulan {MONTH_NAMES[activeMonth]}:
                        </span>
                        <div className="flex flex-col gap-2">
                          {activeMonthEvents.map((ev) => (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={() => setSelectedDay(parseInt(ev.dayDate, 10))}
                              className="text-left p-3 rounded-xl bg-white hover:bg-[#FAF6EE] border border-neutral-200/80 transition-all cursor-pointer text-xs flex items-center justify-between group active:scale-98"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-bold text-neutral-900 block truncate group-hover:text-[#8c532b]">
                                  {ev.dayDate} {MONTH_NAMES[activeMonth]}: {ev.name}
                                </span>
                                <span className="text-[10px] text-neutral-500 truncate block mt-0.5">
                                  {ev.location} • {ev.time}
                                </span>
                              </div>
                              <ArrowRight size={13} className="text-neutral-400 group-hover:text-[#8c532b] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION: Agenda Upacara & Acara di Bulan Aktif (Visual Photo Cards) ── */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] font-['Outfit'] m-0">
                  Agenda Upacara &amp; Budaya Bulan {MONTH_NAMES[activeMonth]} {activeYear}
                </h3>
                <p className="text-xs text-neutral-500 m-0 mt-0.5">
                  {activeMonthEvents.length > 0
                    ? `Ditemukan ${activeMonthEvents.length} prosesi upacara sakral dan pertunjukan seni di bulan ${MONTH_NAMES[activeMonth]}.`
                    : `Belum ada agenda upacara terdaftar pada bulan ${MONTH_NAMES[activeMonth]}.`}
                </p>
              </div>

              {activeMonthEvents.length > 0 && (
                <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  {activeMonthEvents.length} Prosesi
                </span>
              )}
            </div>

            {activeMonthEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeMonthEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-[#8c532b]/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Ceremony Image Header */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                        <img
                          src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                          alt={ev.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                            {ev.category}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[11px] font-medium text-amber-200 line-clamp-1">
                            {ev.jawaCalendar}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#8c532b]">
                          <CalendarIcon size={13} />
                          <span>
                            {ev.dayDate} {MONTH_NAMES[activeMonth]} {activeYear}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <Clock size={13} className="text-neutral-400" />
                          <span className="text-neutral-600 font-normal">{ev.time}</span>
                        </div>

                        <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#8c532b] transition-colors leading-snug m-0 font-['Outfit'] line-clamp-2">
                          {ev.name}
                        </h4>

                        <div className="flex items-start gap-1.5 text-xs text-neutral-500 pt-0.5">
                          <MapPin size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </div>

                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed m-0 pt-1 font-normal">
                          {ev.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center gap-2 border-t border-neutral-100 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDay(parseInt(ev.dayDate, 10));
                          setActiveModalEvent(ev);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Lihat Detail &amp; Adab</span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedDay(parseInt(ev.dayDate, 10))}
                        className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                        title="Tandai tanggal di kalender"
                      >
                        Pilih Tanggal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200/80">
                <p className="text-xs text-neutral-500 m-0">
                  Tidak ada prosesi upacara yang cocok dengan filter atau kata kunci di bulan ini.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* =========================================================================
            5. CLEAN DETAIL EVENT & TATA KRAMA MODAL
            ========================================================================= */}
        <AnimatePresence>
          {activeModalEvent && (
            <div
              className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveModalEvent(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl border border-neutral-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-neutral-900 overflow-hidden"
              >
                {/* Modal Cover Image Banner */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-950 shrink-0">
                  <img
                    src={activeModalEvent.image || '/assets/images/real_grebeg_prajurit.jpg'}
                    alt={activeModalEvent.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Top Badges & Close Button */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                        {activeModalEvent.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold border border-white/25">
                        <ShieldCheck size={12} />
                        <span>{activeModalEvent.status}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalEvent(null)}
                      className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-md active:scale-95"
                      aria-label="Tutup Detail"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Bottom Header Overlay */}
                  <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#8c532b] text-white text-xs font-bold shadow-xs mb-1.5">
                      <Sparkles size={12} />
                      <span>{activeModalEvent.highlight}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight m-0 font-['Outfit']">
                      {activeModalEvent.name}
                    </h3>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin">
                  {/* Parameter Grid (3 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Schedule */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                        <CalendarIcon size={13} className="text-[#8c532b]" />
                        <span>Jadwal Masehi</span>
                      </div>
                      <div>
                        <strong className="text-neutral-900 text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.dayDate} {activeModalEvent.monthName} {activeModalEvent.year}
                        </strong>
                        <div className="text-[11px] text-neutral-600 mt-0.5 font-medium flex items-center gap-1">
                          <Clock size={11} className="text-neutral-400 shrink-0" />
                          <span>{activeModalEvent.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Javanese Calendar */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                        <Sparkles size={13} className="text-[#8c532b]" />
                        <span>Kalender Jawa</span>
                      </div>
                      <div>
                        <strong className="text-neutral-900 text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.jawaCalendar}
                        </strong>
                        <div className="text-[11px] text-[#8c532b] mt-0.5 font-medium">
                          {activeModalEvent.badge}
                        </div>
                      </div>
                    </div>

                    {/* Region / District */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                        <MapPin size={13} className="text-[#8c532b]" />
                        <span>Wilayah &amp; Posisi</span>
                      </div>
                      <div>
                        <strong className="text-neutral-900 text-xs sm:text-sm block leading-snug">
                          {activeModalEvent.district}
                        </strong>
                        <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                          Daerah Istimewa Yogyakarta
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-neutral-200 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                        Titik Lokasi Utama
                      </span>
                      <strong className="text-neutral-900 text-xs sm:text-sm block leading-snug mt-0.5">
                        {activeModalEvent.location}
                      </strong>
                      <span className="text-[11px] text-neutral-600 block mt-0.5">
                        Kawasan {activeModalEvent.district}, D.I. Yogyakarta
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider m-0">
                      Makna Filosofis &amp; Prosesi Tradisi
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed m-0 font-normal">
                      {activeModalEvent.description}
                    </p>
                  </div>

                  {/* Cultural Etiquette / Tata Krama (Advisory Card) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] border border-[#E8DFC9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#8c532b] text-xs sm:text-sm">
                      <AlertCircle size={15} className="text-[#8c532b] shrink-0" />
                      <span>Adab &amp; Tata Krama Menghadiri Prosesi:</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed m-0 text-xs font-normal">
                      {activeModalEvent.tips}
                    </p>
                    <div className="pt-1 text-[10px] text-neutral-500 font-medium flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                      <span>Patuhi petunjuk Abdi Dalem &amp; petugas demi menjaga kesucian dan kelancaran upacara adat.</span>
                    </div>
                  </div>

                  {/* Attribution Source */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                    <ShieldCheck size={13} className="text-neutral-400 shrink-0" />
                    <span>
                      Rujukan Resmi:{' '}
                      <strong className="text-neutral-800 font-bold">
                        {activeModalEvent.source}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="px-5 sm:px-7 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 z-20">
                  <button
                    type="button"
                    onClick={() => setActiveModalEvent(null)}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    Tutup
                  </button>

                  <div className="flex items-center gap-2.5">
                    {getAssociatedPlace(activeModalEvent) && onSelectPlace && (
                      <button
                        type="button"
                        onClick={() => {
                          const p = getAssociatedPlace(activeModalEvent);
                          setActiveModalEvent(null);
                          if (onClose) onClose();
                          onSelectPlace(p);
                        }}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <Compass size={14} className="text-[#8c532b]" />
                        <span>Kunjungi Cagar Budaya</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopySchedule(activeModalEvent)}
                      className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      {copiedId === activeModalEvent.id ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span>Jadwal Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} />
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
                      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all no-underline shadow-xs cursor-pointer active:scale-95"
                    >
                      <MapPin size={14} className="text-white" />
                      <span>Buka Google Maps</span>
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
