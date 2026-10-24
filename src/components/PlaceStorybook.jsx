import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  X,
  Heart,
  Star,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Clock,
  ExternalLink,
  Calendar,
  Search,
  Award,
  Lock
} from 'lucide-react';
import { CULTURAL_PLACES } from '../data/culturalData';
import { CULTURAL_BADGES } from '../data/badgeQuestData';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useCultureBook } from '../context/CultureBookContext';
import ShareExperienceModal from './ShareExperienceModal';

// Theme Categories with exact Eastward template SVG icons directly from eastward.framer.website
const THEME_CATEGORIES = [
  {
    id: 'all',
    label: 'Semua Destinasi',
    subLabel: 'Semua Wilayah DIY',
    iconSrc: '/images/icon_all.svg'
  },
  {
    id: 'culture',
    label: 'Warisan Budaya',
    subLabel: 'Budaya & Sejarah',
    iconSrc: '/images/icon_culture.svg'
  },
  {
    id: 'nature',
    label: 'Wisata Alam',
    subLabel: 'Wisata Hiburan & Alam',
    iconSrc: '/images/icon_nature.svg'
  },
  {
    id: 'culinary',
    label: 'Wisata Kuliner',
    subLabel: 'Rekomendasi Kuliner Yogyakarta',
    iconSrc: '/images/icon_culinary.svg'
  },
  {
    id: 'soul',
    label: 'Tradisi dan Kehidupan',
    subLabel: 'Kampung Wisata & Krama',
    iconSrc: '/images/icon_soul.svg'
  }
];

// Data Ulasan & Foto Asli Jogja Khusus Per Destinasi (Matching Context & Authentic Jogja Photos)
const getDestinationReviewsAndPhotos = (targetPlace) => {
  const pId = targetPlace?.id || 'keraton-yogyakarta';

  if (pId === 'malioboro-tugu') {
    return {
      photos: [
        '/assets/images/jogja_tugu.jpg',
        '/assets/images/jogja_malioboro.jpg',
        '/assets/images/jogja_tugu.jpg',
        '/assets/images/jogja_malioboro.jpg'
      ],
      reviews: [
        {
          id: 'm-rev-1',
          userName: 'Arif Prasetyo',
          userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Pesona Malam Tugu Pal Putih',
          photoUrl: '/assets/images/jogja_tugu.jpg',
          comment: 'Menikmati malam di sekitar Tugu Pal Putih sambil menyeruput Kopi Joss Lik Man adalah pengalaman yang sangat otentik. Atmosfer poros utara Sumbu Filosofis terasa sangat magis.',
          date: '2026-03-05T20:10:00.000Z'
        },
        {
          id: 'm-rev-2',
          userName: 'Nabila Larasati',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Menyusuri Trotoar Malioboro & Titik Nol',
          photoUrl: '/assets/images/jogja_malioboro.jpg',
          comment: 'Pedestrian Malioboro sekarang sangat tertata dan bersih. Berjalan kaki dari stasiun hingga Titik Nol Kilometer, mampir ke Pasar Beringharjo untuk belanja batik tradisional.',
          date: '2026-03-04T18:30:00.000Z'
        },
        {
          id: 'm-rev-3',
          userName: 'Bayu Wicaksono',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kudapan Lumpia Samijaya & Angkringan',
          photoUrl: '/assets/images/jogja_malioboro.jpg',
          comment: 'Lumpia Samijaya isi telur puyuh yang disajikan panas-panas tidak pernah mengecewakan. Ditutup wedang jahe di angkringan, sempurna untuk melepas lelah.',
          date: '2026-03-02T21:15:00.000Z'
        },
        {
          id: 'm-rev-4',
          userName: 'Citra Kirana',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Harmoni Lampu Klasik & Musisi Jalanan',
          photoUrl: '/assets/images/jogja_tugu.jpg',
          comment: 'Lampu gantung temaram Malioboro dan lantunan musik akustik seniman jalanan selalu menghadirkan kerinduan mendalam untuk selalu kembali ke Jogja.',
          date: '2026-02-28T19:40:00.000Z'
        }
      ]
    };
  }

  if (pId === 'kotagede') {
    return {
      photos: [
        '/assets/images/jogja_kotagede.jpg',
        '/assets/images/jogja_batik.jpg',
        '/assets/images/jogja_kotagede.jpg',
        '/assets/images/jogja_batik.jpg'
      ],
      reviews: [
        {
          id: 'k-rev-1',
          userName: 'Pak Tejo Kusumo',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Lorong Bata Merah Masjid Gedhe Mataram 1586',
          photoUrl: '/assets/images/jogja_kotagede.jpg',
          comment: 'Menelusuri lorong kuno berdinding bata merah tanpa semen dan berziarah ke Makam Raja-Raja Mataram Islam membawa rasa takjub akan kejayaan peradaban abad ke-16.',
          date: '2026-03-06T10:15:00.000Z'
        },
        {
          id: 'k-rev-2',
          userName: 'Sekar Ayu Wandira',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kehalusan Perak Filigri Jl. Kemasan',
          photoUrl: '/assets/images/jogja_kotagede.jpg',
          comment: 'Keahlian para empu perak Kotagede merajut benang perak tipis menjadi cincin dan miniatur candi sangat mengagumkan. Wajib membawa pulang cendera mata karya lokal.',
          date: '2026-03-03T15:00:00.000Z'
        },
        {
          id: 'k-rev-3',
          userName: 'Rian Hidayat',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kudapan Manis Kipo & Bakmi Mbah Gito',
          photoUrl: '/assets/images/jogja_batik.jpg',
          comment: 'Kue Kipo legit khas Kotagede berbahan ketan hijau dan kelapa parut manis sangat lezat. Malamnya ditutup Bakmi Jawa anglo arang di Mbah Gito.',
          date: '2026-03-01T17:20:00.000Z'
        },
        {
          id: 'k-rev-4',
          userName: 'Maya Indah',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Arsitektur Eksotis Rumah Kalang',
          photoUrl: '/assets/images/jogja_kotagede.jpg',
          comment: 'Kemegahan fasad Rumah Kalang perpaduan Art Deco Eropa dan ornamen ukir kayu Jawa memperlihatkan sejarah kejayaan saudagar perak masa lampau.',
          date: '2026-02-27T13:45:00.000Z'
        }
      ]
    };
  }

  if (pId === 'merapi-kaliurang') {
    return {
      photos: [
        '/assets/images/jogja_merapi.jpg',
        '/assets/images/jogja_merapi.jpg',
        '/assets/images/jogja_merapi.jpg',
        '/assets/images/jogja_merapi.jpg'
      ],
      reviews: [
        {
          id: 'me-rev-1',
          userName: 'Bayu Pratama',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Adrenalin Lava Tour Jeep Kaliadem',
          photoUrl: '/assets/images/jogja_merapi.jpg',
          comment: 'Menembus jalur bebatuan lahar dingin Merapi dengan Jeep terbuka dan menyaksikan Bunker Kaliadem dari dekat memberikan rasa hormat mendalam pada kekuatan alam.',
          date: '2026-03-07T08:30:00.000Z'
        },
        {
          id: 'me-rev-2',
          userName: 'Ratna Sari Dewi',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Romantisme Sejarah di Museum Ullen Sentalu',
          photoUrl: '/assets/images/jogja_merapi.jpg',
          comment: 'Tur berpemandu di Ullen Sentalu membuka wawasan mendalam tentang surat cinta putri kraton dan filosofi hidup bangsawan Mataram. Suasananya sejuk dan tenteram.',
          date: '2026-03-04T11:20:00.000Z'
        },
        {
          id: 'me-rev-3',
          userName: 'Doni Kusuma',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kabut Pagi & Jembatan Gantung Plunyon',
          photoUrl: '/assets/images/jogja_merapi.jpg',
          comment: 'Pemandangan puncak Gunung Merapi yang gagah dengan latar hutan pinus dan aliran Kalikuning sangat spektakuler. Datanglah sebelum pukul 07.00 pagi.',
          date: '2026-03-02T06:45:00.000Z'
        },
        {
          id: 'me-rev-4',
          userName: 'Eka Prasetya',
          userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Legit Hangat Jadah Tempe Mbok Carik',
          photoUrl: '/assets/images/jogja_merapi.jpg',
          comment: 'Kombinasi ketan putih gurih dan tempe bacem manis hangat kegemaran Sri Sultan HB IX adalah santapan wajib saat berhawa dingin di Kaliurang.',
          date: '2026-02-26T16:10:00.000Z'
        }
      ]
    };
  }

  if (pId === 'prambanan-ratuboko') {
    return {
      photos: [
        '/assets/images/jogja_prambanan.jpg',
        '/assets/images/jogja_ratuboko.jpg',
        '/assets/images/jogja_prambanan.jpg',
        '/assets/images/jogja_ratuboko.jpg'
      ],
      reviews: [
        {
          id: 'p-rev-1',
          userName: 'Laksmi Dewi',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Magis Sendratari Ramayana Panggung Terbuka',
          photoUrl: '/assets/images/jogja_prambanan.jpg',
          comment: 'Menyaksikan Hanoman Obong dengan lingkaran api nyata berlatar Candi Siwa yang disorot lampu malam adalah salah satu pertunjukan terbaik di Asia Tenggara.',
          date: '2026-03-06T19:30:00.000Z'
        },
        {
          id: 'p-rev-2',
          userName: 'Wisnu Wardhana',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Senja Emas Gerbang Keraton Ratu Boko',
          photoUrl: '/assets/images/jogja_ratuboko.jpg',
          comment: 'Matahari terbenam tepat di bingkai gerbang batu paduraksa Ratu Boko menghadap dataran Prambanan adalah momen fotografi yang luar biasa indah.',
          date: '2026-03-03T17:45:00.000Z'
        },
        {
          id: 'p-rev-3',
          userName: 'Cahyo Nugroho',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Relief Epos Ramayana Candi Siwa 47 Meter',
          photoUrl: '/assets/images/jogja_prambanan.jpg',
          comment: 'Detail pahatan relief batu andesit abad ke-9 pada dinding Candi Siwa sangat presisi. Menyusuri lorong pradaksina memberikan penghormatan mendalam pada leluhur.',
          date: '2026-03-01T09:20:00.000Z'
        },
        {
          id: 'p-rev-4',
          userName: 'Sintia Maya',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Ayam Goreng Kremes Kalasan Mbok Berek',
          photoUrl: '/assets/images/jogja_prambanan.jpg',
          comment: 'Setelah menjelajahi Prambanan, santap siang dengan ayam goreng kalasan bercita rasa manis gurih dan sambal terasi menjadi pelengkap sempurna.',
          date: '2026-02-28T12:40:00.000Z'
        }
      ]
    };
  }

  if (pId === 'wijilan-prawirotaman') {
    return {
      photos: [
        '/assets/images/jogja_gudeg.jpg',
        '/assets/images/jogja_batik.jpg',
        '/assets/images/jogja_gudeg.jpg',
        '/assets/images/jogja_keraton.jpg'
      ],
      reviews: [
        {
          id: 'w-rev-1',
          userName: 'Bu Tri Wahyuni',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Gudeg Kering Khas Wijilan Harum Kayu Bakar',
          photoUrl: '/assets/images/jogja_gudeg.jpg',
          comment: 'Kelezatan gudeg kering Wijilan dengan areh santan kental gurih dan sambal krecek pedas manis sangat otentik. Beli dalam kendil tanah liat sangat awet untuk oleh-oleh.',
          date: '2026-03-05T11:30:00.000Z'
        },
        {
          id: 'w-rev-2',
          userName: 'Rendy Pratama',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kafe Seni & Gelato Dingin di Prawirotaman',
          photoUrl: '/assets/images/jogja_gudeg.jpg',
          comment: 'Kawasan Prawirotaman memiliki atmosfer bohemian yang unik. Menikmati gelato sore hari setelah berjalan kaki keliling kampung seni sangat menyegarkan.',
          date: '2026-03-02T16:45:00.000Z'
        }
      ]
    };
  }

  if (pId === 'kasongan-imogiri') {
    return {
      photos: [
        '/assets/images/jogja_batik.jpg',
        '/assets/images/jogja_keraton.jpg',
        '/assets/images/jogja_batik.jpg',
        '/assets/images/jogja_kotagede.jpg'
      ],
      reviews: [
        {
          id: 'ks-rev-1',
          userName: 'Bambang Sutrisno',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Seni Gerabah Tanah Liat Kasongan yang Mendunia',
          photoUrl: '/assets/images/jogja_batik.jpg',
          comment: 'Melihat langsung tangan terampil para perajin Kasongan memutar tanah liat menjadi guci artistik dan terakota dekoratif adalah bukti luhurnya tradisi seni rupa Bantul.',
          date: '2026-03-04T13:15:00.000Z'
        },
        {
          id: 'ks-rev-2',
          userName: 'Nurul Hidayati',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Keheningan Ratusan Anak Tangga Makam Imogiri',
          photoUrl: '/assets/images/jogja_keraton.jpg',
          comment: 'Menaiki ratusan anak tangga batu andesit menuju pusara Sultan Agung di puncak Bukit Pajimatan memberikan getaran spiritual dan rasa khidmat yang mendalam.',
          date: '2026-03-01T15:20:00.000Z'
        }
      ]
    };
  }

  if (pId === 'parangtritis-gunungkidul') {
    return {
      photos: [
        '/assets/images/jogja_parangtritis.jpg',
        '/assets/images/jogja_tamansari.jpg',
        '/assets/images/jogja_parangtritis.jpg',
        '/assets/images/jogja_merapi.jpg'
      ],
      reviews: [
        {
          id: 'pt-rev-1',
          userName: 'Fajar Nugraha',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Ombak Samudra Hindia & Sunset Paralayang Watugupit',
          photoUrl: '/assets/images/jogja_parangtritis.jpg',
          comment: 'Menatap luasnya cakrawala Samudra Hindia dari atas bukit tebing karst saat senja tiba adalah salah satu pemandangan matahari terbenam paling spektakuler di tanah Jawa.',
          date: '2026-03-06T18:00:00.000Z'
        },
        {
          id: 'pt-rev-2',
          userName: 'Anisa Maharani',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Pesona Gurun Pasir Gumuk Pasir Barchan',
          photoUrl: '/assets/images/jogja_parangtritis.jpg',
          comment: 'Fenomena langka gumuk pasir barchan satu-satunya di Asia Tenggara. Sangat mengesankan untuk fotografi dan merasakan keunikan bentang alam selatan Jogja.',
          date: '2026-03-03T16:30:00.000Z'
        }
      ]
    };
  }

  // DEFAULT: KERATON NGAYOGYAKARTA & TAMANSARI
  return {
    photos: [
      '/assets/images/jogja_keraton.jpg',
      '/assets/images/jogja_tamansari.jpg',
      '/assets/images/jogja_batik.jpg',
      '/assets/images/jogja_gudeg.jpg'
    ],
    reviews: [
      {
        id: 'default-rev-1',
        userName: 'Raden Mas Haryo',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Ketenangan Pelataran Kedhaton & Bangsal Kencono',
        photoUrl: '/assets/images/jogja_keraton.jpg',
        comment: 'Menyaksikan langsung ketenangan para Abdi Dalem dan orkestrasi Gamelan Sekaten membawa kedamaian batin luar biasa. Falsafah Hamemayu Hayuning Bawana benar-benar terasa di setiap jengkal pelataran pasir halus.',
        date: '2026-03-06T09:20:00.000Z'
      },
      {
        id: 'default-rev-2',
        userName: 'Dewi Kartikasari',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Akustik Magis Sumur Gumuling Tamansari',
        photoUrl: '/assets/images/jogja_tamansari.jpg',
        comment: 'Arsitektur Sumur Gumuling di Tamansari sangat memukau secara akustik. Pastikan menyewa jasa pemandu lokal agar memahami lorong bawah tanah dan makna simbolis kanal air zaman Sri Sultan Hamengkubuwono I.',
        date: '2026-03-04T14:45:00.000Z'
      },
      {
        id: 'default-rev-3',
        userName: 'Dimas Suryo',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Filosofi Canting & Batik Tulis Jeron Beteng',
        photoUrl: '/assets/images/jogja_batik.jpg',
        comment: 'Menyelami filosofi motif Parang dan Kawung langsung dari para pembatik sepuh di Jeron Beteng memberikan perspektif baru tentang kesabaran, tata krama, dan kehalusan budi krama Yogyakarta.',
        date: '2026-03-02T16:15:00.000Z'
      },
      {
        id: 'default-rev-4',
        userName: 'Ibu Kuswanto',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Gastronomi Pusaka Bale Raos & Gudeg Wijilan',
        photoUrl: '/assets/images/jogja_gudeg.jpg',
        comment: 'Mencicipi Bebek Suwar-Suwir dan Bir Jawa di Bale Raos di Magangan Kulon, lalu ditutup Gudeg Yu Djum Wijilan yang dimasak kayu bakar 12 jam. Cita rasa sejati warisan raja Mataram.',
        date: '2026-02-28T13:10:00.000Z'
      }
    ]
  };
};

