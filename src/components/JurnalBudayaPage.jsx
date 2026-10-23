import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  X,
  ShieldCheck
} from 'lucide-react';
import {
  CULTURAL_ETIQUETTE_GUIDE,
  CULTURAL_DICTIONARY,
  CULTURAL_JOURNALS
} from '../data/culturalEventsData';

export default function JurnalBudayaPage({ isOpen, _onClose }) {
  const [activeMainTab, setActiveMainTab] = useState('panduan'); // 'panduan' | 'artikel'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEtiquetteCategory, setSelectedEtiquetteCategory] = useState('Semua');

  if (!isOpen) return null;

  const etiquetteCategories = [
    'Semua',
    'Tata Busana & Adab',
    'Unggah-Ungguh & Sikap',
    'Prosesi Adat Sakral',
    'Kuliner & Pergaulan'
  ];

  const filteredEtiquette = CULTURAL_ETIQUETTE_GUIDE.filter((item) => {
    const matchCat =
      selectedEtiquetteCategory === 'Semua' || item.category === selectedEtiquetteCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subTitle.toLowerCase().includes(q) ||
      item.overview.toLowerCase().includes(q) ||
      item.rules.some(
        (r) =>
          r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)
      );
    return matchCat && matchQuery;
  });

  const filteredJournals = CULTURAL_JOURNALS.filter((jr) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      jr.title.toLowerCase().includes(q) ||
      jr.excerpt.toLowerCase().includes(q) ||
      jr.category.toLowerCase().includes(q) ||
      (jr.tags && jr.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-[#F8F9FA] overflow-y-auto text-black"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
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
              Panduan Cara Berbudaya dengan Benar &amp; Esai Warisan Yogyakarta
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl m-0 leading-relaxed font-normal">
              Memahami nilai luhur andhap asor, tata busana adat sakral, etika menghadiri upacara hajad dalem, pantangan motif batik keraton, hingga adab santun menikmati kuliner angkringan lokal.
            </p>

            {/* Tab Pill Switcher (Panduan vs Artikel) */}
            <div className="pt-3 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveMainTab('panduan')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'panduan'
                    ? 'bg-white text-black shadow-sm font-extrabold'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15'
                }`}
              >
                <ShieldCheck size={16} />
                <span>Panduan Berbudaya Benar (Do's &amp; Don'ts)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMainTab('artikel')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'artikel'
                    ? 'bg-white text-black shadow-sm font-extrabold'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15'
                }`}
              >
                <BookOpen size={16} />
                <span>Koleksi Esai &amp; Jurnal Resmi ({CULTURAL_JOURNALS.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: PANDUAN CARA BERBUDAYA DENGAN BENAR (DO'S & DON'TS DENGAN FOTO)
            ========================================================================= */}
        {activeMainTab === 'panduan' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari panduan busana, sikap, makan, atau pantangan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs sm:text-sm text-black focus:outline-none focus:border-black transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X size={14} className="text-black" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {etiquetteCategories.map((cat) => {
                  const isSel = selectedEtiquetteCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedEtiquetteCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSel
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Detailed Illustrated Guides */}
            <div className="space-y-8">
              {filteredEtiquette.map((guide, idx) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Left Column: Photo Asset & Context */}
                    <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-neutral-900 overflow-hidden flex flex-col justify-end p-6 text-white">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                      <div className="relative z-10 space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-black/80 text-white text-[10px] font-extrabold tracking-wider uppercase border border-white/20">
                          Modul {idx + 1} • {guide.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white m-0 leading-tight font-['Outfit']">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-neutral-300 m-0 font-medium leading-relaxed">
                          {guide.subTitle}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Do's, Don'ts & Practical Tips */}
                    <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed m-0 border-b border-neutral-100 pb-4 font-normal">
                          {guide.overview}
                        </p>

                        {/* Rules Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {guide.rules.map((rule, rIdx) => {
                            const isDo = rule.type === 'do';
                            return (
                              <div
                                key={rIdx}
                                className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs space-y-1.5"
                              >
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  {isDo ? (
                                    <>
                                      <CheckCircle2 size={15} className="text-black shrink-0" />
                                      <span className="text-black font-extrabold">Dianjurkan (DO):</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={15} className="text-black shrink-0" />
                                      <span className="text-black font-extrabold">Pantangan (DON'T):</span>
                                    </>
                                  )}
                                </div>
                                <h4 className="font-extrabold text-xs text-black m-0 leading-snug">
                                  {rule.title}
                                </h4>
                                <p className="text-[11px] text-neutral-700 m-0 leading-relaxed font-normal">
                                  {rule.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pro Tip Box */}
                      <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs flex items-start gap-2.5">
                        <Lightbulb size={16} className="text-black shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-black block text-[11px] font-extrabold mb-0.5">
                            Tips Kearifan Lokal Jogja:
                          </strong>
                          <span className="text-neutral-700 leading-relaxed font-normal">
                            {guide.proTip}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Kamus Saku Unggah-Ungguh Basa Jawa untuk Wisatawan */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-100 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-black text-[10px] font-extrabold">
                    <Sparkles size={11} className="text-black" />
                    <span>Kamus Saku Wisatawan</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-black m-0 font-['Outfit']">
                    Unggah-Ungguh Basa Jawa Krama Inggil untuk Sehari-hari
                  </h3>
                  <p className="text-xs text-neutral-600 m-0 font-normal">
                    Frasa santun yang membuat warga lokal, penjual, dan Abdi Dalem sangat menghargai kunjungan Anda:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CULTURAL_DICTIONARY.map((dict) => (
                  <div
                    key={dict.phrase}
                    className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1 hover:border-black transition-colors"
                  >
                    <div className="text-sm font-black text-black font-['Outfit'] flex items-center gap-1.5">
                      <BookOpen size={13} className="text-black shrink-0" />
                      <span>{dict.phrase}</span>
                    </div>
                    <div className="text-xs font-bold text-black">
                      Artinya: {dict.meaning}
                    </div>
                    <p className="text-[11px] text-neutral-600 m-0 leading-relaxed pt-1 border-t border-neutral-200 font-normal">
                      {dict.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2: KOLEKSI ARTIKEL JURNAL & ESAI BUDAYA RESMI
            ========================================================================= */}
        {activeMainTab === 'artikel' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
            {/* Search Bar for Journals */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel, filosofi, kotagede, atau sumbu filosofis..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs sm:text-sm text-black focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <span className="text-xs text-neutral-600 hidden sm:inline font-medium">
                Menampilkan <strong className="text-black font-bold">{filteredJournals.length}</strong> esai kurasi
              </span>
            </div>

            {/* Journal Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJournals.map((jr) => (
                <div
                  key={jr.id}
                  className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with overlay tags */}
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={jr.image}
                        alt={jr.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                        {jr.category}
                      </span>

                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-black text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Clock size={11} className="text-black" />
                        <span>{jr.readTime}</span>
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="text-base font-extrabold text-black m-0 leading-snug group-hover:text-neutral-700 transition-colors">
                        {jr.title}
                      </h3>

                      <p className="text-xs text-neutral-700 leading-relaxed m-0 font-normal">
                        {jr.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {jr.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-medium text-black"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-neutral-500 font-medium">
                      <span className="font-bold text-black">{jr.author}</span>
                      <span className="block text-[10px]">{jr.date}</span>
                    </div>

                    <a
                      href={jr.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors no-underline cursor-pointer"
                    >
                      <span>Baca Lengkap</span>
                      <ExternalLink size={12} className="text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredJournals.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-neutral-300 p-6 space-y-2">
                <BookOpen size={36} className="mx-auto text-neutral-400" />
                <h3 className="text-base font-extrabold text-black m-0">
                  Tidak ada artikel yang cocok dengan pencarian
                </h3>
                <p className="text-xs text-neutral-600 m-0">
                  Coba gunakan kata kunci lain seperti "Sumbu", "Kotagede", atau "Kuliner".
                </p>
              </div>
            )}
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
