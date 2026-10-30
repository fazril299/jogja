import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Ticket,
  Copy,
  Check,
  ArrowRight,
  ArrowUpRight,
  Download,
  AlertCircle,
  Receipt,
  User,
  ShoppingBag,
  Lock,
  Printer
} from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import PrintableReceiptTicket from './PrintableReceiptTicket';

export default function PaymentModal() {
  const {
    activePaymentOrder,
    setActivePaymentOrder,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    completePayment,
    selectedTicketToView,
    setSelectedTicketToView,
    closePaymentModal,
    redeemTicket
  } = usePayment();

  const { currentUser } = useAuth();

  // Step state: 'checkout' | 'processing' | 'success'
  const [step, setStep] = useState('checkout');
  const [isCheckInConfirmOpen, setIsCheckInConfirmOpen] = useState(false);
  
  // Payment methods: 'card' (Credit/debit) | 'qris' (QRIS / E-Wallet) | 'va' (Virtual Account) | 'paypal'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedBank, setSelectedBank] = useState('bca'); // 'bca' | 'mandiri' | 'bri'
  
  // Card form inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState(() => currentUser?.name || 'Gabriel Fazriel');

  // Billing address mode: 'same' | 'different'
  const [billingAddressMode, setBillingAddressMode] = useState('same');
  const [customBillingName, setCustomBillingName] = useState('');

  // Contact info
  const [contactEmail, setContactEmail] = useState(() => currentUser?.email || 'fazriel@hamemayu.id');
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Visit Date
  const [visitDate, setVisitDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isEditingVisitDate, setIsEditingVisitDate] = useState(false);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState('JOGJAISTIMEWA');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');

  const [copiedCode, setCopiedCode] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  // Per-item quantity state
  const [itemQuantities, setItemQuantities] = useState({});

  // Countdown Timer Simulasi Batas Waktu Bayar (15 Menit)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (step !== 'checkout') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (activePaymentOrder?.items) {
      const initial = {};
      activePaymentOrder.items.forEach((item) => {
        initial[item.id] = item.quantity || 1;
      });
      setItemQuantities(initial);
      setStep('checkout');
      setOrderReceipt(null);
    }
  }, [activePaymentOrder]);

  // Sync user info if available
  useEffect(() => {
    if (currentUser?.email) {
      setContactEmail(currentUser.email);
    }
    if (currentUser?.name) {
      setCardName(currentUser.name);
    }
  }, [currentUser]);

  // If opening directly to view an existing ticket
  useEffect(() => {
    if (selectedTicketToView) {
      setOrderReceipt(selectedTicketToView);
      setStep('success');
      setIsPaymentModalOpen(true);
    }
  }, [selectedTicketToView, setIsPaymentModalOpen]);

  if (!isPaymentModalOpen) return null;

  const items = activePaymentOrder?.items || (orderReceipt ? orderReceipt.items : []);

  // Price calculations
  const calculateSubtotal = () => {
    if (orderReceipt) return orderReceipt.subtotal;
    return items.reduce((acc, itm) => {
      const qty = itemQuantities[itm.id] || 1;
      return acc + itm.price * qty;
    }, 0);
  };

  const totalProductCount = items.reduce((acc, itm) => acc + (itemQuantities[itm.id] || itm.quantity || 1), 0);
  const subtotal = calculateSubtotal();
  const shippingFee = 0; // Tiket instant access via digital e-ticket
  const discount = isPromoApplied ? Math.min(15000, Math.round(subtotal * 0.15)) : 0;
  const tax = 0;
  const totalAmount = orderReceipt ? orderReceipt.totalAmount : Math.max(0, subtotal + shippingFee - discount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'JOGJAISTIMEWA' || promoCodeInput.trim().toUpperCase() === 'HAMEMAYU') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Kode promo tidak valid atau telah kadaluarsa.');
      setIsPromoApplied(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!orderReceipt) return;
    const bookingCode = orderReceipt.bookingCode || 'HM-JOG-100001';
    const qrValue = orderReceipt.qrCodeValue || bookingCode;
    const visitDate = orderReceipt.visitDate || new Date().toISOString().split('T')[0];
    const customerName = (orderReceipt.userName || currentUser?.name || 'Gabriel Fazriel').replace(' (Guest)', '').replace('Tamu Penjelajah', 'Gabriel Fazriel');
    const customerEmail = (orderReceipt.userEmail || currentUser?.email || 'fazrilkece258@gmail.com').replace('guest@hamemayu.id', 'fazrilkece258@gmail.com');
    const validity = orderReceipt.validityLabel || 'Berlaku s/d 14 Hari Sejak Pembelian';
    const paidAt = orderReceipt.createdAt ? new Date(orderReceipt.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('id-ID');

    // Desain Faktur Pembayaran & E-Tiket Standar Korporat/Traveloka/Tiket.com (Sederhana, Bersih, Profesional, Tanpa Slop)
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bukti Pembayaran - ${bookingCode} - Hamemayu</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #F8F9FA; color: #212529; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 40px 16px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .receipt-container { background: #FFFFFF; width: 100%; max-width: 620px; border: 1px solid #E9ECEF; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 36px 32px; }
    
    /* Top Header */
    .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 1px solid #DEE2E6; }
    .brand-title { font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.5px; }
    .brand-subtitle { font-size: 12px; color: #6C757D; margin-top: 2px; }
    .receipt-status { text-align: right; }
    .badge-paid { display: inline-block; background: #E8F5E9; color: #2E7D32; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid #C8E6C9; letter-spacing: 0.5px; }
    .invoice-num { font-size: 12px; font-family: monospace; color: #495057; margin-top: 6px; font-weight: 600; }

    /* Metadata Grid */
    .info-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 20px 0; border-bottom: 1px solid #DEE2E6; font-size: 13px; }
    .info-group label { display: block; font-size: 11px; color: #6C757D; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px; }
    .info-group span { font-weight: 600; color: #212529; }

    /* Item Table */
    .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .items-table th { text-align: left; font-size: 11px; font-weight: 700; color: #6C757D; text-transform: uppercase; padding-bottom: 10px; border-bottom: 1px solid #DEE2E6; letter-spacing: 0.5px; }
    .items-table td { padding: 12px 0; font-size: 13px; border-bottom: 1px solid #F1F3F5; }
    .items-table .text-right { text-align: right; }
    .item-name { font-weight: 600; color: #212529; }
    .item-qty { color: #6C757D; font-size: 12px; }

    /* Summary Totals */
    .summary-section { margin-top: 16px; width: 100%; display: flex; flex-direction: column; align-items: flex-end; }
    .summary-table { width: 260px; font-size: 13px; }
    .summary-row { display: flex; justify-content: space-between; padding: 4px 0; color: #495057; }
    .summary-row.total { font-size: 15px; font-weight: 700; color: #111827; border-top: 1px solid #DEE2E6; padding-top: 10px; margin-top: 6px; }

    /* QR Code Section */
    .qr-section { margin-top: 28px; padding: 20px; background: #F8F9FA; border: 1px solid #E9ECEF; border-radius: 6px; display: flex; align-items: center; gap: 20px; }
    .qr-image { width: 110px; height: 110px; border: 1px solid #DEE2E6; border-radius: 4px; padding: 4px; background: #FFFFFF; flex-shrink: 0; }
    .qr-text h4 { font-size: 13px; font-weight: 700; color: #212529; margin-bottom: 4px; }
    .qr-text p { font-size: 12px; color: #6C757D; line-height: 1.4; margin-bottom: 6px; }
    .qr-text .code { font-family: monospace; font-size: 12px; font-weight: 700; color: #212529; background: #E9ECEF; padding: 2px 6px; border-radius: 4px; }

    /* Footer Note */
    .receipt-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #DEE2E6; text-align: center; font-size: 11px; color: #6C757D; line-height: 1.5; }

    /* Print Button */
    .action-bar { margin-top: 20px; }
    .btn-print { background: #212529; color: #FFFFFF; border: none; padding: 10px 22px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; }
    .btn-print:hover { background: #000000; }

    @media print {
      body { background: #FFFFFF; padding: 0; }
      .receipt-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .action-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="receipt-header">
      <div>
        <h1 class="brand-title">Hamemayu Yogyakarta</h1>
        <p class="brand-subtitle">Bukti Pembayaran & E-Tiket Resmi</p>
      </div>
      <div class="receipt-status">
        <span class="badge-paid">LUNAS</span>
        <div class="invoice-num">${bookingCode}</div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-group">
        <label>Nama Pemesan</label>
        <span>${customerName}</span>
      </div>
      <div class="info-group">
        <label>Tanggal Transaksi</label>
        <span>${paidAt} WIB</span>
      </div>
      <div class="info-group">
        <label>Tanggal Kunjungan</label>
        <span>${visitDate}</span>
      </div>
      <div class="info-group">
        <label>Metode Pembayaran</label>
        <span>${orderReceipt.methodLabel || 'Digital Payment'}</span>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item / Destinasi</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Harga</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderReceipt.items.map((it) => `
          <tr>
            <td>
              <div class="item-name">${it.name}</div>
            </td>
            <td class="text-right item-qty">${it.quantity || 1}</td>
            <td class="text-right">Rp ${(it.price || 0).toLocaleString('id-ID')}</td>
            <td class="text-right font-weight-bold">Rp ${(((it.price || 0) * (it.quantity || 1))).toLocaleString('id-ID')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="summary-section">
      <div class="summary-table">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>Rp ${(orderReceipt.subtotal || orderReceipt.totalAmount || 0).toLocaleString('id-ID')}</span>
        </div>
        ${orderReceipt.discount > 0 ? `
        <div class="summary-row" style="color: #2E7D32;">
          <span>Diskon Promo</span>
          <span>- Rp ${orderReceipt.discount.toLocaleString('id-ID')}</span>
        </div>` : ''}
        <div class="summary-row total">
          <span>Total Pembayaran</span>
          <span>Rp ${(orderReceipt.totalAmount || 0).toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>

    <div class="qr-section">
      <img class="qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrValue)}" alt="QR Code">
      <div class="qr-text">
        <h4>Verifikasi Tiket di Lokasi</h4>
        <p>Tunjukkan QR Code ini kepada petugas loket gerbang destinasi atau kasir sentra kuliner untuk akses masuk.</p>
        <span class="code">${bookingCode}</span>
      </div>
    </div>

    <div class="receipt-footer">
      Bukti pembayaran ini sah dan diterbitkan secara digital oleh Sistem Hamemayu Yogyakarta.<br>
      Bantuan: info@jogjahamemayu.id | Telp: (0274) 589223
    </div>
  </div>

  <div class="action-bar">
    <button class="btn-print" onclick="window.print()">Cetak Dokumen / Simpan PDF</button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bukti-Pembayaran-${bookingCode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePaySimulation = () => {
    setStep('processing');

    const methodLabels = {
      card: 'Credit or Debit Card (Visa / Mastercard)',
      qris: 'QRIS & E-Wallet (GoPay, DANA, OVO)',
      va: `${selectedBank.toUpperCase()} Virtual Account`,
      paypal: 'PayPal International'
    };

    setTimeout(() => {
      const receipt = completePayment({
        method: paymentMethod,
        methodLabel: methodLabels[paymentMethod] || 'Credit Card',
        subtotal,
        fee: shippingFee,
        discount,
        totalAmount
      });
      setOrderReceipt(receipt);
      setStep('success');
    }, 1200);
  };

  const handleClose = () => {
    setOrderReceipt(null);
    setStep('checkout');
    if (closePaymentModal) {
      closePaymentModal();
    } else {
      setIsPaymentModalOpen(false);
      setSelectedTicketToView(null);
    }
  };

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {}
  };

  const primaryDestinationName = items.length > 0
    ? (items[0].name + (items.length > 1 ? ` & ${items.length - 1} destinasi lainnya` : ''))
    : 'Yogyakarta Heritage Experience';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex flex-col bg-white overflow-y-auto text-[#1A1412]"
        style={{ zIndex: 100000, fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        {/* =========================================================================
            1. TOP ANNOUNCEMENT BAR (Clean Dark Brown Strip as in Veroné Reference)
            ========================================================================= */}
        <div className="bg-[#2C221E] text-[#F3EFEA] text-[11px] font-medium tracking-wide py-2 px-4 text-center shrink-0">
          <span>Garansi Tiket Resmi 100% Bebas Antrean • Terintegrasi Akses QR Code Yogyakarta</span>
        </div>

        {/* =========================================================================
            2. BRAND HEADER BAR (Veroné Editorial Style)
            ========================================================================= */}
        <header className="border-b border-[#EAE4DC] px-4 sm:px-8 py-3.5 flex items-center justify-between bg-white shrink-0">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-[#1A1412] cursor-pointer"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              onClick={handleClose}
            >
              Hamemayu
            </h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3.5 text-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <User size={17} />
              <span className="truncate max-w-[140px]">
                {(currentUser?.name || 'Gabriel Fazriel').replace(' (Guest)', '').replace('Tamu Penjelajah', 'Gabriel Fazriel')}
              </span>
            </div>
            <div className="relative p-1">
              <ShoppingBag size={18} />
              <span className="absolute -top-1 -right-1 bg-[#1A1412] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition-colors ml-1"
              title="Tutup / Kembali"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* =========================================================================
            3. MAIN CHECKOUT VIEW: SPLIT 2-COLUMN LAYOUT (VERONÉ CHECKOUT ARCHITECTURE)
            ========================================================================= */}
        <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
          {/* =====================================================================
              LEFT COLUMN: BREADCRUMB, CONTACT BOX, PAYMENT FORM, BILLING & CTA
              ===================================================================== */}
          <div className="w-full lg:w-7/12 px-4 sm:px-8 py-6 sm:py-8 lg:pr-12">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
              <span
                onClick={handleClose}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Wishlist
              </span>
              <span>›</span>
              <span className="text-neutral-500">Informasi</span>
              <span>›</span>
              <span className="text-neutral-500">Kunjungan</span>
              <span>›</span>
              <span className="text-[#1A1412] font-bold underline underline-offset-4">
                Pembayaran
              </span>
            </div>

            {/* ------------------- STEP 1: CHECKOUT FORM ------------------- */}
            {step === 'checkout' && (
              <div className="space-y-6">
                {/* Simulated Order Countdown Timer */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#FFFBF0] border border-[#F3E2B8] flex items-center justify-between text-xs text-[#92400E] shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock size={15} className="text-[#B45309] animate-pulse shrink-0" />
                    <span className="font-medium truncate">
                      Selesaikan pemesanan tiket Anda dalam:
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-extrabold text-[#78350F] bg-white px-2.5 py-1 rounded-lg border border-[#F3E2B8] shrink-0 text-xs shadow-2xs">
                    <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}</span>
                    <span>:</span>
                    <span>{String(timeLeft % 60).padStart(2, '0')}</span>
                  </div>
                </div>
                {/* 3-Column Review Summary Card (Exact Match to Veroné Reference) */}
                <div className="border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB] text-xs">
                  {/* Contact */}
                  <div className="md:pr-4 pt-2 md:pt-0">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Email Pemesan
                    </div>
                    <div className="font-bold text-[#1A1412] truncate text-xs sm:text-sm">
                      {contactEmail}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="text-[11px] font-semibold text-[#1A1412] underline mt-1 cursor-pointer block hover:text-neutral-600"
                    >
                      {isEditingContact ? 'Selesai' : 'Ubah Email'}
                    </button>
                  </div>

                  {/* Destination & Visit Date */}
                  <div className="md:pl-4 pt-2 md:pt-0">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Destinasi & Jadwal Kunjungan
                    </div>
                    <div className="font-bold text-[#1A1412] line-clamp-1 text-xs sm:text-sm">
                      {primaryDestinationName}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium">
                      Tanggal Kunjungan: {visitDate}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingVisitDate(!isEditingVisitDate)}
                      className="text-[11px] font-semibold text-[#1A1412] underline mt-1 cursor-pointer block hover:text-neutral-600"
                    >
                      {isEditingVisitDate ? 'Selesai' : 'Ubah Tanggal'}
                    </button>
                  </div>
                </div>

                {/* Inline Editors if User Clicks 'Change' */}
                {isEditingContact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs"
                  >
                    <label className="font-bold text-neutral-800">Email Kontak Pemesan:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingContact(false)}
                        className="px-3 py-1.5 rounded-lg bg-[#1A1412] text-white font-bold text-xs"
                      >
                        Simpan
                      </button>
                    </div>
                  </motion.div>
                )}

                {isEditingVisitDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs"
                  >
                    <label className="font-bold text-neutral-800">Pilih Tanggal Rencana Kunjungan:</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingVisitDate(false)}
                        className="px-3 py-1.5 rounded-lg bg-[#1A1412] text-white font-bold text-xs"
                      >
                        Simpan
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* =================================================================
                    PAYMENT SECTION (Veroné Clean Input Architecture)
                    ================================================================= */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1412] m-0">
                      Payment
                    </h2>
                    <p className="text-xs text-neutral-500 m-0 mt-0.5">
                      All transactions are secured and encrypted.
                    </p>
                  </div>

                  {/* Payment Method Option Container */}
                  <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                    {/* Method 1: Credit or Debit Card */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 text-black accent-[#1A1412] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-[#1A1412]">
                          Credit or debit card
                        </span>
                      </label>

                      {/* Card Brand Badges (Visa, Mastercard, AMEX) */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white italic">
                          VISA
                        </span>
                        <div className="flex -space-x-1.5">
                          <span className="w-4 h-4 rounded-full bg-red-500 opacity-90 inline-block" />
                          <span className="w-4 h-4 rounded-full bg-amber-400 opacity-90 inline-block" />
                        </div>
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-sky-700 text-white uppercase hidden sm:inline">
                          AMEX
                        </span>
                      </div>
                    </div>

                    {/* Expandable Card Form Fields */}
                    {paymentMethod === 'card' && (
                      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
                        {/* Card Number */}
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                            Card number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm font-mono text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            />
                            <CreditCard
                              size={16}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                            />
                          </div>
                        </div>

                        {/* Expiration date & Security code */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                              Expiration date (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm font-mono text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                              Security code
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="CVV"
                                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm font-mono text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              />
                              <Lock
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Name on card */}
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                            Name on card
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Nama Lengkap Pemegang Kartu"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          />
                        </div>
                      </div>
                    )}

                    {/* Method 2: QRIS & E-Wallet */}
                    <div
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-3.5 sm:p-4 border-t border-[#E5E7EB] flex items-center justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'qris' ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'qris'}
                          onChange={() => setPaymentMethod('qris')}
                          className="w-4 h-4 text-black accent-[#1A1412] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-[#1A1412]">
                          QRIS & E-Wallet (GoPay, DANA, ShopeePay)
                        </span>
                      </label>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        QRIS Instan
                      </span>
                    </div>

                    {paymentMethod === 'qris' && (
                      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 bg-white p-1 rounded-xl border border-neutral-300 shrink-0 shadow-xs">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HAMEMAYU-VERONE-STYLE-PAYMENT"
                            alt="QRIS Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-neutral-600 space-y-1">
                          <p className="font-bold text-[#1A1412] m-0">
                            Scan QRIS dengan aplikasi Bank atau E-Wallet apa saja
                          </p>
                          <p className="text-[11px] text-neutral-500 m-0">
                            BCA Mobile, Mandiri Livin', GoPay, DANA, OVO. Klik Complete Order di bawah untuk simulasi lunas otomatis.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Method 3: Virtual Account */}
                    <div
                      onClick={() => setPaymentMethod('va')}
                      className={`p-3.5 sm:p-4 border-t border-[#E5E7EB] flex items-center justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'va' ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'va'}
                          onChange={() => setPaymentMethod('va')}
                          className="w-4 h-4 text-black accent-[#1A1412] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-[#1A1412]">
                          Transfer Virtual Account (BCA, Mandiri, BRI)
                        </span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Bebas Biaya Admin
                      </span>
                    </div>

                    {paymentMethod === 'va' && (
                      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
                        <div className="flex items-center gap-2">
                          {['bca', 'mandiri', 'bri'].map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setSelectedBank(b)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                                selectedBank === b
                                  ? 'bg-[#1A1412] text-white shadow-xs'
                                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                              }`}
                            >
                              Bank {b}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-300">
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#1A1412]">
                            8277 0812 3456 7890
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('8277081234567890')}
                            className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            <span>{copiedCode ? 'Tersalin' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================================
                    BOTTOM ACTION BAR (Kembali & Tombol Bayar)
                    ================================================================= */}
                <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    ← Kembali ke Jelajah
                  </button>

                  <button
                    type="button"
                    onClick={handlePaySimulation}
                    className="px-7 py-3 rounded-full bg-[#1A1412] hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Bayar Sekarang (Konfirmasi)</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                {/* Footer Policy Links (Exact Veroné Reference) */}
                <div className="pt-8 border-t border-[#E5E7EB] flex items-center gap-4 text-[11px] text-neutral-500 font-medium">
                  <span className="cursor-pointer hover:underline">Return policy</span>
                  <span className="cursor-pointer hover:underline">Privacy policy</span>
                  <span className="cursor-pointer hover:underline">Terms of use</span>
                </div>
              </div>

            )}

            {/* ------------------- STEP 2: PROCESSING ------------------- */}
            {step === 'processing' && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border-3 border-neutral-200 border-t-[#1A1412] animate-spin" />
                <h3 className="text-base font-bold text-[#1A1412] m-0">
                  Processing your order...
                </h3>
                <p className="text-xs text-neutral-500 m-0 max-w-sm mx-auto">
                  Please do not close this window while we secure your official booking and generate your QR E-Tickets.
                </p>
              </div>
            )}

            {/* ------------------- STEP 3: SUCCESS / E-TICKET CONFIRMATION ------------------- */}
            {step === 'success' && orderReceipt && (
              <div className="space-y-6">
                {/* Confirmation Message */}
                <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                  <div className="flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                    <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {orderReceipt.bookingCode}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-emerald-950 m-0">
                    Order confirmed! Thank you, {orderReceipt.userName.replace(' (Guest)', '').replace('Tamu Penjelajah', 'Gabriel Fazriel')}.
                  </h2>
                  <p className="text-xs text-emerald-800 m-0">
                    A confirmation has been sent to {orderReceipt.userEmail}. Your official E-Ticket and QR Code are active and ready.
                  </p>
                </div>

                {/* QR Code Pass Card */}
                <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Boarding Pass / E-Ticket
                      </div>
                      <div className="text-sm font-bold text-[#1A1412]">
                        {orderReceipt.bookingCode}
                      </div>
                    </div>
                    {orderReceipt.status === 'REDEEMED' || orderReceipt.ticketState === 'used' ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-200 flex items-center gap-1">
                        <Check size={11} className="text-emerald-400" />
                        <span>SUDAH DIGUNAKAN</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#064E3B] text-[#34D399] border border-[#059669] flex items-center gap-1.5">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>AKTIF & SIAP PAKAI</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                    <div className="w-32 h-32 p-1.5 rounded-xl border border-neutral-300 bg-white shadow-2xs shrink-0 flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderReceipt.qrCodeValue || orderReceipt.bookingCode}`}
                        alt="Ticket QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2 text-xs text-neutral-600 flex-1">
                      <div>
                        <span className="font-semibold text-neutral-400 text-[11px] block">
                          TANGGAL KUNJUNGAN:
                        </span>
                        <span className="font-bold text-[#1A1412] text-sm">
                          {orderReceipt.visitDate || visitDate}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-400 text-[11px] block">
                          MASA BERLAKU TIKET:
                        </span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs inline-block">
                          {orderReceipt.validityLabel || 'Berlaku s/d 7 Hari Setelah Pembelian'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-400 text-[11px] block">
                          METODE PEMBAYARAN:
                        </span>
                        <span className="font-semibold text-[#1A1412]">
                          {orderReceipt.methodLabel}
                        </span>
                      </div>
                      {orderReceipt.redeemedAt ? (
                        <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-700 font-medium">
                          ✓ Telah divalidasi di lokasi pada {new Date(orderReceipt.redeemedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB.
                        </div>
                      ) : (
                        <p className="text-[11px] text-neutral-500 m-0 pt-0.5">
                          Tunjukkan QR Code ini di gerbang tiket destinasi atau kasir sentra kuliner untuk verifikasi langsung tanpa antre.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Buttons to print, download or close */}
                  <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleDownloadTicket}
                        className="px-4 py-2 rounded-xl bg-[#1A1412] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
                        title="Unduh berkas e-tiket resmi (Offline Digital Pass)"
                      >
                        <Download size={14} />
                        <span>Unduh Berkas Tiket</span>
                      </button>

                      {orderReceipt.status !== 'REDEEMED' && orderReceipt.ticketState !== 'used' && (
                        <button
                          type="button"
                          onClick={() => setIsCheckInConfirmOpen(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                          title="Simulasi check-in di pintu gerbang wisata atau kasir kuliner"
                        >
                          <CheckCircle2 size={14} />
                          <span>Check-in / Gunakan Tiket</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-full bg-[#1A1412] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-black transition-transform active:scale-95"
                    >
                      <span>Selesai & Tutup</span>
                    </button>
                  </div>
                </div>

                {/* Footer Policy Links */}
                <div className="pt-6 border-t border-[#E5E7EB] flex items-center gap-4 text-[11px] text-neutral-500 font-medium">
                  <span className="cursor-pointer hover:underline">Return policy</span>
                  <span className="cursor-pointer hover:underline">Privacy policy</span>
                  <span className="cursor-pointer hover:underline">Terms of use</span>
                </div>
              </div>
            )}
          </div>

          {/* =====================================================================
              RIGHT COLUMN: ORDER ITEMS LIST, DISCOUNT CODE & FINANCIAL TOTALS
              (Exact Match to Veroné Grey Sidebar Reference)
              ===================================================================== */}
          <div className="w-full lg:w-5/12 bg-[#FAFAFA] border-t lg:border-t-0 lg:border-l border-[#E5E7EB] px-4 sm:px-8 py-6 sm:py-8 space-y-6">
            {/* Products / Tickets List */}
            <div className="space-y-4">
              {items.map((item) => {
                const qty = itemQuantities[item.id] || item.quantity || 1;
                const itemTotal = item.price * qty;
                const imgSrc =
                  item.image ||
                  item.thumbnail ||
                  item.coverImage ||
                  '/assets/images/jogja_keraton.jpg';

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-1"
                  >
                    {/* Image with badge */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden p-1 shadow-2xs">
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-[#737373] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                        {qty}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1A1412] leading-snug m-0 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 m-0 mt-0.5">
                        Kategori: {item.category || (item.type === 'kuliner' ? 'Kuliner Khas' : 'Tiket Budaya')}
                      </p>
                      {step === 'checkout' && !orderReceipt ? (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-neutral-500 font-medium">Jumlah Tiket:</span>
                          <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                const current = itemQuantities[item.id] || 1;
                                if (current > 1) {
                                  setItemQuantities((prev) => ({ ...prev, [item.id]: current - 1 }));
                                }
                              }}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Kurangi tiket"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-neutral-900 select-none">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = itemQuantities[item.id] || 1;
                                if (current < 20) {
                                  setItemQuantities((prev) => ({ ...prev, [item.id]: current + 1 }));
                                }
                              }}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Tambah tiket"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-neutral-500 m-0">
                          Jumlah Tiket: {qty} orang
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-xs sm:text-sm font-bold text-[#1A1412] shrink-0">
                      Rp {itemTotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount Code Input Box (Exact Match to Veroné Reference) */}
            <form onSubmit={handleApplyPromo} className="pt-4 border-t border-[#E5E7EB] space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#1A1412] hover:bg-black text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Apply
                </button>
              </div>

              {/* Promo Applied Badge or Error */}
              {isPromoApplied && (
                <div className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Tag size={12} className="text-neutral-500" />
                    <span>{promoCodeInput || 'JOGJAISTIMEWA'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPromoApplied(false)}
                    className="text-neutral-400 hover:text-rose-500 text-[11px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-xs text-rose-600 m-0 font-medium">
                  {promoError}
                </p>
              )}
            </form>

            {/* Financial Totals Breakdown (Exact Match to Veroné Reference) */}
            <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Subtotal ({totalProductCount} item tiket)</span>
                <span className="font-semibold text-[#1A1412]">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {isPromoApplied && discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span>Diskon Kupon Promo</span>
                  <span className="font-semibold">
                    - Rp {discount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-base sm:text-lg font-black text-[#1A1412]">
                <span>Total</span>
                <span>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* =========================================================================
            HIDDEN ON SCREEN, VISIBLE ON PRINT: STRUK FISIK RESMI THERMAL/A4/PDF
            ========================================================================= */}
        {orderReceipt && (
          <PrintableReceiptTicket
            receipt={orderReceipt}
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            discount={discount}
            totalAmount={totalAmount}
          />
        )}
      </div>

        {/* =========================================================================
            POPUP KONFIRMASI CHECK-IN / REDEEM TIKET DI PINTU MASUK
            ========================================================================= */}
        <AnimatePresence>
          {isCheckInConfirmOpen && (
            <div className="fixed inset-0 z-[100005] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1412] m-0">
                    Konfirmasi Masuk / Check-in
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Apakah Anda sudah berada di loket gerbang masuk <strong>{primaryDestinationName}</strong> dan siap memvalidasi tiket ini?
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-mono font-bold text-neutral-700">
                  Kode: {orderReceipt?.bookingCode}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckInConfirmOpen(false)}
                    className="flex-1 py-2.5 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (redeemTicket && orderReceipt?.bookingCode) {
                        redeemTicket(orderReceipt.bookingCode);
                        setOrderReceipt((prev) => ({
                          ...prev,
                          status: 'REDEEMED',
                          ticketState: 'used',
                          redeemedAt: new Date().toISOString()
                        }));
                      }
                      setIsCheckInConfirmOpen(false);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    Ya, Validasi Sekarang
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </AnimatePresence>
  );
}
