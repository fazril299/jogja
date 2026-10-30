import React, { useState } from 'react';
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
  if (!isOpen) return null;

  const [activeTabId, setActiveTabId] = useState(ETIQUETTE_TABS[0].id);
  const activeGuide =
    CULTURAL_ETIQUETTE_GUIDE.find((g) => g.id === activeTabId) ||
    CULTURAL_ETIQUETTE_GUIDE[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-[#FAF6EE] overflow-y-auto text-[#2D180C]"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* FLOATING CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 w-9 h-9 rounded-full bg-[#FAF6EE]/90 hover:bg-[#FCFBF7] backdrop-blur-md border border-[#D9CEBA] text-[#2D180C] flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95"
          aria-label="Tutup dan Kembali ke Beranda"
        >
          <X size={18} />
        </button>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black text-white pt-24 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-8 border-b border-neutral-800">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img
              src="/assets/images/jogja_keraton.jpg"
              alt="Keraton Yogyakarta"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] m-0 max-w-3xl leading-snug">
              Panduan Cara Berbudaya dengan Benar Yogyakarta
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl m-0 leading-relaxed font-normal">
              Memahami nilai luhur andhap asor, tata busana adat sakral, etika menghadiri upacara hajad dalem, pantangan motif batik keraton, hingga adab santun menikmati kuliner angkringan lokal.
            </p>
          </div>
        </section>

        {/* =========================================================================
            PANDUAN CARA BERBUDAYA DENGAN BENAR (DO'S & DON'TS DENGAN TAB NAVIGASI)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* TAB SECTION: 4 MODUL PANDUAN BUDAYA */}
          <div className="space-y-6">
            {/* 4 Tab Buttons */}
            <div className="bg-[#FCFBF7] p-2 rounded-2xl border border-[#D9CEBA] shadow-2xs">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {ETIQUETTE_TABS.map((tab) => {
                  const isActive = activeTabId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-center border ${
                        isActive
                          ? 'bg-[#2D180C] text-white border-[#2D180C] shadow-sm ring-1 ring-[#2D180C]'
                          : 'bg-white hover:bg-neutral-50/80 text-[#554E46] border-[#D9CEBA]/60 hover:border-[#8C532B]/50'
                      }`}
                    >
                      <h4
                        className={`text-xs sm:text-sm font-bold font-['Outfit'] m-0 truncate leading-snug ${
                          isActive ? 'text-white' : 'text-[#2D180C]'
                        }`}
                      >
                        {tab.shortTitle}
                      </h4>
                      <p
                        className={`text-[11px] m-0 truncate mt-1 ${
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
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
