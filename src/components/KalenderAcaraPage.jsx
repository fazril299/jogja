import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Tag,
  Link2,
  Clock,
  MapPin,
  ShieldAlert,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Bookmark,
  CalendarPlus,
  Compass,
  ArrowRight,
  Info,
  Award,
  CheckCircle2
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

// Pasaran Jawa (5-Day Cycle of Weton: Wage, Kliwon, Legi, Pahing, Pon)
const PASARAN_NAMES = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];

function getPasaranJawa(year, month, day) {
  const targetDate = Date.UTC(year, month, day);
  const epoch = Date.UTC(1970, 0, 1); // 1 Jan 1970 is Kamis Wage (offset 0)
  const diffDays = Math.floor((targetDate - epoch) / 86400000);
  const pIndex = ((diffDays % 5) + 5) % 5;
  return PASARAN_NAMES[pIndex];
}

// Quick Vibe Filters above Calendar Matrix
const VIBE_FILTERS = [
  { id: 'semua', label: 'Semua Agenda' },
  { id: 'sakral', label: 'Paling Sakral' },
  { id: 'weekend', label: 'Weekend & Pentas' },
  { id: 'kliwon', label: 'Malam Kliwon' },
  { id: 'terbuka', label: 'Terbuka Umum' }
];

// Jojo Cultural Guidance & Adab Tips
const JOJO_CULTURAL_TIPS = [
  {
    tag: 'Adab Berbusana Keraton',
    title: 'Busana Rapi & Tertutup',
    desc: 'Di area sakral Pagelaran Keraton, kenakan pakaian sopan dan hindari celana pendek.'
  },
  {
    tag: 'Tata Krama Kirab Sakral',
    title: 'Hormati Bregada Prajurit',
    desc: 'Dilarang memotong barisan kirab bregada atau melangkah di atas instrumen pusaka.'
  },
  {
    tag: 'Penanggalan Jawa',
    title: 'Dwi-Penanggalan Masehi & Weton',
    desc: 'Upacara adat berpatokan pada weton Jawa sakral seperti Selasa Kliwon & Jumat Kliwon.'
  },
  {
    tag: 'Etika Dokumentasi Foto',
    title: 'Tanpa Lampu Kilat (No Flash)',
    desc: 'Hindari flash kamera ke arah Ngarsa Dalem Sri Sultan, abdi dalem, dan pusaka ageng.'
  },
  {
    tag: 'Sumbu Filosofis UNESCO',
    title: 'Poros Kosmis Kasultanan',
    desc: 'Garis imaginer Panggung Krapyak – Keraton – Tugu – Merapi sarat makna luhur spiritual.'
  }
];


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
  { id: 'Bantul', label: 'Kabupaten Bantul' },
  { id: 'Kulon Progo', label: 'Kabupaten Kulon Progo' },
  { id: 'Gunungkidul', label: 'Kabupaten Gunungkidul' }
];

