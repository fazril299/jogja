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
          padding: '1.5rem'
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
            background: 'rgba(10, 28, 44, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '30px',
            padding: '2rem',
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
              top: '1.5rem',
              right: '1.5rem',
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
            height: '280px',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '1.5rem'
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
              bottom: '1rem',
              left: '1.2rem',
              background: 'rgba(0, 240, 209, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #00f0d1',
              color: '#00f0d1',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.3rem 0.9rem',
              borderRadius: '20px'
            }}>
              {landmark.tag}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00f0d1', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              <MapPin size={16} /> {landmark.location}
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.8rem' }}>
              {landmark.title}
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.65', marginBottom: '1.8rem' }}>
              {landmark.description}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>Informasi kunjungan</span>
                        <a href={landmark.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#00f0d1', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}>
                          {landmark.sourceName} <ExternalLink size={15} />
                        </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onClose();
                  onBookLandmark(landmark);
                }}
                style={{
                  background: 'linear-gradient(135deg, #00f0d1 0%, #02c39a 100%)',
                  color: '#031926',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 25px rgba(0, 240, 209, 0.35)'
                }}
              >
                        Lihat Detail Destinasi <ArrowRight size={18} />
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
                  fontSize: '0.95rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1rem',
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
