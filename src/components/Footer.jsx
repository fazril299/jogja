import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Compass,
  Radio,
  BookMarked,
  Scroll,
  Share2,
  ShieldCheck,
  Globe,
  ChevronRight,
  Sparkles
} from 'lucide-react';

function InstagramIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// Crisp circular mandala medallion in pure black
function EastwardMandalaMedallion() {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15);
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="Hamemayu Emblem"
    >
      {/* Outer double border rings */}
      <circle cx="50" cy="50" r="47.5" stroke="#000000" strokeWidth="1.2" />
      <circle
        cx="50"
        cy="50"
        r="43.5"
        stroke="#000000"
        strokeWidth="1"
        strokeDasharray="2 2.2"
      />
      <circle cx="50" cy="50" r="39.5" stroke="#000000" strokeWidth="1" />

      {/* Outer scalloped petal ring */}
      {rays.map((deg) => (
        <g key={`ray-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <line
            x1="50"
            y1="10.5"
            x2="50"
            y2="17"
            stroke="#000000"
            strokeWidth="0.9"
          />
          <circle cx="50" cy="8.2" r="0.9" fill="#000000" />
        </g>
      ))}

      {/* Middle lotus / kawung geometric ring */}
      <circle cx="50" cy="50" r="32.5" stroke="#000000" strokeWidth="1" />
      {petals.map((deg) => (
        <g key={`petal-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <path
            d="M50 17.5 C53.5 23, 53.5 28.5, 50 33.5 C46.5 28.5, 46.5 23, 50 17.5 Z"
            stroke="#000000"
            strokeWidth="0.95"
            fill="none"
          />
        </g>
      ))}

      {/* Inner concentric rings & 8-pointed philosophical star */}
      <circle cx="50" cy="50" r="22" stroke="#000000" strokeWidth="1" />
      <circle
        cx="50"
        cy="50"
        r="17.5"
        stroke="#000000"
        strokeWidth="0.85"
        strokeDasharray="1.8 1.8"
      />
      <path
        d="M50 32 L54 46 L68 50 L54 54 L50 68 L46 54 L32 50 L46 46 Z"
        stroke="#000000"
        strokeWidth="1.1"
        fill="none"
      />
      <path
        d="M50 32 L54 46 L68 50 L54 54 L50 68 L46 54 L32 50 L46 46 Z"
        transform="rotate(45 50 50)"
        stroke="#000000"
        strokeWidth="0.85"
        fill="none"
      />
      <circle cx="50" cy="50" r="5.5" stroke="#000000" strokeWidth="1" />
      <circle cx="50" cy="50" r="2" fill="#000000" />
    </svg>
  );
}

