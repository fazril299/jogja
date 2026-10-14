import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { CULTURAL_BADGES, CULTURAL_QUESTS, BADGE_TIERS } from '../data/badgeQuestData';
import {
  validateGpsSecurity,
  generateIntegritySignature,
  verifyIntegritySignature,
  getHaversineDistance
} from '../utils/gpsSecurity';
import {
  isSupabaseConfigured,
  fetchCulturePassportFromSupabase,
  saveCulturePassportToSupabase
} from '../lib/supabase';

const CultureBookContext = createContext(null);

export const getUserCultureStorageKey = (userId) => {
  if (!userId || userId === 'guest' || userId === 'guest-user') {
    return 'jogjakrama_culture_book_v4_guest';
  }
  return `jogjakrama_culture_book_v4_${userId}`;
};

// Data awal paspor budaya bersih tanpa dummy (Mulai dari 0 badge untuk akun baru)
export const INITIAL_DEFAULT_DATA = () => ({
  visitedPlaces: [],
  readChapters: {},
  stamps: [],
  verifiedVisits: [],
  unlockedBadgeIds: [],
  questsStatus: {
    'quest-sumbu-filosofis': { isCompleted: false, rewardClaimed: false },
    'quest-jejak-mataram-kuno': { isCompleted: false, rewardClaimed: false },
    'quest-candi-merapi-agung': { isCompleted: false, rewardClaimed: false },
    'quest-kuliner-kembul-bujana': { isCompleted: false, rewardClaimed: false }
  },
  favorites: [],
  userNotes: {},
  lastGpsCheckIn: null
});

