import React, { useState } from 'react';
import { X, Truck, Store, User, Phone, MapPin, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [deliveryType, setDeliveryType] = useState('COD'); // 'COD' or 'Pickup'
  const [address, setAddress] = useState(user?.address || '12 MG Road, Indiranagar, Bengaluru');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setError('Please provide your name and phone number.');
      return;
    }
    if (deliveryType === 'COD' && !address) {
      setError('Please enter a delivery address for Cash on Delivery.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_type: deliveryType,
        address: deliveryType === 'COD' ? address : 'In-Store Pickup Counter',
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const result = await onOrderSuccess(orderPayload);
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
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        borderRadius: '20px',
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Complete Order Checkout</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Select fulfillment mode and customer info</p>
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

          {/* Fulfillment Type Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Fulfillment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeliveryType('COD')}
                style={{
                  padding: '14px',
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
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Pay at doorstep</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('Pickup')}
                style={{
                  padding: '14px',
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
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Delivery Address (If COD) */}
          {deliveryType === 'COD' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Delivery Street Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Payment Note & Total Box */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
              <span>Items Subtotal ({cartItems.length})</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
              <span>GST / Tax (5%)</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#0f172a', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
              <span>Order Total</span>
              <span style={{ color: '#059669' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            {loading ? 'Processing Stock & Order...' : `Confirm & Place Order (₹${total.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}
