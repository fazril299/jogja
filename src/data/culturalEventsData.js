// Real, verified cultural events and curated cultural travel journals of D.I. Yogyakarta
// Sources: Dinas Pariwisata Daerah Istimewa Yogyakarta (visitingjogja.jogjaprov.go.id) & Keraton Ngayogyakarta Hadiningrat (kratonjogja.id)

export const CULTURAL_EVENTS = [
  {
    id: 'sekaten-grebeg-mulud',
    name: 'Hajad Dalem Sekaten & Grebeg Mulud',
    category: 'Upacara Keraton',
    dayDate: '16',
    monthName: 'September',
    year: '2025',
    time: '08.00 – 12.30 WIB',
    jawaCalendar: '12 Rabiul Awal (Mulud) 1959 Jawa',
    dateFull: '16 September 2025 • Pukul 08.00 – 12.30 WIB',
    monthIndex: 8, // September (0-indexed)
    status: 'Agenda Utama Kasultanan',
    location: 'Kagungan Dalem Masjid Gedhe Kauman & Pagelaran Keraton',
    district: 'Kota Yogyakarta',
    badge: 'Tradisi Sakral Abad ke-16',
    highlight: 'Kirab Gunungan & Gamelan Sekati',
    image: '/assets/images/real_gunungan_grebeg.jpg',
    shortDesc: 'Kirab 5 Gunungan hasil bumi dan pusaka gamelan Sekati yang dikawal 10 bregada prajurit keraton.',
    shortTip: 'Wajib berpakaian sopan dan tertutup. Dilarang melangkah di atas instrumen gamelan.',
    coordinates: { lat: -7.8041, lng: 110.3644 },
    description:
      'Peringatan maulid Nabi Muhammad SAW dengan tradisi pembunyian pusaka gamelan Kyai Gunturmadu dan Kyai Nagawilaga selama 7 hari nonstop, diakhiri prosesi agung kirab 5 Gunungan hasil bumi yang diperebutkan (rayahan) oleh ribuan masyarakat dan dikawal 10 bregada prajurit keraton.',
    tips: 'Wajib berpakaian sopan dan tertutup. Dilarang keras melangkah atau melompati gamelan sakral keraton di bangsal pagongan.',
    source: 'Kraton Ngayogyakarta Hadiningrat'
  },
  {
    id: 'labuhan-merapi',
    name: 'Upacara Adat Labuhan Merapi',
    category: 'Upacara Keraton',
    dayDate: '18',
    monthName: 'Maret',
    year: '2025',
    time: '06.30 – 13.00 WIB',
    jawaCalendar: '30 Rajab (Bulan Rejeb) 1958 Jawa',
    dateFull: '18 Maret 2025 • Pukul 06.30 – 13.00 WIB',
    monthIndex: 2,
    status: 'Upacara Sakral Tahunan',
    location: 'Petilasan Mbah Maridjan, Kinahrejo hingga Pos Sri Manganti',
    district: 'Sleman',
    badge: 'Poros Kosmis Utara',
    highlight: 'Sumbu Filosofis Garis Imajiner',
    image: '/assets/images/jogja_merapi.jpg',
    shortDesc: 'Ritual persembahan uborampe pusaka Kasultanan ke lereng Merapi dalam kesatuan kosmis Sumbu Filosofis.',
    shortTip: 'Kenakan pakaian lapangan dan sepatu trekking bertapak kuat.',
    coordinates: { lat: -7.5925, lng: 110.4461 },
    description:
      'Ritual persembahan uborampe pusaka Ageng Kasultanan Ngayogyakarta Hadiningrat ke puncak Gunung Merapi sebagai ungkapan syukur dan doa keselamatan kosmis, menghubungkan Sumbu Filosofis Panggung Krapyak – Keraton – Tugu – Gunung Merapi.',
    tips: 'Kenakan pakaian lapangan dan sepatu trekking bertapak kuat. Bawa mantel hujan dan patuhi arahan Abdi Dalem Juru Kunci Merapi.',
    source: 'Tepas Dwarapura Keraton Yogyakarta'
  },
  {
    id: 'ramayana-ballet-prambanan',
    name: 'Sendratari Ramayana Prambanan (Panggung Terbuka)',
    category: 'Pertunjukan Seni',
    dayDate: '10',
    monthName: 'Mei',
    year: '2025',
    time: '19.30 – 21.30 WIB',
    jawaCalendar: 'Setiap Selasa, Kamis & Sabtu (Mei – Oktober)',
    dateFull: '10 Mei 2025 • Pukul 19.30 – 21.30 WIB (Rutin Musim Kemarau)',
    monthIndex: 4,
    status: 'Warisan Dunia UNESCO',
    location: 'Open Air Theatre Candi Prambanan, Jl. Raya Solo - Yogyakarta',
    district: 'Sleman',
    badge: 'Mahakarya Seni Kolosal',
    highlight: '200 Penari Berlatar Candi Megah',
    image: '/assets/images/real_ramayana_stage.jpg',
    shortDesc: 'Pementasan tari kolosal 200 penari klasik gagrak Yogyakarta berlatar kemegahan Candi Prambanan.',
    shortTip: 'Hadir 45 menit sebelum pentas untuk tempat duduk terbaik.',
    coordinates: { lat: -7.752, lng: 110.4915 },
    description:
      'Pementasan mahakarya tari kolosal Ramayana tanpa dialog yang memadukan gerak tari Jawa klasik gagrak Yogyakarta dengan tata pencahayaan megah berlatar belakang tiga candi utama Prambanan di bawah naungan langit malam bulan purnama.',
    tips: 'Datang 45 menit sebelum pentas untuk memilih tempat duduk terbaik. Kenakan pakaian hangat karena angin malam candi cukup kencang.',
    source: 'PT Taman Wisaran Candi Borobudur & Prambanan'
  },
  {
    id: 'artjog',
    name: 'ArtJog — Indonesian Contemporary Art Fair 2025',
    category: 'Pameran Seni',
    dayDate: '27',
    monthName: 'Juni',
    year: '2025',
    time: '10.00 – 21.00 WIB',
    jawaCalendar: 'Berlangsung 27 Juni – 31 Agustus 2025',
    dateFull: '27 Juni – 31 Agustus 2025 • Buka Pukul 10.00 – 21.00 WIB',
    monthIndex: 5,
    status: 'Eksibisi Seni Internasional',
    location: 'Jogja National Museum (JNM), Jl. Prof. DR. Amri Yahya No. 1',
    district: 'Kota Yogyakarta',
    badge: 'Barometer Seni Kontemporer',
    highlight: 'Instalasi Khusus Puluhan Maestro',
    image: '/assets/images/real_artjog.jpg',
    shortDesc: 'Eksibisi seni rupa kontemporer internasional bergengsi dengan instalasi karya maestro nusantara.',
    shortTip: 'Beli tiket online untuk menghindari antrean loket.',
    coordinates: { lat: -7.8016, lng: 110.3524 },
    description:
      'Eksibisi seni rupa kontemporer paling bergengsi di Asia Tenggara yang menampilkan instalasi raksasa site-specific, kuratorial karya maestro perupa nusantara dan mancanegara, serta program Curatorial Tour dan pertunjukan musik independen.',
    tips: 'Beli tiket online untuk menghindari antrean loket. Dilarang menyentuh instalasi karya tanpa izin pemandu.',
    source: 'ArtJog Official & Dinas Kebudayaan DIY'
  },
  {
    id: 'tapa-bisu-1-suro',
    name: 'Mubeng Beteng & Lampah Tapa Bisu 1 Suro',
    category: 'Upacara Keraton',
    dayDate: '26',
    monthName: 'Juli',
    year: '2025',
    time: '23.00 – 03.30 WIB (Malam Hari)',
    jawaCalendar: 'Malam 1 Sura (Tahun Baru Jawa 1959)',
    dateFull: '26 Juli 2025 • Pukul 23.00 – 03.30 WIB (Tengah Malam)',
    monthIndex: 6,
    status: 'Laku Spiritual Kasultanan',
    location: 'Pelataran Keben & Mengitari Benteng Baluwerti Keraton',
    district: 'Kota Yogyakarta',
    badge: 'Hening Tanpa Bicara 5 KM',
    highlight: 'Ritual Introspeksi Luhur',
    image: '/assets/images/real_bregada_keraton.jpg',
    shortDesc: 'Laku tirakat berjalan kaki mengitari dinding benteng Baluwerti sejauh 5 km dalam keheningan total.',
    shortTip: 'Hening total: dilarang berbicara, menyalakan flash kamera, atau menyalakan HP.',
    coordinates: { lat: -7.8053, lng: 110.3642 },
    description:
      'Laku tirakat ribuan abdi dalem dan warga Yogyakarta yang berjalan kaki mengitari dinding benteng Keraton (Baluwerti) sejauh 5 kilometer dalam keheningan total tanpa alas kaki, tanpa bicara, dan tanpa telepon seluler sebagai bentuk introspeksi dan doa tolak bala menyambut tahun baru Jawa.',
    tips: 'Jaga kesakralan mutlak: dilarang berbicara, menyalakan lampu kilat kamera/HP, merokok, atau makan sepanjang rute mengitari benteng.',
    source: 'Keraton Ngayogyakarta Hadiningrat'
  },
  {
    id: 'festival-kebudayaan-yogyakarta',
    name: 'Festival Kebudayaan Yogyakarta (FKY) 2025',
    category: 'Festival Rakyat',
    dayDate: '11',
    monthName: 'Oktober',
    year: '2025',
    time: '14.00 – 22.00 WIB',
    jawaCalendar: 'Berlangsung Sepanjang Bulan Oktober 2025',
    dateFull: '11 – 25 Oktober 2025 • Pukul 14.00 – 22.00 WIB',
    monthIndex: 9,
    status: 'Pesta Budaya Rakyat Terbesar',
    location: 'Kawasan Cagar Budaya & Ruang Publik Lintas Kabupaten/Kota',
    district: 'Sleman, Bantul & Kota Jogja',
    badge: 'Pawai Kesenian & Pasar Kriya',
    highlight: 'Eksplorasi Budaya Akar Rumput',
    image: '/assets/images/real_bregada_gunungan.jpg',
    shortDesc: 'Perayaan akbar seni dan tradisi kebudayaan rakyat Yogyakarta selama dua pekan penuh di ruang publik.',
    shortTip: 'Arena terbuka dan bebas biaya tiket untuk seluruh masyarakat umum.',
    coordinates: { lat: -7.7956, lng: 110.3695 },
    description:
      'Perayaan akbar seni dan tradisi kebudayaan masyarakat Yogyakarta selama dua pekan penuh yang melibatkan ribuan seniman rakyat, karnaval jalanan, pasar kuliner kuno nusantara, workshop kriya tradisi, dan panggung wayang kulit semalam suntuk.',
    tips: 'Sebagian besar arena acara terbuka gratis untuk publik. Gunakan kantong ramah lingkungan untuk berbelanja kuliner pasar rakyat.',
    source: 'Dinas Kebudayaan (Kundha Kabudayan) DIY'
  },
  {
    id: 'grebeg-syawal',
    name: 'Hajad Dalem Grebeg Syawal 1446 H',
    category: 'Upacara Keraton',
    dayDate: '31',
    monthName: 'Maret',
    year: '2025',
    time: '08.30 – 11.30 WIB',
    jawaCalendar: '1 Syawal (Hari Raya Idul Fitri 1958 Jawa)',
    dateFull: '31 Maret 2025 • Pukul 08.30 – 11.30 WIB',
    monthIndex: 2,
    status: 'Sedekah Agung Sri Sultan',
    location: 'Bangsal Kemandhungan menuju Masjid Gedhe Kauman',
    district: 'Kota Yogyakarta',
    badge: 'Kirab Prajurit Bregada',
    highlight: '5 Gunungan Hasil Bumi Kasultanan',
    image: '/assets/images/real_gunungan_grebeg.jpg',
    shortDesc: 'Wujud rasa syukur dan sedekah Sri Sultan berupa 5 Gunungan hasil bumi diarak menuju Masjid Gedhe.',
    shortTip: 'Hadir sebelum pukul 08.30 WIB di Masjid Gedhe untuk sudut pandang terbaik.',
    coordinates: { lat: -7.8041, lng: 110.3644 },
    description:
      'Wujud rasa syukur dan sedekah Sri Sultan Hamengku Buwono kepada segenap rakyat setelah menunaikan ibadah puasa Ramadan. Lima jenis Gunungan (Kakung, Putri, Gepak, Dharat, dan Pawuhan) diarak dengan dentuman salvo kehormatan dan iringan korps prajurit bregada keraton.',
    tips: 'Datang di pelataran Masjid Gedhe Kauman sebelum pukul 08.30 WIB untuk mendapatkan sudut pandang terbaik saat prosesi doa dan rayahan gunungan.',
    source: 'Kraton Ngayogyakarta Hadiningrat'
  },
  {
    id: 'jamasan-pusaka',
    name: 'Siraman Pusaka Keraton (Jamasan Tosan Aji)',
    category: 'Upacara Keraton',
    dayDate: '01',
    monthName: 'Agustus',
    year: '2025',
    time: '09.00 – 14.00 WIB',
    jawaCalendar: 'Jumat Kliwon Bulan Sura 1959 Jawa',
    dateFull: '01 Agustus 2025 • Pukul 09.00 – 14.00 WIB',
    monthIndex: 7,
    status: 'Pensucian Senjata Sakral',
    location: 'Kompleks Kedhaton & Museum Kereta Keraton Rotowijayan',
    district: 'Kota Yogyakarta',
    badge: 'Pusaka Mataram Kuno',
    highlight: 'Pensucian Kereta Kyai Jimat',
    image: '/assets/images/jogja_keraton.jpg',
    shortDesc: 'Upacara sakral pensucian tosan aji dan Kereta Kencana legendaris peninggalan Dinasti Mataram Islam.',
    shortTip: 'Dapat disaksikan di Museum Kereta Keraton Rotowijayan dengan tiket museum.',
    coordinates: { lat: -7.8066, lng: 110.3628 },
    description:
      'Upacara pensucian tosan aji dan pusaka peninggalan Dinasti Mataram Islam, termasuk Keris Kanjeng Kyai Ageng Kopek dan Kereta Kencana legendaris Nyai Jimat, menggunakan air sumur zamrud keraton, perasan jeruk nipis alami, dan minyak cendana murni.',
    tips: 'Masyarakat umum dapat menyaksikan prosesi siraman kereta kencana di Museum Kereta Keraton Rotowijayan dengan membeli tiket masuk museum reguler.',
    source: 'Tepas Dwarapura Keraton Yogyakarta'
  },
  {
    id: 'wayang-wong-srimanganti',
    name: 'Pentas Wayang Wong & Tari Klasik Sri Manganti',
    category: 'Pertunjukan Seni',
    dayDate: '18',
    monthName: 'Mei',
    year: '2025',
    time: '09.30 – 12.00 WIB',
    jawaCalendar: 'Setiap Hari Minggu Pagi Sepanjang Tahun',
    dateFull: 'Setiap Minggu Pagi (Termasuk 18 Mei 2025) • Pukul 09.30 – 12.00 WIB',
    monthIndex: 4,
    status: 'Agenda Rutin Keraton',
    location: 'Bangsal Sri Manganti, Kompleks Wisata Keraton Yogyakarta',
    district: 'Kota Yogyakarta',
    badge: 'Tari Klasik Gagrak Keraton',
    highlight: 'Pementasan Abdi Dalem Tari',
    image: '/assets/images/real_tari_srimanganti.jpg',
    shortDesc: 'Pergelaran tari klasik gagrak keraton oleh Abdi Dalem Kawedanan Kridhamardawa di Bangsal Sri Manganti.',
    shortTip: 'Cukup membeli tiket masuk reguler Keraton Yogyakarta (Rp 15.000).',
    coordinates: { lat: -7.8052, lng: 110.3643 },
    description:
      'Pergelaran tari klasik srimpi, bedhaya, dan fragmen lakon wayang wong oleh Abdi Dalem Kawedanan Kridhamardawa. Dapat dinikmati secara inklusif dan gratis oleh seluruh pengunjung yang memiliki tiket masuk Keraton Yogyakarta.',
    tips: 'Cukup membeli tiket masuk reguler Keraton Yogyakarta (Rp 15.000) untuk menikmati seluruh rangkaian pertunjukan tari di bangsal.',
    source: 'Kawedanan Kridhamardawa Keraton'
  },
  {
    id: 'bekakak-gamping',
    name: 'Upacara Adat Saparan Bekakak Gamping',
    category: 'Festival Rakyat',
    dayDate: '22',
    monthName: 'Agustus',
    year: '2025',
    time: '13.30 – 17.30 WIB',
    jawaCalendar: 'Jumat Kliwon Bulan Sapar 1959 Jawa',
    dateFull: '22 Agustus 2025 • Pukul 13.30 – 17.30 WIB',
    monthIndex: 7,
    status: 'Warisan Budaya Takbenda',
    location: 'Gunung Gamping & Lapangan Ambarketawang, Gamping',
    district: 'Sleman',
    badge: 'Tradisi Agraris Bersejarah',
    highlight: 'Penyembelihan Pengantin Ketan',
    image: '/assets/images/real_bekakak_gamping.jpg',
    shortDesc: 'Tradisi agraris unik kirab dan penyembelihan sepasang boneka pengantin ketan berisi gula merah.',
    shortTip: 'Saksikan kirab budaya yang semarak. Bawa payung pelindung terik matahari.',
    coordinates: { lat: -7.795, lng: 110.3235 },
    description:
      'Tradisi agraris unik penyembelihan sepasang boneka pengantin dari tepung ketan berisi cairan gula merah di bekas penambangan batu gamping, mengenang kesetiaan Abdi Dalem Ki Wirasuta dan Nyi Wirasuta kepada Sri Sultan Hamengku Buwono I.',
    tips: 'Saksikan kirab budaya yang sangat semarak dari Lapangan Ambarketawang menuju Gunung Gamping. Bawa payung atau topi pelindung terik matahari.',
    source: 'Dinas Kebudayaan Kabupaten Sleman'
  },
  {
    id: 'jibb-batik-biennale',
    name: 'Jogja International Batik Biennale (JIBB) 2025',
    category: 'Festival Rakyat',
    dayDate: '02',
    monthName: 'Oktober',
    year: '2025',
    time: '09.00 – 21.00 WIB',
    jawaCalendar: 'Hari Batik Nasional • 2 – 6 Oktober 2025',
    dateFull: '2 – 6 Oktober 2025 • Pukul 09.00 – 21.00 WIB',
    monthIndex: 9,
    status: 'Kota Batik Dunia UNESCO',
    location: 'Museum Benteng Vredeburg & Pendopo Royal Ambarrukmo',
    district: 'Kota Yogyakarta & Sleman',
    badge: 'Masterpiece Batik Dunia',
    highlight: 'Fashion Show & Workshop Canting',
    image: '/assets/images/real_batik_keraton.jpg',
    shortDesc: 'Konvensi internasional dan peragaan busana batik adiluhung merayakan status Jogja Kota Batik Dunia.',
    shortTip: 'Ikuti lokakarya mencanting motif parang bersama para pembatik senior.',
    coordinates: { lat: -7.8003, lng: 110.3662 },
    description:
      'Konvensi internasional, eksibisi mahakarya kain batik klasik pusaka, dan peragaan busana batik adiluhung untuk merayakan status Yogyakarta sebagai Kota Batik Dunia oleh World Crafts Council (WCC), mempertemukan maestro pembatik keraton dengan desainer dunia.',
    tips: 'Ikuti kelas lokakarya mencanting motif parang dan ceplok bersama para pembatik senior Giriloyo dan Imogiri.',
    source: 'Dewan Kerajinan Nasional Daerah (Dekranasda) DIY'
  }
];

