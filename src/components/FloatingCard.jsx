import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingCard({ landmark, onSelect, positionStyle, mouseOffset, index = 0 }) {
  // Parallax subtle float offset based on mouse position
  const parallaxX = mouseOffset.x * (landmark.initialTilt > 0 ? 12 : -12);
  const parallaxY = mouseOffset.y * (landmark.initialTilt > 0 ? 12 : -12);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86, y: 45, rotate: landmark.initialTilt }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: landmark.initialTilt,
        x: parallaxX,
        y: parallaxY
      }}
      transition={{ 
        duration: 1.4,
        delay: 0.5 + (index * 0.2), // Slow, graceful staggered float-in
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        scale: 1.06, 
        rotate: landmark.initialTilt > 0 ? 2 : -2,
        zIndex: 40,
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
        transition: { duration: 0.35 }
      }}
      onClick={() => onSelect(landmark)}
      style={{
        position: 'absolute',
        cursor: 'pointer',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22)',
        padding: 0,
        border: 'none',
        background: 'transparent',
        willChange: 'transform, opacity',
        ...positionStyle
      }}
    >
      <img 
        src={landmark.image} 
        alt={landmark.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '24px'
        }}
      />
    </motion.div>
  );
}