export default function PlaceStorybook({ place, places = CULTURAL_PLACES, onBack, onSelectPlace, onOpenCultureBook }) {
  const [activeTheme, setActiveTheme] = useState('all');
  const [activeMapPlace, setActiveMapPlace] = useState(place || CULTURAL_PLACES[0]);
  const [isInquireOpen, setIsInquireOpen] = useState(false);
  const [inquireSuccess, setInquireSuccess] = useState(false);
  const [inquireForm, setInquireForm] = useState({ name: '', email: '', message: '' });

  // Auth, Community & CultureBook Benefit Hooks
  const { currentUser, requireAuth, openLogin } = useAuth();
  const { isFavorite, toggleFavorite } = useCultureBook();
  const {
    reviews,
    getPlaceReviews,
    addReview,
    deleteReview,
    toggleLikeReview,
    getPlaceRatingSummary
  } = useCommunity();

  // State for Community & Experience Modal + Eastward Sticky Scroll Reels
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [revScrollProgress, setRevScrollProgress] = useState(0);
  const revRunwayRef = useRef(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewFilterRating, setReviewFilterRating] = useState('all');

  // State untuk Mengunjungi Profil Akun Pengulas & Realtime Clock Ticker
  const [visitedUser, setVisitedUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [profileTab, setProfileTab] = useState('ulasan');
  const [showContributeBanner, setShowContributeBanner] = useState(true);
  const [expandedBio, setExpandedBio] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState({});
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState([
    'badge-keraton-kedhaton',
    'badge-malioboro-stroll',
    'badge-kotagede-silver'
  ]);

  const togglePinBadge = (badgeId) => {
    setPinnedBadgeIds((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  // Real-time clock ticker yang mengupdate detik & menit secara otomatis
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Waktu Relatif untuk Komentar Pengunjung (Update Realtime Otomatis)
  const formatReviewTime = (isoString) => {
    if (!isoString) return 'Baru saja';
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((currentTime - date.getTime()) / 1000);
      if (diffSec < 15) return 'Baru saja';
      if (diffSec < 60) return `${diffSec} detik yang lalu`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} menit yang lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} jam yang lalu`;
      const diffDays = Math.floor(diffHour / 24);
      if (diffDays < 7) return `${diffDays} hari yang lalu`;
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Baru saja';
    }
  };

  // Wishlist Action Handler (Fitur Benefit 1)
  const handleWishlistToggle = (targetPlace) => {
    if (!targetPlace) return;
    requireAuth(() => {
      toggleFavorite(targetPlace.id);
    }, {
      benefitType: 'wishlist',
      title: 'Simpan ke Wishlist Budaya',
      description: `Masuk ke akun Anda untuk menyimpan ${targetPlace.name} ke daftar Wishlist pribadi Anda.`
    });
  };

  // Review & Rating Submit Handler (Fitur Ulasan Komentar Pengunjung Asli)
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewError('');

    // Guest hanya boleh melihat ulasan, tidak boleh submit komentar tanpa akun
    if (!currentUser || currentUser.isGuest) {
      setReviewError('Mode Tamu hanya dapat membaca ulasan. Silakan masuk atau buat akun terlebih dahulu untuk menulis ulasan.');
      openLogin({
        benefitType: 'review',
        title: 'Buat Akun untuk Mengulas',
        description: 'Sebagai Tamu, Anda bebas membaca seluruh ulasan penjelajah. Untuk menulis ulasan dan memberikan penilaian bintang, silakan buat akun atau masuk terlebih dahulu.'
      });
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError('Silakan tuliskan komentar ulasan Anda.');
      return;
    }

    const targetPlaceId = activeMapPlace?.id || place?.id || 'keraton-yogyakarta';

    addReview({
      placeId: targetPlaceId,
      rating: userRating,
      comment: reviewComment.trim(),
      headline: `Pengalaman oleh ${currentUser.name}`,
      user: currentUser
    });

    setActiveReviewIdx(0);
    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setIsReviewFormOpen(false);
    }, 2000);
  };

  // Hapus Ulasan Sendiri
  const handleDeleteReview = (revId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      deleteReview(revId);
    }
  };

  // Sinkronisasi activeMapPlace jika prop place berubah
  useEffect(() => {
    if (place) {
      setActiveMapPlace(place);
      setActiveReviewIdx(0);
    }
  }, [place]);

  // Handle ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isInquireOpen) setIsInquireOpen(false);
        else onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, isInquireOpen]);

  // Current hero image: bright natural landscape
  const heroImage =
    activeMapPlace?.coverImage ||
    place?.coverImage ||
    '/assets/images/jogja_keraton.jpg';

  const handleInquireSubmit = (e) => {
    e.preventDefault();
    setInquireSuccess(true);
    setTimeout(() => {
      setInquireSuccess(false);
      setIsInquireOpen(false);
      setInquireForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter places based on selected Theme tab
  const filteredPlaces = places.filter((p) => {
    if (activeTheme === 'all') return true;
    if (p.categoryTheme && p.categoryTheme.includes(activeTheme)) return true;
    return false;
  });

  // Handler for Eastward sticky vertical-scroll-to-horizontal-reel mechanics
  const handleStorybookScroll = () => {
    if (revRunwayRef.current) {
      const rect = revRunwayRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable > 0) {
        const p = Math.min(1, Math.max(0, -rect.top / scrollable));
        setRevScrollProgress(p);
      }
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onScroll={handleStorybookScroll}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
      id="storybook-viewport"
      className="storybook-main-container"
    >
      {/* =========================================================================
          SECTION 1: HERO VIEW (100VH - FOKUS 100% PADA DESTINASI TERPILIH)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}
      >
        {/* Full-bleed background photo (Foto Asli Jogja Sesuai Tempat Terpilih) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src={heroImage}
            alt={activeMapPlace.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 38%',
              display: 'block'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,0.88) 100%)'
            }}
          />
        </div>

        {/* Hero Editorial Statement: Fokus ke Destinasi Terpilih */}
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            padding: '0 clamp(2rem, 5vw, 5rem) clamp(3.5rem, 8vh, 6rem) clamp(2rem, 5vw, 5rem)',
            maxWidth: '1080px'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'stretch', gap: 'clamp(1.2rem, 2vw, 1.8rem)' }}
          >
            {/* Signature Solid White Vertical Bar */}
            <div
              style={{
                width: '4px',
                backgroundColor: '#ffffff',
                borderRadius: '2px',
                flexShrink: 0,
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.6)'
              }}
            />

            <div>
              {/* Badge Kategori Budaya */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(197, 144, 78, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                }}
              >
                <Sparkles size={13} />
                <span>{activeMapPlace.badges?.[0] || 'WARISAN BUDAYA D.I. YOGYAKARTA'}</span>
              </div>

              {/* Judul Besar Destinasi */}
              <h1
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '0.01em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  margin: '0 0 1rem 0',
                  textShadow: '0 4px 28px rgba(0, 0, 0, 0.7)'
                }}
              >
                {activeMapPlace.name}
              </h1>

              {/* Subjudul Filosofis */}
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.08rem, 1.6vw, 1.35rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1.6,
                  maxWidth: '780px',
                  margin: '0 0 1.25rem 0',
                  textShadow: '0 2px 18px rgba(0, 0, 0, 0.8)'
                }}
              >
                {activeMapPlace.subtitle}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2B: HARMONI MASYARAKAT, SENI BUDAYA & GASTRONOMI PUSAKA
          ========================================================================= */}
      {activeMapPlace.chapter03?.cultureElements && (
        <section
          style={{
            backgroundColor: '#FAF8F5',
            borderTop: '1px solid #EFEAE2',
            borderBottom: '1px solid #EFEAE2',
            padding: '5rem clamp(1.5rem, 5vw, 4rem)'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#c5904e',
                  display: 'block',
                  marginBottom: '0.65rem'
                }}
              >
                Bab 02 & 03 • Ragam Pusaka Budaya
              </span>

              <h2
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
                  fontWeight: 800,
                  color: '#131021',
                  margin: '0 0 1rem 0'
                }}
              >
                {activeMapPlace.chapter03?.tagline || 'Seni Sakral, Adat Tradisi, & Gastronomi Pusaka'}
              </h2>

              {activeMapPlace.chapter02?.philosophy && (
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    margin: 0
                  }}
                >
                  Falsafah Luhur: &ldquo;{activeMapPlace.chapter02.philosophy}&rdquo;
                </p>
              )}
            </div>

            {/* Konsep Foto Gantung Tali Jemuran & Jepitan Kayu */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                paddingTop: '20px',
                paddingBottom: '50px'
              }}
            >
              {/* CSS Scoped untuk Efek Hover & Typography Persis Framer */}
              <style>{`
                .rope-card-item {
                  position: relative;
                  transform-origin: top center;
                  cursor: pointer;
                  user-select: none;
                }
                .rope-card-face {
                  position: relative;
                  width: 100%;
                  aspect-ratio: 0.8;
                  border-radius: 18px;
                  overflow: hidden;
                  background-color: #ECE7E0;
                  box-shadow: 0 1px 2px rgba(24, 18, 12, 0.07), 0 12px 24px -14px rgba(24, 18, 12, 0.26), 0 34px 64px -34px rgba(24, 18, 12, 0.3);
                  border: 1px solid rgba(24, 18, 12, 0.05);
                  transition: box-shadow 0.5s ease;
                }
                .rope-card-face:hover {
                  box-shadow: 0 2px 4px rgba(24, 18, 12, 0.08), 0 18px 32px -12px rgba(24, 18, 12, 0.32), 0 40px 70px -30px rgba(24, 18, 12, 0.38);
                }
                .rope-card-face img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                  transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
                }
                .rope-card-face:hover img {
                  transform: scale(1.045);
                }
                .rope-card-shade {
                  position: absolute;
                  inset: 0;
                  pointer-events: none;
                  background: linear-gradient(to top, rgba(14, 12, 10, 0.75) 0%, rgba(14, 12, 10, 0.22) 42%, rgba(14, 12, 10, 0) 70%);
                  opacity: 0;
                  transition: opacity 0.45s ease;
                }
                .rope-card-face:hover .rope-card-shade {
                  opacity: 1;
                }
                .rope-card-cap {
                  position: absolute;
                  left: 20px;
                  right: 20px;
                  bottom: 20px;
                  pointer-events: none;
                  opacity: 0;
                  transform: translateY(10px);
                  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
                }
                .rope-card-face:hover .rope-card-cap {
                  opacity: 1;
                  transform: translateY(0);
                  transition-delay: 0.05s;
                }
                @media (hover: none) {
                  .rope-card-shade { opacity: 1; }
                  .rope-card-cap { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Tali Jemuran Melengkung Penuh Ujung ke Ujung Layar (Full Edge-to-Edge Rope) */}
              <svg
                viewBox="-80 0 1360 170"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-4vw',
                  width: '108vw',
                  height: '170px',
                  pointerEvents: 'none',
                  zIndex: 2,
                  overflow: 'visible'
                }}
              >
                {/* Bayangan Tali Halus */}
                <path d="M -80 18 Q 600 162 1280 18" stroke="rgba(24, 18, 12, 0.09)" strokeWidth="3.5" fill="none" />
                {/* Garis Dasar Tali */}
                <path d="M -80 16 Q 600 160 1280 16" stroke="#A89E92" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                {/* Tekstur Serat Anyaman Tali (Braid) */}
                <path d="M -80 16 Q 600 160 1280 16" stroke="#7A6E62" strokeWidth="1.8" fill="none" strokeDasharray="5,4" />
              </svg>

              {/* Kontainer Kartu yang Menempel & Terjepit Rapi di Tali */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: 'clamp(1.5rem, 3.5vw, 3rem)',
                  flexWrap: 'wrap',
                  maxWidth: '1240px',
                  margin: '0 auto',
                  padding: '0 1.5rem'
                }}
              >
                {activeMapPlace.chapter03.cultureElements.map((elem, eIdx) => {
                  // Perhitungan Geometris Posisi Tali & Sudut Kemiringan (Sesuai Kurva Framer)
                  // Card 0 (Kiri): Rope Y = 64px, Tilt = -4.5deg
                  // Card 1 (Tengah): Rope Y = 88px, Tilt = 0deg (Menurun mengikuti lengkungan tali)
                  // Card 2 (Kanan): Rope Y = 64px, Tilt = 4.5deg
                  const ropeYPoints = [64, 88, 64];
                  const tilts = [-4.5, 0, 4.5];
                  const ropeY = ropeYPoints[eIdx % ropeYPoints.length];
                  const naturalTilt = tilts[eIdx % tilts.length];
                  
                  // Agar jepitan pas menempel di tali (notch di 13px) dan menjepit foto (grip di 34px):
                  // Jarak dari titik tali ke tepi atas kartu foto = 34 - 13 = 21px
                  const cardMarginTop = ropeY + 21;

                  return (
                    <div
                      key={eIdx}
                      className="rope-card-item"
                      style={{
                        marginTop: `${cardMarginTop}px`,
                        width: 'clamp(280px, 28vw, 340px)',
                        transform: `rotate(${naturalTilt}deg)`
                      }}
                    >
                      {/* Jepitan Kayu Asli Framer (Menempel Pas di Tali & Menjepit Kartu) */}
                      <div
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                          left: 'calc(50% - 10px)',
                          top: '-34px',
                          width: '20px',
                          height: '54px',
                          pointerEvents: 'none',
                          filter: 'drop-shadow(0 4px 6px rgba(24, 18, 12, 0.28))'
                        }}
                      >
                        <svg viewBox="0 0 18 50" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                          {/* Badan Kayu Terracotta */}
                          <path d="M4 0 H14 A2 2 0 0 1 16 2 V47 A3 3 0 0 1 13 50 H5 A3 3 0 0 1 2 47 V2 A2 2 0 0 1 4 0 Z" fill="#D0724F" />
                          {/* Highlight Kilau Kiri */}
                          <path d="M4 0 H6 V50 H5 A3 3 0 0 1 2 47 V2 A2 2 0 0 1 4 0 Z" fill="#fff" opacity="0.22" />
                          {/* Bayangan Sisi Kanan */}
                          <path d="M13 0 H14 A2 2 0 0 1 16 2 V47 A3 3 0 0 1 13 50 Z" fill="#000" opacity="0.12" />
                          {/* Celah Jepitan Bawah */}
                          <path d="M9 30 V49.5" stroke="#000" strokeOpacity="0.22" strokeWidth="0.9" />
                          {/* Cincin Pegas Metal Emas */}
                          <rect x="0.5" y="19" width="17" height="6" rx="2" fill="#E4CFA6" />
                          {/* Garis Kawat Pegas */}
                          <path d="M4 19.6 V24.4 M7 19.6 V24.4 M10 19.6 V24.4 M13 19.6 V24.4" stroke="#000" strokeOpacity="0.2" strokeWidth="0.7" />
                          {/* Kilau Pegas */}
                          <rect x="1" y="19.3" width="16" height="1.3" rx="0.65" fill="#fff" opacity="0.55" />
                        </svg>
                      </div>

                      {/* Bayangan Kontak Jepitan di Atas Permukaan Foto */}
                      <div
                        style={{
                          position: 'absolute',
                          zIndex: 6,
                          left: 'calc(50% - 15px)',
                          top: 0,
                          width: '30px',
                          height: '14px',
                          pointerEvents: 'none',
                          background: 'radial-gradient(ellipse at 50% 0%, rgba(24, 18, 12, 0.32), rgba(24, 18, 12, 0) 70%)'
                        }}
                      />

                      {/* Kartu Foto Persis Framer (Clean Foto, Reveal Scrim & Text Saat Kursor Sentuh) */}
                      <div className="rope-card-face">
                        {/* Foto Full-Bleed */}
                        <img
                          src={elem.image || activeMapPlace.coverImage}
                          alt={elem.name}
                          loading="lazy"
                        />

                        {/* Scrim Gradien Hitam Halus yang Muncul Saat Hover */}
                        <div className="rope-card-shade" />

                        {/* Teks Judul & Keterangan Muncul Halus Meluncur Naik Saat Hover */}
                        <div className="rope-card-cap">
                          <div
                            style={{
                              fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              fontSize: '21px',
                              fontWeight: 600,
                              color: '#FFFFFF',
                              letterSpacing: '-0.01em',
                              lineHeight: 1.2,
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {elem.name}
                          </div>
                          {(elem.detail || elem.description) && (
                            <div
                              style={{
                                fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                fontSize: '13px',
                                fontWeight: 400,
                                color: 'rgba(255, 255, 255, 0.84)',
                                letterSpacing: '0em',
                                lineHeight: 1.4,
                                marginTop: '4px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {elem.detail || elem.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: JELAJAHI DESTINASI JOGJA LAINNYA (INTERACTIVE SWITCHER)
          ========================================================================= */}
      <section
        id="themes-segment"
        style={{
          backgroundColor: '#ffffff',
          padding: '5rem clamp(1.5rem, 5vw, 4rem) 5rem clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#c5904e',
              display: 'block',
              marginBottom: '0.65rem'
            }}
          >
            Peta Wilayah D.I. Yogyakarta
          </span>
          <h2
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
              fontWeight: 800,
              color: '#131021',
              margin: '0 0 0.75rem 0'
            }}
          >
            Jelajahi Sudut Budaya Jogja Lainnya
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#6b7280' }}>
            Klik destinasi di bawah untuk langsung memuat cerita, foto asli, dan ulasan komunitasnya.
          </p>
        </div>
        {/* Exact Eastward Navigation: Icon on top, Text below, Red/Berry underline for active */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            flexWrap: 'wrap',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            marginBottom: '4.5rem'
          }}
        >
          {THEME_CATEGORIES.map((tab) => {
            const isActive = activeTheme === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTheme(tab.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 0.5rem 0.7rem 0.5rem',
                  position: 'relative',
                  color: isActive ? '#131021' : '#686770',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#131021';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#686770';
                }}
              >
                {/* Exact Eastward Template SVG Icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isActive ? 0.95 : 0.62,
                    transition: 'opacity 0.2s ease, transform 0.2s ease'
                  }}
                >
                  <img
                    src={tab.iconSrc}
                    alt={tab.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>

                {/* Tab Label */}
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {tab.label}
                </span>

                {/* Berry / Red active underline matching user screenshot */}
                {isActive && (
                  <motion.div
                    layoutId="activeThemeUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      backgroundColor: '#9e1c64',
                      borderRadius: '1px'
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Exact Eastward 3-Column Image Cards Grid with dark gradient, vertical line, serif title */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '1.75rem',
            marginBottom: '4rem'
          }}
        >
          {filteredPlaces.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              onClick={() => {
                if (onSelectPlace) onSelectPlace(dest);
                setActiveMapPlace(dest);
                const viewport = document.getElementById('storybook-viewport');
                if (viewport) viewport.scrollTo({ top: 0, behavior: 'smooth' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                cursor: 'pointer',
                position: 'relative',
                height: '460px',
                borderRadius: '0px',
                overflow: 'hidden',
                backgroundColor: '#111019',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }}
              className="group"
            >
              {/* Image with zoom effect */}
              <img
                src={dest.coverImage || dest.thumbnail}
                alt={dest.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.18s ease-out'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.025)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              />

              {/* Exact Eastward dark bottom gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0.95) 100%)',
                  pointerEvents: 'none'
                }}
              />

              {/* Wishlist Heart Button (Fitur Benefit 1) */}
              <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 10 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(dest);
                  }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isFavorite(dest.id) ? '#e11d48' : 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                  title={isFavorite(dest.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist (Benefit Member)'}
                >
                  <Heart size={16} fill={isFavorite(dest.id) ? '#ffffff' : 'none'} color="#ffffff" />
                </button>
              </div>

              {/* Bottom Left: Vertical bar + All-caps Title + Region/Ticket */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2.2rem',
                  left: '2rem',
                  right: '2rem',
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: '1rem',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              >
                {/* Thin vertical accent bar */}
                <div
                  style={{
                    width: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    borderRadius: '1px',
                    flexShrink: 0
                  }}
                />

                <div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                      fontSize: '1.55rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: 1.15,
                      margin: '0 0 0.35rem 0',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {dest.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.82)',
                      textTransform: 'uppercase',
                      margin: 0
                    }}
                  >
                    {dest.regionLabel || 'D.I. YOGYAKARTA'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ULASAN & TESTIMONI KOMENTAR - EXACT EASTWARD "DAY BY DAY" STICKY SCROLL REEL
          ========================================================================= */}
      {(() => {
        const placeId = activeMapPlace ? activeMapPlace.id : place?.id || 'keraton-yogyakarta';
        const placeRevs = getPlaceReviews(placeId);
        const summary = getPlaceRatingSummary(placeId);

        const destPack = getDestinationReviewsAndPhotos(activeMapPlace);
        const fallbackPhotos = destPack.photos;
        const baseReviews = destPack.reviews;

        const mappedRevs =
          placeRevs && placeRevs.length > 0
            ? placeRevs.map((r, i) => ({
                ...r,
                photoUrl: r.photoUrl || fallbackPhotos[i % fallbackPhotos.length],
                headline: r.headline || `Catatan Perjalanan — ${r.userName}`
              }))
            : baseReviews;

        const items =
          mappedRevs.length >= 4
            ? mappedRevs
            : [...mappedRevs, ...baseReviews.slice(mappedRevs.length)];

        const maxRevIdx = Math.max(1, items.length - 1);
        const floatRevIdx = revScrollProgress * maxRevIdx;
        const activeRevIdx = Math.min(items.length - 1, Math.round(floatRevIdx));
        const currentRev = items[activeRevIdx] || items[0];
        const revReelCards = [...items.slice(1), ...items];

        return (
          <div
            id="cultural-reviews"
            ref={revRunwayRef}
            style={{
              height: `${items.length * 75}vh`,
              position: 'relative',
              backgroundColor: '#ffffff',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            <section
              style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                gridTemplateRows: '1fr auto',
                gap: 'clamp(15px, 14.23px + 0.24vw, 20px)',
                paddingTop: '88px',
                paddingBottom: '28px',
                paddingInline: 'clamp(20px, 15.38px + 1.44vw, 50px)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
              {/* TOP-RIGHT OVERLAPPING "DAY BY DAY" HEADLINE + SUBTITLE + #9E1C64 BADGE */}
              <div
                style={{
                  gridColumn: '9 / span 3',
                  gridRow: '1 / 2',
                  position: 'absolute',
                  top: '-58px',
                  left: '-22px',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Tenor Sans', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(52px, 4.4vw, 84px)',
                    fontWeight: 400,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.95,
                    textTransform: 'uppercase',
                    color: '#15131b',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {'DAY BY\nDAY'}
                </h2>

                <p
                  style={{
                    margin: '8px 0 0 2px',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(14px, 1.15vw, 17.5px)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#15131b',
                    whiteSpace: 'nowrap'
                  }}
                >
                  A journey through tradition, beauty, and time.
                </p>

                {/* Exact Eastward Calendar / Counter Badge with Realtime Date Synchronization */}
                {(() => {
                  const activeDate = currentRev?.date ? new Date(currentRev.date) : new Date(currentTime);
                  const activeMonthShort = activeDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
                  const isTodayActive = activeDate.toDateString() === new Date(currentTime).toDateString();

                  return (
                    <div>
                      <div
                        style={{
                          width: '104px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          textAlign: 'center',
                          marginTop: '18px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: '#9E1C64',
                            color: '#ffffff',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            padding: '4px 0',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>DAY</span>
                          <span style={{ opacity: 0.7 }}>•</span>
                          <span>{activeMonthShort}</span>
                        </div>
                        <div
                          style={{
                            backgroundColor: '#FAF8F5',
                            color: '#15131b',
                            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                            fontSize: '36px',
                            fontWeight: 700,
                            height: '58px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <div
                            style={{
                              transform: `translate3d(0, -${floatRevIdx * 58}px, 0)`,
                              transition: 'transform 0.08s linear',
                              willChange: 'transform'
                            }}
                          >
                            {items.map((it, idx) => {
                              const itDate = it.date ? new Date(it.date) : new Date(currentTime);
                              const itDayStr = String(itDate.getDate()).padStart(2, '0');
                              return (
                                <div
                                  key={it.id + '-revnum'}
                                  style={{
                                    height: '58px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1
                                  }}
                                >
                                  {itDayStr}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Realtime Live Date Badge */}
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '999px',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#2C221E',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isTodayActive ? '#16A34A' : '#C99B52',
                            display: 'inline-block'
                          }}
                        />
                        <span>
                          {isTodayActive
                            ? `Hari Ini • ${activeDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
                            : activeDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* LEFT WIDE LANDSCAPE PHOTO (Grid Columns 1..7, Row 1) */}
              <div
                style={{
                  gridColumn: '1 / 8',
                  gridRow: '1 / 2',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#131021'
                }}
              >
                {items.map((it, idx) => (
                  <div
                    key={it.id + '-rev-left'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: idx === activeRevIdx ? 1 : 0,
                      transition: 'opacity 0.25s ease',
                      willChange: 'opacity',
                      zIndex: idx === activeRevIdx ? 2 : 1
                    }}
                  >
                    <img
                      src={it.photoUrl}
                      alt={it.headline}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* RIGHT HORIZONTAL PORTRAIT REEL (.schedule-reel, Grid Columns 8..13, Row 1) */}
              <div
                style={{
                  gridColumn: '8 / -1',
                  gridRow: '1 / 2',
                  alignSelf: 'end',
                  height: 'calc(100% - 34px)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div
                  className="schedule-reel"
                  style={{
                    display: 'flex',
                    gap: '20px',
                    height: '100%',
                    alignItems: 'stretch',
                    transform: `translate3d(calc(-${floatRevIdx} * (clamp(240px, 19.5vw, 320px) + 20px)), 0, 0)`,
                    transition: 'transform 0.08s linear',
                    willChange: 'transform'
                  }}
                >
                  {revReelCards.map((card, rIdx) => {
                    const isFrontSlot = Math.round(floatRevIdx) === rIdx;
                    return (
                      <div
                        key={card.id + '-revreel-' + rIdx}
                        style={{
                          flex: '0 0 clamp(240px, 19.5vw, 320px)',
                          height: '100%',
                          overflow: 'hidden',
                          backgroundColor: '#e5e5e5',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={card.photoUrl}
                          alt={card.headline}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            filter: isFrontSlot ? 'grayscale(100%) contrast(1.04)' : 'grayscale(0%)',
                            transition: 'filter 0.35s ease'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM-LEFT TESTIMONIAL CONTENT (.schedule-content, Grid Columns 1..7, Row 2) */}
              <div
                style={{
                  gridColumn: '1 / 8',
                  gridRow: '2',
                  paddingTop: '14px',
                  paddingRight: '12px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <h4
                      style={{
                        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(21px, 1.85vw, 26px)',
                        fontWeight: 400,
                        letterSpacing: '0.04em',
                        lineHeight: 1.15,
                        color: '#15131b',
                        margin: 0
                      }}
                    >
                      {currentRev.headline}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= currentRev.rating ? '#9E1C64' : 'none'}
                          color={s <= currentRev.rating ? '#9E1C64' : '#d4d4d8'}
                        />
                      ))}
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(15.5px, 1.35vw, 19.5px)',
                      fontWeight: 400,
                      letterSpacing: '0.03em',
                      lineHeight: 1.55,
                      color: '#15131b',
                      margin: 0
                    }}
                  >
                    &ldquo;{currentRev.comment}&rdquo;
                  </p>
                </div>
              </div>

              {/* BOTTOM-RIGHT REVIEWER ATTRIBUTION & WRITE REVIEW POPOVER (Grid Columns 8..13, Row 2) */}
              <div
                style={{
                  gridColumn: '8 / -1',
                  gridRow: '2',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div
                  onClick={() => setVisitedUser(currentRev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF6EE')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)')}
                  title={`Klik untuk mengunjungi profil ${currentRev.userName}`}
                >
                  <img
                    src={currentRev.userAvatar}
                    alt={currentRev.userName}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid #C99B52'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#15131b' }}>
                        {currentRev.userName}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: '#9E1C64',
                          fontWeight: 700,
                          backgroundColor: '#FDF2F8',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '999px',
                          border: '1px solid #FBCFE8'
                        }}
                      >
                        Profil ↗
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#666666' }}>
                      {formatReviewTime(currentRev.date)} • {summary.count} Ulasan
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser || currentUser.isGuest) {
                      openLogin({
                        benefitType: 'review',
                        title: 'Buat Akun untuk Mengulas',
                        description: 'Sebagai Tamu, Anda bebas membaca seluruh ulasan penjelajah. Untuk menulis ulasan dan memberikan penilaian bintang, silakan buat akun atau masuk terlebih dahulu.'
                      });
                      return;
                    }
                    setIsReviewFormOpen((prev) => !prev);
                  }}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#9E1C64',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  {isReviewFormOpen ? 'Tutup Formulir' : '+ Tulis Ulasan'}
                </button>

                {isReviewFormOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '64px',
                      right: 0,
                      width: 'min(420px, 90vw)',
                      backgroundColor: '#FAF8F5',
                      border: '1px solid rgba(21, 19, 27, 0.14)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
                      padding: '1.25rem',
                      zIndex: 50
                    }}
                  >
                    <form
                      onSubmit={handleReviewSubmit}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.76rem',
                          color: '#3f3f46'
                        }}
                      >
                        <span>
                          Mengulas sebagai:{' '}
                          <strong style={{ color: '#15131b' }}>
                            {currentUser ? currentUser.name : 'Tamu Penjelajah (Guest)'}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            openLogin({
                              benefitType: 'review',
                              title: 'Selamat datang',
                              description: 'Masuk ke akun Anda atau buat akun baru penjelajah Hamemayu.'
                            })
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9E1C64',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          {currentUser && !currentUser.isGuest ? 'Ganti Akun' : 'Masuk Akun'}
                        </button>
                      </div>

                      {reviewError && <div style={{ fontSize: '0.76rem', color: '#b91c1c' }}>{reviewError}</div>}

                      {reviewSuccess ? (
                        <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', color: '#15131b', fontSize: '0.82rem' }}>
                          Terima kasih! Ulasan Anda berhasil ditambahkan.
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.78rem', color: '#15131b' }}>Penilaian Bintang:</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const active = (hoverRating || userRating) >= star;
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setUserRating(star)}
                                    style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                                  >
                                    <Star
                                      size={17}
                                      fill={active ? '#9E1C64' : 'none'}
                                      color={active ? '#9E1C64' : '#d4d4d8'}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            required
                            placeholder={`Tuliskan kesan kunjungan Anda di ${activeMapPlace?.name || 'destinasi ini'}...`}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.7rem',
                              backgroundColor: '#ffffff',
                              border: '1px solid rgba(21, 19, 27, 0.15)',
                              borderRadius: '2px',
                              fontSize: '0.84rem',
                              color: '#15131b',
                              outline: 'none',
                              resize: 'none',
                              boxSizing: 'border-box',
                              fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                          />

                          <button
                            type="submit"
                            style={{
                              padding: '9px 16px',
                              backgroundColor: '#131021',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '2px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            Publikasikan Ulasan
                          </button>
                        </>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      })()}

      {/* =========================================================================
          SECTION 4B: FEED ULASAN & KOMENTAR PENGUNJUNG ASLI (LIVE COMMUNITY REVIEWS FEED)
          ========================================================================= */}
      {(() => {
        const placeId = activeMapPlace ? activeMapPlace.id : place?.id || 'keraton-yogyakarta';
        const placeRevs = getPlaceReviews(placeId);
        const summary = getPlaceRatingSummary(placeId);
        const myReviewsCount = currentUser
          ? placeRevs.filter((r) => r.userId === currentUser.id).length
          : 0;

        const filteredList = placeRevs.filter((r) => {
          if (reviewFilterRating === 'all') return true;
          if (reviewFilterRating === 'mine') return currentUser && r.userId === currentUser.id;
          return Number(r.rating) === Number(reviewFilterRating);
        });

        const activeAuthorName = currentUser ? currentUser.name : 'Tamu Penjelajah (Guest)';
        const activeAuthorAvatar =
          currentUser?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=Guest';

        return (
          <div
            id="all-community-reviews"
            style={{
              backgroundColor: '#FAF8F5',
              borderTop: '1px solid #EAE4DC',
              paddingTop: 'clamp(3rem, 5vw, 5rem)',
              paddingBottom: 'clamp(4rem, 6vw, 6rem)',
              paddingInline: 'clamp(1.25rem, 4vw, 3rem)',
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
          >
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
              {/* Header Ulasan Komunitas */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                  paddingBottom: '1.75rem',
                  borderBottom: '1px solid #E5DDCF'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      backgroundColor: '#FAF6EE',
                      border: '1px solid #E5D7BE',
                      color: '#8A5D26',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      marginBottom: '0.65rem'
                    }}
                  >
                    <MessageSquare size={13} color="#8A5D26" />
                    <span>Suara Komunitas Penjelajah</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                      fontWeight: 800,
                      color: '#2C221E',
                      margin: '0 0 0.45rem 0',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Ulasan & Pengalaman Pengunjung
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#6E5D52', maxWidth: '620px', lineHeight: 1.55 }}>
                    Komentar nyata dari wisatawan dan pemerhati budaya yang telah menapaki{' '}
                    <strong>{activeMapPlace?.name || place?.name || 'destinasi ini'}</strong>.
                  </p>
                </div>

                {/* Rating Card Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.45rem',
                    borderRadius: '16px',
                    border: '1.5px solid #EAE4DC',
                    boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: '#2C221E',
                        lineHeight: 1,
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      {Number(summary.average).toFixed(1)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#8A5D26', fontWeight: 700, marginTop: '3px' }}>
                      DARI 5.0
                    </div>
                  </div>

                  <div style={{ width: '1px', height: '40px', backgroundColor: '#EAE4DC' }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill={s <= Math.round(summary.average) ? '#C99B52' : 'none'}
                          color={s <= Math.round(summary.average) ? '#C99B52' : '#D4D4D8'}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#5C4E43', fontWeight: 600 }}>
                      {placeRevs.length} Ulasan Terverifikasi
                    </div>
                  </div>
                </div>
              </div>

              {/* FORMULIR TULIS ULASAN / KARTU AJAKAN MASUK AKUN BAGI TAMU */}
              {!currentUser || currentUser.isGuest ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #EAE4DC',
                    padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                    boxShadow: '0 6px 20px rgba(44, 34, 30, 0.04)',
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '640px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#FAF6EE',
                        border: '1px solid #E5D7BE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Lock size={20} color="#8A5D26" />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 800, color: '#2C221E' }}>
                        Ingin Menulis Ulasan & Berbagi Cerita Budaya?
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#6E5D52', lineHeight: 1.5 }}>
                        Sebagai Tamu, Anda bebas membaca seluruh ulasan penjelajah di bawah ini. Untuk menulis ulasan dan memberikan penilaian bintang, silakan buat akun atau masuk terlebih dahulu.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openLogin({
                        benefitType: 'review',
                        title: 'Buat Akun untuk Mengulas',
                        description: 'Masuk atau daftarkan akun Anda untuk memberikan ulasan dan terhubung dengan komunitas penjelajah Hamemayu.'
                      })
                    }
                    style={{
                      padding: '0.75rem 1.6rem',
                      borderRadius: '999px',
                      backgroundColor: '#2C221E',
                      color: '#FAF8F5',
                      border: '1.5px solid #C99B52',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(44, 34, 30, 0.16)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Sparkles size={14} color="#C99B52" />
                    <span>Masuk / Buat Akun untuk Mengulas</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #EAE4DC',
                    padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                    boxShadow: '0 6px 20px rgba(44, 34, 30, 0.04)',
                    marginBottom: '2.5rem'
                  }}
                >
                  <form onSubmit={handleReviewSubmit}>
                    {/* Penulis Ulasan Identity Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '1.25rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #F4EFE6'
                      }}
                    >
                      <div
                        onClick={() => {
                          if (currentUser && !currentUser.isGuest) {
                            setVisitedUser({
                              userId: currentUser.id,
                              userName: currentUser.name,
                              userAvatar: currentUser.avatar,
                              email: currentUser.email
                            });
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '10px'
                        }}
                        title="Klik untuk melihat kartu profil Anda"
                      >
                        <img
                          src={activeAuthorAvatar}
                          alt={activeAuthorName}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #E5D7BE'
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#2C221E' }}>
                              {activeAuthorName}
                            </strong>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: '#15803D',
                                backgroundColor: '#DCFCE7',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <CheckCircle2 size={11} />
                              <span>Akun Terverifikasi</span>
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: '#9E1C64',
                                fontWeight: 700,
                                backgroundColor: '#FDF2F8',
                                border: '1px solid #FBCFE8',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '999px'
                              }}
                            >
                              Lihat Profil ↗
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#786B5E' }}>
                            {currentUser.email || 'Member Hamemayu'} • Klik untuk melihat profil
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating Selector 1 - 5 Bintang */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        marginBottom: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2C221E' }}>
                        Beri Penilaian:
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating || userRating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setUserRating(star)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '2px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title={`${star} Bintang`}
                            >
                              <Star
                                size={22}
                                fill={isFilled ? '#C99B52' : 'none'}
                                color={isFilled ? '#C99B52' : '#D4D4D8'}
                                style={{ transition: 'transform 0.1s ease' }}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#8A5D26', fontWeight: 600 }}>
                        {userRating === 5 && 'Luar Biasa (5/5)'}
                        {userRating === 4 && 'Sangat Bagus (4/5)'}
                        {userRating === 3 && 'Cukup Baik (3/5)'}
                        {userRating === 2 && 'Kurang Memuaskan (2/5)'}
                        {userRating === 1 && 'Perlu Peningkatan (1/5)'}
                      </span>
                    </div>

                    {/* Textarea Input Komentar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <textarea
                        rows={4}
                        required
                        placeholder={`Tuliskan ulasan nyata Anda tentang ${activeMapPlace?.name || place?.name || 'tempat ini'} (suasana, fasilitas, keramahan warga, tips terbaik)...`}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.9rem 1.1rem',
                          borderRadius: '12px',
                          backgroundColor: '#FAF8F5',
                          border: '1.5px solid #EAE4DC',
                          fontSize: '0.88rem',
                          color: '#2C221E',
                          lineHeight: 1.6,
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2C221E';
                          e.target.style.backgroundColor = '#FFFFFF';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#EAE4DC';
                          e.target.style.backgroundColor = '#FAF8F5';
                        }}
                      />
                    </div>

                    {reviewError && (
                      <div style={{ fontSize: '0.78rem', color: '#DC2626', marginBottom: '0.75rem', fontWeight: 600 }}>
                        ⚠ {reviewError}
                      </div>
                    )}

                    {reviewSuccess && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #BBF7D0',
                          borderRadius: '8px',
                          color: '#15803D',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          marginBottom: '0.85rem'
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={14} />
                          <span>Ulasan Anda berhasil dikirim dan langsung tampil di bawah!</span>
                        </span>
                      </div>
                    )}

                    {/* Tombol Kirim Ulasan */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.65rem 1.45rem',
                          borderRadius: '999px',
                          backgroundColor: '#2C221E',
                          color: '#FAF8F5',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(44, 34, 30, 0.16)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Send size={14} />
                        <span>Kirim Ulasan Sekarang</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* FILTER & STATISTIK FEED */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2C221E' }}>
                  Daftar Ulasan Pengunjung ({filteredList.length})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `Semua (${placeRevs.length})` },
                    ...(currentUser && myReviewsCount > 0
                      ? [{ id: 'mine', label: `Ulasan Saya (${myReviewsCount})` }]
                      : []),
                    { id: '5', label: 'Bintang 5' },
                    { id: '4', label: 'Bintang 4' }
                  ].map((fil) => {
                    const isAct = reviewFilterRating === fil.id;
                    return (
                      <button
                        key={fil.id}
                        type="button"
                        onClick={() => setReviewFilterRating(fil.id)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: isAct ? 800 : 600,
                          backgroundColor: isAct ? '#2C221E' : '#FFFFFF',
                          color: isAct ? '#FAF8F5' : '#5C4E43',
                          border: isAct ? '1px solid #2C221E' : '1px solid #EAE3D6',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {fil.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LIST KARTU ULASAN ASLI */}
              {filteredList.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EAE4DC',
                    padding: '3rem 1.5rem',
                    textAlign: 'center'
                  }}
                >
                  <MessageSquare size={36} color="#C99B52" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2C221E', margin: '0 0 0.35rem 0' }}>
                    Belum ada ulasan untuk kriteria ini
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#786B5E' }}>
                    Jadilah penjelajah pertama yang menuliskan kesan dan pengalaman Anda di atas!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredList.map((rev) => {
                    const isMyReview = currentUser && rev.userId === currentUser.id;

                    return (
                      <div
                        key={rev.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          border: isMyReview ? '1.5px solid #C99B52' : '1px solid #EAE4DC',
                          padding: '1.35rem 1.5rem',
                          boxShadow: isMyReview
                            ? '0 6px 20px rgba(201, 155, 82, 0.08)'
                            : '0 2px 8px rgba(44, 34, 30, 0.02)',
                          position: 'relative'
                        }}
                      >
                        {/* Header Kartu Ulasan */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginBottom: '0.85rem'
                          }}
                        >
                          <div
                            onClick={() => setVisitedUser(rev)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: '10px',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF6EE')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            title={`Klik untuk mengunjungi profil ${rev.userName}`}
                          >
                            <img
                              src={
                                rev.userAvatar ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  rev.userName || 'User'
                                )}`
                              }
                              alt={rev.userName}
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: isMyReview ? '2px solid #C99B52' : '1.5px solid #E5DDCF',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                              }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <strong style={{ fontSize: '0.88rem', color: '#2C221E' }}>
                                  {rev.userName}
                                </strong>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    color: '#8A5D26',
                                    backgroundColor: '#FAF6EE',
                                    border: '1px solid #E5D7BE',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '999px',
                                    fontWeight: 700
                                  }}
                                >
                                  Kunjungi Profil ↗
                                </span>
                                {isMyReview && (
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      fontWeight: 800,
                                      color: '#8A5D26',
                                      backgroundColor: '#FAF6EE',
                                      border: '1px solid #E5D7BE',
                                      padding: '0.1rem 0.5rem',
                                      borderRadius: '999px'
                                    }}
                                  >
                                    Ulasan Anda
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#8C7E72', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span>{formatReviewTime(rev.date)}</span>
                                <span>•</span>
                                <span>
                                  {new Date(rev.date || currentTime).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bintang Rating */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={15}
                                fill={s <= (rev.rating || 5) ? '#C99B52' : 'none'}
                                color={s <= (rev.rating || 5) ? '#C99B52' : '#D4D4D8'}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Teks Ulasan */}
                        <p
                          style={{
                            margin: '0 0 1rem 0',
                            fontSize: '0.88rem',
                            lineHeight: 1.65,
                            color: '#3D312A',
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                          }}
                        >
                          {rev.comment}
                        </p>

                        {/* Footer Kartu: Like & Hapus Milik Sendiri */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid #F6F2EC',
                            fontSize: '0.75rem'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleLikeReview(rev.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: 'none',
                              border: 'none',
                              color: rev.likes > 0 ? '#9E1C64' : '#786B5E',
                              cursor: 'pointer',
                              fontWeight: 600,
                              padding: '0.2rem 0.4rem',
                              borderRadius: '6px'
                            }}
                          >
                            <ThumbsUp size={13} />
                            <span>Membantu ({rev.likes || 0})</span>
                          </button>

                          {/* Tombol Hapus hanya jika milik akun yang sedang login */}
                          {isMyReview && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: 'none',
                                border: 'none',
                                color: '#BE123C',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px'
                              }}
                              title="Hapus ulasan saya"
                            >
                              <Trash2 size={13} />
                              <span>Hapus Ulasan</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          INTERACTIVE INQUIRE MODAL (Magenta Theme)
          ========================================================================= */}
      <AnimatePresence>
        {isInquireOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#111019',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2.2rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                position: 'relative',
                color: '#ffffff'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsInquireOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#ec4899',
                  display: 'block',
                  marginBottom: '0.4rem'
                }}
              >
                Konsultasi Budaya dan Kuliner Yogyakarta
              </span>

              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  margin: '0 0 0.5rem 0',
                  color: '#ffffff'
                }}
              >
                Rencanakan Kunjungan Jogja
              </h2>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#a1a1aa',
                  margin: '0 0 1.5rem 0',
                  lineHeight: 1.5
                }}
              >
                Sampaikan wilayah Yogyakarta dan kuliner khas yang ingin Anda jelajahi. Tim kurator lokal kami akan menyiapkan rekomendasi terbaik untuk Anda.
              </p>

              {inquireSuccess ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle2 size={36} color="#34d399" style={{ margin: '0 auto 0.8rem auto' }} />
                  <h4 style={{ margin: '0 0 0.3rem 0', color: '#ffffff' }}>Permintaan Terkirim!</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0' }}>
                    Tim kurator Yogyakarta kami akan menghubungi Anda melalui email dalam 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#d4d4d8' }}>
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={inquireForm.name}
                      onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#d4d4d8' }}>
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@contoh.id"
                      value={inquireForm.email}
                      onChange={(e) => setInquireForm({ ...inquireForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#d4d4d8' }}>
                      Pesan & Wilayah Jogja yang Diminati
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Sebutkan destinasi Jogja (Keraton, Kotagede, Kaliurang, dll.) dan tanggal kunjungan..."
                      value={inquireForm.message}
                      onChange={(e) => setInquireForm({ ...inquireForm, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.9rem',
                      backgroundColor: '#9e1c64',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(158, 28, 100, 0.4)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b82075')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9e1c64')}
                  >
                    Kirim Pertanyaan
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL KUNJUNGI PROFIL PENGGUNA - GOOGLE MAPS STYLE (EXACT UI/UX REFERENCE)
          ========================================================================= */}
      <AnimatePresence>
        {visitedUser && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(3px)'
            }}
            onClick={() => setVisitedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, x: -35, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -35, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: '430px',
                height: 'calc(100vh - 32px)',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(60, 64, 67, 0.3), 0 1px 3px rgba(60, 64, 67, 0.15)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, sans-serif"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. TOP GOOGLE MAPS SEARCH BAR */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #f1f3f4',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    border: '1px solid #dadce0',
                    boxShadow: '0 1px 3px rgba(60, 64, 67, 0.12)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        color: '#5f6368',
                        fontSize: '14.5px',
                        fontWeight: 400,
                        fontFamily: "'Roboto', sans-serif",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Telusuri Google Maps
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <Search size={18} color="#5f6368" style={{ cursor: 'pointer' }} />
                    <div style={{ width: '1px', height: '18px', backgroundColor: '#dadce0' }} />
                    <button
                      type="button"
                      onClick={() => setVisitedUser(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px',
                        cursor: 'pointer',
                        color: '#5f6368',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}
                      title="Tutup"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE BODY */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* 2. LOCAL GUIDE PROFILE HEADER (EXACT LIKE SCREENSHOT) */}
                <div style={{ padding: '18px 20px 14px 20px', flexShrink: 0 }}>
                  {/* Avatar + Orange Star Badge + Name & Level */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={
                          visitedUser.userAvatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(visitedUser.userName || 'User')}`
                        }
                        alt={visitedUser.userName}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #ffffff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                          display: 'block'
                        }}
                      />
                      {/* Orange Local Guide Star Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: '#F9AB00',
                          border: '2px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                        title="Local Guide Level 8"
                      >
                        <Star size={13} fill="#ffffff" color="#ffffff" strokeWidth={1} />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2
                        style={{
                          margin: '0 0 2px 0',
                          fontSize: '22px',
                          fontWeight: 500,
                          color: '#202124',
                          lineHeight: 1.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {visitedUser.userName}
                      </h2>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#5f6368',
                          fontWeight: 400
                        }}
                      >
                        Local Guide Level 8
                      </div>
                    </div>
                  </div>

                  {/* Bio: PERHATIAN!! + snippet + Lainnya */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#202124', marginBottom: '2px' }}>
                      PERHATIAN!!
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#3c4043', lineHeight: 1.45 }}>
                      {expandedBio ? (
                        <span>
                          Jika tempat yang Anda cari belum ada di daftar destinasi atau peta Hamemayu, silakan tambahkan ulasan atau bagikan foto pengalaman Anda langsung melalui panduan budaya ini.{' '}
                          <span
                            onClick={() => setExpandedBio(false)}
                            style={{ color: '#00838f', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Sembunyikan
                          </span>
                        </span>
                      ) : (
                        <span>
                          Jika tempat yang Anda cari belum ada di ...{' '}
                          <span
                            onClick={() => setExpandedBio(true)}
                            style={{ color: '#00838f', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Lainnya
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multi-color Google Gradient Progress Bar & Points */}
                  <div style={{ marginBottom: '4px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: '#e8eaed',
                        position: 'relative',
                        overflow: 'visible'
                      }}
                    >
                      <div
                        style={{
                          width: '64%',
                          height: '100%',
                          borderRadius: '3px',
                          background: 'linear-gradient(90deg, #4285F4 0%, #34A853 38%, #FBBC04 72%, #F9AB00 100%)',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            right: '-3px',
                            top: '-2px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#202124',
                            border: '2px solid #ffffff',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '13.5px',
                        color: '#5f6368'
                      }}
                    >
                      <strong style={{ color: '#202124', fontWeight: 700 }}>32.175</strong> / 50.000 poin
                    </div>
                  </div>

                  {/* LENCANA BUDAYA TERPAJANG (SHOWCASED BADGES STRIP - GOOGLE MAPS STYLE) */}
                  {(() => {
                    const showcasedBadges = CULTURAL_BADGES.filter((b) => pinnedBadgeIds.includes(b.id));
                    return (
                      <div
                        style={{
                          marginTop: '14px',
                          padding: '12px 14px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '12px',
                          border: '1px solid #dadce0'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={16} color="#F9AB00" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#202124' }}>
                              Lencana Budaya Terpajang ({showcasedBadges.length})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setProfileTab('badge')}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#00838f',
                              cursor: 'pointer'
                            }}
                          >
                            Pamerkan Semua ➔
                          </button>
                        </div>

                        {/* Horizontal badges scroll */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {showcasedBadges.map((badge) => (
                            <div
                              key={badge.id}
                              onClick={() => setProfileTab('badge')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e8eaed',
                                borderRadius: '24px',
                                padding: '4px 10px 4px 6px',
                                cursor: 'pointer',
                                flexShrink: 0,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                              }}
                              title={`${badge.name} • ${badge.subtitle}`}
                            >
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: badge.bg || '#2C221E',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}
                              >
                                <img
                                  src={badge.iconSrc || '/images/icon_culture.svg'}
                                  alt={badge.name}
                                  style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }}
                                />
                              </div>
                              <div>
                                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#202124', lineHeight: 1.2 }}>
                                  {badge.name}
                                </div>
                                <div style={{ fontSize: '9.5px', color: '#5f6368', textTransform: 'capitalize' }}>
                                  Tier {badge.tier}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. CONTRIBUTOR PROMPT BANNER (EXACT LIKE SCREENSHOT) */}
                {showContributeBanner && (
                  <div style={{ padding: '0 18px', marginBottom: '14px', flexShrink: 0 }}>
                    <div
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dadce0',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={
                          currentUser?.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
                        }
                        alt="Contributor"
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid #dadce0',
                          backgroundColor: '#202124'
                        }}
                      />

                      <div style={{ flex: 1, paddingRight: '16px' }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '13px',
                            lineHeight: 1.35,
                            color: '#202124',
                            fontWeight: 400
                          }}
                        >
                          Mencari ulasan dan foto Anda sendiri? Anda juga bisa berkontribusi di Google Maps!
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowContributeBanner(false)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: '#5f6368',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Tutup pemberitahuan"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. TABS: ULASAN, FOTO & LENCANA (WITH CYAN UNDERLINE) */}
                <div
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #dadce0',
                    borderTop: '1px solid #f1f3f4',
                    backgroundColor: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setProfileTab('ulasan')}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: profileTab === 'ulasan' ? 600 : 500,
                      color: profileTab === 'ulasan' ? '#00838f' : '#5f6368',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    Ulasan
                    {profileTab === 'ulasan' && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '15%',
                          right: '15%',
                          height: '3px',
                          backgroundColor: '#00838f',
                          borderRadius: '3px 3px 0 0'
                        }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileTab('foto')}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: profileTab === 'foto' ? 600 : 500,
                      color: profileTab === 'foto' ? '#00838f' : '#5f6368',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    Foto
                    {profileTab === 'foto' && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '15%',
                          right: '15%',
                          height: '3px',
                          backgroundColor: '#00838f',
                          borderRadius: '3px 3px 0 0'
                        }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileTab('badge')}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: profileTab === 'badge' ? 600 : 500,
                      color: profileTab === 'badge' ? '#00838f' : '#5f6368',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    Lencana
                    {profileTab === 'badge' && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '15%',
                          right: '15%',
                          height: '3px',
                          backgroundColor: '#00838f',
                          borderRadius: '3px 3px 0 0'
                        }}
                      />
                    )}
                  </button>
                </div>

                {/* 5. TAB CONTENT: ULASAN */}
                {profileTab === 'ulasan' && (
                  <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(() => {
                      const userAllReviews = (reviews || []).filter(
                        (r) =>
                          (visitedUser.userId && r.userId === visitedUser.userId) ||
                          r.userName === visitedUser.userName
                      );
                      const displayList = userAllReviews.length > 0 ? userAllReviews : [visitedUser];

                      // Fallback photos array for review cards like screenshot (Haka Dimsum, etc.)
                      const sampleReviewPhotos = [
                        ['/assets/images/jogja_gudeg.jpg', '/assets/images/jogja_malioboro.jpg'],
                        ['/assets/images/jogja_keraton.jpg', '/assets/images/jogja_batik.jpg'],
                        ['/assets/images/jogja_tamansari.jpg', '/assets/images/jogja_prambanan.jpg']
                      ];

                      return displayList.map((revItem, idx) => {
                        const isExpanded = !!expandedReviewIds[revItem.id || idx];
                        const reviewPhotos = sampleReviewPhotos[idx % sampleReviewPhotos.length];

                        return (
                          <div
                            key={revItem.id || idx}
                            style={{
                              borderBottom: idx < displayList.length - 1 ? '1px solid #f1f3f4' : 'none',
                              paddingBottom: '18px'
                            }}
                          >
                            {/* Destination / Place Name */}
                            <div style={{ marginBottom: '4px' }}>
                              <h4
                                style={{
                                  margin: '0 0 2px 0',
                                  fontSize: '15.5px',
                                  fontWeight: 500,
                                  color: '#202124',
                                  cursor: 'pointer'
                                }}
                              >
                                {revItem.placeName || revItem.headline || 'Haka Dimsum • Ruko Malioboro'}
                              </h4>
                              <div style={{ fontSize: '12.5px', color: '#5f6368' }}>
                                Restoran Kuliner & Budaya • 24 Jam
                              </div>
                            </div>

                            {/* Stars & Relative Date */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    size={13}
                                    fill={s <= (revItem.rating || 5) ? '#F9AB00' : 'none'}
                                    color={s <= (revItem.rating || 5) ? '#F9AB00' : '#dadce0'}
                                  />
                                ))}
                              </div>
                              <span style={{ fontSize: '12.5px', color: '#5f6368' }}>
                                {formatReviewTime(revItem.date)}
                              </span>
                            </div>

                            {/* Review Text Snippet with ... Lainnya */}
                            <div style={{ fontSize: '13.5px', color: '#3c4043', lineHeight: 1.5, marginBottom: '12px' }}>
                              {isExpanded ? (
                                <span>
                                  {revItem.comment}{' '}
                                  <span
                                    onClick={() =>
                                      setExpandedReviewIds((prev) => ({ ...prev, [revItem.id || idx]: false }))
                                    }
                                    style={{ color: '#00838f', fontWeight: 500, cursor: 'pointer' }}
                                  >
                                    Sembunyikan
                                  </span>
                                </span>
                              ) : (
                                <span>
                                  {revItem.comment && revItem.comment.length > 80
                                    ? `${revItem.comment.substring(0, 80)}... `
                                    : revItem.comment}
                                  {revItem.comment && revItem.comment.length > 80 && (
                                    <span
                                      onClick={() =>
                                        setExpandedReviewIds((prev) => ({ ...prev, [revItem.id || idx]: true }))
                                      }
                                      style={{ color: '#00838f', fontWeight: 500, cursor: 'pointer' }}
                                    >
                                      Lainnya
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Attached Photos (Exactly matching the menu/food photo strip in Gabriel's screenshot) */}
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                              {reviewPhotos.map((photo, pIdx) => (
                                <img
                                  key={pIdx}
                                  src={photo}
                                  alt="Dokumentasi ulasan"
                                  style={{
                                    width: '130px',
                                    height: '92px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    border: '1px solid #e8eaed',
                                    flexShrink: 0
                                  }}
                                />
                              ))}
                            </div>

                            {/* Helpful Action */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (revItem.id) toggleLikeReview(revItem.id);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'none',
                                  border: '1px solid #dadce0',
                                  borderRadius: '16px',
                                  padding: '4px 10px',
                                  fontSize: '12px',
                                  color: '#3c4043',
                                  cursor: 'pointer'
                                }}
                              >
                                <ThumbsUp size={12} color="#5f6368" />
                                <span>Membantu ({revItem.likes || 0})</span>
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {/* 6. TAB CONTENT: FOTO (GALLERY GRID) */}
                {profileTab === 'foto' && (
                  <div style={{ flex: 1, padding: '16px 20px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px'
                      }}
                    >
                      {[
                        { src: '/assets/images/jogja_gudeg.jpg', title: 'Gudeg Yu Djum' },
                        { src: '/assets/images/jogja_keraton.jpg', title: 'Keraton Yogyakarta' },
                        { src: '/assets/images/jogja_malioboro.jpg', title: 'Malioboro' },
                        { src: '/assets/images/jogja_tamansari.jpg', title: 'Sumur Gumuling' },
                        { src: '/assets/images/jogja_batik.jpg', title: 'Batik Giriloyo' },
                        { src: '/assets/images/jogja_prambanan.jpg', title: 'Candi Prambanan' }
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f1f3f4',
                            aspectRatio: '4 / 3',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              padding: '6px 8px',
                              background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                          >
                            {item.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. TAB CONTENT: LENCANA / BADGES SHOWCASE (GOOGLE MAPS STYLE) */}
                {profileTab === 'badge' && (
                  <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 600, color: '#202124' }}>
                          Pameran Lencana Budaya ({CULTURAL_BADGES.length})
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#5f6368' }}>
                          Lencana prestasi eksplorasi budaya dan jejak rasa di Daerah Istimewa Yogyakarta.
                        </p>
                      </div>

                      {visitedUser.userId === currentUser?.id && onOpenCultureBook && (
                        <button
                          type="button"
                          onClick={() => {
                            setVisitedUser(null);
                            onOpenCultureBook();
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            backgroundColor: '#00838f',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Klaim di Paspor ➔</span>
                        </button>
                      )}
                    </div>

                    {/* Badges List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {CULTURAL_BADGES.map((b) => {
                        const isShowcased = pinnedBadgeIds.includes(b.id);
                        const tierColors = {
                          umum: { text: '#8A5D26', bg: '#FAF6EE', border: '#E5D7BE' },
                          langka: { text: '#15803D', bg: '#DCFCE7', border: '#BBF7D0' },
                          epic: { text: '#9E1C64', bg: '#FDF2F8', border: '#FBCFE8' },
                          legendaris: { text: '#C99B52', bg: '#FEF3C7', border: '#FDE68A' }
                        }[b.tier] || { text: '#202124', bg: '#f1f3f4', border: '#dadce0' };

                        return (
                          <div
                            key={b.id}
                            style={{
                              backgroundColor: '#ffffff',
                              border: isShowcased ? '1.5px solid #00838f' : '1px solid #dadce0',
                              borderRadius: '12px',
                              padding: '12px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              boxShadow: isShowcased ? '0 2px 8px rgba(0, 131, 143, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '50%',
                                  backgroundColor: b.bg || '#2C221E',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}
                              >
                                <img
                                  src={b.iconSrc || '/images/icon_culture.svg'}
                                  alt={b.name}
                                  style={{ width: '22px', height: '22px', filter: 'brightness(0) invert(1)' }}
                                />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                                  <h5 style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#202124' }}>
                                    {b.name}
                                  </h5>
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      color: tierColors.text,
                                      backgroundColor: tierColors.bg,
                                      border: `1px solid ${tierColors.border}`,
                                      padding: '1px 6px',
                                      borderRadius: '6px',
                                      textTransform: 'uppercase'
                                    }}
                                  >
                                    Tier {b.tier}
                                  </span>
                                  {isShowcased && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: '#00838f',
                                        backgroundColor: '#E0F7FA',
                                        padding: '1px 6px',
                                        borderRadius: '6px'
                                      }}
                                    >
                                      ★ Terpajang
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#5f6368', marginBottom: '3px' }}>
                                  {b.subtitle}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#3c4043', lineHeight: 1.35, fontStyle: 'italic' }}>
                                  &ldquo;{b.lore}&rdquo;
                                </div>
                              </div>
                            </div>

                            {/* Tombol Pamerkan / Batal Pamerkan */}
                            <button
                              type="button"
                              onClick={() => togglePinBadge(b.id)}
                              style={{
                                flexShrink: 0,
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                backgroundColor: isShowcased ? '#E0F7FA' : '#f8f9fa',
                                border: isShowcased ? '1px solid #00838f' : '1px solid #dadce0',
                                color: isShowcased ? '#00838f' : '#3c4043',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={isShowcased ? 'Hapus dari pameran profil' : 'Pamerkan badge ini di profil'}
                            >
                              <Sparkles size={11} color={isShowcased ? '#00838f' : '#5f6368'} />
                              <span>{isShowcased ? 'Terpajang' : 'Pamerkan'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Visitor Photo/Video Experience Modal (Fitur Benefit 2) */}
      <ShareExperienceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        places={places}
        defaultPlaceId={activeMapPlace?.id || place?.id || 'keraton-yogyakarta'}
      />
    </motion.div>
  );
}