// Cultural Burst 3D Out-of-Bounds Icon (4 Kategori Budaya Berbeda: Wayang, Gunungan, Canting, Grebeg)
function CulturalBurstIcon({ category, isMobile = false }) {
  const gradId = React.useId().replace(/:/g, '');
  const sizeClasses = isMobile
    ? "w-6 h-8 absolute -top-3.5 -right-2 rotate-12 pointer-events-none z-30 drop-shadow-[0_4px_8px_rgba(180,83,9,0.5)]"
    : "w-10 h-14 sm:w-14 sm:h-18 absolute -top-4 sm:-top-5.5 -right-2 sm:-right-2.5 rotate-12 pointer-events-none z-10 drop-shadow-[0_8px_14px_rgba(180,83,9,0.4)] group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-6 transition-transform duration-300";

  // 1. UPACARA KERATON: Songsong Kebesaran & Surya Gunungan Ageng
  if (category === 'Upacara Keraton') {
    return (
      <svg viewBox="0 0 100 140" className={sizeClasses} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`keraton-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="65%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id={`gold-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <path
          d="M50 4 C36 28, 12 56, 5 90 C-2 110, 6 135, 50 137 C94 135, 102 110, 95 90 C88 56, 64 28, 50 4 Z"
          fill={`url(#keraton-${gradId})`}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <path d="M50 16 L50 125" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 64 C38 78, 62 78, 76 64 M18 92 C38 106, 62 106, 82 92 M12 118 C34 130, 66 130, 88 118" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="42" r="8.5" fill={`url(#gold-${gradId})`} stroke="#B45309" strokeWidth="2" />
        <path d="M50 28 L50 34 M50 50 L50 56 M36 42 L42 42 M58 42 L64 42" stroke="#FFFBEB" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. PERTUNJUKAN SENI: Topeng Tari Panji & Sunggingan Wayang
  if (category === 'Pertunjukan Seni') {
    return (
      <svg viewBox="0 0 100 130" className={sizeClasses} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`tari-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>
        </defs>
        <path
          d="M50 6 C24 6, 8 26, 12 58 C16 86, 35 118, 50 124 C65 118, 84 86, 88 58 C92 26, 76 6, 50 6 Z"
          fill={`url(#tari-${gradId})`}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <path d="M50 0 L56 12 L68 6 L64 18 L76 18 L68 28 M50 0 L44 12 L32 6 L36 18 L24 18 L32 28" fill="#FDE047" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
        <path d="M26 44 C34 40, 44 48, 47 48 M74 44 C66 40, 56 48, 53 48" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 48 L50 76 L43 83 L57 83" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 96 C44 103, 56 103, 64 96" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. FESTIVAL RAKYAT: Gunungan Grebeg & Panji Bregada
  if (category === 'Festival Rakyat') {
    return (
      <svg viewBox="0 0 100 135" className={sizeClasses} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`rakyat-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="30%" stopColor="#FB923C" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
        </defs>
        <path
          d="M50 6 L78 52 C86 68, 88 95, 84 122 C84 128, 16 128, 16 122 C12 95, 14 68, 22 52 Z"
          fill={`url(#rakyat-${gradId})`}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <path d="M50 6 L50 0 L66 6 L50 12" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M30 55 C42 62, 58 62, 70 55 M24 80 C40 90, 60 90, 76 80 M18 105 C38 116, 62 116, 82 105" stroke="#FFF7ED" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="38" r="5.5" fill="#FEF08A" stroke="#C2410C" strokeWidth="1.5" />
        <circle cx="36" cy="68" r="4.5" fill="#FEF08A" stroke="#C2410C" strokeWidth="1.5" />
        <circle cx="64" cy="68" r="4.5" fill="#FEF08A" stroke="#C2410C" strokeWidth="1.5" />
      </svg>
    );
  }

  // 4. PAMERAN SENI: Canting Kriya & Sulur Batik Morosanto
  return (
    <svg viewBox="0 0 100 135" className={sizeClasses} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`kriya-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#D97706" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>
      <path
        d="M50 6 C28 10, 14 34, 18 64 C22 92, 40 118, 50 124 C60 118, 78 92, 82 64 C86 34, 72 10, 50 6 Z"
        fill={`url(#kriya-${gradId})`}
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <path d="M38 32 C38 22, 52 18, 62 26 C68 32, 66 42, 56 46 L38 32 Z" fill="#FDE047" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
      <path d="M38 32 C30 36, 26 44, 28 50 C32 58, 48 56, 52 68 C56 80, 42 88, 46 98 C50 108, 68 104, 72 114" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" />
      <circle cx="62" cy="72" r="6" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
      <circle cx="48" cy="88" r="4.5" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
    </svg>
  );
}

export default function KalenderAcaraPage({ isOpen, onClose, onSelectPlace, onPopupChange, initialEventId = null, onShowEventLocation }) {
  // Calendar time state
  const [activeYear, setActiveYear] = useState(() => Math.max(2026, new Date().getFullYear()));
  const [activeMonth, setActiveMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  // Active view toggle: 'Bulan' | 'Minggu' | 'Hari' | 'Daftar'
  const [viewTab, setViewTab] = useState('Bulan');

  // Quick Vibe filter above calendar
  const [activeVibe, setActiveVibe] = useState('semua');

  // Interactive Quick-Peek Hover Preview State
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);

  // Interactive Jojo tip cycle state
  const [jojoTipIndex, setJojoTipIndex] = useState(-1);
  const handleJojoTipCycle = () => {
    setJojoTipIndex((prev) => (prev + 1) % JOJO_CULTURAL_TIPS.length);
  };

  // Filter state in left sidebar
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES_LIST);
  const [selectedLocation, setSelectedLocation] = useState('Semua');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Cuplikan teks event ringkas untuk sel kalender mobile (maks 1 baris)
  const getEventSnippet = (events) => {
    if (!events || events.length === 0) return '';
    const first = events[0];
    const name = first.name || '';
    if (name.toLowerCase().includes('grebeg')) return 'Grebeg';
    if (name.toLowerCase().includes('uyon-uyon')) return 'Uyon-Uyon';
    if (name.toLowerCase().includes('labuhan')) return 'Labuhan';
    if (name.toLowerCase().includes('sekaten')) return 'Sekaten';
    if (name.toLowerCase().includes('bedhaya')) return 'Bedhaya';
    if (name.toLowerCase().includes('wayang')) return 'Wayang';
    if (name.toLowerCase().includes('artjog')) return 'ArtJog';
    if (name.toLowerCase().includes('jamasan')) return 'Jamasan';
    if (name.toLowerCase().includes('tirakatan')) return 'Tirakatan';
    if (name.toLowerCase().includes('prambanan')) return 'Prambanan';
    return name.split(' ')[0].slice(0, 8);
  };

  // Quick Vibe counts
  const vibeCounts = useMemo(() => {
    return {
      semua: CULTURAL_EVENTS.length,
      sakral: CULTURAL_EVENTS.filter((e) => e.category === 'Upacara Keraton').length,
      weekend: CULTURAL_EVENTS.filter((e) => {
        const d = new Date(e.year || 2026, e.monthIndex !== undefined ? e.monthIndex : 2, parseInt(e.dayDate, 10)).getDay();
        return d === 0 || d === 6 || e.category === 'Pertunjukan Seni';
      }).length,
      kliwon: CULTURAL_EVENTS.filter((e) => {
        const p = getPasaranJawa(e.year || 2026, e.monthIndex !== undefined ? e.monthIndex : 2, parseInt(e.dayDate, 10));
        return p === 'Kliwon' || e.jawaCalendar?.toLowerCase().includes('kliwon') || e.name?.toLowerCase().includes('tapa bisu');
      }).length,
      terbuka: CULTURAL_EVENTS.filter((e) => e.category !== 'Upacara Keraton' || !e.name?.toLowerCase().includes('jamasan')).length
    };
  }, []);

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
      ).length,
      'Kulon Progo': CULTURAL_EVENTS.filter(
        (e) => e.district && e.district.toLowerCase().includes('kulon progo')
      ).length,
      Gunungkidul: CULTURAL_EVENTS.filter(
        (e) =>
          e.district &&
          (e.district.toLowerCase().includes('gunungkidul') ||
            e.district.toLowerCase().includes('gunung kidul'))
      ).length
    };
  }, []);

  // Detail Modal state
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [modalTab, setModalTab] = useState('ringkasan');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareCopiedToast, setShareCopiedToast] = useState(false);

  const getShareUrl = (ev) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}#/kalender?event=${ev?.id || ''}`;
  };

  const getShareText = (ev) => {
    if (!ev) return '';
    const dateStr = `${ev.dayDate || ''} ${ev.monthName || ''} ${ev.year || 2026}`;
    return `Saksikan acara budaya Jogja: *${ev.name}*\n📅 Tanggal: ${dateStr}\n⏰ Waktu: ${ev.time || 'Sesuai Jadwal'}\n📍 Lokasi: ${ev.location || ''}, ${ev.district || 'D.I. Yogyakarta'}\n\nSelengkapnya di Hamemayu:\n`;
  };

  const handleShareWhatsApp = (ev) => {
    if (!ev) return;
    const url = getShareUrl(ev);
    const text = encodeURIComponent(`${getShareText(ev)}${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = (ev) => {
    if (!ev) return;
    const url = encodeURIComponent(getShareUrl(ev));
    const text = encodeURIComponent(`Saksikan agenda budaya Jogja: ${ev.name} (${ev.dayDate} ${ev.monthName || ''} ${ev.year || 2026})`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=Hamemayu,BudayaJogja,WisataJogja`, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = (ev) => {
    if (!ev) return;
    handleCopyEventLink(ev);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleCopyEventLink = (ev) => {
    if (!ev) return;
    const url = getShareUrl(ev);
    navigator.clipboard?.writeText?.(url);
    setShareCopiedToast(true);
    setTimeout(() => {
      setShareCopiedToast(false);
    }, 3000);
  };

  const handleOpenModal = (ev) => {
    setModalTab('ringkasan');
    setActiveModalEvent(ev);
    setIsShareModalOpen(false);
    setShareCopiedToast(false);
    onPopupChange?.(true);
    // Sinkronkan URL hash browser untuk deep linking
    window.history.replaceState(null, '', `#/kalender-acara/${ev.id}`);
  };

  const handleCloseModal = () => {
    setActiveModalEvent(null);
    setIsShareModalOpen(false);
    setShareCopiedToast(false);
    onPopupChange?.(false);
    // Kembalikan URL hash ke halaman kalender umum
    window.history.replaceState(null, '', '#/kalender-acara');
  };

  // Buka otomatis detail acara jika URL memiliki deep link event ID (misal dari share WA/FB/IG)
  useEffect(() => {
    if (initialEventId && isOpen) {
      const target = initialEventId.toLowerCase().trim();
      const found = CULTURAL_EVENTS.find(
        (e) => e.id.toLowerCase() === target || e.id.toLowerCase().includes(target)
      );
      if (found) {
        handleOpenModal(found);
        if (typeof found.monthIndex === 'number') {
          setActiveMonth(found.monthIndex);
        }
        if (found.dayDate) {
          const dayNum = parseInt(found.dayDate, 10);
          if (!isNaN(dayNum)) setSelectedDay(dayNum);
        }
      }
    }
  }, [initialEventId, isOpen]);

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

  // Master filtered events based on left sidebar filters and quick vibe
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

      // Quick Vibe Filter
      let matchVibe = true;
      if (activeVibe === 'sakral') {
        matchVibe = ev.category === 'Upacara Keraton';
      } else if (activeVibe === 'weekend') {
        const d = new Date(ev.year || activeYear, ev.monthIndex !== undefined ? ev.monthIndex : 2, parseInt(ev.dayDate, 10)).getDay();
        matchVibe = d === 0 || d === 6 || ev.category === 'Pertunjukan Seni';
      } else if (activeVibe === 'kliwon') {
        const p = getPasaranJawa(ev.year || activeYear, ev.monthIndex !== undefined ? ev.monthIndex : 2, parseInt(ev.dayDate, 10));
        matchVibe = p === 'Kliwon' || ev.jawaCalendar?.toLowerCase().includes('kliwon') || ev.name?.toLowerCase().includes('tapa bisu');
      } else if (activeVibe === 'terbuka') {
        matchVibe = ev.category !== 'Upacara Keraton' || !ev.name?.toLowerCase().includes('jamasan');
      }

      const matchYear = parseInt(ev.year || 2026, 10) === activeYear;
      return matchCategory && matchLocation && matchQuery && matchVibe && matchYear;
    });
  }, [selectedCategories, selectedLocation, searchQuery, activeVibe, activeYear]);

  // Calendar cells matrix calculation (7 columns x N rows)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(activeYear, activeMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = activeMonth === 0 ? 11 : activeMonth - 1;
      const y = activeMonth === 0 ? activeYear - 1 : activeYear;
      cells.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isPrevMonth: true,
        pasaran: getPasaranJawa(y, m, d)
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: activeMonth,
        year: activeYear,
        isCurrentMonth: true,
        pasaran: getPasaranJawa(activeYear, activeMonth, d)
      });
    }

    // Next month padding to complete 7-day row
    const remainingCells = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const m = activeMonth === 11 ? 0 : activeMonth + 1;
      const y = activeMonth === 11 ? activeYear + 1 : activeYear;
      cells.push({
        day: i,
        month: m,
        year: y,
        isCurrentMonth: false,
        isNextMonth: true,
        pasaran: getPasaranJawa(y, m, i)
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
          (ev) =>
            parseInt(ev.year || 2026, 10) === cell.year &&
            ev.monthIndex === cell.month &&
            parseInt(ev.dayDate, 10) === cell.day
        );
      }
    });
    return map;
  }, [calendarCells, filteredEvents]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (activeYear <= 2026 && activeMonth === 0) {
      return; // Dibatasi: tidak bisa navigasi sebelum Januari 2026
    }
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear((y) => Math.max(2026, y - 1));
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

  const copyToClipboard = async (text) => {
    if (!text) return false;
    // 1. Coba Clipboard API modern (HTTPS / browser modern)
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard writeText gagal/diblokir, mencoba fallback execCommand:', err);
      }
    }

    // 2. Fallback universal (bekerja di HTTP, localhost IP, mobile webview, iframe)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) return true;
    } catch (fallbackErr) {
      console.error('Semua metode copy gagal:', fallbackErr);
    }

    return false;
  };

  // Deep-link URL generator langsung ke ID acara database / katalog
  const getEventShareUrl = (ev) => {
    if (!ev) return window.location.href;
    const origin = window.location.origin || '';
    const pathname = window.location.pathname || '/';
    return `${origin}${pathname}#/kalender-acara/${ev.id}`;
  };

  // Format teks lengkap untuk dibagikan ke WhatsApp, FB, dan media sosial
  const getEventShareText = (ev) => {
    if (!ev) return '';
    const yearStr = ev.year || activeYear || '2026';
    const shareUrl = getEventShareUrl(ev);

    const lines = [
      `🏛️ [AGENDA BUDAYA YOGYAKARTA]`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 ${ev.name}`,
      `🏷️ Kategori: ${ev.category || 'Upacara & Tradisi'}`,
      `🗓️ Tanggal: ${ev.dayDate} ${ev.monthName} ${yearStr}${ev.jawaCalendar ? ` (${ev.jawaCalendar})` : ''}`,
      `⏰ Waktu: ${ev.time || 'Sesuai Jadwal'}`,
      `📍 Lokasi: ${ev.location || 'Yogyakarta'}${ev.district ? `, ${ev.district}` : ''}`,
      ev.tips ? `\n💡 Tata Krama / Adab:\n${ev.tips}` : '',
      ev.shortDesc ? `\n📖 Sekilas Tradisi:\n${ev.shortDesc}` : '',
      `\n🔗 Buka Jadwal & Panduan Lengkap:\n${shareUrl}`,
      `\n🏛️ Rujukan Resmi: ${ev.source || 'Kasultanan Ngayogyakarta Hadiningrat'}`
    ].filter(Boolean);

    return lines.join('\n');
  };

  // Salin rincian jadwal + link URL asli ke clipboard
  const handleCopySchedule = async (ev) => {
    if (!ev) return;
    const formattedText = getEventShareText(ev);
    const success = await copyToClipboard(formattedText);

    if (success) {
      setCopiedId(ev.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  // Salin hanya tautan link URL acara
  const handleCopyLinkOnly = async (ev) => {
    if (!ev) return;
    const shareUrl = getEventShareUrl(ev);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Bagikan via Web Share API (Langsung ke Instagram, WhatsApp, Stories, Medsos)
  const handleShareNative = async (ev) => {
    if (!ev) return;
    const shareUrl = getEventShareUrl(ev);
    const text = `Agenda Budaya Jogja: ${ev.name} (${ev.dayDate} ${ev.monthName} ${ev.year || activeYear})`;
    if (navigator?.share) {
      try {
        await navigator.share({
          title: ev.name,
          text: text,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Native share gagal, beralih ke salin link:', err);
        }
      }
    }
    // Fallback jika Web Share API tidak didukung di desktop
    handleCopyLinkOnly(ev);
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

  // Jojo Mascot Speech Content (Kurator Agenda Keraton dengan Mode Tips Interaktif)
  const jojoBubbleContent = useMemo(() => {
    if (jojoTipIndex >= 0) {
      return JOJO_CULTURAL_TIPS[jojoTipIndex];
    }
    if (searchQuery.trim()) {
      return {
        tag: 'Pencarian Acara',
        title: `Cari: "${searchQuery.trim()}"`,
        desc: `${filteredEvents.length} agenda budaya ditemukan`
      };
    }
    if (activeVibe !== 'semua') {
      const activeVibeObj = VIBE_FILTERS.find((v) => v.id === activeVibe);
      return {
        tag: 'Filter Cepat Aktif',
        title: `${activeVibeObj?.label || activeVibe}`,
        desc: `${filteredEvents.length} agenda sesuai tema ini`
      };
    }
    if (selectedDayEvents && selectedDayEvents.length > 0) {
      const ev = selectedDayEvents[0];
      return {
        tag: 'Agenda Terpilih',
        title: `${selectedDay} ${MONTH_NAMES[activeMonth]}: ${ev.name}`,
        desc: `${ev.category} • ${ev.time.split('–')[0]}`
      };
    }
    if (selectedLocation !== 'Semua') {
      return {
        tag: 'Wilayah Budaya',
        title: `${selectedLocation}`,
        desc: `${filteredEvents.length} agenda di kawasan ini`
      };
    }
    if (selectedCategories.length === 1) {
      return {
        tag: 'Kategori Khusus',
        title: `${selectedCategories[0]}`,
        desc: `${filteredEvents.length} agenda terdaftar`
      };
    }
    return {
      tag: 'Kurator Keraton',
      title: 'Pilih Kategori & Wilayah!',
      desc: 'Jojo pandu jadwal upacaranya (Klik aku untuk tips!)'
    };
  }, [jojoTipIndex, searchQuery, activeVibe, filteredEvents.length, selectedDayEvents, selectedDay, activeMonth, selectedLocation, selectedCategories]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100000] bg-[#FAF6EE] text-[#2d180c] overflow-y-auto pt-20 sm:pt-28 pb-28 sm:pb-16"
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
      >
        {/* FLOATING CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100015] w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-[#D9CEBA] text-[#2C221E] flex items-center justify-center hover:bg-white transition-all shadow-sm cursor-pointer active:scale-95"
          aria-label="Tutup dan Kembali ke Beranda"
        >
          <X size={18} />
        </button>

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
          {/* ─────────────────────────────────────────────────────────────────
              DESKTOP VIEW (hidden lg:grid): 100% Layout Asli 3-Kolom Terjaga
              ───────────────────────────────────────────────────────────────── */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
            {/* ─────────────────────────────────────────────────────────────────
                COLUMN 1 (LEFT SIDEBAR): JOJO COMPANION, FILTERS & POPULAR EVENTS
                ───────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4 lg:-mt-[126px]">
              {/* MASKOT JOJO: KURATOR AGENDA KERATON (Interaktif: Klik Jojo atau Bubble untuk Berbagi Tips Adat) */}
              <div className="select-none relative z-20 mb-[-14px]">
                <div className="flex items-end justify-between gap-2">
                  {/* Bubble Chat Panduan Interaktif */}
                  <motion.div
                    key={`${jojoBubbleContent.tag}-${jojoBubbleContent.title}`}
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleJojoTipCycle}
                    className="bg-white/95 backdrop-blur-md border border-[#D9CEBA] rounded-2xl p-2.5 pr-3 shadow-[0_8px_20px_rgba(45,24,12,0.12)] relative flex-1 min-w-0 mb-4 -ml-1 cursor-pointer hover:border-[#8c532b]/60 transition-colors group"
                    title="Klik untuk melihat tips tata krama & budaya Yogyakarta"
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0">
                      <span className="text-[9px] font-extrabold text-[#8c532b] uppercase tracking-wider truncate min-w-0 flex-1">
                        {jojoBubbleContent.tag}
                      </span>
                      <span className="text-[8px] text-[#8c532b] font-bold opacity-70 group-hover:opacity-100 transition-opacity shrink-0 whitespace-nowrap pl-1">
                        Ganti Tips
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#2d180c] leading-snug m-0 line-clamp-1">
                      {jojoBubbleContent.title}
                    </p>
                    <p className="text-[10px] text-[#786154] leading-tight m-0 mt-0.5 font-normal truncate">
                      {jojoBubbleContent.desc}
                    </p>
                    {/* Pointer segitiga bubble ke arah Jojo */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white/95 border-t border-r border-[#D9CEBA] rotate-45 pointer-events-none" />
                  </motion.div>

                  {/* Maskot Jojo Memegang Titah Dalem (Bisa Diklik & Animated Bounce) */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={handleJojoTipCycle}
                    className="shrink-0 relative -mr-2 cursor-pointer"
                    title="Klik Jojo untuk tips adab & fakta budaya keraton!"
                  >
                    <img
                      src="/assets/images/mascot_kalender.webp"
                      alt="Jojo si Kurator Agenda Keraton Yogyakarta"
                      className="w-28 sm:w-32 h-auto object-contain drop-shadow-[0_14px_22px_rgba(45,24,12,0.22)] select-none pointer-events-none"
                    />
                  </motion.div>
                </div>
              </div>

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
                          (e) => parseInt(e.year || 2026, 10) === activeYear && e.monthIndex === idx
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
                    disabled={activeYear <= 2026 && activeMonth === 0}
                    aria-label="Bulan Sebelumnya"
                    className={`w-8 h-8 rounded-lg border border-[#E8DFC9] flex items-center justify-center transition-colors ${
                      activeYear <= 2026 && activeMonth === 0
                        ? 'bg-stone-100 text-stone-300 cursor-not-allowed opacity-40'
                        : 'bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#2d180c] cursor-pointer active:scale-95'
                    }`}
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

                {/* Right Mode Toggle Pills ([Bulan] [Minggu] [Hari] [Daftar]) */}
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
              </div>

              {/* Quick Vibe Pills Bar (Filter Cepat Acara) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 select-none text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <span className="text-[10px] font-bold text-[#8c532b] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8c532b]" /> Filter Cepat:
                </span>
                {VIBE_FILTERS.map((vibe) => {
                  const isActive = activeVibe === vibe.id;
                  const count = vibeCounts[vibe.id];
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setActiveVibe(isActive && vibe.id !== 'semua' ? 'semua' : vibe.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#8c532b] text-white shadow-xs font-bold'
                          : 'bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#2d180c] border border-[#E8DFC9]'
                      }`}
                    >
                      <span>{vibe.label}</span>
                      {count !== undefined && count > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#786154]'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── SUB-VIEW: BULAN (Default Monthly Matrix Grid) ── */}
              {viewTab === 'Bulan' && (
                <div className="border border-[#E8DFC9] rounded-xl bg-white relative">
                  {/* 7 Columns Weekday Header Row */}
                  <div className="grid grid-cols-7 bg-[#FAF6EE] border-b border-[#E8DFC9] text-center rounded-t-xl relative z-10">
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
                  <div className="grid grid-cols-7 divide-x divide-y divide-[#E8DFC9] bg-white relative rounded-b-xl">
                    {calendarCells.map((cell, idx) => {
                      const cellKey = `${cell.year}-${cell.month}-${cell.day}`;
                      const cellEvents = eventsByDateKey[cellKey] || [];
                      const isSelected =
                        cell.isCurrentMonth && cell.day === selectedDay;
                      const hasEvents = cellEvents.length > 0;
                      const hasKeratonEvent = cellEvents.some(e => e.category === 'Upacara Keraton');

                      return (
                                                <div
                          key={`${cellKey}-${idx}`}
                          onClick={() => {
                            if (cell.isCurrentMonth) setSelectedDay(cell.day);
                          }}
                          className={`min-h-[86px] sm:min-h-[100px] p-1.5 flex flex-col justify-between transition-all cursor-pointer relative group ${
                            !cell.isCurrentMonth
                              ? 'bg-[#FBF9F5] text-neutral-300 z-0'
                              : isSelected
                              ? 'bg-[#FAF6EE] shadow-[inset_0_0_0_2px_#8c532b] z-20'
                              : hasEvents
                              ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] shadow-[inset_0_0_0_1.5px_rgba(180,83,9,0.35)] z-20 hover:z-30 hover:shadow-[inset_0_0_0_2px_#8c532b]'
                              : 'bg-white hover:bg-[#FAF6EE]/30 z-0'
                          }`}
                        >
                          {/* Opsi 3: Cultural Burst 3D Out-of-Bounds Icon */}
                          {hasEvents && (
                            <CulturalBurstIcon category={cellEvents[0]?.category} />
                          )}

                          {/* Top Row: Pasaran Jawa (Left) & Date Number (Right) */}
                          <div className="flex items-center justify-between w-full select-none relative z-20">
                            <span
                              className={`text-[9px] tracking-tight truncate pr-0.5 transition-colors ${
                                !cell.isCurrentMonth
                                  ? 'opacity-30'
                                  : cell.pasaran === 'Kliwon'
                                  ? 'text-[#8c532b] font-bold'
                                  : cell.pasaran === 'Wage'
                                  ? 'text-[#b45309] font-bold'
                                  : 'text-[#9c8b7d] font-medium'
                              }`}
                              title={cell.isCurrentMonth ? `Weton: ${cell.pasaran}` : ''}
                            >
                              {cell.isCurrentMonth
                                ? cell.pasaran === 'Kliwon' || cell.pasaran === 'Wage'
                                  ? cell.pasaran
                                  : cell.pasaran
                                : ''}
                            </span>

                            {isSelected && cell.isCurrentMonth ? (
                              <span className="w-5 h-5 rounded-full bg-[#8c532b] text-white text-[11px] font-bold flex items-center justify-center shadow-xs shrink-0">
                                {cell.day}
                              </span>
                            ) : hasEvents && cell.isCurrentMonth ? (
                              <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/70 text-[11px] font-bold flex items-center justify-center shadow-2xs shrink-0">
                                {cell.day}
                              </span>
                            ) : (
                              <span
                                className={`text-xs font-semibold shrink-0 ${
                                  !cell.isCurrentMonth
                                    ? 'text-neutral-300'
                                    : 'text-[#2d180c]'
                                }`}
                              >
                                {cell.day}
                              </span>
                            )}
                          </div>

                          {/* Event Colored Badges inside cell */}
                          <div className="mt-1 space-y-1 overflow-hidden relative z-20">
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

          {/* ─────────────────────────────────────────────────────────────────
              MOBILE VIEW (block lg:hidden): Native Calendar App Experience
              - Ringkas, pas di layar HP, tanpa scroll panjang
              - Tanggal berbentuk lingkaran bulat (rounded-full)
              - Titik warna event sesuai kategori & cuplikan teks event mini
              - Agenda hari terpilih & Jojo pendamping langsung di bawahnya
              ───────────────────────────────────────────────────────────────── */}
          <div className="block lg:hidden space-y-3.5 mt-2">
            {/* 1. Mobile Controls Bar: Bulan Selector & Filter Button */}
            <div className="flex items-center justify-between gap-2 bg-[#FCFBF7] p-2 sm:p-2.5 rounded-2xl border border-[#E8DFC9] shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={activeYear <= 2026 && activeMonth === 0}
                  className={`w-8 h-8 rounded-xl border border-[#E8DFC9] flex items-center justify-center transition-transform ${
                    activeYear <= 2026 && activeMonth === 0
                      ? 'bg-stone-100 text-stone-300 cursor-not-allowed opacity-40'
                      : 'bg-white text-[#2d180c] hover:bg-[#FAF6EE] cursor-pointer shadow-2xs active:scale-95'
                  }`}
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="text-center px-2">
                  <span className="font-['Outfit'] text-sm font-bold text-[#2d180c] block leading-tight">
                    {MONTH_NAMES[activeMonth]} {activeYear}
                  </span>
                  <span className="text-[9px] text-[#786154] font-medium block">
                    {filteredEvents.filter((e) => e.monthIndex === activeMonth).length} Acara Bulan Ini
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-xl bg-white border border-[#E8DFC9] text-[#2d180c] flex items-center justify-center hover:bg-[#FAF6EE] cursor-pointer shadow-2xs active:scale-95 transition-transform"
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-white border border-[#E8DFC9] hover:border-[#8c532b] text-[#2d180c] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
              >
                <SlidersHorizontal size={13} className="text-[#8c532b]" />
                <span>Filter</span>
                {(selectedCategories.length < CATEGORIES_LIST.length || selectedLocation !== 'Semua' || searchQuery || activeVibe !== 'semua') && (
                  <span className="w-2 h-2 rounded-full bg-[#8c532b]" />
                )}
              </button>
            </div>

            {/* 2. Quick Vibe Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
              {VIBE_FILTERS.map((vibe) => {
                const isActive = activeVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => setActiveVibe(isActive && vibe.id !== 'semua' ? 'semua' : vibe.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#8c532b] text-white shadow-xs font-bold'
                        : 'bg-[#FCFBF7] text-[#2d180c] border border-[#E8DFC9]'
                    }`}
                  >
                    <span>{vibe.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Native Mobile Calendar Table Grid (Bulat, Titik Warna & Teks Mini) */}
            <div className="bg-[#FCFBF7] rounded-2xl border border-[#E8DFC9] relative p-2.5 shadow-xs">
              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center pb-2 border-b border-[#E8DFC9]/70 mb-1">
                {DAY_HEADERS.map((day, idx) => (
                  <span
                    key={day}
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      idx === 0 ? 'text-rose-600 font-extrabold' : 'text-[#786154]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>

              {/* 7-Columns Date Grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarCells.map((cell, idx) => {
                  const cellKey = `${cell.year}-${cell.month}-${cell.day}`;
                  const cellEvents = eventsByDateKey[cellKey] || [];
                  const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
                  const hasEvents = cellEvents.length > 0;
                  const eventSnippet = getEventSnippet(cellEvents);

                  return (
                    <div
                      key={`${cellKey}-${idx}`}
                      onClick={() => {
                        if (cell.isCurrentMonth) setSelectedDay(cell.day);
                      }}
                      className="h-[52px] sm:h-[58px] flex flex-col items-center justify-start py-0.5 cursor-pointer relative select-none overflow-visible group"
                    >
                      {/* Tanggal Bulat dengan Ikon Pop-out di Pundak Lingkaran */}
                      <div className="relative">
                        {hasEvents && (
                          <CulturalBurstIcon category={cellEvents[0]?.category} isMobile={true} />
                        )}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all relative z-20 ${
                            !cell.isCurrentMonth
                              ? 'text-neutral-300 font-normal'
                              : isSelected
                              ? 'bg-[#2d180c] text-white font-bold shadow-xs scale-105'
                              : hasEvents
                              ? 'text-[#92400E] font-bold bg-[#FEF3C7] ring-1.5 ring-[#F59E0B] shadow-2xs'
                              : 'text-[#2d180c] font-medium hover:bg-[#FAF6EE]'
                          }`}
                        >
                          {cell.day}
                        </div>
                      </div>

                      {/* Indikator Titik Warna Event Sesuai Kategori */}
                      {hasEvents && cell.isCurrentMonth && (
                        <div className="flex items-center justify-center gap-0.5 mt-0.5">
                          {cellEvents.slice(0, 2).map((ev) => {
                            const conf = CATEGORY_CONFIG[ev.category];
                            return (
                              <span
                                key={ev.id}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  conf ? conf.colorBg : 'bg-[#8c532b]'
                                }`}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Sedikit Teks Event di Bawah Tanggal (Maks 1 Baris) */}
                      {hasEvents && cell.isCurrentMonth && eventSnippet && (
                        <span
                          className={`text-[7.5px] sm:text-[8px] font-bold truncate max-w-[46px] block text-center leading-none mt-0.5 ${
                            isSelected ? 'text-[#8c532b]' : 'text-[#786154]'
                          }`}
                        >
                          {eventSnippet}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Agenda Acara Hari Terpilih Langsung di Bawah Kalender */}
            <div className="bg-[#FCFBF7] rounded-2xl border border-[#E8DFC9] p-3.5 shadow-xs space-y-3">
              {/* Header Tanggal & Weton */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8DFC9]/70">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c532b] block">
                    Agenda Terpilih
                  </span>
                  <h3 className="font-['Outfit'] text-base font-bold text-[#2d180c] m-0">
                    {selectedDay} {MONTH_NAMES[activeMonth]} {activeYear}
                  </h3>
                </div>
                {/* Pasaran Jawa Pill */}
                <span className="text-[10px] font-bold text-[#8c532b] bg-[#FAF6EE] border border-[#E8DFC9] px-2.5 py-1 rounded-full shadow-2xs">
                  Weton: {getPasaranJawa(activeYear, activeMonth, selectedDay)}
                </span>
              </div>

              {/* Event Cards for Selected Day */}
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedDayEvents.map((ev) => {
                    const conf = CATEGORY_CONFIG[ev.category] || CATEGORY_CONFIG['Upacara Keraton'];
                    return (
                      <div
                        key={ev.id}
                        onClick={() => handleOpenModal(ev)}
                        className="bg-white rounded-xl border border-[#E8DFC9] p-3 flex gap-3 items-center hover:border-[#8c532b] transition-all cursor-pointer shadow-2xs group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                          <img
                            src={ev.image || '/assets/images/real_grebeg_prajurit.jpg'}
                            alt={ev.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${conf.colorBg} ${conf.colorText} inline-block mb-1`}>
                            {ev.category}
                          </span>
                          <h4 className="font-['Outfit'] text-xs font-bold text-[#2d180c] leading-snug truncate m-0 mb-0.5">
                            {ev.name}
                          </h4>
                          <p className="text-[10px] text-[#786154] truncate m-0">
                            {ev.location} • {ev.time.split('–')[0]}
                          </p>
                        </div>
                        {/* Arrow */}
                        <span className="text-[#8c532b] text-sm font-bold shrink-0">→</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 px-2">
                  <p className="text-xs text-[#786154] m-0 mb-1">
                    Tidak ada jadwal agenda khusus pada {selectedDay} {MONTH_NAMES[activeMonth]}.
                  </p>
                  <span className="text-[10px] font-semibold text-[#8c532b]">
                    Ketuk tanggal berikon pada kalender di atas untuk melihat acara.
                  </span>
                </div>
              )}
            </div>

            {/* 5. Jojo Kurator Budaya (Kompak di Bawah Agenda) */}
            <div
              onClick={handleJojoTipCycle}
              className="bg-white rounded-2xl border border-[#E8DFC9] p-3 shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#8c532b]/50 transition-all select-none"
            >
              <img
                src="/assets/images/mascot_kalender.webp"
                alt="Jojo"
                className="w-11 h-11 object-contain shrink-0 drop-shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-extrabold text-[#8c532b] uppercase tracking-wider">
                    Tips Budaya Jojo
                  </span>
                  <span className="text-[8px] text-[#8c532b] font-bold opacity-75">
                    Ganti Tips ↷
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#2d180c] m-0 truncate">
                  {jojoBubbleContent.title}
                </p>
                <p className="text-[10px] text-[#786154] m-0 truncate">
                  {jojoBubbleContent.desc}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* ── MOBILE FILTER BOTTOM DRAWER ── */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100070] bg-black/50 backdrop-blur-xs flex items-end justify-center"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FCFBF7] rounded-t-[28px] border-t border-[#E8DFC9] w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl text-[#2d180c]"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
                  <div>
                    <h3 className="font-['Outfit'] text-base font-bold text-[#2d180c] m-0">
                      Filter Kalender Acara
                    </h3>
                    <p className="text-[11px] text-[#786154] m-0">
                      Sesuaikan kategori & wilayah agenda budaya
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-bold text-[#2d180c] cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama event..."
                    className="w-full bg-white text-xs text-[#2d180c] pl-3.5 pr-8 py-2.5 rounded-xl border border-[#E8DFC9] focus:outline-none focus:border-[#8c532b]"
                  />
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8c532b] block">
                    Kategori
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES_LIST.map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#8c532b] text-white border-[#8c532b]'
                              : 'bg-white text-[#2d180c] border-[#E8DFC9]'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          {isChecked && <span className="text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wilayah */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8c532b] block">
                    Wilayah
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCATIONS_LIST.map((loc) => {
                      const isSelected = selectedLocation === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setSelectedLocation(loc.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2d180c] text-white border-[#2d180c]'
                              : 'bg-white text-[#2d180c] border-[#E8DFC9]'
                          }`}
                        >
                          {loc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#E8DFC9] flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategories(CATEGORIES_LIST);
                      setSelectedLocation('Semua');
                      setSearchQuery('');
                      setActiveVibe('semua');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-[#E8DFC9] text-[#2d180c] text-xs font-bold cursor-pointer hover:bg-[#FAF6EE]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-2 py-2.5 rounded-xl bg-[#2d180c] text-white text-xs font-bold cursor-pointer shadow-xs hover:bg-[#432311]"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        

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
                {/* Floating Close Button: Always accessible on top */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/85 text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-all border border-white/20 shadow-md active:scale-95"
                  aria-label="Tutup"
                  title="Tutup (Esc)"
                >
                  <X size={17} />
                </button>

                {/* UNIFIED SCROLL CONTAINER (Membuat teks deskripsi meluncur ke atas menutupi foto hero saat di-scroll) */}
                <div className="flex-1 overflow-y-auto overscroll-contain relative scroll-smooth no-scrollbar">
                  {/* ── HERO BANNER SECTION ── */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-neutral-950 select-none">
                    <img
                      src={activeModalEvent.image || '/assets/images/real_grebeg_prajurit.jpg'}
                      alt={activeModalEvent.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f1107] via-[#1f1107]/45 to-black/20" />

                    {/* Top Tags: Official Certification Badges & AI Badge */}
                    <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                      {activeModalEvent.isCoE && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold border border-emerald-400/40 shadow-md">
                          <CheckCircle2 size={11} className="text-emerald-200" />
                          <span>Agenda Resmi CoE DIY 2026</span>
                        </span>
                      )}
                      {activeModalEvent.isAiGenerated && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-400/40 shadow-xs">
                          <Tag size={11} className="text-amber-300" />
                          <span>Ilustrasi AI</span>
                        </span>
                      )}
                    </div>

                    {/* Hero Bottom: Nama Acara */}
                    <div className="absolute bottom-6 left-5 right-5 text-white z-10">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight m-0 font-['Outfit'] drop-shadow-md">
                        {activeModalEvent.name}
                      </h3>
                    </div>
                  </div>

                  {/* ── CONTENT SHEET (Slides over the hero banner on scroll) ── */}
                  <div className="relative z-10 -mt-5 bg-[#FCFBF7] rounded-t-[28px] shadow-[0_-12px_28px_rgba(0,0,0,0.12)] border-t border-[#E8DFC9]/70">
                    {/* ── STICKY CLEAN SEGMENTED TAB SWITCHER ── */}
                    <div className="sticky top-0 z-20 px-4 sm:px-6 pr-14 sm:pr-16 pt-3.5 pb-2.5 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E8DFC9] rounded-t-[28px]">
                      <div className="flex items-center gap-1.5 p-1 bg-[#F5EEDC] rounded-xl border border-[#E8DFC9]">
                        {[
                          { id: 'ringkasan', label: 'Ringkasan & Makna', shortLabel: 'Ringkasan', icon: Info },
                          { id: 'adab', label: 'Adab & Tata Krama', shortLabel: 'Adab', icon: ShieldCheck },
                          { id: 'lokasi', label: 'Lokasi & Akses', shortLabel: 'Lokasi', icon: MapPin }
                        ].map((tab) => {
                          const isActive = modalTab === tab.id;
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setModalTab(tab.id)}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isActive
                                  ? 'bg-white text-[#2d180c] shadow-xs'
                                  : 'text-[#786154] hover:text-[#2d180c] hover:bg-white/40'
                                }`}
                            >
                              <Icon size={13} className={isActive ? 'text-[#8c532b]' : 'opacity-70'} />
                              <span className="hidden sm:inline truncate">{tab.label}</span>
                              <span className="sm:hidden truncate">{tab.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── SCROLLABLE BODY CONTENT ── */}
                    <div className="p-5 sm:p-6 space-y-4">
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
                                <Tag size={12} />
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
                            <div>
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

                          {/* Source Verification Card */}
                          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E8DFC9] flex items-center justify-between gap-3 text-xs text-[#786154]">
                            <div className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-[#8c532b] shrink-0" />
                              <span>
                                Sumber Terverifikasi:{' '}
                                <strong className="text-[#2d180c]">{activeModalEvent.source}</strong>
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8c532b] font-bold shrink-0">
                              Data Kalender Resmi
                            </span>
                          </div>

                          {/* Image Caption & Archival Source */}
                          <div className="p-3 rounded-xl bg-white/70 border border-[#E8DFC9]/70 text-[11px] text-[#786154] leading-relaxed">
                            {activeModalEvent.isAiGenerated ? (
                              <div className="flex items-start gap-2">
                                <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
                                <span>
                                  Visual di atas merupakan ilustrasi rekonstruksi estetika sakral untuk merepresentasikan suasana upacara adat ini.
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>
                                  Foto di atas merupakan dokumentasi asli lapangan ({activeModalEvent.imageCaption || activeModalEvent.source}).
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 2: ADAB & TATA KRAMA */}
                      {modalTab === 'adab' && (
                        <div className="space-y-4">
                          {/* Alert Notice */}
                          <div className="p-4 rounded-2xl bg-[#FFFBF0] border border-[#F3E2B8] flex items-start gap-3">
                            <AlertCircle size={18} className="text-[#B45309] shrink-0 mt-0.5" />
                            <div className="text-xs text-[#78350F] space-y-1">
                              <strong className="block text-sm font-bold text-[#92400E]">
                                Menjaga Kesakralan Upacara Adat
                              </strong>
                              <p className="m-0 leading-relaxed">
                                Mohon hormati tata tertib adat Keraton Yogyakarta demi kenyamanan bersama dan kelestarian tradisi leluhur.
                              </p>
                            </div>
                          </div>

                          {/* Clean Adab Checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-4 rounded-2xl bg-white border border-[#E8DFC9] space-y-2 shadow-2xs">
                              <div className="flex items-center gap-2 font-bold text-[#2d180c]">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                  <Check size={12} strokeWidth={2.5} />
                                </div>
                                <span>Adab Berpakaian</span>
                              </div>
                              <p className="text-[#786154] leading-relaxed m-0 pl-7">
                                Kenakan pakaian sopan, rapi, dan tertutup (batik, kemeja, atau busana tradisional). Hindari celana pendek atau kaos tanpa lengan.
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-[#E8DFC9] space-y-2 shadow-2xs">
                              <div className="flex items-center gap-2 font-bold text-[#2d180c]">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                  <Check size={12} strokeWidth={2.5} />
                                </div>
                                <span>Adab Mengambil Foto</span>
                              </div>
                              <p className="text-[#786154] leading-relaxed m-0 pl-7">
                                Matikan lampu kilat (*flash*), gunakan mode senyap (*silent*), dan jangan menghalangi jalannya arak-arakan prajurit bregada.
                              </p>
                            </div>
                          </div>

                          {/* Specific Event Advice */}
                          <div className="p-4 rounded-2xl bg-white border border-[#E8DFC9] space-y-2 shadow-2xs">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c532b] m-0">
                              Catatan Khusus untuk Agenda Ini:
                            </h4>
                            <p className="text-xs text-[#2d180c] leading-relaxed m-0">
                              {activeModalEvent.tips} Dilarang keras melangkah di atas instrumen pusaka atau memotong barisan bregada prajurit yang sedang bertugas.
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
                  </div>
                </div>

                {/* ── STICKY FOOTER ACTIONS ROW ── */}
                <div className="p-3.5 sm:p-4 bg-white border-t border-[#E8DFC9] flex flex-wrap items-center justify-between gap-2.5 shrink-0 z-30">
                  {/* Left Action Button: Salin Jadwal Sahaja */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCopySchedule(activeModalEvent)}
                      className={`py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs ${
                        copiedId === activeModalEvent.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-[#FAF6EE] hover:bg-[#F2ECE0] border-[#E8DFC9] text-[#2d180c]'
                      }`}
                      title="Salin rincian jadwal dan link deep-link ke clipboard"
                    >
                      {copiedId === activeModalEvent.id ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Jadwal & Link Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-[#8c532b]" />
                          <span>Salin Jadwal</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Action Buttons: Tutup & Tunjukkan Lokasi / Peringatan Adat */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Tutup
                    </button>

                    {activeModalEvent.isRestricted ? (
                      <div
                        className="py-2.5 px-4 rounded-xl bg-amber-950/10 border border-amber-800/30 text-amber-950 text-xs font-bold inline-flex items-center gap-2 select-none"
                        title="Upacara sakral tertutup kasultanan"
                      >
                        <ShieldAlert size={15} className="text-amber-800 shrink-0" />
                        <span>Tidak diperkenankan dikunjungi orang luar</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseModal();
                          if (onShowEventLocation) {
                            onShowEventLocation(activeModalEvent);
                          }
                        }}
                        className="py-2.5 px-4 rounded-xl bg-[#2d180c] hover:bg-[#432311] text-white text-xs font-bold inline-flex items-center gap-1.5 no-underline shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Tampilkan lokasi dan rute ke event ini di peta radar"
                      >
                        <MapPin size={14} className="text-amber-400" />
                        <span>Tunjukkan Lokasi</span>
                      </button>
                    )}
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

