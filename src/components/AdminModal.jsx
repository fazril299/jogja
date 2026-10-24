import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  Plus,
  CheckCircle2,
  Database,
  FileCode,
  Sparkles,
  Trash2,
  Users,
  Check,
  Globe,
  Copy,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { SUPABASE_SCHEMA_SQL } from '../lib/supabaseSchema';
import { insertPlaceToSupabase, deletePlaceFromSupabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminModal({ isOpen, onClose, places = [], onAddNewPlace, onDeletePlace }) {
  const [activeAdminTab, setActiveAdminTab] = useState('manage'); // 'manage' | 'add' | 'moderation' | 'users' | 'schema'
  const [copiedSql, setCopiedSql] = useState(false);
  const [filterReviewStatus, setFilterReviewStatus] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  const { users, toggleUserRole, currentUser, isAdmin } = useAuth();
  const { reviews, moderateReview, deleteReview } = useCommunity();

  // Form state for adding a new place
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formProvince, setFormProvince] = useState('D.I. Yogyakarta');
  const [formRegion, setFormRegion] = useState('jawa');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formOverview, setFormOverview] = useState('');
  const [formLat, setFormLat] = useState('-7.8053');
  const [formLng, setFormLng] = useState('110.3644');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100050] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-[#0f1115] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full text-center space-y-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Akses Ditolak (Akses Khusus Administrator)</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Panel ini terproteksi ketat dan hanya dapat diakses oleh akun dengan role <strong>Admin</strong>. Silakan masuk menggunakan akun resmi pengelola.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleModerateClick = async (id, newStatus) => {
    await moderateReview(id, newStatus);
  };

  const handleDeleteReviewClick = async (id) => {
    if (window.confirm('Hapus ulasan ini secara permanen?')) {
      await deleteReview(id);
    }
  };

  const handleDeletePlaceClick = async (placeId, placeName) => {
    if (window.confirm(`Yakin ingin menghapus destinasi "${placeName}"?`)) {
      if (onDeletePlace) {
        onDeletePlace(placeId);
      }
      if (isSupabaseConfigured) {
        await deletePlaceFromSupabase(placeId);
      }
    }
  };

  const handleSubmitNewPlace = async (e) => {
    e.preventDefault();
    if (!formName || !formSubtitle) return;

    setIsSaving(true);
    const placeId = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPlace = {
      id: placeId,
      name: formName,
      subtitle: formSubtitle,
      province: formProvince,
      region: formRegion,
      regionLabel: formProvince.includes('Yogyakarta') ? 'Yogyakarta' : formProvince,
      coverImage: formCoverImage || '/assets/images/jogja_keraton.jpg',
      thumbnail: formCoverImage || '/assets/images/jogja_keraton.jpg',
      soundType: 'wind',
      coordinates: {
        lat: parseFloat(formLat) || -7.8053,
        lng: parseFloat(formLng) || 110.3644
      },
      badges: ['Kontribusi Adat', 'Terverifikasi'],
      passportStamp: {
        title: `Pusaka ${formName}`,
        symbol: '🏛️',
        quote: 'Merawat kearifan tanah tumpah darah Yogyakarta.'
      },
      chapter01: {
        title: 'Kenali Tempat',
        tagline: formSubtitle,
        overview: formOverview || 'Wilayah bersejarah dengan lanskap pusaka dan kebudayaan luhur.',
        history: 'Dihuni masyarakat adat yang mewariskan kearifan hidup turun temurun.',
        landscapeHighlights: [
          { label: 'Karakter Alam & Arsitektur', detail: 'Kekayaan pusaka budaya dengan pakem Mataram luhur.' }
        ]
      },
      chapter02: {
        title: 'Kenali Masyarakat',
        tagline: 'Keluarga & Nilai Hidup Komunal',
        peopleName: `Masyarakat ${formName}`,
        description: 'Masyarakat yang menjunjung tinggi kebersamaan gotong royong.',
        socialStructure: [
          { role: 'Abdi Dalem & Sesepuh', desc: 'Menjaga pedoman tradisi luhur.' }
        ],
        philosophy: 'Hamemayu Hayuning Bawana.'
      },
      chapter03: {
        title: 'Kenali Budaya',
        tagline: 'Tradisi, Seni, & Pusaka Khas',
        cultureElements: [
          {
            category: 'Tradisi',
            name: `Upacara Adat ${formName}`,
            image: formCoverImage || '/assets/images/jogja_upacara_adat.jpg',
            detail: 'Ritual rasa syukur masyarakat kepada Sang Pencipta dan alam semesta.'
          }
        ]
      },
      chapter04: {
        title: 'Cerita & Legenda',
        tagline: 'Kisah Tutur Leluhur',
        storyTitle: `Legenda ${formName}`,
        storyExcerpt: 'Kisah tutur yang diceritakan oleh para sesepuh...',
        fullStory: 'Cerita rakyat yang mengajarkan kejujuran, kerendahan hati, dan kecintaan pada tanah air.'
      },
      chapter05: {
        title: 'Jelajahi Lokasi',
        tagline: 'Situs dan Spot Menarik',
        spots: [
          {
            name: `Pusat Budaya ${formName}`,
            type: 'Situs Pusaka',
            image: formCoverImage || '/assets/images/jogja_tamansari.jpg',
            desc: 'Pusat bertemunya masyarakat dalam perayaan budaya.'
          }
        ]
      },
      chapter06: {
        title: 'Pengalaman & Etika',
        tagline: 'Adab dan Tata Krama Berkunjung',
        reviews: [],
        etiquette: {
          dos: ['Berpakaian sopan dan menyapa warga dengan ramah serta unggah-ungguh.'],
          donts: ['Dilarang membuang sampah sembarangan dan berbicara lantang tanpa adab.']
        }
      },
      chapter07: {
        title: 'Panduan Berkunjung',
        tagline: 'Akses dan Peta Lokasi',
        accessGuide: 'Dapat diakses melalui jalur transportasi darat kota Yogyakarta.',
        bestTime: 'Pagi hari 08.00 - 11.00 atau sore menjelang matahari terbenam.',
        mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(formName + ' Yogyakarta')}&output=embed`,
        mapsDirectLink: `https://maps.google.com/?q=${encodeURIComponent(formName + ' Yogyakarta')}`
      }
    };

    if (onAddNewPlace) {
      onAddNewPlace(newPlace);
    }

    if (isSupabaseConfigured) {
      await insertPlaceToSupabase(newPlace);
    }

    setIsSaving(false);
    setSuccessMsg(`Destinasi "${formName}" berhasil dipublikasikan ke katalog!`);
    setTimeout(() => {
      setSuccessMsg('');
      setActiveAdminTab('manage');
      setFormName('');
      setFormSubtitle('');
      setFormOverview('');
      setFormCoverImage('');
    }, 1800);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterReviewStatus === 'all') return true;
    return r.status === filterReviewStatus;
  });

  return (
    <div className="fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0f1115] border border-[#c99b52]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#ede8df]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#14171f] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Panel Pengelola Budaya (Admin CMS)
                </h2>
                {isSupabaseConfigured ? (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase PostgreSQL Aktif
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Penyimpanan Lokal Aktif (.env siap disambung)
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Otoritas Administrator • Kelola destinasi, tinjau ulasan, atur hak akses pengguna, dan sinkronisasi Supabase.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup Panel Admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-white/10 bg-[#12141a] flex items-center gap-4 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveAdminTab('manage')}
            className={`py-3.5 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'manage'
                ? 'border-[#c99b52] text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Katalog Destinasi ({places.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('add')}
            className={`py-3.5 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'add'
                ? 'border-[#c99b52] text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Destinasi Baru</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`py-3.5 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'moderation'
                ? 'border-[#c99b52] text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Moderasi Ulasan ({reviews.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`py-3.5 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'users'
                ? 'border-[#c99b52] text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Role Pengguna ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('schema')}
            className={`py-3.5 font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'schema'
                ? 'border-[#c99b52] text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Koneksi & Skema Supabase</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto max-h-[58vh]">
          {/* =================================================================
              TAB 1: MANAGE PLACES (KATALOG DESTINASI CRUD)
              ================================================================= */}
          {activeAdminTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Daftar Destinasi Pusaka Aktif</h3>
                  <p className="text-xs text-neutral-400">
                    Total {places.length} destinasi terdaftar dalam katalog Hamemayu.
                  </p>
                </div>
                <button
                  onClick={() => setActiveAdminTab('add')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#c99b52] to-[#e5b869] text-neutral-950 font-bold text-xs flex items-center gap-1.5 hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tempat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={place.thumbnail || place.coverImage}
                        alt={place.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="font-serif text-sm font-bold text-white truncate">
                          {place.name}
                        </h4>
                        <p className="text-xs text-neutral-400 truncate">
                          {place.subtitle || place.province}
                        </p>
                        <span className="text-[10px] font-mono text-amber-400/80 mt-1 inline-block">
                          ID: {place.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeletePlaceClick(place.id, place.name)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="Hapus Destinasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: ADD NEW PLACE FORM
              ================================================================= */}
          {activeAdminTab === 'add' && (
            <form onSubmit={handleSubmitNewPlace} className="space-y-4">
              {successMsg && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Nama Tempat / Daerah Pusaka *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Candi Sambisari"
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Provinsi / Wilayah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    placeholder="Contoh: D.I. Yogyakarta"
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Ringkasan / Subtitle Pusaka *
                </label>
                <input
                  type="text"
                  required
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Contoh: Candi Bawah Tanah Abad Ke-9 di Kalasan Sleman"
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  URL Foto Sampul (WebP / Unsplash)
                </label>
                <input
                  type="url"
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  placeholder="/assets/images/jogja_keraton.jpg atau URL gambar"
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Ikhtisar Wilayah & Sejarah (Bab 1)
                </label>
                <textarea
                  rows={2}
                  value={formOverview}
                  onChange={(e) => setFormOverview(e.target.value)}
                  placeholder="Deskripsi nilai sejarah, keterkaitan dengan budaya Yogyakarta..."
                  className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Garis Lintang (Latitude GPS)
                  </label>
                  <input
                    type="text"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Garis Bujur (Longitude GPS)
                  </label>
                  <input
                    type="text"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99b52] to-[#e5b869] text-neutral-950 font-bold text-xs hover:shadow-lg transition-all"
                >
                  {isSaving ? 'Menyimpan ke Supabase...' : 'Simpan & Publikasikan ke Katalog'}
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 3: MODERATION OF REVIEWS (LIVE STATUS & ACTIONS)
              ================================================================= */}
          {activeAdminTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">Moderasi Ulasan Pengunjung</h3>
                  <p className="text-xs text-neutral-400">
                    Setujui atau tolak ulasan sebelum tampil di halaman destinasi publik.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-white/10 text-xs">
                  {['all', 'pending', 'approved', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterReviewStatus(st)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        filterReviewStatus === st
                          ? 'bg-[#c99b52] text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st === 'all' ? 'Semua' : st === 'pending' ? 'Menunggu' : st === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs bg-white/5 rounded-2xl border border-white/10">
                  Tidak ada ulasan pada filter ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{rev.userName}</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            Tempat: {rev.placeId}
                          </span>
                          <span className="text-xs text-amber-400">★ {rev.rating}</span>
                        </div>
                        {rev.headline && (
                          <p className="text-xs font-semibold text-neutral-200">"{rev.headline}"</p>
                        )}
                        <p className="text-xs text-neutral-300 italic">"{rev.comment}"</p>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full inline-block mt-1 ${
                            rev.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : rev.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Status: {rev.status === 'approved' ? 'Disetujui' : rev.status === 'rejected' ? 'Ditolak' : 'Menunggu Moderasi'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleModerateClick(rev.id, 'approved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                          >
                            Setujui
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleModerateClick(rev.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
                          >
                            Tolak
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReviewClick(rev.id)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Hapus Ulasan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 4: USER & ROLE MANAGEMENT
              ================================================================= */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Manajemen Pengguna & Role Hak Akses</h3>
                <p className="text-xs text-neutral-400">
                  Ubah hak akses akun pengguna antara <strong>admin</strong> (akses CMS penuh) atau <strong>user</strong> (penjelajah budaya biasa).
                </p>
              </div>

              <div className="space-y-2.5">
                {users.map((usr) => {
                  const isUserAdmin =
                    usr.role === 'admin' ||
                    usr.email === 'fazriel@admin.com' ||
                    usr.email === 'admin@hamemayu.id' ||
                    usr.email === 'fazrielmuliyael@gmail.com';

                  return (
                    <div
                      key={usr.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={usr.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.name)}`}
                          alt={usr.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-xs">{usr.name}</span>
                            {isUserAdmin && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                                ADMINISTRATOR
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400 font-mono">{usr.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUserAdmin ? (
                          <button
                            onClick={() => toggleUserRole(usr.id, 'user')}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-neutral-700 transition-colors"
                          >
                            Jadikan Penjelajah Biasa
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleUserRole(usr.id, 'admin')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
                          >
                            Jadikan Admin
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 5: SUPABASE SQL & CONNECTION SETUP
              ================================================================= */}
          {activeAdminTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Database className="w-4 h-4" />
                  <span>Petunjuk Menyambungkan Supabase Backend:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-neutral-300">
                  <li>Buat proyek baru di <strong>supabase.com</strong>.</li>
                  <li>Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda.</li>
                  <li>Klik tombol <strong>"Salin SQL Skema"</strong> di bawah ini, lalu tempel (Paste) dan klik <strong>Run</strong>.</li>
                  <li>Buka menu <strong>Project Settings &gt; API</strong>, salin <code>Project URL</code> dan <code>anon public key</code>.</li>
                  <li>Tempelkan ke dalam file <code>.env</code> di proyek ini:
                    <div className="p-2 mt-1 rounded bg-black/60 font-mono text-[11px] text-amber-300">
                      VITE_SUPABASE_URL=https://proyek-anda.supabase.co<br />
                      VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-mono">
                  Skema PostgreSQL Supabase Lengkap (Tabel profiles, places, reviews, RLS & Trigger)
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-mono text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin SQL Skema</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60 leading-relaxed">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14171f] flex items-center justify-between text-xs text-neutral-400">
          <span>
            {currentUser?.name ? `Administrator Aktif: ${currentUser.name}` : 'Akses Administrator Hamemayu'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Tutup Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