// PANDUAN CARA BERBUDAYA DENGAN BENAR DI YOGYAKARTA
// Lengkap dengan foto asset lokal, aturan Do's & Don'ts, serta adab kearifan lokal
export const CULTURAL_ETIQUETTE_GUIDE = [
  {
    id: 'etiquette-clothing-keraton',
    title: 'Adab Berbusana di Keraton & Makam Raja Mataram',
    subTitle: 'Unggah-Ungguh Busana Sopan & Pantangan Motif Larangan',
    category: 'Tata Busana & Adab',
    image: '/assets/images/jogja_batik.jpg',
    accentColor: '#C99B52',
    overview:
      'Memasuki kompleks kedhaton keraton dan petilasan makam suci raja-raja Mataram (Imogiri dan Kotagede) membutuhkan kepatuhan pada tata busana adat Jawa sebagai bentuk takzim kepada leluhur dan Sultan.',
    rules: [
      {
        type: 'do',
        title: 'Wajib Berpakaian Rapi & Tertutup',
        desc: 'Kenakan kemeja berlengan, celana panjang bahan, atau busana peranakan/beskap tradisional bagi pria. Wanita disarankan mengenakan kebaya atau pakaian tertutup dengan kain jarik di bawah lutut.'
      },
      {
        type: 'do',
        title: 'Lepas Alas Kaki di Area Pelataran Suci',
        desc: 'Saat berziarah di Makam Raja Imogiri atau memasuki Bangsal Kencono, pengunjung diwajibkan melepas sepatu dan berjalan tanpa alas kaki sebagai simbol kesetaraan derajat di hadapan Sang Khalik.'
      },
      {
        type: 'dont',
        title: 'Dilarang Mengenakan Celana Pendek & Singlet',
        desc: 'Dilarang masuk jika mengenakan celana pendek di atas lutut, rok mini, kaos tanpa lengan, ataupun kacamata hitam di area pelataran dalam kedhaton.'
      },
      {
        type: 'dont',
        title: 'Hindari Motif Batik Larangan di Depan Sultan',
        desc: 'Jangan kenakan motif Batik Larangan Kasultanan (Parang Rusak Barong, Garuda Ageng, Cemukiran, dan Udan Riris) saat menghadiri hajad dalem keraton, karena motif ini hanya diperuntukkan bagi Raja dan Putra Mahkota.'
      }
    ],
    proTip:
      'Jika Anda tidak membawa kain jarik saat berziarah ke Makam Raja Imogiri, Anda dapat menyewa busana adat peranakan resmi di loket abdi dalem juru kunci dengan biaya sukarela.'
  },
  {
    id: 'etiquette-gestures-attitude',
    title: 'Sikap Tubuh, Bahasa Tubuh & Lampah Dodok',
    subTitle: 'Menghormati Sesepuh dan Abdi Dalem dengan Santun',
    category: 'Unggah-Ungguh & Sikap',
    image: '/assets/images/jogja_tamansari.jpg',
    accentColor: '#8A5D26',
    overview:
      'Karakteristik masyarakat Yogyakarta menjunjung tinggi andhap asor (rendah hati) dan tepa slira (tenggang rasa). Sikap tubuh saat berinteraksi sangat mencerminkan keluhuran budi pekerti seseorang.',
    rules: [
      {
        type: 'do',
        title: 'Nyuwun Sewu Saat Lewat di Depan Orang Lain',
        desc: 'Membungkukkan badan sedikit ke depan seraya mengayunkan tangan kanan ke bawah dengan mengucapkan “Nyuwun sewu” (Permisi) saat melintas di hadapan orang yang sedang duduk atau sesepuh.'
      },
      {
        type: 'do',
        title: 'Menunjuk Sesuatu dengan Ibu Jari Kanan',
        desc: 'Gunakan ibu jari tangan kanan yang ditegakkan seraya empat jari lainnya dilipat untuk menunjukkan arah atau barang. Ini adalah etika tertinggi menunjuk dalam tradisi Jawa.'
      },
      {
        type: 'dont',
        title: 'Dilarang Menunjuk dengan Jari Telunjuk atau Kaki',
        desc: 'Menunjuk orang atau pusaka dengan jari telunjuk dianggap arogan dan tidak sopan, terlebih menggunakan ujung kaki yang dianggap sangat menghina.'
      },
      {
        type: 'dont',
        title: 'Dilarang Berkacak Pinggang (Malangkerik)',
        desc: 'Menaruh kedua tangan di pinggang (malangkerik) saat berbicara dengan Abdi Dalem atau sesepuh menandakan sikap menantang, angkuh, dan tidak menghargai lawan bicara.'
      }
    ],
    proTip:
      'Saat Abdi Dalem sedang bertugas mengawal upacara atau membawa uborampe keraton, berikan jalan terlebih dahulu dan jangan memotong barisan kirab.'
  },
  {
    id: 'etiquette-sacred-rituals',
    title: 'Etika Menghadiri Upacara Adat & Ritual Sakral',
    subTitle: 'Tata Tertib saat Sekaten, Grebeg, Labuhan, & Tapa Bisu',
    category: 'Prosesi Adat Sakral',
    image: '/assets/images/jogja_keraton.jpg',
    accentColor: '#2C221E',
    overview:
      'Upacara adat di Yogyakarta bukan sekadar tontonan pariwisata, melainkan ritual ibadah spiritual dan permohonan keselamatan kosmis. Kesakralan harus dijaga bersama oleh seluruh pengunjung.',
    rules: [
      {
        type: 'do',
        title: 'Hening Total Selama Lampah Tapa Bisu 1 Suro',
        desc: 'Selama prosesi Mubeng Beteng 1 Suro, ribuan orang berjalan hening tanpa suara. Ikuti keheningan ini tanpa mengobrol, tanpa menyalakan audio gawai, dan tanpa bersuara keras.'
      },
      {
        type: 'do',
        title: 'Dukung Ketertiban Rayahan Gunungan Grebeg',
        desc: 'Tunggu hingga doa yang dipimpin oleh Penghulu Keraton di Masjid Gedhe selesai dibacakan sebelum mendekat dan ikut serta dalam tradisi ngalap berkah rayahan gunungan.'
      },
      {
        type: 'dont',
        title: 'Dilarang Melangkah Melompati Alat Musik Gamelan',
        desc: 'Gamelan Sekati Keraton (Kyai Gunturmadu dan Kyai Nagawilaga) adalah pusaka sakral bertuah. Dilarang keras melangkahi, menduduki, atau menyentuh instrumen gamelan tanpa izin abdi dalem wiyaga.'
      },
      {
        type: 'dont',
        title: 'Dilarang Menyalakan Lampu Kilat (Flash Camera)',
        desc: 'Saat Abdi Dalem sedang melafalkan doa sakral atau saat prosesi laku hening malam hari, lampu kilat kamera dilarang karena mengganggu kekhusyukan ritual leluhur.'
      }
    ],
    proTip:
      'Bila ingin memotret prajurit bregada, lakukan dari jarak yang aman (minimal 2 meter) dan jangan memotong jalur formasi barisan bersenjata pusaka.'
  },
  {
    id: 'etiquette-culinary-angkringan',
    title: 'Tata Krama Santap Kuliner Tradisi & Angkringan',
    subTitle: 'Adab Lincak Bambu, Menghargai Sesama, & Filosofi Nasi',
    category: 'Kuliner & Pergaulan',
    image: '/assets/images/jogja_gudeg.jpg',
    accentColor: '#9E1C64',
    overview:
      'Angkringan dan warung gudeg bukan sekadar tempat makan murah, melainkan ruang perjumpaan sosial yang sarat nilai kesederhanaan, keramahan, dan rasa syukur atas karunia Dewi Sri.',
    rules: [
      {
        type: 'do',
        title: 'Menyapa Penjual & Sesama Pembeli di Lincak',
        desc: 'Ucapkan “Monggo Mas/Pak” saat duduk berdampingan di lincak angkringan. Angkringan adalah panggung keakraban lintas status sosial tanpa sekat kasta.'
      },
      {
        type: 'do',
        title: 'Habiskan Makanan Tanpa Menyisakan Nasi',
        desc: 'Filosofi masyarakat Jawa mengajarkan bersantap hingga butir nasi terakhir bersih sebagai bentuk rasa syukur atas rezeki dan penghormatan kepada petani serta Dewi Sri.'
      },
      {
        type: 'dont',
        title: 'Dilarang Mengangkat Kaki ke Atas Bangku Lincak',
        desc: 'Duduklah bersila rapi atau menjuntaikan kaki ke bawah secara santun. Mengangkat satu kaki ke atas kursi saat makan bersama orang lain dinilai tidak beretika.'
      },
      {
        type: 'dont',
        title: 'Dilarang Berbicara Keras dan Bersuara Kasar',
        desc: 'Hindari tertawa terbahak-bahak secara berlebihan atau menggunakan kata-kata makian kasar saat berada di ruang santap lesehan publik.'
      }
    ],
    proTip:
      'Di angkringan Jogja, Anda cukup menyebutkan secara jujur apa saja gorengan dan sate yang telah disantap saat hendak membayar. Budaya kejujuran ini sangat dihargai oleh warga lokal.'
  }
];

