import { createClient } from '@supabase/supabase-js';

// Kunci Publik & URL Produksi Supabase JogjaKrama (Aman untuk Client-Side Bundle)
const PROD_SUPABASE_URL = 'https://jqoecxfqbdmqecerbjey.supabase.co';
const PROD_SUPABASE_KEY = 'sb_publishable_V44TT0vxmbyKWbkK56O_6g_cCHePCae';

// Ambil URL dan Kunci API dari Environment Variables Vite (.env) atau default produksi Vercel
const envUrl = (import.meta.env.VITE_SUPABASE_URL || PROD_SUPABASE_URL).trim();
const envKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  PROD_SUPABASE_KEY
).trim();

// Cek apakah konfigurasi Supabase valid (bukan placeholder kosong)
export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  !envUrl.includes('YOUR_SUPABASE') &&
  !envKey.includes('YOUR_SUPABASE') &&
  envUrl.startsWith('https://')
);

// Inisialisasi Supabase Client dengan opsi auth persistensi lokal
export const supabase = isSupabaseConfigured
  ? createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Mendapatkan status konfigurasi Supabase saat ini
 */
export function getSupabaseConfigStatus() {
  return {
    configured: isSupabaseConfigured,
    url: envUrl ? `${envUrl.substring(0, 25)}...` : 'Belum diisi (.env)',
    hasKey: Boolean(envKey)
  };
}

/**
 * ============================================================================
 * LAYANAN SUPABASE: KATALOG DESTINASI BUDAYA (PLACES)
 * ============================================================================
 */

export async function fetchPlacesFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Gagal mengambil destinasi:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error saat fetch places:', err);
    return null;
  }
}

export async function insertPlaceToSupabase(place) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const dbPayload = {
      id: place.id,
      name: place.name,
      subtitle: place.subtitle || '',
      province: place.province || 'D.I. Yogyakarta',
      region: place.region || 'jawa',
      region_label: place.regionLabel || 'Yogyakarta',
      cover_image: place.coverImage || place.thumbnail || '',
      thumbnail: place.thumbnail || place.coverImage || '',
      sound_type: place.soundType || 'wind',
      latitude: place.coordinates?.lat || -7.8,
      longitude: place.coordinates?.lng || 110.37,
      overview: place.chapter01?.overview || place.subtitle || '',
      details_json: place
    };

    const { data, error } = await supabase
      .from('places')
      .upsert(dbPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error insert place:', err.message);
    return { success: false, error: err.message };
  }
}

export async function deletePlaceFromSupabase(placeId) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', placeId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Error delete place:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * LAYANAN SUPABASE: ULASAN & MODERASI (REVIEWS)
 * ============================================================================
 */

export async function fetchReviewsFromSupabase(placeId = null) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (placeId) {
      query = query.or(`place_id.eq.${placeId},headline.ilike.[pid:${placeId}]%`);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Gagal mengambil ulasan:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error fetch reviews:', err);
    return null;
  }
}

export async function insertReviewToSupabase(review) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    // Validasi apakah userId adalah format UUID resmi agar tidak ditolak PostgreSQL
    const isValidUUID =
      typeof review.userId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(review.userId);

    const dbPayload = {
      place_id: review.placeId || null,
      user_id: isValidUUID ? review.userId : null,
      user_name: review.userName || 'Penjelajah Budaya',
      user_avatar: review.userAvatar || '',
      rating: review.rating || 5,
      headline: review.headline || '',
      comment: review.comment,
      photo_url: review.photoUrl || null,
      status: review.status || 'approved',
      likes: review.likes || 0
    };

    // Percobaan 1: Insert langsung dengan place_id
    let { data, error } = await supabase.from('reviews').insert(dbPayload).select().single();

    // Jika terjadi error foreign key constraint (23503: place_id belum di-seed di tabel places)
    if (error && error.code === '23503' && review.placeId) {
      const fallbackPayload = {
        ...dbPayload,
        place_id: null,
        headline: `[pid:${review.placeId}] ${dbPayload.headline}`.trim()
      };
      const fallbackRes = await supabase.from('reviews').insert(fallbackPayload).select().single();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error insert review:', err.message);
    return { success: false, error: err.message };
  }
}

export async function updateReviewStatusInSupabase(reviewId, status) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error update review status:', err.message);
    return { success: false, error: err.message };
  }
}

export async function deleteReviewFromSupabase(reviewId) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Error delete review:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * LAYANAN SUPABASE: MANAJEMEN ROLE & PROFIL PENGGUNA (PROFILES)
 * ============================================================================
 */

export async function fetchProfilesFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Gagal mengambil data profiles:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error fetch profiles:', err);
    return null;
  }
}

