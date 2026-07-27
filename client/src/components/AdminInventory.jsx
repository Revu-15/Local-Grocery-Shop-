import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../utils/api';
import ProductModal from './ProductModal';
import { Plus, Edit3, Trash2, AlertTriangle, CheckCircle, Search, Filter, RefreshCw } from 'lucide-react';

export default function AdminInventory({ searchQuery, setSearchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadInventory();
  }, [selectedCategory, searchQuery, showLowStockOnly]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({
        category: selectedCategory,
        search: searchQuery,
        low_stock: showLowStockOnly
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await createProduct(productData);
    }
    loadInventory();
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;
    try {
      await deleteProduct(id);
      loadInventory();
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  const handleStockAdjust = async (product, delta) => {
    const newQty = Math.max(0, product.stock_quantity + delta);
    try {
      // Optimistic update
      setProducts(products.map((p) => (p.id === product.id ? { ...p, stock_quantity: newQty } : p)));
      await updateProduct(product.id, { stock_quantity: newQty });
    } catch (err) {
      loadInventory();
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Inventory Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Real-time stock control, stock alerts, and product pricing</p>
        </div>

        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add New Grocery Item
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {["All", "Produce", "Dairy & Eggs", "Bakery", "Beverages", "Snacks & Staples", "Meats & Seafood"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#0f172a' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#64748b',
                border: selectedCategory === cat ? 'none' : '1px solid #cbd5e1'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: showLowStockOnly ? '#b45309' : '#475569' }}>
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            style={{ accentColor: '#f59e0b' }}
          />
          <AlertTriangle size={15} style={{ color: '#f59e0b' }} /> Low Stock Alert Items Only
        </label>
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading inventory products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
            No items matched your inventory filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Product</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Price / Unit</th>
                  <th style={{ padding: '14px 20px' }}>Stock Level</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center' }}>Quick Stock Adjust</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => {
                  const isOutOfStock = item.stock_quantity <= 0;
                  const isLowStock = !isOutOfStock && item.stock_quantity <= item.low_stock_threshold;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Product Name & Thumbnail */}
                      <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{item.id}</div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                          {item.category}
                        </span>
                      </td>

                      {/* Price & Unit */}
                      <td style={{ padding: '14px 20px', fontWeight: '700', color: '#0f172a' }}>
                        ₹{item.price.toFixed(0)} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>/ {item.unit}</span>
                      </td>

                      {/* Stock Level Badge */}
                      <td style={{ padding: '14px 20px' }}>
                        {isOutOfStock ? (
                          <span className="badge badge-danger">Out of Stock (0)</span>
                        ) : isLowStock ? (
                          <span className="badge badge-warning"><AlertTriangle size={12} /> Low Stock ({item.stock_quantity})</span>
                        ) : (
                          <span className="badge badge-success"><CheckCircle size={12} /> {item.stock_quantity} in stock</span>
                        )}
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                          Alert limit: ≤{item.low_stock_threshold}
                        </div>
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleStockAdjust(item, -1)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Deduct 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item, 5)}
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            title="Restock +5"
                          >
                            +5 Restock
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => { setEditingProduct(item); setIsModalOpen(true); }}
                            className="btn btn-outline"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id, item.name)}
                            className="btn btn-danger"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
