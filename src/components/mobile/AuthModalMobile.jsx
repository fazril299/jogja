import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function AuthModalMobile({
  isRegister,
  setAuthModalMode,
  authModalReason,
  closeAuthModal,
  login,
  register,
  loginWithGoogle,
  loginWithGoogleAccount,
  googleAccounts = []
}) {
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

  const toggleMode = (targetMode) => {
    setAuthModalMode(targetMode);
    window.location.hash = targetMode === 'register' ? '#/daftar' : '#/masuk';
    setErrorMessage('');
  };

  const getSectionTag = () => {
    if (isRegister) return '01 / Registrasi Akun';
    switch (authModalReason?.benefitType) {
      case 'bookmark':
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
      await loginWithGoogle();
    } catch (err) {
      console.warn('[Google Sign-In Mobile]', err);
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
    const cleanName = customGoogleName.trim();
    if (!cleanEmail || !cleanName) {
      setErrorMessage('Silakan isi nama dan alamat email.');
      return;
    }
    const customAcc = {
      id: 'custom-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=2C221E&color=FAF8F5&size=200&bold=true`,
      provider: 'google'
    };
    try {
      await loginWithGoogleAccount(customAcc);
      setShowGooglePicker(false);
      setCustomGoogleEmail('');
      setCustomGoogleName('');
      setIsAddingNewGoogle(false);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal masuk dengan akun Google.');
    }
  };

  return (
    <div
      className="auth-mobile-page"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100020,
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        backgroundColor: '#FAFAF9',
        color: '#18181B',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <style>{`
        .auth-mobile-page {
          -webkit-overflow-scrolling: touch;
        }
        @media (max-height: 560px) {
          .auth-mobile-page {
            overflow-y: auto !important;
          }
          .auth-mobile-main {
            height: auto !important;
            min-height: calc(100dvh - 52px) !important;
            overflow: visible !important;
          }
        }
      `}</style>
      {/* 1. TOP MOBILE HEADER BAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          height: '52px',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(250, 250, 249, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E4E4E7',
          flexShrink: 0
        }}
      >
        {/* Brand Icon & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/assets/icons/icon_culture.svg"
            alt="Hamemayu"
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
          <span
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '0.98rem',
              fontWeight: 800,
              color: '#2C221E',
              letterSpacing: '-0.02em'
            }}
          >
            Hamemayu
          </span>
        </div>

        {/* Right Actions: Segmented Toggle & Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '999px',
              backgroundColor: '#EAEAE7',
              border: '1px solid #E2E2DE'
            }}
          >
            <button
              type="button"
              onClick={() => toggleMode('login')}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
                color: !isRegister ? '#18181B' : '#71717A',
                fontSize: '0.72rem',
                fontWeight: !isRegister ? 700 : 500,
                cursor: 'pointer',
                boxShadow: !isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => toggleMode('register')}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
                color: isRegister ? '#18181B' : '#71717A',
                fontSize: '0.72rem',
                fontWeight: isRegister ? 700 : 500,
                cursor: 'pointer',
                boxShadow: isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Daftar
            </button>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Tutup"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid #E4E4E7',
              backgroundColor: '#FFFFFF',
              color: '#18181B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* 2. MAIN MOBILE CONTENT: 1 FULL PAGE LAYOUT */}
      <main
        className="auth-mobile-main"
        style={{
          flex: 1,
          height: 'calc(100dvh - 52px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 20px clamp(16px, 3vh, 24px) 20px',
          maxWidth: '440px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%'
          }}
        >
          {/* TOP SECTION: Mascot, Greetings, Google, and Form Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Compact Mascot Callout Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 12px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAE4DC',
                marginBottom: '12px',
                boxShadow: '0 2px 6px rgba(44, 34, 30, 0.03)'
              }}
            >
              <img
                src="/assets/images/mascot_login.jpg"
                alt="Jojo Pemandu Budaya"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#C99B52', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Jojo • Pemandu Budaya
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C221E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Sugeng Rawuh di Hamemayu
                </div>
              </div>
            </div>

            {/* Section Tag */}
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#A1A1AA',
                marginBottom: '2px',
                letterSpacing: '-0.01em'
              }}
            >
              {getSectionTag()}
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: '#18181B',
                margin: '0 0 3px 0'
              }}
            >
              {getHeadingTitle()}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.78rem',
                lineHeight: 1.38,
                color: '#71717A',
                margin: '0 0 12px 0'
              }}
            >
              {getSubtitleText()}
            </p>

            {/* Error Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    fontSize: '0.74rem',
                    fontWeight: 500,
                    marginBottom: '10px'
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E4E4E7',
                color: '#18181B',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'wait' : 'pointer',
                marginBottom: '10px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E4E4E7' }} />
              <span style={{ fontSize: '0.7rem', color: '#A1A1AA', fontWeight: 500 }}>
                atau gunakan email
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E4E4E7' }} />
            </div>

            {/* Form Inputs */}
            {isRegister && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '8px'
                }}
              >
                <div>
                  <label
                    htmlFor="mobile-first-name"
                    style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#52525B', marginBottom: '1px' }}
                  >
                    Nama depan
                  </label>
                  <input
                    id="mobile-first-name"
                    type="text"
                    required
                    placeholder="Fazriel"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1.5px solid ${focusedField === 'firstName' ? '#C99B52' : '#E4E4E7'}`,
                      padding: '5px 0',
                      fontSize: '0.84rem',
                      color: '#18181B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile-last-name"
                    style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#52525B', marginBottom: '1px' }}
                  >
                    Nama belakang
                  </label>
                  <input
                    id="mobile-last-name"
                    type="text"
                    placeholder="Muliyael"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1.5px solid ${focusedField === 'lastName' ? '#C99B52' : '#E4E4E7'}`,
                      padding: '5px 0',
                      fontSize: '0.84rem',
                      color: '#18181B',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '8px' }}>
              <label
                htmlFor="mobile-email"
                style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#52525B', marginBottom: '1px' }}
              >
                Email
              </label>
              <input
                id="mobile-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1.5px solid ${focusedField === 'email' ? '#C99B52' : '#E4E4E7'}`,
                  padding: '5px 0',
                  fontSize: '0.84rem',
                  color: '#18181B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px', position: 'relative' }}>
              <label
                htmlFor="mobile-password"
                style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#52525B', marginBottom: '1px' }}
              >
                Kata sandi
              </label>
              <input
                id="mobile-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                placeholder={isRegister ? 'Minimal 6 karakter..' : 'Masukkan kata sandi..'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1.5px solid ${focusedField === 'password' ? '#C99B52' : '#E4E4E7'}`,
                  padding: '5px 30px 5px 0',
                  fontSize: '0.84rem',
                  color: '#18181B',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: '5px',
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* BOTTOM SECTION: Anchored Submit CTA & Switch Mode Link */}
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
            {/* Submit CTA */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#18181B',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'wait' : 'pointer',
                marginBottom: '10px',
                boxShadow: '0 4px 12px rgba(24, 24, 27, 0.16)'
              }}
            >
              {isSubmitting
                ? 'Memproses...'
                : isRegister
                ? 'Buat Akun Sekarang'
                : 'Masuk ke Akun'}
            </motion.button>

            {/* Switch Mode Link */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => toggleMode(isRegister ? 'login' : 'register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#52525B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '4px'
                }}
              >
                {isRegister
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun? Buat akun sekarang'}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* 3. GOOGLE ACCOUNT CHOOSER (BOTTOM SHEET MODAL FOR MOBILE) */}
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
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
            onClick={() => setShowGooglePicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxHeight: '85vh',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '22px',
                borderTopRightRadius: '22px',
                padding: '20px 20px 32px 20px',
                boxSizing: 'border-box',
                overflowY: 'auto'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#E4E4E7',
                  margin: '0 auto 16px auto'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#18181B' }}>Pilih Akun Google</div>
                <button
                  type="button"
                  onClick={() => setShowGooglePicker(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A' }}
                >
                  <X size={18} />
                </button>
              </div>

              {!isAddingNewGoogle ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {googleAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleSelectGoogleAccount(acc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid #E4E4E7',
                          backgroundColor: '#FAFAFA',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#18181B' }}>{acc.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#71717A', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewGoogle(true)}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      border: '1px dashed #D4D4D8',
                      backgroundColor: 'transparent',
                      color: '#18181B',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Gunakan Akun Lain
                  </button>
                </>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#52525B', marginBottom: '4px' }}>Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gabriel"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E4E7', fontSize: '0.84rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#52525B', marginBottom: '4px' }}>Alamat Email Google</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. gabriel@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E4E4E7', fontSize: '0.84rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewGoogle(false)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #E4E4E7', backgroundColor: '#FAFAFA', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#18181B', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Masuk
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
