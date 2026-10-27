import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Award,
  Compass,
  MapPin,
  Check,
  Lock,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowLeft,
  Filter,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCultureBook } from '../context/CultureBookContext';
import { CULTURAL_BADGES, CULTURAL_QUESTS, BADGE_TIERS } from '../data/badgeQuestData';
import { getHaversineDistance } from '../utils/gpsSecurity';

export default function KatalogQuestBadgePage({
  isOpen,
  onClose,
  places = [],
  onSelectPlace,
  userLiveCoords,
  onRefreshGps,
  isGpsLoading
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'quests' | 'badges'
  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'umum' | 'langka' | 'epic' | 'legendaris'
  const [searchQuery, setSearchQuery] = useState('');

  const {
    cultureBook,
    isBadgeUnlocked,
    isGpsVerified,
    getStats
  } = useCultureBook();

  const totalPlaces = places.length || 6;
  const stats = getStats ? getStats(totalPlaces) : { gpsVerifiedCount: 0 };
  const unlockedBadgesCount = (cultureBook.unlockedBadgeIds || []).length;

  // Total XP calculated from completed quests
  const totalXp = useMemo(() => {
    let xp = 0;
    CULTURAL_QUESTS.forEach((q) => {
      const completedCount = q.requiredPlaceIds.filter(
        (pId) => cultureBook.visitedPlaces.includes(pId) || isGpsVerified(pId)
      ).length;
      if (completedCount === q.requiredPlaceIds.length) {
        xp += q.xp || 200;
      }
    });
    // Add XP for individual badges unlocked
    xp += unlockedBadgesCount * 100;
    return xp;
  }, [cultureBook, isGpsVerified, unlockedBadgesCount]);

  // Filtered Quests
  const filteredQuests = useMemo(() => {
    return CULTURAL_QUESTS.filter((quest) => {
      const matchTier = selectedTier === 'all' || quest.tier === selectedTier;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        quest.title.toLowerCase().includes(q) ||
        quest.description.toLowerCase().includes(q) ||
        quest.caraMendapatkan.toLowerCase().includes(q);
      return matchTier && matchSearch;
    });
  }, [selectedTier, searchQuery]);

  // Filtered Badges
  const filteredBadges = useMemo(() => {
    return CULTURAL_BADGES.filter((badge) => {
      const matchTier = selectedTier === 'all' || badge.tier === selectedTier;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        badge.name.toLowerCase().includes(q) ||
        (badge.subtitle && badge.subtitle.toLowerCase().includes(q)) ||
        (badge.lore && badge.lore.toLowerCase().includes(q)) ||
        badge.caraMendapatkan.toLowerCase().includes(q);
      return matchTier && matchSearch;
    });
  }, [selectedTier, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99996] bg-[#FAF6EE] text-[#2C221E] overflow-y-auto pt-20 sm:pt-24 pb-20"
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP BAR / BACK NAVIGATION */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D9CEBA]/60">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9CEBA] text-[#2C221E] hover:bg-[#FAF8F5] transition-all text-xs sm:text-sm font-bold shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft size={15} />
              <span>Kembali</span>
            </button>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={onRefreshGps}
                disabled={isGpsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C221E] text-[#FAF8F5] text-xs font-bold hover:bg-[#4A3B32] transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={isGpsLoading ? 'animate-spin' : ''} />
                <span>{isGpsLoading ? 'Mendeteksi...' : 'Radar GPS'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#D9CEBA] text-[#2C221E] flex items-center justify-center hover:bg-[#FAF8F5] transition-all shadow-xs cursor-pointer"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* PAGE HERO HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#2C221E] leading-tight tracking-tight">
              Katalog Misi & Lencana Budaya
            </h1>
            <p className="text-xs sm:text-base text-[#6E5D52] mt-3 leading-relaxed max-w-2xl mx-auto">
              Selesaikan 4 misi napak tilas sejarah Yogyakarta dan klaim 9 lencana warisan budaya secara otomatis saat Anda berkunjung langsung ke situs cagar budaya.
            </p>

            {/* GAMIFIED STATS RIBBON */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-3 sm:p-4 rounded-2xl bg-white border border-[#EAE4DC] shadow-xs">
              <div className="p-2 text-center border-r border-[#F2EDE4] last:border-none">
                <span className="block text-xl sm:text-2xl font-black text-[#8A5D26]">
                  {totalXp} XP
                </span>
                <span className="text-[11px] font-semibold text-[#786B5E]">Total Poin Budaya</span>
              </div>
              <div className="p-2 text-center border-r border-[#F2EDE4] last:border-none">
                <span className="block text-xl sm:text-2xl font-black text-[#2C221E]">
                  {unlockedBadgesCount} / {CULTURAL_BADGES.length}
                </span>
                <span className="text-[11px] font-semibold text-[#786B5E]">Lencana Terbuka</span>
              </div>
              <div className="p-2 text-center border-r border-[#F2EDE4] last:border-none">
                <span className="block text-xl sm:text-2xl font-black text-[#2C221E]">
                  {stats.gpsVerifiedCount || cultureBook.visitedPlaces.length} / {totalPlaces}
                </span>
                <span className="text-[11px] font-semibold text-[#786B5E]">Situs Dikunjungi</span>
              </div>
              <div className="p-2 text-center flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} />
                  <span>{userLiveCoords ? 'GPS Terhubung' : 'GPS Siap'}</span>
                </div>
                <span className="text-[10px] text-[#786B5E] mt-1">D.I. Yogyakarta</span>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari misi, lencana, candi, malioboro, kuliner..."
                className="w-full bg-[#FAF8F5] text-xs sm:text-sm text-[#2C221E] placeholder:text-[#9C8E82] pl-3.5 pr-10 py-2.5 rounded-xl border border-[#D9CEBA] focus:outline-none focus:border-[#8A5D26] transition-colors"
              />
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786B5E]"
              />
            </div>

            {/* Main Category Filter Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#2C221E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6E5D52] hover:text-[#2C221E] border border-[#EAE0D0]'
                }`}
              >
                Semua ({CULTURAL_QUESTS.length + CULTURAL_BADGES.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('quests')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'quests'
                    ? 'bg-[#8A5D26] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#8A5D26] hover:bg-[#FAF6EE] border border-[#E5D7BE]'
                }`}
              >
                <Sparkles size={13} />
                <span>Misi & Quest ({CULTURAL_QUESTS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('badges')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'badges'
                    ? 'bg-[#2C221E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6E5D52] hover:text-[#2C221E] border border-[#EAE0D0]'
                }`}
              >
                <Award size={13} />
                <span>9 Lencana Warisan</span>
              </button>
            </div>
          </div>

          {/* =================================================================
              SEKSI 1: 4 MISI & QUEST BUDAYA (GRID 2-KOLOM BERDAMPINGAN)
              ================================================================= */}
          {(activeFilter === 'all' || activeFilter === 'quests') && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C221E] flex items-center gap-2">
                    <Sparkles size={20} className="text-[#8A5D26]" />
                    <span>Misi & Quest Budaya ({filteredQuests.length})</span>
                  </h2>
                  <p className="text-xs text-[#786B5E] mt-0.5">
                    Rangkaian napak tilas multi-lokasi untuk membuka lencana tingkat tinggi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuests.map((quest) => {
                  const completedCount = quest.requiredPlaceIds.filter(
                    (pId) => cultureBook.visitedPlaces.includes(pId) || isGpsVerified(pId)
                  ).length;
                  const isDone = completedCount === quest.requiredPlaceIds.length;

                  return (
                    <div
                      key={quest.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-white border-[#EAE4DC] hover:border-[#8A5D26]/40'
                      }`}
                    >
                      <div>
                        {/* Header: Title + XP + Badge Reward */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#8A5D26] uppercase tracking-wider block mb-0.5">
                              {quest.aksara}
                            </span>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C221E] leading-snug">
                              {quest.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-[#8A5D26]/10 text-[#8A5D26] text-[11px] font-black border border-[#8A5D26]/20">
                              +{quest.xp || 300} XP
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-[#FAF6EE] text-[#8A5D26] border border-[#E5DEC9]'
                              }`}
                            >
                              {isDone ? '✓ Selesai' : `${completedCount}/${quest.requiredPlaceIds.length} Lokasi`}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#6E5D52] leading-relaxed mb-3">
                          {quest.description}
                        </p>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-[#8A5D26] mb-2.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#ECE4D8]">
                          Cara Selesaikan: {quest.caraMendapatkan}
                        </div>

                        {/* Checkpoints */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {quest.requiredPlaceIds.map((pId) => {
                            const pl = places.find((p) => p.id === pId);
                            const isGps = isGpsVerified(pId);
                            return (
                              <button
                                key={pId}
                                type="button"
                                onClick={() => pl && onSelectPlace && onSelectPlace(pl)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                  isGps
                                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                                    : 'bg-[#FAF8F5] text-[#5C4E43] font-medium border border-[#ECE4D8] hover:border-[#8A5D26]'
                                }`}
                                title={pl ? `Buka info ${pl.name}` : pId}
                              >
                                {isGps ? (
                                  <CheckCircle2 size={12} className="text-emerald-700" />
                                ) : (
                                  <Lock size={11} className="text-neutral-400" />
                                )}
                                <span>{pl?.name.split('&')[0] || pId}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =================================================================
              SEKSI 2: 9 LENCANA WARISAN BUDAYA (GRID 2-KOLOM BERDAMPINGAN)
              ================================================================= */}
          {(activeFilter === 'all' || activeFilter === 'badges') && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C221E] flex items-center gap-2">
                    <Award size={20} className="text-[#8A5D26]" />
                    <span>Daftar 9 Lencana Warisan ({filteredBadges.length})</span>
                  </h2>
                  <p className="text-xs text-[#786B5E] mt-0.5">
                    Dekati cagar budaya Yogyakarta dalam radius GPS untuk mengklaim stempel permanen
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBadges.map((badge) => {
                  const isUnlocked = isBadgeUnlocked(badge.id);
                  const targetPlace = places.find((p) => p.id === badge.targetPlaceId);
                  const maxRadius = badge.maxRadiusMeters || 1500;

                  // GPS distance check
                  const distNow =
                    userLiveCoords && targetPlace?.coordinates
                      ? getHaversineDistance(userLiveCoords, targetPlace.coordinates)
                      : null;
                  const isInRange = Boolean(distNow !== null && distNow <= maxRadius);

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                        isUnlocked
                          ? 'bg-amber-50/30 border-[#8A5D26]'
                          : isInRange
                          ? 'bg-emerald-50/40 border-emerald-400'
                          : 'bg-white border-[#EAE4DC] hover:border-[#8A5D26]/40'
                      }`}
                    >
                      <div>
                        {/* Header: Badge Icon + Name + Tier */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-black/10"
                              style={{ backgroundColor: badge.bg }}
                            >
                              <img
                                src={badge.iconSrc}
                                alt={badge.name}
                                className={`w-6 h-6 object-contain ${
                                  isUnlocked ? 'brightness-0 invert' : 'opacity-80 brightness-0 invert'
                                }`}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-serif text-base font-bold text-[#2C221E] leading-snug">
                                  {badge.name}
                                </h3>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#FAF6EE] text-[#8A5D26] border border-[#E5DEC9]">
                                  {badge.tier}
                                </span>
                              </div>
                              <p className="text-xs text-[#786B5E] mt-0.5">
                                {badge.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {isUnlocked ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                                <Check size={12} strokeWidth={3} />
                                <span>Terbuka</span>
                              </span>
                            ) : isInRange ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 animate-pulse">
                                <Sparkles size={12} />
                                <span>Bisa Diklaim!</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                                <Lock size={11} />
                                <span>Belum Terbuka</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lore History */}
                        <p className="text-xs text-[#6E5D52] leading-relaxed mb-3 italic">
                          "{badge.lore}"
                        </p>
                      </div>

                      {/* GPS Rule & Action Button */}
                      <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-[#786B5E]">
                          <MapPin size={12} className="text-[#9E1C64] flex-shrink-0" />
                          <span className="text-[11px] leading-tight line-clamp-1">
                            Radius &lt; {maxRadius} meter
                          </span>
                        </div>

                        {targetPlace && (
                          <button
                            type="button"
                            onClick={() => onSelectPlace && onSelectPlace(targetPlace)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5D26] hover:text-[#2C221E] transition-colors cursor-pointer"
                          >
                            <Compass size={13} />
                            <span>Jelajahi Lokasi</span>
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
