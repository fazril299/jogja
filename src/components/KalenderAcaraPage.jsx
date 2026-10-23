import React, { useState, useMemo, useEffect } from 'react';
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
  Filter,
  Bookmark,
  CalendarPlus,
  Compass,
  ArrowRight,
  Info,
  Award
} from 'lucide-react';
import { CULTURAL_EVENTS } from '../data/culturalEventsData';
import { CULTURAL_PLACES } from '../data/culturalData';

// Month names in Indonesian
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

// Weekday abbreviations
const DAY_HEADERS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Master categories matching Jogja cultural palette
const CATEGORY_CONFIG = {
  'Upacara Keraton': {
    colorBg: 'bg-[#8c532b]', // Heritage Terracotta / Soga
    colorText: 'text-white',
    colorBorder: 'border-[#754422]',
    label: 'Upacara Keraton'
  },
  'Pertunjukan Seni': {
    colorBg: 'bg-[#9E1C64]', // Royal Keraton Magenta
    colorText: 'text-white',
    colorBorder: 'border-[#821451]',
    label: 'Pertunjukan Seni'
  },
  'Festival Rakyat': {
    colorBg: 'bg-[#2d5a27]', // Deep Forest Green
    colorText: 'text-white',
    colorBorder: 'border-[#22451d]',
    label: 'Festival Rakyat'
  },
  'Pameran Seni': {
    colorBg: 'bg-[#b45309]', // Warm Amber / Ochre ArtJog
    colorText: 'text-white',
    colorBorder: 'border-[#92400e]',
    label: 'Pameran Seni'
  }
};

const CATEGORIES_LIST = [
  'Upacara Keraton',
  'Pertunjukan Seni',
  'Festival Rakyat',
  'Pameran Seni'
];

const LOCATIONS_LIST = [
  { id: 'Semua', label: 'Semua Wilayah' },
  { id: 'Kota Yogyakarta', label: 'Kota Yogyakarta' },
  { id: 'Sleman', label: 'Kabupaten Sleman' },
  { id: 'Bantul', label: 'Kabupaten Bantul' }
];

