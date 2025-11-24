import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import ProductAddForm from "./ProductAddForm";
import ProductEditForm from "./ProductEditForm";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // "add" | "edit"
  const [selected, setSelected] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (form) => {
    try {
      await createProduct(form);
      setModalType(null);
      await fetchProducts();
    } catch (err) {
      console.error("Create product failed:", err);
      console.error("Failed to create product. API error.");
    }
  };

  const handleEdit = async (form) => {
    try {
      if (!selected?.id) {
        console.error("Error: Product ID missing for update.");
        return;
      }
      await updateProduct(selected.id, form);
      setModalType(null);
      setSelected(null);
      await fetchProducts();
    } catch (err) {
      console.error("Update product failed:", err);
      console.error("Failed to update product. API error.");
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete product "${row.name}"?`)) return;
    try {
      await deleteProduct(row.id);
      await fetchProducts();
    } catch (err) {
      console.error("Delete product failed:", err);
      console.error("Failed to delete product. API error.");
    }
  };

  // --- EXPORT LOGIC (CSV) ---
  const handleExportToCSV = () => {
    if (products.length === 0) {
      console.log("No product data to export.");
      return;
    }

    const headers = [
      "ID", "Name", "SKU", "Category", "Unit", "Stock Qty", 
      "Min Stock Alert", "Sale Price", "Cost Price", "Image URL", "Description"
    ];
    
    const csvRows = products.map(product => [
      product.id || '',
      product.name || '',
      product.sku || '',
      product.category || 'N/A',
      product.unit || 'Pcs',
      product.stockQuantity || 0,
      product.minStock || 0,
      product.salePrice || '0.00',
      product.costPrice || '0.00',
      product.imageUrl || '',
      (product.description || '').replace(/"/g, '""'), 
    ].map(field => `"${field}"`).join(',')); 

    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products_inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- END EXPORT LOGIC ---


  // --- Premium Columns Definition ---
  const columns = [
    { 
      header: "Product Detail", 
      accessor: "name",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {row.imageUrl ? (
            <img 
              src={row.imageUrl} 
              alt={row.name} 
              className="product-thumbnail"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/40x40/f3f4f6/6b7280?text=P";
              }}
            />
          ) : (
            <div className="product-thumbnail product-thumbnail-placeholder">P</div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}>{row.name}</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>SKU: {row.sku || 'N/A'}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (row) => {
        const category = row.category || "Other";
        const badgeClass = `badge badge-${category.toLowerCase().replace(/ /g, '-')}`;
        return <span className={badgeClass}>{category}</span>;
      }
    },
    { 
      header: "Price (Sale/Cost)", 
      accessor: "salePrice",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "monospace" }}>
          <span style={{ fontWeight: 600, color: "#047857" }}>
            Sale: ₹{Number(row.salePrice || 0).toFixed(2)}
          </span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
            Cost: ₹{Number(row.costPrice || 0).toFixed(2)}
          </span>
        </div>
      )
    },
    { 
      header: "Inventory", 
      accessor: "stockQuantity",
      render: (row) => {
        const stock = Number(row.stockQuantity || 0);
        const min = Number(row.minStock || 1);
        const stockStatusClass = stock <= min ? 'stock-low' : 'stock-ok';

        return (
          <div className={stockStatusClass} style={{ fontWeight: 600, fontSize: "13px" }}>
            {stock} {row.unit || 'Pcs'}
            {stock <= min && <span className="stock-alert-text"> (Low Stock)</span>}
          </div>
        );
      }
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="action-buttons">
          <button
            onClick={() => {
              setSelected(row);
              setModalType("edit");
            }}
            className="action-btn edit-btn"
            title="Edit Product"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="action-btn delete-btn"
            title="Delete Product"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products">
      <div className="customers-page">
        {/* Header Section */}
        <div className="customers-page__header">
          <div>
            <h2 className="products-page__title">Product Inventory</h2>
            <p className="products-page__subtitle">
              Manage stock, pricing, and product details.
            </p>
          </div>
          <div className="customers-page__actions">
            {/* EXPORT BUTTON */}
            <button
              className="secondary-btn" 
              onClick={handleExportToCSV}
              disabled={loading || products.length === 0}
            >
              Export to CSV
            </button>
            {/* ADD PRODUCT BUTTON */}
            <button
              className="primary-btn"
              onClick={() => setModalType("add")}
            >
              + New Product
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loader-container"><Loader size={40} /></div>
          ) : (
            <DataTable columns={columns} data={products} />
          )}
        </div>

        {/* Modals */}
        <Modal
          open={modalType === "add"}
          title="Add New Product"
          onClose={() => setModalType(null)}
        >
          <ProductAddForm
            onSubmit={handleAdd}
            onCancel={() => setModalType(null)}
          />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Product Details"
          onClose={() => {
            setModalType(null);
            setSelected(null);
          }}
        >
          <ProductEditForm
            initialData={selected}
            onSubmit={handleEdit}
            onCancel={() => {
              setModalType(null);
              setSelected(null);
            }}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
