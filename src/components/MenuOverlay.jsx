import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MenuOverlay({ 
  isOpen, 
  onClose, 
  onOpenBooking, 
  onGoHome, 
  onOpenAboutUs, 
  onOpenTours, 
  onOpenBlogs,
  onOpenNearMe,
  onOpenMap,
  onOpenCultureBook
}) {
  const { currentUser, openLogin, logout } = useAuth();

  const menuLinks = [
    { title: "Beranda", action: 'home' },
    { title: "Katalog & Destinasi Jogja", action: 'tours' },
    { title: "Radar GPS Kuliner Jogja", action: 'nearMe' },
    { title: "Peta Budaya & Kuliner DIY", action: 'map' },
    { title: "Paspor Budaya Jogja", action: 'cultureBook' }
  ];

  // =========================================================================
  // MENGGUNAKAN REACT PORTAL
  // createPortal digunakan agar MenuOverlay dirender langsung di <body> HTML.
  // Ini mencegah menu tertahan oleh batasan CSS 'overflow: hidden' pada komponen induk.
  // =========================================================================
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // zIndex 100005 memastikan menu selalu berada di lapis paling atas dari seluruh aplikasi
        <div style={{ position: 'fixed', inset: 0, zIndex: 100005, overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 130, mass: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: '#f3f6f2',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem 4rem 2rem',
              color: '#173f36'
            }}
            className="menu-overlay-panel"
          >
            {/* Top Bar Header (Logo PNG Left, Close Right) */}
            <div className="menu-overlay-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              zIndex: 10
            }}>
              <div 
                className="menu-overlay-brand"
                onClick={() => {
                  onClose();
                  if (onGoHome) onGoHome();
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span
                >
                  JogjaKrama
                </span>
              </div>

              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Tutup menu"
                className="menu-overlay-close"
              >
                <X size={24} strokeWidth={2} />
              </motion.button>
            </div>

            {/* Main Menu Layout */}
            <main className="menu-overlay-content">
              
              {/* Left Side: Bridge Hiker Card + Get In Touch Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                className="menu-overlay-aside"
              >
                <div className="menu-overlay-image">
                  <img 
                    src="/assets/images/jogja_hero_stupa.png" 
                    alt="Warisan budaya Yogyakarta" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div className="menu-overlay-contact">
                  <span>
                    Hubungi Kami
                  </span>
                  <a 
                    href="mailto:info@jogjakrama.id" 
                    className="menu-overlay-email"
                  >
                    info@jogjakrama.id
                  </a>
                </div>

                {/* Account / Membership Status Card */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(23, 63, 54, 0.08)',
                  border: '1px solid rgba(23, 63, 54, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  {currentUser && !currentUser.isGuest ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#173f36' }}>
                            {currentUser.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#52796f' }}>
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          logout();
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e11d48',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#52796f', marginBottom: '0.5rem' }}>
                        Masuk untuk menikmati fitur Wishlist, ulasan, & galeri momen.
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          openLogin({
                            benefitType: 'general',
                            title: 'Masuk ke JogjaKrama',
                            description: 'Akses penuh ke fitur Wishlist, ulasan, dan galeri foto/video.'
                          });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '10px',
                          backgroundColor: '#173f36',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        <LogIn size={14} />
                        <span>Masuk / Daftar Akun</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Side: Links with Dash Hover Effect + Social Icons */}
              <section style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '1.5rem'
              }} className="menu-overlay-navigation" aria-label="Navigasi utama">
                
                {/* Menu Navigation Links */}
                <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem' }}>
                  {menuLinks.map((link, idx) => (
                    <motion.div
                      key={link.title}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.45, delay: 0.3 + (idx * 0.06) }}
                      className="menu-overlay-link-row"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <a
                        href={link.href || '#'}
                        onClick={(e) => {
                          if (link.action === 'booking') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenBooking) onOpenBooking();
                            }, 250);
                          } else if (link.action === 'aboutUs') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenAboutUs) onOpenAboutUs();
                            }, 250);
                          } else if (link.action === 'tours' || link.title === 'Tours') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenTours) onOpenTours();
                            }, 250);
                          } else if (link.action === 'blogs') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenBlogs) onOpenBlogs();
                            }, 250);
                          } else if (link.action === 'cultureBook') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenCultureBook) onOpenCultureBook();
                            }, 250);
                          } else if (link.action === 'map') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenMap) onOpenMap();
                            }, 250);
                          } else if (link.action === 'nearMe') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onOpenNearMe) onOpenNearMe();
                            }, 250);
                          } else if (link.action === 'home' || link.title === 'Beranda' || link.title === 'Home') {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              if (onGoHome) onGoHome();
                              else window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 200);
                          } else {
                            onClose();
                          }
                        }}
                        className="menu-overlay-link"
                      >
                        <span className="menu-overlay-link-number">{String(idx + 1).padStart(2, '0')}</span>
                        <span>{link.title}</span>
                      </a>
                    </motion.div>
                  ))}
                </nav>

                {/* Social Outline Icons (FB, IG, LinkedIn) */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.65 }}
                  className="menu-overlay-socials"
                >
                  <motion.a
                    href="https://www.instagram.com/jogjakrama.official/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, color: '#c65a3a' }}
                    whileTap={{ scale: 0.92 }}
                    className="menu-overlay-social-link"
                    aria-label="Instagram"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </motion.a>
                </motion.div>

              </section>

            </main>

            {/* Bottom Spacer */}
            <div style={{ height: '5px' }} />

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
