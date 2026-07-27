import React from 'react';
import { X, Printer, CheckCircle, ShoppingBag, Truck, Store, Calendar, User, Phone, MapPin } from 'lucide-react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      padding: '20px'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print" style={{
          padding: '14px 20px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '700', fontSize: '14px' }}>
            <CheckCircle size={18} /> Order Confirmed & Receipt Generated
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '13px' }}
            >
              <Printer size={15} /> Print / PDF
            </button>
            <button
              onClick={onClose}
              style={{ border: 'none', background: '#cbd5e1', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" style={{ padding: '32px 28px', overflowY: 'auto', flex: 1, fontFamily: 'monospace, sans-serif' }}>
          {/* Receipt Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #e2e8f0', pb: '20px', marginBottom: '20px', paddingBottom: '16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShoppingBag size={24} style={{ color: '#059669' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                FreshBasket Shop
              </h2>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>12 MG Road, Indiranagar, Bengaluru • Phone: +91 98765 43210</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>GSTIN: 29AABCU9603R1ZM</div>
          </div>

          {/* Meta Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', color: '#334155', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
            <div>
              <strong>Order #:</strong> {order.order_number}<br />
              <strong>Date:</strong> {new Date(order.created_at || Date.now()).toLocaleString()}<br />
              <strong>Fulfillment:</strong> {order.delivery_type === 'COD' ? 'Cash on Delivery' : 'In-Store Pickup'}
            </div>
            <div>
              <strong>Customer:</strong> {order.customer_name}<br />
              <strong>Phone:</strong> {order.customer_phone}<br />
              {order.address && (
                <><strong>Address:</strong> {order.address}</>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 0' }}>Item</th>
                <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id || item.product_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 0', fontWeight: '600', color: '#0f172a' }}>
                    {item.product_name}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'center', color: '#475569' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: '#475569' }}>
                    ₹{item.unit_price.toFixed(0)}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                    ₹{item.subtotal.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Calculation Summary */}
          <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
              <span>Items Subtotal:</span>
              <span>₹{order.subtotal?.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
              <span>GST Tax (5%):</span>
              <span>₹{order.tax?.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#059669', paddingTop: '8px', borderTop: '1px solid #cbd5e1' }}>
              <span>TOTAL PAID:</span>
              <span>₹{order.total_amount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '24px' }}>
            Thank you for shopping at FreshBasket!<br />
            Please present this receipt for pickup or return queries.
          </div>
        </div>
      </div>
    </div>
  );
}
