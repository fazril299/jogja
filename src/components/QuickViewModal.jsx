import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

export default function QuickViewModal({ landmark, onClose, onBookLandmark, onViewFullItinerary }) {
  if (!landmark) return null;
  const hasFullPage = ['japan', 'paris', 'ny', 'newyork', 'switzerland'].includes(landmark.id.toLowerCase());

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 15, 26, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(0.75rem, 3vw, 1.5rem)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            maxHeight: 'min(90vh, 720px)',
            overflowY: 'auto',
            background: 'rgba(10, 28, 44, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.2rem, 3.5vw, 2rem)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
            color: '#ffffff'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup ringkasan destinasi"
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          {/* High-res Image Cover */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(180px, 28vh, 280px)',
            borderRadius: '18px',
            overflow: 'hidden',
            marginBottom: '1.25rem'
          }}>
            <img 
              src={landmark.image} 
              alt={landmark.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,28,44,0.9) 0%, transparent 60%)'
            }} />
            <span style={{
              position: 'absolute',
              bottom: '0.85rem',
              left: '1rem',
              background: 'rgba(0, 240, 209, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #00f0d1',
              color: '#00f0d1',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.3rem 0.85rem',
              borderRadius: '20px'
            }}>
              {landmark.tag}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00f0d1', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              <MapPin size={16} /> {landmark.location}
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', fontWeight: 800, marginBottom: '0.6rem' }}>
              {landmark.title}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {landmark.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Informasi kunjungan</span>
                <a href={landmark.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#00f0d1', fontSize: '0.86rem', fontWeight: 700, textDecoration: 'none' }}>
                  {landmark.sourceName} <ExternalLink size={14} />
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  onBookLandmark(landmark);
                }}
                className="w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #00f0d1 0%, #02c39a 100%)',
                  color: '#031926',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 22px rgba(0, 240, 209, 0.3)'
                }}
              >
                Lihat Detail Destinasi <ArrowRight size={17} />
              </motion.button>
            </div>

            {hasFullPage && onViewFullItinerary && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onViewFullItinerary(landmark);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '0.85rem',
                  gap: '0.5rem'
                }}
              >
                Lihat Rencana Perjalanan <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
