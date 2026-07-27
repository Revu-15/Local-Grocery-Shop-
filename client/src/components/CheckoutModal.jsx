import React, { useState } from 'react';
import { X, Truck, Store, User, Phone, MapPin, CreditCard, AlertCircle, CheckCircle2, QrCode, ShieldCheck, Wallet, Landmark } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  user
}) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(user?.name || 'Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '9876543210');
  const [deliveryType, setDeliveryType] = useState('COD'); // 'COD', 'UPI', 'Card', 'Pickup'
  const [address, setAddress] = useState(user?.address || '12 MG Road, Indiranagar, Bengaluru');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Online Payment Card & Verification Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('rahul@okicici');
  const [utrNumber, setUtrNumber] = useState('');
  const [hasCompletedOnlinePayment, setHasCompletedOnlinePayment] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const isValidUtr = /^\d{12}$/.test(utrNumber.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if ((deliveryType === 'COD' || deliveryType === 'UPI' || deliveryType === 'Card') && !address) {
      setError('Please enter a delivery address.');
      return;
    }
    if (deliveryType === 'UPI' && !isValidUtr) {
      setError('Please enter a valid 12-digit numeric PhonePe / UPI UTR Number (e.g. 429182910481).');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const isOnlinePaid = deliveryType === 'UPI' || deliveryType === 'Card';
      const orderPayload = {
        user_id: user?.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_type: deliveryType === 'UPI' ? 'UPI (Online)' : deliveryType === 'Card' ? 'Card (Online)' : deliveryType === 'Pickup' ? 'In-Store Pickup' : 'Cash on Delivery',
        payment_status: deliveryType === 'UPI' ? 'UPI Pending Verification' : deliveryType === 'Card' ? 'Paid' : 'Pending COD',
        transaction_ref: deliveryType === 'UPI' ? `UTR: ${utrNumber}` : (cardNumber ? `CARD: ****${cardNumber.slice(-4)}` : 'N/A'),
        address: deliveryType === 'Pickup' ? 'In-Store Pickup Counter' : address,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      await onOrderSuccess(orderPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to complete checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Complete Order Checkout</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Select payment option & delivery details</p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: '#e2e8f0', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              Select Payment & Fulfillment Option *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Option 1: Instant UPI / QR */}
              <button
                type="button"
                onClick={() => setDeliveryType('UPI')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: deliveryType === 'UPI' ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: deliveryType === 'UPI' ? '#ecfdf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <QrCode size={22} style={{ color: deliveryType === 'UPI' ? '#059669' : '#64748b' }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>UPI / QR Code</div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>GPay, PhonePe, Paytm</div>
                </div>
              </button>

              {/* Option 2: Card / Net Banking */}
              <button
                type="button"
                onClick={() => setDeliveryType('Card')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: deliveryType === 'Card' ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: deliveryType === 'Card' ? '#ecfdf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <CreditCard size={22} style={{ color: deliveryType === 'Card' ? '#059669' : '#64748b' }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Visa, Mastercard, RuPay</div>
                </div>
              </button>

              {/* Option 3: COD */}
              <button
                type="button"
                onClick={() => setDeliveryType('COD')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: deliveryType === 'COD' ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: deliveryType === 'COD' ? '#ecfdf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Truck size={20} style={{ color: deliveryType === 'COD' ? '#059669' : '#64748b' }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Pay cash at doorstep</div>
                </div>
              </button>

              {/* Option 4: Pickup */}
              <button
                type="button"
                onClick={() => setDeliveryType('Pickup')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: deliveryType === 'Pickup' ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: deliveryType === 'Pickup' ? '#ecfdf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Store size={20} style={{ color: deliveryType === 'Pickup' ? '#059669' : '#64748b' }} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>In-Store Pickup</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Ready in 15 mins</div>
                </div>
              </button>
            </div>
          </div>

          {/* ONLINE PAYMENT INTERFACES */}
          {deliveryType === 'UPI' && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '20px', borderRadius: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <QrCode size={20} /> Scan QR Code with Any UPI App to Pay
              </div>

              {/* Large Dynamic Real Scannable UPI QR Code Scanner Box */}
              <div style={{ width: '160px', height: '160px', backgroundColor: '#fff', padding: '10px', borderRadius: '16px', border: '2px solid #059669', margin: '0 auto 14px auto', boxShadow: '0 4px 12px rgba(5,150,105,0.15)' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=polamreddyrevanth.82@oksbi&pn=FreshBasket%20Grocery&am=${total}&cu=INR`)}`}
                  alt="Scan UPI QR Code to Pay"
                  style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                />
              </div>

              <div style={{ fontSize: '15px', fontWeight: '800', color: '#059669', marginBottom: '6px' }}>
                Amount Payable: ₹{total.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                Open <strong>Google Pay, PhonePe, Paytm, BHIM or any Banking App</strong> & scan this QR code.
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`upi://pay?pa=polamreddyrevanth.82@oksbi&pn=FreshBasket%20Grocery&am=${total}&cu=INR`}
                  style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '800', backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' }}
                >
                  📲 Tap to Open Mobile UPI App
                </a>
              </div>

              {/* UTR / Transaction Reference Number Input */}
              <div style={{ marginTop: '14px', textAlign: 'left', backgroundColor: '#fff', padding: '14px', borderRadius: '12px', border: isValidUtr ? '2px solid #059669' : '1.5px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#166534' }}>
                    Enter 12-Digit PhonePe / UPI UTR No. *
                  </label>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isValidUtr ? '#059669' : '#94a3b8' }}>
                    {utrNumber.length}/12 Digits
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={12}
                  placeholder="e.g. 429182910481 (Exact 12 Numbers)"
                  value={utrNumber}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setUtrNumber(cleaned);
                    if (/^\d{12}$/.test(cleaned)) {
                      setHasCompletedOnlinePayment(true);
                    } else {
                      setHasCompletedOnlinePayment(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isValidUtr ? '1.5px solid #059669' : '1px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    fontFamily: 'monospace',
                    color: '#0f172a'
                  }}
                />
                <div style={{ fontSize: '11px', marginTop: '6px', fontWeight: '700', color: isValidUtr ? '#059669' : '#dc2626' }}>
                  {isValidUtr
                    ? `✓ 12-Digit UTR Submitted (${utrNumber}) — Store owner will verify in bank app upon order arrival`
                    : `⚠️ Enter exact 12-digit numeric PhonePe UTR No. from your payment receipt`}
                </div>
              </div>

              {/* Payment Verification Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: !isValidUtr ? 'not-allowed' : 'pointer',
                marginTop: '12px',
                fontSize: '13px',
                fontWeight: '700',
                color: (isValidUtr && hasCompletedOnlinePayment) ? '#15803d' : '#94a3b8',
                backgroundColor: (isValidUtr && hasCompletedOnlinePayment) ? '#dcfce7' : '#f8fafc',
                padding: '10px 14px',
                borderRadius: '10px',
                border: (isValidUtr && hasCompletedOnlinePayment) ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                transition: 'all 0.2s'
              }}>
                <input
                  type="checkbox"
                  disabled={!isValidUtr}
                  checked={isValidUtr && hasCompletedOnlinePayment}
                  onChange={(e) => setHasCompletedOnlinePayment(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: !isValidUtr ? 'not-allowed' : 'pointer' }}
                />
                <span>
                  {(isValidUtr && hasCompletedOnlinePayment)
                    ? `✓ I confirm I paid ₹${total.toFixed(2)} via UPI (UTR: ${utrNumber})`
                    : 'Enter exact 12-digit PhonePe UTR No. above to unlock check mark'}
                </span>
              </label>
            </div>
          )}

          {deliveryType === 'Card' && (
            <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={18} style={{ color: '#4f46e5' }} /> Enter Card Details
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 •••• •••• 8921"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="08/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Customer Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Phone Number (+91)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryType !== 'Pickup' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Delivery Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}

          {/* Order Bill Summary Box */}
          <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
              <span>Items Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
              <span>GST Tax (5%)</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#059669', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || ((deliveryType === 'UPI' || deliveryType === 'Card') && !hasCompletedOnlinePayment)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              borderRadius: '12px',
              backgroundColor: (deliveryType === 'UPI' || deliveryType === 'Card')
                ? (hasCompletedOnlinePayment ? '#059669' : '#94a3b8')
                : '#0f172a',
              borderColor: (deliveryType === 'UPI' || deliveryType === 'Card')
                ? (hasCompletedOnlinePayment ? '#059669' : '#94a3b8')
                : '#0f172a',
              cursor: ((deliveryType === 'UPI' || deliveryType === 'Card') && !hasCompletedOnlinePayment) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading
              ? 'Processing Order...'
              : (deliveryType === 'UPI' || deliveryType === 'Card')
                ? (hasCompletedOnlinePayment
                    ? `✓ Payment Paid (₹${total.toFixed(2)}) - Submit Order`
                    : `1. Scan & Confirm Payment Above ⬆`)
                : `Place Order (₹${total.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}