export function CultureBookProvider({ children }) {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id || 'guest';

  // Helper untuk memuat data paspor budaya per akun
  const loadUserData = useCallback((uid) => {
    try {
      // Hapus data cache legacy v3 agar badge lama tidak pernah bocor ke akun baru
      try {
        localStorage.removeItem('jogjakrama_culture_book_v3');
      } catch (err) {}

      const key = getUserCultureStorageKey(uid);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verifiedVisits && Array.isArray(parsed.unlockedBadgeIds)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading culture book from localStorage:', e);
    }
    return INITIAL_DEFAULT_DATA();
  }, []);

  const [cultureBook, setCultureBook] = useState(() => loadUserData(currentUserId));
  const activeUserIdRef = useRef(currentUserId);

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [activeSoundType, setActiveSoundType] = useState('ocean');

  // Sinkronisasi data ketika user login/ganti akun (termasuk pendaftaran akun baru)
  useEffect(() => {
    activeUserIdRef.current = currentUserId;
    const freshData = loadUserData(currentUserId);
    setCultureBook(freshData);

    // Jika Supabase aktif dan bukan guest, sinkronisasikan paspor dari cloud
    if (isSupabaseConfigured && currentUserId && !currentUserId.startsWith('guest')) {
      fetchCulturePassportFromSupabase(currentUserId).then((cloudData) => {
        if (cloudData && Array.isArray(cloudData.unlocked_badges)) {
          setCultureBook((prev) => ({
            ...prev,
            stamps: cloudData.stamps || prev.stamps,
            visitedPlaces: cloudData.visited_places || prev.visitedPlaces,
            unlockedBadgeIds: cloudData.unlocked_badges || prev.unlockedBadgeIds,
            favorites: cloudData.favorites || prev.favorites,
            userNotes: cloudData.user_notes || prev.userNotes
          }));
        }
      });
    }
  }, [currentUserId, loadUserData]);

  // Simpan setiap perubahan paspor budaya ke storage spesifik user aktif
  useEffect(() => {
    try {
      const key = getUserCultureStorageKey(activeUserIdRef.current);
      localStorage.setItem(key, JSON.stringify(cultureBook));

      if (
        isSupabaseConfigured &&
        activeUserIdRef.current &&
        !activeUserIdRef.current.startsWith('guest')
      ) {
        saveCulturePassportToSupabase(activeUserIdRef.current, cultureBook);
      }
    } catch (e) {
      console.error('Error saving culture book:', e);
    }
  }, [cultureBook]);

  /**
   * Reset seluruh badge dan progres paspor budaya untuk user saat ini (Kembali ke 0)
   */
  const resetAllBadges = useCallback(() => {
    const fresh = INITIAL_DEFAULT_DATA();
    setCultureBook(fresh);
    try {
      const key = getUserCultureStorageKey(activeUserIdRef.current);
      localStorage.setItem(key, JSON.stringify(fresh));
      localStorage.removeItem('jogjakrama_culture_book_v3');
      localStorage.removeItem('jogjakrama_culture_book_v4_guest');
      localStorage.removeItem('jogjakrama_culture_book_v4_guest-user');
      if (
        isSupabaseConfigured &&
        activeUserIdRef.current &&
        !activeUserIdRef.current.startsWith('guest')
      ) {
        saveCulturePassportToSupabase(activeUserIdRef.current, fresh);
      }
    } catch (e) {
      console.error('Error resetting badges:', e);
    }
  }, []);

  /**
   * Evaluasi progres quest budaya berdasarkan tempat-tempat yang sudah dikunjungi
   */
  const evaluateQuests = (currentVisitedPlaces, existingQuestsStatus, unlockedBadgeIds) => {
    const updatedQuests = { ...existingQuestsStatus };
    const newlyUnlockedBadges = [];

    CULTURAL_QUESTS.forEach((quest) => {
      const allRequiredVisited = quest.requiredPlaceIds.every((reqId) =>
        currentVisitedPlaces.includes(reqId)
      );

      const questState = updatedQuests[quest.id] || { isCompleted: false, rewardClaimed: false };

      if (allRequiredVisited && !questState.isCompleted) {
        updatedQuests[quest.id] = {
          isCompleted: true,
          completedAt: new Date().toISOString(),
          rewardClaimed: true
        };

        if (quest.badgeRewardId && !unlockedBadgeIds.includes(quest.badgeRewardId)) {
          newlyUnlockedBadges.push(quest.badgeRewardId);
        }
      }
    });

    return { updatedQuests, newlyUnlockedBadges };
  };

  /**
   * VERIFIKASI KUNJUNGAN GPS DENGAN KEAMANAN TINGGI (ANTI-SPOOFING & ANTI-BYPASS)
   * Menguji Geofence Jogja, Akurasi Sensor, Jarak Episentrum, dan Kecepatan Wajar.
   */
  const verifyGpsVisit = (place, userCoords, userId = 'guest') => {
    if (!place || !place.coordinates) {
      return {
        success: false,
        code: 'INVALID_PLACE',
        message: 'Data koordinat cagar budaya tidak ditemukan.'
      };
    }

    // Tentukan badge langsung dan tingkat kesulitan radiusnya
    const matchingBadge = CULTURAL_BADGES.find((b) => b.targetPlaceId === place.id);
    const customRadius = matchingBadge?.maxRadiusMeters || 1500;

    // 1. Jalankan Validasi Keamanan Anti-Bypass dengan radius sesuai tingkat kesulitan
    const securityCheck = validateGpsSecurity({
      userCoords,
      targetCoords: place.coordinates,
      placeName: place.name,
      lastCheckInRecord: cultureBook.lastGpsCheckIn,
      customMaxRadius: customRadius
    });

    if (!securityCheck.isValid) {
      return {
        success: false,
        code: securityCheck.code,
        distanceMeters: securityCheck.distanceMeters,
        message: securityCheck.message
      };
    }

    // 2. Buat Bukti Kunjungan Sah dengan Cryptographic Integrity Signature
    const nowIso = new Date().toISOString();
    const signature = generateIntegritySignature(
      place.id,
      userId,
      userCoords.lat,
      userCoords.lng,
      nowIso
    );

    const visitProof = {
      placeId: place.id,
      placeName: place.name,
      lat: userCoords.lat,
      lng: userCoords.lng,
      accuracy: userCoords.accuracy || 15,
      verifiedAt: nowIso,
      proofSignature: signature
    };

    // 3. Tentukan badge langsung dari destinasi ini (jika ada)
    const directBadgeId = matchingBadge ? matchingBadge.id : null;

    let unlockedBadgesList = [];

    setCultureBook((prev) => {
      const alreadyVisited = prev.visitedPlaces.includes(place.id);
      const updatedVisited = alreadyVisited
        ? prev.visitedPlaces
        : [...prev.visitedPlaces, place.id];

      // Update Verified Visits (Replace jika sudah ada, atau append)
      const existingVisitIndex = prev.verifiedVisits.findIndex((v) => v.placeId === place.id);
      let updatedVisits = [...prev.verifiedVisits];
      if (existingVisitIndex >= 0) {
        updatedVisits[existingVisitIndex] = visitProof;
      } else {
        updatedVisits.push(visitProof);
      }

      // Update Stamps Paspor
      const hasStampAlready = prev.stamps.some((s) => s.placeId === place.id);
      const updatedStamps = hasStampAlready
        ? prev.stamps
        : [
            ...prev.stamps,
            {
              placeId: place.id,
              title: place.passportStamp?.title || place.name,
              symbol: place.passportStamp?.symbol || 'JK',
              unlockedAt: nowIso
            }
          ];

      // Kumpulkan Badge Baru
      let currentBadges = [...(prev.unlockedBadgeIds || [])];
      if (directBadgeId && !currentBadges.includes(directBadgeId)) {
        currentBadges.push(directBadgeId);
        unlockedBadgesList.push(directBadgeId);
      }

      // Evaluasi Quests
      const { updatedQuests, newlyUnlockedBadges } = evaluateQuests(
        updatedVisited,
        prev.questsStatus || {},
        currentBadges
      );

      newlyUnlockedBadges.forEach((bId) => {
        if (!currentBadges.includes(bId)) {
          currentBadges.push(bId);
          unlockedBadgesList.push(bId);
        }
      });

      return {
        ...prev,
        visitedPlaces: updatedVisited,
        verifiedVisits: updatedVisits,
        stamps: updatedStamps,
        unlockedBadgeIds: currentBadges,
        questsStatus: updatedQuests,
        lastGpsCheckIn: {
          lat: userCoords.lat,
          lng: userCoords.lng,
          verifiedAt: nowIso
        }
      };
    });

    // 4. Efek Perayaan Confetti Mewah
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C99B52', '#9E1C64', '#2C221E', '#E8B86D', '#FFFFFF']
      });
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      message: securityCheck.message,
      distanceMeters: securityCheck.distanceMeters,
      unlockedBadges: unlockedBadgesList,
      placeName: place.name
    };
  };

  const markPlaceVisited = (placeId) => {
    setCultureBook((prev) => {
      if (prev.visitedPlaces.includes(placeId)) return prev;
      const updated = [...prev.visitedPlaces, placeId];
      const { updatedQuests, newlyUnlockedBadges } = evaluateQuests(
        updated,
        prev.questsStatus || {},
        prev.unlockedBadgeIds || []
      );
      return {
        ...prev,
        visitedPlaces: updated,
        questsStatus: updatedQuests,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, ...newlyUnlockedBadges]
      };
    });
  };

  const markChapterRead = (placeId, chapterId) => {
    setCultureBook((prev) => {
      const currentPlaceChapters = prev.readChapters[placeId] || [];
      if (currentPlaceChapters.includes(chapterId)) return prev;

      const updatedChapters = [...currentPlaceChapters, chapterId];
      const updatedReadChapters = {
        ...prev.readChapters,
        [placeId]: updatedChapters
      };

      const updatedVisited = prev.visitedPlaces.includes(placeId)
        ? prev.visitedPlaces
        : [...prev.visitedPlaces, placeId];

      const { updatedQuests, newlyUnlockedBadges } = evaluateQuests(
        updatedVisited,
        prev.questsStatus || {},
        prev.unlockedBadgeIds || []
      );

      return {
        ...prev,
        visitedPlaces: updatedVisited,
        readChapters: updatedReadChapters,
        questsStatus: updatedQuests,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, ...newlyUnlockedBadges]
      };
    });
  };

  const unlockStamp = (place) => {
    if (!place) return;
    setCultureBook((prev) => {
      const exists = prev.stamps.some((s) => s.placeId === place.id);
      if (exists) return prev;

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#C99B52', '#9E1C64', '#2C221E', '#E7DCB9']
        });
      } catch (err) {}

      return {
        ...prev,
        stamps: [
          ...prev.stamps,
          {
            placeId: place.id,
            title: place.passportStamp?.title || place.name,
            symbol: place.passportStamp?.symbol || 'JK',
            unlockedAt: new Date().toISOString()
          }
        ]
      };
    });
  };

  const toggleFavorite = (placeId) => {
    setCultureBook((prev) => {
      const isFav = prev.favorites.includes(placeId);
      return {
        ...prev,
        favorites: isFav
          ? prev.favorites.filter((id) => id !== placeId)
          : [...prev.favorites, placeId]
      };
    });
  };

  const saveUserNote = (placeId, text) => {
    setCultureBook((prev) => ({
      ...prev,
      userNotes: {
        ...prev.userNotes,
        [placeId]: text
      }
    }));
  };

  const hasStamp = (placeId) => {
    return cultureBook.stamps.some((s) => s.placeId === placeId);
  };

  const isFavorite = (placeId) => {
    return cultureBook.favorites.includes(placeId);
  };

  const isBadgeUnlocked = (badgeId) => {
    return (cultureBook.unlockedBadgeIds || []).includes(badgeId);
  };

  const isGpsVerified = (placeId) => {
    return (cultureBook.verifiedVisits || []).some((v) => v.placeId === placeId);
  };

  const getVerifiedVisitData = (placeId) => {
    return (cultureBook.verifiedVisits || []).find((v) => v.placeId === placeId);
  };

  /**
   * Menghitung statistik perolehan badge berdasarkan 4 tingkatan (Umum, Langka, Epic, Legendaris)
   */
  const getBadgeTierStats = () => {
    const unlockedIds = cultureBook.unlockedBadgeIds || [];
    const stats = {
      umum: { total: 0, unlocked: 0 },
      langka: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 },
      legendaris: { total: 0, unlocked: 0 }
    };

    CULTURAL_BADGES.forEach((b) => {
      if (stats[b.tier]) {
        stats[b.tier].total += 1;
        if (unlockedIds.includes(b.id)) {
          stats[b.tier].unlocked += 1;
        }
      }
    });

    return stats;
  };

  const getStats = (totalPlacesCount = 8) => {
    const visitedCount = cultureBook.visitedPlaces.length;
    const stampsCount = cultureBook.stamps.length;
    const gpsVerifiedCount = (cultureBook.verifiedVisits || []).length;
    const badgesCount = (cultureBook.unlockedBadgeIds || []).length;

    let totalChaptersRead = 0;
    Object.values(cultureBook.readChapters).forEach((arr) => {
      totalChaptersRead += arr.length;
    });

    const completionRate = Math.min(
      100,
      Math.round(((visitedCount + stampsCount * 2 + badgesCount * 2) / (totalPlacesCount * 5)) * 100)
    );

    return {
      visitedCount,
      stampsCount,
      gpsVerifiedCount,
      badgesCount,
      totalChaptersRead,
      completionRate
    };
  };

  return (
    <CultureBookContext.Provider
      value={{
        cultureBook,
        markPlaceVisited,
        markChapterRead,
        unlockStamp,
        verifyGpsVisit,
        toggleFavorite,
        saveUserNote,
        hasStamp,
        isFavorite,
        isBadgeUnlocked,
        isGpsVerified,
        getVerifiedVisitData,
        getBadgeTierStats,
        getStats,
        isAudioEnabled,
        setIsAudioEnabled,
        activeSoundType,
        setActiveSoundType,
        resetAllBadges
      }}
    >
      {children}
    </CultureBookContext.Provider>
  );
}

export function useCultureBook() {
  const context = useContext(CultureBookContext);
  if (!context) {
    throw new Error('useCultureBook must be used within CultureBookProvider');
  }
  return context;
}
