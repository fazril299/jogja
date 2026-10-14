# 🇮🇩 NusantaraStory — Platform Eksplorasi Sosial & Budaya Indonesia

> **“Di balik setiap tempat, ada cerita. Ada masyarakat. Ada budaya. Ada sejarah.”**  
> *Interactive Cultural Storytelling Platform untuk mengeksplorasi destinasi ikonik Indonesia melalui lensa kehidupan sosial, kearifan adat, dan cerita luhur.*

---

## 🌟 1. Konsep & Filosofi Pembeda

Mayoritas platform hanya menyajikan informasi tempat secara terpisah: Google Maps menyajikan navigasi fisik, artikel berita menyajikan narasi panjang kaku, dan media sosial hanya menyajikan foto estetika.

**NusantaraStory** menggabungkan seluruh dimensi tersebut ke dalam satu pengalaman eksplorasi interaktif:
```text
Indonesia 
   ↓
Pilih Tempat / Lokasi Sekitar 
   ↓
Kenali Wilayah (Chapter 01)
   ↓
Kenali Masyarakat (Chapter 02)
   ↓
Kenali Budaya (Chapter 03)
   ↓
Cerita & Legenda (Chapter 04)
   ↓
Jelajahi Titik Lokasi (Chapter 05)
   ↓
Pengalaman & Etika Adat (Chapter 06)
   ↓
Panduan Berkunjung & Peta (Chapter 07)
   ↓
Stempel ke "My Culture Book"
```

---

## ✨ 2. Fitur-Fitur Utama (Tahap MVP Lomba)

1. **Cinematic Storybook Opening**:
   - Pembuka emosional dengan tipografi editorial dan transisi teks narasi:
     *“Indonesia bukan hanya tentang tempat yang indah. Di setiap tempat, ada cerita.”*
   - Akses cepat tombol `[ MULAI EKSPLORASI ]` & `[ 📍 DI SEKITAR KAMU ]`.

2. **Interactive 7-Chapter Storybook (Place Detail)**:
   - **Chapter 01 — Kenali Tempat**: Gambaran bentang alam, lanskap karst/vulkanik, dan lintasan sejarah.
   - **Chapter 02 — Kenali Masyarakat**: Komunitas adat (Suku Maya, Krama Banjar, Abdi Dalem, dll.), peran sosial, dan falsafah hidup.
   - **Chapter 03 — Kenali Budaya**: Tradisi sakral, dialek bahasa daerah, kuliner autentik, seni tari/musik, pakaian, dan kerajinan.
   - **Chapter 04 — Cerita & Legenda**: Hikayat lisan dan mitologi penutur asli beserta pesan moralnya.
   - **Chapter 05 — Jelajahi Lokasi**: Kampung adat, situs sejarah, dan spot budaya unggulan.
   - **Chapter 06 — Pengalaman & Etika**: Rating penjelajah, testimoni terverifikasi, serta panduan santun **DO's & DON'Ts**.
   - **Chapter 07 — Panduan Berkunjung**: Panduan rute transportasi, musim terbaik berkunjung, dan **Google Maps Embed interaktif**.

3. **📍 Fitur "Di Sekitar Kamu" (Geolocation Discovery)**:
   - Menggunakan kalkulasi matematis **Formula Haversine** untuk menghitung jarak akurat (km) dari koordinat GPS perangkat pengguna ke seluruh destinasi budaya.
   - Dilengkapi fitur pengujian cepat **Simulasi Kota** (Jakarta, Bandung, Surabaya, Medan, Makassar, Denpasar, Sorong) untuk keperluan penilaian juri.

4. **🗺️ Peta Budaya Nusantara (Interactive Map)**:
   - Visualisasi posisi geografis destinasi di kanvas kepulauan Indonesia.
   - Integrasi ganda: **Peta Interaktif Pinpoint SVG** dan **Google Maps Live Frame**.

5. **📖 "My Culture Book" (Paspor Budaya Pribadi)**:
   - Menggunakan konsep gamifikasi yang relevan dan elegan (bukan sekadar poin/badge receh).
   - Menghitung statistik eksplorasi pengguna (*x wilayah dijelajahi, y bab terbaca, z stempel dikoleksi*).
   - **Galeri Stempel Budaya**: Mendapatkan cap stempel adat berhias simbol khas setiap menyelesaikan eksplorasi.
   - **Jurnal Refleksi Penjelajah**: Pengguna dapat menulis catatan refleksi dan rencana perjalanan pribadi.

6. **🎵 Suasana Akustik Budaya (Web Audio Ambient Synthesizer)**:
   - Generator suara sintetis berbasis Web Audio API (ombak laut Raja Ampat, laras nada gamelan pentatonik Bali/Jogja, tiupan angin pegunungan Toraja/Baduy).
   - Beroperasi 100% andal secara lokal tanpa ketergantungan file audio eksternal yang rawan rusak.

7. **⚙️ Panel Pengelola & Kontribusi (CMS & Supabase Ready)**:
   - Formulir penambahan destinasi budaya baru.
   - Moderasi ulasan komunitas (Setujui / Tolak).
   - Skema DDL Database PostgreSQL / Supabase siap pakai.

---

## 🏛️ 3. Cakupan Destinasi Unggulan (MVP)

1. **Raja Ampat** (Papua Barat Daya) — *Tradisi Sasi Laut & Kearifan Empat Raja*
2. **Bali** (Ubud & Penglipuran) — *Harmoni Tri Hita Karana & Ritme Krama Banjar*
3. **Yogyakarta** (Keraton & Kotagede) — *Sumbu Filosofis & Falsafah Hamemayu Hayuning Bawana*
4. **Toraja** (Tana Toraja & Toraja Utara) — *Upacara Rambu Solo' & Rumah Tongkonan*
5. **Danau Toba & Samosir** (Sumatera Utara) — *Kaldera Supervolcano & Falsafah Dalihan Na Tolu*
6. **Baduy** (Desa Kanekes, Banten) — *Pikukuh Sunda Wiwitan Tanpa Jejak Modernitas*
7. **Sumatera Barat** (Minangkabau) — *Sistem Kekerabatan Matrilineal & Filosofi Alam Takambang Jadi Guru*
8. **Lombok** (Suku Sasak Sade & Sembalun) — *Ritual Bau Nyale & Warisan Tenun Sukarara*

---

## 💻 4. Teknologi & Arsitektur

* **Framework Frontend**: React 19 (Functional Components & Custom Hooks)
* **Build Tool**: Vite ESM (dengan arsitektur Rollup `manualChunks` code-splitting)
* **Styling**: Tailwind CSS & Glassmorphism Luxury
* **Animasi & Transisi**: Framer Motion
* **Smooth Momentum Scrolling**: Lenis
* **Ikon**: Lucide React
* **Penyimpanan Lokal**: LocalStorage Sync
* **Backend Database Ready**: Supabase (PostgreSQL schema migration included)
* **Deployment Ready**: Vercel (`vercel.json` SPA rewrite + Edge caching)

---

## 🚀 5. Cara Menjalankan Proyek

### Mode Pengembangan (Development)
```bash
npm install
npm run dev
```
Buka browser pada alamat `http://localhost:5173`.

### Build Produksi (Production)
```bash
npm run build
npm run preview
```
Output build terletak pada folder `dist/` dengan ukuran bundle teroptimasi.
