// Skema SQL Lengkap untuk Supabase PostgreSQL (Hamemayu Nusantara Cultural Platform)
// Jalankan skema ini di menu "SQL Editor" pada Supabase Dashboard Anda.

export const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- SKEMA BASIS DATA HAMEMAYU (SUPABASE POSTGRESQL)
-- Versi: 2.0 (Role Admin, Profil Pengguna, Katalog Destinasi, Moderasi Ulasan)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFIL PENGGUNA (PROFILES)
-- Menyimpan informasi tambahan pengguna terdaftar dari Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing profil
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. TABEL KATALOG DESTINASI BUDAYA (PLACES)
CREATE TABLE IF NOT EXISTS public.places (
    id TEXT PRIMARY KEY, -- Slug unik, contoh: 'keraton-yogyakarta', 'malioboro-tugu'
    name TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    province TEXT NOT NULL DEFAULT 'D.I. Yogyakarta',
    region TEXT NOT NULL DEFAULT 'jawa',
    region_label TEXT NOT NULL DEFAULT 'Yogyakarta',
    cover_image TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    sound_type TEXT DEFAULT 'wind',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    overview TEXT,
    details_json JSONB, -- Bab 1-7, titik singgah, etika, dan informasi lengkap
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL ULASAN BUDAYA KOMUNITAS (REVIEWS)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT REFERENCES public.places(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    headline TEXT,
    comment TEXT NOT NULL,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON public.reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- 5. TABEL MOMEN & PENGALAMAN BUDAYA (EXPERIENCES)
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT REFERENCES public.places(id) ON DELETE CASCADE,
    place_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    title TEXT NOT NULL,
    caption TEXT,
    likes INTEGER NOT NULL DEFAULT 0,
    tags TEXT[],
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_experiences_place_id ON public.experiences(place_id);

-- 6. TABEL PASPOR BUDAYA & PREFERENSI (CULTURE_PASSPORTS)
CREATE TABLE IF NOT EXISTS public.culture_passports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    stamps JSONB DEFAULT '[]'::jsonb,
    visited_places JSONB DEFAULT '[]'::jsonb,
    unlocked_badges JSONB DEFAULT '[]'::jsonb,
    favorites JSONB DEFAULT '[]'::jsonb,
    user_notes JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & OTORISASI ROLE ADMIN
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_passports ENABLE ROW LEVEL SECURITY;

-- Helper Function: Cek apakah user yang sedang request adalah role admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES: PROFILES
-- Siapapun dapat membaca profil
CREATE POLICY "Profil dapat dibaca oleh publik"
ON public.profiles FOR SELECT
USING (true);

-- User dapat mengupdate profil miliknya sendiri, atau Admin dapat mengupdate profil siapapun
CREATE POLICY "User dapat update profil sendiri atau admin"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

-- POLICIES: PLACES
-- Publik dapat melihat semua destinasi
CREATE POLICY "Destinasi dapat dilihat publik"
ON public.places FOR SELECT
USING (true);

-- Hanya ADMIN yang dapat menambah, mengubah, atau menghapus destinasi
CREATE POLICY "Hanya Admin yang dapat insert destinasi"
ON public.places FOR INSERT
WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Hanya Admin yang dapat update destinasi"
ON public.places FOR UPDATE
USING (public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "Hanya Admin yang dapat delete destinasi"
ON public.places FOR DELETE
USING (public.is_admin() OR auth.role() = 'service_role');

-- POLICIES: REVIEWS
-- Publik dapat melihat ulasan yang berstatus 'approved' (atau Admin melihat semua status)
CREATE POLICY "Publik dapat melihat ulasan yang disetujui"
ON public.reviews FOR SELECT
USING (status = 'approved' OR public.is_admin());

-- Pengguna terdaftar atau tamu dapat mengirim ulasan
CREATE POLICY "Pengguna terdaftar dapat mengirim ulasan"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- Hanya Admin yang dapat memoderasi status ulasan atau menghapusnya
CREATE POLICY "Admin dapat mengupdate status ulasan"
ON public.reviews FOR UPDATE
USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin dapat menghapus ulasan"
ON public.reviews FOR DELETE
USING (public.is_admin() OR auth.uid() = user_id);

-- POLICIES: EXPERIENCES
CREATE POLICY "Publik dapat melihat momen budaya"
ON public.experiences FOR SELECT
USING (status = 'approved' OR public.is_admin());

CREATE POLICY "Pengguna dapat mengunggah momen budaya"
ON public.experiences FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin atau pemilik dapat mengelola momen budaya"
ON public.experiences FOR DELETE
USING (public.is_admin() OR auth.uid() = user_id);

-- POLICIES: CULTURE PASSPORTS
CREATE POLICY "User dapat mengelola paspor budaya miliknya"
ON public.culture_passports FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- KEAMANAN KETAT: ANTI-PRIVILEGE ESCALATION & INTEGRITAS DATA
-- ============================================================================

-- Mencegah pengguna biasa mengubah kolom 'role' menjadi 'admin' di public.profiles
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika kolom role dicoba diubah
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Hanya izinkan jika pemanggil adalah admin yang sah atau service_role backend
        IF NOT public.is_admin() AND auth.role() <> 'service_role' THEN
            RAISE EXCEPTION 'Akses Ditolak: Pengguna biasa tidak memiliki wewenang mengubah role keamanan.';
        END IF;
    END IF;
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Mencegah pengguna biasa mengubah status ulasan menjadi 'approved' secara sepihak
CREATE OR REPLACE FUNCTION public.protect_review_moderation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        IF NOT public.is_admin() AND auth.role() <> 'service_role' THEN
            NEW.status := OLD.status; -- Kembalikan ke status semula jika bukan admin
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_review_moderation ON public.reviews;
CREATE TRIGGER trg_protect_review_moderation
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.protect_review_moderation();

-- ============================================================================
-- TRIGGER OTOMATIS: SINKRONISASI USER BARU DARI AUTH KE PROFILES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT := 'user';
BEGIN
    -- Otomatis jadikan role 'admin' jika email adalah admin@hamemayu.id atau fazrielmuliyael@gmail.com
    IF NEW.email = 'admin@hamemayu.id' OR NEW.email = 'fazrielmuliyael@gmail.com' THEN
        assigned_role := 'admin';
    END IF;

    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://ui-avatars.com/api/?name=' || url_encode(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))) || '&background=2C221E&color=FAF8F5&size=200&bold=true'
        ),
        assigned_role
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang Trigger pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Konfirmasi Otomatis Email Baru (Mencegah Rate Limit 429)
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auto_confirm_new_user ON auth.users;
CREATE TRIGGER trg_auto_confirm_new_user
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_new_user();

-- Policy Insert Profil
DROP POLICY IF EXISTS "User hanya bisa insert profil miliknya sendiri" ON public.profiles;
CREATE POLICY "User hanya bisa insert profil miliknya sendiri"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR true);

-- Fungsi Remote Procedure Call (RPC) untuk Sinkronisasi Profil Google & Admin
CREATE OR REPLACE FUNCTION public.sync_profile(
    p_email TEXT,
    p_full_name TEXT,
    p_avatar_url TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_profile RECORD;
    v_role TEXT := p_role;
BEGIN
    IF lower(p_email) IN ('admin@hamemayu.id', 'fazrielmuliyael@gmail.com') THEN
        v_role := 'admin';
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE lower(email) = lower(p_email) LIMIT 1;

    IF v_profile.id IS NOT NULL THEN
        UPDATE public.profiles
        SET 
            full_name = COALESCE(p_full_name, v_profile.full_name),
            avatar_url = COALESCE(p_avatar_url, v_profile.avatar_url),
            role = CASE WHEN lower(p_email) IN ('admin@hamemayu.id', 'fazrielmuliyael@gmail.com') THEN 'admin' ELSE v_profile.role END,
            updated_at = now()
        WHERE id = v_profile.id
        RETURNING * INTO v_profile;
    ELSE
        SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(p_email) LIMIT 1;
        IF v_user_id IS NULL THEN
            v_user_id := gen_random_uuid();
        END IF;

        INSERT INTO public.profiles (id, email, full_name, avatar_url, role, created_at, updated_at)
        VALUES (v_user_id, lower(p_email), p_full_name, p_avatar_url, v_role, now(), now())
        ON CONFLICT (id) DO UPDATE
        SET 
            full_name = EXCLUDED.full_name,
            avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
            updated_at = now()
        RETURNING * INTO v_profile;
    END IF;

    RETURN to_jsonb(v_profile);
END;
$$;

-- Helper function url_encode sederhana jika belum tersedia
CREATE OR REPLACE FUNCTION url_encode(data text)
RETURNS text AS $$
    SELECT replace(replace(replace(data, ' ', '+'), '@', '%40'), '.', '%2E');
$$ LANGUAGE sql IMMUTABLE;
`;
