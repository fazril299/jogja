/**
 * Master Data Badge Budaya & Panduan Cara Mendapatkan Badge via GPS D.I. Yogyakarta
 * Menyertakan logika kesulitan (umum, langka, epic, legendaris) di latar belakang.
 */

export const BADGE_TIERS = {
  umum: {
    id: 'umum',
    label: 'Umum',
    name: 'Tingkat Umum',
    color: '#334155',
    maxRadiusMeters: 1500,
    difficultyLabel: 'Mudah • Radius 1.5 KM',
    description: 'Destinasi publik dan kawasan kuliner populer.'
  },
  langka: {
    id: 'langka',
    label: 'Langka',
    name: 'Tingkat Langka',
    color: '#0369A1',
    maxRadiusMeters: 1200,
    difficultyLabel: 'Menengah • Radius 1.2 KM',
    description: 'Sentra kerajinan bersejarah dan cagar budaya Mataram.'
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    name: 'Tingkat Epic',
    color: '#9E1C64',
    maxRadiusMeters: 1000,
    difficultyLabel: 'Tinggi • Radius 1.0 KM',
    description: 'Mahakarya candi agung dunia dan lanskap sakral Merapi.'
  },
  legendaris: {
    id: 'legendaris',
    label: 'Legendaris',
    name: 'Tingkat Legendaris',
    color: '#8A5D26',
    maxRadiusMeters: 800,
    difficultyLabel: 'Legendaris / Master • Radius 800 M',
    description: 'Gelar kehormatan Sumbu Filosofis UNESCO.'
  }
};

export const CULTURAL_BADGES = [
  // 1. MALIOBORO
  {
    id: 'badge-malioboro-stroll',
    tier: 'umum',
    name: 'Pengelana Senja Malioboro',
    subtitle: 'Jantung Kota, Batik & Angkringan',
    bg: '#9E1C64',
    iconSrc: '/images/icon_soul.svg',
    targetPlaceId: 'malioboro-tugu',
    maxRadiusMeters: 1500,
    caraMendapatkan: 'Kunjungi kawasan Jalan Malioboro atau Tugu Pal Putih di Yogyakarta (Radius < 1.5 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Merekam denyut tradisi malam, angkringan kopi joss, dan kawasan nol kilometer Yogyakarta.'
  },
  // 2. WIJILAN
  {
    id: 'badge-wijilan-gudeg',
    tier: 'umum',
    name: 'Pencicip Rasa Wijilan',
    subtitle: 'Sentra Gudeg Kering & Prawirotaman',
    bg: '#C99B52',
    iconSrc: '/images/icon_culinary.svg',
    targetPlaceId: 'wijilan-prawirotaman',
    maxRadiusMeters: 1500,
    caraMendapatkan: 'Kunjungi Sentra Gudeg Wijilan atau Prawirotaman di Yogyakarta (Radius < 1.5 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Menikmati kelezatan gudeg kering daun jati yang dimasak kayu bakar secara turun-temurun sejak era 1950-an.'
  },
  // 3. KOTAGEDE
  {
    id: 'badge-kotagede-silver',
    tier: 'langka',
    name: 'Pusaka Perak Kotagede',
    subtitle: 'Ibu Kota Mataram Islam 1587',
    bg: '#2C221E',
    iconSrc: '/images/icon_culture.svg',
    targetPlaceId: 'kotagede',
    maxRadiusMeters: 1200,
    caraMendapatkan: 'Kunjungi kawasan bersejarah Kotagede (Between Two Gates / Sentra Perak Kemasan, Radius < 1.2 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Merekam keheningan gang-gang sempit rumah kalang dan seni kerajinan perak bakar legendaris.'
  },
  // 4. KASONGAN & IMOGIRI
  {
    id: 'badge-kasongan-craft',
    tier: 'langka',
    name: 'Karsa Gerabah Kasongan',
    subtitle: 'Sentra Gerabah & Makam Raja Imogiri',
    bg: '#6E473B',
    iconSrc: '/images/icon_culture.svg',
    targetPlaceId: 'kasongan-imogiri',
    maxRadiusMeters: 1200,
    caraMendapatkan: 'Kunjungi Sentra Kerajinan Gerabah Kasongan atau Makam Raja-raja Imogiri di Bantul (Radius < 1.2 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Mengenal seni tanah liat yang diwariskan turun-temurun dan perbukitan suci pemakaman sultan Mataram.'
  },
  // 5. PARANGTRITIS & SEGARA KIDUL
  {
    id: 'badge-segara-kidul',
    tier: 'langka',
    name: 'Pelindung Segara Kidul',
    subtitle: 'Pesisir Samudra Hindia & Tebing Karst',
    bg: '#2C221E',
    iconSrc: '/images/icon_nature.svg',
    targetPlaceId: 'parangtritis-gunungkidul',
    maxRadiusMeters: 1200,
    caraMendapatkan: 'Kunjungi Pantai Parangtritis, Gumuk Pasir, atau Tebing Karst Geopark Gunungkidul (Radius < 1.2 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Menyaksikan deburan ombak Samudra Hindia yang menjadi poros kosmologi selatan kerajaan Mataram.'
  },
  // 6. PRAMBANAN & RATU BOKO
  {
    id: 'badge-prambanan-boko',
    tier: 'epic',
    name: 'Mahakarya Siwa Prambanan',
    subtitle: 'Kompleks Candi Hindu & Candi Ratu Boko',
    bg: '#9E1C64',
    iconSrc: '/images/icon_culture.svg',
    targetPlaceId: 'prambanan-ratuboko',
    maxRadiusMeters: 1000,
    caraMendapatkan: 'Kunjungi kawasan Candi Prambanan atau Situs Ratu Boko di Sleman timur (Radius ketat < 1.0 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Mengagumi relief Ramayana abad ke-9 dan panorama cakrawala senja dari gapura andesit Ratu Boko.'
  },
  // 7. MERAPI & KALIURANG
  {
    id: 'badge-merapi-guardian',
    tier: 'epic',
    name: 'Harmoni Semesta Merapi',
    subtitle: 'Lereng Gunung Merapi & Ullen Sentalu',
    bg: '#6E473B',
    iconSrc: '/images/icon_nature.svg',
    targetPlaceId: 'merapi-kaliurang',
    maxRadiusMeters: 1000,
    caraMendapatkan: 'Kunjungi kawasan Kaliurang, Museum Ullen Sentalu, atau lereng Gunung Merapi di Sleman utara (Radius ketat < 1.0 KM), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Menghormati puncak Merapi sebagai poros utara Sumbu Filosofis yang mengalirkan kesuburan tanah Yogyakarta.'
  },
  // 8. KERATON & TAMANSARI
  {
    id: 'badge-keraton-kedhaton',
    tier: 'legendaris',
    name: 'Abdi Luhur Keraton Ngayogyakarta',
    subtitle: 'Kedhaton Kasultanan & Istana Air Tamansari',
    bg: '#2C221E',
    iconSrc: '/images/icon_all.svg',
    targetPlaceId: 'keraton-yogyakarta',
    maxRadiusMeters: 800,
    caraMendapatkan: 'Kunjungi Kompleks Keraton Ngayogyakarta Hadiningrat atau Istana Air Tamansari (Radius presisi < 800 M), lalu tekan tombol "Klaim Badge GPS".',
    lore: 'Gelar kehormatan atas apresiasi terhadap falsafah luhur Hamemayu Hayuning Bawana dan paugeran luhur keraton.'
  },
  // 9. QUEST SUMBU FILOSOFIS MASTER
  {
    id: 'badge-sumbu-filosofis-master',
    tier: 'legendaris',
    name: 'Sang Prawira Sumbu Filosofis UNESCO',
    subtitle: 'Mahkota Penjelajah Kosmologi Yogyakarta',
    bg: '#C99B52',
    iconSrc: '/images/icon_all.svg',
    targetPlaceId: 'special-quest-sumbu',
    maxRadiusMeters: 800,
    caraMendapatkan: 'Selesaikan Misi Sumbu Filosofis: Lakukan klaim GPS sah di Keraton Yogyakarta dan kawasan Malioboro / Tugu Pal Putih.',
    lore: 'Penghargaan tertinggi penjelajah budaya yang telah menapaki seluruh poros kosmologis warisan dunia UNESCO.'
  }
];

