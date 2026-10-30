import React from 'react';

/**
 * Official GoFood Brand Badge Component with Verified Merchant Rating
 * Sesuai Brand Guidelines Resmi GoFood / Gojek:
 * - Warna Primer GoFood Red: #EE2737
 * - Icon Piring Merah Bulat dengan Siluet Garpu & Sendok Putih Resmi
 * - Typography modern sans-serif bold "gofood"
 * - Official Rating Bintang Kuning & Jumlah Ulasan Riil Terverifikasi
 */
export default function GoFoodBadge({
  size = 'sm',
  className = '',
  showExternalIcon = true,
  rating,
  reviews,
  tier,
  showRating = true
}) {
  const isSm = size === 'sm';
  const isXs = size === 'xs';
  const isLg = size === 'md' || size === 'lg';

  const hasRating = Boolean(rating && showRating);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-full transition-all shadow-xs select-none ${
        isXs
          ? 'px-2 py-0.5 text-[9px] bg-[#EE2737] text-white'
          : isSm
          ? 'px-2.5 py-1 text-[11px] bg-[#EE2737] hover:bg-[#D61E2D] text-white'
          : 'px-3.5 py-1.5 text-xs bg-[#EE2737] hover:bg-[#D61E2D] text-white'
      } ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(238, 39, 55, 0.28)'
      }}
    >
      {/* Official GoFood Red Disc + Fork & Spoon Silhouette */}
      <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-2.5 h-2.5"
        >
          {/* Sendok & Garpu Merah di atas lingkar putih */}
          <path
            d="M9 4V10C9 10.55 8.55 11 8 11C7.45 11 7 10.55 7 10V4C7 3.45 7.45 3 8 3C8.55 3 9 3.45 9 4ZM6 4V8C6 8.55 5.55 9 5 9C4.45 9 4 8.55 4 8V4C4 3.45 4.45 3 5 3C5.55 3 6 3.45 6 4ZM10 4V8C10 8.55 9.55 9 9 9C8.45 9 8 8.55 8 8V4C8 3.45 8.45 3 9 3C9.55 3 10 3.45 10 4ZM7 11V20C7 20.55 6.55 21 6 21C5.45 21 5 20.55 5 20V11C4.4 10.6 4 10 4 9.3V4H10V9.3C10 10 9.6 10.6 9 11V20C9 20.55 8.55 21 8 21C7.45 21 7 20.55 7 20Z"
            fill="#EE2737"
          />
          <path
            d="M16 3C14.34 3 13 4.79 13 7C13 8.78 13.9 10.28 15.17 10.77V20C15.17 20.55 15.62 21 16.17 21C16.72 21 17.17 20.55 17.17 20V10.77C18.44 10.28 19.34 8.78 19.34 7C19.34 4.79 18 3 16 3Z"
            fill="#EE2737"
          />
        </svg>
      </span>

      {/* Official Typography "gofood" */}
      <span className="font-extrabold tracking-tight font-sans leading-none flex items-center">
        <span>go</span>
        <span className="opacity-95">food</span>
      </span>

      {/* Official Verified Rating Badge */}
      {hasRating && (
        <span className="inline-flex items-center gap-1 pl-1 border-l border-white/30 text-white font-semibold">
          <svg
            viewBox="0 0 24 24"
            fill="#FACC15"
            className="w-3 h-3 shrink-0 text-amber-300"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="leading-none text-[11px] font-black">{Number(rating).toFixed(1)}</span>
          {reviews && (
            <span className="text-[9.5px] opacity-85 font-normal leading-none hidden sm:inline">
              ({reviews})
            </span>
          )}
        </span>
      )}

      {/* Tier Label (Optional, e.g. Super Partner) */}
      {tier && isLg && (
        <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-medium leading-none tracking-normal">
          {tier}
        </span>
      )}

      {showExternalIcon && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-2.5 h-2.5 opacity-90 ml-0.5 shrink-0"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </span>
  );
}
