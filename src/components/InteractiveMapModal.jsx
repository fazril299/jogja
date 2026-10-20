import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Compass, ExternalLink, Sparkles, Layers, Info } from 'lucide-react';

export default function InteractiveMapModal({
  isOpen,
  onClose,
  places = [],
  selectedPlace = null,
  onSelectPlace
}) {
  const [activePlace, setActivePlace] = useState(selectedPlace || places[0]);
  const [mapViewMode, setMapViewMode] = useState('google-embed'); // 'google-embed' | 'svg'
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    if (selectedPlace) {
      setActivePlace(selectedPlace);
    } else if (!activePlace && places.length > 0) {
      setActivePlace(places[0]);
    }
  }, [selectedPlace, places]);

  if (!isOpen) return null;

  const filteredPlaces = places.filter(
    (p) => regionFilter === 'all' || p.region === regionFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[90vh] bg-[#161B22] border border-[#D4AF37]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#EDE8DF]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#0D1117]/85">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Peta Budaya & Kuliner D.I. Yogyakarta</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {places.length} Titik Wilayah DIY
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Jelajahi lokasi cagar budaya dan kuliner otentik di 5 Kabupaten/Kota Yogyakarta.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle view mode */}
            <div className="hidden sm:flex bg-neutral-900 border border-neutral-700 rounded-xl p-1 text-xs">
              <button
                onClick={() => setMapViewMode('svg')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mapViewMode === 'svg'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Peta Penanda DIY
              </button>
              <button
                onClick={() => setMapViewMode('google-embed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  mapViewMode === 'google-embed'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Peta Google Maps
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup peta"
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Region Filter Bar */}
        <div className="px-5 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-neutral-500 font-mono mr-1">KABUPATEN / KOTA:</span>
          {['all', 'kota-jogja', 'sleman', 'bantul', 'gunungkidul', 'kulonprogo'].map((reg) => (
            <button
              key={reg}
              onClick={() => setRegionFilter(reg)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                regionFilter === reg
                  ? 'bg-neutral-700 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {reg === 'all'
                ? 'Seluruh DIY'
                : reg === 'kota-jogja'
                ? 'Kota Yogyakarta'
                : reg === 'sleman'
                ? 'Sleman'
                : reg === 'bantul'
                ? 'Bantul'
                : reg === 'gunungkidul'
                ? 'Gunungkidul'
                : 'Kulon Progo'}
            </button>
          ))}
        </div>

        {/* Main Map Viewport & Details Drawer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Map Display Side */}
          <div className="flex-1 bg-[#0D1117] relative flex items-center justify-center p-4 overflow-hidden">
            {mapViewMode === 'svg' ? (
              <div className="w-full h-full relative rounded-2xl border border-neutral-800/80 bg-gradient-to-b from-[#111827] via-[#0D1117] to-[#070A0E] flex flex-col items-center justify-center p-6">
                {/* Visual Archipelago Grid Graphic */}
                <div className="absolute inset-0 opacity-10 bg-batik-pattern"></div>
                <div className="absolute top-4 left-4 text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>KOORDINAT D.I. YOGYAKARTA: 7°31'LS - 8°13'LS / 110°00'BT - 110°50'BT</span>
                </div>

                {/* Yogyakarta Pins Canvas representation */}
                <div className="relative w-full max-w-4xl h-80 sm:h-96 border border-neutral-800 rounded-2xl bg-neutral-950/70 p-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                    <span className="font-serif text-5xl sm:text-7xl font-black tracking-widest text-[#D4AF37]/20 select-none">
                      D.I. YOGYAKARTA
                    </span>
                  </div>

                  {/* Marker Pinpoints across Yogyakarta Map Canvas */}
                  {filteredPlaces.map((p) => {
                    const minLng = 110.00;
                    const maxLng = 110.85;
                    const minLat = -8.22;
                    const maxLat = -7.52;

                    const pLng = p.coordinates?.lng || 110.36;
                    const pLat = p.coordinates?.lat || -7.80;

                    const leftPct = Math.min(
                      90,
                      Math.max(10, ((pLng - minLng) / (maxLng - minLng)) * 100)
                    );
                    const topPct = Math.min(
                      88,
                      Math.max(12, ((maxLat - pLat) / (maxLat - minLat)) * 100)
                    );

                    const isSelected = activePlace?.id === p.id;

                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePlace(p)}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 focus:outline-none cursor-pointer"
                      >
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border transition-all ${
                            isSelected
                              ? 'bg-[#D4AF37] text-neutral-950 font-bold border-white scale-110 shadow-lg shadow-amber-500/40'
                              : 'bg-neutral-900/90 text-neutral-200 border-neutral-700 hover:border-[#D4AF37] hover:scale-105'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px] font-sans font-semibold whitespace-nowrap hidden sm:inline">
                            {p.name.split(' (')[0]}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rotate-45 -mt-1"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-neutral-400">
                    Pilih penanda pada peta untuk melihat ringkasan budaya dan membaca kisah lengkap.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-neutral-800">
                <iframe
                  title="Peta Google Maps D.I. Yogyakarta"
                  src={
                    activePlace?.chapter07?.mapEmbedUrl ||
                    `https://maps.google.com/maps?q=${activePlace?.coordinates?.lat || -7.8053},${activePlace?.coordinates?.lng || 110.3644}&hl=id&z=13&output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="filter contrast-[1.05]"
                ></iframe>
              </div>
            )}
          </div>

          {/* Place Details Sidebar Card */}
          {activePlace && (
            <div className="w-full lg:w-96 bg-[#161B22] border-t lg:border-t-0 lg:border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto max-h-80 lg:max-h-full">
              <div className="space-y-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-neutral-800">
                  <img
                    src={activePlace.coverImage || activePlace.thumbnail}
                    alt={activePlace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-neutral-950/80 text-amber-300 border border-amber-500/30">
                    {activePlace.province || 'D.I. Yogyakarta'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Compass className="w-5 h-5 text-amber-300" />
                    <span className="text-xs text-neutral-400">{activePlace.regionLabel || 'Yogyakarta'}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">
                    {activePlace.name}
                  </h3>
                  <p className="text-xs text-amber-200/90 italic font-serif mb-3">
                    “{activePlace.subtitle}”
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                    {activePlace.chapter01?.overview || activePlace.subtitle || 'Destinasi cagar budaya dan kuliner Daerah Istimewa Yogyakarta.'}
                  </p>
                </div>

                {/* Badges */}
                {activePlace.badges && activePlace.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activePlace.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 border border-neutral-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-neutral-800 mt-4 space-y-2">
                <button
                  onClick={() => {
                    if (onSelectPlace) onSelectPlace(activePlace);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9E2A2B] to-[#D4AF37] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Baca Kisah ({activePlace.name})</span>
                </button>

                <a
                  href={
                    activePlace.chapter07?.mapsDirectLink ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' Yogyakarta')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
