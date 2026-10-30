import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Heart,
  Star,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Send,
  User,
  ShieldCheck,
  Clock,
  ExternalLink,
  Calendar,
  Search,
  Award,
  Lock,
  ArrowRight,
  Ticket,
  Receipt,
  CreditCard
} from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { CULTURAL_PLACES } from '../data/culturalData';
import { CULTURAL_BADGES } from '../data/badgeQuestData';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useCultureBook } from '../context/CultureBookContext';
import ShareExperienceModal from './ShareExperienceModal';
import HeritageDestinationCard from './HeritageDestinationCard';

// Theme Categories with exact Eastward template SVG icons directly from eastward.framer.website
const THEME_CATEGORIES = [
  {
    id: 'all',
    label: 'Semua Destinasi',
    subLabel: 'Semua Wilayah DIY',
    iconSrc: '/assets/icons/icon_all.svg'
  },
  {
    id: 'culture',
    label: 'Warisan Budaya',
    subLabel: 'Budaya & Sejarah',
    iconSrc: '/assets/icons/icon_culture.svg'
  },
  {
    id: 'nature',
    label: 'Wisata Alam',
    subLabel: 'Wisata Hiburan & Alam',
    iconSrc: '/assets/icons/icon_nature.svg'
  },
  {
    id: 'culinary',
    label: 'Wisata Kuliner',
    subLabel: 'Rekomendasi Kuliner Yogyakarta',
    iconSrc: '/assets/icons/icon_culinary.svg'
  },
  {
    id: 'soul',
    label: 'Tradisi dan Kehidupan',
    subLabel: 'Kampung Wisata & Krama',
    iconSrc: '/assets/icons/icon_soul.svg'
  }
];

