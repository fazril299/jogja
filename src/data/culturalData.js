/**
 * Jogja Cultural Sanctuary - Master Dataset Sosial, Budaya & Kuliner GPS D.I. Yogyakarta
 * Struktur data baku Storybook 7 Chapter + Radar GPS Kuliner Otentik vs Tourist Trap
 */

export const REGIONS = [
  { id: 'all', label: 'Seluruh D.I. Yogyakarta' },
  { id: 'kota-jogja', label: 'Kota Yogyakarta' },
  { id: 'sleman', label: 'Kabupaten Sleman' },
  { id: 'bantul', label: 'Kabupaten Bantul' },
  { id: 'gunungkidul', label: 'Kabupaten Gunungkidul' },
  { id: 'kulonprogo', label: 'Kabupaten Kulon Progo' },
];

/**
 * DATA ZONA GPS WILAYAH JOGJA & RADAR KULINER JUJUR (ENAK VS KURANG ENAK / TOURIST TRAP)
 * Digunakan untuk fitur pelacakan otomatis GPS ketika user berada di suatu wilayah di Jogja
 */
export const JOGJA_GPS_ZONES = [
  {
    id: 'zona-malioboro-tugu',
    wilayahName: 'Malioboro, Tugu & Stasiun Tugu',
    kabupaten: 'Kota Yogyakarta (Gedongtengen & Danurejan)',
    coordinates: { lat: -7.7926, lng: 110.3658 },
    wisataAnchor: {
      trackCode: 'WISATA-A1',
      name: 'Kawasan Jalan Malioboro & Titik Nol Kilometer',
      address: 'Jl. Malioboro, Sosromenduran, Gedong Tengen, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55271',
      coordinates: { lat: -7.7926, lng: 110.3658 }
    },
    radiusKm: 2.2,
    vibe: 'Pusat keramaian malam, lorong belanja batik, dan angkringan kopi arang.',
    gpsAlert: 'GPS Terkunci di Kawasan Malioboro (D.I. Yogyakarta): Menampilkan Track Point Wisata Malioboro beserta titik rekomendasi terdekat sesuai koordinat asli Google Maps.',
    kulinerList: [
      {
        id: 'kopi-joss-lik-man',
        trackPointCode: 'TP-01',
        name: 'Angkringan Lik Man (Kopi Joss Pusat)',
        spotName: 'Jl. Pasar Kembang, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
        coordinates: { lat: -7.7893, lng: 110.3639 },
        distanceFromWisata: '350 m dari Malioboro',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Rekomendasi Otentik Lokal',
        tasteProfile: 'Kopi hitam kental diseduh arang kayu asem membara dengan Sego Kucing sambal teri.',
        honestReview: 'Pelopor Kopi Joss di utara Stasiun Tugu sejak 1968. Arang panas memberi aroma asap dan karamel pada kopi, dengan informasi harga yang jelas.'
      },
      {
        id: 'lumpia-samijaya',
        trackPointCode: 'TP-02',
        name: 'Lumpia Samijaya Malioboro',
        spotName: 'Jl. Malioboro No.18, Suryatmajan, Kec. Danurejan, Kota Yogyakarta, DIY 55213',
        coordinates: { lat: -7.7946, lng: 110.3657 },
        distanceFromWisata: '120 m dari Malioboro',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Rekomendasi • Kudapan Khas',
        tasteProfile: 'Kulit renyah berisi bengkuang segar, ayam cincang, dan telur puyuh dengan saus bawang putih tumbuk.',
        honestReview: 'Beroperasi sejak 1976 di depan Hotel Mutiara Malioboro. Lumpia digoreng sesuai pesanan sehingga disajikan hangat dan gurih.'
      },
      {
        id: 'gudeg-mbah-lindu',
        trackPointCode: 'TP-03',
        name: 'Gudeg Mbok Lindu Sosrowijayan',
        spotName: 'Jl. Sosrowijayan No.41-43, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
        coordinates: { lat: -7.7916, lng: 110.3632 },
        distanceFromWisata: '280 m dari Malioboro',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Warisan Kuliner Legendaris',
        tasteProfile: 'Gudeg basah gurih-manis dengan krecek pedas lembut dan bubur santan areh kental.',
        honestReview: 'Salah satu gudeg paling bersejarah di barat Malioboro yang masih dimasak menggunakan kayu bakar tradisional.'
      },
      {
        id: 'lesehan-liar-tanpa-menu',
        trackPointCode: 'TP-04',
        name: 'Deretan Lesehan Sirip Luar Malioboro (Non-Resmi)',
        spotName: 'Jl. Perwakilan / Sirip Luar Malioboro, Kec. Danurejan, Kota Yogyakarta, DIY 55213',
        coordinates: { lat: -7.7935, lng: 110.3671 },
        distanceFromWisata: '190 m dari Malioboro',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Harga Kurang Jelas',
        tasteProfile: 'Ayam/burung dara goreng cenderung dingin dan sambal encer.',
        honestReview: 'Kurang direkomendasikan karena cita rasanya cenderung standar dan daftar harga tidak selalu tersedia. Periksa harga sebelum memesan atau pilih tempat dengan daftar menu yang jelas.'
      }
    ]
  },
  {
    id: 'zona-keraton-wijilan',
    wilayahName: 'Keraton, Wijilan & Taman Sari',
    kabupaten: 'Kota Yogyakarta (Kraton & Gondomanan)',
    coordinates: { lat: -7.8053, lng: 110.3644 },
    wisataAnchor: {
      trackCode: 'WISATA-A2',
      name: 'Keraton Ngayogyakarta Hadiningrat & Tamansari',
      address: 'Jl. Rotowijayan Blok No. 1, Panembahan, Kecamatan Kraton, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55131',
      coordinates: { lat: -7.8053, lng: 110.3644 }
    },
    radiusKm: 2.0,
    vibe: 'Jantung pusaka kasultanan, sentra gudeg kering Wijilan, dan kuliner favorit raja-raja Mataram.',
    gpsAlert: 'GPS Terkunci di Kawasan Keraton & Wijilan (D.I. Yogyakarta): Menampilkan Track Point Wisata Keraton beserta rekomendasi kuliner terdekat sesuai Google Maps.',
    kulinerList: [
      {
        id: 'gudeg-yu-djum-wijilan',
        trackPointCode: 'TP-01',
        name: 'Gudeg Yu Djum Wijilan 167',
        spotName: 'Jl. Wijilan No.167, Panembahan, Kecamatan Kraton, Kota Yogyakarta, DIY 55131',
        coordinates: { lat: -7.8046, lng: 110.3669 },
        distanceFromWisata: '240 m dari Keraton',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Standar Emas Gudeg Kering',
        tasteProfile: 'Gudeg kering cokelat kemerahan daun jati, areh kental legit, dan telur pindang.',
        honestReview: 'Dimasak dengan kayu bakar sejak 1951 di timur Alun-Alun Utara. Tersedia untuk dinikmati di tempat maupun sebagai oleh-oleh dalam besek atau kendil.'
      },
      {
        id: 'bale-raos-keraton',
        trackPointCode: 'TP-02',
        name: 'Bale Raos - The Sultan’s Dishes',
        spotName: 'Jl. Magangan Kulon No.1, Panembahan, Kecamatan Kraton, Kota Yogyakarta, DIY 55131',
        coordinates: { lat: -7.8082, lng: 110.3638 },
        distanceFromWisata: '180 m dari Keraton',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Gastronomi Resep Raja Mataram',
        tasteProfile: 'Bebek Suwar-Suwir saus kedondong segar, Semur Piyik, dan Bir Jawa rempah secang.',
        honestReview: 'Restoran resmi di kompleks Keraton Yogyakarta yang menyajikan hidangan autentik kegemaran Sri Sultan HB VIII hingga HB X.'
      },
      {
        id: 'brongkos-handayani',
        trackPointCode: 'TP-03',
        name: 'Warung Brongkos Handayani',
        spotName: 'Jl. Gading No.2, Patehan, Kecamatan Kraton, Kota Yogyakarta, DIY 55133',
        coordinates: { lat: -7.8139, lng: 110.3631 },
        distanceFromWisata: '420 m dari Alun-Alun Kidul',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Favorit Warga Lokal Sejak 1975',
        tasteProfile: 'Kuah santan hitam kluwek kaya rempah dengan koyor sapi empuk, tahu, dan kacang tolo.',
        honestReview: 'Terletak di selatan Plengkung Gading. Kuah kluwek bersantan disajikan bersama koyor sapi yang empuk dengan cita rasa gurih.'
      },
      {
        id: 'wedang-ronde-alkid-asalan',
        trackPointCode: 'TP-04',
        name: 'Gerobak Ronde Musiman Lingkar Alun-Alun Kidul',
        spotName: 'Jl. Alun-Alun Kidul, Patehan, Kecamatan Kraton, Kota Yogyakarta, DIY 55133',
        coordinates: { lat: -7.8118, lng: 110.3632 },
        distanceFromWisata: '360 m dari Keraton',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Kuah Kurang Pekat',
        tasteProfile: 'Kuah jahe encer dominan gula pasir, ketan ronde cenderung keras.',
        honestReview: 'Kurang direkomendasikan karena rasa jahenya kurang pekat. Ronde Mbah Payem di Kauman dapat menjadi alternatif di sekitar Keraton.'
      }
    ]
  },
  {
    id: 'zona-kotagede-prawirotaman',
    wilayahName: 'Kotagede & Prawirotaman',
    kabupaten: 'Kota Yogyakarta Selatan (Kotagede & Mergangsan)',
    coordinates: { lat: -7.8275, lng: 110.3996 },
    wisataAnchor: {
      trackCode: 'WISATA-A3',
      name: 'Kawasan Warisan Budaya Masjid Gedhe Mataram Kotagede',
      address: 'Jl. Masjid Besar, Sayangan, Jagalan, Kec. Banguntapan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55192',
      coordinates: { lat: -7.8295, lng: 110.3981 }
    },
    radiusKm: 2.8,
    vibe: 'Lorong bersejarah di bekas ibu kota Mataram Islam, kriya perak, bakmi Jawa arang, dan gelato buatan lokal.',
    gpsAlert: 'GPS Terkunci di Kawasan Kotagede & Prawirotaman (D.I. Yogyakarta): Menampilkan Track Point Wisata Kotagede & rekomendasi kuliner terdekat.',
    kulinerList: [
      {
        id: 'bakmi-jawa-mbah-gito',
        trackPointCode: 'TP-01',
        name: 'Bakmi Jawa Mbah Gito',
        spotName: 'Jl. Nyi Ageng Nis No.9, Rejowinangun, Kec. Kotagede, Kota Yogyakarta, DIY 55171',
        coordinates: { lat: -7.8152, lng: 110.4024 },
        distanceFromWisata: '450 m dari Kotagede',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Otentik Dimasak Anglo Arang',
        tasteProfile: 'Bakmi Godhog dan Bakmi Nyemek kaldu ayam kampung asli dan telur bebek di atas tungku arang.',
        honestReview: 'Menawarkan suasana pendopo kayu Jawa dengan kaldu telur bebek bercita rasa gurih.'
      },
      {
        id: 'kipo-bu-djito',
        trackPointCode: 'TP-02',
        name: 'Kipo Bu Djito Kotagede',
        spotName: 'Jl. Mondorakan No.27, Prenggan, Kec. Kotagede, Kota Yogyakarta, DIY 55172',
        coordinates: { lat: -7.8272, lng: 110.3995 },
        distanceFromWisata: '190 m dari Pasar Kotagede',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Kudapan Pusaka Sejak 1946',
        tasteProfile: 'Kue mungil tepung ketan hijau pandan berisi enten kelapa gula jawa panggang.',
        honestReview: 'Kudapan yang berasal dari masa Mataram di Kotagede, dengan aroma pandan panggang dan cita rasa manis.'
      },
      {
        id: 'tempo-gelato-prawirotaman',
        trackPointCode: 'TP-03',
        name: 'Tempo Gelato Prawirotaman',
        spotName: 'Jl. Prawirotaman No.38B, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, DIY 55153',
        coordinates: { lat: -7.8190, lng: 110.3712 },
        distanceFromWisata: '110 m dari Kampung Turis Prawirotaman',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Artisan Gelato Rempah Lokal',
        tasteProfile: 'Gelato padat lembut dengan varian Kemangi, Jahe, Kayu Manis, dan Cokelat.',
        honestReview: 'Gelato dengan pilihan bahan segar dan tekstur lembut.'
      },
      {
        id: 'restoran-western-turis-mahal',
        trackPointCode: 'TP-04',
        name: 'Kafe Bistro Turis Koridor Barat Prawirotaman',
        spotName: 'Jl. Prawirotaman II, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, DIY 55153',
        coordinates: { lat: -7.8198, lng: 110.3698 },
        distanceFromWisata: '260 m dari Prawirotaman',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Harga Relatif Tinggi',
        tasteProfile: 'Menu western frozen standar dengan harga tinggi.',
        honestReview: 'Kurang direkomendasikan karena menggunakan bahan beku standar dengan harga yang relatif tinggi.'
      }
    ]
  },
  {
    id: 'zona-sleman-kaliurang',
    wilayahName: 'Sleman, Kaliurang & Prambanan',
    kabupaten: 'Kabupaten Sleman (Pakem & Cangkringan)',
    coordinates: { lat: -7.5978, lng: 110.4234 },
    wisataAnchor: {
      trackCode: 'WISATA-A4',
      name: 'Museum Ullen Sentalu & Taman Wisata Kaliurang Merapi',
      address: 'Jl. Boyong KM 25, Kaliurang, Hargobinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582',
      coordinates: { lat: -7.5978, lng: 110.4234 }
    },
    radiusKm: 8.5,
    vibe: 'Udara sejuk pegunungan Merapi, jadah tempe hangat, dan kopi klotok.',
    gpsAlert: 'GPS Terkunci di Kawasan Lereng Merapi & Kaliurang (D.I. Yogyakarta): Menampilkan Track Point Wisata Merapi beserta rekomendasi kuliner terdekat.',
    kulinerList: [
      {
        id: 'jadah-tempe-mbah-carik',
        trackPointCode: 'TP-01',
        name: 'Jadah Tempe Mbah Carik Pusat',
        spotName: 'Jl. Astomulyo No.50, Kaliurang, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.5966, lng: 110.4245 },
        distanceFromWisata: '140 m dari Taman Kaliurang',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Ikonik Lereng Merapi Sejak 1950',
        tasteProfile: 'Ketan uli kelapa gurih kenyal (jadah) dijepit tempe dan tahu bacem gula aren.',
        honestReview: 'Pelopor jadah tempe di Kaliurang yang telah lama dikenal masyarakat. Hidangan ini umum disajikan hangat bersama cabai rawit.'
      },
      {
        id: 'kopi-klotok-pakem',
        trackPointCode: 'TP-02',
        name: 'Warung Kopi Klotok Kaliurang',
        spotName: 'Jl. Kaliurang KM.16, Area Sawah, Pakembinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.6691, lng: 110.4209 },
        distanceFromWisata: 'Jalur Utama Kaliurang Pakem',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Masakan Desa dan Pisang Goreng',
        tasteProfile: 'Sayur lodeh tempe cabai hijau, telur krispi garing, pisang goreng hangat, dan kopi klotok.',
        honestReview: 'Rumah joglo di tepi sawah dengan latar Gunung Merapi. Menyajikan telur dadar renyah dan pisang goreng.'
      },
      {
        id: 'sate-kelinci-pak-budi-kaliurang',
        trackPointCode: 'TP-03',
        name: 'Sate Kelinci & Tongseng Pak Budi Kaliurang',
        spotName: 'Jl. Astomulyo, Kaliurang, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.5978, lng: 110.4265 },
        distanceFromWisata: '210 m dari Taman Wisata Kaliurang',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Rekomendasi • Kuliner Khas Lereng Merapi',
        tasteProfile: 'Sate daging kelinci empuk rendah kolesterol dengan bumbu kacang halus dan kecap manis hangat.',
        honestReview: 'Salah satu kuliner khas Kaliurang. Dagingnya bertekstur lembut dan dibumbui hingga meresap.'
      },
      {
        id: 'warung-wisata-jeep-mahal',
        trackPointCode: 'TP-04',
        name: 'Kios Jadah Tempe Tiruan Jalur Bawah Kaliurang',
        spotName: 'Jl. Kaliurang KM 22, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.6145, lng: 110.4210 },
        distanceFromWisata: '1.8 km dari Ullen Sentalu',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Tekstur Ketan Keras',
        tasteProfile: 'Jadah cenderung keras dan baceman kurang meresap.',
        honestReview: 'Kurang direkomendasikan karena menggunakan nama mirip pelopor namun kualitas ketannya keras. Pastikan membeli di pusat Jl. Astomulyo No.50.'
      }
    ]
  },
  {
    id: 'zona-bantul-jejeran',
    wilayahName: 'Bantul, Jejeran, Kasongan & Imogiri',
    kabupaten: 'Kabupaten Bantul (Pleret, Sewon & Imogiri)',
    coordinates: { lat: -7.8712, lng: 110.3879 },
    wisataAnchor: {
      trackCode: 'WISATA-A5',
      name: 'Sentra Gerabah Kasongan & Pasar Seni Gabusan',
      address: 'Jl. Kasongan, Kajen, Bangunjiwo, Kec. Kasihan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55184',
      coordinates: { lat: -7.8453, lng: 110.3385 }
    },
    radiusKm: 7.5,
    vibe: 'Kawasan kuliner yang dikenal dengan sate klathak jeruji besi dan mangut lele asap.',
    gpsAlert: 'GPS Terkunci di Kawasan Bantul & Kasongan (D.I. Yogyakarta): Menampilkan Track Point Wisata Bantul beserta rekomendasi kuliner dalam radius 5–10 KM.',
    kulinerList: [
      {
        id: 'sate-klathak-pak-pong',
        trackPointCode: 'TP-01',
        name: 'Sate Klathak Pak Pong Pusat',
        spotName: 'Jl. Sultan Agung No.18, Jejeran II, Wonokromo, Kec. Pleret, Kabupaten Bantul, DIY 55791',
        coordinates: { lat: -7.8712, lng: 110.3879 },
        distanceFromWisata: '6.1 km dari Kasongan',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Rekomendasi Olahan Kambing',
        tasteProfile: 'Sate kambing muda bumbu garam & merica ditusuk jeruji besi sepeda dengan kuah gulai.',
        honestReview: 'Tusuk jeruji besi membantu menghantarkan panas ke bagian dalam daging agar matang merata dan bertekstur empuk.'
      },
      {
        id: 'mangut-lele-mbah-marto',
        trackPointCode: 'TP-02',
        name: 'Mangut Lele Dapur Asli Mbok Marto Ijoyo',
        spotName: 'Jl. Sewon Indah, Ngireng-ireng, Panggungharjo, Kec. Sewon, Kabupaten Bantul, DIY 55188',
        coordinates: { lat: -7.8485, lng: 110.3585 },
        distanceFromWisata: '2.2 km dari Kasongan',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Otentik Dapur Tungku Kayu Bakar',
        tasteProfile: 'Lele asap panggang pelepah kelapa dimasak dalam kuah santan pedas cabai rawit.',
        honestReview: 'Pengunjung dapat mengambil hidangan langsung dari dapur tradisional. Aroma asap pada lele meresap hingga ke bagian dalam.'
      },
      {
        id: 'mie-lethek-mbah-mendes',
        trackPointCode: 'TP-03',
        name: 'Bakmi Lethek Mbah Mendes',
        spotName: 'Jl. Sarirejo Singosaren, Soropaten, Ringinharjo, Kec. Bantul, Kabupaten Bantul, DIY 55712',
        coordinates: { lat: -7.8825, lng: 110.3412 },
        distanceFromWisata: '4.1 km dari Kasongan',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Mie Singkong Alami Tanpa Pemutih',
        tasteProfile: 'Mie tepung gaplek singkong kenyal dimasak anglo arang dengan suwiran ayam kampung dan telur bebek.',
        honestReview: 'Terbuat dari singkong alami Srandakan tanpa pemutih, teksturnya kenyal gurih dengan aroma arang yang khas.'
      },
      {
        id: 'warung-sate-tanpa-harga-bantul',
        trackPointCode: 'TP-04',
        name: 'Warung Sate Kambing Tanpa Daftar Harga Ringroad Selatan',
        spotName: 'Jl. Ringroad Selatan, Tamantirto, Kec. Kasihan, Kabupaten Bantul, DIY 55184',
        coordinates: { lat: -7.8312, lng: 110.3298 },
        distanceFromWisata: '1.8 km dari Kasongan',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Tekstur dan Harga',
        tasteProfile: 'Daging kambing cenderung alot dan tidak mencantumkan harga per porsi.',
        honestReview: 'Kurang direkomendasikan karena potongan dagingnya kurang empuk. Sentra Sate Klathak di Jejeran atau Imogiri dapat menjadi alternatif.'
      }
    ]
  },
  {
    id: 'zona-gunungkidul-geopark',
    wilayahName: 'Parangtritis & Pesisir Selatan Jogja',
    kabupaten: 'Bantul Selatan & Perbatasan Purwosari Gunungkidul',
    coordinates: { lat: -8.0247, lng: 110.3323 },
    wisataAnchor: {
      trackCode: 'WISATA-A6',
      name: 'Pantai Parangtritis, Gumuk Pasir & Bukit Paralayang Watugupit',
      address: 'Jl. Parangtritis KM 28, Parangtritis, Kec. Kretek, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55772',
      coordinates: { lat: -8.0247, lng: 110.3323 }
    },
    radiusKm: 7.5,
    vibe: 'Pesisir Samudra Hindia, gumuk pasir vulkanik, tebing karst Watugupit, dan sentra seafood segar TPI Depok.',
    gpsAlert: 'GPS Terkunci di Kawasan Pesisir Selatan Parangtritis (D.I. Yogyakarta): Menampilkan Track Point Wisata Pantai Selatan beserta rekomendasi kuliner dalam radius 5–10 KM.',
    kulinerList: [
      {
        id: 'tpi-pasar-ikan-depok',
        trackPointCode: 'TP-01',
        name: 'Pasar Ikan Segar TPI Pantai Depok (Koperasi Mina Bahari)',
        spotName: 'Kawasan TPI Pantai Depok, Parangtritis, Kec. Kretek, Kabupaten Bantul, DIY 55772',
        coordinates: { lat: -8.0152, lng: 110.2908 },
        distanceFromWisata: '4.6 km dari Pantai Parangtritis',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Seafood Segar Timbangan Resmi',
        tasteProfile: 'Ikan cakalang, kakap merah, dan udang segar hasil tangkapan nelayan pagi hari dibakar bumbu madu/kuning.',
        honestReview: 'Salah satu pilihan di Pantai Selatan adalah membeli hasil laut di tempat pelelangan ikan, lalu meminta warung koperasi memasaknya.'
      },
      {
        id: 'ingkung-mbah-cempluk-kretek',
        trackPointCode: 'TP-02',
        name: 'Ingkung Ayam Kampung Jawa Kretek Parangtritis',
        spotName: 'Jl. Parangtritis KM 24, Donotirto, Kec. Kretek, Kabupaten Bantul, DIY 55772',
        coordinates: { lat: -7.9912, lng: 110.3195 },
        distanceFromWisata: '3.9 km dari Pantai Parangtritis',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Ayam Kampung Utuh Bumbu Areh Gurih',
        tasteProfile: 'Ayam kampung utuh dimasak perlahan dengan santan areh kental, daun salam, serai, dan sambal bawang.',
        honestReview: 'Ayam kampung disajikan dengan kuah santan areh khas pesisir selatan dan tekstur daging yang empuk.'
      },
      {
        id: 'resto-watugupit-paralayang',
        trackPointCode: 'TP-03',
        name: 'Kuliner Tebing Bukit Paralayang Watugupit',
        spotName: 'Area Hutan, Giricahyo, Kec. Purwosari, Kabupaten Gunungkidul, DIY 55872',
        coordinates: { lat: -8.0298, lng: 110.3486 },
        distanceFromWisata: '1.8 km dari Pantai Parangtritis',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
        status: 'enak',
        verdictLabel: 'Pemandangan Pantai Saat Senja',
        tasteProfile: 'Hidangan Nusantara hangat ditemani kelapa muda segar dan kopi jahe di atas tebing karst Samudra Hindia.',
        honestReview: 'Tempat makan dengan pemandangan garis pantai Parangtritis dari kawasan tebing karst Gunungkidul, terutama saat senja.'
      },
      {
        id: 'warung-pantai-getok-harga',
        trackPointCode: 'TP-04',
        name: 'Warung Lesehan Tanpa Daftar Harga Bibir Pantai',
        spotName: 'Jalur Parkir Non-Resmi Pantai Selatan, DIY',
        coordinates: { lat: -8.0235, lng: 110.3301 },
        distanceFromWisata: '280 m dari Parkir Luar',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        status: 'kurang',
        verdictLabel: 'Perlu Pertimbangan • Informasi Harga',
        tasteProfile: 'Ikan goreng kering dari bahan beku dan kelapa muda dengan harga yang relatif tinggi.',
        honestReview: 'Kurang direkomendasikan apabila warung tidak mencantumkan daftar harga. Pastikan harga sebelum memesan.'
      }
    ]
  }
];

