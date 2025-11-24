import React, { useState } from "react";
import "./Payments.css";

export default function PaymentAddForm({ onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    type: "received", // 'received' (IN) or 'paid' (OUT)
    method: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
    bankName: "",
    referenceNo: "",
    proofImage: null // This stores the FILE object initially
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleTypeSelect = (type) => {
    setForm({ ...form, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, proofImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- HELPER: Convert File to Base64 String ---
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Image ko Text (Base64) mein convert karein taaki DB mein save ho sake
      let imageString = null;
      if (form.proofImage) {
        imageString = await convertToBase64(form.proofImage);
      }

      // 2. Payload taiyaar karein
      const payload = {
          ...form,
          amount: Number(form.amount),
          proofImage: imageString, // Ab ye string hai, File nahi (Safe for DB)
      };

      // 3. Parent ko bhejein
      await onSubmit(payload);
      
    } catch (error) {
      console.error("Form Error:", error);
      alert("Error preparing data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      
      {/* 1. Transaction Type Toggle */}
      <div className="type-selector">
        <div 
          className={`type-option ${form.type === 'received' ? 'selected-in' : ''}`}
          onClick={() => handleTypeSelect('received')}
        >
          ↓ Payment Received (IN)
        </div>
        <div 
          className={`type-option ${form.type === 'paid' ? 'selected-out' : ''}`}
          onClick={() => handleTypeSelect('paid')}
        >
          ↑ Payment Sent (OUT)
        </div>
      </div>

      {/* 2. Basic Info */}
      <div className="form-row">
        <div className="form-col">
            <label className="form-label">Customer / Party ID</label>
            <input className="form-input" type="number" value={form.customerId} onChange={handleChange("customerId")} required placeholder="e.g. 101" />
        </div>
        <div className="form-col">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={handleChange("date")} required />
        </div>
      </div>

      {/* 3. Amount & Method */}
      <div className="form-row">
        <div className="form-col">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" value={form.amount} onChange={handleChange("amount")} required placeholder="0.00" style={{fontWeight: 'bold'}} />
        </div>
        <div className="form-col">
            <label className="form-label">Payment Method</label>
            <select className="form-select" value={form.method} onChange={handleChange("method")} required>
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online / UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
            </select>
        </div>
      </div>

      {/* 4. Conditional Banking Details */}
      {(form.method === "Online" || form.method === "Cheque" || form.method === "Bank Transfer") && (
         <div className="form-row" style={{background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px dashed #cbd5e1'}}>
            <div className="form-col">
                <label className="form-label">Bank / App Name</label>
                <input className="form-input" placeholder="e.g. HDFC or GPay" value={form.bankName} onChange={handleChange("bankName")} />
            </div>
            <div className="form-col">
                <label className="form-label">Ref / Cheque No</label>
                <input className="form-input" placeholder="Transaction ID" value={form.referenceNo} onChange={handleChange("referenceNo")} />
            </div>
         </div>
      )}

      {/* 5. Proof Image & Remarks */}
      <div className="form-row">
        <div className="form-col" style={{flex: 1}}>
            <label className="form-label">Remarks / Notes</label>
            <textarea className="form-textarea" rows={4} value={form.remarks} onChange={handleChange("remarks")} placeholder="Enter details about this payment..." />
        </div>
        
        <div className="form-col" style={{flex: 1}}>
            <label className="form-label">Proof / Person Image</label>
            <div className="image-upload-box" onClick={() => document.getElementById('proofUpload').click()}>
                {preview ? (
                    <img src={preview} alt="Preview" className="preview-img" />
                ) : (
                    <div style={{color: '#94a3b8', fontSize: '12px'}}>
                        <span>📷 Click to Upload</span>
                    </div>
                )}
                <input 
                    id="proofUpload" 
                    type="file" 
                    accept="image/*" 
                    style={{display:'none'}} 
                    onChange={handleImageChange} 
                />
            </div>
        </div>
      </div>

      {/* 6. Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : (form.type === 'received' ? 'Confirm Receipt' : 'Confirm Payment')}
        </button>
      </div>
    </form>
  );
}
