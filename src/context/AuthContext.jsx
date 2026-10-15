import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  supabase,
  isSupabaseConfigured,
  fetchProfilesFromSupabase,
  updateUserRoleInSupabase,
  syncProfileToSupabase
} from '../lib/supabase';

const AuthContext = createContext(null);

const STORAGE_SESSION_KEY = 'jogjakrama_active_session_v1';
const STORAGE_USERS_KEY = 'jogjakrama_registered_users_v1';
const STORAGE_GOOGLE_CLIENT_ID_KEY = 'jogjakrama_google_client_id';
const STORAGE_GOOGLE_ACCOUNTS_KEY = 'jogjakrama_google_accounts_v1';

// Ensure Google Identity Services script is loaded
function ensureGoogleScriptLoaded() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      resolve(window.google);
      return;
    }
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', () =>
        reject(new Error('Gagal memuat skrip Google Identity Services. Periksa koneksi internet Anda.'))
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error('Gagal memuat skrip Google Identity Services. Periksa koneksi internet Anda.'));
    document.head.appendChild(script);
  });
}

// Pre-seeded Google Accounts (Admin Utama: Admin)
const DEFAULT_GOOGLE_ACCOUNTS = [
  {
    id: '115ae06d-2b4f-4a37-a34c-a6c5d63f7e8c',
    name: 'Admin',
    email: 'fazriel@admin.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=2C221E&color=FAF8F5&size=200&bold=true',
    role: 'admin',
    provider: 'google',
    joinedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Sesi Default Tamu (Unauthenticated Guest)
export const GUEST_SESSION = {
  id: 'guest-user',
  name: 'Tamu Penjelajah (Guest)',
  email: 'guest@jogjakrama.id',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest',
  role: 'guest',
  isGuest: true,
  authenticated: false,
  joinedAt: '2026-01-01T00:00:00.000Z'
};

// Akun Sistem Utama (Admin)
const DEFAULT_SEED_USERS = [
  {
    id: '115ae06d-2b4f-4a37-a34c-a6c5d63f7e8c',
    name: 'Admin',
    email: 'fazriel@admin.com',
    password: 'admin123',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=2C221E&color=FAF8F5&size=200&bold=true',
    role: 'admin',
    joinedAt: '2026-01-01T00:00:00.000Z'
  }
];

export function AuthProvider({ children }) {
  // 0. Google OAuth Client ID
  const [googleClientId, setGoogleClientId] = useState(() => {
    const defaultGoogleId = '587175859464-50dpiafahcp7o21ljpeb4rdedqqjbc1n.apps.googleusercontent.com';
    const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || defaultGoogleId).trim();
    if (envId && !envId.startsWith(' ISI_DENGAN_')) return envId;
    try {
      return (localStorage.getItem(STORAGE_GOOGLE_CLIENT_ID_KEY) || defaultGoogleId).trim();
    } catch (e) {
      return defaultGoogleId;
    }
  });

  // Saved Google Accounts
  const [googleAccounts, setGoogleAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOOGLE_ACCOUNTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (a) =>
              a.email?.toLowerCase() !== 'admin@jogjakrama.id' &&
              a.email?.toLowerCase() !== 'fazrielmuliyael@gmail.com' &&
              a.email?.toLowerCase() !== 'fazrilkece258@gmail.com' &&
              a.email?.toLowerCase() !== 'zrealyael@gmail.com'
          );
          const hasPrimary = filtered.some(
            (a) => a.email?.toLowerCase() === 'fazriel@admin.com'
          );
          return hasPrimary ? filtered : [...DEFAULT_GOOGLE_ACCOUNTS, ...filtered];
        }
      }
    } catch (e) {
      console.error('Error loading Google accounts:', e);
    }
    return DEFAULT_GOOGLE_ACCOUNTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GOOGLE_ACCOUNTS_KEY, JSON.stringify(googleAccounts));
    } catch (e) {
      console.error('Error saving Google accounts:', e);
    }
  }, [googleAccounts]);

  const saveGoogleClientId = useCallback((newClientId) => {
    const cleaned = (newClientId || '').trim();
    setGoogleClientId(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(STORAGE_GOOGLE_CLIENT_ID_KEY, cleaned);
      } else {
        localStorage.removeItem(STORAGE_GOOGLE_CLIENT_ID_KEY);
      }
    } catch (e) {
      console.error('Error saving Google Client ID:', e);
    }
  }, []);

  // 1. Registered Users State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Bersihkan akun demo dan lama yang tidak diinginkan
          const filtered = parsed.filter(
            (u) =>
              u.email?.toLowerCase() !== 'admin@jogjakrama.id' &&
              u.email?.toLowerCase() !== 'fazrielmuliyael@gmail.com' &&
              u.email?.toLowerCase() !== 'fazrilkece258@gmail.com' &&
              u.email?.toLowerCase() !== 'zrealyael@gmail.com'
          );
          const cleaned = filtered.map((u) =>
            u.email?.toLowerCase() === 'fazriel@admin.com'
              ? {
                  ...u,
                  name: 'Admin',
                  avatar: 'https://ui-avatars.com/api/?name=Admin&background=2C221E&color=FAF8F5&size=200&bold=true'
                }
              : u
          );
          const hasAdmin = cleaned.some((u) => u.email?.toLowerCase() === 'fazriel@admin.com');
          if (!hasAdmin) {
            return [DEFAULT_SEED_USERS[0], ...cleaned];
          }
          return cleaned;
        }
      }
    } catch (e) {
      console.error('Error loading users from localStorage:', e);
    }
    return DEFAULT_SEED_USERS;
  });

  // 2. Active Session State (WAJIB GUEST / TAMU JIKA PENGUNJUNG BARU)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // HANYA gunakan sesi jika user BENAR-BENAR sudah pernah login (authenticated: true)
        // dan bukan sesi tamu atau akun lama yang tidak diinginkan
        if (
          parsed &&
          parsed.authenticated === true &&
          !parsed.isGuest &&
          parsed.email &&
          parsed.email.toLowerCase() !== 'guest@jogjakrama.id' &&
          parsed.email.toLowerCase() !== 'fazrielmuliyael@gmail.com' &&
          parsed.email.toLowerCase() !== 'fazrilkece258@gmail.com' &&
          parsed.email.toLowerCase() !== 'zrealyael@gmail.com' &&
          parsed.name !== 'Fazriel Muliyawan' &&
          parsed.name !== 'Fazriel Nadirat Radinka'
        ) {
          if (parsed.email.toLowerCase() === 'fazriel@admin.com') {
            parsed.name = 'Admin';
            parsed.role = 'admin';
            parsed.avatar = 'https://ui-avatars.com/api/?name=Admin&background=2C221E&color=FAF8F5&size=200&bold=true';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading active session:', e);
    }

    // Default mutlak saat pengunjung pertama kali membuka website: MODE TAMU (GUEST)
    return GUEST_SESSION;
  });

  // 3. Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalReason, setAuthModalReason] = useState({
    benefitType: 'general',
    title: 'Masuk ke Akun Anda',
    description: 'Akses penuh ke seluruh fitur eksklusif penjelajah JogjaKrama.'
  });

  const [pendingBenefitAction, setPendingBenefitAction] = useState(null);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  }, [users]);

  // Sync session to localStorage (HANYA jika terautentikasi dan bukan guest)
  useEffect(() => {
    try {
      if (currentUser && !currentUser.isGuest && currentUser.authenticated) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Error syncing session:', e);
    }
  }, [currentUser]);

  // SINKRONISASI SESSI DENGAN SUPABASE AUTH & PROFILES (JIKA AKTIF)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Ambil data profil dari Supabase agar akun terdaftar di database selalu muncul di aplikasi
    fetchProfilesFromSupabase().then((remoteProfiles) => {
      if (remoteProfiles && Array.isArray(remoteProfiles) && remoteProfiles.length > 0) {
        setUsers((prev) => {
          const merged = [...prev];
          remoteProfiles.forEach((rp) => {
            const idx = merged.findIndex(
              (u) => (u.email || '').toLowerCase() === (rp.email || '').toLowerCase()
            );
            const userObj = {
              id: rp.id,
              name: rp.full_name || (rp.email ? rp.email.split('@')[0] : 'Pengguna'),
              email: (rp.email || '').toLowerCase(),
              avatar: rp.avatar_url,
              role: rp.role || 'user',
              joinedAt: rp.created_at || new Date().toISOString()
            };
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...userObj };
            } else {
              merged.push(userObj);
            }

            // Sinkronkan session aktif jika akun yang sama terupdate di Supabase
            setCurrentUser((curr) => {
              if (curr && (curr.email || '').toLowerCase() === (rp.email || '').toLowerCase()) {
                return {
                  ...curr,
                  name: userObj.name,
                  avatar: userObj.avatar,
                  role: userObj.role
                };
              }
              return curr;
            });
          });
          return merged;
        });
      }
    });

    // Cek session aktif dari Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      } else if (_event === 'SIGNED_OUT') {
        setCurrentUser(GUEST_SESSION);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const syncSupabaseProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const userEmail = (authUser.email || '').toLowerCase();
      const isAdminEmail =
        userEmail === 'fazriel@admin.com' ||
        userEmail === 'admin@jogjakrama.id' ||
        userEmail === 'fazrielmuliyael@gmail.com';

      const determinedRole = profile?.role || (isAdminEmail ? 'admin' : 'user');

      const sessionData = {
        id: authUser.id,
        name:
          profile?.full_name ||
          authUser.user_metadata?.full_name ||
          userEmail.split('@')[0],
        email: userEmail,
        avatar:
          profile?.avatar_url ||
          authUser.user_metadata?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userEmail.split('@')[0]
          )}&background=2C221E&color=FAF8F5&size=200&bold=true`,
        role: determinedRole,
        isGuest: false,
        authenticated: true,
        provider: authUser.app_metadata?.provider || 'supabase',
        joinedAt: profile?.created_at || authUser.created_at || new Date().toISOString()
      };

      setCurrentUser(sessionData);
    } catch (err) {
      console.warn('Gagal sinkronisasi profil Supabase:', err);
    }
  };

  // Helper trigger confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C99B52', '#9E1C64', '#2C221E', '#E5B869']
      });
    } catch (e) {
      // silent
    }
  };

  // Modal controls
  const openLogin = useCallback((reasonObj, actionCallback = null) => {
    setAuthModalMode('login');
    if (reasonObj) {
      setAuthModalReason({
        benefitType: reasonObj.benefitType || 'general',
        title: reasonObj.title || 'Masuk ke Akun Anda',
        description: reasonObj.description || 'Akses fitur benefit eksklusif penjelajah JogjaKrama.'
      });
    } else {
      setAuthModalReason({
        benefitType: 'general',
        title: 'Masuk ke Akun Anda',
        description: 'Akses seluruh fitur penjelajah JogjaKrama secara lengkap.'
      });
    }
    if (actionCallback && typeof actionCallback === 'function') {
      setPendingBenefitAction(() => actionCallback);
    } else {
      setPendingBenefitAction(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const openRegister = useCallback((reasonObj, actionCallback = null) => {
    setAuthModalMode('register');
    if (reasonObj) {
      setAuthModalReason({
        benefitType: reasonObj.benefitType || 'general',
        title: reasonObj.title || 'Daftar Akun Baru',
        description: reasonObj.description || 'Buat akun untuk membuka semua fitur benefit penjelajah.'
      });
    } else {
      setAuthModalReason({
        benefitType: 'general',
        title: 'Daftar Akun Baru',
        description: 'Buat akun dalam beberapa detik untuk pengalaman terbaik di JogjaKrama.'
      });
    }
    if (actionCallback && typeof actionCallback === 'function') {
      setPendingBenefitAction(() => actionCallback);
    } else {
      setPendingBenefitAction(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingBenefitAction(null);
  }, []);

  // Strict Auth Guard: Melindungi aksi khusus member/admin
  const requireAuth = useCallback(
    (actionCallback, reason = null) => {
      if (!currentUser || currentUser.isGuest) {
        openLogin(
          reason || {
            benefitType: 'auth_required',
            title: 'Masuk ke Akun Terlebih Dahulu',
            description:
              'Anda harus memiliki akun terdaftar untuk melakukan aksi ini. Silakan masuk atau daftar akun baru.'
          },
          actionCallback
        );
        return false;
      }
      if (typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    },
    [currentUser, openLogin]
  );

  // Mode Tamu (Guest)
  const loginAsGuest = useCallback(() => {
    try {
      localStorage.removeItem('jogjakrama_culture_book_v4_guest-user');
      localStorage.removeItem('jogjakrama_culture_book_v4_guest');
      localStorage.removeItem('jogjakrama_culture_book_v3');
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (err) {}
    setCurrentUser(GUEST_SESSION);
    setIsAuthModalOpen(false);

    if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
      try {
        pendingBenefitAction();
      } catch (err) {
        console.error('Error executing pending benefit action:', err);
      }
      setPendingBenefitAction(null);
    }

    return GUEST_SESSION;
  }, [pendingBenefitAction]);

  // Login implementation (Strict Supabase Auth Verification with Master Admin Guarantee)
  const login = useCallback(
    async (email, password) => {
      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedPass = (password || '').trim();

      if (!trimmedEmail) throw new Error('Silakan masukkan alamat email Anda.');
      if (!trimmedPass) throw new Error('Silakan masukkan kata sandi Anda.');

      // 0. Autentikasi Master Admin Utama (fazriel@admin.com atau admin@jogjakrama.id)
      const isMasterAdmin =
        trimmedEmail === 'fazriel@admin.com' ||
        trimmedEmail === 'admin@jogjakrama.id';

      if (isMasterAdmin) {
        if (trimmedPass === 'admin123') {
          const adminSession = {
            id: '115ae06d-2b4f-4a37-a34c-a6c5d63f7e8c',
            name: 'Admin',
            email: trimmedEmail,
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=2C221E&color=FAF8F5&size=200&bold=true',
            role: 'admin',
            isGuest: false,
            authenticated: true,
            joinedAt: '2026-01-01T00:00:00.000Z'
          };
          setCurrentUser(adminSession);
          setIsAuthModalOpen(false);
          triggerCelebration();

          if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
            try {
              pendingBenefitAction();
            } catch (err) {
              console.error('Error executing pending benefit action:', err);
            }
            setPendingBenefitAction(null);
          }
          return adminSession;
        } else {
          throw new Error('Kata sandi admin tidak sesuai. Masukkan kata sandi admin yang benar.');
        }
      }

      // 1. Verifikasi resmi melalui Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass
        });

        if (error) {
          // Cek fallback akun lokal sebelum melempar error
          const localExisting = users.find((u) => u.email.toLowerCase() === trimmedEmail);
          if (localExisting && localExisting.password === trimmedPass) {
            const sessionData = {
              id: localExisting.id,
              name: localExisting.name,
              email: localExisting.email,
              avatar:
                localExisting.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  localExisting.name
                )}&background=2C221E&color=FAF8F5&size=200&bold=true`,
              role: localExisting.role || 'user',
              isGuest: false,
              authenticated: true,
              joinedAt: localExisting.joinedAt
            };
            setCurrentUser(sessionData);
            setIsAuthModalOpen(false);
            triggerCelebration();
            return sessionData;
          }

          const msg = (error.message || '').toLowerCase();
          if (
            msg.includes('invalid login credentials') ||
            msg.includes('invalid_credentials') ||
            msg.includes('invalid grant')
          ) {
            throw new Error(
              'Email atau kata sandi tidak sesuai. Jika Anda belum memiliki akun, silakan klik "Daftar Akun" di atas.'
            );
          }
          if (msg.includes('email not confirmed')) {
            throw new Error('Email Anda belum dikonfirmasi. Periksa kotak masuk/spam email Anda.');
          }
          throw new Error(error.message || 'Gagal masuk ke akun.');
        }

        if (data?.user) {
          await syncSupabaseProfile(data.user);
          setIsAuthModalOpen(false);
          triggerCelebration();

          if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
            try {
              pendingBenefitAction();
            } catch (err) {
              console.error(err);
            }
            setPendingBenefitAction(null);
          }
          return data.user;
        }
      }

      // 2. Mode fallback (HANYA jika akun memang sudah terdaftar di sistem)
      const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!existing) {
        throw new Error(
          'Akun dengan email ini belum terdaftar. Silakan klik tab "Daftar Akun" untuk membuat akun baru.'
        );
      }

      if (existing.password !== trimmedPass) {
        throw new Error('Kata sandi yang Anda masukkan salah.');
      }

      const sessionData = {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        avatar:
          existing.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            existing.name
          )}&background=2C221E&color=FAF8F5&size=200&bold=true`,
        role: existing.role || (existing.email === 'admin@jogjakrama.id' ? 'admin' : 'user'),
        isGuest: false,
        authenticated: true,
        joinedAt: existing.joinedAt
      };

      setCurrentUser(sessionData);
      setIsAuthModalOpen(false);
      triggerCelebration();

      if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
        try {
          pendingBenefitAction();
        } catch (err) {
          console.error('Error executing pending benefit action:', err);
        }
        setPendingBenefitAction(null);
      }

      return sessionData;
    },
    [users, pendingBenefitAction, syncSupabaseProfile]
  );

  // Register implementation (Pendaftaran Akun Baru Resmi ke Supabase Auth)
  const register = useCallback(
    async (name, email, password) => {
      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedName = (name || '').trim();
      const trimmedPass = (password || '').trim();

      if (!trimmedName) throw new Error('Nama lengkap tidak boleh kosong.');
      if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        throw new Error('Format alamat email tidak valid.');
      }
      if (!trimmedPass || trimmedPass.length < 6) {
        throw new Error('Kata sandi minimal terdiri dari 6 karakter.');
      }

      // 1. Daftarkan resmi ke Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPass,
          options: {
            data: {
              full_name: trimmedName,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                trimmedName
              )}&background=2C221E&color=FAF8F5&size=200&bold=true`
            }
          }
        });

        if (error) {
          const errMsg = error.message.toLowerCase();
          if (errMsg.includes('already registered') || errMsg.includes('already in use')) {
            throw new Error('Email ini sudah terdaftar. Silakan langsung masuk dengan kata sandi Anda.');
          }
          throw new Error(error.message);
        }

        if (data?.user) {
          try {
            localStorage.removeItem(`jogjakrama_culture_book_v4_${data.user.id}`);
            localStorage.removeItem('jogjakrama_culture_book_v3');
          } catch (err) {}
          await syncSupabaseProfile(data.user);
          setIsAuthModalOpen(false);
          triggerCelebration();

          if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
            try {
              pendingBenefitAction();
            } catch (err) {
              console.error(err);
            }
            setPendingBenefitAction(null);
          }
          return data.user;
        }
      }

      // 2. Mode fallback jika offline
      const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        throw new Error('Email ini sudah terdaftar. Silakan langsung masuk.');
      }

      const assignedRole =
        trimmedEmail === 'fazriel@admin.com' ||
        trimmedEmail === 'admin@jogjakrama.id' ||
        trimmedEmail === 'fazrielmuliyael@gmail.com'
          ? 'admin'
          : 'user';

      const newUser = {
        id: 'user-' + Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPass,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          trimmedName
        )}&background=2C221E&color=FAF8F5&size=200&bold=true`,
        role: assignedRole,
        joinedAt: new Date().toISOString()
      };

      // Reset semua badge untuk akun baru pengguna biasa agar mulai bersih dari 0
      try {
        localStorage.removeItem(`jogjakrama_culture_book_v4_${newUser.id}`);
        localStorage.removeItem('jogjakrama_culture_book_v3');
      } catch (err) {}

      setUsers((prev) => [...prev, newUser]);

      const sessionData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        isGuest: false,
        authenticated: true,
        joinedAt: newUser.joinedAt
      };

      setCurrentUser(sessionData);
      setIsAuthModalOpen(false);
      triggerCelebration();

      if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
        try {
          pendingBenefitAction();
        } catch (err) {
          console.error('Error executing pending benefit action:', err);
        }
        setPendingBenefitAction(null);
      }

      return sessionData;
    },
    [users, pendingBenefitAction]
  );

  // Direct Google Account Picker Sign-In
  const loginWithGoogleAccount = useCallback(
    async (accountInput) => {
      const emailLower = (accountInput?.email || '').trim().toLowerCase();
      if (!emailLower || !emailLower.includes('@')) {
        throw new Error('Masukkan alamat email Google (@gmail.com) yang valid.');
      }

      const displayName =
        (accountInput?.name || '').trim() || emailLower.split('@')[0].replace(/[._]/g, ' ');

      const existing = users.find((u) => u.email.toLowerCase() === emailLower);
      const isGabrielAdmin =
        emailLower === 'fazriel@admin.com' ||
        emailLower === 'fazrielmuliyael@gmail.com' ||
        emailLower === 'admin@jogjakrama.id';

      const avatarUrl =
        accountInput?.avatar ||
        existing?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=2C221E&color=FAF8F5&size=200&bold=true`;

      // 1. Sinkronisasi ke Supabase Auth & PostgreSQL Profiles (Jika Supabase aktif)
      let supabaseUserId = null;
      let remoteRole = null;
      if (isSupabaseConfigured && supabase) {
        try {
          const syncRes = await syncProfileToSupabase({
            email: emailLower,
            fullName: displayName,
            avatarUrl: avatarUrl,
            role: isGabrielAdmin ? 'admin' : (existing?.role || 'user')
          });
          if (syncRes.success && syncRes.data) {
            supabaseUserId = syncRes.data.id;
            remoteRole = syncRes.data.role;
          }
        } catch (supaErr) {
          console.warn('[Supabase Google Sync]', supaErr);
        }
      }

      const assignedRole =
        isGabrielAdmin
          ? 'admin'
          : (remoteRole || existing?.role || 'user');

      const googleAccountObj = {
        id: supabaseUserId || existing?.id || accountInput?.id || `google-${Date.now()}`,
        name: displayName,
        email: emailLower,
        password: existing?.password || 'google-oauth-verified',
        avatar: avatarUrl,
        role: assignedRole,
        provider: 'google',
        joinedAt: existing?.joinedAt || accountInput?.joinedAt || new Date().toISOString()
      };

      // Reset semua badge untuk akun Google baru pengguna biasa
      if (!isGabrielAdmin && !existing) {
        try {
          localStorage.removeItem(`jogjakrama_culture_book_v4_${googleAccountObj.id}`);
          localStorage.removeItem('jogjakrama_culture_book_v3');
        } catch (err) {}
      }

      setGoogleAccounts((prev) => {
        const existsInGoogle = prev.some((a) => a.email.toLowerCase() === emailLower);
        if (existsInGoogle) {
          return prev.map((a) =>
            a.email.toLowerCase() === emailLower ? { ...a, ...googleAccountObj } : a
          );
        }
        return [...prev, googleAccountObj];
      });

      setUsers((prev) => {
        const filtered = prev.filter((u) => u.email.toLowerCase() !== emailLower);
        return [...filtered, googleAccountObj];
      });

      const sessionData = {
        id: googleAccountObj.id,
        name: googleAccountObj.name,
        email: googleAccountObj.email,
        avatar: googleAccountObj.avatar,
        role: googleAccountObj.role,
        provider: 'google',
        isGuest: false,
        authenticated: true,
        joinedAt: googleAccountObj.joinedAt
      };

      setCurrentUser(sessionData);
      setIsAuthModalOpen(false);
      triggerCelebration();

      if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
        try {
          pendingBenefitAction();
        } catch (err) {
          console.error('Error executing pending benefit action:', err);
        }
        setPendingBenefitAction(null);
      }

      return sessionData;
    },
    [users, pendingBenefitAction]
  );

  // Official Google OAuth 2.0 Sign-In
  const loginWithGoogle = useCallback(
    async (overrideClientId) => {
      const activeClientId = (overrideClientId || googleClientId || '').trim();
      if (!activeClientId) throw new Error('GOOGLE_CLIENT_ID_MISSING');

      await ensureGoogleScriptLoaded();

      return new Promise((resolve, reject) => {
        try {
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: activeClientId,
            scope: 'openid email profile',
            prompt: 'select_account',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                reject(
                  new Error(
                    tokenResponse.error_description ||
                      `Login Google dibatalkan (${tokenResponse.error}).`
                  )
                );
                return;
              }

              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                if (!res.ok) throw new Error('Gagal mengambil profil akun Google Anda.');

                const profile = await res.json();
                const emailLower = (profile.email || '').toLowerCase();
                const isGabrielAdmin =
                  emailLower === 'fazriel@admin.com' ||
                  emailLower === 'fazrielmuliyael@gmail.com' ||
                  emailLower === 'admin@jogjakrama.id';

                const existing = users.find((u) => u.email.toLowerCase() === emailLower);

                const googleUserRecord = {
                  id: existing?.id || `google-${profile.sub}`,
                  name: profile.name || emailLower.split('@')[0],
                  email: emailLower,
                  password: existing?.password || `google-oauth-${profile.sub}`,
                  avatar:
                    profile.picture ||
                    existing?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      profile.name || 'Google'
                    )}`,
                  role: isGabrielAdmin ? 'admin' : (existing?.role || 'user'),
                  provider: 'google',
                  joinedAt: existing?.joinedAt || new Date().toISOString()
                };

                setUsers((prev) => {
                  const filtered = prev.filter((u) => u.email.toLowerCase() !== emailLower);
                  return [...filtered, googleUserRecord];
                });

                const sessionData = {
                  id: googleUserRecord.id,
                  name: googleUserRecord.name,
                  email: googleUserRecord.email,
                  avatar: googleUserRecord.avatar,
                  role: googleUserRecord.role,
                  provider: 'google',
                  isGuest: false,
                  authenticated: true,
                  joinedAt: googleUserRecord.joinedAt
                };

                // Sync ke Supabase Auth & PostgreSQL Profiles
                if (isSupabaseConfigured && supabase) {
                  try {
                    const syncRes = await syncProfileToSupabase({
                      email: emailLower,
                      fullName: profile.name || emailLower.split('@')[0],
                      avatarUrl: profile.picture || googleUserRecord.avatar,
                      role: googleUserRecord.role
                    });
                    if (syncRes.success && syncRes.data) {
                      if (syncRes.data.id) {
                        googleUserRecord.id = syncRes.data.id;
                        sessionData.id = syncRes.data.id;
                      }
                      if (syncRes.data.role) {
                        googleUserRecord.role = syncRes.data.role;
                        sessionData.role = syncRes.data.role;
                      }
                    }
                  } catch (supaErr) {
                    console.warn('[Supabase Sync Google]', supaErr);
                  }
                }

                setCurrentUser(sessionData);
                setIsAuthModalOpen(false);
                triggerCelebration();

                if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
                  try {
                    pendingBenefitAction();
                  } catch (err) {
                    console.error('Error executing pending benefit action:', err);
                  }
                  setPendingBenefitAction(null);
                }

                resolve(sessionData);
              } catch (fetchErr) {
                reject(fetchErr);
              }
            },
            error_callback: (err) => {
              reject(
                new Error(
                  err?.message || 'Popup login Google ditutup atau diblokir oleh browser.'
                )
              );
            }
          });

          tokenClient.requestAccessToken();
        } catch (initErr) {
          reject(
            new Error(
              initErr?.message ||
                'Gagal menginisialisasi Google OAuth. Pastikan Google Client ID valid.'
            )
          );
        }
      });
    },
    [googleClientId, users, pendingBenefitAction]
  );



  // Logout implementation
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        // ignore
      }
    }
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem('jogjakrama_passport_user_name');
    } catch (e) {}
    setCurrentUser(GUEST_SESSION);
    setPendingBenefitAction(null);
  }, []);

  // FUNGSI ROLE ADMIN: Toggle / Update Role Pengguna
  const toggleUserRole = useCallback(
    async (userId, targetRole) => {
      // 1. Update di local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
      );

      // Jika user yang diubah adalah yang sedang login
      if (currentUser && currentUser.id === userId) {
        setCurrentUser((prev) => ({ ...prev, role: targetRole }));
      }

      // 2. Jika Supabase terhubung, simpan ke database Supabase
      if (isSupabaseConfigured && supabase) {
        await updateUserRoleInSupabase(userId, targetRole);
      }
    },
    [currentUser]
  );

  // Status Role Admin Aktif (Wajib login dan terautentikasi)
  const isAdmin = Boolean(
    currentUser &&
      !currentUser.isGuest &&
      currentUser.authenticated &&
      (currentUser.role === 'admin' ||
        currentUser.role === 'Administrator' ||
        currentUser.email === 'fazriel@admin.com' ||
        currentUser.email === 'admin@jogjakrama.id' ||
        currentUser.email === 'fazrielmuliyael@gmail.com')
  );

  const isLoggedIn = Boolean(
    currentUser && !currentUser.isGuest && currentUser.authenticated
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        users,
        setUsers,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalReason,
        openLogin,
        openRegister,
        closeAuthModal,
        requireAuth,
        login,
        register,
        loginWithGoogle,
        loginWithGoogleAccount,
        googleAccounts,
        googleClientId,
        saveGoogleClientId,
        loginAsGuest,
        logout,
        toggleUserRole,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