export const CULTURAL_PLACES = [
  {
    id: 'keraton-yogyakarta',
    name: 'Keraton Ngayogyakarta & Tamansari',
    subtitle: 'Poros Kosmologi Sumbu Filosofis UNESCO & Falsafah Hamemayu Hayuning Bawana',
    province: 'Kota Yogyakarta • D.I. Yogyakarta',
    region: 'kota-jogja',
    regionLabel: 'Kota Yogyakarta',
    categoryTheme: ['culture', 'soul', 'budaya-sejarah'],
    coverImage: '/assets/images/jogja_keraton.jpg',
    thumbnail: '/assets/images/jogja_keraton.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.8053, lng: 110.3644 },
    gpsZoneId: 'zona-keraton-wijilan',
    ticketInfo: {
      domestik: 'Rp 15.000 / orang (Keraton) & Rp 15.000 (Tamansari)',
      mancanegara: 'Rp 25.000 / orang',
      jamBuka: '08.30 – 14.30 WIB (Senin Tutup untuk Wisata)',
      parkir: 'Motor Rp 3.000 • Mobil Rp 10.000'
    },
    badges: ['Warisan Dunia UNESCO 2023', 'Pusat Sumbu Filosofis', 'Budaya & Sejarah'],
    passportStamp: {
      title: 'Abdi Budaya Mataram',
      symbol: '👑',
      quote: 'Memayu hayuning bawana, ambrasta dur hangkara — memperindah dunia dan memberantas angkara.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Titik Pusat Kosmologi Antara Gunung Merapi dan Samudra Hindia',
      overview: 'Keraton Ngayogyakarta Hadiningrat didirikan oleh Pangeran Mangkubumi (Sri Sultan Hamengkubuwono I) pada tahun 1755 pasca Perjanjian Giyanti. Kompleks istana ini dirancang sebagai titik temu sakral Sumbu Filosofis yang membentang lurus dari Panggung Krapyak di selatan, Keraton di tengah, hingga Tugu Pal Putih di utara.',
      history: 'Di sebelah barat daya Keraton berdiri Istana Air Tamansari (1758), mahakarya arsitektur Portugis-Jawa tempat pemandian keluarga kerajaan, kanal bawah tanah, serta Sumur Gumuling yang dulunya berfungsi sebagai masjid melingkar berakustik gema alami sekaligus benteng pertahanan rahasia.',
      landscapeHighlights: [
        { label: 'Bangsal Kencono & Pelataran Pasir Hitam', detail: 'Pendopo utama kayu jati ukir emas yang dikelilingi pasir vulkanik dari Pantai Parangtritis dan Gunung Merapi.' },
        { label: 'Istana Air Tamansari (Umbul Pasiraman)', detail: 'Kolam pemandian biru kehijauan berhias pot raksasa dan menara Umbul Winangun tempat Sultan memandang taman.' },
        { label: 'Sumbu Filosofis UNESCO', detail: 'Tata ruang kota yang melambangkan perjalanan roh manusia dari kelahiran (Krapyak) menuju Sang Pencipta (Tugu).' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Ketulusan Abdi Dalem & Harmoni Warga Jeron Beteng',
      peopleName: 'Abdi Dalem Punokawan, Prajurit Kraton, & Warga Jeron Beteng',
      description: 'Di dalam lingkar benteng Baluwarti (Jeron Beteng), ribuan warga hidup berdampingan langsung dengan keluarga Kesultanan. Para Abdi Dalem mengabdi bukan demi nominal gaji materi, melainkan mencari "Ngalap Berkah" — ketenangan batin, kehormatan budi, dan pelestarian paugeran adat.',
      socialStructure: [
        { role: 'Abdi Dalem Keprajan & Punokawan', desc: 'Penjaga pusaka, penabuh gamelan Kyai Guntur Madu, dan pemandu tata krama budaya di dalam kompleks Kedhaton.' },
        { role: 'Bregada Prajurit Keraton', desc: '10 kesatuan prajurit tradisional (Wirabraja, Dhaeng, Patangpuluh, Ketanggung, Mantrijero, dll.) yang berparade saat Garebeg.' },
        { role: 'Pembatik Kampung Taman & Rotowijayan', desc: 'Perajin batik tulis motif larangan (Parang Rusak, Kawung, Huk) dan penatah wayang kulit.' }
      ],
      philosophy: 'Sangkan Paraning Dumadi & Manunggaling Kawula Gusti — menyadari dari mana manusia berasal, bagaimana berbuat luhur di dunia, dan ke mana manusia akan kembali.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Tari Bedhaya Sakral, Gamelan Sekaten, & Kuliner Raja Mataram',
      cultureElements: [
        {
          category: 'Seni Tari Sakral',
          name: 'Tari Bedhaya Semang & Srimpi',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          detail: 'Tarian sakral yang ditarikan oleh sembilan penari putri dengan gerakan meditatif halus, melambangkan sembilan lubang hawa nafsu manusia dan harmoni kosmis.'
        },
        {
          category: 'Upacara Adat Agung',
          name: 'Hajad Dalem Garebeg Mulud & Sekaten',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
          detail: 'Arak-arakan tujuh Gunungan hasil bumi dari Keraton menuju Masjid Gedhe Kauman sebagai wujud sedekah raja kepada rakyatnya.'
        },
        {
          category: 'Gastronomi Kasultanan',
          name: 'Bebek Suwar-Suwir, Brongkos, & Bir Jawa',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Hidangan kegemaran raja-raja Yogyakarta yang dapat dicicipi langsung di Bale Raos dan Warung Brongkos Handayani Alun-Alun Kidul.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Kisah Lorong Bawah Tanah Tamansari & Beringin Kembar Ringin Kurung',
      storyTitle: 'Misteri Sumur Gumuling & Mitos Masangin Alun-Alun Kidul',
      storyExcerpt: 'Konon lorong bawah tanah Sumur Gumuling tidak hanya berfungsi sebagai masjid berpendingin air...',
      fullStory: `Di balik keindahan Tamansari terdapat Sumur Gumuling, bangunan melingkar dua tingkat yang dulunya dikelilingi air danau buatan. Di bagian tengahnya bertemu empat tangga menuju satu panggung di atas sumur. Ruangan ini dirancang sedemikian rupa sehingga suara imam saat memimpin salat dapat menggema ke seluruh penjuru tanpa pengeras suara.

Sementara itu di Alun-Alun Selatan (Alkid), berdiri dua pohon beringin kembar "Supit Urang" (Ringin Kurung). Tradisi Masangin mengajak pengunjung berjalan melewati celah di antara kedua beringin tersebut dengan mata tertutup rapat. Masyarakat memercayai bahwa hanya mereka yang berhati tenang, fokus, dan bersih niatnya yang dapat berjalan lurus menembus tengah beringin.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Destinasi Utama di Kawasan Keraton Yogyakarta',
      spots: [
        {
          name: 'Kompleks Kedhaton & Museum Lukisan Raden Saleh',
          type: 'Istana Resmi & Museum Pusaka',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          desc: 'Menyaksikan pameran kereta kencana, silsilah pohon keluarga Mataram, dan pertunjukan reguler Gamelan/Wayang Wong setiap pagi.'
        },
        {
          name: 'Umbul Pasiraman & Sumur Gumuling Tamansari',
          type: 'Situs Cagar Budaya Istana Air',
          image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop',
          desc: 'Menyusuri kolam pemandian kerajaan dan lorong akustik bawah tanah di tengah Kampung Wisata Taman.'
        },
        {
          name: 'Masjid Gedhe Kauman & Kampung Batik Kauman',
          type: 'Pusat Religi & Kampung Wisata',
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Masjid raya beratap tajug tumpang tiga karya Kyai Wiryokusumo (1773) yang dikelilingi gang-gang sempit rumah saudagar batik kuno.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Unggah-Ungguh (Tata Krama) Saat Memasuki Kawasan Keraton',
      etiquette: {
        dos: [
          'Kenakan pakaian sopan dan rapi (berlengan dan menutup lutut) saat memasuki pelataran Keraton dan Masjid Gedhe Kauman.',
          'Lepaskan topi, kacamata hitam, dan jangan membuka payung di dalam area Bangsal Kedhaton sebagai bentuk penghormatan.',
          'Sapalah Abdi Dalem dengan senyum, anggukan kepala ("Mangga, Pak/Bu"), dan mintalah izin sebelum memotret mereka dari dekat.'
        ],
        donts: [
          'Dilarang keras duduk di atas bangsal larangan, membelakangi Bangsal Kencono saat berfoto, atau menyentuh benda pusaka.',
          'Dilarang mengenakan kain batik motif Parang Rusak Barong di dalam pelataran inti Keraton (motif khusus Sultan).',
          'Jangan membeli makanan di pedagang tanpa daftar harga; gunakan fitur Radar GPS Kuliner kami untuk spot terverifikasi.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Navigasi, Jam Pertunjukan & Kuliner Sekitar Keraton',
      accessGuide: 'Berada tepat di titik 0 Km Kota Yogyakarta. Dapat ditempuh dengan berjalan kaki 10 menit dari ujung selatan Malioboro atau menggunakan Trans Jogja Koridor 1A, 2A, dan 3A.',
      bestTime: 'Pukul 08.30 – 11.00 WIB (Selasa–Minggu) agar dapat menyaksikan pertunjukan langsung Gamelan, Macapat, Wayang Kulit, atau Tari Klasik di Bangsal Sri Manganti.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Keraton+Ngayogyakarta+Hadiningrat&z=15&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Keraton+Ngayogyakarta+Hadiningrat'
    }
  },

  {
    id: 'malioboro-tugu',
    name: 'Kawasan Malioboro, Tugu & Beringharjo',
    subtitle: 'Jantung Denyut Kota Yogyakarta, Lorong Sejarah, & Budaya Angkringan',
    province: 'Kota Yogyakarta • D.I. Yogyakarta',
    region: 'kota-jogja',
    regionLabel: 'Kota Yogyakarta',
    categoryTheme: ['culture', 'culinary', 'wisata-hiburan', 'kuliner-wajib'],
    coverImage: '/assets/images/jogja_tugu.jpg',
    thumbnail: '/assets/images/jogja_malioboro.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.7926, lng: 110.3658 },
    gpsZoneId: 'zona-malioboro-tugu',
    ticketInfo: {
      domestik: 'Gratis (Ruang Publik Terbuka 24 Jam) • Benteng Vredeburg Rp 15.000',
      mancanegara: 'Gratis • Benteng Vredeburg Rp 25.000',
      jamBuka: '24 Jam (Teras Malioboro 08.00–22.00 WIB, Beringharjo 08.00–21.00 WIB)',
      parkir: 'Parkir Resmi Abu Bakar Ali / Beskalan: Motor Rp 3.000 • Mobil Rp 5.000–10.000'
    },
    badges: ['Wisata Hiburan', 'Pilihan Kuliner', 'Jantung Sumbu Filosofis'],
    passportStamp: {
      title: 'Penjelajah Malam Malioboro',
      symbol: '🏮',
      quote: 'Di bawah lampu antik Malioboro, setiap langkah adalah rindu yang selalu memanggil pulang.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Boulevard Seribu Karangan Bunga yang Menghubungkan Tugu hingga Titik Nol',
      overview: 'Jalan Malioboro merupakan penggal jalan paling ikonik di Sumbu Filosofis Yogyakarta yang membentang dari Tugu Pal Putih, Stasiun Tugu, Jalan Margo Utomo, Jalan Malioboro, Jalan Margo Mulyo, hingga Titik Nol Kilometer. Dalam bahasa Sanskerta, "Malyabhara" berarti jalan yang dihiasi karangan bunga setiap kali Keraton mengadakan perayaan agung.',
      history: 'Sejak abad ke-18, kawasan ini menjadi poros pertemuan empat budaya: Kasultanan Jawa di selatan, kawasan pemerintahan kolonial Belanda di Benteng Vredeburg & Gedung Agung, kawasan Pecinan di Ketandan, serta pusat perdagangan rakyat di Pasar Beringharjo (berdiri sejak 1758).',
      landscapeHighlights: [
        { label: 'Tugu Pal Putih (De Witte Paal)', detail: 'Monumen poros utara berhiaskan pucuk kerucut emas yang melambangkan Manunggaling Kawula Gusti.' },
        { label: 'Pasar Beringharjo & Kampung Ketandan', detail: 'Pasar tradisional tertua di Jogja tempat berburu batik, rempah jamu kuno, dan pecel senggol.' },
        { label: 'Titik Nol Kilometer & Benteng Vredeburg', detail: 'Kawasan bangunan bersejarah bergaya Indische dengan air mancur dan diorama sejarah kemerdekaan.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Egalitarianisme Angkringan, Kusir Andong, & Pedagang Batik',
      peopleName: 'Komunitas Pedagang Teras Malioboro, Kusir Andong, & Seniman Jalanan',
      description: 'Di Malioboro, batas status sosial melebur. Di bangku kayu Angkringan (HIK), mahasiswa, seniman, wisatawan, hingga pejabat duduk sejajar menikmati nasi kucing dan kopi joss. Para kusir andong empat roda dengan pakaian adat surjan lurik menjadi duta ramah tamah kota.',
      socialStructure: [
        { role: 'Paguyuban Kusir Andong & Becak Kayuh', desc: 'Transportasi tradisional ramah budaya yang menjaga pakem pakaian adat lurik dan blangkon.' },
        { role: 'Saudagar Batik & Jamu Pasar Beringharjo', desc: 'Generasi ketiga dan keempat pedagang kain batik serta peracik rempah jamu tradisional di lantai dasar dan atas.' },
        { role: 'Pelapak Angkringan Kopi Joss Tugu', desc: 'Penjaga tradisi kuliner malam di sepanjang rel utara Stasiun Tugu Yogyakarta.' }
      ],
      philosophy: 'Sapa Aruh & Tepo Seliro — menyapa sesama dengan ramah dan menjaga tenggang rasa di ruang publik milik bersama.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Budaya Jagongan Angkringan, Pecel Senggol, & Malam Selasa Wage',
      cultureElements: [
        {
          category: 'Tradisi Komunal',
          name: 'Selasa Wage Malioboro (Car Free Cultural Night)',
          image: '/assets/images/jogja_tugu.jpg',
          detail: 'Setiap 35 hari sekali (weton lahir Sri Sultan HB X), Malioboro bebas kendaraan bermotor dan berubah menjadi panggung raksasa tari jalanan, musik keroncong, serta kerja bakti reresik.'
        },
        {
          category: 'Kuliner Malam Ikonik',
          name: 'Kopi Joss Arang, Lumpia Samijaya, & Gudeg Mbah Lindu',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Perpaduan kopi arang membara di utara Stasiun Tugu, lumpia rebung bawang putih di depan Hotel Mutiara, dan gudeg pagi legendaris di Sosrowijayan.'
        },
        {
          category: 'Kriya & Perdagangan',
          name: 'Seni Tawar-Menawar Halus di Pasar Beringharjo',
          image: '/assets/images/jogja_kotagede.jpg',
          detail: 'Interaksi jual-beli menggunakan bahasa Jawa Krama yang santun ("Pinten menika, Bu?") untuk mendapatkan batik dan lurik berkualitas.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Asal-Usul Nama Beringharjo & Tugu Golong-Gilig yang Runtuh',
      storyTitle: 'Dari Hutan Beringin Menjadi Pasar "Beringharjo" Pemberi Kesejahteraan',
      storyExcerpt: 'Sebelum tahun 1758, kawasan Pasar Beringharjo adalah hutan pohon beringin lebat...',
      fullStory: `Pada awal berdirinya Kasultanan Yogyakarta tahun 1755, lahan di utara Keraton merupakan hutan pohon beringin (waringin) yang rimbun. Tak lama kemudian, warga mulai memanfaatkan lahan di bawah keteduhan beringin tersebut sebagai tempat transaksi jual beli hasil bumi.

Pada tahun 1925, Sri Sultan Hamengkubuwono VIII membangun kios-kios permanen berarsitektur kolonial dan menamainya "Beringharjo" — gabungan dari kata "Bering" (hutan beringin) dan "Harjo" (kesejahteraan/kemakmuran), dengan harapan pasar ini senantiasa mengayomi seperti pohon beringin dan memberi rezeki halal bagi seluruh rakyat.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Destinasi di Koridor Tugu hingga Titik Nol Kilometer',
      spots: [
        {
          name: 'Tugu Pal Putih & Angkringan Kopi Joss Lik Man',
          type: 'Landmark Ikonik & Kuliner Malam',
          image: '/assets/images/jogja_tugu.jpg',
          desc: 'Berfoto di monumen kebanggaan Jogja saat malam hari lalu menyeruput kopi arang hangat di utara Stasiun Tugu.'
        },
        {
          name: 'Teras Malioboro 1 & Pasar Beringharjo',
          type: 'Sentra UMKM, Batik & Kuliner Resmi',
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Pusat oleh-oleh terkurasi dengan harga transparan serta kuliner legendaris Sate Kere (sate gajih sapi bakar bumbu ketumbar) di pintu timur Beringharjo.'
        },
        {
          name: 'Museum Benteng Vredeburg & Titik Nol Km',
          type: 'Museum Sejarah & Ruang Publik',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          desc: 'Benteng kolonial abad ke-18 yang kini telah direvitalisasi dengan tata cahaya modern dan pertunjukan air mancur malam.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Tips Cerdas & Etika Wisatawan di Kawasan Malioboro',
      etiquette: {
        dos: [
          'Selalu pilih warung makan/lesehan yang mencantumkan buku menu dan daftar harga resmi dengan jelas.',
          'Sepakati tarif Andong atau Becak sebelum naik (rata-rata keliling pendek Rp 50.000 – Rp 100.000 per andong).',
          'Matikan rokok saat berjalan di kerumunan trotoar Malioboro (Kawasan Tanpa Rokok, tersedia tempat khusus merokok).'
        ],
        donts: [
          'Jangan mudah tergiur tawaran calo yang mengatakan toko Bakpia langganan Anda tutup lalu mengarahkan ke merek tiruan.',
          'Jangan berfoto di tengah badan jalan raya Tugu Jogja saat lampu lalu lintas sedang hijau karena membahayakan pengendara.',
          'Dilarang membuang bungkus makanan atau puntung rokok di sepanjang pedestrian batu granit Malioboro.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Langsung dari Stasiun Tugu & Kantong Parkir Resmi',
      accessGuide: 'Turun langsung di Stasiun Yogyakarta (Stasiun Tugu) pintu selatan atau timur, Anda sudah berada tepat di ujung Jalan Malioboro. Jika membawa kendaraan pribadi, parkirkan di Taman Parkir Abu Bakar Ali, Ketandan, atau Beskalan.',
      bestTime: 'Pukul 07.00–10.00 pagi untuk berbelanja nyaman di Beringharjo, atau pukul 18.30–22.30 malam untuk menikmati suasana lampu kota dan kuliner malam.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Jalan+Malioboro+Yogyakarta&z=16&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Jalan+Malioboro+Yogyakarta'
    }
  },

  {
    id: 'kotagede',
    name: 'Warisan Budaya Kotagede & Kampung Perak',
    subtitle: 'Ibu Kota Awal Kerajaan Mataram Islam Abad ke-16, Lorong Kalang, & Kriya Perak',
    province: 'Kota Yogyakarta & Bantul • D.I. Yogyakarta',
    region: 'kota-jogja',
    regionLabel: 'Kota Yogyakarta & Bantul',
    categoryTheme: ['culture', 'culinary', 'budaya-sejarah', 'kampung-wisata'],
    coverImage: '/assets/images/jogja_kotagede.jpg',
    thumbnail: '/assets/images/jogja_kotagede.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.8275, lng: 110.3996 },
    gpsZoneId: 'zona-kotagede-prawirotaman',
    ticketInfo: {
      domestik: 'Gratis (Jelajah Lorong Kampung) • Ziarah Makam Raja Rp 5.000 (Sewa Pakaian Adat Rp 25.000)',
      mancanegara: 'Rp 15.000 – Rp 25.000',
      jamBuka: 'Kawasan bersejarah 07.00–18.00 WIB • Makam Raja: Minggu, Senin, Kamis, Jumat (08.00–16.00)',
      parkir: 'Motor Rp 3.000 • Mobil Rp 5.000 (Area Pasar Kotagede)'
    },
    badges: ['Kampung Wisata', 'Budaya & Sejarah', 'Ibu Kota Mataram Kuno 1586'],
    passportStamp: {
      title: 'Penelusur Lorong Mataram',
      symbol: '💍',
      quote: 'Di antara tembok bata merah tanpa semen dan denting palu perak, sejarah Mataram bernafas abadi.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Jejak Kejayaan Panembahan Senopati & Arsitektur Rumah Kalang',
      overview: 'Kotagede (Kuthagedhe) adalah cikal bakal berdirinya Kerajaan Mataram Islam pada abad ke-16 yang dibangun oleh Ki Ageng Pemanahan dan putranya, Danang Sutawijaya (Panembahan Senopati). Kawasan ini memadukan gapura batu bata merah bergaya Hindu-Majapahit (Paduraksa) dengan nilai-nilai Islam Jawa.',
      history: 'Selain kompleks Masjid Gedhe Mataram (1587) dan Makam Pendiri Mataram, Kotagede terkenal dengan deretan "Rumah Kalang" — rumah bangsawan saudagar emas, perak, dan berlian pada era 1850–1920 yang memadukan pendopo Joglo Jawa dengan kaca patri Art Nouveau Eropa.',
      landscapeHighlights: [
        { label: 'Masjid Gedhe Mataram & Makam Panembahan Senopati', detail: 'Kompleks masjid tertua di Yogyakarta dengan pagar bata merah berukir kaligrafi dan simbol Surya Majapahit.' },
        { label: 'Lorong Sempit Between Two Gates (Alun-Alun)', detail: 'Gang-gang tersembunyi di antara rumah Joglo tua yang dulunya merupakan tanah Alun-Alun Kerajaan Mataram.' },
        { label: 'Rumah Pesik & Rumah Kalang Tegalgendu', detail: 'Kediaman megah saudagar Kalang di tepi Sungai Gajahwong dengan arsitektur eklektik Jawa-Belanda.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Keahlian Kriya Perak Filigri & Keramahan Warga Kampung Alun-Alun',
      peopleName: 'Empu Perajin Perak Kotagede, Saudagar Kalang, & Abdi Dalem Juru Kunci',
      description: 'Sejak masa pemerintahan kerajaan, warga Kotagede dipercaya sebagai penempa perhiasan dan peralatan makan logam mulia istana. Hingga hari ini, di sepanjang Jalan Kemasan dan Mondorakan, kita masih mendengar bunyi ketukan pahat kecil yang menyusun benang-benang perak halus (filigri).',
      socialStructure: [
        { role: 'Maestro Perajin Perak (Kemasan)', desc: 'Pengrajin yang mengolah bijih perak murni 925 menjadi bros, cincin, dan miniatur kereta kencana dengan tangan.' },
        { role: 'Abdi Dalem Juru Kunci Pasarean Mataram', desc: 'Penjaga makam raja-raja awal Mataram yang mengenakan busana adat Pranakan biru tua dan tanpa alas kaki.' },
        { role: 'Ibu Pembuat Kue Kipo & Yangko', desc: 'Pelestari jajanan pasar warisan abad ke-16 di sekitar Pasar Legi Kotagede.' }
      ],
      philosophy: 'Tlaten & Ngati-ati — ketekunan, kesabaran tingkat tinggi, dan ketelitian dalam menempa logam maupun menjaga kerukunan bertetangga.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Seni Perak Bakar, Kue Kipo Panggang Cobek, & Bakmi Jawa Anglo',
      cultureElements: [
        {
          category: 'Kriya Logam Mulia',
          name: 'Kerajinan Perak Filigri & Tatah Ukiran Kotagede',
          image: '/assets/images/jogja_kotagede.jpg',
          detail: 'Teknik memilin benang perak setipis rambut lalu mematri dan membakarnya menjadi perhiasan bertekstur klasik khas Kotagede.'
        },
        {
          category: 'Kuliner Pusaka',
          name: 'Kue Kipo Bu Djito, Roti Kembang Waru, & Bakmi Mbah Gito',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Kue Kipo ketan pandan isi kelapa gula jawa, Roti Kembang Waru berkelopak 8 simbol Hasta Brata, dan Bakmi Jawa tungku arang.'
        },
        {
          category: 'Tradisi Ziarah Adat',
          name: 'Tata Cara Busana Peranakan di Makam Raja Mataram',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          detail: 'Setiap peziarah yang masuk ke ruang inti makam Panembahan Senopati wajib mengenakan pakaian adat Jawa lengkap (kemben bagi wanita, surjan/peranakan bagi pria).'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Batu Gilang Singgasana Panembahan Senopati & Ikan Lele Tanpa Daging',
      storyTitle: 'Misteri Watu Gilang & Sendang Seliran Kotagede',
      storyExcerpt: 'Di selatan makam Kotagede terdapat batu andesit hitam berlekuk serta kolam pemandian purba...',
      fullStory: `Di dalam kompleks Kotagede terdapat sebuah batu hitam persegi bernama Watu Gilang yang konon merupakan singgasana tempat Panembahan Senopati bertapa dan memikirkan strategi membangun negeri Mataram. Di permukaan batu tersebut terdapat cekungan yang menurut legenda terjadi akibat benturan kepala Ki Ageng Mangir.

Tak jauh di bawah pohon beringin raksasa berusia ratusan tahun, terdapat kolam Sendang Seliran yang airnya tak pernah kering. Mitos masyarakat setempat menceritakan adanya "Ikan Truno Lele" — ikan lele unik yang konon tampak seperti hanya memiliki tulang dan kepala namun tetap berenang hidup di dasar mata air.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Rute Jalan Kaki Kotagede dan Prawirotaman',
      spots: [
        {
          name: 'Kompleks Masjid Gedhe Mataram & Sendang Seliran',
          type: 'Cagar Budaya Abad ke-16',
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Menyaksikan gapura Paduraksa bata merah kuno dan mata air Sendang Seliran di bawah naungan pohon beringin raksasa.'
        },
        {
          name: 'Kampung Alun-Alun (Between Two Gates) & Rumah Kalang',
          type: 'Kampung Wisata Bersejarah',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          desc: 'Menyusuri lorong sempit penuh rumah Joglo berusia ratusan tahun yang terawat sangat bersih oleh warga setempat.'
        },
        {
          name: 'Workshop Perak HS Silver / Ansor Silver & Bakmi Mbah Gito',
          type: 'Edukasi Kriya & Kuliner Malam',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          desc: 'Melihat langsung proses pembuatan kerajinan perak lalu menutup sore dengan Bakmi Godhog hangat di Rejowinangun.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Etika Menyusuri Lorong Pemukiman Warga Kotagede',
      etiquette: {
        dos: [
          'Berjalan kakilah atau gunakan sepeda saat masuk ke lorong sempit Kampung Alun-Alun dan matikan mesin motor jika ada tulisan tuntun motor.',
          'Ucapkan "Nderek langkung" (Permisi numpang lewat) sambil sedikit membungkuk jika melewati warga yang sedang duduk di teras rumah.',
          'Beli Kue Kipo Bu Djito sebelum pukul 14.00 siang karena dibuat terbatas setiap hari tanpa bahan pengawet.'
        ],
        donts: [
          'Dilarang masuk atau membuka pintu halaman Rumah Kalang milik pribadi tanpa izin pemilik rumah.',
          'Dilarang mengenakan perhiasan emas mencolok saat masuk ke area ziarah dalam Makam Raja Mataram (aturan adat kesederhanaan).',
          'Jangan memotret dengan lampu kilat (flash) di dalam ruang pusaka makam.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Menuju Kotagede (6 Km Tenggara Pusat Kota Jogja)',
      accessGuide: 'Berjarak sekitar 20 menit berkendara ke arah tenggara dari Malioboro/Keraton. Parkirkan kendaraan di sekitar Pasar Legi Kotagede atau Masjid Gedhe Mataram lalu lanjutkan dengan berjalan kaki.',
      bestTime: 'Pukul 07.30–10.30 pagi saat cahaya matahari menembus lorong-lorong bata merah, atau pukul 15.30–19.30 sore dilanjutkan makan malam di Bakmi Jawa Mbah Gito.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Masjid+Gedhe+Mataram+Kotagede+Yogyakarta&z=16&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Masjid+Gedhe+Mataram+Kotagede+Yogyakarta'
    }
  },

  {
    id: 'prambanan-ratuboko',
    name: 'Candi Prambanan & Keraton Ratu Boko',
    subtitle: 'Mahakarya Candi Hindu Tertinggi di Indonesia & Senja Keemasan Bukit Boko',
    province: 'Sleman • D.I. Yogyakarta',
    region: 'sleman',
    regionLabel: 'Kabupaten Sleman',
    categoryTheme: ['culture', 'soul', 'budaya-sejarah', 'wisata-hiburan'],
    coverImage: '/assets/images/jogja_prambanan.jpg',
    thumbnail: '/assets/images/jogja_prambanan.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.7520, lng: 110.4915 },
    gpsZoneId: 'zona-sleman-kaliurang',
    ticketInfo: {
      domestik: 'Rp 50.000 / dewasa (Prambanan) • Rp 40.000 (Ratu Boko) • Paket Terusan Rp 85.000',
      mancanegara: 'Rp 387.500 (Prambanan) • Rp 387.500 (Ratu Boko)',
      jamBuka: 'Prambanan 06.30–17.00 WIB • Ratu Boko 07.00–17.30 WIB (Sendratari Ramayana 19.30 WIB)',
      parkir: 'Motor Rp 5.000 • Mobil Rp 10.000'
    },
    badges: ['Warisan Dunia UNESCO', 'Budaya & Sejarah', 'Sendratari Ramayana'],
    passportStamp: {
      title: 'Saksi Kemegahan Siwa-Grha',
      symbol: '🏛️',
      quote: 'Menjulang 47 meter menembus langit Mataram Kuno, mengabadikan kisah cinta dan kesetiaan.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Kompleks Candi Trimurti Abad ke-9 & Istana di Atas Bukit Kapur',
      overview: 'Candi Prambanan (Rara Jonggrang) dibangun sekitar tahun 850 Masehi oleh Rakai Pikatan dari Wangsa Sanjaya sebagai persembahan agung kepada Trimurti: Dewa Siwa (Sang Pelebur), Dewa Wisnu (Sang Pemelihara), dan Dewa Brahma (Sang Pencipta). Candi utama Siwa menjulang setinggi 47 meter dengan relief epos Ramayana yang memukau.',
      history: 'Sekitar 3 km di selatan Prambanan, di ketinggian 196 mdpl, terdapat situs Keraton Ratu Boko. Kompleks istana berbenteng batu ini memiliki gapura, pendopo, kolam pemandian keputren, dan gua meditasi dengan pemandangan matahari terbenam.',
      landscapeHighlights: [
        { label: 'Tiga Candi Utama Trimurti & Candi Wahana', detail: 'Enam menara candi batu andesit yang saling berhadapan di pelataran pusat Prambanan.' },
        { label: 'Gerbang Paduraksa Keraton Ratu Boko', detail: 'Gapura batu lima pintu di puncak bukit tempat memandang siluet Prambanan dan Gunung Merapi saat senja.' },
        { label: 'Panggung Terbuka Sendratari Ramayana', detail: 'Amphitheater megah berlatar langsung Candi Prambanan yang bermandikan cahaya lampu malam.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Seniman Tari Ramayana, Pemahat Batu Prambanan, & Petani Kalasan',
      peopleName: 'Komunitas Penari Sendratari Ramayana, Pengrawit, & Warga Desa Bokoharjo',
      description: 'Sejak tahun 1961, ratusan penari dan penabuh gamelan lintas generasi dari Yogyakarta dan sekitarnya menghidupkan panggung Sendratari Ramayana Prambanan tanpa dialog verbal, melainkan melalui bahasa tubuh, tembang sinden, dan obor api Hanoman.',
      socialStructure: [
        { role: 'Maestro Penari & Pengrawit Ramayana', desc: 'Lebih dari 200 seniman panggung yang mementaskan epos Rama-Shinta setiap Selasa, Kamis, dan Sabtu malam.' },
        { role: 'Pemandu Wisata & Arkeolog Lokal', desc: 'Komunitas pemandu bersertifikasi yang menjelaskan filosofi relief pohon Kalpataru dan kisah Kresnayana.' },
        { role: 'Pelaku Kuliner Kalasan & Sleman Timur', desc: 'Pelestari resep Ayam Goreng Kremes Kalasan dan Soto Bathok Mbah Katro di sekitar Candi Sambisari.' }
      ],
      philosophy: 'Satyam Eva Jayate — kebenaran dan kesetiaan murni pada akhirnya akan selalu mengalahkan keangkuhan dan angkara murka.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Sendratari Ramayana, Relief Pohon Kalpataru, & Ayam Goreng Kalasan',
      cultureElements: [
        {
          category: 'Pertunjukan Kelas Dunia',
          name: 'Sendratari Ramayana Ballet Prambanan',
          image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop',
          detail: 'Pertunjukan tari kolosal yang memegang rekor dunia sebagai pementasan tari rutin terlama, menampilkan adegan Hanoman Obong dengan lingkaran api nyata.'
        },
        {
          category: 'Arkeologi & Simbolisme',
          name: 'Motif Pohon Hayat Kalpataru & Kinara-Kinari',
          image: '/assets/images/jogja_kasongan.jpg',
          detail: 'Relief pohon kehidupan yang diapit sepasang makhluk kahyangan berbadan burung berkepala manusia, simbol harmoni pelestarian alam.'
        },
        {
          category: 'Kuliner Khas Sleman Timur',
          name: 'Ayam Goreng Kalasan Mbok Berek & Soto Bathok Mbah Katro',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Ayam kampung ungkep air kelapa dengan kremesan renyah gurih, serta soto sapi kuah bening dalam mangkuk tempurung kelapa di tepi sawah Candi Sambisari.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Kisah Bandung Bondowoso, Seribu Candi Satu Malam, & Arca Rara Jonggrang',
      storyTitle: 'Legenda Rara Jonggrang & Kutukan Candi Keseribu',
      storyExcerpt: 'Untuk menolak pinangan Bandung Bondowoso secara halus, Putri Rara Jonggrang mengajukan syarat mustahil...',
      fullStory: `Menurut legenda rakyat yang sangat populer, Pangeran Bandung Bondowoso jatuh hati pada kecantikan Putri Rara Jonggrang, putri Prabu Boko. Enggan menikah dengan pria yang telah mengalahkan ayahnya, sang putri meminta dibuatkan 1.000 candi dan dua sumur yang dalam hanya dalam waktu satu malam sebelum ayam berkokok.

Dengan kesaktian dan bantuan pasukan makhluk halus, Bandung Bondowoso hampir merampungkan 999 candi saat malam belum berakhir. Panik melihat hal itu, Rara Jonggrang memerintahkan gadis-gadis desa menumbuk lesung padi dan membakar jerami di timur sehingga ayam jantan berkokok mengira fajar telah tiba. Mengetahui tipu daya tersebut, Bandung Bondowoso murka dan mengutuk Rara Jonggrang menjadi arca batu ke-1.000 — yang kini dikenal sebagai Arca Durga Mahisasuramardini di bilik utara Candi Siwa.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Lingkar Candi Prambanan, Sewu, Plaosan, hingga Bukit Ratu Boko',
      spots: [
        {
          name: 'Pelataran Inti Candi Prambanan & Candi Sewu',
          type: 'Monumen Warisan Dunia',
          image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop',
          desc: 'Menjelajahi kemegahan candi Hindu Prambanan dan candi Buddha Sewu yang berdampingan dalam satu taman wisata sebagai bukti toleransi abad ke-9.'
        },
        {
          name: 'Alun-Alun & Gapura Utama Keraton Ratu Boko',
          type: 'Titik Pengamatan Senja',
          image: '/assets/images/jogja_parangtritis.jpg',
          desc: 'Menikmati semburat jingga matahari terbenam yang membingkai pintu gerbang batu kuno di atas bukit.'
        },
        {
          name: 'Candi Sambisari & Soto Bathok Mbah Katro',
          type: 'Candi Bawah Tanah & Sarapan Pagi',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          desc: 'Candi cantik yang terletak 6,5 meter di bawah permukaan tanah hamparan rumput hijau, hanya 50 meter dari warung Soto Bathok legendaris.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Etika Pelestarian Cagar Budaya & Tips Kunjungan Sore',
      etiquette: {
        dos: [
          'Gunakan alas kaki yang nyaman dan bawa topi/payung saat siang hari karena pelataran batu candi cukup luas dan terbuka.',
          'Ambil tiket terusan Prambanan + Ratu Boko sebelum pukul 15.00 WIB untuk menikmati fasilitas shuttle bus antar-jemput.',
          'Patuhi batas rantai pengaman pada batu candi yang sedang dalam tahap konservasi.'
        ],
        donts: [
          'Dilarang memanjat dinding batu candi di luar tangga resmi atau duduk di atas fragmen batu lepas.',
          'Mitos lokal bagi pasangan belum menikah: banyak yang memilih tidak masuk berdua ke bilik Arca Rara Jonggrang, namun tetap hormati kesakralan ruang candi.',
          'Dilarang menerbangkan drone tanpa izin resmi tertulis dari Balai Pelestarian Kebudayaan & TWC.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Mudah via KRL Jogja-Solo & Trans Jogja Koridor 1A',
      accessGuide: 'Terletak 17 km di timur pusat Kota Yogyakarta (Jl. Raya Solo). Sangat mudah diakses menggunakan Trans Jogja Koridor 1A langsung dari Malioboro (Rp 3.600) atau naik KRL Commuter Line dari Stasiun Tugu turun di Stasiun Brambanan.',
      bestTime: 'Pukul 14.30 – 17.30 WIB untuk menikmati Prambanan sore hari, lanjut sunset di Ratu Boko, dan pukul 19.30 WIB menonton Sendratari Ramayana.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Candi+Prambanan+Sleman+Yogyakarta&z=15&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Candi+Prambanan+Sleman+Yogyakarta'
    }
  },

  {
    id: 'merapi-kaliurang',
    name: 'Lereng Merapi, Kaliurang & Ullen Sentalu',
    subtitle: 'Kawasan Gunung Merapi, Museum Budaya Jawa, dan Jadah Tempe Kaliurang',
    province: 'Sleman Utara • D.I. Yogyakarta',
    region: 'sleman',
    regionLabel: 'Kabupaten Sleman',
    categoryTheme: ['nature', 'culture', 'soul', 'wisata-hiburan', 'budaya-sejarah'],
    coverImage: '/assets/images/jogja_merapi.jpg',
    thumbnail: '/assets/images/jogja_merapi.jpg',
    soundType: 'wind',
    coordinates: { lat: -7.5965, lng: 110.4242 },
    gpsZoneId: 'zona-sleman-kaliurang',
    ticketInfo: {
      domestik: 'Ullen Sentalu Rp 50.000 – Rp 100.000 • Kawasan Kaliurang Rp 10.000 • Jeep Lava Tour Rp 400.000 / 4 orang',
      mancanegara: 'Ullen Sentalu Rp 100.000 • Kawasan Kaliurang Rp 25.000',
      jamBuka: '08.00 – 16.00 WIB (Ullen Sentalu Tutup Hari Senin) • Jeep Sunrise mulai 04.30 WIB',
      parkir: 'Motor Rp 3.000 • Mobil Rp 10.000'
    },
    badges: ['Wisata Hiburan', 'Budaya & Sejarah', 'Poros Utara Sumbu Kosmologi'],
    passportStamp: {
      title: 'Penjaga Harmoni Merapi',
      symbol: '🌋',
      quote: 'Merapi tak pernah ingkar janji; abunya menyuburkan bumi Mataram sepanjang masa.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Puncak Kosmologi Utara Yogyakarta & Pesanggrahan Sejuk Kaliurang',
      overview: 'Gunung Merapi (2.930 mdpl) merupakan puncak titik utara dari garis imajiner Sumbu Kosmologi Yogyakarta. Di lereng selatannya pada ketinggian 900 mdpl terletak kawasan wisata sejarah Kaliurang yang sejak awal abad ke-20 menjadi tempat peristirahatan bangsawan Keraton dan keluarga Belanda.',
      history: 'Di tengah hutan pinus Kaliurang berdiri Museum Ullen Sentalu, museum seni dan budaya Jawa yang menyimpan surat-surat pribadi putri bangsawan Mataram, koleksi batik kuno Vorstenlanden (Yogyakarta dan Surakarta), serta kisah sejarah Dinasti Mataram.',
      landscapeHighlights: [
        { label: 'Bunker Kaliadem & Petilasan Mbah Maridjan', detail: 'Saksi bisu dahsyatnya erupsi Merapi 2010 di Desa Kinahrejo dengan latar puncak kawah Merapi yang gagah.' },
        { label: 'Museum Ullen Sentalu (Guwa Sela Giri & Kampung Kambang)', detail: 'Galeri bawah tanah dan bangunan batu gotik tropis di tengah rimbunnya pepohonan Kaliurang.' },
        { label: 'Taman Nasional Gunung Merapi & Bukit Turgo', detail: 'Hutan pegunungan sejuk tempat habitat elang Jawa, anggrek Vanda tricolor, dan jalur trekking Plawangan.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Ketangguhan Warga Lereng Merapi & Abdi Dalem Juru Kunci Kinahrejo',
      peopleName: 'Masyarakat Desa Kinahrejo, Petani Salak Pondoh, & Juru Kunci Merapi',
      description: 'Masyarakat lereng Merapi hidup dengan kesadaran ekologis dan spiritual yang mendalam. Mereka menganggap Merapi bukan sebagai ancaman, melainkan tetangga agung yang memberi berkah tanah vulkanik subur untuk perkebunan salak pondoh, sayuran organik, dan peternakan sapi perah.',
      socialStructure: [
        { role: 'Abdi Dalem Juru Kunci Gunung Merapi', desc: 'Utusan resmi Keraton Yogyakarta (diteruskan oleh Mas Asih pasca mendiang Mbah Maridjan) yang memimpin upacara Labuhan Merapi.' },
        { role: 'Komunitas Driver Jeep Wisata Lereng Merapi', desc: 'Warga lokal terdampak erupsi 2010 yang bangkit mengelola ratusan armada Jeep Willys klasik secara terorganisir.' },
        { role: 'Kurator & Edukator Museum Ullen Sentalu', desc: 'Pemandu profesional yang mengajak pengunjung menyusuri tiap ruang sejarah tanpa boleh terdistraksi kamera.' }
      ],
      philosophy: 'Nrimo Ing Pandum & Tangguh Bencana — menerima ketetapan alam dengan ikhlas seraya terus bangkit merawat kehidupan.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Upacara Labuhan Merapi, Batik Vorstenlanden, & Jadah Tempe Mbah Carik',
      cultureElements: [
        {
          category: 'Upacara Sakral Kasultanan',
          name: 'Hajad Dalem Labuhan Gunung Merapi',
          image: '/assets/images/jogja_merapi.jpg',
          detail: 'Prosesi tahunan setiap 30 Rajab mengarak ubarampe pusaka dari Keraton menuju Sri Manganti di lereng Merapi sebagai doa keselamatan alam dan rakyat.'
        },
        {
          category: 'Edukasi Sejarah Bangsawan',
          name: 'TurAdikarya Museum Ullen Sentalu & Jamu Ratu Mas',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          detail: 'Menjelajahi perbedaan halus motif batik Yogyakarta (latar putih tegas) dan Surakarta (latar sogan cokelat), ditutup suguhan hangat minuman rempah Ratu Mas.'
        },
        {
          category: 'Kuliner Khas Pegunungan',
          name: 'Jadah Tempe Mbah Carik, Sate Ratu, & Kopi Klotok Pakem',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Burger tradisional ketan kelapa dan tempe bacem manis di Kaliurang, sayur lodeh pisang goreng di Pakem, serta Sate Ayam Merah di Sleman.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Kisah Kesetiaan Mbah Maridjan & Keraton Alus Gunung Merapi',
      storyTitle: 'Amanah Sang Penjaga Gunung: Mbah Maridjan (Ki Surakso Hargo)',
      storyExcerpt: 'Pada tahun 2010, ketika awan panas wedhus gembel menerjang Dusun Kinahrejo...',
      fullStory: `Mbah Maridjan (Raden Ngabehi Surakso Hargo) diangkat oleh Sri Sultan Hamengkubuwono IX sebagai wakil Juru Kunci Gunung Merapi sejak 1970 dan menjadi Juru Kunci utama pada 1982. Bagi beliau, mandat raja dan tanggung jawab menjaga warga serta petilasan Merapi adalah amanah hidup dan mati.

Saat erupsi besar 26 Oktober 2010 terjadi setelah beliau memastikan keluarga dan warga turun mengungsi, Mbah Maridjan memilih tetap bertahan di rumahnya di Dusun Kinahrejo dan ditemukan wafat dalam posisi bersujud menghadap kiblat. Kini bekas rumah beliau diabadikan sebagai Museum Petilasan Mbah Maridjan, pengingat abadi akan kesetiaan seorang Abdi Dalem.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Destinasi di Sepanjang Jalur Kaliurang dan Cangkringan',
      spots: [
        {
          name: 'Museum Ullen Sentalu Kaliurang',
          type: 'Museum Budaya & Seni Jawa',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          desc: 'Tur terpandu 45 menit menyusuri lorong sejarah Mataram di tengah hutan sejuk Kaliurang.'
        },
        {
          name: 'Bunker Kaliadem & Museum Sisa Hartaku (Lava Tour)',
          type: 'Wisata Edukasi Vulkanologi & Jeep',
          image: '/assets/images/jogja_merapi.jpg',
          desc: 'Menyusuri jalur bekas aliran lahar dingin Sungai Gendol dan melihat jam dinding yang meleleh tepat saat erupsi 2010.'
        },
        {
          name: 'Warung Kopi Klotok & Jadah Tempe Mbah Carik',
          type: 'Wisata Kuliner Pegunungan',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          desc: 'Menikmati sarapan pagi berlatar puncak Merapi dan membawa pulang oleh-oleh Jadah Tempe asli Kaliurang.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'SOP Keselamatan Merapi & Aturan Khusus Museum Ullen Sentalu',
      etiquette: {
        dos: [
          'Patuhi aturan larangan memotret/merekam video di dalam ruang pamer Museum Ullen Sentalu (foto diperbolehkan di area taman luar & instalasi miring Beukenhof).',
          'Gunakan masker dan kacamata saat mengikuti Jeep Lava Tour Merapi di musim kemarau karena jalur berdebu.',
          'Selalu pantau status aktivitas vulkanik resmi dari BPPTKG Yogyakarta.'
        ],
        donts: [
          'Dilarang meminta pengemudi Jeep melakukan manuver berbahaya (standing/ngebut ekstrem) di jalur tebing Kaliadem.',
          'Jangan membeli makanan di warung parkir liar tanpa daftar harga; gunakan Radar GPS Kuliner kami untuk spot Kaliurang terverifikasi.',
          'Dilarang memetik flora endemik anggrek gunung di kawasan Taman Nasional Gunung Merapi.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Menuju Kaliurang (25 Km Utara Kota Yogyakarta)',
      accessGuide: 'Lurus ke utara menyusuri Jalan Kaliurang (Jakal) melewati kampus UGM sekitar 45–50 menit berkendara. Disarankan menggunakan kendaraan pribadi atau sewa motor/mobil karena angkutan umum jarang mencapai puncak Kaliurang.',
      bestTime: 'Pukul 05.00 – 08.00 pagi untuk pemandangan puncak Gunung Merapi yang bersih tanpa tertutup kabut awan.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Museum+Ullen+Sentalu+Kaliurang+Sleman&z=14&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Museum+Ullen+Sentalu+Kaliurang+Sleman'
    }
  },

  {
    id: 'wijilan-prawirotaman',
    name: 'Sentra Kuliner Wijilan, Jejeran & Prawirotaman',
    subtitle: 'Pusaka Gastronomi Gudeg Kayu Bakar, Sate Klathak Jeruji Besi, & Kampung Turis',
    province: 'Kota Yogyakarta & Bantul • D.I. Yogyakarta',
    region: 'kota-jogja',
    regionLabel: 'Kota Yogyakarta & Bantul',
    categoryTheme: ['culinary', 'culture', 'kuliner-wajib', 'kampung-wisata'],
    coverImage: '/assets/images/jogja_gudeg.jpg',
    thumbnail: '/assets/images/jogja_gudeg.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.8192, lng: 110.3712 },
    gpsZoneId: 'zona-bantul-jejeran',
    ticketInfo: {
      domestik: 'Gratis Masuk Kawasan • Harga Kuliner Rp 15.000 – Rp 65.000 / porsi',
      mancanegara: 'Rp 15.000 – Rp 65.000 / porsi',
      jamBuka: 'Wijilan 05.30–22.00 WIB • Sate Klathak Jejeran 09.00–23.30 WIB • Gudeg Pawon 21.30–Habis',
      parkir: 'Motor Rp 2.000–3.000 • Mobil Rp 5.000'
    },
    badges: ['Kuliner Pilihan', 'Gastronomi Pusaka', 'Terverifikasi GPS Lokal'],
    passportStamp: {
      title: 'Penikmat Rasa Mataram',
      symbol: '🍲',
      quote: 'Dari manis legit nangka muda hingga gurih asap jeruji besi, cita rasa Jogja lahir dari kesabaran.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Tiga Koridor Emas Gastronomi Yogyakarta: Wijilan, Prawirotaman, dan Jejeran',
      overview: 'Kebudayaan Yogyakarta tercermin dalam warisan arsitektur dan tradisi kulinernya. Kawasan Wijilan di timur Alun-Alun Utara dikenal sebagai sentra gudeg kering sejak dekade 1940-an. Prawirotaman memiliki tradisi batik dan menjadi kawasan pertemuan para wisatawan, sedangkan Jejeran di Pleret, Bantul, dikenal dengan sate klathak.',
      history: 'Gudeg sendiri lahir bersamaan dengan pembabatan Hutan Mentaok saat pembangunan Kota Yogyakarta abad ke-18. Melimpahnya pohon nangka dan pohon kelapa di hutan tersebut membuat para pekerja membuat olahan nangka muda yang dimasak berjam-jam dalam kuali besar dan diaduk ("hangudek" -> gudeg).',
      landscapeHighlights: [
        { label: 'Lorong Gudeg Wijilan & Plengkung Wijilan', detail: 'Deretan puluhan rumah makan gudeg legendaris tepat di selatan gerbang Plengkung Tarunasura.' },
        { label: 'Sentra Sate Klathak Jejeran (Jl.Imogiri Timur)', detail: 'Kawasan kuliner malam tempat kepulan asap sate kambing tusuk jeruji sepeda memenuhi jalanan.' },
        { label: 'Kampung Prawirotaman & Pasar Prawirotaman', detail: 'Kampung bekas prajurit Prawirotomo yang kini memadukan pasar tradisional modern, galeri seni, dan kedai kopi.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Para Ibu Penjaga Tungku Kayu & Jagal Kambing Muda Jejeran',
      peopleName: 'Keluarga Peracik Gudeg Wijilan, Penjual Sate Klathak Jejeran, & Warga Prawirotaman',
      description: 'Memasak kuliner tradisional Jogja adalah ritual kesabaran. Di dapur Yu Djum atau Gudeg Pawon, nangka muda dimasak menggunakan kayu bakar selama 8 hingga 12 jam tanpa henti bersama daun jati agar berwarna cokelat kemerahan alami dan tahan disimpan berhari-hari tanpa pengawet.',
      socialStructure: [
        { role: 'Maestro Dapur Gudeg (Pawon)', desc: 'Para ibu yang menjaga takaran gula aren, santan areh kental, dan sambal goreng krecek kulit sapi.' },
        { role: 'Peracik Sate Klathak & Kicik Jejeran', desc: 'Keluarga pedagang daging kambing muda di Wonokromo/Pleret yang hanya menggunakan bumbu garam dan merica.' },
        { role: 'Barista, Gelato Artisan & Seniman Prawirotaman', desc: 'Generasi muda kreatif yang mengolah rempah lokal seperti kemangi dan jahe menjadi hidangan kelas dunia.' }
      ],
      philosophy: 'Alon-Alon Waton Kelakon — memasak perlahan dengan penuh ketelatenan agar bumbu meresap sempurna hingga ke serat terdalam.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Filosofi Gudeg Basah vs Kering, Jeruji Besi Klathak, & Mangut Asap',
      cultureElements: [
        {
          category: 'Pusaka Kuliner Manis-Gurih',
          name: 'Gudeg Kering Wijilan vs Gudeg Basah Pawon / Mbah Lindu',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Gudeg kering memiliki areh kental yang dimasak lama (cocok untuk oleh-oleh kendil/besek), sedangkan gudeg basah berkuah santan gurih segar yang disantap pagi atau tengah malam.'
        },
        {
          category: 'Inovasi Tradisi Bantul',
          name: 'Sate Klathak Pak Pong & Pak Bari (Tusuk Jeruji Besi)',
          image: '/assets/images/jogja_tugu.jpg',
          detail: 'Jeruji besi sepeda yang digunakan sebagai tusuk sate membantu menghantarkan panas ke bagian tengah daging kambing sehingga matang merata dan bertekstur empuk.'
        },
        {
          category: 'Dapur Kayu Pedesaan',
          name: 'Mangut Lele Mbah Marto & Bakmi Lethek Mbah Mendes',
          image: '/assets/images/jogja_kotagede.jpg',
          detail: 'Pengalaman makan langsung di dalam dapur berasap milik Mbah Marto di Sewon, Bantul, menikmati lele asap berkuah santan cabai rawit.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Mengapa Disebut Sate "Klathak" & Kisah Gudeg sebagai Bekal Perjuangan',
      storyTitle: 'Suara "Klathak-Klathak" di Atas Bara Arang Pasar Jejeran',
      storyExcerpt: 'Banyak orang mengira nama Klathak berasal dari nama desa atau bumbu rahasia...',
      fullStory: `Tahukah Anda mengapa sate kambing khas Jejeran Bantul dinamakan "Sate Klathak"? Berbeda dengan sate kambing pada umumnya yang dilumuri kecap manis dan bumbu kacang sebelum dibakar, sate di Jejeran hanya dibumbui larutan bawang putih dan garam kasar.

Ketika potongan daging dan lemak kambing muda yang berbalut garam kasar tersebut dipanggang di atas bara arang kayu, kristal garam dan tetesan lemaknya meletup-letup mengeluarkan bunyi "klathak... klathak... klathak!". Dari bunyi letupan garam di atas bara arang itulah masyarakat Jejeran menamainya Sate Klathak.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Rute Wisata Kuliner 1 Hari Penuh di Yogyakarta',
      spots: [
        {
          name: 'Sentra Gudeg Wijilan (Yu Djum) & Brongkos Handayani',
          type: 'Kuliner Pagi & Siang Pusat Kota',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          desc: 'Sarapan Gudeg di Wijilan atau menikmati sepiring Brongkos koyor sapi hangat di Alun-Alun Selatan.'
        },
        {
          name: 'Kampung Prawirotaman & Tempo Gelato',
          type: 'Sore Santai & Kudapan Segar',
          image: '/assets/images/jogja_tugu.jpg',
          desc: 'Menyusuri jalanan estetik Prawirotaman sambil mencicipi gelato rasa rempah kemangi dan jahe.'
        },
        {
          name: 'Sate Klathak Pak Pong / Pak Bari (Jejeran, Bantul)',
          type: 'Pilihan Kuliner Malam Yogyakarta',
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Makan malam Sate Klathak, Tengkleng, dan Kicik kambing muda di Jalan Sultan Agung Jejeran.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Panduan Memilih Kuliner di Yogyakarta',
      etiquette: {
        dos: [
          'Jika membeli Gudeg untuk oleh-oleh perjalanan jauh (pesawat/kereta), mintalah kemasan "Gudeg Kering Kendil atau Besek" dengan bumbu dipisah agar tahan 24–36 jam.',
          'Saat berkunjung ke Mangut Lele Mbah Marto, masuklah dengan sopan ke area dapur kayu untuk mengambil makanan sendiri.',
          'Gunakan fitur Radar GPS Wilayah di aplikasi ini untuk mengecek rentang harga wajar sebelum memesan.'
        ],
        donts: [
          'Jangan membeli Gudeg Basah untuk dibawa perjalanan lebih dari 6 jam di suhu ruang karena kuah santannya cepat basi.',
          'Hindari makan di warung pinggir jalan yang tidak mencantumkan harga sama sekali pada menu.',
          'Jangan menyisakan makanan berlebihan; budaya Jawa sangat menghormati setiap butir nasi (Dewi Sri).'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Peta Koridor Kuliner dari Kota Jogja hingga Jejeran Bantul',
      accessGuide: 'Wijilan berjarak 5 menit dari Keraton. Prawirotaman berada 2 km di selatan Keraton. Sedangkan kawasan Sate Klathak Jejeran berada 7 km ke arah selatan menyusuri Jalan Imogiri Timur (15–20 menit dari pusat kota).',
      bestTime: 'Pagi hari (07.00–10.00) untuk Gudeg & Brongkos, siang hari (11.30–14.30) untuk Mangut Lele Mbah Marto, dan malam hari (18.30–22.30) untuk Sate Klathak & Bakmi Jawa.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Sentra+Gudeg+Wijilan+Yogyakarta&z=15&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Sentra+Gudeg+Wijilan+Yogyakarta'
    }
  },

  {
    id: 'kasongan-imogiri',
    name: 'Desa Wisata Kasongan, Manding & Imogiri',
    subtitle: 'Sentra Kriya Gerabah Tanah Liat, Batik Tulis Giriloyo, & Pasarean Raja-Raja Mataram',
    province: 'Bantul • D.I. Yogyakarta',
    region: 'bantul',
    regionLabel: 'Kabupaten Bantul',
    categoryTheme: ['culture', 'soul', 'kampung-wisata', 'budaya-sejarah'],
    coverImage: '/assets/images/jogja_batik.jpg',
    thumbnail: '/assets/images/jogja_kasongan.jpg',
    soundType: 'gamelan',
    coordinates: { lat: -7.8452, lng: 110.3385 },
    gpsZoneId: 'zona-bantul-jejeran',
    ticketInfo: {
      domestik: 'Masuk Desa Kasongan Gratis (Workshop Gerabah Rp 25.000) • Makam Imogiri Rp 10.000',
      mancanegara: 'Workshop Gerabah/Batik Rp 50.000',
      jamBuka: 'Kasongan 08.00–17.00 WIB • Makam Imogiri: Senin (10.00–13.00), Jumat (13.30–16.00), Minggu (10.00–13.00)',
      parkir: 'Motor Rp 3.000 • Mobil Rp 5.000'
    },
    badges: ['Kampung Wisata', 'Budaya & Sejarah', 'Kriya Gerabah & Batik'],
    passportStamp: {
      title: 'Perajin Tanah Bantul',
      symbol: '🏺',
      quote: 'Dari segenggam tanah liat dan tetesan malam panas, lahir karya seni yang mengharumkan bumi.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Kampung Kriya Tanah Liat Kasongan & Tangga 409 Anak Tangga Imogiri',
      overview: 'Kabupaten Bantul adalah jantung kriya rakyat Yogyakarta. Di Desa Kasongan (Bangunjiwo), sepanjang tepian sungai dipenuhi galeri keramik dan gerabah terakota yang diekspor ke Eropa dan Amerika. Sementara di tenggara Bantul berdiri Bukit Merak Imogiri — kompleks pemakaman raja-raja Mataram sejak masa Sultan Agung Hanyokrokusumo (1632).',
      history: 'Konon tradisi gerabah Kasongan bermula pada masa Perang Diponegoro (1825–1830), ketika seekor kuda milik pasukan Belanda mati di tanah warga desa. Karena takut dijatuhi hukuman kolonial, warga melepaskan hak kepemilikan sawah mereka dan beralih mengolah tanah liat menjadi perabot rumah tangga dan patung Loro Blonyo.',
      landscapeHighlights: [
        { label: 'Gapura Kembar & Jembatan Desa Wisata Kasongan', detail: 'Sentra ratusan perajin gerabah, guci terakota, dan patung pengantin Jawa Loro Blonyo.' },
        { label: '409 Anak Tangga Batu Makam Raja Imogiri', detail: 'Tangga batu purba menanjak menuju peristirahatan Sultan Agung serta raja-raja Yogyakarta dan Surakarta.' },
        { label: 'Kampung Batik Tulis Giriloyo & Kerajinan Kulit Manding', detail: 'Desa di kaki bukit Imogiri tempat 90% kaum ibu membatik tulis halus pemasok Keraton.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Ketekunan Pembatik Giriloyo & Seniman Tanah Liat Kasongan',
      peopleName: 'Perajin Gerabah Kasongan, Pembatik Tulis Giriloyo, & Abdi Dalem Imogiri',
      description: 'Di Kasongan dan Giriloyo, seni kriya adalah nafas keluarga. Anak-anak tumbuh melihat orang tua mereka memutar roda tanah liat (perbot) atau menorehkan canting tembaga di atas kain mori putih. Pada dekade 1970-an, seniman besar Sapto Hoedojo membimbing warga Kasongan mengembangkan gerabah dapur menjadi karya seni kontemporer.',
      socialStructure: [
        { role: 'Maestro Perbot & Pembakaran Gerabah', desc: 'Perajin yang membentuk tanah liat dengan tangan dan membakarnya menggunakan jerami serta kayu kering.' },
        { role: 'Kelompok Pembatik Tulis Srikandi Giriloyo', desc: 'Ratusan ibu pembatik yang membutuhkan waktu 1 hingga 3 bulan untuk menyelesaikan sehelai kain batik tulis halus.' },
        { role: 'Abdi Dalem Bupati Juru Kunci Imogiri', desc: 'Penjaga makam raja dari pihak Kasultanan Yogyakarta dan Kasunanan Surakarta.' }
      ],
      philosophy: 'Saben Lempung Dadi Adi — setiap tanah yang diolah dengan hati tulus akan menjadi karya bernilai tinggi.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Patung Loro Blonyo, Upacara Nguras Enceh, & Wedang Uwuh Imogiri',
      cultureElements: [
        {
          category: 'Simbolisme Kriya Jawa',
          name: 'Patung Sepasang Pengantin Loro Blonyo Kasongan',
          image: '/assets/images/jogja_kasongan.jpg',
          detail: 'Sepasang patung mempelai pria dan wanita dalam posisi duduk bersila yang melambangkan Dewi Sri dan Raden Sadono, simbol kesuburan dan keharmonisan rumah tangga.'
        },
        {
          category: 'Tradisi Sakral Suro',
          name: 'Upacara Adat Nguras Enceh (Gentong Pusaka) Imogiri',
          image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop',
          detail: 'Ritual tahunan setiap bulan Suro menguras empat tempayan air pusaka persembahan kerajaan sahabat (Aceh, Palembang, Turki/Rum, dan Siam).'
        },
        {
          category: 'Minuman & Kuliner Herbal',
          name: 'Wedang Uwuh Imogiri & Pecel Kembang Turi',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Minuman hangat berwarna merah menyala dari serutan kayu secang, jahe bakar, daun cengkeh, daun pala, dan gula batu ("uwuh" = dedaunan kering).'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Segenggam Tanah Harum dari Mekkah yang Menjadi Bukit Imogiri',
      storyTitle: 'Kisah Sultan Agung & Tanah Harum Bukit Merak Imogiri',
      storyExcerpt: 'Mengapa makam raja-raja Mataram dibangun di puncak Bukit Merak Imogiri?',
      fullStory: `Dikisahkan bahwa ketika Sultan Agung Hanyokrokusumo memerintah Mataram pada abad ke-17, beliau berkeinginan membangun tempat peristirahatan terakhir yang suci. Menurut babad tutur, segenggam tanah dari tanah suci dilemparkan dan jatuh di perbukitan kapur selatan Mataram sehingga tanah bukit tersebut berbau harum semerbak.

Di tangga ke-409 menuju makam Sultan Agung, terdapat sebuah batu pipih di tengah anak tangga yang konon merupakan kuburan bagian tubuh pengkhianat Tumenggung Endranata agar setiap peziarah yang naik selalu menginjak batu tersebut sebagai peringatan agar manusia tidak pernah berkhianat pada bangsanya.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Desa Wisata Kasongan, Kabupaten Bantul',
      spots: [
        {
          name: 'Sentra Gerabah Kasongan & Timboel Ceramic',
          type: 'Kampung Wisata Kriya',
          image: '/assets/images/jogja_kasongan.jpg',
          desc: 'Belajar langsung membuat keramik tanah liat (pottery class) dan berburu dekorasi rumah estetik.'
        },
        {
          name: 'Kampung Batik Tulis Giriloyo & Makam Raja Imogiri',
          type: 'Wisata Budaya & Ziarah Sejarah',
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Mencoba mencanting batik tulis didampingi ibu-ibu perajin lalu mendaki 409 anak tangga Imogiri.'
        },
        {
          name: 'Hutan Pinus Mangunan & Puncak Becici Dlingo',
          type: 'Lanskap Alam Bantul Timur',
          image: '/assets/images/jogja_parangtritis.jpg',
          desc: 'Hutan pinus asri dengan panggung teater alam kayu di perbukitan atas Imogiri.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Etika Berkunjung ke Desa Kriya & Pasarean Imogiri',
      etiquette: {
        dos: [
          'Hargai karya tangan perajin lokal di Kasongan dan Giriloyo; tawarlah dengan wajar dan santun.',
          'Perhatikan jadwal buka ruang dalam Makam Imogiri (hanya buka pada hari dan jam tertentu serta wajib menyewa pakaian adat Pranakan/Kemben).',
          'Berhati-hatilah saat melangkah di antara deretan gerabah tanah liat yang sedang dijemur di pinggir jalan Kasongan.'
        ],
        donts: [
          'Dilarang mengangkat atau mengetuk keramik tipis di galeri tanpa pendampingan penjaga toko.',
          'Dilarang memakai alas kaki saat memasuki pelataran suci Pasarean Imogiri.',
          'Jangan membeli batik printing mesin jika Anda mencari batik tulis asli; tanyakan sertifikasi Batik Tulis Giriloyo.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Menuju Kasongan (7 Km) & Imogiri (17 Km Selatan Jogja)',
      accessGuide: 'Kasongan berada di Jl. Bantul KM 6,5 (15 menit dari Keraton). Sedangkan Imogiri berada 17 km di selatan via Jl. Imogiri Timur (searah dengan Sate Klathak Jejeran).',
      bestTime: 'Pukul 08.30 – 15.00 WIB untuk melihat proses penjemuran gerabah dan pembatikan tulis.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Desa+Wisata+Kasongan+Bantul+Yogyakarta&z=15&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Desa+Wisata+Kasongan+Bantul+Yogyakarta'
    }
  },

  {
    id: 'parangtritis-gunungkidul',
    name: 'Pantai Parangtritis, Gumuk Pasir & Geopark Gunungkidul',
    subtitle: 'Gerbang Samudra Hindia Sumbu Filosofis Selatan, Gumuk Pasir Barchan, & Tebing Karst',
    province: 'Bantul & Gunungkidul • D.I. Yogyakarta',
    region: 'gunungkidul',
    regionLabel: 'Bantul & Gunungkidul',
    categoryTheme: ['nature', 'soul', 'wisata-hiburan', 'budaya-sejarah'],
    coverImage: '/assets/images/jogja_parangtritis.jpg',
    thumbnail: '/assets/images/jogja_parangtritis.jpg',
    soundType: 'ocean',
    coordinates: { lat: -8.0247, lng: 110.3323 },
    gpsZoneId: 'zona-gunungkidul-geopark',
    ticketInfo: {
      domestik: 'Retribusi Kawasan Parangtritis Rp 15.000 • Kawasan Pantai Gunungkidul Rp 15.000',
      mancanegara: 'Rp 25.000 – Rp 50.000',
      jamBuka: '24 Jam (Disarankan 06.00 – 18.30 WIB)',
      parkir: 'Motor Rp 5.000 • Mobil Rp 10.000 • Bus Rp 25.000'
    },
    badges: ['Wisata Hiburan', 'UNESCO Global Geopark Gunung Sewu', 'Poros Laut Selatan'],
    passportStamp: {
      title: 'Penjelajah Pesisir Selatan',
      symbol: '🌊',
      quote: 'Di hadapan debur ombak Laut Selatan, manusia belajar merendahkan hati di hadapan semesta.'
    },
    chapter01: {
      title: 'Kenali Tempat',
      tagline: 'Ujung Selatan Poros Kosmologi Yogyakarta & Bentang Alam Karst Purba',
      overview: 'Pantai Parangtritis dan Cepuri Parangkusumo merupakan titik ujung paling selatan dari garis imajiner Merapi–Tugu–Keraton–Krapyak–Laut Selatan. Kawasan ini memiliki fenomena geologi langka berupa Gumuk Pasir Barchan (bukit pasir berbentuk bulan sabit satu-satunya di Asia Tenggara yang terbentuk dari abu vulkanik Merapi yang terbawa Sungai Opak dan dihempas angin laut).',
      history: 'Ke arah timur membentang kawasan UNESCO Global Geopark Gunung Sewu di Kabupaten Gunungkidul — deretan ribuan bukit kapur (karst) yang terangkat dari dasar laut jutaan tahun silam, membentuk deretan pantai pasir putih tersembunyi (Indrayanti, Pok Tunggal, Drini), tebing karang Pantai Timang, serta sungai bawah tanah Gua Pindul dan Jomblang.',
      landscapeHighlights: [
        { label: 'Cepuri Parangkusumo & Gumuk Pasir Parangtritis', detail: 'Situs batu petilasan sakral pertemuan Panembahan Senopati dan bukit pasir vulkanik tempat sandboarding.' },
        { label: 'Tebing Bukit Paralayang Watugupit & Obelix Sea View', detail: 'Tebing tinggi di timur Parangtritis untuk menikmati garis pantai selatan dan matahari terbenam.' },
        { label: 'Gugusan Pantai Pasir Putih & Gua Jomblang Gunungkidul', detail: 'Cahaya surga (ray of light) di hutan purba vertikal Gua Jomblang dan jembatan gondola Pantai Timang.' }
      ]
    },
    chapter02: {
      title: 'Kenali Masyarakat',
      tagline: 'Kearifan Nelayan Pesisir Selatan & Petani Lahan Karst Gunungkidul',
      peopleName: 'Masyarakat Nelayan Pantai Depok, Tim SAR Parangtritis, & Warga Gunungkidul',
      description: 'Masyarakat pesisir selatan Yogyakarta dan perbukitan Gunungkidul dikenal sangat ulet, ramah, dan menjunjung tinggi semangat gotong royong (Sambatan). Di Pantai Depok, para nelayan berani menembus ombak besar Samudra Hindia demi membawa hasil tangkapan laut segar ke Tempat Pelelangan Ikan (TPI).',
      socialStructure: [
        { role: 'Juru Kunci Cepuri Parangkusumo', desc: 'Abdi Dalem yang merawat situs batu gilang petilasan dan memimpin prosesi Labuhan Hondodento.' },
        { role: 'Koperasi Nelayan TPI Pantai Depok & Timang', desc: 'Nelayan penangkap ikan cakalang, kakap, dan pencari lobster karang di tebing Pulau Panjang.' },
        { role: 'Pemandu Ekowisata Geopark Gunungkidul', desc: 'Masyarakat desa wisata Bejiharjo dan Pacarejo yang mengelola cave tubing serta konservasi karst.' }
      ],
      philosophy: 'Segoro Kidul Pangiloning Ati — luasnya Samudra Selatan adalah cermin bagi kelapangan hati dan kerendahan diri manusia.'
    },
    chapter03: {
      title: 'Kenali Budaya',
      tagline: 'Labuhan Parangkusumo, Larangan Baju Hijau Pupus, & Kuliner Tiwul',
      cultureElements: [
        {
          category: 'Upacara Adat Sakral',
          name: 'Hajad Dalem Labuhan Parangkusumo',
          image: '/assets/images/jogja_parangtritis.jpg',
          detail: 'Upacara melarung ubarampe pakaian dan potongan kuku/rambut Sultan ke Samudra Hindia sebagai simbol harmoni spiritual antara Kasultanan dan alam Laut Selatan.'
        },
        {
          category: 'Kearifan Lokal Keselamatan',
          name: 'Pantangan Pakaian Hijau Pupus (Gadung Mlathi)',
          image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop',
          detail: 'Selain dipercaya sebagai warna kesukaan Kanjeng Ratu Kidul, secara ilmiah warna hijau pupus menyaru dengan warna air laut berarus rip current sehingga menyulitkan Tim SAR jika terjadi keadaan darurat.'
        },
        {
          category: 'Kuliner Pesisir & Geopark',
          name: 'Thiwul Yu Tum, Sego Abang Lombok Ijo, & Seafood TPI Depok',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
          detail: 'Nasi tiwul singkong kukus gula jawa, nasi merah sayur cabai hijau empal sapi, dan ikan bakar segar hasil tangkapan nelayan Depok.'
        }
      ]
    },
    chapter04: {
      title: 'Cerita & Legenda',
      tagline: 'Pertapaan Panembahan Senopati di Batu Gilang Parangkusumo',
      storyTitle: 'Babad Tanah Jawi: Pertemuan Panembahan Senopati di Parangkusumo',
      storyExcerpt: 'Di atas dua bongkahan batu karang hitam Cepuri Parangkusumo, pendiri Mataram bertapa...',
      fullStory: `Dalam naskah Babad Tanah Jawi dikisahkan bahwa sebelum mendirikan Kerajaan Mataram Islam di Kotagede pada abad ke-16, Danang Sutawijaya (Panembahan Senopati) melakukan tapa brata dengan menghanyutkan diri mengikuti arus Sungai Opak hingga bermuara di Pantai Parangkusumo.

Di atas batu karang hitam yang kini dikelilingi pagar Cepuri Parangkusumo, beliau memanjatkan doa khusyuk hingga samudra bergolak. Mitos tutur Jawa mengisahkan pertemuan spiritual beliau dengan penguasa Laut Selatan, Kanjeng Ratu Kidul, yang berjanji akan turut menjaga ketenteraman wilayah Mataram selama para raja dan rakyatnya menjaga kelestarian alam dan keadilan.`
    },
    chapter05: {
      title: 'Jelajahi Lokasi',
      tagline: 'Rute Pesisir Selatan Bantul hingga Gunungkidul',
      spots: [
        {
          name: 'Gumuk Pasir Parangkusumo & Bukit Paralayang Watugupit',
          type: 'Lanskap Geologi & Spot Sunset',
          image: '/assets/images/jogja_parangtritis.jpg',
          desc: 'Bermain sandboarding di bukit pasir vulkanik lalu naik ke tebing Watugupit untuk menyaksikan sunset di atas Samudra Hindia.'
        },
        {
          name: 'Gua Jomblang & Pantai Timang Gunungkidul',
          type: 'Petualangan Geopark Karst',
          image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop',
          desc: 'Menyaksikan berkas cahaya surga di dasar gua vertikal Jomblang dan menyeberangi jembatan gantung/gondola di atas debur ombak Pantai Timang.'
        },
        {
          name: 'Bukit Bintang Pathuk & HeHa Sky View / Ocean View',
          type: 'Wisata Hiburan Malam & Panorama',
          image: '/assets/images/jogja_tugu.jpg',
          desc: 'Memandang gemerlap lampu seluruh Kota Yogyakarta dari ketinggian bukit Pathuk saat perjalanan pulang malam hari.'
        }
      ]
    },
    chapter06: {
      title: 'Pengalaman & Etika',
      tagline: 'Keselamatan Arus Palung (Rip Current) & Etika Pesisir Selatan',
      etiquette: {
        dos: [
          'Kenakan pakaian berwarna cerah (merah, kuning, oranye, putih) dan hindari pakaian hijau pupus saat berkunjung ke Pantai Parangtritis.',
          'Jika ingin membeli ikan bakar di Pantai Depok, belilah ikan mentah langsung di TPI (Tempat Pelelangan Ikan) lalu gunakan jasa masak per kilogram agar harga transparan.',
          'Buka alas kaki dan jaga ketenangan jika memasuki area pagar dalam Cepuri Parangkusumo.'
        ],
        donts: [
          'Dilarang keras berenang terlalu ke tengah di Pantai Parangtritis karena terdapat arus balik bawah laut (rip current) yang sangat kuat.',
          'Jangan makan di warung seafood non-koperasi tanpa menanyakan harga per kilogram terlebih dahulu.',
          'Dilarang meninggalkan sampah plastik di sepanjang pasir pantai dan kawasan karst Gunungkidul.'
        ]
      }
    },
    chapter07: {
      title: 'Panduan Berkunjung',
      tagline: 'Akses Jalur Jalan Parangtritis & Jalur Lintas Selatan (JJLS)',
      accessGuide: 'Pantai Parangtritis berjarak 27 km lurus ke selatan dari pusat Kota Yogyakarta via Jl. Parangtritis (45 menit). Dari Parangtritis, Anda kini dapat menyusuri Jalur Jalan Lintas Selatan (JJLS) yang mulus dan indah langsung menuju deretan pantai Gunungkidul.',
      bestTime: 'Pukul 15.00 – 18.00 WIB untuk menikmati Gumuk Pasir dan sunset di Paralayang Watugupit, atau pukul 08.00 – 10.00 pagi untuk Gua Jomblang Gunungkidul.',
      mapEmbedUrl: 'https://www.google.com/maps?q=Pantai+Parangtritis+Bantul+Yogyakarta&z=14&output=embed',
      mapsDirectLink: 'https://maps.google.com/?q=Pantai+Parangtritis+Bantul+Yogyakarta'
    }
  }
];

// Preset Lokasi Simulasi GPS Jogja Khusus Pengujian Developer / Pengguna dari Luar Kota
export const JOGJA_SIMULATION_PRESETS = [
  {
    id: 'prambanan',
    name: 'Candi Prambanan',
    shortName: 'Prambanan',
    zoneId: 'zona-prambanan-sleman',
    coordinates: { lat: -7.7520, lng: 110.4914 },
    address: 'Kawasan Candi Prambanan, Bokoharjo, Sleman, D.I. Yogyakarta',
    placeId: 'prambanan-ratuboko'
  },
  {
    id: 'malioboro',
    name: 'Kawasan Malioboro & Titik Nol',
    shortName: 'Malioboro',
    zoneId: 'zona-malioboro-tugu',
    coordinates: { lat: -7.7926, lng: 110.3658 },
    address: 'Jl. Malioboro, Sosromenduran, Gedongtengen, Kota Yogyakarta',
    placeId: 'malioboro-tugu'
  },
  {
    id: 'keraton',
    name: 'Keraton Ngayogyakarta',
    shortName: 'Keraton',
    zoneId: 'zona-keraton-wijilan',
    coordinates: { lat: -7.8053, lng: 110.3642 },
    address: 'Pelataran Kedhaton Keraton Jogja, Panembahan, Kraton, Kota Yogyakarta',
    placeId: 'keraton-yogyakarta'
  },
  {
    id: 'kotagede',
    name: 'Kotagede (Pusaka Mataram)',
    shortName: 'Kotagede',
    zoneId: 'zona-kotagede-heritage',
    coordinates: { lat: -7.8286, lng: 110.3998 },
    address: 'Kawasan Cagar Budaya Kotagede, Purbayan, Kota Yogyakarta',
    placeId: 'kotagede'
  },
  {
    id: 'merapi',
    name: 'Lereng Merapi (Kaliurang)',
    shortName: 'Merapi',
    zoneId: 'zona-merapi-kaliurang',
    coordinates: { lat: -7.5950, lng: 110.4260 },
    address: 'Kawasan Wisata Kaliurang, Hargobinangun, Pakem, Sleman',
    placeId: 'merapi-kaliurang'
  },
  {
    id: 'wijilan',
    name: 'Sentra Gudeg Wijilan',
    shortName: 'Wijilan',
    zoneId: 'zona-keraton-wijilan',
    coordinates: { lat: -7.8062, lng: 110.3685 },
    address: 'Jl. Wijilan, Panembahan, Kraton, Kota Yogyakarta',
    placeId: 'wijilan-prawirotaman'
  },
  {
    id: 'kasongan',
    name: 'Desa Wisata Kasongan',
    shortName: 'Kasongan',
    zoneId: 'zona-kasongan-bantul',
    coordinates: { lat: -7.8465, lng: 110.3421 },
    address: 'Jl. Kasongan, Bangunjiwo, Kasihan, Bantul',
    placeId: 'kasongan-imogiri'
  },
  {
    id: 'parangtritis',
    name: 'Pantai Parangtritis',
    shortName: 'Parangtritis',
    zoneId: 'zona-parangtritis-selatan',
    coordinates: { lat: -7.9818, lng: 110.3150 },
    address: 'Kawasan Pesisir Parangtritis, Kretek, Bantul',
    placeId: 'parangtritis-gunungkidul'
  }
];
