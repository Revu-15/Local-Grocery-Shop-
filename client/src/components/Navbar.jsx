import React from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Store,
  UserCheck,
  PackageCheck,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  History,
  Sparkles,
  Github,
  User
} from 'lucide-react';

export default function Navbar({
  role,
  setRole,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  cartCount,
  setIsCartOpen,
  user,
  onOpenAuthModal,
  onRequestAdminAccess,
  isAdminAuthenticated,
  onLockAdmin
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab(role === 'admin' ? 'dashboard' : 'shop')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(5,150,105,0.3)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              FreshBasket <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>Local Shop</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              Freshness & Convenience Delivered
            </div>
          </div>
        </div>

        {/* Search Bar (When in Shop or Inventory) */}
        {(activeTab === 'shop' || activeTab === 'inventory' || activeTab === 'orders') && (
          <div style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={
                activeTab === 'shop' ? "Search fresh fruits, milk, bakery..." :
                activeTab === 'inventory' ? "Search item name or category..." : "Search order # or customer..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: '9999px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
        )}

        {/* View Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {role === 'customer' ? (
            <>
              <button
                className={`btn ${activeTab === 'shop' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('shop')}
              >
                <Store size={16} /> Shop Catalog
              </button>
              <button
                className={`btn ${activeTab === 'my-orders' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('my-orders')}
              >
                <History size={16} /> My Orders
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} /> Overview
              </button>
              <button
                className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('inventory')}
              >
                <Boxes size={16} /> Inventory
              </button>
              <button
                className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('orders')}
              >
                <ClipboardList size={16} /> Orders
              </button>
            </>
          )}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart Button (For Customers) */}
          {role === 'customer' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-primary"
              style={{ position: 'relative', padding: '10px 16px' }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  fontWeight: '800',
                  fontSize: '12px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Customer Profile / Login Button */}
          {role === 'customer' && (
            <button
              onClick={onOpenAuthModal}
              className="btn btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ecfdf5',
                borderColor: '#a7f3d0',
                color: '#047857'
              }}
              title="Click to change username, email, phone or delivery address"
            >
              <User size={15} />
              <span style={{ fontWeight: '700' }}>{user?.name || 'Customer Login'}</span>
            </button>
          )}

          {/* Admin Owner Controls - Shown ONLY when Unlocked or via Secret Owner Trigger */}
          {isAdminAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => { setRole('admin'); setActiveTab('dashboard'); }}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '13px', backgroundColor: '#0f172a', borderColor: '#0f172a' }}
              >
                <PackageCheck size={14} /> Admin Dashboard
              </button>
              <button
                onClick={onLockAdmin}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fef2f2' }}
                title="Lock Admin Panel & return to Customer view"
              >
                🔒 Exit Admin
              </button>
            </div>
          ) : (
            /* Discrete Secret Store Owner Button */
            <button
              onClick={onRequestAdminAccess}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '12px',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              title="Store Manager Login"
            >
              🔒
            </button>
          )}

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/Revu-15/Local-Grocery-Shop-"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '13px' }}
            title="View Code on GitHub"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
