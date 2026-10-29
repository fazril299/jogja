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

export default function PaymentModal() {
  const {
    activePaymentOrder,
    setActivePaymentOrder,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    completePayment,
    selectedTicketToView,
    setSelectedTicketToView,
    closePaymentModal
  } = usePayment();

  const { currentUser } = useAuth();

  // Step state: 'checkout' | 'processing' | 'success'
  const [step, setStep] = useState('checkout');
  
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
                {currentUser?.name || 'Gabriel'}
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
                {/* 3-Column Review Summary Card (Exact Match to Veroné Reference) */}
                <div className="border border-[#E5E7EB] rounded-xl p-3.5 sm:p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB] text-xs">
                  {/* Contact */}
                  <div className="md:pr-3 pt-2 md:pt-0">
                    <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">
                      Contact
                    </div>
                    <div className="font-semibold text-[#1A1412] truncate">
                      {contactEmail}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(!isEditingContact)}
                      className="text-[11px] font-semibold text-[#1A1412] underline mt-1 cursor-pointer block hover:text-neutral-600"
                    >
                      {isEditingContact ? 'Tutup' : 'Change'}
                    </button>
                  </div>

                  {/* Ship to / Destination */}
                  <div className="md:px-3 pt-2 md:pt-0">
                    <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">
                      Kunjungan
                    </div>
                    <div className="font-semibold text-[#1A1412] line-clamp-1">
                      {primaryDestinationName}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Tgl: {visitDate}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingVisitDate(!isEditingVisitDate)}
                      className="text-[11px] font-semibold text-[#1A1412] underline mt-1 cursor-pointer block hover:text-neutral-600"
                    >
                      {isEditingVisitDate ? 'Tutup' : 'Change'}
                    </button>
                  </div>

                  {/* Method */}
                  <div className="md:pl-3 pt-2 md:pt-0">
                    <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">
                      Method
                    </div>
                    <div className="font-semibold text-[#1A1412]">
                      E-Ticket Instant Access
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      QR Code Langsung Aktif • Rp 0
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 block mt-1">
                      ✓ Siap Scan
                    </span>
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
                    BILLING ADDRESS SECTION (Exact Match to Veroné Reference)
                    ================================================================= */}
                <div className="space-y-3 pt-2">
                  <div>
                    <h3 className="text-base font-bold text-[#1A1412] m-0">
                      Billing address
                    </h3>
                    <p className="text-xs text-neutral-500 m-0 mt-0.5">
                      Select the address that matches your card or payment method.
                    </p>
                  </div>

                  <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    {/* Option 1: Same as shipping address */}
                    <div
                      onClick={() => setBillingAddressMode('same')}
                      className={`p-3.5 sm:p-4 flex items-center gap-2.5 cursor-pointer transition-colors ${
                        billingAddressMode === 'same' ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={billingAddressMode === 'same'}
                        onChange={() => setBillingAddressMode('same')}
                        className="w-4 h-4 text-black accent-[#1A1412] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-[#1A1412]">
                        Same as shipping address
                      </span>
                    </div>

                    {/* Option 2: Use a different billing address */}
                    <div
                      onClick={() => setBillingAddressMode('different')}
                      className={`p-3.5 sm:p-4 border-t border-[#E5E7EB] flex items-center gap-2.5 cursor-pointer transition-colors ${
                        billingAddressMode === 'different' ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={billingAddressMode === 'different'}
                        onChange={() => setBillingAddressMode('different')}
                        className="w-4 h-4 text-black accent-[#1A1412] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-[#1A1412]">
                        Use a different billing address
                      </span>
                    </div>

                    {billingAddressMode === 'different' && (
                      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] space-y-2.5">
                        <input
                          type="text"
                          value={customBillingName}
                          onChange={(e) => setCustomBillingName(e.target.value)}
                          placeholder="Nama lengkap pengunjung lain / perusahaan"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-xs sm:text-sm text-[#1A1412] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================================
                    BOTTOM ACTION BAR (Return Link & Black Pill "Complete order ↗")
                    ================================================================= */}
                <div className="pt-4 flex items-center justify-between gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    Return to Shipping
                  </button>

                  <button
                    type="button"
                    onClick={handlePaySimulation}
                    className="px-7 py-3 rounded-full bg-[#1A1412] hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Complete order</span>
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
                    Order confirmed! Thank you, {orderReceipt.userName}.
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ PAID & ACTIVE
                    </span>
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
                          METODE PEMBAYARAN:
                        </span>
                        <span className="font-semibold text-[#1A1412]">
                          {orderReceipt.methodLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 m-0 pt-1">
                        Tunjukkan QR Code ini di gerbang tiket destinasi atau kasir sentra kuliner untuk verifikasi langsung tanpa antre.
                      </p>
                    </div>
                  </div>

                  {/* Buttons to print or close */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-neutral-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={14} />
                      <span>Print Ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-full bg-[#1A1412] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-black"
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
                      <p className="text-[11px] text-neutral-500 m-0">
                        Quantity: {qty} product
                      </p>
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
                <span>Subtotal ({totalProductCount} items)</span>
                <span className="font-semibold text-[#1A1412]">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-semibold text-[#1A1412]">
                  {shippingFee === 0 ? 'Free' : `Rp ${shippingFee.toLocaleString('id-ID')}`}
                </span>
              </div>

              {isPromoApplied && discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold">
                    - Rp {discount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600">
                <span>Tax</span>
                <span className="font-semibold text-[#1A1412]">
                  Rp 0.00
                </span>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-base sm:text-lg font-black text-[#1A1412]">
                <span>Total</span>
                <span>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}