// Data Ulasan & Foto Asli Jogja Khusus Per Destinasi (Matching Context & Authentic Jogja Photos)
const getDestinationReviewsAndPhotos = (targetPlace) => {
  const pId = targetPlace?.id || 'keraton-yogyakarta';

  if (pId === 'malioboro-tugu') {
    return {
      photos: [
        '/assets/images/jogja_tugu.webp',
        '/assets/images/jogja_malioboro.webp',
        '/assets/images/jogja_tugu.webp',
        '/assets/images/jogja_malioboro.webp'
      ],
      reviews: [
        {
          id: 'm-rev-1',
          userName: 'Arif Prasetyo',
          userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Pesona Malam Tugu Pal Putih',
          photoUrl: '/assets/images/jogja_tugu.webp',
          comment: 'Menikmati malam di sekitar Tugu Pal Putih sambil menyeruput Kopi Joss Lik Man adalah pengalaman yang sangat otentik. Atmosfer poros utara Sumbu Filosofis terasa sangat magis.',
          date: '2026-03-05T20:10:00.000Z'
        },
        {
          id: 'm-rev-2',
          userName: 'Nabila Larasati',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Menyusuri Trotoar Malioboro & Titik Nol',
          photoUrl: '/assets/images/jogja_malioboro.webp',
          comment: 'Pedestrian Malioboro sekarang sangat tertata dan bersih. Berjalan kaki dari stasiun hingga Titik Nol Kilometer, mampir ke Pasar Beringharjo untuk belanja batik tradisional.',
          date: '2026-03-04T18:30:00.000Z'
        },
        {
          id: 'm-rev-3',
          userName: 'Bayu Wicaksono',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kudapan Lumpia Samijaya & Angkringan',
          photoUrl: '/assets/images/jogja_malioboro.webp',
          comment: 'Lumpia Samijaya isi telur puyuh yang disajikan panas-panas tidak pernah mengecewakan. Ditutup wedang jahe di angkringan, sempurna untuk melepas lelah.',
          date: '2026-03-02T21:15:00.000Z'
        },
        {
          id: 'm-rev-4',
          userName: 'Citra Kirana',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Harmoni Lampu Klasik & Musisi Jalanan',
          photoUrl: '/assets/images/jogja_tugu.webp',
          comment: 'Lampu gantung temaram Malioboro dan lantunan musik akustik seniman jalanan selalu menghadirkan kerinduan mendalam untuk selalu kembali ke Jogja.',
          date: '2026-02-28T19:40:00.000Z'
        }
      ]
    };
  }

  if (pId === 'kotagede') {
    return {
      photos: [
        '/assets/images/jogja_kotagede.webp',
        '/assets/images/jogja_batik.webp',
        '/assets/images/jogja_kotagede.webp',
        '/assets/images/jogja_batik.webp'
      ],
      reviews: [
        {
          id: 'k-rev-1',
          userName: 'Pak Tejo Kusumo',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Lorong Bata Merah Masjid Gedhe Mataram 1586',
          photoUrl: '/assets/images/jogja_kotagede.webp',
          comment: 'Menelusuri lorong kuno berdinding bata merah tanpa semen dan berziarah ke Makam Raja-Raja Mataram Islam membawa rasa takjub akan kejayaan peradaban abad ke-16.',
          date: '2026-03-06T10:15:00.000Z'
        },
        {
          id: 'k-rev-2',
          userName: 'Sekar Ayu Wandira',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kehalusan Perak Filigri Jl. Kemasan',
          photoUrl: '/assets/images/jogja_kotagede.webp',
          comment: 'Keahlian para empu perak Kotagede merajut benang perak tipis menjadi cincin dan miniatur candi sangat mengagumkan. Wajib membawa pulang cendera mata karya lokal.',
          date: '2026-03-03T15:00:00.000Z'
        },
        {
          id: 'k-rev-3',
          userName: 'Rian Hidayat',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kudapan Manis Kipo & Bakmi Mbah Gito',
          photoUrl: '/assets/images/jogja_batik.webp',
          comment: 'Kue Kipo legit khas Kotagede berbahan ketan hijau dan kelapa parut manis sangat lezat. Malamnya ditutup Bakmi Jawa anglo arang di Mbah Gito.',
          date: '2026-03-01T17:20:00.000Z'
        },
        {
          id: 'k-rev-4',
          userName: 'Maya Indah',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Arsitektur Eksotis Rumah Kalang',
          photoUrl: '/assets/images/jogja_kotagede.webp',
          comment: 'Kemegahan fasad Rumah Kalang perpaduan Art Deco Eropa dan ornamen ukir kayu Jawa memperlihatkan sejarah kejayaan saudagar perak masa lampau.',
          date: '2026-02-27T13:45:00.000Z'
        }
      ]
    };
  }

  if (pId === 'merapi-kaliurang') {
    return {
      photos: [
        '/assets/images/jogja_merapi.webp',
        '/assets/images/jogja_merapi.webp',
        '/assets/images/jogja_merapi.webp',
        '/assets/images/jogja_merapi.webp'
      ],
      reviews: [
        {
          id: 'me-rev-1',
          userName: 'Bayu Pratama',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Adrenalin Lava Tour Jeep Kaliadem',
          photoUrl: '/assets/images/jogja_merapi.webp',
          comment: 'Menembus jalur bebatuan lahar dingin Merapi dengan Jeep terbuka dan menyaksikan Bunker Kaliadem dari dekat memberikan rasa hormat mendalam pada kekuatan alam.',
          date: '2026-03-07T08:30:00.000Z'
        },
        {
          id: 'me-rev-2',
          userName: 'Ratna Sari Dewi',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Romantisme Sejarah di Museum Ullen Sentalu',
          photoUrl: '/assets/images/jogja_merapi.webp',
          comment: 'Tur berpemandu di Ullen Sentalu membuka wawasan mendalam tentang surat cinta putri kraton dan filosofi hidup bangsawan Mataram. Suasananya sejuk dan tenteram.',
          date: '2026-03-04T11:20:00.000Z'
        },
        {
          id: 'me-rev-3',
          userName: 'Doni Kusuma',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kabut Pagi & Jembatan Gantung Plunyon',
          photoUrl: '/assets/images/jogja_merapi.webp',
          comment: 'Pemandangan puncak Gunung Merapi yang gagah dengan latar hutan pinus dan aliran Kalikuning sangat spektakuler. Datanglah sebelum pukul 07.00 pagi.',
          date: '2026-03-02T06:45:00.000Z'
        },
        {
          id: 'me-rev-4',
          userName: 'Eka Prasetya',
          userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Legit Hangat Jadah Tempe Mbok Carik',
          photoUrl: '/assets/images/jogja_merapi.webp',
          comment: 'Kombinasi ketan putih gurih dan tempe bacem manis hangat kegemaran Sri Sultan HB IX adalah santapan wajib saat berhawa dingin di Kaliurang.',
          date: '2026-02-26T16:10:00.000Z'
        }
      ]
    };
  }

  if (pId === 'prambanan-ratuboko') {
    return {
      photos: [
        '/assets/images/jogja_prambanan.webp',
        '/assets/images/jogja_ratuboko.webp',
        '/assets/images/jogja_prambanan.webp',
        '/assets/images/jogja_ratuboko.webp'
      ],
      reviews: [
        {
          id: 'p-rev-1',
          userName: 'Laksmi Dewi',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Magis Sendratari Ramayana Panggung Terbuka',
          photoUrl: '/assets/images/jogja_prambanan.webp',
          comment: 'Menyaksikan Hanoman Obong dengan lingkaran api nyata berlatar Candi Siwa yang disorot lampu malam adalah salah satu pertunjukan terbaik di Asia Tenggara.',
          date: '2026-03-06T19:30:00.000Z'
        },
        {
          id: 'p-rev-2',
          userName: 'Wisnu Wardhana',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Senja Emas Gerbang Keraton Ratu Boko',
          photoUrl: '/assets/images/jogja_ratuboko.webp',
          comment: 'Matahari terbenam tepat di bingkai gerbang batu paduraksa Ratu Boko menghadap dataran Prambanan adalah momen fotografi yang luar biasa indah.',
          date: '2026-03-03T17:45:00.000Z'
        },
        {
          id: 'p-rev-3',
          userName: 'Cahyo Nugroho',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Relief Epos Ramayana Candi Siwa 47 Meter',
          photoUrl: '/assets/images/jogja_prambanan.webp',
          comment: 'Detail pahatan relief batu andesit abad ke-9 pada dinding Candi Siwa sangat presisi. Menyusuri lorong pradaksina memberikan penghormatan mendalam pada leluhur.',
          date: '2026-03-01T09:20:00.000Z'
        },
        {
          id: 'p-rev-4',
          userName: 'Sintia Maya',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Ayam Goreng Kremes Kalasan Mbok Berek',
          photoUrl: '/assets/images/jogja_prambanan.webp',
          comment: 'Setelah menjelajahi Prambanan, santap siang dengan ayam goreng kalasan bercita rasa manis gurih dan sambal terasi menjadi pelengkap sempurna.',
          date: '2026-02-28T12:40:00.000Z'
        }
      ]
    };
  }

  if (pId === 'wijilan-prawirotaman') {
    return {
      photos: [
        '/assets/images/jogja_gudeg.webp',
        '/assets/images/jogja_batik.webp',
        '/assets/images/jogja_gudeg.webp',
        '/assets/images/jogja_keraton.webp'
      ],
      reviews: [
        {
          id: 'w-rev-1',
          userName: 'Bu Tri Wahyuni',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Gudeg Kering Khas Wijilan Harum Kayu Bakar',
          photoUrl: '/assets/images/jogja_gudeg.webp',
          comment: 'Kelezatan gudeg kering Wijilan dengan areh santan kental gurih dan sambal krecek pedas manis sangat otentik. Beli dalam kendil tanah liat sangat awet untuk oleh-oleh.',
          date: '2026-03-05T11:30:00.000Z'
        },
        {
          id: 'w-rev-2',
          userName: 'Rendy Pratama',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Kafe Seni & Gelato Dingin di Prawirotaman',
          photoUrl: '/assets/images/jogja_gudeg.webp',
          comment: 'Kawasan Prawirotaman memiliki atmosfer bohemian yang unik. Menikmati gelato sore hari setelah berjalan kaki keliling kampung seni sangat menyegarkan.',
          date: '2026-03-02T16:45:00.000Z'
        }
      ]
    };
  }

  if (pId === 'kasongan-imogiri') {
    return {
      photos: [
        '/assets/images/jogja_batik.webp',
        '/assets/images/jogja_keraton.webp',
        '/assets/images/jogja_batik.webp',
        '/assets/images/jogja_kotagede.webp'
      ],
      reviews: [
        {
          id: 'ks-rev-1',
          userName: 'Bambang Sutrisno',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Seni Gerabah Tanah Liat Kasongan yang Mendunia',
          photoUrl: '/assets/images/jogja_batik.webp',
          comment: 'Melihat langsung tangan terampil para perajin Kasongan memutar tanah liat menjadi guci artistik dan terakota dekoratif adalah bukti luhurnya tradisi seni rupa Bantul.',
          date: '2026-03-04T13:15:00.000Z'
        },
        {
          id: 'ks-rev-2',
          userName: 'Nurul Hidayati',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Keheningan Ratusan Anak Tangga Makam Imogiri',
          photoUrl: '/assets/images/jogja_keraton.webp',
          comment: 'Menaiki ratusan anak tangga batu andesit menuju pusara Sultan Agung di puncak Bukit Pajimatan memberikan getaran spiritual dan rasa khidmat yang mendalam.',
          date: '2026-03-01T15:20:00.000Z'
        }
      ]
    };
  }

  if (pId === 'parangtritis-gunungkidul') {
    return {
      photos: [
        '/assets/images/jogja_parangtritis.webp',
        '/assets/images/jogja_tamansari.webp',
        '/assets/images/jogja_parangtritis.webp',
        '/assets/images/jogja_merapi.webp'
      ],
      reviews: [
        {
          id: 'pt-rev-1',
          userName: 'Fajar Nugraha',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Ombak Samudra Hindia & Sunset Paralayang Watugupit',
          photoUrl: '/assets/images/jogja_parangtritis.webp',
          comment: 'Menatap luasnya cakrawala Samudra Hindia dari atas bukit tebing karst saat senja tiba adalah salah satu pemandangan matahari terbenam paling spektakuler di tanah Jawa.',
          date: '2026-03-06T18:00:00.000Z'
        },
        {
          id: 'pt-rev-2',
          userName: 'Anisa Maharani',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          rating: 5,
          headline: 'Pesona Gurun Pasir Gumuk Pasir Barchan',
          photoUrl: '/assets/images/jogja_parangtritis.webp',
          comment: 'Fenomena langka gumuk pasir barchan satu-satunya di Asia Tenggara. Sangat mengesankan untuk fotografi dan merasakan keunikan bentang alam selatan Jogja.',
          date: '2026-03-03T16:30:00.000Z'
        }
      ]
    };
  }

  // DEFAULT: KERATON NGAYOGYAKARTA & TAMANSARI
  return {
    photos: [
      '/assets/images/jogja_keraton.webp',
      '/assets/images/jogja_tamansari.webp',
      '/assets/images/jogja_batik.webp',
      '/assets/images/jogja_gudeg.webp'
    ],
    reviews: [
      {
        id: 'default-rev-1',
        userName: 'Raden Mas Haryo',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Ketenangan Pelataran Kedhaton & Bangsal Kencono',
        photoUrl: '/assets/images/jogja_keraton.webp',
        comment: 'Menyaksikan langsung ketenangan para Abdi Dalem dan orkestrasi Gamelan Sekaten membawa kedamaian batin luar biasa. Falsafah Hamemayu Hayuning Bawana benar-benar terasa di setiap jengkal pelataran pasir halus.',
        date: '2026-03-06T09:20:00.000Z'
      },
      {
        id: 'default-rev-2',
        userName: 'Dewi Kartikasari',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Akustik Magis Sumur Gumuling Tamansari',
        photoUrl: '/assets/images/jogja_tamansari.webp',
        comment: 'Arsitektur Sumur Gumuling di Tamansari sangat memukau secara akustik. Pastikan menyewa jasa pemandu lokal agar memahami lorong bawah tanah dan makna simbolis kanal air zaman Sri Sultan Hamengkubuwono I.',
        date: '2026-03-04T14:45:00.000Z'
      },
      {
        id: 'default-rev-3',
        userName: 'Dimas Suryo',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Filosofi Canting & Batik Tulis Jeron Beteng',
        photoUrl: '/assets/images/jogja_batik.webp',
        comment: 'Menyelami filosofi motif Parang dan Kawung langsung dari para pembatik sepuh di Jeron Beteng memberikan perspektif baru tentang kesabaran, tata krama, dan kehalusan budi krama Yogyakarta.',
        date: '2026-03-02T16:15:00.000Z'
      },
      {
        id: 'default-rev-4',
        userName: 'Ibu Kuswanto',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        headline: 'Gastronomi Pusaka Bale Raos & Gudeg Wijilan',
        photoUrl: '/assets/images/jogja_gudeg.webp',
        comment: 'Mencicipi Bebek Suwar-Suwir dan Bir Jawa di Bale Raos di Magangan Kulon, lalu ditutup Gudeg Yu Djum Wijilan yang dimasak kayu bakar 12 jam. Cita rasa sejati warisan raja Mataram.',
        date: '2026-02-28T13:10:00.000Z'
      }
    ]
  };
};

