import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  isSupabaseConfigured,
  fetchReviewsFromSupabase,
  insertReviewToSupabase,
  updateReviewStatusInSupabase,
  deleteReviewFromSupabase,
  fetchExperiencesFromSupabase,
  insertExperienceToSupabase,
  deleteExperienceFromSupabase
} from '../lib/supabase';

const CommunityContext = createContext(null);

const STORAGE_REVIEWS_KEY = 'jogjakrama_community_reviews_v2';
const STORAGE_EXPERIENCES_KEY = 'jogjakrama_shared_experiences_v3';

export function CommunityProvider({ children }) {
  // Reviews state (Murni dari Supabase / submission asli, tanpa dummy)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading community reviews:', e);
    }
    return [];
  });

  // Shared experiences state (Murni dari Supabase / submission asli, tanpa dummy)
  const [experiences, setExperiences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXPERIENCES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading shared experiences:', e);
    }
    return [];
  });

  // Sync dengan Supabase PostgreSQL
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Ambil ulasan dari Supabase
    fetchReviewsFromSupabase().then((remoteRevs) => {
      if (remoteRevs) {
        const mapped = remoteRevs.map((r) => ({
          id: r.id,
          placeId: r.place_id,
          userId: r.user_id,
          userName: r.user_name,
          userAvatar: r.user_avatar,
          rating: r.rating,
          headline: r.headline,
          comment: r.comment,
          photoUrl: r.photo_url,
          status: r.status || 'approved',
          likes: r.likes || 0,
          date: r.created_at
        }));
        setReviews(mapped);
      }
    });

    // 2. Ambil momen pengalaman dari Supabase
    fetchExperiencesFromSupabase().then((remoteExps) => {
      if (remoteExps) {
        const mapped = remoteExps.map((e) => ({
          id: e.id,
          placeId: e.place_id,
          placeName: e.place_name,
          userId: e.user_id,
          userName: e.user_name,
          userAvatar: e.user_avatar,
          mediaType: e.media_type || 'image',
          mediaUrl: e.media_url,
          title: e.title,
          caption: e.caption,
          likes: e.likes || 0,
          tags: e.tags || [],
          status: e.status || 'approved',
          date: e.created_at
        }));
        setExperiences(mapped);
      }
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXPERIENCES_KEY, JSON.stringify(experiences));
    } catch (e) {
      console.error('Error saving experiences:', e);
    }
  }, [experiences]);

  // Method: Tambah ulasan baru
  const addReview = async ({ placeId, rating, comment, headline, user }) => {
    if (!placeId || !rating || !comment.trim()) return false;

    const activeUser = user || {
      id: 'guest-user',
      name: 'Tamu Penjelajah (Guest)',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest'
    };

    const newRev = {
      id: 'rev-' + Date.now(),
      placeId,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      rating: Number(rating),
      headline: headline || `Pengalaman oleh ${activeUser.name}`,
      comment: comment.trim(),
      date: new Date().toISOString(),
      status: 'approved',
      likes: 0
    };

    setReviews((prev) => [newRev, ...prev]);

    if (isSupabaseConfigured) {
      await insertReviewToSupabase(newRev);
    }

    return newRev;
  };

  // Method: Moderasi ulasan (Khusus Role Admin)
  const moderateReview = useCallback(async (reviewId, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );

    if (isSupabaseConfigured) {
      await updateReviewStatusInSupabase(reviewId, newStatus);
    }
    return true;
  }, []);

  // Method: Hapus ulasan
  const deleteReview = useCallback(async (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    if (isSupabaseConfigured) {
      await deleteReviewFromSupabase(reviewId);
    }
    return true;
  }, []);

  // Method: Like ulasan
  const toggleLikeReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );
  };

  // Method: Tambah momen pengalaman
  const addExperience = async ({ placeId, placeName, mediaType = 'image', mediaUrl, caption, tags = [], user }) => {
    if (!placeId || !mediaUrl || !caption.trim()) return false;

    const activeUser = user || {
      id: 'guest-user',
      name: 'Tamu Penjelajah (Guest)',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest'
    };

    const newExp = {
      id: 'exp-' + Date.now(),
      placeId,
      placeName: placeName || 'Destinasi Yogyakarta',
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      mediaType,
      mediaUrl,
      caption: caption.trim(),
      date: new Date().toISOString(),
      status: 'approved',
      likes: 0,
      tags: tags.length ? tags : ['JogjaKrama', 'MomenBudaya']
    };

    setExperiences((prev) => [newExp, ...prev]);

    if (isSupabaseConfigured) {
      await insertExperienceToSupabase(newExp);
    }

    return newExp;
  };

  // Method: Hapus momen pengalaman
  const deleteExperience = useCallback(async (expId) => {
    setExperiences((prev) => prev.filter((e) => e.id !== expId));

    if (isSupabaseConfigured) {
      await deleteExperienceFromSupabase(expId);
    }
    return true;
  }, []);

  // Method: Like momen pengalaman
  const toggleLikeExperience = (expId) => {
    setExperiences((prev) =>
      prev.map((item) => {
        if (item.id === expId) {
          return { ...item, likes: item.likes + 1 };
        }
        return item;
      })
    );
  };

  // Helper getters
  const getPlaceReviews = (placeId) => {
    return reviews.filter((r) => r.placeId === placeId && r.status !== 'rejected');
  };

  const getPlaceRatingSummary = (placeId) => {
    const placeRevs = getPlaceReviews(placeId);
    if (!placeRevs.length) return { average: 5.0, count: 0 };
    const sum = placeRevs.reduce((acc, r) => acc + (r.rating || 5), 0);
    const average = Number((sum / placeRevs.length).toFixed(1));
    return { average, count: placeRevs.length };
  };

  const getPlaceExperiences = (placeId) => {
    return experiences.filter((e) => e.placeId === placeId);
  };

  return (
    <CommunityContext.Provider
      value={{
        reviews,
        experiences,
        addReview,
        moderateReview,
        deleteReview,
        toggleLikeReview,
        addExperience,
        deleteExperience,
        toggleLikeExperience,
        getPlaceReviews,
        getPlaceRatingSummary,
        getPlaceExperiences
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
