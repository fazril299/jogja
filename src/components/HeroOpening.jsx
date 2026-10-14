import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation, ArrowDown, Sparkles, MapPin } from 'lucide-react';

const MANIFESTO_LINES = [
  'Di setiap tempat, ada cerita.',
  'Ada masyarakat yang merawatnya.',
  'Ada kebudayaan yang terus bertumbuh.',
  'Ada sejarah yang mengakar kuat.'
];

export default function HeroOpening({ onStartExplore, onUseLocation, places = [] }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % MANIFESTO_LINES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-neutral-800/80">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2000&auto=format&fit=crop"
          alt="Lanskap Nusantara"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[1px]"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/85 to-[#0D1117]/60"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D1117]/60 to-[#0D1117]"></div>
      </div>

      {/* Decorative Traditional Batik Gold Motif Overlay */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 backdrop-blur-md mb-8 text-xs sm:text-sm font-medium text-amber-200"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Platform Cerita Budaya Interaktif</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
          <span className="text-neutral-400 font-mono">Lebih dari Peta dan Informasi Wisata</span>
        </motion.div>

        {/* Opening Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-base sm:text-xl lg:text-2xl font-serif text-[#D5C497] tracking-wide mb-3 italic"
        >
          “Indonesia bukan hanya tentang keindahan tempat.”
        </motion.p>

        {/* Dynamic Storytelling Transition Lines */}
        <div className="h-20 sm:h-28 flex items-center justify-center my-2">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentLineIndex}
              initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -25, filter: 'blur(4px)' }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.15]"
            >
              <span className="gold-gradient-text">
                {MANIFESTO_LINES[currentLineIndex]}
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subtitle context */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 font-normal leading-relaxed mt-4 mb-10"
        >
          Menjelajahi tempat-tempat terkenal Nusantara sekaligus menyingkap denyut kehidupan
          masyarakat, kearifan adat, dan cerita luhur yang hidup jauh sebelum tempat tersebut dikenal dunia.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <button
            onClick={onStartExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#9E2A2B] via-[#C85A32] to-[#D4AF37] text-white font-semibold text-sm sm:text-base shadow-xl shadow-amber-950/40 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 group"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Jelajahi Destinasi</span>
          </button>

          <button
            onClick={onUseLocation}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#161B22]/90 border border-[#D4AF37]/30 text-amber-200 hover:text-white hover:bg-neutral-800/90 font-medium text-sm sm:text-base backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>📍 Di Sekitar Anda</span>
          </button>
        </motion.div>

        {/* Iconic Places Ribbon Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 pt-8 border-t border-neutral-800/70"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-mono mb-4">
            <span>Destinasi dengan Kisah Budaya:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {places.map((place) => (
              <span
                key={place.id}
                className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:border-[#D4AF37]/50 hover:text-white transition-colors cursor-pointer"
                onClick={onStartExplore}
              >
                {place.passportStamp?.symbol} {place.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Gulir untuk melihat lebih lanjut</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
      </div>
    </section>
  );
}
