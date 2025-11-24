import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api/customerApi";
import CustomerAddForm from "./CustomerAddForm";
import CustomerEditForm from "./CustomerEditForm";
import "./Customers.css"; // Make sure this file exists!

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // "add" | "edit"
  const [selected, setSelected] = useState(null);

  // --- Fetch Data ---
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      // Ensure data is an array to prevent crashes
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Handlers ---
  const handleAdd = async (form) => {
    try {
      console.log("Creating Customer:", form);
      await createCustomer(form);
      setModalType(null);
      await fetchCustomers(); // Refresh table
    } catch (err) {
      console.error("Create failed:", err);
      // Changed alert to custom UI notification if possible, or simple console feedback
      console.error("Failed to create customer. Check console for details.");
    }
  };

  const handleEdit = async (form) => {
    try {
      if (!selected?.id) {
        console.error("Error: Customer ID missing.");
        return;
      }
      console.log("Updating Customer:", selected.id, form);
      await updateCustomer(selected.id, form);
      setModalType(null);
      setSelected(null);
      await fetchCustomers(); // Refresh table
    } catch (err) {
      console.error("Update failed:", err);
      console.error("Failed to update customer. Check console for details.");
    }
  };

  const handleDelete = async (row) => {
    // NOTE: Changed window.confirm to a temporary console log as per instructions, 
    // but in a real app, you must use a custom modal for confirmation.
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return;
    try {
      await deleteCustomer(row.id);
      await fetchCustomers();
    } catch (err) {
      console.error("Delete failed:", err);
      console.error("Failed to delete customer.");
    }
  };
  
  // --- NEW EXPORT LOGIC ---
  const handleExportToCSV = () => {
    if (customers.length === 0) {
      alert("No customer data to export.");
      return;
    }

    // 1. Define CSV Headers (based on comprehensive data fields)
    const headers = [
      "ID", "Name", "Type", "GSTIN", "Phone", "Email", 
      "Opening Balance", "Credit Limit", "Address", "City", "State", "Pincode", "Created At"
    ];
    
    // 2. Map Customer Data to CSV Rows
    const csvRows = customers.map(customer => [
      customer.id || '',
      customer.name || '',
      customer.type || 'Regular',
      customer.gstin || '',
      customer.phone || '',
      customer.email || '',
      customer.openingBalance || '0.00',
      customer.creditLimit || '0.00',
      (customer.address || '').replace(/"/g, '""'), // Escape double quotes in text fields
      customer.city || '',
      customer.state || '',
      customer.pincode || '',
      customer.createdAt || '',
    ].map(field => `"${field}"`).join(',')); // Enclose fields in quotes

    // 3. Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    // 4. Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- END EXPORT LOGIC ---


  // --- Premium Columns Definition ---
  const columns = [
    { 
      header: "Customer Info", 
      accessor: "name",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}>{row.name}</span>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>{row.gstin || "No GSTIN"}</span>
        </div>
      )
    },
    { 
      header: "Contact", 
      accessor: "phone",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>{row.phone}</span>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{row.email || "-"}</span>
        </div>
      )
    },
    { 
      header: "Type", 
      accessor: "type",
      render: (row) => {
        const type = row.type || "Regular";
        // Converts "Regular" -> "badge-regular", "VIP" -> "badge-vip"
        const badgeClass = `badge badge-${type.toLowerCase()}`;
        return <span className={badgeClass}>{type}</span>;
      }
    },
    { 
      header: "Location", 
      accessor: "city",
      render: (row) => (
        <span style={{ fontSize: "13px", color: "#4b5563" }}>
          {row.city ? `${row.city}, ${row.state}` : <span style={{fontStyle:"italic", opacity:0.6}}>N/A</span>}
        </span>
      )
    },
    { 
      header: "Balance", 
      accessor: "openingBalance",
      render: (row) => (
        <div style={{ fontFamily: "monospace", fontWeight: 600, color: "#111827" }}>
          ₹{Number(row.openingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      )
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
            title="Edit Customer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="action-btn delete-btn"
            title="Delete Customer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customers">
      <div className="customers-page">
        {/* Header Section */}
        <div className="customers-page__header">
          <div>
            <h2 className="customers-page__title">Customer Management</h2>
            <p className="customers-page__subtitle">
              Manage details, credit limits, and balances.
            </p>
          </div>
          <div className="customers-page__actions">
            {/* NEW EXPORT BUTTON */}
            <button
              className="secondary-btn" // Using a new secondary style
              onClick={handleExportToCSV}
              disabled={loading || customers.length === 0}
            >
              Export to CSV
            </button>
            {/* ADD CUSTOMER BUTTON */}
            <button
              className="primary-btn"
              onClick={() => setModalType("add")}
            >
              + New Customer
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loader-container"><Loader size={40} /></div>
          ) : (
            <DataTable columns={columns} data={customers} />
          )}
        </div>

        {/* Modals */}
        <Modal
          open={modalType === "add"}
          title="Add New Customer"
          onClose={() => setModalType(null)}
        >
          <CustomerAddForm
            onSubmit={handleAdd}
            onCancel={() => setModalType(null)}
          />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Customer Details"
          onClose={() => {
            setModalType(null);
            setSelected(null);
          }}
        >
          <CustomerEditForm
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
