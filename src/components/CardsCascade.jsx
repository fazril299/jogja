import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

const CASCADING_CARDS = [
  {
    id: 'mataram',
    title: 'Budaya & Sejarah Mataram',
    description:
      'Keraton Ngayogyakarta, Istana Air Tamansari, Candi Prambanan, dan Sumbu Filosofis warisan adiluhung Mataram.',
    buttonLabel: 'Jelajahi Sejarah',
    background: '#E6D2C1', // Signature Coksu Si Jojo (Surjan & Blangkon)
    textColor: '#2D180C',
    tilt: -2.2,
    yOffset: 0,
    targetPlace: 'keraton-yogyakarta'
  },
  {
    id: 'alam',
    title: 'Wisata Alam & Hiburan',
    description:
      'Kesejukan lereng Merapi Kaliurang, Gumuk Pasir Parangtritis, hingga panorama tebing karst eksotis Gunungkidul.',
    buttonLabel: 'Lihat Alam',
    background: '#9EAC8D', // Earthy Sage Olive (Daun Sirih & Alam Merapi)
    textColor: '#1A2416',
    tilt: -0.6,
    yOffset: 3,
    targetPlace: 'merapi-kaliurang'
  },
  {
    id: 'kuliner',
    title: 'Kuliner Legendaris',
    description:
      'Gudeg kayu bakar Wijilan, aroma Sate Klathak Jejeran, kehangatan Brongkos pusaka, hingga racikan kopi arang legendaris.',
    buttonLabel: 'Eksplorasi Rasa',
    background: '#C8795E', // Warm Terracotta (Dapur Rempah & Gerabah Kasongan)
    textColor: '#241008',
    tilt: 0.6,
    yOffset: 6,
    isNearMe: true
  },
  {
    id: 'kampung',
    title: 'Kampung Wisata & Kriya',
    description:
      'Lorong perak Kotagede, sentra gerabah tanah liat Kasongan, tradisi batik tulis Giriloyo, dan keramahan kampung budaya.',
    buttonLabel: 'Kunjungi Kampung',
    background: '#D8BB88', // Heritage Ochre (Bros Emas Keraton Si Jojo)
    textColor: '#261C08',
    tilt: 2.2,
    yOffset: 8,
    targetPlace: 'kotagede'
  }
];

