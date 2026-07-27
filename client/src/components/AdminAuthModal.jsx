import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, Check, X } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '949254') {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Invalid Admin Security PIN. Access Denied.');
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
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          position: 'relative',
          textAlign: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.15)',
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
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Restricted Admin Access</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Store Manager Authorization Required
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} />
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Enter Admin Security PIN / Password *
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter 6-digit Secret Admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '15px',
                  outline: 'none',
                  letterSpacing: '2px'
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
              🔒 Protected Store Owner Portal
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '15px', backgroundColor: '#0f172a', borderColor: '#0f172a' }}>
            <Check size={18} /> Unlock Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
