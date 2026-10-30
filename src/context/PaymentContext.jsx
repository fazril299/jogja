import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

const PaymentContext = createContext(null);

const STORAGE_PAYMENTS_KEY_PREFIX = 'hamemayu_user_payments_v1_';
const SESSION_ACTIVE_ORDER_KEY = 'hamemayu_active_payment_order_v1';

export function PaymentProvider({ children }) {
  const { currentUser, requireAuth } = useAuth();
  const currentUserId = currentUser?.id || 'guest';

  // Active payment checkout order with sessionStorage recovery on refresh
  const [activePaymentOrder, setActivePaymentOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_ACTIVE_ORDER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Track if payment route is active on page load
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      return rawHash.startsWith('pembayaran') || rawHash.startsWith('checkout');
    }
    return false;
  });

  const [selectedTicketToView, setSelectedTicketToView] = useState(null);

  // Return point reference before entering payment route
  const previousHashRef = useRef(
    typeof window !== 'undefined' &&
    window.location.hash &&
    !window.location.hash.includes('pembayaran') &&
    !window.location.hash.includes('checkout')
      ? window.location.hash
      : '#/home'
  );

  // Persist active order to sessionStorage so page refresh on #/pembayaran preserves checkout
  useEffect(() => {
    if (activePaymentOrder) {
      try {
        sessionStorage.setItem(SESSION_ACTIVE_ORDER_KEY, JSON.stringify(activePaymentOrder));
      } catch (e) {}
    } else {
      try {
        sessionStorage.removeItem(SESSION_ACTIVE_ORDER_KEY);
      } catch (e) {}
    }
  }, [activePaymentOrder]);

  // Load payment history per user
  const [paymentHistory, setPaymentHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PAYMENTS_KEY_PREFIX}${currentUserId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PAYMENTS_KEY_PREFIX}${currentUserId}`);
      setPaymentHistory(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setPaymentHistory([]);
    }
  }, [currentUserId]);

  // Save payments to localStorage
  useEffect(() => {
    if (currentUserId) {
      try {
        localStorage.setItem(
          `${STORAGE_PAYMENTS_KEY_PREFIX}${currentUserId}`,
          JSON.stringify(paymentHistory)
        );
      } catch (e) {
        console.error('Failed to save payments:', e);
      }
    }
  }, [paymentHistory, currentUserId]);

  // Listen to browser Back/Forward (hashchange & popstate)
  useEffect(() => {
    const handleHashSync = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      const route = rawHash.split('/')[0];
      const isPayRoute = route === 'pembayaran' || route === 'checkout';

      if (isPayRoute) {
        setIsPaymentModalOpen(true);
      } else {
        // User clicked browser Back button or navigated elsewhere
        setIsPaymentModalOpen(false);
        setSelectedTicketToView(null);
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    window.addEventListener('popstate', handleHashSync);
    return () => {
      window.removeEventListener('hashchange', handleHashSync);
      window.removeEventListener('popstate', handleHashSync);
    };
  }, []);

  /**
   * Helper parsing harga tiket / kuliner dari teks atau angka
   */
  const parseItemPrice = (item) => {
    if (!item) return 15000;
    if (typeof item.price === 'number') return item.price;
    if (item.ticketInfo?.domestik) {
      const match = item.ticketInfo.domestik.match(/\d+[\d.]*/);
      if (match) {
        const val = parseInt(match[0].replace(/\./g, ''), 10);
        if (val && val >= 5000 && val <= 500000) return val;
      }
    }
    if (item.priceRange) {
      const match = item.priceRange.match(/\d+[\d.]*/);
      if (match) {
        const val = parseInt(match[0].replace(/\./g, ''), 10);
        if (val && val >= 5000) return val;
      }
    }
    // Default fallback
    return item.category ? 25000 : 15000;
  };

  /**
   * Membuka checkout pembayaran untuk satu item (wisata atau kuliner).
   * Wajib login: jika belum login, otomatis memunculkan AuthModal.
   * Mensinkronkan URL route ke '#/pembayaran'.
   */
  const initiatePayment = useCallback(
    (item, options = {}) => {
      if (!item) return;

      requireAuth(
        () => {
          // Record origin route
          if (
            window.location.hash &&
            !window.location.hash.includes('pembayaran') &&
            !window.location.hash.includes('checkout')
          ) {
            previousHashRef.current = window.location.hash;
          }

          const itemPrice = parseItemPrice(item);
          const orderData = {
            items: [
              {
                id: item.id,
                name: item.name,
                subtitle:
                  item.subtitle || item.spotName || item.province || item.regionLabel || 'D.I. Yogyakarta',
                type: item.category ? 'kuliner' : 'wisata',
                category: item.category || 'Tiket Destinasi Budaya',
                image:
                  item.thumbnail ||
                  item.coverImage ||
                  item.image ||
                  '/assets/images/jogja_keraton.jpg',
                price: itemPrice,
                quantity: options.quantity || 1,
                date: options.date || new Date().toISOString().split('T')[0]
              }
            ],
            isBatch: false,
            originWishlist: !!options.fromWishlist
          };

          setActivePaymentOrder(orderData);
          setIsPaymentModalOpen(true);

          if (window.location.hash !== '#/pembayaran') {
            window.location.hash = '#/pembayaran';
          }
        },
        {
          benefitType: 'payment',
          title: 'Masuk Akun untuk Pembayaran',
          description: `Silakan masuk ke akun Anda terlebih dahulu untuk menyelesaikan pembelian tiket/voucher ${item.name}.`
        }
      );
    },
    [requireAuth]
  );

  /**
   * Checkout serentak untuk semua item di Wishlist.
   * Wajib login: jika belum login, otomatis memunculkan AuthModal.
   * Mensinkronkan URL route ke '#/pembayaran'.
   */
  const checkoutWishlist = useCallback(
    (wishlistItems) => {
      if (!wishlistItems || wishlistItems.length === 0) return;

      requireAuth(
        () => {
          if (
            window.location.hash &&
            !window.location.hash.includes('pembayaran') &&
            !window.location.hash.includes('checkout')
          ) {
            previousHashRef.current = window.location.hash;
          }

          const mapped = wishlistItems.map((item) => {
            const price = parseItemPrice(item);
            return {
              id: item.id,
              name: item.name,
              subtitle:
                item.subtitle || item.spotName || item.province || item.regionLabel || 'D.I. Yogyakarta',
              type: item.category ? 'kuliner' : 'wisata',
              category: item.category || 'Tiket Destinasi Budaya',
              image:
                item.thumbnail ||
                item.coverImage ||
                item.image ||
                '/assets/images/jogja_keraton.jpg',
              price: price,
              quantity: 1,
              date: new Date().toISOString().split('T')[0]
            };
          });

          const orderData = {
            items: mapped,
            isBatch: true,
            originWishlist: true
          };

          setActivePaymentOrder(orderData);
          setIsPaymentModalOpen(true);

          if (window.location.hash !== '#/pembayaran') {
            window.location.hash = '#/pembayaran';
          }
        },
        {
          benefitType: 'payment',
          title: 'Masuk Akun untuk Checkout Wishlist',
          description:
            'Silakan masuk ke akun Anda untuk memproses pembayaran seluruh destinasi & kuliner impian Anda sekaligus.'
        }
      );
    },
    [requireAuth]
  );

  /**
   * Membuka viewer tiket dengan rute URL
   */
  const openTicketViewer = useCallback((ticket) => {
    if (!ticket) return;
    if (
      window.location.hash &&
      !window.location.hash.includes('pembayaran') &&
      !window.location.hash.includes('checkout')
    ) {
      previousHashRef.current = window.location.hash;
    }
    setSelectedTicketToView(ticket);
    setIsPaymentModalOpen(true);
    window.location.hash = `#/pembayaran/tiket/${ticket.bookingCode || ticket.id}`;
  }, []);

  /**
   * Menutup modal pembayaran dan mengembalikan route URL ke halaman sebelumnya
   */
  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
    setSelectedTicketToView(null);
    setActivePaymentOrder(null);

    try {
      sessionStorage.removeItem(SESSION_ACTIVE_ORDER_KEY);
    } catch (e) {}

    const cur = window.location.hash.replace(/^#\/?/, '').trim();
    if (cur.startsWith('pembayaran') || cur.startsWith('checkout')) {
      const target =
        previousHashRef.current &&
        !previousHashRef.current.includes('pembayaran') &&
        !previousHashRef.current.includes('checkout')
          ? previousHashRef.current
          : '#/home';
      window.location.hash = target;
    }
  }, []);

  /**
   * Menyelesaikan transaksi dummy dan mencatat tiket ke riwayat pengguna
   */
  const completePayment = useCallback(
    (paymentResult) => {
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      // Hitung masa berlaku tiket (Default: 7 hari untuk kuliner/voucher, 3 hari untuk wisata)
      const isCulinaryOnly = (activePaymentOrder?.items || []).every((i) => i.type === 'kuliner');
      const validityDays = isCulinaryOnly ? 14 : 3;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + validityDays);
      expiry.setHours(23, 59, 59, 999);

      const newRecord = {
        id: `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingCode: `HM-JOG-${randomCode}`,
        qrCodeValue: `HM-TICKET-YOGYA-${randomCode}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userName: (currentUser && !currentUser.isGuest) ? currentUser.name : (currentUser?.name && !currentUser.name.includes('Tamu') ? currentUser.name : 'Gabriel Fazriel'),
        userEmail: (currentUser && !currentUser.isGuest) ? currentUser.email : (currentUser?.email && !currentUser.email.includes('guest@') ? currentUser.email : 'fazrilkece258@gmail.com'),
        status: 'PAID', // 'PAID' (Active) | 'REDEEMED' (Used) | 'EXPIRED'
        ticketState: 'active', // 'active' | 'used' | 'expired'
        validUntil: expiry.toISOString(),
        validityLabel: `Berlaku s/d ${expiry.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, 23:59 WIB`,
        redeemedAt: null,
        method: paymentResult.method || 'card',
        methodLabel: paymentResult.methodLabel || 'Credit Card',
        items: activePaymentOrder?.items || [],
        subtotal: paymentResult.subtotal,
        fee: paymentResult.fee,
        discount: paymentResult.discount,
        totalAmount: paymentResult.totalAmount,
        visitDate: activePaymentOrder?.items[0]?.date || new Date().toISOString().split('T')[0]
      };

      setPaymentHistory((prev) => [newRecord, ...prev]);

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#1A1412', '#C99B52', '#16A34A', '#EAB308', '#FAF8F5']
        });
      } catch (e) {}

      return newRecord;
    },
    [activePaymentOrder, currentUser]
  );

  /**
   * Cek apakah suatu item (tempat wisata atau kuliner) sudah lunas dibayar
   */
  const isItemPaid = useCallback(
    (itemId) => {
      return paymentHistory.some(
        (order) => order.status === 'PAID' && order.items.some((i) => i.id === itemId)
      );
    },
    [paymentHistory]
  );

  /**
   * Ambil data invoice/tiket aktif berdasarkan id tempat
   */
  const getPaidTicketByItemId = useCallback(
    (itemId) => {
      return paymentHistory.find(
        (order) => order.status === 'PAID' && order.items.some((i) => i.id === itemId)
      );
    },
    [paymentHistory]
  );

  /**
   * Simulasi Check-in / Gunakan Tiket di Loket Wisata / Kasir Resto
   */
  const redeemTicket = useCallback((bookingCode) => {
    if (!bookingCode) return false;
    let redeemedOrder = null;

    setPaymentHistory((prev) =>
      prev.map((order) => {
        if (order.bookingCode === bookingCode) {
          redeemedOrder = {
            ...order,
            status: 'REDEEMED',
            ticketState: 'used',
            redeemedAt: new Date().toISOString()
          };
          return redeemedOrder;
        }
        return order;
      })
    );

    if (redeemedOrder) {
      setSelectedTicketToView(redeemedOrder);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#FBBF24']
        });
      } catch (e) {}
    }

    return true;
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        activePaymentOrder,
        setActivePaymentOrder,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        initiatePayment,
        checkoutWishlist,
        completePayment,
        paymentHistory,
        isItemPaid,
        getPaidTicketByItemId,
        selectedTicketToView,
        setSelectedTicketToView: openTicketViewer,
        closePaymentModal,
        parseItemPrice,
        redeemTicket
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
