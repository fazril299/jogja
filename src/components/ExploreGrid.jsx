import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, BookOpen, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';
import { useAuth } from '../context/AuthContext';

export default function ExploreGrid({ places = [], regions = [], onSelectPlace }) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite, hasStamp, cultureBook } = useCultureBook();
  const { requireAuth } = useAuth();

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchRegion = selectedRegion === 'all' || place.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.province.toLowerCase().includes(q) ||
        place.subtitle.toLowerCase().includes(q) ||
        (place.badges && place.badges.some((b) => b.toLowerCase().includes(q)));
      return matchRegion && matchSearch;
    });
  }, [places, selectedRegion, searchQuery]);

  return (
    <section id="explore-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Katalog Cerita Nusantara</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Pilih Destinasi, Kenali <span className="text-[#D4AF37]">Kisahnya</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Setiap tempat bukan sekadar titik koordinat geografis, melainkan bab buku yang menyimpan
            falsafah hidup, tradisi, serta masyarakat yang menjaga warisan budaya Nusantara.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
        {/* Region Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedRegion === region.id
                  ? 'bg-[#D4AF37] text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari destinasi, tradisi, atau wilayah..."
            aria-label="Cari destinasi budaya"
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-neutral-900/90 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 text-base mb-2">Tidak ada destinasi budaya yang sesuai dengan pencarian Anda.</p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-400 hover:underline"
          >
            Hapus Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPlaces.map((place, index) => {
            const stamped = hasStamp(place.id);
            const fav = isFavorite(place.id);
            const readList = cultureBook.readChapters[place.id] || [];
            const readCount = readList.length;

            return (
              <motion.article
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative bg-[#161B22]/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-amber-950/20"
              >
                {/* Image Cover Container */}
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={place.coverImage}
                    alt={place.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/40 to-transparent"></div>

                  {/* Badges on top */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-950/80 backdrop-blur-md text-amber-300 border border-amber-500/20">
                      {place.province}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requireAuth(() => toggleFavorite(place.id), {
                          benefitType: 'wishlist',
                          title: 'Simpan ke Wishlist Budaya',
                          description: `Masuk ke akun Anda untuk menyimpan ${place.name} ke dalam Wishlist pribadi Anda.`
                        });
                      }}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        fav
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
                      }`}
                      title={fav ? 'Hapus dari daftar favorit' : 'Simpan ke daftar favorit (Benefit)'}
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Stamp status tag */}
                  {stamped && (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cap paspor terkumpul</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Cultural Badges pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {place.badges?.slice(0, 2).map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                      {place.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                      {place.subtitle}
                    </p>
                  </div>

                  {/* Reading Progress and Trigger */}
                  <div className="pt-4 border-t border-neutral-800/80">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                      <span className="font-mono text-[11px]">
                        Progres membaca: {readCount} dari 7 bab
                      </span>
                      <span className="text-amber-400/90 font-medium text-[11px]">
                        {readCount === 7 ? 'Selesai dibaca' : `${Math.round((readCount / 7) * 100)}%`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-4">
                      <div
                        className="bg-gradient-to-r from-[#9E2A2B] to-[#D4AF37] h-full transition-all duration-500"
                        style={{ width: `${Math.round((readCount / 7) * 100)}%` }}
                      ></div>
                    </div>

                    <button
                      onClick={() => onSelectPlace(place)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-850 hover:from-[#9E2A2B] hover:to-[#D4AF37] text-white text-xs sm:text-sm font-semibold border border-neutral-700/60 hover:border-transparent transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <BookOpen className="w-4 h-4 text-[#D4AF37] group-hover:text-white" />
                      <span>Baca Kisah Lengkap (7 Bab)</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
