import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Play
} from 'lucide-react';

/* =========================================================================
   1. MODULE VIDEO PLAYER (16:9, Non-autoplay, Permanently Muted, Jojo Cover)
   ========================================================================= */
export function ModuleVideoPlayer({ src, fallbackImage }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch((err) => {
            console.log('Video play interrupted:', err);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!src) {
    return (
      <img
        src={fallbackImage}
        alt="Visual Panduan"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer group/vid select-none overflow-hidden"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={fallbackImage}
        preload="metadata"
        loop
        muted
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          setHasStarted(true);
        }}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />

      {/* Mascot Thumbnail Poster before playing */}
      {!hasStarted && fallbackImage && (
        <img
          src={fallbackImage}
          alt="Thumbnail Maskot Jojo"
          className="absolute inset-0 w-full h-full object-cover z-[5] pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Paused state overlay with Click to Play Button */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/35 hover:bg-black/20 transition-colors flex flex-col items-center justify-center z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 text-[#2D180C] flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover/vid:scale-110 border border-[#D9CEBA]">
            <Play size={24} className="ml-1 fill-[#2D180C] text-[#2D180C]" />
          </div>
          <span className="mt-2.5 px-3 py-1 rounded-full bg-[#2D180C]/80 backdrop-blur-md text-[#FAF6EE] text-[11px] font-semibold tracking-wide border border-[#D9CEBA]/40 shadow-sm">
            Putar Video
          </span>
        </div>
      )}

      {/* Playing state: subtle hover pause hint */}
      {isPlaying && (
        <div className="absolute bottom-3 right-3 opacity-0 group-hover/vid:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-[#2D180C]/80 backdrop-blur-md text-[#FAF6EE] text-[10px] font-medium border border-[#D9CEBA]/30 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Klik untuk jeda</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. UNIFIED ETIQUETTE CARD
   - Judul Modul: font-['Outfit'] font-extrabold text-[#2D180C] (Warna Cokelat Espresso Foto 2)
   - Isi di Dalam Card: Tetap rapi berpalet coksu
   - isReversed = true: Kolom Konten di Kiri, Kolom Video di Kanan (Section 2, 4)
   - isReversed = false: Kolom Video di Kiri, Kolom Konten di Kanan (Section 1, 3)
   ========================================================================= */
export function EtiquetteCard({ guide, isReversed = false }) {
  return (
    <div className="bg-[#FCFBF7] rounded-3xl border border-[#D9CEBA] overflow-hidden shadow-[0_8px_30px_rgba(45,24,12,0.06)] hover:shadow-[0_12px_40px_rgba(45,24,12,0.1)] transition-all p-5 sm:p-7 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Video: Judul Modul Warna Cokelat Foto 2 & Video 16:9 */}
        <div
          className={`lg:col-span-5 space-y-3 ${
            isReversed ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="space-y-1">
            {/* Judul modul: font-extrabold text-[#2D180C] persis seperti di Foto 2 */}
            <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-[#2D180C] m-0 leading-tight tracking-tight">
              {guide.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#2D180C]/75 m-0 font-medium leading-relaxed">
              {guide.subTitle}
            </p>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border-2 border-[#D9CEBA]">
            <ModuleVideoPlayer src={guide.video} fallbackImage={guide.image} />
          </div>
        </div>

        {/* Kolom Konten: Ringkasan, Grid 2x2 Aturan DO/DON'T, Box Tips */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            isReversed ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <p className="text-xs text-[#554E46] leading-relaxed m-0 font-normal">
            {guide.overview}
          </p>

          {/* Grid 2x2 Kartu DO/DON'T */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.rules.map((rule, rIdx) => {
              const isDo = rule.type === 'do';
              return (
                <div
                  key={rule.title || rIdx}
                  className="p-3.5 rounded-2xl border border-[#D9CEBA] bg-[#FAF6EE] text-xs space-y-1.5 hover:border-[#AE5E40]/40 hover:-translate-y-0.5 transition-all shadow-[0_2px_8px_rgba(45,24,12,0.04)]"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {isDo ? (
                      <>
                        <CheckCircle2 size={15} className="text-[#AE5E40] shrink-0" />
                        <span className="text-[#AE5E40] font-extrabold">Dianjurkan (DO):</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={15} className="text-[#AE5E40] shrink-0" />
                        <span className="text-[#AE5E40] font-extrabold">Pantangan (DON'T):</span>
                      </>
                    )}
                  </div>

                  {/* Judul Aturan */}
                  <h4 className="font-extrabold text-xs text-[#2D180C] m-0 leading-snug">
                    {rule.title}
                  </h4>
                  <p className="text-[11px] text-[#554E46] m-0 leading-relaxed font-normal">
                    {rule.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Box Tips Kearifan Lokal Jogja */}
          <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#D9CEBA] border-l-4 border-l-[#AE5E40] text-xs flex items-start gap-2.5 shadow-xs">
            <Lightbulb size={16} className="text-[#AE5E40] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#AE5E40] block text-[11px] font-extrabold mb-0.5">
                Tips Kearifan Lokal Jogja:
              </strong>
              <span className="text-[#554E46] leading-relaxed font-normal">
                {guide.proTip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export varian kompatibilitas
export const WardrobeEtiquetteCard = (props) => <EtiquetteCard {...props} isReversed={false} />;
export const GesturesEtiquetteCard = (props) => <EtiquetteCard {...props} isReversed={true} />;
export const SacredRitualBentoCard = (props) => <EtiquetteCard {...props} isReversed={false} />;
export const AngkringanLoungeCard = (props) => <EtiquetteCard {...props} isReversed={true} />;
