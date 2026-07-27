import React, { useState, useEffect } from 'react';
import { fetchSalesReport, resetSeedData } from '../utils/api';
import { DollarSign, ShoppingBag, AlertTriangle, XCircle, TrendingUp, RefreshCw, Layers } from 'lucide-react';

export default function AdminDashboard({ onNavigateToInventory }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await fetchSalesReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to load sales report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database to initial dummy grocery products and clear orders?')) return;
    try {
      setResetting(true);
      await resetSeedData();
      await loadReport();
      alert('Database reset & re-seeded successfully!');
    } catch (err) {
      alert('Failed to reset database: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1280px', margin: '40px auto', textAlign: 'center', color: '#64748b' }}>
        Generating store analytics & daily report...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Store Owner Dashboard</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Real-time inventory alerts, daily revenue, and customer order analytics</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={loadReport}>
            <RefreshCw size={16} /> Refresh Metrics
          </button>
          <button className="btn btn-outline" onClick={handleResetSeed} disabled={resetting}>
            {resetting ? 'Resetting...' : 'Reset Dummy Seed Data'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Revenue */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Daily Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>
            ₹{report?.total_revenue.toFixed(2) || '0.00'}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Completed & active orders
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Total Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>
            {report?.total_orders || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Customer checkouts</div>
        </div>

        {/* Low Stock Warning */}
        <div
          className="glass-card"
          onClick={onNavigateToInventory}
          style={{ padding: '20px', borderRadius: '16px', cursor: 'pointer', border: report?.low_stock_count > 0 ? '1.5px solid #f59e0b' : '1px solid #e2e8f0' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#b45309' }}>Low Stock Alerts</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#b45309', marginBottom: '4px' }}>
            {report?.low_stock_count || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', fontWeight: '600' }}>Items below threshold</div>
        </div>

        {/* Out of Stock */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#b91c1c' }}>Out of Stock</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#b91c1c', marginBottom: '4px' }}>
            {report?.out_of_stock_count || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: '600' }}>Requires immediate reorder</div>
        </div>
      </div>

      {/* Analytics Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Top Selling Grocery Products */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: '#059669' }} /> Top Selling Grocery Products
          </h3>
          {report?.top_items?.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>
              No orders placed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report?.top_items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{item.product_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.total_qty} units sold</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                    ₹{item.total_sales.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Revenue Breakdown */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: '#0284c7' }} /> Category Revenue Distribution
          </h3>
          {report?.category_sales?.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>
              No sales data available.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {report?.category_sales?.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                    <span>{cat.category}</span>
                    <span>₹{cat.sales.toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (cat.sales / (report.total_revenue || 1)) * 100)}%`,
                      height: '100%',
                      backgroundColor: idx === 0 ? '#059669' : idx === 1 ? '#0284c7' : idx === 2 ? '#f59e0b' : '#8b5cf6',
                      borderRadius: '9999px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
