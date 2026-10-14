import React from 'react';

// Intricate circular mandala medallion SVG matching the Eastward footer emblem (top-left)
function EastwardMandalaMedallion() {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15);
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="JogjaKrama Emblem"
    >
      {/* Outer double border rings */}
      <circle cx="50" cy="50" r="47.5" stroke="rgba(255,255,255,0.88)" strokeWidth="1.2" />
      <circle
        cx="50"
        cy="50"
        r="43.5"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1"
        strokeDasharray="2 2.2"
      />
      <circle cx="50" cy="50" r="39.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1" />

      {/* Outer scalloped petal ring */}
      {rays.map((deg) => (
        <g key={`ray-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <line
            x1="50"
            y1="10.5"
            x2="50"
            y2="17"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.9"
          />
          <circle cx="50" cy="8.2" r="0.9" fill="rgba(255,255,255,0.85)" />
        </g>
      ))}

      {/* Middle lotus / kawung geometric ring */}
      <circle cx="50" cy="50" r="32.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      {petals.map((deg) => (
        <g key={`petal-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <path
            d="M50 17.5 C53.5 23, 53.5 28.5, 50 33.5 C46.5 28.5, 46.5 23, 50 17.5 Z"
            stroke="rgba(255,255,255,0.78)"
            strokeWidth="0.95"
            fill="none"
          />
        </g>
      ))}

      {/* Inner concentric rings & 8-pointed philosophical star */}
      <circle cx="50" cy="50" r="22" stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
      <circle
        cx="50"
        cy="50"
        r="17.5"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.85"
        strokeDasharray="1.8 1.8"
      />
      <path
        d="M50 32 L54 46 L68 50 L54 54 L50 68 L46 54 L32 50 L46 46 Z"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M50 32 L54 46 L68 50 L54 54 L50 68 L46 54 L32 50 L46 46 Z"
        transform="rotate(45 50 50)"
        stroke="rgba(255,255,255,0.68)"
        strokeWidth="0.85"
        fill="none"
      />
      <circle cx="50" cy="50" r="5.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
    </svg>
  );
}

export default function Footer() {
  const navItems = [
    { label: 'JURNAL', href: '#cultural-blogs' },
    { label: 'DESTINASI', href: '#destinations-section' },
    { label: 'RUTE BUDAYA', href: '#packages' },
    { label: 'TENTANG KAMI', href: '#about' }
  ];

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#131021',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* =====================================================================
          BAND 1: TOP BAR — LEFT MANDALA MEDALLION & RIGHT UPPERCASE NAV LINKS
          ===================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2.6rem clamp(2rem, 4.5vw, 4.5rem)'
        }}
      >
        {/* Top-Left Circular Medallion */}
        <a
          href="#home"
          aria-label="Kembali ke atas"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            opacity: 0.92,
            transition: 'opacity 0.25s ease, transform 0.35s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'rotate(12deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.92';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <EastwardMandalaMedallion />
        </a>

        {/* Top-Right Horizontal Uppercase Links */}
        <nav
          aria-label="Navigasi Footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.4rem, 2.6vw, 2.5rem)',
            flexWrap: 'wrap'
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.68')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* FULL-WIDTH HORIZONTAL DIVIDER 1 */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.14)'
        }}
      />

      {/* =====================================================================
          BAND 2: MIDDLE BAR — RIGHT-ALIGNED ADDRESS, PHONE/EMAIL & SOCIAL ICONS
          ===================================================================== */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          padding: '3rem clamp(2rem, 4.5vw, 4.5rem)'
        }}
      >
        {/* Address Lines */}
        <div
          style={{
            fontSize: '0.82rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.88)',
            fontWeight: 400,
            marginBottom: '1.1rem'
          }}
        >
          <div>Kawasan Sumbu Filosofis Keraton Ngayogyakarta, 2-8</div>
          <div>Daerah Istimewa Yogyakarta, Indonesia</div>
        </div>

        {/* Phone & Email Lines */}
        <div
          style={{
            fontSize: '0.82rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.88)',
            fontWeight: 400,
            marginBottom: '1.25rem'
          }}
        >
          <div>+62 274 555 0193</div>
          <div>
            <a
              href="mailto:contact@jogjakrama.id"
              style={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              contact@jogjakrama.id
            </a>
          </div>
        </div>

        {/* 2 Outlined Social Icons (WhatsApp & Instagram) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* WhatsApp / Contact Circle SVG */}
          <a
            href="https://wa.me/622745550193"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp JogjaKrama"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>

          {/* Instagram Circle SVG */}
          <a
            href="https://www.instagram.com/jogjakrama.official/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram JogjaKrama"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9.5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="16.2" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>

      {/* FULL-WIDTH HORIZONTAL DIVIDER 2 */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.14)'
        }}
      />

      {/* =====================================================================
          BAND 3: BOTTOM CENTERED COPYRIGHT & LEGAL LINKS BAR
          ===================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          padding: '1.35rem clamp(1.5rem, 4.5vw, 4.5rem)',
          fontSize: '0.72rem',
          color: 'rgba(255, 255, 255, 0.82)',
          letterSpacing: '0.01em'
        }}
      >
        <span>© 2026 JogjaKrama</span>
        <a
          href="#terms"
          style={{ color: 'inherit', textDecoration: 'none', opacity: 0.85 }}
        >
          Terms
        </a>
        <a
          href="#privacy"
          style={{ color: 'inherit', textDecoration: 'none', opacity: 0.85 }}
        >
          Privacy
        </a>
        <span style={{ opacity: 0.85 }}>Design &amp; Development by JogjaKrama</span>
      </div>
    </footer>
  );
}