// KAMUS SAKU UNGGAH-UNGGUH BASA JAWA UNTUK WISATAWAN
export const CULTURAL_DICTIONARY = [
  {
    phrase: 'Nyuwun sewu',
    meaning: 'Permisi / Maaf',
    context: 'Gunakan saat melintas di depan sesepuh atau hendak bertanya jalan di jalanan Jogja.'
  },
  {
    phrase: 'Matur nuwun sanget',
    meaning: 'Terima kasih banyak',
    context: 'Ucapkan setelah menerima bantuan, memesan makanan, atau berbelanja di pasar.'
  },
  {
    phrase: 'Sami-sami',
    meaning: 'Sama-sama',
    context: 'Jawaban sopan saat seseorang mengucapkan matur nuwun kepada Anda.'
  },
  {
    phrase: 'Monggo',
    meaning: 'Silakan / Mari',
    context: 'Kata ramah saat mengajak orang lain lewat, bersantap, atau duduk bersama di lincak.'
  },
  {
    phrase: 'Ndherek langkung',
    meaning: 'Numpang lewat',
    context: 'Ungkapan sangat halus saat berjalan melewati kerumunan orang yang lebih tua.'
  },
  {
    phrase: 'Inggih / Sendika dawuh',
    meaning: 'Iya / Siap laksanakan',
    context: 'Jawaban penuh hormat untuk mengiyakan arahan dari sesepuh atau petugas adat.'
  },
  {
    phrase: 'Pinten nggih?',
    meaning: 'Berapa ya (harganya)?',
    context: 'Pertanyaan sopan saat menanyakan tarif becak, andong, atau harga kuliner lokal.'
  },
  {
    phrase: 'Mboten, matur nuwun',
    meaning: 'Tidak, terima kasih',
    context: 'Cara menolak tawaran dagangan di Malioboro secara halus tanpa menyinggung perasaan penjual.'
  }
];

