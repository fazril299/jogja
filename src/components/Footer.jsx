import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ExternalLink,
  Compass,
  BookOpen,
  Share2,
  FileText,
  X,
  Globe,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Navigation
} from 'lucide-react';

function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#000000" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#000000" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
      aria-label="JogjaKrama Emblem"
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
  onOpenNearMe,
  onOpenCultureBook,
  onOpenCultureEvents,
  onOpenCultureJournals,
  onOpenKalenderAcara,
  onOpenJurnalBudaya,
  onOpenAdmin,
  onOpenShareModal,
  onSelectPlaceById
}) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'ethics' | 'accessibility'

  const scrollToTop = () => {
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
      className="relative w-full overflow-hidden bg-white text-black border-t border-slate-200"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* =========================================================================
          MAIN MULTI-COLUMN NAVIGATION & INSTITUTIONAL INFO (WHITE THEME, ALL BLACK TEXT)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
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
                aria-label="Kembali ke Beranda JogjaKrama"
              >
                <EastwardMandalaMedallion />
              </a>
              <div>
                <span
                  className="block text-2xl font-extrabold tracking-tight text-black hover:opacity-75 transition-opacity"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  JogjaKrama
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
              className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Compass size={15} className="text-black" />
              <span>Destinasi &amp; Pusaka</span>
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
              className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <BookOpen size={15} className="text-black" />
              <span>Fitur Budaya</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-black">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenNearMe && onOpenNearMe()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <Navigation size={13} className="text-black" />
                  <span>Radar Wisata GPS</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCultureBook && onOpenCultureBook()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <BookOpen size={13} className="text-black" />
                  <span>Paspor Budaya</span>
                </button>
              </li>
              <li>
                <a
                  href="#packages"
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <Compass size={13} className="text-black" />
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
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black cursor-pointer bg-transparent border-none p-0"
                >
                  <FileText size={13} className="text-black" />
                  <span>Jurnal &amp; Panduan Budaya</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenKalenderAcara) onOpenKalenderAcara();
                    else if (onOpenCultureEvents) onOpenCultureEvents();
                    else if (onOpenCultureBook) onOpenCultureBook();
                  }}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black cursor-pointer bg-transparent border-none p-0"
                >
                  <BookOpen size={13} className="text-black" />
                  <span>Kalender Acara Jogja</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenShareModal && onOpenShareModal()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left font-medium text-black"
                >
                  <Share2 size={13} className="text-black" />
                  <span>Bagikan Momen</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAdmin && onOpenAdmin()}
                  className="hover:opacity-60 hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 text-left text-[11px] text-black font-semibold pt-1 underline"
                >
                  <ShieldCheck size={13} className="text-black" />
                  <span>Portal Kurator &amp; CMS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: KONTAK RESMI & SEKRETARIAT (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <MapPin size={15} className="text-black" />
              <span>Sekretariat &amp; Kontak</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-black">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-black flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-black">
                  Kawasan Keraton Ngayogyakarta Hadiningrat, Kec. Kraton, Kota Yogyakarta, D.I. Yogyakarta 55133
                </span>
              </div>

              {/* Telephone */}
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-black flex-shrink-0" />
                <a
                  href="tel:+622745550193"
                  className="hover:opacity-60 transition-opacity font-mono text-xs font-semibold text-black"
                >
                  +62 274 555 0193
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-black flex-shrink-0" />
                <a
                  href="mailto:kontak@jogjakrama.id"
                  className="hover:opacity-60 transition-opacity font-mono text-xs font-semibold text-black"
                >
                  kontak@jogjakrama.id
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
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://wa.me/622745550193"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-all flex items-center justify-center text-black"
                  aria-label="WhatsApp JogjaKrama"
                  title="WhatsApp Resmi"
                >
                  <WhatsAppIcon size={17} />
                </a>
                <a
                  href="https://www.instagram.com/jogjakrama.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-all flex items-center justify-center text-black"
                  aria-label="Instagram JogjaKrama"
                  title="Instagram Resmi"
                >
                  <InstagramIcon size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@KratonJogjaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-all flex items-center justify-center text-black"
                  aria-label="YouTube Dokumenter Kebudayaan"
                  title="YouTube Dokumenter"
                >
                  <YoutubeIcon size={17} />
                </a>
                <a
                  href="https://tourism.kratonjogja.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3.5 rounded-full bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-all flex items-center gap-1.5 text-xs text-black"
                  aria-label="Portal Resmi Keraton"
                  title="Situs Resmi Kasultanan"
                >
                  <Globe size={14} className="text-black" />
                  <span className="text-[11px] font-bold text-black" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Keraton Jogja
                  </span>
                  <ExternalLink size={11} className="text-black opacity-80" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          INSTITUTIONAL CITATIONS & CULTURAL ENDORSEMENT STRIP
          ========================================================================= */}
      <div className="border-t border-b border-slate-200 bg-slate-50 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-black">
          <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center text-black">
            <span className="font-bold text-black" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Rujukan &amp; Mitra Terkait:
            </span>
            <span>UNESCO World Heritage</span>
            <span>•</span>
            <span>Keraton Ngayogyakarta Hadiningrat</span>
            <span>•</span>
            <span>Kundha Kabudayan DIY</span>
            <span>•</span>
            <span>Pesona Indonesia</span>
          </div>
          <div className="text-black text-center md:text-right font-medium">
            <span>Kasultanan Ngayogyakarta Hadiningrat</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM LEGAL, SITEMAP & BACK-TO-TOP BAR
          ========================================================================= */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright notice */}
          <div className="text-xs text-black text-center sm:text-left space-y-0.5">
            <div>
              &copy; {new Date().getFullYear()}{' '}
              <span className="text-black font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                JogjaKrama
              </span>. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="text-[11px] text-black">
              Dirancang dengan dedikasi untuk pelestarian warisan budaya adiluhung Yogyakarta.
            </div>
          </div>

          {/* Legal Navigation Modals */}
          <div className="flex items-center gap-4 text-xs text-black flex-wrap justify-center font-semibold">
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="text-black hover:opacity-60 transition-opacity"
            >
              Kebijakan Privasi
            </button>
            <span className="text-black">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="text-black hover:opacity-60 transition-opacity"
            >
              Syarat &amp; Ketentuan
            </button>
            <span className="text-black">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('ethics')}
              className="text-black hover:opacity-60 transition-opacity"
            >
              Pedoman Adat &amp; Etika
            </button>
            <span className="text-black">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('accessibility')}
              className="text-black hover:opacity-60 transition-opacity"
            >
              Aksesibilitas
            </button>
          </div>

          {/* Smooth Back to Top Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-black text-xs font-bold transition-all duration-200 group shadow-sm"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              aria-label="Kembali ke atas halaman"
            >
              <span className="text-black">Kembali ke Atas</span>
              <ArrowUp
                size={14}
                className="group-hover:-translate-y-0.5 transition-transform duration-200 text-black"
              />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL DIALOG FOR LEGAL & CULTURAL POLICIES (WHITE THEMED, ALL BLACK TEXT)
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-white border border-slate-300 p-6 sm:p-8 text-black shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-black hover:bg-slate-100 transition-colors"
                aria-label="Tutup jendela informasi"
              >
                <X size={20} className="text-black" />
              </button>

              {/* PRIVACY POLICY CONTENT */}
              {activeModal === 'privacy' && (
                <div>
                  <div className="flex items-center gap-2.5 text-black mb-2">
                    <ShieldCheck size={24} className="text-black" />
                    <h3
                      className="text-xl font-bold text-black"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Kebijakan Privasi JogjaKrama
                    </h3>
                  </div>
                  <p className="text-xs text-black mb-4">Pembaruan Terakhir: Oktober 2026</p>
                  <div className="space-y-4 text-xs sm:text-sm text-black leading-relaxed">
                    <p>
                      Platform <strong>JogjaKrama</strong> berkomitmen penuh menjaga kerahasiaan dan keamanan data pengunjung kami. Kami hanya mengumpulkan informasi yang diperlukan untuk meningkatkan pengalaman penjelajahan budaya Anda.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      1. Data Lokasi GPS
                    </h4>
                    <p>
                      Fitur <em>Radar Wisata Terdekat</em> mengakses koordinat perangkat Anda secara lokal di peramban hanya saat Anda memberikan izin. Koordinat tidak dijual atau disebarkan kepada pihak ketiga.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      2. Paspor Budaya &amp; Ulasan Komunitas
                    </h4>
                    <p>
                      Catatan stempel paspor dan ulasan destinasi disimpan secara aman agar Anda dapat meninjau riwayat kunjungan wisata Anda dengan nyaman.
                    </p>
                  </div>
                </div>
              )}

              {/* TERMS OF SERVICE CONTENT */}
              {activeModal === 'terms' && (
                <div>
                  <div className="flex items-center gap-2.5 text-black mb-2">
                    <FileText size={24} className="text-black" />
                    <h3
                      className="text-xl font-bold text-black"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Syarat &amp; Ketentuan Layanan
                    </h3>
                  </div>
                  <p className="text-xs text-black mb-4">Ketentuan Penggunaan Platform JogjaKrama</p>
                  <div className="space-y-4 text-xs sm:text-sm text-black leading-relaxed">
                    <p>
                      Dengan mengakses situs web JogjaKrama, Anda setuju untuk menaati ketentuan hukum yang berlaku di Republik Indonesia serta menghormati pranata adat Daerah Istimewa Yogyakarta.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      1. Hak Cipta Konten
                    </h4>
                    <p>
                      Seluruh teks kurasi sejarah, narasi filosofis, dan materi audio-visual di JogjaKrama dilindungi hak cipta. Pengutipan ilmiah diperbolehkan dengan mencantumkan atribusi resmi ke JogjaKrama.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      2. Akurasi Jadwal &amp; Tiket Wisata
                    </h4>
                    <p>
                      Informasi operasional destinasi budaya (seperti jam buka Keraton dan Museum Ullen Sentalu) merujuk pada ketentuan pengelola resmi terkait dan dapat berubah sesuai upacara adat internal keraton.
                    </p>
                  </div>
                </div>
              )}

              {/* ETHICS & CULTURAL GUIDELINES CONTENT */}
              {activeModal === 'ethics' && (
                <div>
                  <div className="flex items-center gap-2.5 text-black mb-2">
                    <BookOpen size={24} className="text-black" />
                    <h3
                      className="text-xl font-bold text-black"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Pedoman Adat &amp; Tata Krama Budaya
                    </h3>
                  </div>
                  <p className="text-xs text-black mb-4">Etika Luhur Mengunjungi Kawasan Bersejarah Kasultanan</p>
                  <div className="space-y-4 text-xs sm:text-sm text-black leading-relaxed">
                    <p>
                      Yogyakarta menjunjung tinggi falsafah <em>Unggah-Ungguh</em> dan keharmonisan antara manusia, alam, serta sang Pencipta.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      1. Busana di Area Keraton &amp; Makam Imogiri
                    </h4>
                    <p>
                      Wisatawan diwajibkan berpakaian sopan dan tertutup. Untuk ziarah Makam Raja-Raja Imogiri, pengunjung wajib mengenakan busana adat peranakan khas Mataram yang disewakan di lokasi.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      2. Etika Berfoto &amp; Dokumentasi
                    </h4>
                    <p>
                      Dilarang membelakangi Abdi Dalem atau Singgasana dengan sikap tidak sopan. Patuhi tanda larangan kamera pada ruang pusaka sakral tertentu di dalam kompleks Keraton.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      3. Menjaga Kebersihan Kawasan Wisata
                    </h4>
                    <p>
                      Jaga kebersihan di sepanjang Malioboro, Titik Nol, Panggung Krapyak, dan Tugu Pal Putih. Buang sampah pada tempat yang tersedia dan hormati para pedagang lokal.
                    </p>
                  </div>
                </div>
              )}

              {/* ACCESSIBILITY CONTENT */}
              {activeModal === 'accessibility' && (
                <div>
                  <div className="flex items-center gap-2.5 text-black mb-2">
                    <HelpCircle size={24} className="text-black" />
                    <h3
                      className="text-xl font-bold text-black"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Komitmen Aksesibilitas
                    </h3>
                  </div>
                  <p className="text-xs text-black mb-4">Inklusivitas Wisata Ramah Disabilitas</p>
                  <div className="space-y-4 text-xs sm:text-sm text-black leading-relaxed">
                    <p>
                      JogjaKrama terus berupaya memastikan seluruh wisatawan memiliki akses yang setara terhadap keindahan budaya Yogyakarta.
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      1. Fasilitas Ramah Kursi Roda
                    </h4>
                    <p>
                      Sebagian besar kawasan pelataran Keraton, Tamansari (area luar), dan pedestrian Malioboro telah dilengkapi ramp kursi roda dan jalur pemandu tuna netra (guiding block).
                    </p>
                    <h4
                      className="font-bold text-black pt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      2. Aksesibilitas Digital
                    </h4>
                    <p>
                      Antarmuka situs dirancang dengan rasio kontras warna tinggi, teks yang dapat diskalakan, dan label navigasi yang ramah pembaca layar (screen reader).
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Footer Action */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-black text-white hover:opacity-80 font-bold text-xs tracking-wide transition-all shadow-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Tutup Informasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
