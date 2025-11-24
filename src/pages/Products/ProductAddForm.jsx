import React, { useState } from "react";

// Inline SVG Icons for premium look
const IconTag = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.58 20.91a2 2 0 01-1.66 0L4 16.96V7.04L10.92 3.09a2 2 0 011.66 0l7.58 3.95v9.92l-6.92 3.95z"/><circle cx="12" cy="12" r="2"/></svg>);
const IconCode = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l4-4-4-4M8 6l-4 4 4 4M14.5 4L9.5 20"/></svg>);
const IconDollar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>);
const IconPackage = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8.47 5.4a2 2 0 011.08 1.76v9.58a2 2 0 01-1.08 1.76l-8.47 5.4a2 2 0 01-2.26 0l-8.47-5.4a2 2 0 01-1.08-1.76V8.61a2 2 0 011.08-1.76l8.47-5.4a2 2 0 012.26 0z"/><path d="M12 22.5L2 16.5M12 22.5L22 16.5M12 22.5L12 1.5M2 8.5L22 8.5"/></svg>);

export default function ProductAddForm({ onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detailed Product State including imageUrl
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Grains", // Default Category
    unit: "Kg", // Default Unit
    costPrice: "",
    salePrice: "",
    stockQuantity: "",
    minStock: "100", // Default minimum alert quantity
    description: "",
    imageUrl: "", 
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format numbers before submission
    const submissionData = {
      ...form,
      costPrice: Number(form.costPrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      stockQuantity: Number(form.stockQuantity) || 0,
      minStock: Number(form.minStock) || 0,
      createdAt: new Date().toISOString(),
    };

    console.log("Product Submitted with Data:", submissionData);

    if (onSubmit) {
      await onSubmit(submissionData);
    }
    
    setIsSubmitting(false);
  };

  // Premium Styles Object for clean layout and aesthetics
  const styles = {
    form: { display: "flex", flexDirection: "column", gap: "20px", padding: '10px' },
    sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#111827", borderBottom: "2px solid #10b981", paddingBottom: "8px", marginTop: "4px" },
    row: { display: "flex", gap: "20px" },
    col: { flex: 1, display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 },
    input: { 
      width: "100%", padding: "12px 12px 12px 40px", fontSize: "14px", borderRadius: "10px", 
      border: "1px solid #d1d5db", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", background: "#fff"
    },
    inputNoIcon: { 
        width: "100%", padding: "12px", fontSize: "14px", borderRadius: "10px", 
        border: "1px solid #d1d5db", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", background: "#fff"
    },
    inputFocus: { 
      borderColor: '#10b981', 
      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
    },
    textarea: { 
      width: "100%", padding: "12px", fontSize: "14px", borderRadius: "10px", 
      border: "1px solid #d1d5db", outline: "none", minHeight: "80px", resize: "vertical", transition: "border-color 0.3s"
    },
    buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" },
    cancelBtn: { 
      padding: "10px 24px", borderRadius: "10px", border: "1px solid #d1d5db", 
      background: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
    },
    saveBtn: { 
      padding: "10px 24px", borderRadius: "10px", border: "none", 
      background: "#111827", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
      opacity: isSubmitting ? 0.7 : 1, transition: "all 0.2s"
    }
  };

  const focusStyle = styles.inputFocus; // Shared focus style

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      
      {/* === SECTION 1: IDENTITY & CLASSIFICATION === */}
      <div style={styles.sectionTitle}>Product Identification</div>
      
      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Product Name *</span>
          <div style={styles.inputWrapper}>
            <IconTag style={styles.icon} />
            <input
              required
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g., Basmati Rice - Premium"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
        <label style={styles.col}>
          <span style={styles.label}>SKU / Product Code *</span>
          <div style={styles.inputWrapper}>
            <IconCode style={styles.icon} />
            <input
              required
              type="text"
              value={form.sku}
              onChange={handleChange("sku")}
              placeholder="BR-P-50KG"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
      </div>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Category</span>
          <select value={form.category} onChange={handleChange("category")} style={styles.inputNoIcon}>
            <option value="Grains">Grains / Pulses</option>
            <option value="Oil">Oilseeds</option>
            <option value="Packaging">Packaging Material</option>
            <option value="Other">Other Goods</option>
          </select>
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Unit of Measure</span>
          <select value={form.unit} onChange={handleChange("unit")} style={styles.inputNoIcon}>
            <option value="Kg">Kilogram (Kg)</option>
            <option value="Quintal">Quintal</option>
            <option value="Ton">Tonne (Ton)</option>
            <option value="Bag">Bag (Pcs)</option>
          </select>
        </label>
      </div>

      {/* === IMAGE URL FIELD === */}
      <label style={styles.col}>
        <span style={styles.label}>Product Image URL (Optional)</span>
        <input
          type="url"
          value={form.imageUrl}
          onChange={handleChange("imageUrl")}
          placeholder="https://placehold.co/600x400/059669/FFFFFF?text=Product+Image"
          style={styles.inputNoIcon}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => Object.assign(e.target.style, styles.inputNoIcon)}
        />
      </label>

      {/* === SECTION 2: PRICING & STOCK === */}
      <div style={styles.sectionTitle}>Pricing and Inventory</div>

      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Cost Price (₹)</span>
          <div style={styles.inputWrapper}>
            <IconDollar style={styles.icon} />
            <input
              type="number"
              value={form.costPrice}
              onChange={handleChange("costPrice")}
              placeholder="0.00 (Cost to buy)"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Sale Price (₹) *</span>
          <div style={styles.inputWrapper}>
            <IconDollar style={styles.icon} />
            <input
              required
              type="number"
              value={form.salePrice}
              onChange={handleChange("salePrice")}
              placeholder="0.00 (Standard selling price)"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
      </div>
      
      <div style={styles.row}>
        <label style={styles.col}>
          <span style={styles.label}>Current Stock</span>
          <div style={styles.inputWrapper}>
            <IconPackage style={styles.icon} />
            <input
              type="number"
              value={form.stockQuantity}
              onChange={handleChange("stockQuantity")}
              placeholder="0"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
        <label style={styles.col}>
          <span style={styles.label}>Low Stock Alert (Min Qty)</span>
          <div style={styles.inputWrapper}>
            <IconPackage style={styles.icon} />
            <input
              type="number"
              value={form.minStock}
              onChange={handleChange("minStock")}
              placeholder="100"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>
        </label>
      </div>

      {/* === SECTION 3: DESCRIPTION === */}
      <div style={styles.sectionTitle}>Notes and Description</div>
      <label style={styles.col}>
        <span style={styles.label}>Description</span>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Detailed notes on quality, origin, or usage."
          style={styles.textarea}
          onFocus={(e) => Object.assign(e.target.style, {...styles.textarea, ...focusStyle})}
          onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
        />
      </label>

      {/* === BUTTONS === */}
      <div style={styles.buttonGroup}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" style={styles.saveBtn} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

    </form>
  );
}
