import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function CustomPillButton({ 
  label = "Pesan perjalanan", 
  onClick,
  variant = "light"
}) {
  const [isHovered, setIsHovered] = useState(false);

  const isLight = variant === "light";
  const bg = isLight ? '#ffffff' : '#2d180c';
  const textColor = isLight ? '#2d180c' : '#ffffff';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {/* Main Text Pill (Height: 46px - Perfectly Symmetrical) */}
      <div
        style={{
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          background: bg,
          color: textColor,
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '0.92rem',
          letterSpacing: '-0.01em',
          padding: '0 1.5rem',
          borderRadius: '100px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          zIndex: 2,
          transition: 'all 0.15s ease'
        }}
      >
        {label}
      </div>

      {/* Right Connected Circle with Dark Arrow (Fast & Super Responsive!) */}
      <motion.div
        animate={{
          x: isHovered ? 8 : -6,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: 'spring', stiffness: 700, damping: 18 }}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: bg,
          color: textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          zIndex: 1,
          willChange: 'transform'
        }}
      >
        <motion.div
          animate={{ rotate: isHovered ? 45 : 0 }}
          transition={{ duration: 0.08, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowUpRight size={20} strokeWidth={2.4} />
        </motion.div>
      </motion.div>
    </div>
  );
}
