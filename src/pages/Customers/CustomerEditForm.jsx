import React, { useState, useEffect } from "react";

export default function CustomerEditForm({ initialData, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. State includes all the new fields
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "", 
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Regular",
    openingBalance: "",
    creditLimit: "",
  });

  // 2. Populate form when initialData arrives
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        gstin: initialData.gstin || "", // Load GSTIN
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        type: initialData.type || "Regular",
        openingBalance: initialData.openingBalance || 0,
        creditLimit: initialData.creditLimit || 0,
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      ...form,
      openingBalance: Number(form.openingBalance) || 0,
      creditLimit: Number(form.creditLimit) || 0,
      // Preserve the original ID if it exists in initialData
      id: initialData?.id 
    };

    console.log("Update Clicked - Data being sent:", submissionData); // CHECK CONSOLE (F12)

    if (onSubmit) {
       await onSubmit(submissionData);
    }

    setIsSubmitting(false);
  };

  // Consistent Premium Styles
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
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>GSTIN</span>
          <input
            type="text"
            value={form.gstin}
            onChange={handleChange("gstin")}
            style={{ ...styles.input, textTransform: "uppercase" }}
          />
        </label>
      </div>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Phone *</span>
          <input
            required
            type="text"
            value={form.phone}
            onChange={handleChange("phone")}
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            style={styles.input}
          />
        </label>
      </div>

      {/* === SECTION 2: FINANCIALS === */}
      <div style={styles.sectionTitle}>Financial Settings</div>

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
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Current Balance (₹)</span>
          <input
            type="number"
            value={form.openingBalance}
            onChange={handleChange("openingBalance")}
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
          rows={2}
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
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>State</span>
          <input
            type="text"
            value={form.state}
            onChange={handleChange("state")}
            style={styles.input}
          />
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Pincode</span>
          <input
            type="text"
            value={form.pincode}
            onChange={handleChange("pincode")}
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
          {isSubmitting ? "Updating..." : "Update Customer"}
        </button>
      </div>
    </form>
  );
}
