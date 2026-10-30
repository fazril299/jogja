import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { PassageEngine } from './PassageEngine.js';

export const PassageGallery = forwardRef(function PassageGallery({
  slides = [],
  layout = 'ring',
  scrollLength = 5,
  imageSize = 0.5,
  spacing = 0.05,
  scatter = 0,
  radius = 0.025,
  cardAspect = 0.68,
  rows = 1,
  background = 'rgb(10, 10, 10)',
  fog = 0.57,
  reflection = 0.16,
  vignette = 0.29,
  grain = 0.015,
  motion = 0,
  smoothing = 0.6,
  tilt = 0.35,
  intro = true,
  className = '',
  style = {},
  onEngineReady
}, ref) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    next: () => {
      if (engineRef.current?.nextSlide) {
        engineRef.current.nextSlide();
      }
    },
    prev: () => {
      if (engineRef.current?.prevSlide) {
        engineRef.current.prevSlide();
      }
    },
    scrollBy: (delta) => {
      if (engineRef.current?.scrollBy) {
        engineRef.current.scrollBy(delta);
      }
    },
    focusImage: (idx) => {
      if (engineRef.current?.focusImage) {
        engineRef.current.focusImage(idx);
      }
    },
    getCurrentIndex: () => {
      return engineRef.current?.currentIndex?.() ?? 0;
    },
    getEngine: () => engineRef.current
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let engine = null;
    try {
      engine = new PassageEngine();
      engineRef.current = engine;

      const opts = {
        layout,
        scrollLength,
        imageSize,
        spacing,
        scatter,
        radius,
        cardAspect,
        rows,
        background,
        fog,
        reflection,
        vignette,
        grain,
        motion,
        smoothing,
        tilt,
        intro
      };

      engine.mount(container, opts);
      if (onEngineReady) {
        onEngineReady(engine);
      }
    } catch (err) {
      console.error('[PassageGallery] Mount failed:', err);
    }

    // Direct wheel scroll rotation support on gallery canvas
    const handleWheel = (e) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : (e.shiftKey ? e.deltaY : e.deltaY * 0.4);
      if (Math.abs(delta) > 1.5 && engineRef.current) {
        e.preventDefault();
        engineRef.current.scrollBy(delta * 0.0006);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (engine) {
        try {
          engine.destroy();
        } catch (e) {
          console.warn('[PassageGallery] Destroy error:', e);
        }
        engineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || engine.status !== 'running') return;

    engine.update({
      layout,
      scrollLength,
      imageSize,
      spacing,
      scatter,
      radius,
      cardAspect,
      rows,
      background,
      fog,
      reflection,
      vignette,
      grain,
      motion,
      smoothing,
      tilt,
      intro
    });
  }, [
    layout,
    scrollLength,
    imageSize,
    spacing,
    scatter,
    radius,
    cardAspect,
    rows,
    background,
    fog,
    reflection,
    vignette,
    grain,
    motion,
    smoothing,
    tilt,
    intro
  ]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      data-fx-pin="true"
      className={`relative w-full h-full cursor-grab active:cursor-grabbing outline-none select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: background,
        overflow: 'hidden',
        touchAction: 'pan-y pinch-zoom',
        ...style
      }}
    >
      {/* Hidden DOM images container for WebGL texture sync & SEO/accessibility */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
          pointerEvents: 'none',
          opacity: 0
        }}
      >
        {slides.map((slide, idx) => (
          <div key={slide.id || idx}>
            <img
              src={slide.src}
              alt={slide.alt || `Slide ${idx + 1}`}
              crossOrigin="anonymous"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
