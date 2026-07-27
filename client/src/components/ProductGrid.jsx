import React from 'react';
import ProductCard from './ProductCard';
import { Filter, Sparkles, AlertTriangle } from 'lucide-react';

const CATEGORIES = ["All", "Produce", "Dairy & Eggs", "Bakery", "Beverages", "Snacks & Staples", "Meats & Seafood"];

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  selectedCategory,
  setSelectedCategory,
  showLowStockOnly,
  setShowLowStockOnly,
  cartItems,
  addToCart,
  updateQuantity
}) {
  const getCartItem = (productId) => cartItems.find((item) => item.product.id === productId);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        borderRadius: '20px',
        padding: '32px 40px',
        color: '#fff',
        marginBottom: '32px',
        boxShadow: '0 10px 25px rgba(5,150,105,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2, maxWidth: '600px' }}>
          <span style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px'
          }}>
            <Sparkles size={14} /> Local Farm Fresh Guarantee
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '10px' }}>
            Daily Fresh Groceries, Instant Pickup & Home Delivery
          </h1>
          <p style={{ fontSize: '15px', color: '#a7f3d0', fontWeight: '500' }}>
            Order organic produce, dairy, fresh sourdough, beverages, and pantry essentials directly from your neighborhood grocery store.
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.15,
          pointerEvents: 'none'
        }}>
          <Sparkles size={260} />
        </div>
      </div>

      {/* Category Filter Pills & Stock Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedCategory === cat ? '#0f172a' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#475569',
                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(15,23,42,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Low Stock Quick Filter */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '700',
          color: showLowStockOnly ? '#b45309' : '#475569',
          cursor: 'pointer',
          backgroundColor: showLowStockOnly ? '#fef3c7' : '#fff',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s'
        }}>
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }}
          />
          <AlertTriangle size={15} style={{ color: showLowStockOnly ? '#b45309' : '#f59e0b' }} />
          Show Low Stock / Restock Items Only
        </label>
      </div>

      {/* Product Grid / Loading / Error States */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '20px', color: '#059669' }}>
          <Sparkles size={40} className="animate-fade-in" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Loading Fresh Groceries...</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Connecting to inventory database...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', borderRadius: '20px', color: '#b45309', border: '1.5px solid #f59e0b' }}>
          <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Backend Server Waking Up</h3>
          <p style={{ fontSize: '14px', maxWidth: '440px', margin: '0 auto 16px auto', color: '#64748b' }}>
            {error}
          </p>
          <button onClick={onRetry} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Sparkles size={16} /> Retry Loading Products
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '60px 20px',
          borderRadius: '20px',
          color: '#64748b'
        }}>
          <Filter size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            No Grocery Products Found
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 16px auto' }}>
            Try selecting a different category or clearing your search filters to view available store items.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setShowLowStockOnly(false); }}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={getCartItem(product.id)}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
