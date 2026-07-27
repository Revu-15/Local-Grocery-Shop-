import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, X, Check, Lock, LogIn, UserPlus, LogOut, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { sendAuthOtp, verifyAuthOtp } from '../utils/api';

const LOCAL_USERS_KEY = 'grocery_registered_users';

const initialDemoUsers = [
  { id: 'USER-1001', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '9876543210', password: '123', address: '100 Feet Road, Indiranagar, Bengaluru' },
  { id: 'USER-1002', name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '9820198201', password: '123', address: 'Koramangala 5th Block, Bengaluru' },
  { id: 'USER-1003', name: 'Amit Kumar', email: 'amit.kumar@outlook.com', phone: '9900112233', password: '123', address: 'Whitefield, Bengaluru' }
];

const getRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem(LOCAL_USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialDemoUsers));
  return initialDemoUsers;
};

export default function UserAuthModal({ isOpen, onClose, user, onSaveUser, onSignOut }) {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [signInEmail, setSignInEmail] = useState(user?.email || '');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });

  // OTP Verification state
  const [signUpStep, setSignUpStep] = useState('FORM'); // 'FORM' or 'OTP'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login submission with strict credential checking against stored accounts
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const registered = getRegisteredUsers();
    const queryTerm = signInEmail.trim().toLowerCase();

    const matchedUser = registered.find(
      (u) => (u.email?.toLowerCase() === queryTerm || u.phone?.trim() === queryTerm)
    );

    if (!matchedUser) {
      setErrorMsg('❌ Account not found! Please create a new account via Sign Up first.');
      return;
    }

    if (matchedUser.password && signInPassword !== matchedUser.password) {
      setErrorMsg('❌ Incorrect Password! Please check your account credentials.');
      return;
    }

    onSaveUser(matchedUser);
    onClose();
  };

  // Step 1: Send SMS/Email OTP via backend API
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signUpData.name || !signUpData.phone || !signUpData.email || !signUpData.password || !signUpData.address) {
      setErrorMsg('Please fill in all fields (Name, Phone, Email, Password, Address).');
      return;
    }

    const registered = getRegisteredUsers();
    const queryEmail = signUpData.email.trim().toLowerCase();
    const queryPhone = signUpData.phone.trim();

    const existing = registered.find(
      (u) => u.email?.toLowerCase() === queryEmail || u.phone?.trim() === queryPhone
    );

    if (existing) {
      setErrorMsg(`An account with email "${signUpData.email}" or phone "${signUpData.phone}" already exists! Please Sign In.`);
      return;
    }

    try {
      const res = await sendAuthOtp(signUpData.phone, signUpData.email);
      setGeneratedOtp(res.otp || Math.floor(100000 + Math.random() * 900000).toString());
      setSignUpStep('OTP');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch OTP to your phone & email.');
    }
  };

  // Step 2: Verify OTP via backend API & Create Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await verifyAuthOtp(signUpData.phone, signUpData.email, userEnteredOtp);

      const registered = getRegisteredUsers();
      const newUser = {
        id: 'USER-' + Date.now().toString().slice(-6),
        name: signUpData.name,
        email: signUpData.email.trim(),
        phone: signUpData.phone.trim(),
        password: signUpData.password,
        address: signUpData.address
      };

      const updatedUsers = [...registered, newUser];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));

      // Pre-fill Sign In form & switch to Sign In mode
      setSignInEmail(newUser.email);
      setSignInPassword(newUser.password);
      setSuccessMsg(`✓ Phone & Email OTP Verified! Account for "${newUser.name}" created. Click Sign In below.`);
      setAuthMode('signin');
      setSignUpStep('FORM');
      setUserEnteredOtp('');
    } catch (err) {
      setErrorMsg(err.message || '❌ Invalid 6-digit OTP code!');
    }
  };

  const handleQuickLogin = (demoUser) => {
    setSignInEmail(demoUser.email);
    setSignInPassword(demoUser.password || '123');
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <ShieldCheck size={28} />
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
              {user ? 'My Account Profile' : 'Customer Account Access'}
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#ecfdf5', opacity: 0.9 }}>
            {user ? `Logged in as ${user.name}` : 'Sign in to your account or create a new verified account'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
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
            <LogIn size={16} /> Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setSignUpStep('FORM'); setErrorMsg(''); }}
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

        {/* Global Error Banner */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Tab 1: SIGN IN FORM */}
        {authMode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {successMsg && (
              <div style={{ backgroundColor: '#dcfce7', border: '1.5px solid #86efac', color: '#15803d', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div>{successMsg}</div>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Email Address or Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="Registered Email or Phone Number"
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

            {/* Quick Registered Accounts */}
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                Quick Registered Accounts (Password: 123):
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {getRegisteredUsers().slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    style={{ flex: 1, padding: '6px 8px', fontSize: '11px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
                  >
                    👤 {u.name.split(' ')[0]}
                  </button>
                ))}
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
          /* Tab 2: SIGN UP / REGISTER FORM WITH OTP VERIFICATION */
          signUpStep === 'FORM' ? (
            <form onSubmit={handleSendOtp} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  Create Account Password *
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
                <KeyRound size={18} /> Send SMS & Email OTP Verification
              </button>
            </form>
          ) : (
            /* OTP VERIFICATION STEP */
            <form onSubmit={handleVerifyOtp} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#ecfdf5', border: '1.5px solid #a7f3d0', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#047857', marginBottom: '6px' }}>
                  📲 OTP Sent to Your Mobile & Email!
                </div>
                <div style={{ fontSize: '12px', color: '#065f46', lineHeight: '1.5' }}>
                  6-digit verification code dispatched to <strong>+91 {signUpData.phone}</strong> & <strong>{signUpData.email}</strong>.
                  <br />
                  Please check your mobile phone SMS and email inbox to enter the code below.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Enter 6-Digit Verification OTP Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={userEnteredOtp}
                  onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #059669', fontSize: '20px', fontWeight: '900', textAlign: 'center', letterSpacing: '6px', fontFamily: 'monospace', outline: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const code = generatedOtp || '123456';
                    setUserEnteredOtp(code);
                    alert(`📱 SMS Gateway Notice:\n\nOTP Code for +91 ${signUpData.phone}: ${code}\n\nCode auto-filled into box! Click Verify to continue.`);
                  }}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', textDecoration: 'underline' }}
                >
                  📩 Didn't receive SMS? Click to view & auto-fill OTP ({generatedOtp || '123456'})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSignUpStep('FORM')}
                  style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: '700', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  ⬅ Edit Details
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '12px', fontSize: '14px', borderRadius: '12px' }}
                >
                  <ShieldCheck size={18} /> Verify OTP & Create Account
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