export default function PlaceStorybook({ place, places = CULTURAL_PLACES, onBack, onSelectPlace, onOpenCultureBook }) {
  const [activeTheme, setActiveTheme] = useState('all');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Reset 3D coverflow index when switching theme tabs
  useEffect(() => {
    setActiveCardIndex(0);
  }, [activeTheme]);
  const [activeMapPlace, setActiveMapPlace] = useState(place || CULTURAL_PLACES[0]);
  const [isReviewBtnHovered, setIsReviewBtnHovered] = useState(false);
  const [isInquireOpen, setIsInquireOpen] = useState(false);
  const [inquireSuccess, setInquireSuccess] = useState(false);
  const [inquireForm, setInquireForm] = useState({ name: '', email: '', message: '' });

  // Auth, Community & CultureBook Benefit Hooks
  const { currentUser, requireAuth, openLogin } = useAuth();
  const { isFavorite, toggleFavorite } = useCultureBook();
  const {
    initiatePayment,
    isItemPaid,
    getPaidTicketByItemId,
    setSelectedTicketToView,
    parseItemPrice
  } = usePayment();
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
    '/assets/images/jogja_keraton.webp';

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
        {/* Floating Top Navigation Bar */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: 'clamp(1rem, 3vw, 2.5rem)',
            right: 'clamp(1rem, 3vw, 2.5rem)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'auto'
          }}
        >

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(26, 20, 18, 0.65)',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              }}
              title="Tutup (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>
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
                  padding: '0.32rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(18, 12, 8, 0.55)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#F4F1EA',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}
              >
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

              {/* Payment & Wishlist Action Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  marginTop: '1.25rem'
                }}
              >
                {isItemPaid(activeMapPlace.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const t = getPaidTicketByItemId(activeMapPlace.id);
                      if (t) setSelectedTicketToView(t);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      backgroundColor: '#16A34A',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1.4rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(22, 163, 74, 0.45)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>✓ E-Tiket Aktif (Buka Boarding Pass)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiatePayment(activeMapPlace)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      backgroundColor: '#C99B52',
                      color: '#1A1412',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1.4rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(201, 155, 82, 0.45)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Ticket size={18} />
                    <span>Beli Tiket Masuk • Rp {parseItemPrice(activeMapPlace).toLocaleString('id-ID')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleWishlistToggle(activeMapPlace)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    backgroundColor: isFavorite(activeMapPlace.id) ? '#e11d48' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '12px',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Heart size={16} fill={isFavorite(activeMapPlace.id) ? '#ffffff' : 'none'} />
                  <span>{isFavorite(activeMapPlace.id) ? 'Disimpan di Wishlist' : 'Simpan ke Wishlist'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D180C] leading-tight tracking-tight mb-3">
            Jelajahi Sudut Budaya Jogja Lainnya
          </h2>
          <p className="text-sm sm:text-base text-[#2D180C]/70 max-w-xl mx-auto leading-relaxed m-0">
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

        {/* =========================================================================
            SECTION 3: JELAJAHI DESTINASI JOGJA LAINNYA
            3D PERSPECTIVE COVER-FLOW HERITAGE STAGE (BUKAN NGEJEJER / ZERO REPETITIVE GRID)
            ========================================================================= */}
        {(() => {
          const currentCardIdx = Math.min(activeCardIndex, Math.max(0, filteredPlaces.length - 1));

          return (
            <div className="relative w-full max-w-5xl mx-auto py-2 sm:py-6 select-none">
              {/* Main 3D Cover-Flow Perspective Stage */}
              <div className="relative w-full min-h-[560px] sm:min-h-[590px] flex items-center justify-center overflow-visible">
                {filteredPlaces.map((dest, idx) => {
                  const offset = idx - currentCardIdx;
                  const isCenter = offset === 0;
                  const isPrev = offset === -1;
                  const isNext = offset === 1;
                  const isVisible = Math.abs(offset) <= 1;

                  if (!isVisible) return null;

                  return (
                    <motion.div
                      key={dest.id}
                      initial={false}
                      animate={{
                        x: isCenter ? '0%' : isPrev ? '-52%' : '52%',
                        scale: isCenter ? 1 : 0.86,
                        rotateY: isCenter ? 0 : isPrev ? 12 : -12,
                        rotateZ: isCenter ? 0 : isPrev ? -2.5 : 2.5,
                        zIndex: isCenter ? 30 : 15,
                        opacity: isCenter ? 1 : 0.55,
                        filter: isCenter ? 'blur(0px)' : 'blur(1.2px)'
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 26,
                        mass: 0.9
                      }}
                      onClick={() => {
                        if (!isCenter) {
                          setActiveCardIndex(idx);
                        }
                      }}
                      className={`absolute w-full max-w-[440px] sm:max-w-[480px] md:max-w-[500px] transition-shadow ${
                        !isCenter ? 'cursor-pointer hover:opacity-80' : ''
                      }`}
                      style={{
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div
                        className={`bg-white rounded-[28px] p-3.5 sm:p-4 border transition-all duration-300 ${
                          isCenter
                            ? 'border-[#8c532b]/40 shadow-[0_25px_60px_-15px_rgba(45,24,12,0.22),0_10px_25px_rgba(0,0,0,0.06)]'
                            : 'border-[#EDE5DA] shadow-[0_12px_30px_-8px_rgba(45,24,12,0.12)]'
                        }`}
                      >
                        {/* Inner Photo Canvas */}
                        <div className="relative w-full h-[250px] sm:h-[275px] rounded-[22px] overflow-hidden bg-neutral-900 shadow-inner">
                          <img
                            src={dest.coverImage || dest.thumbnail}
                            alt={dest.name}
                            className="w-full h-full object-cover select-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

                          {/* Top-Left Category Badge */}
                          <div className="absolute top-3 left-3 z-10 pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#2D180C] shadow-sm border border-white/70">
                              <span>{dest.badges?.[0] || 'Cagar Budaya'}</span>
                            </span>
                          </div>

                          {/* Top-Right Wishlist Heart Button */}
                          <div className="absolute top-3 right-3 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWishlistToggle(dest);
                              }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm active:scale-90 ${
                                isFavorite(dest.id)
                                  ? 'bg-rose-600 text-white border border-rose-500 shadow-rose-900/30'
                                  : 'bg-black/35 hover:bg-white text-white hover:text-rose-600 border border-white/30'
                              }`}
                              title={isFavorite(dest.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
                            >
                              <Heart size={15} fill={isFavorite(dest.id) ? '#ffffff' : 'none'} strokeWidth={2} />
                            </button>
                          </div>

                          {/* Bottom-Left Price Badge */}
                          {dest.ticketInfo?.domestik && (
                            <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-md text-amber-100 border border-white/10 tracking-normal">
                                {dest.ticketInfo.domestik.split('(')[0].trim()}
                              </span>
                            </div>
                          )}

                          {/* Bottom-Right Region Pill */}
                          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#2D180C]/80 backdrop-blur-md text-amber-200/95 border border-white/10 tracking-normal">
                              <MapPin size={11} className="text-amber-300" />
                              <span>{dest.regionLabel || 'D.I. Yogyakarta'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Body Content */}
                        <div className="p-3.5 sm:p-4 space-y-3">
                          <div className="space-y-1.5">
                            {/* Region & Rating */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c532b]">
                                <MapPin size={12} className="text-[#8c532b] shrink-0" />
                                <span className="truncate">{dest.regionLabel || 'D.I. Yogyakarta'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600 shrink-0">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span>4.9 (Kurasi Sahih)</span>
                              </div>
                            </div>

                            {/* Title (font-serif Playfair, NO capslock) */}
                            <h3 className="font-['Outfit'] text-2xl sm:text-[25px] font-bold text-[#2D180C] leading-snug line-clamp-1 m-0">
                              {dest.name}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2 m-0 font-normal">
                              {dest.subtitle || dest.passportStamp?.quote || 'Eksplorasi nilai historis, arsitektur luhur, dan kearifan lokal Yogyakarta.'}
                            </p>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-3.5 border-t border-[#F0E8DC] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-normal truncate">
                              <Clock size={13} className="text-[#8c532b]/80 shrink-0" />
                              <span className="truncate">
                                {dest.ticketInfo?.jamBuka ? dest.ticketInfo.jamBuka.split('(')[0].trim() : 'Buka Setiap Hari'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectPlace) onSelectPlace(dest);
                                setActiveMapPlace(dest);
                                const viewport = document.getElementById('storybook-viewport');
                                if (viewport) viewport.scrollTo({ top: 0, behavior: 'smooth' });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#8c532b] hover:bg-[#724222] text-white shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                            >
                              <span>Buka Kisah Lengkap</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Floating Navigation Controls (Arrows + Counter + Mini Thumbnails) */}
              <div className="flex flex-col items-center gap-4 mt-3">
                {/* Nav Arrows & Counter */}
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={() => setActiveCardIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentCardIdx === 0}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-[#E8DFC9] text-[#2D180C] shadow-sm hover:bg-[#FAF6EE] hover:border-[#8c532b] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-90"
                    aria-label="Destinasi Sebelumnya"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="text-center min-w-[130px]">
                    <span className="font-['Outfit'] text-sm sm:text-base font-bold text-[#2D180C]">
                      {currentCardIdx + 1}
                    </span>
                    <span className="text-xs text-neutral-400 mx-1.5 font-normal">/</span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {filteredPlaces.length} Destinasi
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveCardIndex((prev) => Math.min(filteredPlaces.length - 1, prev + 1))}
                    disabled={currentCardIdx === filteredPlaces.length - 1}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-[#E8DFC9] text-[#2D180C] shadow-sm hover:bg-[#FAF6EE] hover:border-[#8c532b] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-90"
                    aria-label="Destinasi Berikutnya"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Interactive Destination Pills Selector */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl px-4 pt-1">
                  {filteredPlaces.map((p, pIdx) => {
                    const isSelected = pIdx === currentCardIdx;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveCardIndex(pIdx)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#8c532b] text-white border-[#8c532b] font-semibold shadow-xs scale-105'
                            : 'bg-white hover:bg-[#FAF6EE] text-neutral-600 border-[#E8DFC9] font-normal'
                        }`}
                      >
                        <span className="truncate max-w-[140px] sm:max-w-[180px]">{p.name.split(' & ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
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
                            {currentUser ? currentUser.name : 'Gabriel Fazriel'}
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

        const activeAuthorName = currentUser ? currentUser.name : 'Gabriel Fazriel';
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
                  <motion.button
                    type="button"
                    onClick={() =>
                      openLogin({
                        benefitType: 'review',
                        title: 'Buat Akun untuk Mengulas',
                        description: 'Masuk atau daftarkan akun Anda untuk memberikan ulasan dan terhubung dengan komunitas penjelajah Hamemayu.'
                      })
                    }
                    onMouseEnter={() => setIsReviewBtnHovered(true)}
                    onMouseLeave={() => setIsReviewBtnHovered(false)}
                    onTouchStart={() => setIsReviewBtnHovered(true)}
                    onTouchEnd={() => setIsReviewBtnHovered(false)}
                    whileTap={{ scale: 0.96 }}
                    animate={{
                      backgroundColor: isReviewBtnHovered ? '#9E1C64' : '#2C221E',
                      borderColor: isReviewBtnHovered ? '#9E1C64' : '#C99B52',
                      boxShadow: isReviewBtnHovered
                        ? '0 8px 24px rgba(158, 28, 100, 0.42)'
                        : '0 4px 14px rgba(44, 34, 30, 0.16)',
                      y: isReviewBtnHovered ? -2 : 0
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25
                    }}
                    style={{
                      padding: '0.75rem 1.6rem',
                      borderRadius: '999px',
                      color: '#FAF8F5',
                      border: '1.5px solid #C99B52',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}
                  >
                    <span>Masuk / Buat Akun untuk Mengulas</span>
                    <motion.span
                      initial={false}
                      animate={{
                        width: isReviewBtnHovered ? 'auto' : 0,
                        opacity: isReviewBtnHovered ? 1 : 0,
                        x: isReviewBtnHovered ? 0 : -10,
                        marginLeft: isReviewBtnHovered ? 8 : 0
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 26
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </motion.span>
                  </motion.button>
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
                            style={{ color: '#8C5E3C', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Sembunyikan
                          </span>
                        </span>
                      ) : (
                        <span>
                          Jika tempat yang Anda cari belum ada di ...{' '}
                          <span
                            onClick={() => setExpandedBio(true)}
                            style={{ color: '#8C5E3C', fontWeight: 500, cursor: 'pointer' }}
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
                              color: '#8C5E3C',
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
                                  src={badge.iconSrc || '/assets/icons/icon_culture.svg'}
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
                      color: profileTab === 'ulasan' ? '#8C5E3C' : '#5f6368',
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
                          backgroundColor: '#8C5E3C',
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
                      color: profileTab === 'foto' ? '#8C5E3C' : '#5f6368',
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
                          backgroundColor: '#8C5E3C',
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
                      color: profileTab === 'badge' ? '#8C5E3C' : '#5f6368',
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
                          backgroundColor: '#8C5E3C',
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
                        ['/assets/images/jogja_gudeg.webp', '/assets/images/jogja_malioboro.webp'],
                        ['/assets/images/jogja_keraton.webp', '/assets/images/jogja_batik.webp'],
                        ['/assets/images/jogja_tamansari.webp', '/assets/images/jogja_prambanan.webp']
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
                                    style={{ color: '#8C5E3C', fontWeight: 500, cursor: 'pointer' }}
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
                                      style={{ color: '#8C5E3C', fontWeight: 500, cursor: 'pointer' }}
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
                        { src: '/assets/images/jogja_gudeg.webp', title: 'Gudeg Yu Djum' },
                        { src: '/assets/images/jogja_keraton.webp', title: 'Keraton Yogyakarta' },
                        { src: '/assets/images/jogja_malioboro.webp', title: 'Malioboro' },
                        { src: '/assets/images/jogja_tamansari.webp', title: 'Sumur Gumuling' },
                        { src: '/assets/images/jogja_batik.webp', title: 'Batik Giriloyo' },
                        { src: '/assets/images/jogja_prambanan.webp', title: 'Candi Prambanan' }
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
                            backgroundColor: '#8C5E3C',
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
                              border: isShowcased ? '1.5px solid #8C5E3C' : '1px solid #dadce0',
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
                                  src={b.iconSrc || '/assets/icons/icon_culture.svg'}
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
                                        color: '#8C5E3C',
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
                                border: isShowcased ? '1px solid #8C5E3C' : '1px solid #dadce0',
                                color: isShowcased ? '#8C5E3C' : '#3c4043',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={isShowcased ? 'Hapus dari pameran profil' : 'Pamerkan badge ini di profil'}
                            >
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
