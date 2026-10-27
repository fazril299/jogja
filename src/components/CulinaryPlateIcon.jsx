import React from 'react';

/**
 * Ikon Vektor Piring, Garpu & Pisau (Radar Kuliner)
 * Bersih, transparan tanpa kotak raster / garis tepi crop
 */
export default function CulinaryPlateIcon({ className = 'w-6 h-6 text-[#2C221E]', style = {} }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <mask id="culinary-plate-mask-component">
          <rect width="100" height="100" fill="white" />
          {/* Cincin piring transparan */}
          <circle cx="50" cy="50" r="19" stroke="black" strokeWidth="2.6" fill="none" />
          {/* Lubang gagang garpu & pisau transparan */}
          <rect x="20.1" y="75" width="3" height="6.5" rx="1.5" fill="black" />
          <rect x="73.1" y="75" width="3" height="6.5" rx="1.5" fill="black" />
        </mask>
      </defs>

      <g mask="url(#culinary-plate-mask-component)">
        {/* Piring Tengah */}
        <circle cx="50" cy="50" r="28" />

        {/* Garpu Kiri */}
        <path d="M12 16C12 14.9 12.8 14 13.8 14C14.8 14 15.6 14.9 15.6 16V31H17.2V16C17.2 14.9 18 14 19 14C20 14 20.8 14.9 20.8 16V31H22.4V16C22.4 14.9 23.2 14 24.2 14C25.2 14 26 14.9 26 16V31H27.6V16C27.6 14.9 28.4 14 29.4 14C30.4 14 31.2 14.9 31.2 16V33C31.2 38.5 28.2 42.5 24.2 44.2V54C26.5 61 27.5 73 27.5 79.5C27.5 84.5 25.5 87 21.6 87C17.7 87 15.7 84.5 15.7 79.5C15.7 73 16.7 61 19 54V44.2C15 42.5 12 38.5 12 33V16Z" />

        {/* Pisau Kanan */}
        <path d="M74.5 16C74.5 14.8 75.8 14.2 76.8 15.2C80.5 19 84.5 27 83.5 36.5C82.8 42.5 79.8 44.5 77.2 45.2V54C79.5 61 80.5 73 80.5 79.5C80.5 84.5 78.5 87 74.6 87C70.7 87 68.7 84.5 68.7 79.5C68.7 73 69.7 61 72 54V45C71.2 44 71 35 71.5 24C71.8 18.5 73.2 16.5 74.5 16Z" />
      </g>
    </svg>
  );
}
