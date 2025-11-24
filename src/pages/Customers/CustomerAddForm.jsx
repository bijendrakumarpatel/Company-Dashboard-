import React, { useState } from "react";

export default function CustomerAddForm({ onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced Form State with more business-relevant fields
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    email: "",
    gstin: "", // Tax ID
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Regular",
    openingBalance: "", 
    creditLimit: "", // Maximum credit allowed
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Formatting data before sending
    const submissionData = {
      ...form,
      openingBalance: Number(form.openingBalance) || 0,
      creditLimit: Number(form.creditLimit) || 0,
      createdAt: new Date().toISOString(),
    };

    console.log("Form Submitted with Data:", submissionData); // Check Console (F12) to see this

    // Simulate a small delay or wait for the parent onSubmit
    if (onSubmit) {
        await onSubmit(submissionData);
    }
    
    setIsSubmitting(false);
  };

  // Styles Object for cleaner code
  const styles = {
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    sectionTitle: { fontSize: "14px", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e5e7eb", paddingBottom: "4px", marginTop: "8px" },
    row: { display: "flex", gap: "12px" },
    col: { flex: 1, display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "12px", fontWeight: "500", color: "#4b5563" },
    input: { 
      width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "6px", 
      border: "1px solid #d1d5db", outline: "none", transition: "border-color 0.2s"
    },
    textarea: { 
      width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "6px", 
      border: "1px solid #d1d5db", outline: "none", minHeight: "60px", resize: "vertical"
    },
    buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" },
    cancelBtn: { 
      padding: "8px 16px", borderRadius: "6px", border: "1px solid #d1d5db", 
      background: "#fff", fontSize: "13px", fontWeight: "500", cursor: "pointer" 
    },
    saveBtn: { 
      padding: "8px 20px", borderRadius: "6px", border: "none", 
      background: "#111827", color: "#fff", fontSize: "13px", fontWeight: "500", cursor: "pointer",
      opacity: isSubmitting ? 0.7 : 1
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      
      {/* === SECTION 1: BASIC IDENTITY === */}
      <div style={styles.sectionTitle}>Basic Information</div>
      
      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Customer Name *</span>
          <input
            required
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Business or Person Name"
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>GSTIN (Optional)</span>
          <input
            type="text"
            value={form.gstin}
            onChange={handleChange("gstin")}
            placeholder="22AAAAA0000A1Z5"
            style={{ ...styles.input, textTransform: "uppercase" }}
          />
        </label>
      </div>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Primary Phone *</span>
          <input
            required
            type="text"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="9876543210"
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="client@example.com"
            style={styles.input}
          />
        </label>
      </div>

      {/* === SECTION 2: FINANCIALS === */}
      <div style={styles.sectionTitle}>Financial Details</div>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Customer Type</span>
          <select value={form.type} onChange={handleChange("type")} style={{...styles.input, background: "#f9fafb"}}>
            <option value="Regular">Regular</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Retailer">Retailer</option>
            <option value="VIP">VIP</option>
          </select>
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Credit Limit (₹)</span>
          <input
            type="number"
            value={form.creditLimit}
            onChange={handleChange("creditLimit")}
            placeholder="50000"
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Opening Balance (₹)</span>
          <input
            type="number"
            value={form.openingBalance}
            onChange={handleChange("openingBalance")}
            placeholder="0.00"
            style={styles.input}
          />
        </label>
      </div>

      {/* === SECTION 3: ADDRESS === */}
      <div style={styles.sectionTitle}>Billing Address</div>

      <label style={styles.col}>
        <span style={styles.label}>Street Address</span>
        <textarea
          value={form.address}
          onChange={handleChange("address")}
          placeholder="Shop No, Street, Landmark..."
          style={styles.textarea}
        />
      </label>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>City</span>
          <input
            type="text"
            value={form.city}
            onChange={handleChange("city")}
            placeholder="City"
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>State</span>
          <input
            type="text"
            value={form.state}
            onChange={handleChange("state")}
            placeholder="State"
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Pincode</span>
          <input
            type="text"
            value={form.pincode}
            onChange={handleChange("pincode")}
            placeholder="000000"
            style={styles.input}
          />
        </label>
      </div>

      {/* === BUTTONS === */}
      <div style={styles.buttonGroup}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" style={styles.saveBtn} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Customer"}
        </button>
      </div>

    </form>
  );
}