export async function updateUserRoleInSupabase(userId, newRole) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error updating user role:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sinkronisasi Profil Pengguna (Google Sign-In / OAuth / Pendaftaran) ke Supabase
 */
export async function syncProfileToSupabase({ id, email, fullName, avatarUrl, role }) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return { success: false, error: 'Email missing' };

  const targetRole =
    cleanEmail === 'fazriel@admin.com' ||
    cleanEmail === 'admin@jogjakrama.id' ||
    cleanEmail === 'fazrielmuliyael@gmail.com'
      ? 'admin'
      : (role || 'user');

  try {
    // 1. Cek apakah profil sudah ada di Supabase
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      const { data: updated, error: updateErr } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || existingProfile.full_name,
          avatar_url: avatarUrl || existingProfile.avatar_url,
          role: targetRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .maybeSingle();

      if (!updateErr && updated) {
        return { success: true, data: updated };
      }
    }

    // 2. Coba gunakan PostgreSQL RPC jika fungsi sync_profile terpasang di database
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('sync_profile', {
        p_email: cleanEmail,
        p_full_name: fullName || cleanEmail.split('@')[0],
        p_avatar_url: avatarUrl || null,
        p_role: targetRole
      });

      if (!rpcError && rpcData) {
        return { success: true, data: rpcData };
      }
    } catch (e) {
      // RPC mungkin belum terpasang di database, lanjut ke fallback
    }

    // 3. Fallback: Autentikasi / Pendaftaran via Supabase Auth
    const oauthPwd = `google-oauth-${cleanEmail}-2026!`;
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: oauthPwd
    });

    if (signInData?.user) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .maybeSingle();

      if (userProfile) return { success: true, data: userProfile };
    } else {
      const { data: signUpData } = await supabase.auth.signUp({
        email: cleanEmail,
        password: oauthPwd,
        options: {
          data: {
            full_name: fullName || cleanEmail.split('@')[0],
            avatar_url: avatarUrl || null
          }
        }
      });

      if (signUpData?.user) {
        return {
          success: true,
          data: {
            id: signUpData.user.id,
            email: cleanEmail,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: targetRole
          }
        };
      }
    }

    return { success: false, error: 'Database profiles sync fallback applied' };
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * LAYANAN SUPABASE: MOMEN & PENGALAMAN BUDAYA (EXPERIENCES)
 * ============================================================================
 */

export async function fetchExperiencesFromSupabase(placeId = null) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('experiences').select('*').order('created_at', { ascending: false });
    if (placeId) {
      query = query.eq('place_id', placeId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Gagal fetch experiences:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error fetch experiences:', err);
    return null;
  }
}

export async function insertExperienceToSupabase(exp) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const dbPayload = {
      place_id: exp.placeId,
      place_name: exp.placeName || '',
      user_id: exp.userId && !exp.userId.startsWith('guest-') ? exp.userId : null,
      user_name: exp.userName,
      user_avatar: exp.userAvatar || '',
      media_type: exp.mediaType || 'image',
      media_url: exp.mediaUrl,
      title: exp.title || '',
      caption: exp.caption || '',
      likes: exp.likes || 0,
      tags: exp.tags || [],
      status: exp.status || 'approved'
    };

    const { data, error } = await supabase.from('experiences').insert(dbPayload).select().single();
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error insert experience:', err.message);
    return { success: false, error: err.message };
  }
}

export async function deleteExperienceFromSupabase(expId) {
  if (!isSupabaseConfigured || !supabase) return { success: false, offline: true };
  try {
    const { error } = await supabase.from('experiences').delete().eq('id', expId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Error delete experience:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================================================
 * LAYANAN SUPABASE: PASPOR BUDAYA USER (CULTURE_PASSPORTS)
 * ============================================================================
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchCulturePassportFromSupabase(userId) {
  if (!isSupabaseConfigured || !supabase || !userId || !UUID_REGEX.test(userId)) return null;
  try {
    const { data, error } = await supabase
      .from('culture_passports')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Gagal mengambil culture passport:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error fetch culture passport:', err);
    return null;
  }
}

export async function saveCulturePassportToSupabase(userId, passportData) {
  if (!isSupabaseConfigured || !supabase || !userId || !UUID_REGEX.test(userId)) return null;
  try {
    const payload = {
      user_id: userId,
      stamps: passportData.stamps || [],
      visited_places: passportData.visitedPlaces || [],
      unlocked_badges: passportData.unlockedBadgeIds || [],
      favorites: passportData.favorites || [],
      user_notes: passportData.userNotes || {},
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('culture_passports')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('[Supabase] Error save culture passport:', err.message);
    return { success: false, error: err.message };
  }
}
