import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CULTURAL_ETIQUETTE_GUIDE } from '../data/culturalEventsData';
import { EtiquetteCard } from './EtiquetteCardVariations';
import KamusBudayaOnline from './KamusBudayaOnline';

const ETIQUETTE_TABS = [
  {
    id: 'etiquette-clothing-keraton',
    modulNum: 'Modul 01',
    category: 'Tata Busana & Adab',
    shortTitle: 'Adab Berbusana Keraton',
    hint: 'Pakaian, abdi dalem & batik larangan'
  },
  {
    id: 'etiquette-gestures-attitude',
    modulNum: 'Modul 02',
    category: 'Unggah-Ungguh & Sikap',
    shortTitle: 'Sikap & Bahasa Tubuh',
    hint: 'Lampah dodok & adab bertamu'
  },
  {
    id: 'etiquette-sacred-rituals',
    modulNum: 'Modul 03',
    category: 'Prosesi Adat Sakral',
    shortTitle: 'Upacara & Ritual Sakral',
    hint: 'Grebeg, labuhan & jamasan pusaka'
  },
  {
    id: 'etiquette-culinary-angkringan',
    modulNum: 'Modul 04',
    category: 'Kuliner Tradisi',
    shortTitle: 'Tata Santap Tradisi',
    hint: 'Lincak angkringan & lesehan'
  }
];

export default function JurnalBudayaPage({ isOpen, onClose }) {
  const [activeTabId, setActiveTabId] = useState(ETIQUETTE_TABS[0].id);

  // Kunci scroll halaman beranda saat modal jurnal budaya terbuka
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.classList.add('modal-scroll-lock');
    document.body.classList.add('modal-scroll-lock');
    return () => {
      document.documentElement.classList.remove('modal-scroll-lock');
      document.body.classList.remove('modal-scroll-lock');
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const activeGuide =
    CULTURAL_ETIQUETTE_GUIDE.find((g) => g.id === activeTabId) ||
    CULTURAL_ETIQUETTE_GUIDE[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-[#FAF6EE] overflow-y-auto pb-24 sm:pb-16 text-[#2D180C]"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* FLOATING CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="fixed top-3.5 right-3.5 sm:top-6 sm:right-8 z-50 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF6EE]/90 hover:bg-[#FCFBF7] backdrop-blur-md border border-[#D9CEBA] text-[#2D180C] flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95"
          aria-label="Tutup dan Kembali ke Beranda"
        >
          <X size={17} />
        </button>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black text-white pt-16 sm:pt-28 pb-6 sm:pb-12 px-3.5 sm:px-8 border-b border-neutral-800">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img
              src="/assets/images/jogja_keraton.jpg"
              alt="Keraton Yogyakarta"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto space-y-1.5 sm:space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              🏛️ Jurnal Budaya & Panduan Adat
            </span>
            <h2 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] m-0 max-w-3xl leading-snug">
              Panduan Cara Berbudaya dengan Benar Yogyakarta
            </h2>

            <p className="text-[11px] sm:text-sm text-neutral-300 max-w-3xl m-0 leading-relaxed font-normal">
              Memahami nilai luhur andhap asor, tata busana adat sakral, etika menghadiri upacara hajad dalem, pantangan motif batik keraton, hingga adab santun menikmati kuliner angkringan lokal.
            </p>
          </div>
        </section>

        {/* =========================================================================
            PANDUAN CARA BERBUDAYA DENGAN BENAR (DO'S & DON'TS DENGAN TAB NAVIGASI)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-3 sm:px-8 pt-4 pb-8 sm:py-8 space-y-4 sm:space-y-8">
          {/* TAB SECTION: 4 MODUL PANDUAN BUDAYA */}
          <div className="space-y-3.5 sm:space-y-6">
            {/* 4 Tab Buttons */}
            <div className="bg-[#FCFBF7] p-1.5 sm:p-2 rounded-2xl border border-[#D9CEBA] shadow-2xs">
              {/* Desktop: Grid 4 Kolom | Mobile: Swipeable Horizontal Strip (snap-x) */}
              <div className="flex lg:grid lg:grid-cols-4 gap-2 overflow-x-auto snap-x no-scrollbar pb-0.5 sm:pb-0">
                {ETIQUETTE_TABS.map((tab) => {
                  const isActive = activeTabId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className={`min-w-[145px] sm:min-w-0 flex-1 p-2.5 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-center border snap-start shrink-0 active:scale-[0.98] ${
                        isActive
                          ? 'bg-[#2D180C] text-white border-[#2D180C] shadow-xs ring-1 ring-[#2D180C]'
                          : 'bg-white hover:bg-neutral-50/80 text-[#554E46] border-[#D9CEBA]/60 hover:border-[#8C532B]/50'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold tracking-tight block ${
                          isActive ? 'text-amber-300' : 'text-[#8C532B]'
                        }`}
                      >
                        {tab.modulNum}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold font-['Outfit'] m-0 truncate leading-snug mt-0.5 ${
                          isActive ? 'text-white' : 'text-[#2D180C]'
                        }`}
                      >
                        {tab.shortTitle}
                      </h4>
                      <p
                        className={`text-[10px] sm:text-[11px] m-0 truncate mt-0.5 ${
                          isActive ? 'text-neutral-300' : 'text-[#786B5E]'
                        }`}
                      >
                        {tab.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Modul Card Display with Smooth Fade & Motion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGuide.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <EtiquetteCard guide={activeGuide} isReversed={false} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* KAMUS BASA JAWA ONLINE (Tepat di Bawah Modul Tab Panduan Budaya) */}
          <KamusBudayaOnline />

          {/* Spacer ekstra agar konten paling bawah tidak tertutup navbar mobile */}
          <div className="h-8 sm:h-0" />
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
