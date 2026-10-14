import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  supabase,
  isSupabaseConfigured,
  fetchProfilesFromSupabase,
  updateUserRoleInSupabase
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

// Pre-seeded Google Accounts (Primary: Gabriel's Google Account dengan Role Admin)
const DEFAULT_GOOGLE_ACCOUNTS = [
  {
    id: 'google-fazrielmuliyael',
    name: 'fazriel muliyael (Admin)',
    email: 'fazrielmuliyael@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=fazriel+muliyael&background=2C221E&color=FAF8F5&size=200&bold=true',
    role: 'admin',
    provider: 'google',
    joinedAt: '2026-01-10T08:00:00.000Z'
  }
];

// Akun Admin Sistem Utama (Tanpa akun dummy penjelajah)
const DEFAULT_SEED_USERS = [
  {
    id: 'user-admin-1',
    name: 'Gabriel (Administrator)',
    email: 'admin@jogjakrama.id',
    password: 'adminpassword123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    role: 'admin',
    joinedAt: '2026-01-01T00:00:00.000Z'
  }
];

export function AuthProvider({ children }) {
  // 0. Google OAuth Client ID
  const [googleClientId, setGoogleClientId] = useState(() => {
    const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
    if (envId && !envId.startsWith(' ISI_DENGAN_')) return envId;
    try {
      return (localStorage.getItem(STORAGE_GOOGLE_CLIENT_ID_KEY) || '').trim();
    } catch (e) {
      return '';
    }
  });

  // Saved Google Accounts
  const [googleAccounts, setGoogleAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOOGLE_ACCOUNTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPrimary = parsed.some(
            (a) => a.email.toLowerCase() === 'fazrielmuliyael@gmail.com'
          );
          return hasPrimary ? parsed : [...DEFAULT_GOOGLE_ACCOUNTS, ...parsed];
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
          // Pastikan admin@jogjakrama.id selalu ada di daftar users
          const hasAdmin = parsed.some((u) => u.email.toLowerCase() === 'admin@jogjakrama.id');
          if (!hasAdmin) {
            return [DEFAULT_SEED_USERS[0], ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading users from localStorage:', e);
    }
    return DEFAULT_SEED_USERS;
  });

  // 2. Active Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading active session:', e);
    }
    return null;
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

  // Sync session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Error syncing session:', e);
    }
  }, [currentUser]);

  // SINKRONISASI SESSI DENGAN SUPABASE AUTH (JIKA AKTIF)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

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
        setCurrentUser(null);
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
        userEmail === 'admin@jogjakrama.id' || userEmail === 'fazrielmuliyael@gmail.com';

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
    const guestSession = {
      id: 'guest-user',
      name: 'Tamu Penjelajah (Guest)',
      email: 'guest@jogjakrama.id',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest',
      role: 'guest',
      isGuest: true,
      joinedAt: new Date().toISOString()
    };
    setCurrentUser(guestSession);
    setIsAuthModalOpen(false);

    if (pendingBenefitAction && typeof pendingBenefitAction === 'function') {
      try {
        pendingBenefitAction();
      } catch (err) {
        console.error('Error executing pending benefit action:', err);
      }
      setPendingBenefitAction(null);
    }

    return guestSession;
  }, [pendingBenefitAction]);

  // Login implementation (Strict Supabase Auth Verification — No Auto-Creation Bypass)
  const login = useCallback(
    async (email, password) => {
      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedPass = (password || '').trim();

      if (!trimmedEmail) throw new Error('Silakan masukkan alamat email Anda.');
      if (!trimmedPass) throw new Error('Silakan masukkan kata sandi Anda.');

      // 1. Verifikasi resmi melalui Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass
        });

        if (error) {
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
        trimmedEmail === 'admin@jogjakrama.id' || trimmedEmail === 'fazrielmuliyael@gmail.com'
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

      setUsers((prev) => [...prev, newUser]);

      const sessionData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
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
        emailLower === 'fazrielmuliyael@gmail.com' || emailLower === 'admin@jogjakrama.id';

      const avatarUrl =
        accountInput?.avatar ||
        existing?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=2C221E&color=FAF8F5&size=200&bold=true`;

      // 1. Sinkronisasi ke Supabase Auth & PostgreSQL Profiles (Jika Supabase aktif)
      let supabaseUserId = null;
      if (isSupabaseConfigured && supabase) {
        try {
          const oauthPwd = `google-oauth-${emailLower}-2026!`;
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: emailLower,
            password: oauthPwd
          });

          if (signInData?.user) {
            supabaseUserId = signInData.user.id;
          } else if (signInErr) {
            // Jika belum terdaftar di Supabase Auth, buatkan akun resmi
            const { data: signUpData } = await supabase.auth.signUp({
              email: emailLower,
              password: oauthPwd,
              options: {
                data: {
                  full_name: displayName,
                  avatar_url: avatarUrl
                }
              }
            });
            if (signUpData?.user) {
              supabaseUserId = signUpData.user.id;
            }
          }
        } catch (supaErr) {
          console.warn('[Supabase Google Sync]', supaErr);
        }
      }

      const googleAccountObj = {
        id: supabaseUserId || existing?.id || accountInput?.id || `google-${Date.now()}`,
        name: displayName,
        email: emailLower,
        password: existing?.password || 'google-oauth-verified',
        avatar: avatarUrl,
        role: isGabrielAdmin ? 'admin' : (existing?.role || 'user'),
        provider: 'google',
        joinedAt: existing?.joinedAt || accountInput?.joinedAt || new Date().toISOString()
      };

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
                  emailLower === 'fazrielmuliyael@gmail.com' || emailLower === 'admin@jogjakrama.id';

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
                  joinedAt: googleUserRecord.joinedAt
                };

                // Sync ke Supabase Auth & PostgreSQL Profiles
                if (isSupabaseConfigured && supabase) {
                  try {
                    const oauthPwd = `google-oauth-${emailLower}-2026!`;
                    const { error: signInErr } = await supabase.auth.signInWithPassword({
                      email: emailLower,
                      password: oauthPwd
                    });
                    if (signInErr) {
                      await supabase.auth.signUp({
                        email: emailLower,
                        password: oauthPwd,
                        options: {
                          data: {
                            full_name: profile.name || emailLower.split('@')[0],
                            avatar_url: profile.picture || googleUserRecord.avatar
                          }
                        }
                      });
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

  // Fast Demo Login
  const loginWithDemo = useCallback(
    (demoUserIndex = 0) => {
      const target = DEFAULT_SEED_USERS[demoUserIndex] || DEFAULT_SEED_USERS[1];
      return login(target.email, target.password);
    },
    [login]
  );

  // Fast Admin Login Shortcut
  const loginWithAdminDemo = useCallback(() => {
    return login('admin@jogjakrama.id', 'adminpassword123');
  }, [login]);

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
    setCurrentUser(null);
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

  // Status Role Admin Aktif
  const isAdmin = Boolean(
    currentUser &&
      (currentUser.role === 'admin' ||
        currentUser.role === 'Administrator' ||
        currentUser.email === 'admin@jogjakrama.id' ||
        currentUser.email === 'fazrielmuliyael@gmail.com')
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
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
        loginWithDemo,
        loginWithAdminDemo,
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