export const CULTURAL_JOURNALS = [
  {
    id: 'prawirotaman-urban',
    title: 'Menjelajah Prawirotaman, Kawasan Wisata Urban Yogyakarta',
    category: 'Eksplorasi Urban',
    readTime: '4 menit baca',
    excerpt:
      'Prawirotaman berkembang dari kawasan permukiman prajurit keraton menjadi sentra wisata seni urban dengan jajaran kafe heritage, galeri kriya, dan spot santai pejalan kaki.',
    date: '5 Agustus 2025',
    author: 'Tim Redaksi Pariwisata DIY',
    source: 'Dinas Pariwisata DIY',
    image: '/assets/images/jogja_malioboro.jpg',
    href: 'https://visitingjogja.jogjaprov.go.id/43132/menjelajah-prawirotaman-surga-wisata-urban-di-jantung-yogyakarta/',
    tags: ['Urban Heritage', 'Kafe Klasik', 'Seni Kontemporer']
  },
  {
    id: 'kotabaru-heritage',
    title: 'Ruang Publik dan Kawasan Bersejarah Kotabaru',
    category: 'Arsitektur & Sejarah',
    readTime: '5 menit baca',
    excerpt:
      'Kenali Taman Kotabaru, jalur pedestrian rindang bernuansa Indische, serta transformasi bangunan cagar budaya peninggalan kolonial abad ke-19 menjadi ruang kreatif anak muda.',
    date: '3 Juni 2025',
    author: 'Kurator Cagar Budaya DIY',
    source: 'Dinas Pariwisata DIY',
    image: '/assets/images/jogja_tugu.jpg',
    href: 'https://visitingjogja.jogjaprov.go.id/42678/jelajahi-space-publik-di-sekitar-kotabaru-heritage-santai-dan-ramah-pejalan-kaki/',
    tags: ['Indische Woonhuizen', 'Pedestrian', 'Cagar Budaya']
  },
  {
    id: 'sumbu-filosofis-unesco',
    title: 'Menelisik Sumbu Filosofis: Poros Kosmis Krapyak hingga Gunung Merapi',
    category: 'Filosofi Kasultanan',
    readTime: '6 menit baca',
    excerpt:
      'Garis imajiner lurus 15 kilometer karya Pangeran Mangkubumi yang diakui UNESCO sebagai Warisan Dunia, menggambarkan siklus perjalanan spiritual manusia sejak lahir (Sangkan Paraning Dumadi) hingga menyatu kembali dengan Sang Pencipta.',
    date: '14 September 2025',
    author: 'Kraton Ngayogyakarta Hadiningrat',
    source: 'Keraton & UNESCO World Heritage',
    image: '/assets/images/jogja_keraton.jpg',
    href: 'https://kratonjogja.id/filosofi-dan-mitos/2/sumbu-filosofis-yogyakarta',
    tags: ['UNESCO', 'Sangkan Paraning Dumadi', 'Poros Kosmis']
  },
  {
    id: 'unggah-ungguh-kuliner',
    title: 'Adat Unggah-Ungguh: Tata Krama Makan Bersama Tradisi Kasultanan',
    category: 'Tata Krama & Budaya',
    readTime: '4 menit baca',
    excerpt:
      'Tata krama luhur masyarakat Jawa dalam menikmati santapan: mendahulukan sesepuh, adab duduk bersila di lincak bambu, hingga filosofi bersantap tanpa menyisakan sebutir nasi pun sebagai bentuk penghormatan Dewi Sri.',
    date: '22 Juli 2025',
    author: 'Pemerhati Budaya Mataram',
    source: 'Balai Pelestarian Kebudayaan DIY',
    image: '/assets/images/jogja_gudeg.jpg',
    href: 'https://visitingjogja.jogjaprov.go.id/',
    tags: ['Tata Krama', 'Unggah-Ungguh', 'Kuliner Tradisi']
  },
  {
    id: 'kotagede-perak',
    title: 'Jejak Mataram Islam di Sudut Sunyi Kotagede',
    category: 'Sejarah & Kriya',
    readTime: '5 menit baca',
    excerpt:
      'Menyusuri lorong berarsitektur Between Two Gates di Jagalan, sentra perajin perak tertua sejak zaman Panembahan Senopati, dan pesona Masjid Gedhe Mataram yang telah berusia ratusan tahun.',
    date: '10 Mei 2025',
    author: 'Dinas Kebudayaan DIY',
    source: 'Kundha Kabudayan DIY',
    image: '/assets/images/jogja_kotagede.jpg',
    href: 'https://visitingjogja.jogjaprov.go.id/',
    tags: ['Kotagede', 'Mataram Islam', 'Kerajinan Perak']
  },
  {
    id: 'senja-ratu-boko',
    title: 'Daya Tarik Candi Ratu Boko di Kala Senja',
    category: 'Arkeologi & Lanskap',
    readTime: '4 menit baca',
    excerpt:
      'Kompleks keraton megah di atas perbukitan Boko abad ke-8 yang memadukan corak Hindu-Buddha, menawarkan panorama matahari terbenam paling dramatis dengan siluet gapura paduraksa.',
    date: '18 April 2025',
    author: 'Arkeolog Balai Pelestarian',
    source: 'TWC Candi Ratu Boko',
    image: '/assets/images/jogja_ratuboko.jpg',
    href: 'https://visitingjogja.jogjaprov.go.id/',
    tags: ['Ratu Boko', 'Sunset Megah', 'Cagar Budaya']
  }
];
