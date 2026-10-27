import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Video,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';

const PRESET_PHOTOS = [
  {
    label: 'Tamansari & Sumur Gumuling',
    url: '/assets/images/jogja_tamansari.jpg'
  },
  {
    label: 'Bangsal Keraton Ngayogyakarta',
    url: '/assets/images/jogja_keraton.jpg'
  },
  {
    label: 'Suasana Malam Malioboro',
    url: '/assets/images/jogja_malioboro.jpg'
  },
  {
    label: 'Panorama Gunung Merapi',
    url: '/assets/images/jogja_merapi.jpg'
  },
  {
    label: 'Hajad Dalem Gunungan Grebeg',
    url: '/assets/images/real_gunungan_grebeg.jpg'
  },
  {
    label: 'Sendratari Ramayana Prambanan',
    url: '/assets/images/real_ramayana_stage.jpg'
  },
  {
    label: 'Bregada Prajurit Keraton',
    url: '/assets/images/real_bregada_keraton.jpg'
  },
  {
    label: 'Tari Tradisional Srimanganti',
    url: '/assets/images/real_tari_srimanganti.jpg'
  },
  {
    label: 'Batik Tulis Pusaka Giriloyo',
    url: '/assets/images/real_batik_keraton.jpg'
  },
  {
    label: 'Senja Candi Ratu Boko',
    url: '/assets/images/jogja_ratuboko.jpg'
  },
  {
    label: 'Seni Kriya Gerabah Kasongan',
    url: '/assets/images/jogja_kasongan.jpg'
  },
  {
    label: 'Kuliner Gudeg Wijilan',
    url: '/assets/images/jogja_gudeg.jpg'
  }
];

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 460,
  damping: 52,
  mass: 1
};

