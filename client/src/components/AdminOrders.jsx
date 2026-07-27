import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus, updateOrderPaymentStatus } from '../utils/api';
import { ClipboardList, Search, Printer, Truck, Store, Phone, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';

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

  const handleConfirmPayment = async (orderId) => {
    try {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, payment_status: 'Paid', status: 'Processing' } : o)));
      await updateOrderPaymentStatus(orderId, 'Paid');
      await updateOrderStatus(orderId, 'Processing');
    } catch (err) {
      alert('Failed to confirm payment: ' + err.message);
      loadOrders();
    }
  };

  const handleRejectPayment = async (orderId) => {
    if (!confirm('Reject this fake UTR / order and restore inventory stock?')) return;
    try {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, payment_status: 'Rejected', status: 'Cancelled' } : o)));
      await updateOrderPaymentStatus(orderId, 'Rejected (Fake UTR)');
      await updateOrderStatus(orderId, 'Cancelled');
    } catch (err) {
      alert('Failed to reject order: ' + err.message);
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
                  <th style={{ padding: '14px 20px' }}>Bank Payment Verification</th>
                  <th style={{ padding: '14px 20px' }}>Items</th>
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
                        {ord.delivery_type}
                      </span>
                    </td>

                    {/* Bank Payment Verification */}
                    <td style={{ padding: '14px 20px', minWidth: '220px' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '800',
                          backgroundColor: ord.payment_status === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: ord.payment_status === 'Paid' ? '#15803d' : '#b45309'
                        }}>
                          {ord.payment_status === 'Paid' ? '✓ PAID & VERIFIED' : `⏳ ${ord.payment_status || 'Pending'}`}
                        </span>
                      </div>
                      {ord.transaction_ref && (
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', fontFamily: 'monospace', backgroundColor: '#f0f9ff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bae6fd', display: 'inline-block', marginBottom: '6px' }}>
                          {ord.transaction_ref}
                        </div>
                      )}
                      {ord.payment_status !== 'Paid' && ord.status !== 'Cancelled' && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <button
                            onClick={() => handleConfirmPayment(ord.id)}
                            style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '800', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle2 size={12} /> Confirm Money Received
                          </button>
                          <button
                            onClick={() => handleRejectPayment(ord.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            title="Reject fake UTR"
                          >
                            <XCircle size={12} />
                          </button>
                        </div>
                      )}
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
