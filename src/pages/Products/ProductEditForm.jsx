import React, { useState, useEffect, useRef } from "react";

// Inline SVG Icons
const IconTag = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.58 20.91a2 2 0 01-1.66 0L4 16.96V7.04L10.92 3.09a2 2 0 011.66 0l7.58 3.95v9.92l-6.92 3.95z"/><circle cx="12" cy="12" r="2"/></svg>);
const IconCode = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l4-4-4-4M8 6l-4 4 4 4M14.5 4L9.5 20"/></svg>);
const IconDollar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>);
const IconPackage = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8.47 5.4a2 2 0 011.08 1.76v9.58a2 2 0 01-1.08 1.76l-8.47 5.4a2 2 0 01-2.26 0l-8.47-5.4a2 2 0 01-1.08-1.76V8.61a2 2 0 011.08-1.76l8.47-5.4a2 2 0 012.26 0z"/><path d="M12 22.5L2 16.5M12 22.5L22 16.5M12 22.5L12 1.5M2 8.5L22 8.5"/></svg>);
const IconUpload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 8l5-5 5 5M12 3v12"/></svg>);
const IconCamera = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M18 10h1a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2h1"/><path d="M6 10l.4-2.4A2 2 0 018.4 6h7.2a2 2 0 012 2l.4 2"/></svg>);


