import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../utils/api';
import { ClipboardList, Search, Printer, Truck, Store, Phone, MapPin, Clock } from 'lucide-react';

export default function AdminOrders({ onSelectReceipt, searchQuery }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders({ status: statusFilter, search: searchQuery });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
      loadOrders();
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Customer Orders Pipeline</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Manage order fulfillment status, delivery, and print bills</p>
        </div>

        <button className="btn btn-secondary" onClick={loadOrders}>
          Refresh Orders
        </button>
      </div>

      {/* Status Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: statusFilter === status ? '#0f172a' : '#fff',
              color: statusFilter === status ? '#fff' : '#64748b',
              border: statusFilter === status ? 'none' : '1px solid #cbd5e1'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading customer orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
            No orders match the selected filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Order Details</th>
                  <th style={{ padding: '14px 20px' }}>Customer Info</th>
                  <th style={{ padding: '14px 20px' }}>Fulfillment</th>
                  <th style={{ padding: '14px 20px' }}>Items Summary</th>
                  <th style={{ padding: '14px 20px' }}>Total</th>
                  <th style={{ padding: '14px 20px' }}>Order Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Billing Receipt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Order Details */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>#{ord.order_number}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> {new Date(ord.created_at).toLocaleString()}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        <Phone size={11} style={{ display: 'inline' }} /> {ord.customer_phone}
                      </div>
                      {ord.address && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                          <MapPin size={10} style={{ display: 'inline' }} /> {ord.address}
                        </div>
                      )}
                    </td>

                    {/* Fulfillment */}
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`badge ${ord.delivery_type === 'COD' ? 'badge-info' : 'badge-warning'}`}>
                        {ord.delivery_type === 'COD' ? <Truck size={12} /> : <Store size={12} />}
                        {ord.delivery_type === 'COD' ? 'Cash on Delivery' : 'Pickup Counter'}
                      </span>
                    </td>

                    {/* Items Summary */}
                    <td style={{ padding: '14px 20px', maxWidth: '240px' }}>
                      <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                        {ord.items?.map((item) => (
                          <div key={item.id}>
                            {item.quantity}x {item.product_name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '14px 20px', fontWeight: '900', color: '#059669', fontSize: '16px' }}>
                      ₹{ord.total_amount.toFixed(2)}
                    </td>

                    {/* Order Status Selector */}
                    <td style={{ padding: '14px 20px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '13px',
                          border: '1.5px solid #cbd5e1',
                          outline: 'none',
                          cursor: 'pointer',
                          backgroundColor:
                            ord.status === 'Completed' ? '#dcfce7' :
                            ord.status === 'Processing' ? '#e0f2fe' :
                            ord.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                          color:
                            ord.status === 'Completed' ? '#15803d' :
                            ord.status === 'Processing' ? '#0369a1' :
                            ord.status === 'Cancelled' ? '#b91c1c' : '#b45309'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Receipt Action */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectReceipt(ord)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        <Printer size={15} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
