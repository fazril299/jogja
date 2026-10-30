import React from 'react';

/**
 * Komponen Struk Fisik Khusus Mode Cetak (@media print)
 * Hanya akan muncul saat user menekan 'Cetak Tiket / Simpan PDF' atau dialog print browser.
 * Di layar biasa komponen ini tersembunyi (hidden).
 */
export default function PrintableReceiptTicket({
  receipt,
  items = [],
  subtotal = 0,
  shippingFee = 0,
  discount = 0,
  totalAmount = 0
}) {
  if (!receipt) return null;

  const bookingCode = receipt.bookingCode || 'HM-JOG-332888';
  const qrValue = receipt.qrCodeValue || bookingCode;
  const visitDate = receipt.visitDate || new Date().toISOString().split('T')[0];
  const userName = receipt.userName || 'Gabriel Fazriel';
  const userEmail = receipt.userEmail || 'tamu@jogjahamemayu.id';
  const methodLabel = receipt.methodLabel || 'QRIS / Credit Card';
  const paidAt = receipt.paidAt
    ? new Date(receipt.paidAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

  const orderItems = items.length > 0 ? items : [{ name: 'Tiket Heritage & Kuliner Jogja', price: totalAmount, quantity: 1 }];

  return (
    <div id="printable-receipt-container" className="hidden">
      <div className="receipt-sheet">
        {/* Header Resmi */}
        <div className="receipt-header">
          <div className="brand-title">HAMEMAYU YOGYAKARTA</div>
          <div className="brand-subtitle">Platform Resmi Tiket Cagar Budaya & Kuliner Legendaris D.I. Yogyakarta</div>
          <div className="brand-meta">Kawasan Sumbu Filosofis UNESCO • Jl. Malioboro - Keraton Hadiningrat</div>
          <div className="divider-dashed" />
        </div>

        {/* Informasi Transaksi / Nomor Booking */}
        <div className="receipt-meta-grid">
          <div className="meta-row">
            <span className="meta-label">NO. TRANSAKSI</span>
            <span className="meta-value font-mono">{bookingCode}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">WAKTU BAYAR</span>
            <span className="meta-value">{paidAt} WIB</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">TANGGAL KUNJUNGAN</span>
            <span className="meta-value font-bold">{visitDate}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">NAMA PEMESAN</span>
            <span className="meta-value">{userName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">EMAIL PEMESAN</span>
            <span className="meta-value">{userEmail}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">METODE PEMBAYARAN</span>
            <span className="meta-value">{methodLabel}</span>
          </div>
        </div>

        <div className="divider-dashed" />

        {/* Rincian Tiket / Item Belanja */}
        <div className="receipt-items-section">
          <div className="items-header">
            <span>ITEM / DESTINASI</span>
            <span className="text-right">JUMLAH</span>
          </div>
          <div className="divider-solid" />

          {orderItems.map((item, idx) => {
            const qty = item.quantity || 1;
            const itemPrice = item.price || 0;
            const itemTotal = itemPrice * qty;
            return (
              <div key={idx} className="item-row">
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-sub">
                    {qty} x Rp {itemPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="item-total">
                  Rp {itemTotal.toLocaleString('id-ID')}
                </div>
              </div>
            );
          })}
        </div>

        <div className="divider-dashed" />

        {/* Ringkasan Biaya */}
        <div className="receipt-totals-section">
          <div className="total-row">
            <span>Subtotal</span>
            <span>Rp {(subtotal || totalAmount).toLocaleString('id-ID')}</span>
          </div>
          <div className="total-row">
            <span>Biaya Layanan / Admin</span>
            <span>{shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'Rp 0'}</span>
          </div>
          {discount > 0 && (
            <div className="total-row discount-row">
              <span>Diskon Kupon Promo</span>
              <span>- Rp {discount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="divider-double" />
          <div className="total-row final-total">
            <span>TOTAL BAYAR</span>
            <span>Rp {(totalAmount || subtotal).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Cap Lunas */}
        <div className="stamp-box">
          <div className="stamp-text">★ LUNAS / PAYMENT CONFIRMED ★</div>
          <div className="stamp-sub">BERLAKU RESMI SEBAGAI E-TIKET & STRUK PEMBAYARAN</div>
        </div>

        {/* QR Code Boarding Pass */}
        <div className="receipt-qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`}
            alt="Ticket QR Code"
            className="qr-img"
          />
          <div className="qr-caption">
            <strong>KODE VERIFIKASI: {bookingCode}</strong>
            <p>Scan QR Code di loket destinasi atau kasir sentra kuliner untuk validasi langsung tanpa antre.</p>
          </div>
        </div>

        {/* Footer Catatan */}
        <div className="receipt-footer">
          <div className="divider-dashed" />
          <div className="footer-title">MATUR NUWUN - TERIMA KASIH</div>
          <div className="footer-desc">
            Harap simpan struk fisik / berkas PDF ini saat berkunjung. Untuk bantuan hubungi Pusat Informasi Hamemayu di (0274) 589223 atau info@jogjahamemayu.id.
          </div>
          <div className="footer-meta">Dicetak secara digital oleh Hamemayu Cultural Ticketing System</div>
        </div>
      </div>
    </div>
  );
}
