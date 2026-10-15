import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Exact Framer Sl(el, document.documentElement) offset calculation
function getOffsetTop(el) {
  let top = 0;
  let curr = el;
  while (curr && curr !== document.documentElement && curr instanceof HTMLElement) {
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  return top;
}

// Exact Framer Pe(value, inputRange, outputRange) linear clamped interpolation
function interpolateClamped(val, inputRange, outputRange) {
  const len = inputRange.length;
  if (len === 0) return 1;
  if (val <= inputRange[0]) return outputRange[0];
  if (val >= inputRange[len - 1]) return outputRange[len - 1];

  for (let i = 0; i < len - 1; i++) {
    const x0 = inputRange[i];
    const x1 = inputRange[i + 1];
    if (val >= x0 && val <= x1) {
      if (x1 === x0) return outputRange[i + 1];
      const t = (val - x0) / (x1 - x0);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[len - 1];
}

// Exact Framer Cl + jl scroll target scale computation (threshold = 0.5)
function computeFramerTargetScale(scrollY, viewportHeight, targets) {
  const thresholdOffset = 0.5 * viewportHeight;
  const rawStarts = [];
  const inputRange = [];
  const outputRange = [];

  for (let a = targets.length; a >= 0; a--) {
    const item = targets[a];
    if (!item || !item.ref || !item.ref.current) continue;
    const el = item.ref.current;
    const c = getOffsetTop(el) - thresholdOffset;
    const l = el.clientHeight || 0;
    const u = rawStarts[rawStarts.length - 1];
    const d = Math.max(c + l, 0);
    rawStarts.push(c);
    inputRange.unshift(
      Math.max(c, 0),
      u === undefined ? d : Math.min(d, Math.max(u - 1, 0))
    );
    const prevScale = targets[a - 1]?.target ?? 1;
    const currScale = targets[a]?.target ?? 1;
    outputRange.unshift(prevScale, currScale);
  }

  if (inputRange.length === 0) return 1;
  return interpolateClamped(scrollY, inputRange, outputRange);
}

// Exact TravFrick spring for card scroll scaling
const SCROLL_SCALE_SPRING = {
  damping: 69,
  mass: 2.3,
  stiffness: 422,
  restDelta: 0.001
};

// Exact TravFrick hover transitions from bundle
const HOVER_BG_TRANSITION = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.6,
  delay: 0
};

const HOVER_TEXT_TRANSITION = {
  type: 'spring',
  stiffness: 300,
  damping: 50,
  mass: 1,
  delay: 0
};

function DestinationCard({ dest, onOpenBooking }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (dest.onClick) dest.onClick();
        else if (onOpenBooking) onOpenBooking(dest);
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        height: '100%',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Image Wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      >
        <img
          decoding="async"
          src={dest.bgImage}
          alt={dest.title}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectPosition: 'center',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Hover / Always-visible Mobile Gradient Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={HOVER_BG_TRANSITION}
        className="travfrick-card-overlay"
      >
        {/* Hover / Always-visible Mobile Text Container */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={HOVER_TEXT_TRANSITION}
          className="travfrick-card-text"
        >
          <div style={{ width: '100%', position: 'relative' }}>
            <h3
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.15rem, 2.06vw, 2.06rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#ffffff',
                margin: 0
              }}
            >
              {dest.title}
            </h3>
          </div>
          <div style={{ width: '100%', position: 'relative' }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(0.85rem, 1.3vw, 1.4rem)',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'rgb(220, 220, 220)',
                margin: 0
              }}
            >
              {dest.tagline}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function MostLovedDestinations({
  onOpenBooking,
  onOpenJapanDetail,
  onOpenParisDetail,
  onOpenNYDetail,
  onOpenSwissDetail
}) {
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  const rawScale1 = useMotionValue(1);
  const rawScale2 = useMotionValue(1);
  const rawScale3 = useMotionValue(1);
  const rawScale4 = useMotionValue(1);

  const scale1 = useSpring(rawScale1, SCROLL_SCALE_SPRING);
  const scale2 = useSpring(rawScale2, SCROLL_SCALE_SPRING);
  const scale3 = useSpring(rawScale3, SCROLL_SCALE_SPRING);
  const scale4 = useSpring(rawScale4, SCROLL_SCALE_SPRING);

  useEffect(() => {
    const targets1 = [
      { target: 1 },
      { ref: card2Ref, target: 0.7 },
      { ref: card3Ref, target: 0.7 }
    ];
    const targets2 = [
      { target: 1 },
      { ref: card3Ref, target: 0.75 },
      { ref: card4Ref, target: 0.75 }
    ];
    const targets3 = [
      { target: 1 },
      { ref: card4Ref, target: 0.8 }
    ];
    const targets4 = [
      { target: 1 },
      { ref: card4Ref, target: 0.9 }
    ];

    let rafId = null;
    const updateScales = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 900;

      rawScale1.set(computeFramerTargetScale(scrollY, vh, targets1));
      rawScale2.set(computeFramerTargetScale(scrollY, vh, targets2));
      rawScale3.set(computeFramerTargetScale(scrollY, vh, targets3));
      rawScale4.set(computeFramerTargetScale(scrollY, vh, targets4));
    };

    const onScrollOrResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateScales();
        rafId = null;
      });
    };

    updateScales();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [rawScale1, rawScale2, rawScale3, rawScale4]);

  const destinations = [
    {
      id: 'keraton-yogyakarta',
      title: 'Keraton & Tamansari',
      tagline: 'Poros Sumbu Filosofis UNESCO, Istana Air & Kuliner Raja Mataram.',
      bgImage: '/assets/images/jogja_keraton.jpg',
      onClick: onOpenJapanDetail
    },
    {
      id: 'malioboro-tugu',
      title: 'Malioboro & Tugu Jogja',
      tagline: 'Denyut malam kota, Pasar Beringharjo & Kopi Joss arang membara.',
      bgImage: '/assets/images/jogja_tugu.jpg',
      onClick: onOpenSwissDetail
    },
    {
      id: 'kotagede',
      title: 'Warisan Kotagede',
      tagline: 'Ibu kota awal Mataram Islam 1586, lorong Kalang & kerajinan perak.',
      bgImage: '/assets/images/jogja_kotagede.jpg',
      onClick: onOpenParisDetail
    },
    {
      id: 'merapi-kaliurang',
      title: 'Merapi & Kaliurang',
      tagline: 'Poros sakral utara, Museum Ullen Sentalu & Jadah Tempe Mbah Carik.',
      bgImage: '/assets/images/jogja_merapi.jpg',
      onClick: onOpenNYDetail
    }
  ];

  return (
    <section
      id="destinations-section"
      className="travfrick-dest-section"
      data-framer-name="destination_section"
    >
      <div className="travfrick-dest-container" data-framer-name="container">
        {/* Top Header Section */}
        <div className="travfrick-dest-top" data-framer-name="top div">
          <div className="travfrick-dest-header" data-framer-name="Header">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 150, damping: 40, mass: 1, delay: 0.1 }}
              style={{ width: '100%', willChange: 'transform' }}
            >
              <h4
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(0.9rem, 1.25vw, 1.25rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: '#000000',
                  textAlign: 'center',
                  margin: 0
                }}
              >
                Kawasan Ikonik Yogyakarta
              </h4>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 150, damping: 40, mass: 1, delay: 0.3 }}
              style={{ width: '100%', maxWidth: '1000px', willChange: 'transform' }}
            >
              <h2
                style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(1.66rem, 3.2vw, 3.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-2px',
                  lineHeight: 1.2,
                  color: '#000000',
                  textAlign: 'center',
                  margin: 0
                }}
              >
                Jelajahi Poros Budaya & Kuliner Utama Jogja
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 150, damping: 40, mass: 1, delay: 0.5 }}
            style={{ width: '100%', maxWidth: '1185px', willChange: 'transform' }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(0.94rem, 1.5vw, 1.88rem)',
                fontWeight: 400,
                lineHeight: 1.4,
                color: '#666666',
                textAlign: 'center',
                margin: 0
              }}
            >
              Telusuri berbagai destinasi wisata budaya dan kuliner paling populer yang paling dicintai wisatawan saat ini.
            </p>
          </motion.div>
        </div>

        {/* Sticky Cards Stack (.framer-5fsyk0) */}
        <div className="travfrick-dest-bottom" data-framer-name="bottom">
          {/* Card 1 */}
          <motion.div
            id="card1"
            ref={card1Ref}
            className="travfrick-dest-card-sticky"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 150, damping: 60, mass: 1, delay: 0.6 }}
            style={{
              scale: scale1,
              transformPerspective: 1200,
              willChange: 'transform'
            }}
          >
            <DestinationCard dest={destinations[0]} onOpenBooking={onOpenBooking} />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            id="card2"
            ref={card2Ref}
            className="travfrick-dest-card-sticky"
            style={{
              scale: scale2,
              transformPerspective: 1200,
              willChange: 'transform'
            }}
          >
            <DestinationCard dest={destinations[1]} onOpenBooking={onOpenBooking} />
          </motion.div>

          {/* Card 3 */}
          <motion.div
            id="card3"
            ref={card3Ref}
            className="travfrick-dest-card-sticky"
            style={{
              scale: scale3,
              willChange: 'transform'
            }}
          >
            <DestinationCard dest={destinations[2]} onOpenBooking={onOpenBooking} />
          </motion.div>

          {/* Card 4 */}
          <motion.div
            id="card4"
            ref={card4Ref}
            className="travfrick-dest-card-sticky"
            style={{
              scale: scale4,
              willChange: 'transform'
            }}
          >
            <DestinationCard dest={destinations[3]} onOpenBooking={onOpenBooking} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
