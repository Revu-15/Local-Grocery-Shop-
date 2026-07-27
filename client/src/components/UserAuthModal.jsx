import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, X, Check, Lock, LogIn, UserPlus, LogOut, ShieldCheck } from 'lucide-react';

export default function UserAuthModal({ isOpen, onClose, user, onSaveUser, onSignOut }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [signInEmail, setSignInEmail] = useState(user?.email || '');
  const [signInPassword, setSignInPassword] = useState('******');

  const [signUpData, setSignUpData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    address: user?.address || ''
  });

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const loggedUser = {
      id: user?.id || 'USER-' + Date.now().toString().slice(-6),
      name: user?.name || (signInEmail.split('@')[0] ? signInEmail.split('@')[0].toUpperCase() : 'Customer User'),
      email: signInEmail || 'user@example.com',
      phone: user?.phone || '9876543210',
      address: user?.address || '100 Feet Road, Indiranagar, Bengaluru'
    };
    onSaveUser(loggedUser);
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: 'USER-' + Date.now().toString().slice(-6),
      name: signUpData.name,
      email: signUpData.email,
      phone: signUpData.phone,
      address: signUpData.address
    };
    onSaveUser(newUser);
    onClose();
  };

  const handleQuickLogin = (demoUser) => {
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
        maxWidth: '460px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
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
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
            {authMode === 'signin' ? 'Sign In to Your Account' : 'Create New Account'}
          </h2>
          <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '6px', marginTop: '6px' }}>
            ACCOUNT ID: {user?.id || 'GUEST-ID'}
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              borderBottom: authMode === 'signin' ? '3px solid #059669' : '3px solid transparent',
              backgroundColor: authMode === 'signin' ? '#fff' : 'transparent',
              color: authMode === 'signin' ? '#059669' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              borderBottom: authMode === 'signup' ? '3px solid #059669' : '3px solid transparent',
              backgroundColor: authMode === 'signup' ? '#fff' : 'transparent',
              color: authMode === 'signup' ? '#059669' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={16} /> Sign Up (New User)
          </button>
        </div>

        {/* Tab 1: SIGN IN FORM */}
        {authMode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Email Address or Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul.sharma@gmail.com or 9876543210"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Account Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter your account password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Quick Demo Sign In Accounts */}
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                Or One-Click Demo Sign In:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin({
                    id: 'USER-1001',
                    name: 'Rahul Sharma',
                    email: 'rahul.sharma@gmail.com',
                    phone: '9876543210',
                    address: '100 Feet Road, Indiranagar, Bengaluru'
                  })}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  👤 Rahul
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin({
                    id: 'USER-1002',
                    name: 'Priya Patel',
                    email: 'priya.patel@yahoo.com',
                    phone: '9820198201',
                    address: 'Koramangala 5th Block, Bengaluru'
                  })}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  👩 Priya
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin({
                    id: 'USER-1003',
                    name: 'Amit Kumar',
                    email: 'amit.kumar@outlook.com',
                    phone: '9900112233',
                    address: 'Whitefield, Bengaluru'
                  })}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  👨 Amit
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '15px' }}>
              <LogIn size={18} /> Sign In to Account
            </button>

            {onSignOut && (
              <button
                type="button"
                onClick={() => { onSignOut(); onClose(); }}
                style={{
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} /> Sign Out of Current Account
              </button>
            )}
          </form>
        ) : (
          /* Tab 2: SIGN UP / REGISTER FORM */
          <form onSubmit={handleSignUpSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Full Name / Username *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Raina"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. suresh@gmail.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Phone Number (+91) *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9887766554"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Create Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="Choose strong password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Delivery Address *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. HSR Layout, Sector 2, Bengaluru"
                  value={signUpData.address}
                  onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px 8px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '15px', marginTop: '4px' }}>
              <UserPlus size={18} /> Register & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