export default function Footer({
  onOpenAboutUs,
  onOpenNearMe,
  onOpenMap,
  onOpenCultureBook,
  onOpenCultureEvents,
  onOpenCultureJournals,
  onOpenKalenderAcara,
  onOpenJurnalBudaya,
  onOpenAdmin,
  onOpenShareModal,
  onSelectPlaceById
}) {
  const scrollToTop = () => {
    const container = document.querySelector('.app-container');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavigateDestination = (placeId) => {
    if (onSelectPlaceById) {
      onSelectPlaceById(placeId);
    } else {
      const el = document.getElementById('destinations-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="site-footer"
      className="relative z-20 w-full overflow-hidden bg-[#FAF6EE] text-[#1A1A1A] border-t border-[#D9CEBA]/80"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* =========================================================================
          MAIN MULTI-COLUMN NAVIGATION & INSTITUTIONAL INFO (WHITE THEME, ALL BLACK TEXT)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* COLUMN 1: BRAND IDENTITY & PHILOSOPHICAL FOUNDATION (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Emblem & Title */}
            <div className="flex items-center gap-3.5">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="group inline-flex items-center transition-transform duration-300 hover:rotate-12"
                aria-label="Kembali ke Beranda Hamemayu"
              >
                <EastwardMandalaMedallion />
              </a>
              <div>
                <span
                  className="block text-2xl font-extrabold tracking-tight text-black hover:opacity-75 transition-opacity"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Hamemayu
                </span>
                <span
                  className="block text-[11px] tracking-wider uppercase text-black font-bold"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Pusaka Budaya &amp; Kuliner Yogyakarta
                </span>
              </div>
            </div>

            {/* Mission Statement */}
            <p className="text-xs sm:text-sm text-black leading-relaxed">
              Platform kurasi terpadu nilai-nilai filosofi Kasultanan Ngayogyakarta Hadiningrat,
              peta sebaran pusaka budaya, dan panduan perjalanan beradab di Daerah Istimewa Yogyakarta.
            </p>
          </div>

          {/* COLUMN 2: DESTINASI & PUSAKA SEJARAH (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-black"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Destinasi &amp; Pusaka
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('keraton-yogyakarta')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Keraton &amp; Tamansari Yogyakarta</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('prambanan-ratuboko')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Candi Prambanan &amp; Ratu Boko</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('kotagede')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Kampung Warisan Kotagede &amp; Perak</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('malioboro-tugu')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Tugu Pal Putih &amp; Malioboro</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('merapi-kaliurang')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Merapi, Kaliurang &amp; Ullen Sentalu</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateDestination('parangtritis-gunungkidul')}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <ChevronRight size={13} className="text-black" />
                  <span>Segara Kidul &amp; Geopark Karst</span>
                </button>
              </li>
              <li>
                <a
                  href="#destinations-section"
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1 text-[11px] font-bold text-black pt-1 underline"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Lihat Seluruh Katalog Destinasi &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: FITUR EKSPLORASI & KOMUNITAS (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-black"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Fitur Budaya
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAboutUs && onOpenAboutUs()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black cursor-pointer bg-transparent border-none p-0"
                >
                  <Sparkles size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Tentang Hamemayu</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenNearMe && onOpenNearMe()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black"
                >
                  <Radio size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Radar Wisata GPS</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenMap && onOpenMap()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black cursor-pointer bg-transparent border-none p-0"
                >
                  <MapPin size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Peta Wilayah &amp; Budaya DIY</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCultureBook && onOpenCultureBook()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black"
                >
                  <BookMarked size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Paspor Budaya</span>
                </button>
              </li>
              <li>
                <a
                  href="#packages"
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black"
                >
                  <Compass size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Rute Ekspedisi</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenJurnalBudaya) onOpenJurnalBudaya();
                    else if (onOpenCultureJournals) onOpenCultureJournals();
                    else if (onOpenCultureBook) onOpenCultureBook();
                  }}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-start gap-2 text-left font-medium text-black cursor-pointer bg-transparent border-none p-0"
                >
                  <Scroll size={14} className="text-amber-800 flex-shrink-0 mt-0.5" />
                  <span>Jurnal &amp; Panduan Budaya</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenShareModal && onOpenShareModal()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left font-medium text-black"
                >
                  <Share2 size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Bagikan Momen</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAdmin && onOpenAdmin()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 text-left text-[11px] text-black font-semibold pt-1 underline"
                >
                  <ShieldCheck size={14} className="text-amber-800 flex-shrink-0" />
                  <span>Portal Kurator &amp; CMS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: KONTAK RESMI & SEKRETARIAT (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-black"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Sekretariat &amp; Kontak
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-black">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-800 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-black">
                  Kawasan Keraton Ngayogyakarta Hadiningrat, Kec. Kraton, Kota Yogyakarta, D.I. Yogyakarta 55133
                </span>
              </div>

              {/* Telephone */}
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-amber-800 flex-shrink-0" />
                <a
                  href="tel:+622745550193"
                  className="hover:opacity-60 transition-opacity font-mono text-xs font-semibold text-black"
                >
                  +62 274 555 0193
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-amber-800 flex-shrink-0" />
                <a
                  href="mailto:kontak@hamemayu.id"
                  className="hover:opacity-60 transition-opacity font-mono text-xs font-semibold text-black"
                >
                  kontak@hamemayu.id
                </a>
              </div>
            </div>

            {/* Social Media Pills */}
            <div className="pt-2">
              <span
                className="block text-[11px] font-bold text-black uppercase tracking-wider mb-2.5"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Kanal Resmi &amp; Komunitas
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href="https://wa.me/622745550193"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#25D366] text-slate-800 hover:text-white border border-slate-300 hover:border-[#25D366] hover:scale-105 transition-all flex items-center justify-center shadow-sm"
                  aria-label="WhatsApp Hamemayu"
                  title="WhatsApp Resmi"
                >
                  <WhatsAppIcon size={17} />
                </a>
                <a
                  href="https://www.instagram.com/hamemayu.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-slate-800 hover:text-white border border-slate-300 hover:border-transparent hover:scale-105 transition-all flex items-center justify-center shadow-sm"
                  aria-label="Instagram Hamemayu"
                  title="Instagram Resmi"
                >
                  <InstagramIcon size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@KratonJogjaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#FF0000] text-slate-800 hover:text-white border border-slate-300 hover:border-[#FF0000] hover:scale-105 transition-all flex items-center justify-center shadow-sm"
                  aria-label="YouTube Dokumenter Kebudayaan"
                  title="YouTube Dokumenter"
                >
                  <YoutubeIcon size={17} />
                </a>
                <a
                  href="https://tourism.kratonjogja.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3.5 rounded-full bg-slate-100 hover:bg-[#2C221E] text-slate-800 hover:text-amber-200 border border-slate-300 hover:border-[#2C221E] hover:scale-105 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                  aria-label="Portal Resmi Keraton"
                  title="Situs Resmi Kasultanan"
                >
                  <Globe size={14} className="flex-shrink-0" />
                  <span className="text-[11px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Keraton Jogja
                  </span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM COPYRIGHT BAR
            ========================================================================= */}
        <div className="mt-8 sm:mt-10 pt-5 border-t border-[#D9CEBA]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <p className="m-0 font-medium text-black">
            © {new Date().getFullYear()} Hamemayu Hayuning Bawana. Seluruh Hak Cipta Dilindungi.
          </p>
          <p className="m-0 text-[11px] text-neutral-500">
            Dedikasi Pelestarian Nilai Luhur Budaya Yogyakarta
          </p>
        </div>
      </div>
    </footer>
  );
}
