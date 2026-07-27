import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, X, Check, ShieldCheck } from 'lucide-react';

export default function UserAuthModal({ isOpen, onClose, user, onSaveUser }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUser(formData);
    onClose();
  };

  const handleQuickLogin = (demoUser) => {
    setFormData(demoUser);
    onSaveUser(demoUser);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#fff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <User size={26} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Customer Login & Profile</h2>
          <p style={{ fontSize: '13px', color: '#a7f3d0', margin: '4px 0 0 0' }}>
            Enter your details for quick checkout & order tracking
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Full Name / Username *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="email"
                required
                placeholder="e.g. rahul.sharma@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Phone Number (+91) *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Delivery Address (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="e.g. #42, 10th Main, Indiranagar, Bengaluru"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Preset Quick Login buttons */}
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
              Or Quick Login Demo Accounts:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin({
                  name: 'Rahul Sharma',
                  email: 'rahul.sharma@gmail.com',
                  phone: '9876543210',
                  address: '100 Feet Road, Indiranagar, Bengaluru'
                })}
                style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                👤 Rahul (Customer)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin({
                  name: 'Priya Patel',
                  email: 'priya.patel@yahoo.com',
                  phone: '9820198201',
                  address: 'Koramangala 5th Block, Bengaluru'
                })}
                style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                👩 Priya (Customer)
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '15px', marginTop: '4px' }}>
            <Check size={18} /> Save & Continue Shopping
          </button>
        </form>
      </div>
    </div>
  );
}