export const CULTURAL_QUESTS = [
  {
    id: 'quest-sumbu-filosofis',
    tier: 'legendaris',
    title: 'Misi Pusaka Sumbu Filosofis UNESCO',
    aksara: 'ꦱꦸꦩ꧀ꦧꦸꦥ꦳ꦶꦭꦺꦴꦱꦺꦴꦥ꦳ꦶꦱ꧀',
    description: 'Napak tilas sumbu kosmologis utara-selatan dari Keraton Ngayogyakarta Hadiningrat hingga Tugu Pal Putih Malioboro.',
    badgeRewardId: 'badge-sumbu-filosofis-master',
    requiredPlaceIds: ['keraton-yogyakarta', 'malioboro-tugu'],
    xp: 500,
    caraMendapatkan: 'Klaim GPS di Keraton & Tamansari, kemudian klaim GPS di Malioboro / Tugu.'
  },
  {
    id: 'quest-jejak-mataram-kuno',
    tier: 'langka',
    title: 'Misi Jejak Dinasti Mataram Kuno',
    aksara: 'ꦩꦠꦫꦩ꧀ꦏꦸꦤ',
    description: 'Eksplorasi jejak awal Kesultanan Mataram di Kotagede serta sentra gerabah bersejarah Kasongan / Imogiri.',
    badgeRewardId: 'badge-kotagede-silver',
    requiredPlaceIds: ['kotagede', 'kasongan-imogiri'],
    xp: 350,
    caraMendapatkan: 'Klaim GPS di Kotagede, kemudian klaim GPS di Kasongan atau Makam Imogiri.'
  },
  {
    id: 'quest-candi-merapi-agung',
    tier: 'epic',
    title: 'Misi Mahakarya Candi & Semesta Merapi',
    aksara: 'ꦥꦿꦩ꧀ꦧꦤꦤ꧀ꦩꦼꦫꦥꦶ',
    description: 'Saksikan kemegahan arsitektur Candi Prambanan abad ke-9 dan dinginnya lereng Gunung Merapi Kaliurang.',
    badgeRewardId: 'badge-prambanan-boko',
    requiredPlaceIds: ['prambanan-ratuboko', 'merapi-kaliurang'],
    xp: 450,
    caraMendapatkan: 'Klaim GPS di Candi Prambanan / Ratu Boko, kemudian klaim GPS di Merapi / Kaliurang.'
  },
  {
    id: 'quest-kuliner-kembul-bujana',
    tier: 'umum',
    title: 'Misi Cita Rasa Kembul Bujana',
    aksara: 'ꦏꦸꦭꦶꦤꦺꦂꦗꦺꦴꦒ꧀ꦗ',
    description: 'Jelajahi sentra gudeg Wijilan dan cicipi kopi joss arang membara di angkringan legendaris Malioboro.',
    badgeRewardId: 'badge-wijilan-gudeg',
    requiredPlaceIds: ['wijilan-prawirotaman', 'malioboro-tugu'],
    xp: 250,
    caraMendapatkan: 'Klaim GPS di Wijilan / Prawirotaman, kemudian klaim GPS di kawasan Malioboro.'
  }
];
