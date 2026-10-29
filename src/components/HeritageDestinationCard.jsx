import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Sparkles, Clock, ArrowRight, Heart } from 'lucide-react';

export default function HeritageDestinationCard({
  id,
  title,
  subtitle,
  region,
  image,
  badge,
  priceInfo,
  hours,
  isFavorite = false,
  onWishlistToggle,
  onClick,
  actionLabel = 'Buka Panduan'
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className="group relative cursor-pointer bg-white rounded-[26px] p-3 sm:p-3.5 border border-[#EDE5DA] shadow-[0_10px_30px_-6px_rgba(45,24,12,0.08),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(140,83,43,0.22),0_8px_20px_rgba(45,24,12,0.06)] hover:border-[#8c532b]/40 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Inner Photo Canvas (Framed Passe-Partout Art Window) */}
      <div className="relative w-full h-[240px] sm:h-[250px] rounded-[20px] overflow-hidden bg-neutral-900 shadow-inner">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Top-Left Category Badge (Title Case, No Capslock) */}
        {badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#2D180C] shadow-sm border border-white/70">
              <Sparkles size={11} className="text-[#8c532b]" />
              <span>{badge}</span>
            </span>
          </div>
        )}

        {/* Top-Right Heart Wishlist Button */}
        {onWishlistToggle && (
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle();
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm active:scale-90 ${
                isFavorite
                  ? 'bg-rose-600 text-white border border-rose-500 shadow-rose-900/30'
                  : 'bg-black/35 hover:bg-white text-white hover:text-rose-600 border border-white/30'
              }`}
              title={isFavorite ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist (Benefit Member)'}
            >
              <Heart size={15} fill={isFavorite ? '#ffffff' : 'none'} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Bottom-Left Price Badge */}
        {priceInfo && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black/60 backdrop-blur-md text-amber-100 border border-white/10 tracking-normal">
              {priceInfo}
            </span>
          </div>
        )}

        {/* Bottom-Right Region Pill */}
        {region && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#2D180C]/80 backdrop-blur-md text-amber-200/95 border border-white/10 tracking-normal">
              <MapPin size={11} className="text-amber-300" />
              <span>{region}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body (Curated Dossier Details) */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Subheader: Region & Rating */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c532b]">
              <MapPin size={12} className="text-[#8c532b] shrink-0" />
              <span className="truncate">{region || 'D.I. Yogyakarta'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600 shrink-0">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>4.9</span>
            </div>
          </div>

          {/* Destination Title (font-serif Playfair, NO capslock, Title Case) */}
          <h3 className="font-['Outfit'] text-xl sm:text-[22px] font-bold text-[#2D180C] leading-snug group-hover:text-[#8c532b] transition-colors line-clamp-1 m-0">
            {title}
          </h3>

          {/* Atmospheric Subtitle */}
          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 m-0 font-normal">
            {subtitle || 'Eksplorasi nilai historis, arsitektur luhur, dan kearifan lokal Yogyakarta.'}
          </p>
        </div>

        {/* Divider & Action Footer */}
        <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-normal truncate">
            <Clock size={12} className="text-[#8c532b]/80 shrink-0" />
            <span className="truncate">{hours || 'Buka Setiap Hari'}</span>
          </div>

          <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF6EE] group-hover:bg-[#8c532b] text-[#8c532b] group-hover:text-white border border-[#E8DFC9] group-hover:border-[#8c532b] transition-all duration-200 shrink-0 shadow-2xs">
            <span>{actionLabel}</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

