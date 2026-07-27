import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Your Grocery Cart</h2>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                {cartItems.reduce((a, b) => a + b.quantity, 0)} items selected
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <ShoppingBag size={56} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Your cart is empty</h3>
              <p style={{ fontSize: '13px' }}>Add fresh produce, dairy, or bakery items to start your order.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                      {product.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      ₹{product.price.toFixed(0)} / {product.unit}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 6px' }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: '#0f172a' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: '800', minWidth: '16px', textAlign: 'center' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: '#0f172a', opacity: quantity >= product.stock_quantity ? 0.4 : 1 }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        (Max: {product.stock_quantity})
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
                      ₹{(product.price * quantity).toFixed(0)}
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{subtotal.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#64748b' }}>
              <span>GST / Tax (5%)</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: '800', color: '#0f172a', paddingTop: '12px', borderTop: '1px solid #cbd5e1' }}>
              <span>Total Amount</span>
              <span style={{ color: '#059669' }}>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
