import React from 'react';
import { Plus, Minus, ShoppingCart, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ProductCard({ product, cartItem, addToCart, updateQuantity }) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  return (
    <div className="glass-card animate-fade-in" style={{
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      {/* Image & Badges Container */}
      <div style={{ position: 'relative', height: '180px', width: '100%', backgroundColor: '#f1f5f9' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Category Pill */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#fff',
          backdropFilter: 'blur(4px)',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>
          {product.category}
        </span>

        {/* Stock Status Badge */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
          {isOutOfStock ? (
            <span className="badge badge-danger">
              <XCircle size={12} /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="badge badge-warning">
              <AlertTriangle size={12} /> Only {product.stock_quantity} left!
            </span>
          ) : (
            <span className="badge badge-success">
              <CheckCircle size={12} /> In Stock ({product.stock_quantity})
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
            Per {product.unit}
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', lineHeight: '1.3' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
            {product.description || 'Fresh quality local item.'}
          </p>
        </div>

        {/* Footer: Price & Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>
              ₹{product.price.toFixed(0)}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>
              / {product.unit}
            </span>
          </div>

          {/* Add to Cart logic */}
          {isOutOfStock ? (
            <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Unavailable
            </button>
          ) : cartItem ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', borderRadius: '12px', padding: '4px 8px', border: '1px solid #a7f3d0' }}>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                style={{ border: 'none', background: '#fff', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: '800', color: '#065f46', fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.stock_quantity}
                style={{ border: 'none', background: '#fff', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', opacity: cartItem.quantity >= product.stock_quantity ? 0.5 : 1 }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              <ShoppingCart size={15} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
