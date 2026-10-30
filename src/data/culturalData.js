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
    vibe: 'Pusat denyut budaya malam, trotoar pedestrian Malioboro, dan aroma kopi arang joss legendaris.',
    gpsAlert: 'GPS Terkunci di Kawasan Malioboro (D.I. Yogyakarta): Menampilkan koordinat asli Google Maps dan kuliner legendaris terdekat.',
    kulinerList: [
      {
        id: 'kopi-joss-lik-man',
        trackPointCode: 'TP-01',
        name: 'Angkringan Lik Man (Kopi Joss Pelopor 1968)',
        spotName: 'Jl. Pasar Kembang, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
        coordinates: { lat: -7.789312, lng: 110.363945 },
        distanceFromWisata: '350 m dari Malioboro',
        image: '/assets/images/kuliner/kopi_joss.jpg',
        category: 'Kopi Joss & Sego Kucing',
        operatingHours: '17:00 - 02:00 WIB',
        priceRange: 'Rp 5.000 - Rp 25.000',
        status: 'enak',
        verdictLabel: 'Pelopor Kopi Joss Asli 1968',
        tasteProfile: 'Kopi tubruk robusta diseduh arang kayu asem panas membara beraroma karamel, dinikmati bersama nasi kucing sambal teri dan sate puyuh bacem.',
        honestReview: 'Pelopor tradisi kopi joss pertama di Yogyakarta sejak 1968 di sebelah utara Stasiun Tugu. Efek arang panas menetralkan asam kopi dan memberi aroma sangrai yang khas.'
      },
      {
        id: 'lumpia-samijaya',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/lumpia-samijaya-malioboro-pringgokusuman-e891ec0d-854e-42a3-adb0-490f8f9f6890',
        gofoodMerchant: 'Lumpia Samijaya Malioboro',
        gofoodRating: 4.8,
        gofoodReviews: '3.2k+',
        gofoodTier: 'GoFood Partner',
        trackPointCode: 'TP-02',
        name: 'Lumpia Samijaya Malioboro (Sejak 1976)',
        spotName: 'Jl. Malioboro No.18, Suryatmajan, Kec. Danurejan, Kota Yogyakarta, DIY 55213',
        coordinates: { lat: -7.794625, lng: 110.365731 },
        distanceFromWisata: '120 m dari Malioboro',
        image: '/assets/images/kuliner/lumpia_samijaya.jpg',
        category: 'Kudapan Legendaris Malioboro',
        operatingHours: '09:30 - 21:00 WIB',
        priceRange: 'Rp 6.000 - Rp 7.000 / pcs',
        status: 'enak',
        verdictLabel: 'Kudapan Ikonik Malioboro 1976',
        tasteProfile: 'Kulit lumpia garing renyah berisi bengkuang manis gurih, cincangan ayam kampung, dan telur puyuh utuh berlumur saus kental bawang putih tumbuk segar.',
        honestReview: 'Gerobak legendaris di depan eks Hotel Mutiara Malioboro. Digoreng panas mendidih dadakan di tempat dengan cita rasa saus bawang putih yang segar dan gurih.'
      },
      {
        id: 'gudeg-mbok-lindu',
        trackPointCode: 'TP-03',
        name: 'Gudeg Mbok Lindu Sosrowijayan (Pusaka 1940)',
        spotName: 'Jl. Sosrowijayan No.30, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
        coordinates: { lat: -7.791580, lng: 110.363185 },
        distanceFromWisata: '280 m dari Malioboro',
        image: '/assets/images/kuliner/gudeg_wijilan.jpg',
        category: 'Gudeg Basah Tradisional',
        operatingHours: '06:00 - 11:00 WIB (Pagi)',
        priceRange: 'Rp 15.000 - Rp 40.000',
        status: 'enak',
        verdictLabel: 'Penjual Gudeg Tertua Nusantara',
        tasteProfile: 'Gudeg basah khas tempo doeloe dengan nangka muda gurih lembut, krecek pedas santan areh kental, ayam kampung, dan bubur lemu hangat.',
        honestReview: 'Salah satu penjual gudeg tertua di Indonesia yang mulai berdagang sebelum era kemerdekaan 1945. Resep tungku kayu bakar dilestarikan turun-temurun oleh sang putri.'
      },
      {
        id: 'oseng-mercon-bu-narti',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/oseng-oseng-mercon-bu-narti-condongcatur-1cfdd6d2-95de-47bf-ad17-f0e5d8899ec9',
        gofoodMerchant: 'Oseng-Oseng Mercon Bu Narti',
        gofoodRating: 4.7,
        gofoodReviews: '4.8k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-04',
        name: 'Oseng-Oseng Mercon Bu Narti (Pusat 1998)',
        spotName: 'Jl. KH. Ahmad Dahlan No.107, Notoprajan, Kec. Ngampilan, Kota Yogyakarta, DIY 55262',
        coordinates: { lat: -7.801642, lng: 110.354673 },
        distanceFromWisata: '900 m dari Titik Nol KM',
        image: '/assets/images/kuliner/oseng_mercon.jpg',
        category: 'Masakan Pedas Legendaris',
        operatingHours: '17:00 - 23:00 WIB',
        priceRange: 'Rp 25.000 - Rp 45.000',
        status: 'enak',
        verdictLabel: 'Pelopor Oseng Mercon Sejak 1998',
        tasteProfile: 'Koyor kenyal dan tetelan sapi empuk berbalut puluhan cabai rawit merah ulek super pedas yang meledak di lidah dengan aroma minyak bawang gurih.',
        honestReview: 'Warung tenda pertama yang mempopulerkan istilah oseng mercon di Yogyakarta pada tahun 1998. Sangat nikmat disantap dengan sepiring nasi putih hangat mengepul.'
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
    vibe: 'Jantung peradaban kasultanan, sentra gudeg kering Wijilan, dan hidangan para sultan Mataram.',
    gpsAlert: 'GPS Terkunci di Kawasan Keraton & Wijilan (D.I. Yogyakarta): Menampilkan koordinat Google Maps dan rekomendasi kuliner keraton otentik.',
    kulinerList: [
      {
        id: 'gudeg-yu-djum-wijilan',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/gudeg-yu-djum-167-wijilan-ddb027ec-59e1-42c2-bfe8-c8f29b6ca3d5',
        gofoodMerchant: 'Gudeg Yu Djum Pusat Wijilan 167',
        gofoodRating: 4.8,
        gofoodReviews: '7.5k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-01',
        name: 'Gudeg Yu Djum Wijilan 167 (Pusat Asli 1951)',
        spotName: 'Jl. Wijilan No.167, Panembahan, Kec. Kraton, Kota Yogyakarta, DIY 55131',
        coordinates: { lat: -7.804612, lng: 110.366914 },
        distanceFromWisata: '240 m dari Keraton',
        image: '/assets/images/kuliner/gudeg_wijilan.jpg',
        category: 'Sentra Gudeg Kering Wijilan',
        operatingHours: '06:00 - 22:00 WIB',
        priceRange: 'Rp 20.000 - Rp 65.000 (Paket Kendil Rp 120.000 - Rp 250.000)',
        status: 'enak',
        verdictLabel: 'Standar Emas Gudeg Kering Sejak 1951',
        tasteProfile: 'Gudeg nangka cokelat kemerahan daun jati, ayam kampung empuk legit gurih, telur bebek pindang cokelat, dan sambal krecek kering pedas.',
        honestReview: 'Ikon sentra gudeg Jl. Wijilan di sebelah timur Alun-Alun Utara sejak 1951. Masih mempertahankan teknik memasak tungku kayu bakar semalaman sehingga tahan berhari-hari tanpa pengawet.'
      },
      {
        id: 'bale-raos-keraton',
        trackPointCode: 'TP-02',
        name: 'Bale Raos Keraton (The Sultan’s Dishes)',
        spotName: 'Jl. Magangan Kulon No.1, Panembahan, Kec. Kraton, Kota Yogyakarta, DIY 55131',
        coordinates: { lat: -7.808241, lng: 110.363829 },
        distanceFromWisata: '180 m dari Keraton',
        image: '/assets/images/jogja_keraton.jpg',
        category: 'Gastronomi Kasultanan Mataram',
        operatingHours: '10:00 - 22:00 WIB',
        priceRange: 'Rp 35.000 - Rp 95.000',
        status: 'enak',
        verdictLabel: 'Resep Resmi Para Sultan Yogyakarta',
        tasteProfile: 'Bebek Suwar-Suwir saus kedondong segar asam gurih, Semur Piyik burung dara muda, Urip-Urip Gulung lele, dan Bir Jawa rempah secang.',
        honestReview: 'Restoran budaya resmi di kompleks Magangan Keraton Yogyakarta yang menyajikan hidangan autentik kegemaran Sri Sultan HB VII hingga HB X berdasarkan manuskrip resep istana.'
      },
      {
        id: 'brongkos-handayani',
        trackPointCode: 'TP-03',
        name: 'Warung Brongkos Handayani (Plengkung Gading 1975)',
        spotName: 'Jl. Gading No.2, Patehan, Kec. Kraton, Kota Yogyakarta, DIY 55133',
        coordinates: { lat: -7.813941, lng: 110.363124 },
        distanceFromWisata: '420 m dari Alun-Alun Kidul',
        image: '/assets/images/kuliner/brongkos_handayani.jpg',
        category: 'Kuah Hitam Kluwek Rempah',
        operatingHours: '07:00 - 16:00 WIB',
        priceRange: 'Rp 20.000 - Rp 45.000',
        status: 'enak',
        verdictLabel: 'Kuliner Legenda Plengkung Gading 1975',
        tasteProfile: 'Kuah hitam pekat kluwek santan gurih kental berpadu potongan koyor daging sapi empuk, telur bacem utuh, tahu cokelat, dan kacang tolo lembut.',
        honestReview: 'Terletak persis di bawah gerbang benteng Plengkung Gading Alun-Alun Kidul sejak 1975. Kuah brongkosnya kaya rempah serai dan cabai rawit utuh yang menghangatkan badan.'
      },
      {
        id: 'bakmi-jawa-pak-pele',
        trackPointCode: 'TP-04',
        name: 'Bakmi Jawa Pak Pele Pojok Pagelaran (1983)',
        spotName: 'Pojok Tenggara Alun-Alun Utara, Panembahan, Kec. Kraton, Kota Yogyakarta, DIY 55131',
        coordinates: { lat: -7.803810, lng: 110.365420 },
        distanceFromWisata: '150 m dari Keraton',
        image: '/assets/images/kuliner/bakmi_jawa.jpg',
        category: 'Bakmi Jawa Anglo Arang',
        operatingHours: '17:30 - 23:00 WIB',
        priceRange: 'Rp 22.000 - Rp 35.000',
        status: 'enak',
        verdictLabel: 'Legenda Bakmi Alun-Alun Sejak 1983',
        tasteProfile: 'Bakmi kuning dan bihun kenyal dimasak per porsi di wajan anglo arang batok, kaldu ayam kampung kental gurih, suwiran ayam melimpah, dan telur bebek legit.',
        honestReview: 'Berdiri di pelataran Pagelaran Keraton Alun-Alun Utara sejak 1983. Menghadirkan aroma sangit arang kayu alami dan tekstur bakmi nyemek gurih tanpa MSG berlebih.'
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
    vibe: 'Lorong bersejarah bekas ibu kota Mataram Islam, kriya perak, bakmi Jawa arang, dan artisan gelato lokal.',
    gpsAlert: 'GPS Terkunci di Kawasan Kotagede & Prawirotaman (D.I. Yogyakarta): Menampilkan koordinat Google Maps dan kuliner pusaka terdekat.',
    kulinerList: [
      {
        id: 'bakmi-jawa-mbah-gito',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/bakmi-mbah-gito-jl-gito-gati-4099e0b9-c7c4-4498-b18b-be4aea10a77e',
        gofoodMerchant: 'Bakmi Jawa Mbah Gito',
        gofoodRating: 4.9,
        gofoodReviews: '12k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-01',
        name: 'Bakmi Jawa Mbah Gito (Pusat Otentik)',
        spotName: 'Jl. Nyi Ageng Nis No.9, Rejowinangun, Kec. Kotagede, Kota Yogyakarta, DIY 55171',
        coordinates: { lat: -7.815243, lng: 110.402435 },
        distanceFromWisata: '450 m dari Kotagede',
        image: '/assets/images/kuliner/bakmi_jawa.jpg',
        category: 'Bakmi & Masakan Tradisional Jawa',
        operatingHours: '11:00 - 22:00 WIB',
        priceRange: 'Rp 25.000 - Rp 45.000',
        status: 'enak',
        verdictLabel: 'Dapur Tungku Anglo Kayu Otentik',
        tasteProfile: 'Bakmi godhog kuah kaldu ayam kampung kental telur bebek, nasi magelangan gurih aroma arang, dan wedang jahe rempah secang blirik.',
        honestReview: 'Nuansa pendopo kayu jati Jawa unik bertingkat dari bekas kandang sapi tua yang disulap menjadi restoran etnik legendaris bernilai seni tinggi.'
      },
      {
        id: 'kipo-bu-djito',
        trackPointCode: 'TP-02',
        name: 'Kipo Bu Djito Kotagede Asli 1946',
        spotName: 'Jl. Mondorakan No.27, Prenggan, Kec. Kotagede, Kota Yogyakarta, DIY 55172',
        coordinates: { lat: -7.827218, lng: 110.399512 },
        distanceFromWisata: '190 m dari Pasar Kotagede',
        image: '/assets/images/kuliner/kue_kipo.jpg',
        category: 'Kudapan Pusaka Mataram Kuno',
        operatingHours: '07:00 - 15:00 WIB',
        priceRange: 'Rp 5.000 - Rp 15.000 / bungkus daun pisang',
        status: 'enak',
        verdictLabel: 'Pusaka Kuliner Manis Abad 16',
        tasteProfile: 'Kue kenyal mungil tepung ketan berbalut sari daun pandan suji, berpadu manis legit unti kelapa gula kelapa aren panggang beraroma asap.',
        honestReview: 'Kudapan pusaka khas Kotagede sejak abad ke-16 masa Panembahan Senopati. Diproduksi fresh setiap pagi secara manual tanpa bahan kimia pengawet.'
      },
      {
        id: 'tempo-gelato-prawirotaman',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/the-original-gelato-kaliurang-2ddb1901-90bf-432b-b387-88c83a356801',
        gofoodMerchant: 'Tempo Gelato Prawirotaman',
        gofoodRating: 4.9,
        gofoodReviews: '15k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-03',
        name: 'Tempo Gelato Prawirotaman (Ikonik Asli)',
        spotName: 'Jl. Prawirotaman No.38B, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, DIY 55153',
        coordinates: { lat: -7.819032, lng: 110.371214 },
        distanceFromWisata: '110 m dari Kampung Turis Prawirotaman',
        image: '/assets/images/kuliner/tempo_gelato.jpg',
        category: 'Artisan Gelato & Sorbet',
        operatingHours: '09:00 - 23:00 WIB',
        priceRange: 'Rp 25.000 (Cone 2 Rasa) - Rp 70.000 (Big Cup)',
        status: 'enak',
        verdictLabel: 'Pelopor Artisan Gelato Jogja',
        tasteProfile: 'Gelato padat lembut creamy dengan varian rempah herbal lokal eksklusif seperti Kemangi, Jahe, Serai Kayu Manis, dan Chocolate Spicy.',
        honestReview: 'Pionir artisan gelato di kawasan kampung turis mancanegara Prawirotaman. Menghadirkan puluhan rasa inovatif berbahan baku susu murni segar.'
      },
      {
        id: 'sate-karang-pak-prapto',
        trackPointCode: 'TP-04',
        name: 'Sate Karang Pak Prapto Kotagede (1948)',
        spotName: 'Jl. Nyi Pembayun, Prenggan, Kec. Kotagede, Kota Yogyakarta, DIY 55172 (Sebelah Lapangan Karang)',
        coordinates: { lat: -7.828624, lng: 110.397682 },
        distanceFromWisata: '200 m dari Lapangan Karang',
        image: '/assets/images/kuliner/sate_klathak.jpg',
        category: 'Sate Sapi & Lontong Sayur Lodeh',
        operatingHours: '17:00 - 22:30 WIB',
        priceRange: 'Rp 25.000 - Rp 38.000 / porsi',
        status: 'enak',
        verdictLabel: 'Ikon Malam Kotagede Sejak 1948',
        tasteProfile: 'Sate daging sapi empuk dibakar arang dengan tiga pilihan kuah legendaris: kuah gulai, bumbu kacang gurih, atau kuah kecap rawit pedas bersama lontong lodeh.',
        honestReview: 'Kuliner malam khas Lapangan Karang Kotagede sejak 1948. Disajikan unik dengan potongan lontong dan sayur lodeh tempe kental gurih.'
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
    vibe: 'Udara sejuk pegunungan Merapi, jadah tempe hangat, pisang goreng tanduk, dan kopi klotok.',
    gpsAlert: 'GPS Terkunci di Kawasan Lereng Merapi & Kaliurang (D.I. Yogyakarta): Menampilkan koordinat Google Maps dan rekomendasi kuliner sejuk Merapi.',
    kulinerList: [
      {
        id: 'jadah-tempe-mbah-carik',
        trackPointCode: 'TP-01',
        name: 'Jadah Tempe Mbah Carik Pusat (1950)',
        spotName: 'Jl. Astomulyo No.50, Kaliurang, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.596632, lng: 110.424510 },
        distanceFromWisata: '140 m dari Taman Kaliurang',
        image: '/assets/images/kuliner/jadah_tempe.jpg',
        category: 'Kudapan Gurih Manis Lereng Merapi',
        operatingHours: '06:00 - 18:00 WIB',
        priceRange: 'Rp 15.000 - Rp 35.000 / paket besek',
        status: 'enak',
        verdictLabel: 'Burger Tradisional Favorit Sultan HB IX',
        tasteProfile: 'Jadah ketan putih kelapa pulen gurih kenyal dijepit tempe tahu bacem gula kelapa aren legit empuk, dinikmati hangat bersama cabai rawit hijau.',
        honestReview: 'Pelopor jadah tempe sejak 1950 ciptaan Sastro Dinomo (Mbah Carik). Kudapan favorit Sri Sultan Hamengkubuwono IX saat bertandang ke pesanggrahan Kaliurang.'
      },
      {
        id: 'kopi-klotok-pakem',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/kopi-klotok-jogja-kelapa-f97ff51d-019e-422c-928c-8f3eed97b976',
        gofoodMerchant: 'Warung Kopi Klotok Pakem',
        gofoodRating: 4.8,
        gofoodReviews: '10k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-02',
        name: 'Warung Kopi Klotok Kaliurang Pakem',
        spotName: 'Jl. Kaliurang KM.16, Area Sawah, Pakembinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
        coordinates: { lat: -7.669145, lng: 110.420912 },
        distanceFromWisata: 'Jalur Utama Kaliurang Pakem',
        image: '/assets/images/kuliner/kopi_klotok.jpg',
        category: 'Kopi Klotok & Lodeh Prasmanan Pawon',
        operatingHours: '07:00 - 21:00 WIB',
        priceRange: 'Rp 5.000 - Rp 25.000',
        status: 'enak',
        verdictLabel: 'Sensasi Dapur Pawon & Pisang Goreng',
        tasteProfile: 'Sayur lodeh kluwih cabai hijau gurih pedas segar, telur dadar krispi garing gurih, pisang goreng tanduk manis karamel panas, dan seduhan kopi klotok arang pekat.',
        honestReview: 'Konsep rumah joglo tua di pinggir sawah hijau berlatar siluet Gunung Merapi. Pengunjung mengambil nasi dan sayur lodeh langsung dari periuk di dapur pawon tanah liat.'
      },
      {
        id: 'jejamuran-sleman',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/jejamuran-pandowoharjo-97dd3b04-72ec-484b-8d3f-ea4ae7188dd8',
        gofoodMerchant: 'Jejamuran Resto Sleman',
        gofoodRating: 4.7,
        gofoodReviews: '6.4k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-03',
        name: 'Jejamuran Resto Sleman Yogyakarta',
        spotName: 'Jl. Pandowoharjo No.51, Niron, Pandowoharjo, Kec. Sleman, Kabupaten Sleman, DIY 55512',
        coordinates: { lat: -7.712615, lng: 110.354180 },
        distanceFromWisata: '10 menit dari Pusat Sleman',
        image: '/assets/images/jogja_merapi.jpg',
        category: 'Olahan Jamur Nusantara Serba Rasa',
        operatingHours: '09:00 - 21:00 WIB',
        priceRange: 'Rp 18.000 - Rp 45.000',
        status: 'enak',
        verdictLabel: 'Sentra Kuliner Jamur Terbesar Indonesia',
        tasteProfile: 'Sate jamur tiram bumbu kacang lembut menyerupai tekstur ayam, rendang jamur gurih legit, sup jamur salju bening segar, dan jamur kancing krispi.',
        honestReview: 'Pelopor budidaya dan restoran aneka jamur tiram, kuping, merang, hingga kancing. Tempat sangat luas dan ramah keluarga dengan area edukasi budidaya jamur.'
      },
      {
        id: 'soto-bathok-mbah-katro',
        trackPointCode: 'TP-04',
        name: 'Saoto Bathok Mbah Katro Candi Sambisari',
        spotName: 'Jl. Candi Sambisari No.2, Purwomartani, Kec. Kalasan, Kabupaten Sleman, DIY 55571',
        coordinates: { lat: -7.763421, lng: 110.447812 },
        distanceFromWisata: 'Sebelah Barat Situs Candi Sambisari',
        image: '/assets/images/kuliner/soto_bathok.jpg',
        category: 'Soto Daging Sapi Tempurung Kelapa',
        operatingHours: '06:00 - 16:00 WIB',
        priceRange: 'Rp 7.000 - Rp 15.000 / porsi',
        status: 'enak',
        verdictLabel: 'Ikon Soto Sawah Candi Sambisari',
        tasteProfile: 'Kuah soto daging sapi bening segar kaya rempah bawang seledri, tauge renyah, disajikan dalam mangkok tempurung kelapa alami bersama tempe goreng garit panas.',
        honestReview: 'Spot sarapan favorit warga lokal di tepi saung sawah dekat situs purbakala Candi Sambisari yang berada di bawah permukaan tanah. Harga sangat merakyat dengan cita rasa kuah kaldu sapi alami.'
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
    vibe: 'Kawasan kuliner legendaris dengan sate klathak jeruji besi, mangut lele asap dapur pawon, dan bakmi lethek singkong.',
    gpsAlert: 'GPS Terkunci di Kawasan Bantul & Kasongan (D.I. Yogyakarta): Menampilkan koordinat Google Maps dan kuliner legendaris Bantul.',
    kulinerList: [
      {
        id: 'sate-klathak-pak-pong',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/sate-pak-pong-1-pusat-jejeran-de331feb-7eb2-44ee-b4d9-770d126de123',
        gofoodMerchant: 'Sate Klathak Pak Pong Pusat',
        gofoodRating: 4.8,
        gofoodReviews: '9k+',
        gofoodTier: 'Super Partner',
        trackPointCode: 'TP-01',
        name: 'Sate Klathak Pak Pong Pusat (Jejeran)',
        spotName: 'Jl. Sultan Agung No.18, Jejeran II, Wonokromo, Kec. Pleret, Kabupaten Bantul, DIY 55791',
        coordinates: { lat: -7.871215, lng: 110.387920 },
        distanceFromWisata: '6.1 km dari Kasongan',
        image: '/assets/images/kuliner/sate_klathak.jpg',
        category: 'Sate Kambing Jeruji Besi Pleret',
        operatingHours: '09:00 - 23:30 WIB',
        priceRange: 'Rp 28.000 - Rp 45.000',
        status: 'enak',
        verdictLabel: 'Pionir Sate Jeruji Besi Paling Tersohor',
        tasteProfile: 'Daging kambing muda empuk juicy dibumbui garam dan merica, ditusuk jeruji besi sepeda penghantar panas sempurna, disajikan dengan kuah gulai kambing gurih.',
        honestReview: 'Pelopor sate klathak paling tersohor di Jejeran Bantul. Menghidangkan daging kambing tanpa bau prengus dan tengkleng kuah kecap cabai rawit pedas mantap.'
      },
      {
        id: 'mangut-lele-mbah-marto',
        hasGofood: true,
        gofoodUrl: 'https://gofood.co.id/yogyakarta/restaurant/mangut-lele-dapur-asli-mbok-marto-ijoyo-jl-sewon-indah-598c5a11-1106-4dcb-a3c2-c6344100f67c',
        gofoodMerchant: 'Mangut Lele Mbok Marto Ijoyo',
        gofoodRating: 4.7,
        gofoodReviews: '2.1k+',
        gofoodTier: 'GoFood Partner',
        trackPointCode: 'TP-02',
        name: 'Mangut Lele Dapur Asli Mbok Marto Ijoyo',
        spotName: 'Jl. Sewon Indah No.1, Ngireng-ireng, Panggungharjo, Kec. Sewon, Kabupaten Bantul, DIY 55188',
        coordinates: { lat: -7.848520, lng: 110.358514 },
        distanceFromWisata: '2.2 km dari Kasongan',
        image: '/assets/images/kuliner/mangut_lele.jpg',
        category: 'Olahan Lele Asap Dapur Pawon',
        operatingHours: '10:00 - 21:00 WIB',
        priceRange: 'Rp 25.000 - Rp 40.000',
        status: 'enak',
        verdictLabel: 'Tradisi Makan Langsung di Dapur Pawon Kayu',
        tasteProfile: 'Lele kali segar diasap berjam-jam di atas pelepah kelapa hingga kering wangi, dimasak dalam kuah santan cabai rawit merah membara super pedas dan gurih.',
        honestReview: 'Pengunjung diajak masuk ke dapur pawon kayu bakar tradisional untuk mengambil nasi dan mangut sendiri langsung dari kuali tanah liat sang maestro kuliner Mbok Marto.'
      },
      {
        id: 'mie-lethek-mbah-mendes',
        trackPointCode: 'TP-03',
        name: 'Bakmi Lethek Mbah Mendes (Bantul Pusat)',
        spotName: 'Jl. Sarirejo Singosaren, Soropaten, Ringinharjo, Kec. Bantul, Kabupaten Bantul, DIY 55712',
        coordinates: { lat: -7.882512, lng: 110.341230 },
        distanceFromWisata: '4.1 km dari Kasongan',
        image: '/assets/images/kuliner/mie_lethek.jpg',
        category: 'Mie Gaplek Singkong Alami Tradisional',
        operatingHours: '17:00 - 23:00 WIB',
        priceRange: 'Rp 22.000 - Rp 35.000',
        status: 'enak',
        verdictLabel: 'Pusaka Mie Gaplek Tanpa Pemutih Kimia',
        tasteProfile: 'Mie tepung gaplek tapioka kenyal beraroma asap tungku arang, dimasak bersama kaldu ayam kampung, suwiran daging empuk, dan telur bebek gurih.',
        honestReview: 'Diproduksi dari bahan alami singkong Srandakan Bantul tanpa bahan pemutih dan pengawet kimia. Tekstur mienya kenyal padat khas dan ramah pencernaan.'
      },
      {
        id: 'ingkung-kuali-pajangan',
        trackPointCode: 'TP-04',
        name: 'Warung Ingkung Kuali Mbok Suminah Pajangan',
        spotName: 'Kalakijo, Guwosari, Kec. Pajangan, Kabupaten Bantul, DIY 55751',
        coordinates: { lat: -7.893120, lng: 110.308415 },
        distanceFromWisata: '5.2 km dari Kasongan',
        image: '/assets/images/kuliner/ingkung_ayam.jpg',
        category: 'Ingkung Ayam Kampung Kuali Tanah Liat',
        operatingHours: '09:00 - 20:00 WIB',
        priceRange: 'Rp 85.000 - Rp 140.000 / satu ekor ayam utuh',
        status: 'enak',
        verdictLabel: 'Sentra Ingkung Tradisional Pajangan Bantul',
        tasteProfile: 'Ayam kampung jantan utuh dimasak perlahan dalam kuali tanah liat bumbu areh santan kental, daun salam, serai, disajikan dengan nasi gurih tumpeng dan sambal korek.',
        honestReview: 'Sentra kuliner ingkung Pajangan Bantul yang awalnya merupakan sajian kenduri ritual adat. Daging ayamnya sangat empuk terkelupas dari tulang dengan kuah areh legit gurih.'
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
    vibe: 'Pesisir Samudra Hindia, gumuk pasir vulkanik, panorama tebing karst Watugupit, dan sentra seafood segar TPI Depok.',
    gpsAlert: 'GPS Terkunci di Kawasan Pesisir Selatan Parangtritis (D.I. Yogyakarta): Menampilkan koordinat Google Maps dan kuliner bahari pesisir selatan.',
    kulinerList: [
      {
        id: 'tpi-pasar-ikan-depok',
        trackPointCode: 'TP-01',
        name: 'Sentra Ikan Laut Segar TPI Pantai Depok',
        spotName: 'Kawasan TPI Pantai Depok, Parangtritis, Kec. Kretek, Kabupaten Bantul, DIY 55772',
        coordinates: { lat: -8.015214, lng: 110.290812 },
        distanceFromWisata: '4.6 km dari Pantai Parangtritis',
        image: '/assets/images/kuliner/ikan_bakar.jpg',
        category: 'Seafood Tangkapan Nelayan Langsung',
        operatingHours: '07:00 - 19:00 WIB',
        priceRange: 'Rp 35.000 - Rp 90.000 / kg hasil laut segar',
        status: 'enak',
        verdictLabel: 'Ikan Tangkapan Nelayan Langsung Masak',
        tasteProfile: 'Kakap merah, bawal, cumi, dan udang galah segar dibakar bumbu kecap manis gurih atau pedas manis, disajikan lalapan segar, plecing kangkung, dan sambal terasi bakar gurih.',
        honestReview: 'Pusat kuliner bahari pesisir selatan di mana pengunjung memilih dan menimbang ikan segar langsung di Tempat Pelelangan Ikan (TPI), lalu warung koperasi siap membakarnya secara higienis.'
      },
      {
        id: 'warung-seafood-bu-narti-depok',
        trackPointCode: 'TP-02',
        name: 'Warung Seafood Bu Narti Pantai Depok',
        spotName: 'Jl. Pantai Depok, Parangtritis, Kec. Kretek, Kabupaten Bantul, DIY 55772',
        coordinates: { lat: -8.016320, lng: 110.292140 },
        distanceFromWisata: '4.5 km dari Pantai Parangtritis',
        image: '/assets/images/kuliner/ikan_bakar.jpg',
        category: 'Warung Makan Seafood Pesisir Selatan',
        operatingHours: '08:00 - 20:00 WIB',
        priceRange: 'Rp 25.000 - Rp 65.000',
        status: 'enak',
        verdictLabel: 'Warung Legendaris Tepi Pantai Depok',
        tasteProfile: 'Ikan laut bakar bumbu rempah kuning, cumi saus padang asam pedas gurih, ca kangkung belacan harum, dan es kelapa muda murni penghilang dahaga.',
        honestReview: 'Salah satu warung seafood tertua di tepi ombak Pantai Depok. Cita rasa sambal terasi mentah dan bumbu bakarnya sangat konsisten sejak era 1990-an.'
      },
      {
        id: 'resto-watugupit-paralayang',
        trackPointCode: 'TP-03',
        name: 'Kafe Tebing Sunset Bukit Paralayang Watugupit',
        spotName: 'Area Hutan, Giricahyo, Kec. Purwosari, Kabupaten Gunungkidul, DIY 55872 (Atas Tebing Pantai Parangndog)',
        coordinates: { lat: -8.029815, lng: 110.348612 },
        distanceFromWisata: '1.8 km dari Pantai Parangtritis',
        image: '/assets/images/jogja_parangtritis.jpg',
        category: 'Panorama Senja & Minuman Rempah Tebing',
        operatingHours: '09:00 - 20:00 WIB (Puncak senja 16:30 - 18:00)',
        priceRange: 'Rp 15.000 - Rp 35.000',
        status: 'enak',
        verdictLabel: 'Spot Sunset Paling Ikonik Jogja Selatan',
        tasteProfile: 'Kopi jahe gula aren rempah hangat, wedang uwuh secang, mendoan hangat cocol kecap rawit pedas, dan kelapa muda batok utuh.',
        honestReview: 'Spot santai di puncak tebing karang Pantai Parangtritis dengan lanskap cakrawala Samudra Hindia 180 derajat. Menikmati hidangan ringan sembari menyaksikan atraksi paralayang dan matahari terbenam.'
      },
      {
        id: 'bakmi-mbok-nem-parangtritis',
        trackPointCode: 'TP-04',
        name: 'Warung Bakmi & Soto Jawa Mbok Nem Kretek',
        spotName: 'Jl. Parangtritis KM 22, Donotirto, Kec. Kretek, Kabupaten Bantul, DIY 55772',
        coordinates: { lat: -7.985420, lng: 110.320815 },
        distanceFromWisata: '6.0 km dari Pantai Parangtritis',
        image: '/assets/images/kuliner/bakmi_jawa.jpg',
        category: 'Soto Ayam Kampung & Bakmi Jawa',
        operatingHours: '08:00 - 21:00 WIB',
        priceRange: 'Rp 15.000 - Rp 25.000',
        status: 'enak',
        verdictLabel: 'Persinggahan Favorit Jalur Pantai Selatan',
        tasteProfile: 'Soto kuah rempah bening gurih segar dengan suwiran ayam kampung empuk, dan bakmi nyemek gurih bertabur seledri dan emping mlinjo renyah.',
        honestReview: 'Persinggahan legendaris para wisatawan di jalur utama menuju pantai selatan Yogyakarta. Menyajikan masakan Jawa rumahan dengan harga yang pasti dan ramah di kantong.'
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
          image: '/assets/images/real_tari_srimanganti.jpg',
          detail: 'Tarian sakral yang ditarikan oleh sembilan penari putri dengan gerakan meditatif halus, melambangkan sembilan lubang hawa nafsu manusia dan harmoni kosmis.'
        },
        {
          category: 'Upacara Adat Agung',
          name: 'Hajad Dalem Garebeg Mulud & Sekaten',
          image: '/assets/images/real_gunungan_grebeg.jpg',
          detail: 'Arak-arakan tujuh Gunungan hasil bumi dari Keraton menuju Masjid Gedhe Kauman sebagai wujud sedekah raja kepada rakyatnya.'
        },
        {
          category: 'Gastronomi Kasultanan',
          name: 'Bebek Suwar-Suwir, Brongkos, & Bir Jawa',
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/real_bregada_keraton.jpg',
          desc: 'Menyaksikan pameran kereta kencana, silsilah pohon keluarga Mataram, dan pertunjukan reguler Gamelan/Wayang Wong setiap pagi.'
        },
        {
          name: 'Umbul Pasiraman & Sumur Gumuling Tamansari',
          type: 'Situs Cagar Budaya Istana Air',
          image: '/assets/images/jogja_tamansari.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
          detail: 'Perpaduan kopi arang membara di utara Stasiun Tugu, lumpia rebung bawang putih di depan Hotel Mutiara, dan gudeg pagi legendaris di Sosrowijayan.'
        },
        {
          category: 'Kriya & Perdagangan',
          name: 'Seni Tawar-Menawar Halus di Pasar Beringharjo',
          image: '/assets/images/jogja_malioboro.jpg',
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
          image: '/assets/images/jogja_batik.jpg',
          desc: 'Pusat oleh-oleh terkurasi dengan harga transparan serta kuliner legendaris Sate Kere (sate gajih sapi bakar bumbu ketumbar) di pintu timur Beringharjo.'
        },
        {
          name: 'Museum Benteng Vredeburg & Titik Nol Km',
          type: 'Museum Sejarah & Ruang Publik',
          image: '/assets/images/jogja_malioboro.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
          detail: 'Kue Kipo ketan pandan isi kelapa gula jawa, Roti Kembang Waru berkelopak 8 simbol Hasta Brata, dan Bakmi Jawa tungku arang.'
        },
        {
          category: 'Tradisi Ziarah Adat',
          name: 'Tata Cara Busana Peranakan di Makam Raja Mataram',
          image: '/assets/images/real_bregada_keraton.jpg',
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
          image: '/assets/images/jogja_kotagede.jpg',
          desc: 'Menyusuri lorong sempit penuh rumah Joglo berusia ratusan tahun yang terawat sangat bersih oleh warga setempat.'
        },
        {
          name: 'Workshop Perak HS Silver / Ansor Silver & Bakmi Mbah Gito',
          type: 'Edukasi Kriya & Kuliner Malam',
          image: '/assets/images/jogja_kotagede.jpg',
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
          image: '/assets/images/real_ramayana_stage.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_prambanan.jpg',
          desc: 'Menjelajahi kemegahan candi Hindu Prambanan dan candi Buddha Sewu yang berdampingan dalam satu taman wisata sebagai bukti toleransi abad ke-9.'
        },
        {
          name: 'Alun-Alun & Gapura Utama Keraton Ratu Boko',
          type: 'Titik Pengamatan Senja',
          image: '/assets/images/jogja_ratuboko.jpg',
          desc: 'Menikmati semburat jingga matahari terbenam yang membingkai pintu gerbang batu kuno di atas bukit.'
        },
        {
          name: 'Candi Sambisari & Soto Bathok Mbah Katro',
          type: 'Candi Bawah Tanah & Sarapan Pagi',
          image: '/assets/images/jogja_prambanan.jpg',
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
          image: '/assets/images/real_batik_keraton.jpg',
          detail: 'Menjelajahi perbedaan halus motif batik Yogyakarta (latar putih tegas) dan Surakarta (latar sogan cokelat), ditutup suguhan hangat minuman rempah Ratu Mas.'
        },
        {
          category: 'Kuliner Khas Pegunungan',
          name: 'Jadah Tempe Mbah Carik, Sate Ratu, & Kopi Klotok Pakem',
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_merapi.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
          detail: 'Gudeg kering memiliki areh kental yang dimasak lama (cocok untuk oleh-oleh kendil/besek), sedangkan gudeg basah berkuah santan gurih segar yang disantap pagi atau tengah malam.'
        },
        {
          category: 'Inovasi Tradisi Bantul',
          name: 'Sate Klathak Pak Pong & Pak Bari (Tusuk Jeruji Besi)',
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_upacara_adat.jpg',
          detail: 'Ritual tahunan setiap bulan Suro menguras empat tempayan air pusaka persembahan kerajaan sahabat (Aceh, Palembang, Turki/Rum, dan Siam).'
        },
        {
          category: 'Minuman & Kuliner Herbal',
          name: 'Wedang Uwuh Imogiri & Pecel Kembang Turi',
          image: '/assets/images/jogja_batik.jpg',
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
          image: '/assets/images/real_batik_keraton.jpg',
          desc: 'Mencoba mencanting batik tulis didampingi ibu-ibu perajin lalu mendaki 409 anak tangga Imogiri.'
        },
        {
          name: 'Hutan Pinus Mangunan & Puncak Becici Dlingo',
          type: 'Lanskap Alam Bantul Timur',
          image: '/assets/images/jogja_merapi.jpg',
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
          image: '/assets/images/jogja_parangtritis.jpg',
          detail: 'Selain dipercaya sebagai warna kesukaan Kanjeng Ratu Kidul, secara ilmiah warna hijau pupus menyaru dengan warna air laut berarus rip current sehingga menyulitkan Tim SAR jika terjadi keadaan darurat.'
        },
        {
          category: 'Kuliner Pesisir & Geopark',
          name: 'Thiwul Yu Tum, Sego Abang Lombok Ijo, & Seafood TPI Depok',
          image: '/assets/images/jogja_gudeg.jpg',
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
          image: '/assets/images/jogja_parangtritis.jpg',
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
