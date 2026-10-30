import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Shield,
  UserPlus,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModalMobile from './mobile/AuthModalMobile';

const PAGE_TRANSITION = {
  type: 'spring',
  stiffness: 420,
  damping: 48,
  mass: 1
};

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    authModalReason,
    closeAuthModal,
    login,
    register,
    loginAsGuest,
    loginWithGoogle,
    loginWithGoogleAccount,
    googleAccounts
  } = useAuth();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Account Chooser States
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isAddingNewGoogle, setIsAddingNewGoogle] = useState(false);

  // Responsive Device Separation Hook (Mobile vs Desktop)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 960;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for Escape when standalone Login Page is active (scroll lock is handled centrally by App.jsx)
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showGooglePicker) {
          setShowGooglePicker(false);
        } else {
          closeAuthModal();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal, showGooglePicker]);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalMode === 'register';

  // Dedicated Mobile UI/UX Render
  if (isMobile) {
    return (
      <AnimatePresence>
        <AuthModalMobile
          isRegister={isRegister}
          setAuthModalMode={setAuthModalMode}
          authModalReason={authModalReason}
          closeAuthModal={closeAuthModal}
          login={login}
          register={register}
          loginWithGoogle={loginWithGoogle}
          loginWithGoogleAccount={loginWithGoogleAccount}
          googleAccounts={googleAccounts}
        />
      </AnimatePresence>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (!isRegister) {
        await login(email, password);
      } else {
        const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
        if (!fullName) {
          throw new Error('Silakan masukkan nama lengkap Anda.');
        }
        await register(fullName, email, password);
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      // 1. Buka popup resmi Google OAuth 2.0 (Google Identity Services)
      await loginWithGoogle();
    } catch (err) {
      console.warn('[Google Sign-In]', err);
      if (err.message === 'GOOGLE_CLIENT_ID_MISSING') {
        setShowGooglePicker(true);
      } else if (!err.message?.includes('dibatalkan')) {
        setErrorMessage(err.message || 'Gagal masuk dengan akun Google.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectGoogleAccount = async (account) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await loginWithGoogleAccount(account);
      setShowGooglePicker(false);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Masukkan email Google yang valid (@gmail.com).');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await loginWithGoogleAccount({
        email: cleanEmail,
        name: customGoogleName.trim() || cleanEmail.split('@')[0]
      });
      setShowGooglePicker(false);
      setCustomGoogleEmail('');
      setCustomGoogleName('');
      setIsAddingNewGoogle(false);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionTag = () => {
    if (isRegister) return '02 / Daftar Akun';
    switch (authModalReason?.benefitType) {
      case 'wishlist':
        return '01 / Paspor & Wishlist Budaya';
      case 'media':
        return '01 / Galeri Komunitas';
      case 'review':
        return '01 / Ulasan Wisatawan';
      default:
        return '01 / Masuk Akun';
    }
  };

  const getHeadingTitle = () => {
    if (isRegister) return 'Buat akun baru';
    if (authModalReason?.title && authModalReason.title !== 'Masuk ke Akun Anda') {
      return authModalReason.title;
    }
    return 'Selamat datang';
  };

  const getSubtitleText = () => {
    if (isRegister) {
      return 'Daftarkan akun Anda untuk menyimpan destinasi favorit dan paspor budaya.';
    }
    return (
      authModalReason?.description ||
      'Akses penuh ke fitur Wishlist destinasi, ulasan pengunjung, serta galeri momen budaya Yogyakarta.'
    );
  };

  const inputUnderlineStyle = (fieldName) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid ${focusedField === fieldName ? '#c99b52' : '#e4e4e7'}`,
    padding: '7px 0',
    fontSize: '0.88rem',
    fontWeight: 400,
    color: '#18181b',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.73rem',
    fontWeight: 500,
    color: '#52525b',
    marginBottom: '2px',
    letterSpacing: '-0.01em'
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-page-heading"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={PAGE_TRANSITION}
        className="auth-standalone-page"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100020,
          width: '100vw',
          height: '100vh',
          height: '100dvh',
          backgroundColor: '#f8f8f7',
          color: '#18181b',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <style>{`
          .auth-standalone-page {
            position: fixed;
            inset: 0;
            z-index: 100020;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            background-color: #f8f8f7;
            color: #18181b;
            font-family: 'Plus Jakarta Sans', sans-serif;
            overflow: hidden !important;
          }

          .auth-standalone-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            height: 100vh;
            height: 100dvh;
            box-sizing: border-box;
            overflow: hidden;
          }

          .auth-standalone-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
            height: 100dvh;
            box-sizing: border-box;
            padding: clamp(10px, 1.8vh, 18px) clamp(24px, 4.5vw, 64px);
            overflow: hidden !important;
          }

          .auth-standalone-right {
            height: 100vh;
            height: 100dvh;
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: relative;
            background-color: transparent;
          }

          .auth-artwork-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: relative;
            background-color: transparent;
            overflow: hidden;
          }

          .auth-standalone-input::placeholder {
            color: #d4d4d8;
            font-weight: 400;
          }

          .auth-center-content {
            width: 100%;
            max-width: 440px;
            margin-top: auto;
            margin-bottom: auto;
            padding: clamp(4px, 1vh, 12px) 0;
          }

          @media (max-width: 960px) {
            .auth-standalone-page {
              overflow-y: auto !important;
              overflow-x: hidden !important;
            }
            .auth-standalone-grid {
              display: block !important;
              height: auto !important;
              min-height: 100% !important;
            }
            .auth-standalone-left {
              display: flex !important;
              height: auto !important;
              min-height: 100vh !important;
              min-height: 100dvh !important;
              padding: 24px 20px 48px 20px !important;
              overflow-y: visible !important;
            }
            .auth-center-content {
              margin-top: 16px !important;
              margin-bottom: 28px !important;
              padding: 10px 0 24px 0 !important;
            }
            .auth-standalone-right {
              display: none !important;
            }
          }



          .auth-google-picker-card {
            max-height: 88vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .auth-google-picker-card::-webkit-scrollbar {
            width: 5px;
          }
          .auth-google-picker-card::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 999px;
          }
        `}</style>

        <div className="auth-standalone-grid">
          {/* =================================================================
              LEFT COLUMN — CLEAN EDITORIAL FORM PANEL (1:1 REFERENCE LAYOUT)
              ================================================================= */}
          <div className="auth-standalone-left">
            {/* Top Bar inside Left Column: Brand Icon (Left) + Action Buttons (Right) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                flexShrink: 0
              }}
            >
              {/* Brand Mark (Click to return to Beranda) */}
              <button
                type="button"
                onClick={closeAuthModal}
                title="Kembali ke Beranda"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img
                  src="/assets/icons/icon_culture.svg"
                  alt="Hamemayu"
                  style={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </button>

              {/* Top-Right Compact Controls: [X] [Autofill] [Demo] [Daftar Akun / Masuk] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 1. Close / Back Square Button */}
                <button
                  type="button"
                  onClick={closeAuthModal}
                  title="Tutup & Kembali ke Beranda (Esc)"
                  aria-label="Tutup halaman login"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid #d4d4d8',
                    backgroundColor: 'transparent',
                    color: '#18181b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.25s ease, border-color 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#18181b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d4d4d8';
                  }}
                >
                  <X size={15} strokeWidth={2} />
                </button>

                {/* Mode Switch Pill Button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = isRegister ? 'login' : 'register';
                    setAuthModalMode(nextMode);
                    window.location.hash = nextMode === 'register' ? '#/daftar' : '#/masuk';
                    setErrorMessage('');
                  }}
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1px solid #d4d4d8',
                    backgroundColor: 'transparent',
                    color: '#18181b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181b';
                    e.currentTarget.style.borderColor = '#18181b';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d4d4d8';
                    e.currentTarget.style.color = '#18181b';
                  }}
                >
                  {isRegister ? 'Masuk Akun' : 'Daftar Akun'}
                </button>
              </div>
            </div>

            {/* Center Editorial Content & Underline Form */}
            <div className="auth-center-content">
              {/* Small Section Number / Tag ("01 / Masuk Akun") */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  color: '#a1a1aa',
                  marginBottom: '14px',
                  letterSpacing: '-0.01em'
                }}
              >
                {getSectionTag()}
              </div>

              {/* Large Clean Heading ("Selamat datang" / "Buat akun baru") */}
              <h1
                id="auth-page-heading"
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
                  fontSize: 'clamp(1.75rem, 2.6vw, 2.35rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#18181b',
                  margin: '0 0 8px 0'
                }}
              >
                {getHeadingTitle()}
              </h1>

              {/* Subtitle Description */}
              <p
                style={{
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  color: '#52525b',
                  margin: '0 0 14px 0',
                  maxWidth: '430px',
                  fontWeight: 400
                }}
              >
                {getSubtitleText()}
              </p>

              {/* Error Alert */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="alert"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      marginBottom: '22px'
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tombol Resmi Lanjutkan dengan Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e4e4e7',
                  color: '#18181b',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  marginBottom: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                    e.currentTarget.style.borderColor = '#18181b';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e4e4e7';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>

              {/* Pemisah "atau gunakan email" */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
                <span style={{ fontSize: '0.74rem', color: '#a1a1aa', fontWeight: 500 }}>
                  atau gunakan email
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e4e4e7' }} />
              </div>

              {/* Minimalist Bottom-Border Form */}
              <form onSubmit={handleSubmit}>
                {isRegister && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div>
                      <label htmlFor="auth-first-name" style={labelStyle}>
                        Nama depan
                      </label>
                      <input
                        id="auth-first-name"
                        className="auth-standalone-input"
                        type="text"
                        required
                        placeholder="e.g. Fazriel"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        style={inputUnderlineStyle('firstName')}
                      />
                    </div>

                    <div>
                      <label htmlFor="auth-last-name" style={labelStyle}>
                        Nama belakang
                      </label>
                      <input
                        id="auth-last-name"
                        className="auth-standalone-input"
                        type="text"
                        placeholder="e.g. Muliyael"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        style={inputUnderlineStyle('lastName')}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <label htmlFor="auth-email" style={labelStyle}>
                    Email
                  </label>
                  <input
                    id="auth-email"
                    className="auth-standalone-input"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    style={inputUnderlineStyle('email')}
                  />
                </div>

                <div style={{ marginBottom: '16px', position: 'relative' }}>
                  <label htmlFor="auth-password" style={labelStyle}>
                    Kata sandi
                  </label>
                  <input
                    id="auth-password"
                    className="auth-standalone-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    required
                    placeholder={
                      isRegister
                        ? 'Minimal 6 karakter untuk keamanan akun..'
                        : 'Masukkan kata sandi akun Anda..'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputUnderlineStyle('password'),
                      paddingRight: '34px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Action Buttons Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '10px',
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      transition:
                        'background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#c99b52';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#18181b';
                    }}
                  >
                    {isSubmitting
                      ? 'Memproses...'
                      : isRegister
                      ? 'Buat akun sekarang'
                      : 'Masuk ke akun'}
                  </button>

                  {/* Switch between Login and Register Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = isRegister ? 'login' : 'register';
                      setAuthModalMode(nextMode);
                      window.location.hash = nextMode === 'register' ? '#/daftar' : '#/masuk';
                      setErrorMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#52525b',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '8px 4px',
                      textDecoration: 'underline',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c99b52';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#52525b';
                    }}
                  >
                    {isRegister
                      ? 'Sudah punya akun? Masuk di sini'
                      : 'Belum punya akun? Buat akun sekarang'}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Subtle Spacer to balance vertical centering */}
            
          </div>

          {/* =================================================================
              RIGHT COLUMN — FULL-HEIGHT ROUNDED ARTWORK PANEL WITH PIXEL MATRIX
              ================================================================= */}
          <div className="auth-standalone-right">
            <div className="auth-artwork-wrapper">
              {/* Maskot Jojo Melambai Setengah Badan (Seamless Background) */}
              <img
                src="/assets/images/mascot_login_waving.webp"
                alt="Jojo Maskot Yogyakarta"
                style={{
                  maxHeight: '88vh',
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '94%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  display: 'block',
                  filter: 'drop-shadow(0 20px 35px rgba(45, 30, 20, 0.08))',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* =================================================================
            GOOGLE ACCOUNT CHOOSER MODAL (OFFICIAL GOOGLE OAUTH EXPERIENCE)
            ================================================================= */}
        <AnimatePresence>
          {showGooglePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100030,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
              onClick={() => setShowGooglePicker(false)}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="auth-google-picker-card"
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid #e2e8f0',
                  color: '#1f2937',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowGooglePicker(false)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  <X size={16} />
                </button>

                {/* Google Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                    {isAddingNewGoogle ? 'Masuk dengan Akun Google' : 'Pilih akun'}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                    untuk melanjutkan ke <strong style={{ color: '#8E5A3C' }}>Hamemayu</strong>
                  </p>
                </div>

                {!isAddingNewGoogle ? (
                  <>
                    {/* List of Google Accounts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {googleAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => handleSelectGoogleAccount(acc)}
                          disabled={isSubmitting}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '12px 14px',
                            borderRadius: '14px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            width: '100%'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }}
                        >
                          <img
                            src={acc.avatar}
                            alt={acc.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1.5px solid #e2e8f0'
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>
                                {acc.name}
                              </span>
                              {acc.role === 'admin' && (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    backgroundColor: '#fef3c7',
                                    color: '#92400e',
                                    border: '1px solid #fde68a',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Shield size={10} /> Admin
                                </span>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                color: '#6b7280',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {acc.email}
                            </span>
                          </div>
                        </button>
                      ))}

                      {/* Add another Google account button */}
                      <button
                        type="button"
                        onClick={() => setIsAddingNewGoogle(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1px dashed #cbd5e1',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          color: '#475569'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#94a3b8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569'
                          }}
                        >
                          <UserPlus size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                            Gunakan akun Google lain
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            Masuk dengan email Gmail Anda
                          </div>
                        </div>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4 }}>
                      Untuk melanjutkan, Google akan memverifikasi profil dan alamat email Anda secara aman dengan Hamemayu.
                    </div>
                  </>
                ) : (
                  /* Form Input Akun Google Baru */
                  <form onSubmit={handleCustomGoogleSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        Alamat Email Google (@gmail.com)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nama.anda@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Gabriel Muliyael"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewGoogle(false)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#1a73e8',
                          color: '#ffffff',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          cursor: isSubmitting ? 'wait' : 'pointer'
                        }}
                      >
                        {isSubmitting ? 'Memverifikasi...' : 'Lanjutkan'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