export default function ShareExperienceModal({
  isOpen,
  onClose,
  places = [],
  defaultPlaceId = null
}) {
  const { currentUser } = useAuth();
  const { addExperience } = useCommunity();

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    defaultPlaceId || places[0]?.id || 'keraton-yogyakarta'
  );
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tagInput, setTagInput] = useState('SpotOtentik, MomenJogja');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (defaultPlaceId) {
      setSelectedPlaceId(defaultPlaceId);
    }
  }, [defaultPlaceId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaUrl(event.target?.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!mediaUrl.trim()) {
      setErrorMsg('Silakan pilih atau masukkan URL foto/video momen Anda.');
      return;
    }
    if (!caption.trim()) {
      setErrorMsg('Tuliskan cerita singkat tentang pengalaman Anda.');
      return;
    }

    const currentPlace = places.find((p) => p.id === selectedPlaceId);
    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addExperience({
      placeId: selectedPlaceId,
      placeName: currentPlace ? currentPlace.name : 'Destinasi Yogyakarta',
      mediaType,
      mediaUrl: mediaUrl.trim(),
      caption: caption.trim(),
      tags: tagsArray,
      user: currentUser
    });

    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c99b52', '#18181b', '#d4af37']
      });
    } catch {}

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setCaption('');
      setMediaUrl('');
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100009,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          backgroundColor: 'rgba(9, 9, 11, 0.48)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={SPRING_TRANSITION}
          style={{
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            boxShadow: '0 28px 70px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)',
            overflowY: 'auto',
            position: 'relative',
            color: '#09090b',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          {/* Editorial Header */}
          <div
            style={{
              padding: '1.6rem 1.85rem 1.25rem 1.85rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: '#faf6ef',
                  border: '1px solid rgba(201, 155, 82, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <img
                  src="/assets/icons/icon_culture.svg"
                  alt=""
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#09090b',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Bagikan Dokumentasi Momen
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#71717a' }}>
                  Jurnal visual & pengalaman nyata penjelajah budaya Yogyakarta
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#f4f4f5',
                border: 'none',
                color: '#18181b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e4e4e7')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f4f4f5')}
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Form Body */}
          <div style={{ padding: '1.6rem 1.85rem 1.85rem 1.85rem' }}>
            {successMsg ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  backgroundColor: '#faf6ef',
                  borderRadius: '20px',
                  border: '1px solid rgba(201, 155, 82, 0.35)'
                }}
              >
                <CheckCircle2 size={44} color="#c99b52" style={{ margin: '0 auto 0.85rem auto' }} />
                <h4
                  style={{
                    margin: '0 0 0.35rem 0',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#09090b'
                  }}
                >
                  Dokumentasi Berhasil Dipublikasikan
                </h4>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#52525b' }}>
                  Terima kasih telah memperkaya arsip cerita penjelajah Yogyakarta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {errorMsg && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.7rem 0.95rem',
                      borderRadius: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Destination Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#3f3f46',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Kawasan / Destinasi Budaya
                  </label>
                  <select
                    value={selectedPlaceId}
                    onChange={(e) => setSelectedPlaceId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8f8f7',
                      border: '1px solid #e4e4e7',
                      borderRadius: '14px',
                      color: '#09090b',
                      fontSize: '0.86rem',
                      fontWeight: 500,
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.regionLabel || 'D.I. Yogyakarta'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Segmented Media Type Switcher (Matches Sneks Segmented Pill) */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#3f3f46',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Format Dokumentasi
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      padding: '4px',
                      borderRadius: '999px',
                      backgroundColor: '#f0f0f0'
                    }}
                  >
                    {[
                      { id: 'image', label: 'Foto Kunjungan', icon: ImageIcon },
                      { id: 'video', label: 'Video Singkat (URL)', icon: Video }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const active = mediaType === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setMediaType(tab.id)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '999px',
                            border: 'none',
                            backgroundColor: active ? '#ffffff' : 'transparent',
                            color: active ? '#09090b' : '#71717a',
                            boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Icon size={14} color={active ? '#c99b52' : '#71717a'} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Upload or URL Input */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#3f3f46',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Unggah Berkas atau Masukkan URL Media
                  </label>

                  {mediaType === 'image' && (
                    <div style={{ marginBottom: '0.65rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '1.15rem',
                          borderRadius: '16px',
                          border: '1.5px dashed #d4d4d8',
                          backgroundColor: '#f8f8f7',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'border-color 0.25s ease, background-color 0.25s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#c99b52';
                          e.currentTarget.style.backgroundColor = '#faf6ef';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d4d4d8';
                          e.currentTarget.style.backgroundColor = '#f8f8f7';
                        }}
                      >
                        <Upload size={19} color="#9a6f27" />
                        <span style={{ fontSize: '0.82rem', color: '#18181b', fontWeight: 600 }}>
                          Pilih foto dari perangkat Anda
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                          PNG, JPG, WebP (Maks. 8MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}

                  <input
                    type="url"
                    placeholder="Atau tempel URL foto/video langsung di sini..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.95rem',
                      backgroundColor: '#f8f8f7',
                      border: '1px solid #e4e4e7',
                      borderRadius: '12px',
                      color: '#09090b',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />

                  {/* Preset Yogyakarta Curated Photos */}
                  <div style={{ marginTop: '0.55rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#71717a',
                        display: 'block',
                        marginBottom: '0.35rem',
                        fontWeight: 500
                      }}
                    >
                      Atau gunakan foto arsip Yogyakarta:
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {PRESET_PHOTOS.map((sample, idx) => {
                        const active = mediaUrl === sample.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMediaUrl(sample.url)}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              border: active
                                ? '1px solid #c99b52'
                                : '1px solid rgba(0, 0, 0, 0.08)',
                              backgroundColor: active ? '#faf6ef' : '#f8f8f7',
                              color: active ? '#9a6f27' : '#52525b',
                              fontWeight: active ? 700 : 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {sample.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Media Preview */}
                  {mediaUrl && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        height: '155px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={mediaUrl}
                        alt="Pratinjau"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#3f3f46',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Catatan & Cerita Perjalanan
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ceritakan momen berkesan, suasana, atau tips berkunjung..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.95rem',
                      backgroundColor: '#f8f8f7',
                      border: '1px solid #e4e4e7',
                      borderRadius: '14px',
                      color: '#09090b',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#3f3f46',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Tagar Budaya (pisahkan dengan koma)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag
                      size={14}
                      color="#9a6f27"
                      style={{
                        position: 'absolute',
                        left: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.95rem 0.7rem 2.35rem',
                        backgroundColor: '#f8f8f7',
                        border: '1px solid #e4e4e7',
                        borderRadius: '12px',
                        color: '#09090b',
                        fontSize: '0.84rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    marginTop: '0.35rem',
                    height: '48px',
                    borderRadius: '999px',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 10px 24px rgba(9, 9, 11, 0.14)',
                    transition:
                      'background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#c99b52';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(201, 155, 82, 0.32)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181b';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(9, 9, 11, 0.14)';
                  }}
                >
                  <Upload size={16} />
                  <span>Publikasikan Dokumentasi</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