export default function KalenderAcaraPage({ isOpen, onClose, onSelectPlace, onPopupChange }) {
  // Calendar time state
  const [activeYear, setActiveYear] = useState(2025);
  const [activeMonth, setActiveMonth] = useState(2); // Default to Maret (Bulan awal tahun agenda budaya)
  const [selectedDay, setSelectedDay] = useState(18);

  // Active view toggle: 'Bulan' | 'Minggu' | 'Hari' | 'Daftar'
  const [viewTab, setViewTab] = useState('Bulan');

  // Filter state in left sidebar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES_LIST);
  const [selectedLocation, setSelectedLocation] = useState('Semua');

  // Real event counts per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES_LIST.forEach((cat) => {
      counts[cat] = CULTURAL_EVENTS.filter((e) => e.category === cat).length;
    });
    return counts;
  }, []);

  // Real event counts per location/district
  const locationCounts = useMemo(() => {
    return {
      Semua: CULTURAL_EVENTS.length,
      'Kota Yogyakarta': CULTURAL_EVENTS.filter(
        (e) =>
          e.district &&
          (e.district.toLowerCase().includes('kota') ||
            e.district.toLowerCase().includes('yogyakarta'))
      ).length,
      Sleman: CULTURAL_EVENTS.filter(
        (e) => e.district && e.district.toLowerCase().includes('sleman')
      ).length,
      Bantul: CULTURAL_EVENTS.filter(
        (e) => e.district && e.district.toLowerCase().includes('bantul')
      ).length
    };
  }, []);

  // Detail Modal state
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [modalTab, setModalTab] = useState('ringkasan');

  const handleOpenModal = (ev) => {
    setModalTab('ringkasan');
    setActiveModalEvent(ev);
    onPopupChange?.(true);
  };

  const handleCloseModal = () => {
    setActiveModalEvent(null);
    onPopupChange?.(false);
  };

  useEffect(() => {
    return () => {
      onPopupChange?.(false);
    };
  }, [onPopupChange]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!activeModalEvent) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalEvent]);

  const handleCopyAddress = (address) => {
    if (!address) return;
    navigator.clipboard?.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getGoogleCalendarUrl = (ev) => {
    if (!ev) return '#';
    const title = encodeURIComponent(ev.name);
    const details = encodeURIComponent(
      `[Agenda Budaya Yogyakarta]\n${ev.name}\n\nMakna & Rangkaian:\n${ev.description}\n\nAdab & Tata Krama:\n${ev.tips}\n\nSumber: ${ev.source}`
    );
    const location = encodeURIComponent(`${ev.location}, ${ev.district}, D.I. Yogyakarta`);
    const year = ev.year || activeYear || 2025;
    const month = String((ev.monthIndex !== undefined ? ev.monthIndex : 2) + 1).padStart(2, '0');
    const day = String(ev.dayDate || '01').padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}/${dateStr}`;
  };

  // Handle category checkbox toggle
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // Master filtered events based on left sidebar filters
  const filteredEvents = useMemo(() => {
    return CULTURAL_EVENTS.filter((ev) => {
      const matchCategory = selectedCategories.includes(ev.category);
      const matchLocation =
        selectedLocation === 'Semua' ||
        (ev.district &&
          (selectedLocation === 'Kota Yogyakarta'
            ? ev.district.toLowerCase().includes('kota') ||
            ev.district.toLowerCase().includes('yogyakarta')
            : ev.district.toLowerCase().includes(selectedLocation.toLowerCase())));

      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ev.name.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.jawaCalendar.toLowerCase().includes(q) ||
        ev.shortDesc.toLowerCase().includes(q) ||
        (ev.district && ev.district.toLowerCase().includes(q));

      return matchCategory && matchLocation && matchQuery;
    });
  }, [selectedCategories, selectedLocation, searchQuery]);

  // Calendar cells matrix calculation (7 columns x N rows)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(activeYear, activeMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

    const cells = [];

    // Prev month padding
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
        map[key] = filteredEvents.filter(
          (ev) => ev.monthIndex === cell.month && parseInt(ev.dayDate, 10) === cell.day
        );
      }
    });
    return map;
  }, [calendarCells, filteredEvents]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear((y) => y - 1);
    } else {
      setActiveMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear((y) => y + 1);
    } else {
      setActiveMonth((m) => m + 1);
    }
  };

  // Events of selected date or active month for right column
  const selectedDateKey = `${activeYear}-${activeMonth}-${selectedDay}`;
  const selectedDayEvents = eventsByDateKey[selectedDateKey] || [];

  // Events displayed in the right sidebar (prioritize selected day, fallback to active month)
  const rightSidebarEvents = useMemo(() => {
    if (selectedDayEvents.length > 0) {
      return selectedDayEvents;
    }
    const inMonth = filteredEvents.filter((ev) => ev.monthIndex === activeMonth);
    return inMonth.length > 0 ? inMonth.slice(0, 2) : filteredEvents.slice(0, 2);
  }, [selectedDayEvents, filteredEvents, activeMonth]);

  // Top popular events for left sidebar
  const popularEvents = useMemo(() => {
    return [
      CULTURAL_EVENTS.find((e) => e.id === 'sekaten-grebeg-mulud'),
      CULTURAL_EVENTS.find((e) => e.id === 'ramayana-ballet-prambanan')
    ].filter(Boolean);
  }, []);

  const handleCopySchedule = (ev) => {
    const text = `[Agenda Budaya Yogyakarta]\n${ev.name}\nTanggal: ${ev.dayDate} ${ev.monthName} ${ev.year || activeYear} (${ev.jawaCalendar})\nWaktu: ${ev.time}\nLokasi: ${ev.location} (${ev.district})\nAdab & Tata Krama: ${ev.tips}\nSumber: ${ev.source}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getAssociatedPlace = (ev) => {
    if (!ev) return null;
    if (ev.id.includes('merapi')) return CULTURAL_PLACES.find((p) => p.id === 'merapi-kaliurang');
    if (ev.id.includes('prambanan') || ev.id.includes('ramayana')) return CULTURAL_PLACES.find((p) => p.id === 'prambanan-ratuboko');
    if (ev.id.includes('grebeg') || ev.id.includes('sekaten') || ev.id.includes('keraton') || ev.id.includes('tapa-bisu') || ev.id.includes('jamasan')) {
      return CULTURAL_PLACES.find((p) => p.id === 'keraton-yogyakarta');
    }
    if (ev.id.includes('batik')) return CULTURAL_PLACES.find((p) => p.id === 'kotagede') || CULTURAL_PLACES[0];
    return CULTURAL_PLACES[0];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-[#FAF6EE] text-[#2d180c] overflow-y-auto pt-24 sm:pt-28 pb-16"
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
      >
        {/* =========================================================================
            PAGE TITLE AREA (Harmonious Homepage Typography & Palette)
            ========================================================================= */}
        <section className="text-center pt-2 pb-6 px-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2d180c] tracking-tight font-['Outfit'] m-0 leading-tight">
            Kalender Event Mendatang
          </h1>
          <p className="text-xs sm:text-sm text-[#786154] m-0 mt-1 max-w-xl mx-auto font-normal">
            Jadwal upacara adat sakral, kirab pusaka keraton, dan pentas seni budaya warisan leluhur D.I. Yogyakarta
          </p>
        </section>

        {/* =========================================================================
            3. EXACT 3-COLUMN MAIN LAYOUT (Harmonized with Homepage)
            ========================================================================= */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ─────────────────────────────────────────────────────────────────
                COLUMN 1 (LEFT SIDEBAR): FILTERS & POPULAR EVENTS
                ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">
              {/* TOP CARD: FILTERS (Warm Cream Container matching homepage) */}
              <div className="bg-[#F5EEDC] border border-[#E8DFC9] rounded-2xl p-4 sm:p-5 space-y-5 shadow-xs">
                {/* Search Bar with Heritage Brown Button */}
                <div className="relative">
                  <input
                    id="search-input-field"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pencarian event..."
                    className="w-full bg-white text-xs text-[#2d180c] placeholder:text-neutral-400 pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E8DFC9] focus:outline-none focus:border-[#8c532b] shadow-2xs"
                  />
                  <button
                    type="button"
                    aria-label="Cari"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#8c532b] hover:bg-[#704222] text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Search size={13} />
                  </button>
                </div>

                {/* Kategori Checkboxes (Real Event Categories & Counts) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#2d180c] tracking-tight uppercase m-0">
                      Kategori
                    </h3>
                    <span className="text-[10px] text-[#786154] font-semibold">
                      {selectedCategories.length} Dipilih
                    </span>
                  </div>
                  <div className="space-y-2">
                    {CATEGORIES_LIST.map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      const conf = CATEGORY_CONFIG[cat];
                      const count = categoryCounts[cat] || 0;
                      return (
                        <label
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className="flex items-center justify-between text-xs text-[#2d180c] cursor-pointer select-none group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${isChecked
                                  ? 'bg-[#8c532b] text-white'
                                  : 'bg-white border border-[#D6CAAF] group-hover:border-[#8c532b]'
                                }`}
                            >
                              {isChecked && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${conf.colorBg} shrink-0`} />
                            <span className="font-medium text-xs text-[#2d180c] group-hover:text-[#8c532b] truncate">
                              {cat}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#786154] bg-white/80 px-1.5 py-0.5 rounded border border-[#E8DFC9] shrink-0">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Lokasi (Radio options with Real Event Counts) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#2d180c] tracking-tight uppercase m-0">
                      Lokasi
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {LOCATIONS_LIST.map((loc) => {
                      const isSelected = selectedLocation === loc.id;
                      const count = locationCounts[loc.id] || 0;
                      return (
                        <label
                          key={loc.id}
                          onClick={() => setSelectedLocation(loc.id)}
                          className="flex items-center justify-between text-xs text-[#2d180c] cursor-pointer select-none group p-1 rounded-lg hover:bg-white/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all shrink-0 ${isSelected
                                  ? 'border-[#8c532b] bg-white'
                                  : 'border-[#D6CAAF] bg-white group-hover:border-[#8c532b]'
                                }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[#8c532b]" />
                              )}
                            </div>
                            <span className="font-medium text-xs text-[#2d180c] group-hover:text-[#8c532b] truncate">
                              {loc.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#786154] bg-white/80 px-1.5 py-0.5 rounded border border-[#E8DFC9] shrink-0">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Tanggal (Date selector input matching layout with real event indicators) */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="text-xs font-bold text-[#2d180c] tracking-tight uppercase m-0">
                    Tanggal
                  </h3>
                  <div className="relative">
                    <select
                      value={activeMonth}
                      onChange={(e) => setActiveMonth(parseInt(e.target.value, 10))}
                      className="w-full bg-white text-xs text-[#2d180c] font-medium pl-8 pr-4 py-2.5 rounded-xl border border-[#E8DFC9] focus:outline-none focus:border-[#8c532b] cursor-pointer appearance-none shadow-2xs"
                    >
                      {MONTH_NAMES.map((m, idx) => {
                        const monthEventsCount = CULTURAL_EVENTS.filter(
                          (e) => e.monthIndex === idx
                        ).length;
                        return (
                          <option key={m} value={idx}>
                            {m} {activeYear}{' '}
                            {monthEventsCount > 0 ? `• (${monthEventsCount} Acara)` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <CalendarIcon
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c532b] pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM CARD: EVENT TERPOPULER (White Container matching homepage card style) */}
              <div className="bg-white rounded-2xl border border-[#E8DFC9] p-4 space-y-3.5 shadow-xs">
                <h3 className="text-xs font-bold text-[#2d180c] tracking-tight uppercase m-0">
                  Event Terpopuler
                </h3>

                <div className="space-y-3">
                  {popularEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        setActiveMonth(ev.monthIndex);
                        setSelectedDay(parseInt(ev.dayDate, 10));
                        handleOpenModal(ev);
                      }}
                      className="w-full flex items-center gap-3 text-left p-1.5 rounded-xl hover:bg-[#FAF6EE] transition-colors cursor-pointer group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                          alt={ev.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8DFC9]"
                        />
                        {ev.isAiGenerated && (
                          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-950 text-amber-200 text-[8px] font-bold rounded-sm border border-amber-400/40">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="text-xs font-bold text-[#2d180c] block truncate group-hover:text-[#8c532b] leading-snug">
                          {ev.name}
                        </strong>
                        <div className="text-[11px] text-[#786154] flex items-center gap-1 mt-0.5">
                          <CalendarIcon size={11} className="text-[#8c532b] shrink-0" />
                          <span>
                            {ev.dayDate} {ev.monthName.slice(0, 3)} {ev.year} • {ev.time.split('–')[0]}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                COLUMN 2 (CENTER MAIN CALENDAR): FULL MONTH MATRIX
                ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E8DFC9] p-5 sm:p-6 shadow-xs space-y-4">
              {/* Calendar Top Control Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFC9]/70 pb-4">
                {/* Month Navigation (< > Month Year) */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Bulan Sebelumnya"
                    className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#2d180c] border border-[#E8DFC9] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Bulan Berikutnya"
                    className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#2d180c] border border-[#E8DFC9] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <h2 className="text-lg sm:text-xl font-extrabold text-[#2d180c] font-['Outfit'] m-0 ml-1">
                    {MONTH_NAMES[activeMonth]} {activeYear}
                  </h2>
                </div>

                {/* Right Mode Toggle Pills ([Bulan] [Minggu] [Hari] [Daftar]) + Filter Icon */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#FAF6EE] p-0.5 rounded-lg border border-[#E8DFC9] text-xs">
                    {['Bulan', 'Minggu', 'Hari', 'Daftar'].map((tab) => {
                      const isActive = viewTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setViewTab(tab)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${isActive
                              ? 'bg-[#2d180c] text-white shadow-2xs font-bold'
                              : 'text-[#786154] hover:text-[#2d180c]'
                            }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories(CATEGORIES_LIST);
                      setSelectedLocation('Semua');
                    }}
                    className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#786154] border border-[#E8DFC9] flex items-center justify-center transition-colors cursor-pointer"
                    title="Reset Filter"
                  >
                    <Filter size={14} />
                  </button>
                </div>
              </div>

              {/* ── SUB-VIEW: BULAN (Default Monthly Matrix Grid) ── */}
              {viewTab === 'Bulan' && (
                <div className="border border-[#E8DFC9] rounded-xl overflow-hidden">
                  {/* 7 Columns Weekday Header Row */}
                  <div className="grid grid-cols-7 bg-[#FAF6EE] border-b border-[#E8DFC9] text-center">
                    {DAY_HEADERS.map((dayName, idx) => (
                      <div
                        key={dayName}
                        className={`py-2 text-[11px] font-bold uppercase tracking-wider ${idx === 0 ? 'text-rose-600 font-extrabold' : 'text-[#786154]'
                          }`}
                      >
                        {dayName}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid Matrix */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-[#E8DFC9] bg-white">
                    {calendarCells.map((cell, idx) => {
                      const cellKey = `${cell.year}-${cell.month}-${cell.day}`;
                      const cellEvents = eventsByDateKey[cellKey] || [];
                      const isSelected =
                        cell.isCurrentMonth && cell.day === selectedDay;

                      return (
                        <div
                          key={`${cellKey}-${idx}`}
                          onClick={() => {
                            if (cell.isCurrentMonth) setSelectedDay(cell.day);
                          }}
                          className={`min-h-[82px] sm:min-h-[96px] p-1.5 flex flex-col justify-between transition-colors cursor-pointer ${!cell.isCurrentMonth
                              ? 'bg-[#FBF9F5] text-neutral-300'
                              : isSelected
                                ? 'bg-[#FAF6EE]/80'
                                : 'bg-white hover:bg-[#FAF6EE]/40'
                            }`}
                        >
                          {/* Top Row: Date Number */}
                          <div className="flex items-center justify-end">
                            {isSelected && cell.isCurrentMonth ? (
                              <span className="w-5 h-5 rounded-full bg-[#8c532b] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                                {cell.day}
                              </span>
                            ) : (
                              <span
                                className={`text-xs font-semibold ${!cell.isCurrentMonth
                                    ? 'text-neutral-300'
                                    : 'text-[#2d180c]'
                                  }`}
                              >
                                {cell.day}
                              </span>
                            )}
                          </div>

                          {/* Event Colored Badges inside cell matching layout */}
                          <div className="mt-1 space-y-1 overflow-hidden">
                            {cellEvents.map((ev) => {
                              const conf =
                                CATEGORY_CONFIG[ev.category] ||
                                CATEGORY_CONFIG['Upacara Keraton'];
                              return (
                                <button
                                  key={ev.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDay(cell.day);
                                    handleOpenModal(ev);
                                  }}
                                  className={`w-full text-left px-1.5 py-1 rounded-md ${conf.colorBg} ${conf.colorText} text-[10px] font-medium leading-tight truncate block transition-transform hover:scale-[1.02] shadow-2xs cursor-pointer`}
                                  title={`${ev.name} • Kategori: ${ev.category} (${ev.time})`}
                                >
                                  <div className="font-bold truncate">{ev.name}</div>
                                  <div className="text-[9px] opacity-90 truncate flex items-center justify-between gap-1 mt-0.5">
                                    <span>{ev.time.split('–')[0]}</span>
                                    <span className="text-[8px] opacity-90 uppercase tracking-tighter truncate font-bold">
                                      {ev.category === 'Upacara Keraton'
                                        ? 'Keraton'
                                        : ev.category === 'Pertunjukan Seni'
                                        ? 'Seni'
                                        : ev.category === 'Festival Rakyat'
                                        ? 'Festival'
                                        : 'Pameran'}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── SUB-VIEW: MINGGU / HARI / DAFTAR ── */}
              {viewTab !== 'Bulan' && (
                <div className="border border-[#E8DFC9] rounded-xl p-4 space-y-3 bg-[#FAF6EE]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2d180c] uppercase">
                      Tampilan {viewTab}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewTab('Bulan')}
                      className="text-xs font-semibold text-[#8c532b] hover:underline cursor-pointer"
                    >
                      Kembali ke Tampilan Bulan
                    </button>
                  </div>

                  <div className="space-y-2">
                    {filteredEvents
                      .filter((e) => e.monthIndex === activeMonth)
                      .map((ev) => {
                        const conf =
                          CATEGORY_CONFIG[ev.category] ||
                          CATEGORY_CONFIG['Upacara Keraton'];
                        return (
                          <div
                            key={ev.id}
                            className="p-3 rounded-xl bg-white border border-[#E8DFC9] flex items-center justify-between gap-3 hover:border-[#8c532b] transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedDay(parseInt(ev.dayDate, 10));
                              handleOpenModal(ev);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${conf.colorBg} ${conf.colorText}`}
                              >
                                {ev.dayDate} {ev.monthName.slice(0, 3)}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-[#2d180c] m-0">
                                  {ev.name}
                                </h4>
                                <span className="text-[11px] text-[#786154]">
                                  {ev.location} • {ev.time}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="px-3 py-1 rounded-lg bg-[#2d180c] text-white text-[11px] font-semibold"
                            >
                              Detail
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                COLUMN 3 (RIGHT SIDEBAR): EVENT CARDS STACK MATCHING LAYOUT
                ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">
              {rightSidebarEvents.map((ev) => {
                return (
                  <div
                    key={ev.id}
                    className="bg-white rounded-2xl border border-[#E8DFC9] overflow-hidden shadow-xs p-3.5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {/* Event Banner Image */}
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                          alt={ev.name}
                          className="w-full h-full object-cover"
                        />
                        {ev.isAiGenerated && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-200 text-[9px] font-semibold border border-amber-400/30 flex items-center gap-1">
                              <Sparkles size={9} className="text-amber-300" />
                              <span>Ilustrasi AI</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Event Title & Category */}
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#8c532b] block mb-0.5">
                          {ev.category}
                        </span>
                        <h3 className="text-sm font-bold text-[#2d180c] m-0 font-['Outfit'] leading-snug line-clamp-2">
                          {ev.name}
                        </h3>
                      </div>

                      {/* Date & Time with Calendar Icon */}
                      <div className="flex items-center gap-1.5 text-xs text-[#786154] font-medium">
                        <CalendarIcon size={12} className="text-[#8c532b] shrink-0" />
                        <span>
                          {ev.dayDate} {ev.monthName} {ev.year} - {ev.time.split('–')[0]}
                        </span>
                      </div>

                      {/* Location with MapPin Icon */}
                      <div className="flex items-start gap-1.5 text-xs text-[#786154]">
                        <MapPin size={12} className="text-[#8c532b] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{ev.location}</span>
                      </div>
                    </div>

                    {/* Deep Warm Espresso CTA Button (Matching Homepage) */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(ev)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#2d180c] hover:bg-[#4a2815] text-white text-xs font-bold text-center transition-all cursor-pointer shadow-xs active:scale-98"
                      >
                        {ev.category === 'Pertunjukan Seni' ? 'Beli Tiket' : 'Lihat Detail & Adab'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* =========================================================================
            4. EVENT DETAIL & ADAB MODAL (Harmonized, Clean & Elevated)
            ========================================================================= */}
        <AnimatePresence>
          {activeModalEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[100060] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FCFBF7] rounded-[28px] border border-[#E8DFC9] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_30px_90px_rgba(45,24,12,0.3)] relative text-[#2d180c] overflow-hidden my-auto"
              >
                {/* ── HERO BANNER SECTION ── */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-950 shrink-0 select-none">
                  <img
                    src={activeModalEvent.image || '/assets/images/real_grebeg_prajurit.jpg'}
                    alt={activeModalEvent.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f1107] via-[#1f1107]/45 to-black/20" />

                  {/* Top Bar: 1 Single AI Badge (if AI) & Close Button */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
                    <div>
                      {activeModalEvent.isAiGenerated && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-400/40 shadow-xs">
                          <Sparkles size={12} className="text-amber-300" />
                          <span>Ilustrasi AI</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-md hover:bg-black/85 text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-xs active:scale-95"
                      aria-label="Tutup"
                      title="Tutup (Esc)"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  {/* Hero Bottom: Nama Acara Only */}
                  <div className="absolute bottom-5 left-5 right-5 text-white z-10">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight m-0 font-['Outfit'] drop-shadow-md">
                      {activeModalEvent.name}
                    </h3>
                  </div>
                </div>

                {/* ── CLEAN SEGMENTED TAB SWITCHER ── */}
                <div className="px-5 sm:px-6 pt-3 pb-2 bg-white border-b border-[#E8DFC9] shrink-0">
                  <div className="flex items-center gap-1.5 p-1 bg-[#F5EEDC] rounded-xl border border-[#E8DFC9]">
                    {[
                      { id: 'ringkasan', label: 'Ringkasan & Makna', icon: Info },
                      { id: 'adab', label: 'Adab & Tata Krama', icon: ShieldCheck },
                      { id: 'lokasi', label: 'Lokasi & Akses', icon: MapPin }
                    ].map((tab) => {
                      const isActive = modalTab === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setModalTab(tab.id)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isActive
                              ? 'bg-white text-[#2d180c] shadow-xs'
                              : 'text-[#786154] hover:text-[#2d180c] hover:bg-white/40'
                            }`}
                        >
                          <Icon size={13} className={isActive ? 'text-[#8c532b]' : 'opacity-70'} />
                          <span className="truncate">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── SCROLLABLE MODAL BODY CONTENT ── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                  {/* TAB 1: RINGKASAN & MAKNA */}
                  {modalTab === 'ringkasan' && (
                    <div className="space-y-4">
                      {/* 4 Clean Metric Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-[#E8DFC9] shadow-2xs">
                          <div className="flex items-center gap-1 text-[#8c532b] mb-1">
                            <CalendarIcon size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Tanggal</span>
                          </div>
                          <strong className="text-[#2d180c] block text-xs truncate">
                            {activeModalEvent.dayDate} {activeModalEvent.monthName} {activeModalEvent.year}
                          </strong>
                          <span className="text-[#786154] text-[10px] block mt-0.5 truncate">
                            {activeModalEvent.time.split('–')[0]}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E8DFC9] shadow-2xs">
                          <div className="flex items-center gap-1 text-[#8c532b] mb-1">
                            <Sparkles size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Kategori Acara</span>
                          </div>
                          {(() => {
                            const conf =
                              CATEGORY_CONFIG[activeModalEvent.category] ||
                              CATEGORY_CONFIG['Upacara Keraton'];
                            return (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${conf.colorBg} ${conf.colorText}`}
                              >
                                {activeModalEvent.category}
                              </span>
                            );
                          })()}
                          <span className="text-[#786154] text-[10px] block mt-1 truncate">
                            {activeModalEvent.category === 'Upacara Keraton'
                              ? 'Adat Sakral Kasultanan'
                              : activeModalEvent.category === 'Pertunjukan Seni'
                              ? 'Pentas Seni Teater'
                              : activeModalEvent.category === 'Festival Rakyat'
                              ? 'Tradisi Kerakyatan'
                              : 'Pameran & Galeri Seni'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E8DFC9] shadow-2xs">
                          <div className="flex items-center gap-1 text-[#8c532b] mb-1">
                            <Compass size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Wilayah</span>
                          </div>
                          <strong className="text-[#2d180c] block text-xs truncate">
                            {activeModalEvent.district}
                          </strong>
                          <span className="text-[#786154] text-[10px] block mt-0.5 truncate">
                            D.I. Yogyakarta
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E8DFC9] shadow-2xs">
                          <div className="flex items-center gap-1 text-[#8c532b] mb-1">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Waktu</span>
                          </div>
                          <strong className="text-[#2d180c] block text-xs truncate">
                            {activeModalEvent.time}
                          </strong>
                          <span className="text-emerald-700 text-[10px] font-bold block mt-0.5 truncate">
                            Sesuai Jadwal
                          </span>
                        </div>
                      </div>

                      {/* Makna Filosofis Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFC9] space-y-2.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#8c532b]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2d180c] m-0">
                            Makna Filosofis &amp; Prosesi Sakral
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed m-0 font-normal">
                          {activeModalEvent.description}
                        </p>

                        {/* Highlight Pill */}
                        {activeModalEvent.highlight && (
                          <div className="mt-3 p-3 rounded-xl bg-[#FAF6EE] border border-[#E8DFC9]/80 flex items-start gap-2.5 text-xs text-[#2d180c]">
                            <Award size={15} className="text-[#8c532b] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-[11px] text-[#8c532b] uppercase tracking-wide">
                                Sorotan Utama Acara:
                              </span>
                              <span className="font-semibold text-[#2d180c]">{activeModalEvent.highlight}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Official Source Reference & AI/Real Image Notice */}
                      <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                        <div className="flex items-center gap-2 text-[#786154]">
                          <ShieldCheck size={15} className="text-[#8c532b] shrink-0" />
                          <span>
                            Rujukan Resmi:{' '}
                            <strong className="text-[#2d180c]">{activeModalEvent.source}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                          Data Terverifikasi 2025
                        </span>
                      </div>

                      {/* Photo Attribution Notice Box */}
                      {activeModalEvent.isAiGenerated ? (
                        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 flex items-start gap-2.5 text-xs text-amber-950 shadow-2xs">
                          <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <strong className="block font-bold text-[#2d180c]">
                              Keterangan Foto: Dihasilkan oleh AI (Ilustrasi Tradisi)
                            </strong>
                            <p className="text-amber-900/90 leading-relaxed m-0 text-[11px] sm:text-xs">
                              Foto visualisasi di atas dihasilkan oleh AI untuk memberikan gambaran visual kepada pengunjung mengenai prosesi upacara sakral, sedangkan seluruh informasi jadwal, makna filosofis, dan tata krama adalah <strong>100% fakta riil Kasultanan Yogyakarta</strong>.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950 shadow-2xs">
                          <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <strong className="block font-bold text-emerald-950">
                              Keterangan Foto: Dokumentasi Foto Asli Lapangan
                            </strong>
                            <p className="text-emerald-900/90 leading-relaxed m-0 text-[11px] sm:text-xs">
                              Foto di atas merupakan dokumentasi asli lapangan ({activeModalEvent.imageCaption || activeModalEvent.source}).
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ADAB & TATA KRAMA */}
                  {modalTab === 'adab' && (
                    <div className="space-y-3.5">
                      {/* Alert Guidance Banner */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                        <AlertCircle size={18} className="text-[#8c532b] shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <strong className="text-[#2d180c] block font-bold text-sm">
                            Tata Krama Menghadiri Upacara Adat
                          </strong>
                          <p className="text-[#786154] m-0 leading-relaxed">
                            Prosesi adat dan tradisi Kasultanan Yogyakarta memiliki nilai spiritual luhur. Pengunjung dimohon senantiasa menjaga ketertiban dan menghormati kesakralan acara.
                          </p>
                        </div>
                      </div>

                      {/* 3 Dedicated Guidance Cards */}
                      <div className="p-4 rounded-xl bg-white border border-[#E8DFC9] space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-xs text-[#2d180c]">
                          <span className="w-5 h-5 rounded-full bg-[#8c532b]/10 text-[#8c532b] flex items-center justify-center text-[11px]">
                            1
                          </span>
                          <span>Ketentuan Busana &amp; Pakaian</span>
                        </div>
                        <p className="text-xs text-neutral-600 pl-7 m-0 leading-relaxed">
                          Wajib berpakaian sopan, tertutup, dan rapi. Di area sakral Pagelaran Keraton dan Masjid Kauman dilarang memakai celana pendek, kaos tanpa lengan, atau sandal jepit.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#E8DFC9] space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-xs text-[#2d180c]">
                          <span className="w-5 h-5 rounded-full bg-[#8c532b]/10 text-[#8c532b] flex items-center justify-center text-[11px]">
                            2
                          </span>
                          <span>Perilaku &amp; Ketertiban Sakral</span>
                        </div>
                        <p className="text-xs text-neutral-600 pl-7 m-0 leading-relaxed">
                          {activeModalEvent.tips} Dilarang keras melangkah di atas instrumen pusaka atau memotong barisan bregada prajurit yang sedang bertugas.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#E8DFC9] space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-xs text-[#2d180c]">
                          <span className="w-5 h-5 rounded-full bg-[#8c532b]/10 text-[#8c532b] flex items-center justify-center text-[11px]">
                            3
                          </span>
                          <span>Etika Dokumentasi &amp; Fotografi</span>
                        </div>
                        <p className="text-xs text-neutral-600 pl-7 m-0 leading-relaxed">
                          Dilarang menggunakan lampu kilat (flash) ke arah Sultan, abdi dalem, maupun pusaka. Berdirilah di luar garis pembatas yang ditentukan aparat keamanan keraton.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: LOKASI & AKSES */}
                  {modalTab === 'lokasi' && (
                    <div className="space-y-3.5">
                      {/* Venue Address Card */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8DFC9] space-y-3 shadow-2xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 text-xs">
                            <MapPin size={16} className="text-[#8c532b] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-bold text-[#8c532b] uppercase block">
                                Tempat Pelaksanaan
                              </span>
                              <strong className="text-sm font-bold text-[#2d180c] block mt-0.5">
                                {activeModalEvent.location}
                              </strong>
                              <span className="text-[#786154] text-xs block mt-0.5">
                                Kawasan {activeModalEvent.district}, Daerah Istimewa Yogyakarta
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyAddress(`${activeModalEvent.location}, ${activeModalEvent.district}, Yogyakarta`)}
                            className="py-1.5 px-3 rounded-lg bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#E8DFC9] text-[#2d180c] text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                          >
                            {copiedAddress ? 'Alamat Tersalin' : 'Salin Alamat'}
                          </button>
                        </div>

                        {/* Coordinates info if present */}
                        {activeModalEvent.coordinates && (
                          <div className="pt-2 border-t border-[#E8DFC9]/70 flex items-center justify-between text-[11px] text-[#786154]">
                            <span>
                              Titik GPS: {activeModalEvent.coordinates.lat.toFixed(4)},{' '}
                              {activeModalEvent.coordinates.lng.toFixed(4)}
                            </span>
                            <span className="text-emerald-700 font-bold">Koordinat Asli</span>
                          </div>
                        )}
                      </div>

                      {/* Associated Destination Card */}
                      {(() => {
                        const associatedPlace = getAssociatedPlace(activeModalEvent);
                        if (!associatedPlace) return null;
                        return (
                          <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC9] flex items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={associatedPlace.image || '/assets/images/jogja_keraton.jpg'}
                                alt={associatedPlace.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8DFC9]"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-[#8c532b] uppercase block">
                                  Destinasi Warisan Terkait
                                </span>
                                <strong className="text-xs font-bold text-[#2d180c] block truncate">
                                  {associatedPlace.name}
                                </strong>
                                <span className="text-[11px] text-[#786154] truncate block">
                                  {associatedPlace.subtitle || associatedPlace.location}
                                </span>
                              </div>
                            </div>

                            {onSelectPlace && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleCloseModal();
                                  onSelectPlace(associatedPlace);
                                }}
                                className="py-2 px-3.5 rounded-xl bg-[#8c532b] hover:bg-[#754422] text-white text-xs font-bold shrink-0 cursor-pointer transition-all shadow-xs"
                              >
                                Eksplorasi
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* ── CLEAN FOOTER ACTIONS ROW ── */}
                <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFC9] flex flex-wrap items-center justify-between gap-3 shrink-0">
                  {/* Left Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCopySchedule(activeModalEvent)}
                      className="py-2.5 px-3.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#E8DFC9] text-[#2d180c] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      {copiedId === activeModalEvent.id ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Jadwal Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} className="text-[#8c532b]" />
                          <span>Salin Jadwal</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getGoogleCalendarUrl(activeModalEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex py-2.5 px-3.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border border-[#E8DFC9] text-[#2d180c] text-xs font-bold items-center gap-1.5 no-underline transition-all active:scale-95 shadow-2xs cursor-pointer"
                      title="Tambahkan ke Google Calendar"
                    >
                      <CalendarPlus size={14} className="text-[#8c532b]" />
                      <span>Simpan Kalender</span>
                    </a>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF6EE] border border-[#E8DFC9] text-[#2d180c] text-xs font-bold cursor-pointer transition-all active:scale-95"
                    >
                      Tutup
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${activeModalEvent.name} ${activeModalEvent.location} Yogyakarta`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#2d180c] hover:bg-[#432311] text-white text-xs font-bold inline-flex items-center gap-1.5 no-underline shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <MapPin size={13} />
                      <span>Buka Maps</span>
                      <ExternalLink size={11} className="text-white/70" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
