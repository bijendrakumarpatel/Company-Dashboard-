import React from "react";
import "./Orders.css"; // Uses styles defined in Orders.css

export default function OrderDetails({ order }) {
  if (!order) return <div>Loading details...</div>;

  // Status badge logic inside modal
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return '#166534';
    if (s === 'pending') return '#854d0e';
    return '#0f172a';
  };

  return (
    <div className="order-details-container">
      {/* 1. Header Section */}
      <div className="od-header">
        <div className="od-id-group">
          <span className="od-label">Order ID</span>
          <span className="od-value-lg">#{order.id}</span>
        </div>
        <div className="od-id-group" style={{alignItems: 'flex-end'}}>
            <span className="od-label">Date Placed</span>
            <span style={{fontWeight: 600}}>
                {new Date(order.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      {/* 2. Info Grid */}
      <div className="od-grid">
        {/* Customer Info */}
        <div className="od-box">
          <div className="od-label" style={{marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px'}}>Customer Details</div>
          <div style={{fontWeight: 700, fontSize: '15px', marginBottom: '4px'}}>{order.customerName}</div>
          <div style={{fontSize: '13px', color: '#64748b'}}>ID: CST-{Math.floor(Math.random()*1000)}</div>
          <div style={{fontSize: '13px', color: '#64748b'}}>+91 98765 XXXXX</div>
        </div>

        {/* Payment Info */}
        <div className="od-box">
           <div className="od-label" style={{marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px'}}>Payment Info</div>
           <div className="od-row">
               <span>Method:</span>
               <span>Online / UPI</span>
           </div>
           <div className="od-row">
               <span>Status:</span>
               <span style={{color: getStatusColor(order.status), textTransform: 'uppercase', fontWeight: 800}}>
                   {order.status}
               </span>
           </div>
        </div>
      </div>

      {/* 3. Order Items (Mock Data if not present) */}
      <div style={{marginBottom: '24px'}}>
          <div className="od-label" style={{marginBottom: '10px'}}>Order Items</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
              <thead style={{background: '#f1f5f9', textAlign: 'left'}}>
                  <tr>
                      <th style={{padding: '8px', borderRadius: '6px 0 0 6px'}}>Item</th>
                      <th style={{padding: '8px', textAlign: 'center'}}>Qty</th>
                      <th style={{padding: '8px', textAlign: 'right', borderRadius: '0 6px 6px 0'}}>Price</th>
                  </tr>
              </thead>
              <tbody>
                  {/* Example row - replace with real items map if available */}
                  <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                      <td style={{padding: '12px 8px'}}>Primary Product / Service</td>
                      <td style={{padding: '12px 8px', textAlign: 'center'}}>1</td>
                      <td style={{padding: '12px 8px', textAlign: 'right'}}>₹{Number(order.amount).toLocaleString('en-IN')}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      {/* 4. Total Amount Footer */}
      <div className="od-total-section">
          <span className="od-total-label">Total Amount</span>
          <span className="od-total-amount">₹{Number(order.amount).toLocaleString('en-IN')}</span>
      </div>

      <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button style={{
              background: 'transparent', 
              border: '1px solid #cbd5e1', 
              padding: '8px 16px', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#64748b'
          }}>
              Download Invoice PDF
          </button>
      </div>
    </div>
  );
}
