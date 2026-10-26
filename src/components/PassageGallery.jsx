import React, { useEffect, useRef } from 'react';
import { PassageEngine } from './PassageEngine.js';

export function PassageGallery({
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
  style = {}
}) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

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
    } catch (err) {
      console.error('[PassageGallery] Mount failed:', err);
    }

    return () => {
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
      data-fx-pin="true"
      className={`relative w-full ${className}`}
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: background,
        overflow: 'hidden',
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
}