function CascadeCardItem({
  card,
  index,
  total,
  progress,
  responsive,
  onAction
}) {
  const {
    cardRadius = 16,
    fanAmount = 3.6,
    rowYOffset = 42,
    sequenceStart = 0.04,
    sequenceEnd = 0.72,
    entryDistance = 680,
    entryScale = 0.88,
    buttonBackground = 'rgb(17, 17, 17)',
    buttonText = 'rgb(247, 243, 235)'
  } = responsive.config;

  const {
    cardWidth,
    cardHeight,
    gap,
    overlap,
    titleSize,
    bodySize,
    scaleFactor
  } = responsive;

  // Staggered calculation matching cards-cascade.framer.website exactly
  const step = Math.max(0.08, (sequenceEnd - sequenceStart) / Math.max(1, total));
  const cardStart = sequenceStart + step * index;
  const cardEnd = Math.min(sequenceEnd, cardStart + step * 0.74);

  const centerIndex = (total - 1) / 2;
  const cardSpacing = cardWidth * Math.max(0.05, 1 - overlap) + gap;
  const targetX = (index - centerIndex) * cardSpacing;

  let normIndex = 0;
  if (centerIndex !== 0) {
    normIndex = (index - centerIndex) / centerIndex;
  }

  const targetRotate = normIndex * fanAmount + (card.tilt || 0);
  const startY = -entryDistance * Math.max(0.68, scaleFactor);
  const startX = targetX * 0.12;
  const targetY = rowYOffset + (card.yOffset || 0) * scaleFactor;

  // Scroll driven transforms with spring physics
  const x = useTransform(progress, [cardStart, cardEnd], [startX, targetX]);
  const y = useTransform(progress, [cardStart, cardEnd], [startY, targetY]);
  const scale = useTransform(progress, [cardStart, cardEnd], [entryScale, 1]);
  const rotate = useTransform(progress, [cardStart, cardEnd], [targetRotate * 0.25, targetRotate]);
  const opacity = useTransform(
    progress,
    [Math.max(0, cardStart - 0.025), cardStart, cardEnd],
    [0, 0, 1]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: cardWidth,
        height: cardHeight,
        x,
        y,
        scale,
        rotate,
        opacity,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: index + 1,
        transformOrigin: 'center bottom',
        willChange: 'transform, opacity'
      }}
      className="select-none"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: `${28 * scaleFactor}px`,
          borderRadius: `${cardRadius * scaleFactor}px`,
          background: card.background,
          color: card.textColor,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: `${18 * scaleFactor}px`,
              color: card.textColor,
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: `${bodySize}px`,
              lineHeight: 1.5,
              opacity: 0.82,
              whiteSpace: 'pre-wrap',
              color: card.textColor,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
            }}
          >
            {card.description}
          </p>
        </div>

        <motion.button
          onClick={() => onAction(card)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          style={{
            display: 'inline-flex',
            width: 'fit-content',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: `${42 * scaleFactor}px`,
            padding: `0 ${16 * scaleFactor}px`,
            borderRadius: '999px',
            background: buttonBackground,
            color: buttonText,
            border: 'none',
            fontSize: `${12 * scaleFactor}px`,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {card.buttonLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CardsCascade({ onOpenBooking, onSelectPlaceById, onOpenNearMe }) {
  const containerRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.35
  });

  const handleCardAction = (card) => {
    if (card.isNearMe && onOpenNearMe) {
      onOpenNearMe();
    } else if (card.targetPlace && onSelectPlaceById) {
      onSelectPlaceById(card.targetPlace);
    } else if (onOpenBooking) {
      onOpenBooking();
    }
  };

  // Adaptive responsive layout matching cards-cascade.framer.website
  const cardCount = CASCADING_CARDS.length;
  let currentOverlap = 0.34;
  if (windowWidth <= 640) {
    currentOverlap = 0.64; // Compact stacked fan on phones
  } else if (windowWidth <= 1024) {
    currentOverlap = 0.46; // Medium overlap on tablets
  }

  const baseCardWidth = 260;
  const baseCardHeight = 356;
  const baseGap = 0;
  const sidePadding = 24;

  const colWidth = baseCardWidth * Math.max(0.05, 1 - currentOverlap) + baseGap;
  const totalDeckWidth = baseCardWidth + Math.max(0, cardCount - 1) * colWidth;
  const availableWidth = Math.max(280, windowWidth - sidePadding * 2);
  const pRatio = availableWidth / Math.max(1, totalDeckWidth);
  const scaleFactor = Math.min(1.12, Math.max(0.58, pRatio));

  const responsive = {
    cardWidth: baseCardWidth * scaleFactor,
    cardHeight: baseCardHeight * scaleFactor,
    gap: baseGap * scaleFactor,
    overlap: currentOverlap,
    titleSize: 24 * scaleFactor,
    bodySize: 13.5 * scaleFactor,
    scaleFactor,
    config: {
      cardRadius: 16,
      fanAmount: 3.4,
      rowYOffset: 48,
      sequenceStart: 0.05,
      sequenceEnd: 0.72,
      entryDistance: 640,
      entryScale: 0.88,
      buttonBackground: 'rgb(17, 17, 17)',
      buttonText: 'rgb(247, 243, 235)'
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{
        height: '380vh',
        background: 'rgb(245, 241, 232)' // Exact Framer warm canvas background
      }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Header Section (Persis posisi & tipografi Framer Our Services) */}
        <div
          className="absolute z-50 text-center px-4 w-full max-w-[720px] pointer-events-none select-none"
          style={{ top: '64px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D9CEBA] text-[#333] text-xs font-medium shadow-2xs mb-3.5 pointer-events-auto">
            <LayoutGrid className="w-3.5 h-3.5 text-neutral-600" />
            <span>Jelajahi Berdasarkan Minat</span>
          </div>

          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl sm:text-4xl md:text-[50px] font-bold text-[#111111] tracking-[-0.025em] leading-[1.08] m-0"
          >
            Empat Dimensi Keistimewaan Yogyakarta
          </h2>

          <p
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            className="mt-3 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#6E6A64] max-w-xl mx-auto font-normal"
          >
            Kurasi ragam keistimewaan Daerah Istimewa Yogyakarta dari pusat keraton hingga bentang alam sakral.
          </p>
        </div>

        {/* 4 Cascading Deck Cards */}
        {CASCADING_CARDS.map((card, index) => (
          <CascadeCardItem
            key={card.id}
            card={card}
            index={index}
            total={CASCADING_CARDS.length}
            progress={smoothProgress}
            responsive={responsive}
            onAction={handleCardAction}
          />
        ))}
      </div>
    </section>
  );
}