export default function ProductEditForm({ initialData, onSubmit, onCancel }) {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize state structure
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Grains",
    unit: "Kg",
    costPrice: "",
    salePrice: "",
    stockQuantity: "",
    minStock: "",
    description: "",
    imageData: "", // Stores Base64 string or original image URL
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        sku: initialData.sku || "",
        category: initialData.category || "Grains",
        unit: initialData.unit || "Kg",
        costPrice: initialData.costPrice || 0,
        salePrice: initialData.salePrice || 0,
        stockQuantity: initialData.stockQuantity || 0,
        minStock: initialData.minStock || 100,
        description: initialData.description || "",
        imageData: initialData.imageUrl || "", // Use imageUrl as initial imageData
      });
    }
  }, [initialData]);

  // Image Upload Handler: Reads file and converts to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({ ...prev, imageData: reader.result }));
        };
        reader.readAsDataURL(file); // Converts file to Base64 string
    } else {
        console.error("Please select a valid image file.");
        setForm((prev) => ({ ...prev, imageData: initialData.imageUrl || "" })); // Revert to original if selection fails
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format numbers and send imageData back as imageUrl
    const submissionData = {
      ...form,
      costPrice: Number(form.costPrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      stockQuantity: Number(form.stockQuantity) || 0,
      minStock: Number(form.minStock) || 0,
      imageUrl: form.imageData, // Send the Base64 data/URL back to the API
      id: initialData?.id
    };

    console.log("Product Update Data:", submissionData);

    if (onSubmit) {
      await onSubmit(submissionData);
    }
    
    setIsSubmitting(false);
  };

  // Premium Styles Object
  const focusStyle = { 
    borderColor: '#10b981', 
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
  };
  const inputBaseStyle = { 
    width: "100%", padding: "12px", fontSize: "14px", borderRadius: "10px", 
    border: "1px solid #d1d5db", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", background: "#fff"
  };
  const iconInputStyle = { paddingLeft: "40px" };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px", padding: '10px' }}>
      
      {/* === SECTION 1: IDENTITY & CLASSIFICATION (COMPACT LAYOUT) === */}
      <div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827", borderBottom: "2px solid #10b981", paddingBottom: "8px", marginBottom: "20px" }}>
          Product Details
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: "20px" }}>
          
          {/* Column 1: Core Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <label>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Product Name *</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <IconTag style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="e.g., Basmati Rice"
                  style={{ ...inputBaseStyle, ...iconInputStyle }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
                />
              </div>
            </label>
            
            <label>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>SKU / Product Code *</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                <IconCode style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
                <input
                  required
                  type="text"
                  value={form.sku}
                  onChange={handleChange("sku")}
                  placeholder="BR-P-50KG"
                  style={{ ...inputBaseStyle, ...iconInputStyle }}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
                />
              </div>
            </label>

            <label>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Category</span>
              <select value={form.category} onChange={handleChange("category")} style={{ ...inputBaseStyle, marginTop: '4px' }}>
                <option value="Grains">Grains / Pulses</option>
                <option value="Oil">Oilseeds</option>
                <option value="Packaging">Packaging Material</option>
                <option value="Other">Other Goods</option>
              </select>
            </label>
            
            <label>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Unit of Measure</span>
              <select value={form.unit} onChange={handleChange("unit")} style={{ ...inputBaseStyle, marginTop: '4px' }}>
                <option value="Kg">Kilogram (Kg)</option>
                <option value="Quintal">Quintal</option>
                <option value="Ton">Tonne (Ton)</option>
                <option value="Bag">Bag (Pcs)</option>
              </select>
            </label>

          </div>

          {/* Column 2: Image Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: '10px', border: '1px dashed #d1d5db', borderRadius: '10px', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Product Media</span>
            
            {/* Image Preview Area */}
            <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
              {form.imageData ? (
                <img 
                  src={form.imageData} 
                  alt="Product Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af', opacity: 0.7 }}>
                    <IconCamera />
                    <p style={{fontSize: '12px', marginTop: '5px'}}>Upload an image file (Max 1MB)</p>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            {/* Custom Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                ...inputBaseStyle,
                background: '#10b981',
                color: '#fff',
                fontWeight: '600',
                border: 'none',
                padding: '8px 12px',
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              <IconUpload />
              {form.imageData ? "Change Image" : "Upload Image"}
            </button>
            
          </div>
        </div>
      </div>

      {/* === SECTION 2: PRICING & STOCK (4-COLUMN GRID) === */}
      <div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827", borderBottom: "2px solid #10b981", paddingBottom: "8px", marginBottom: "20px" }}>
          Pricing and Inventory
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: 'repeat(4, 1fr)', gap: "20px" }}>
          
          <label>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Cost Price (₹)</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <IconDollar style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
              <input
                type="number"
                value={form.costPrice}
                onChange={handleChange("costPrice")}
                style={{ ...inputBaseStyle, ...iconInputStyle }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
              />
            </div>
          </label>
          
          <label>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Sale Price (₹) *</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <IconDollar style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
              <input
                required
                type="number"
                value={form.salePrice}
                onChange={handleChange("salePrice")}
                style={{ ...inputBaseStyle, ...iconInputStyle }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
              />
            </div>
          </label>
          
          <label>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Current Stock</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <IconPackage style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
              <input
                type="number"
                value={form.stockQuantity}
                onChange={handleChange("stockQuantity")}
                style={{ ...inputBaseStyle, ...iconInputStyle }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
              />
            </div>
          </label>
          
          <label>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Min Stock Alert</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
              <IconPackage style={{ position: 'absolute', left: '12px', color: '#9ca3af', opacity: 0.7 }} />
              <input
                type="number"
                value={form.minStock}
                onChange={handleChange("minStock")}
                style={{ ...inputBaseStyle, ...iconInputStyle }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBaseStyle, iconInputStyle)}
              />
            </div>
          </label>
          
        </div>
      </div>


      {/* === SECTION 3: DESCRIPTION === */}
      <div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827", borderBottom: "2px solid #10b981", paddingBottom: "8px", marginBottom: "20px" }}>
          Notes and Description
        </div>
        <label>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Description</span>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            style={{ ...inputBaseStyle, minHeight: '100px', marginTop: '4px' }}
            onFocus={(e) => Object.assign(e.target.style, {...inputBaseStyle, minHeight: '100px', marginTop: '4px', ...focusStyle})}
            onBlur={(e) => Object.assign(e.target.style, {...inputBaseStyle, minHeight: '100px', marginTop: '4px'})}
          />
        </label>
      </div>


      {/* === BUTTONS === */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
        <button 
          type="button" 
          onClick={onCancel} 
          style={{ 
            padding: "10px 24px", borderRadius: "10px", border: "1px solid #d1d5db", 
            background: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          style={{ 
            padding: "10px 24px", borderRadius: "10px", border: "none", 
            background: "#111827", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
            opacity: isSubmitting ? 0.7 : 1, transition: "all 0.2s"
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
