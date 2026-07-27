import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, ShoppingBag, Send, Heart } from 'lucide-react';

export default function Footer({ onCategorySelect, onRequestAdminAccess }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', marginTop: '60px' }}>
      {/* 1. Trust Features Banner */}
      <div style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '36px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          {/* Feature 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Free Express Delivery</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '220px' }}>
              On all orders over ₹499 across the neighborhood
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '220px' }}>
              Hassle-free 100% fresh replacement guarantee
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>100% Secure Payments</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '220px' }}>
              Encrypted checkout with UPI, Cards & Cash on Delivery
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>120+ Authentic Products</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '220px' }}>
              Direct from local farms & trusted organic brands
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 32px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>FreshBasket</span>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#059669', marginLeft: '6px', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>LOCAL SHOP</span>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.6', margin: '0 0 16px 0', maxWidth: '320px' }}>
              FreshBasket is your premier neighborhood grocery store bringing organic farm-fresh produce, dairy, fresh sourdough bakery, and daily staples with instant home delivery.
            </p>
          </div>

          {/* Top Categories */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Top Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Produce', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks & Staples', 'Meats & Seafood'].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onCategorySelect && onCategorySelect(cat)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '14px',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#059669'}
                    onMouseOut={(e) => e.target.style.color = '#475569'}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Club Newsletter */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Join FreshBasket Club</h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Subscribe for fresh arrival alerts, seasonal produce drops, and exclusive discount codes.
            </p>
            {subscribed ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>
                🎉 Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'backgroundColor 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div>
            © 2026 FreshBasket Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Local Grocery Shop
            {onRequestAdminAccess && (
              <button
                onClick={onRequestAdminAccess}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', marginLeft: '10px' }}
                title="Store Manager Login"
              >
                🔒
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
