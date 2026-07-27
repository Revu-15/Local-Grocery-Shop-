import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../utils/api';
import { Package, Clock, Printer, ChevronDown, ChevronUp, ShoppingBag, Truck, Store } from 'lucide-react';

export default function OrderHistory({ onSelectReceipt }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-success">Completed</span>;
      case 'Processing':
        return <span className="badge badge-info">Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center', color: '#64748b' }}>
        Loading order records...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>My Order History</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Track placed grocery orders and reprint billing receipts</p>
        </div>
        <button className="btn btn-outline" onClick={loadOrders}>
          Refresh List
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '20px', color: '#94a3b8' }}>
          <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No Orders Found</h3>
          <p style={{ fontSize: '14px' }}>You have not placed any grocery orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="glass-card animate-fade-in"
                style={{ borderRadius: '16px', overflow: 'hidden' }}
              >
                {/* Order Row Bar */}
                <div style={{
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {order.delivery_type === 'COD' ? <Truck size={22} /> : <Store size={22} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                          Order #{order.order_number}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', gap: '12px' }}>
                        <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> {new Date(order.created_at).toLocaleString()}</span>
                        <span>• {order.delivery_type === 'COD' ? 'Cash on Delivery' : 'In-Store Pickup'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>
                        ₹{order.total_amount.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {order.items?.length || 0} items
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectReceipt(order)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                    >
                      <Printer size={15} /> Receipt
                    </button>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      style={{ border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Item Breakdown */}
                {isExpanded && (
                  <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Itemized Breakdown
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0f172a', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                          <span>{item.quantity}x {item.product_name} (@ ₹{item.unit_price.toFixed(0)})</span>
                          <span style={{ fontWeight: '700' }}>₹{item.subtotal.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <strong>Customer:</strong> {order.customer_name} ({order.customer_phone})<br />
                      <strong>Address:</strong> {order.address || 'In-Store Pickup'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
