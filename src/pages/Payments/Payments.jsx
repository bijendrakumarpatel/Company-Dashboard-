import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
import {
  getPayments,
  createPayment,
  deletePayment
} from "../../api/paymentApi";

import PaymentAddForm from "./PaymentAddForm";
import "./Payments.css";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const res = await getPayments();
      setPayments(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Load Error:", err);
      setPayments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // --- EXPORT TO EXCEL FUNCTION ---
  const exportToExcel = () => {
    if (!payments.length) return alert("No data to export!");
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Customer ID,Type,Amount,Method,Date,Remarks\n";

    payments.forEach(row => {
        const rowData = [
            row.id,
            row.customerId,
            row.type || "received",
            row.amount,
            row.method,
            row.date,
            `"${(row.remarks || '').replace(/"/g, '""')}"` 
        ].join(",");
        csvContent += rowData + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- TABLE COLUMNS ---
  const columns = [
    { header: "ID", accessor: "id", render: (row) => <span style={{fontWeight:600}}>#{row.id}</span> },
    { header: "Customer", accessor: "customerId" },
    { 
      header: "Type", 
      accessor: "type",
      render: (row) => {
          const isReceived = (row.type || 'received') === 'received';
          return (
            <span className={`badge-payment ${isReceived ? 'badge-in' : 'badge-out'}`}>
                {isReceived ? '↓ Received' : '↑ Sent'}
            </span>
          );
      }
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => <span style={{fontWeight: 'bold', fontFamily: 'monospace'}}>₹{Number(row.amount).toLocaleString('en-IN')}</span>
    },
    { 
      header: "Method", 
      accessor: "method",
      render: (row) => (
          <div className="method-icon">
             <span>{row.method === 'Online' ? '🌐' : row.method === 'Cash' ? '💵' : '🏦'}</span>
             <span>{row.method}</span>
          </div>
      )
    },
    { header: "Date", accessor: "date" },
    {
      header: "Action",
      render: (row) => (
        <button 
            className="btn-delete-icon"
            onClick={() => remove(row.id)} 
            title="Delete Record"
        >
          ✕
        </button>
      ),
    },
  ];

  const add = async (data) => {
    try {
        console.log("Saving data:", data); // Debugging ke liye
        await createPayment(data);
        setShowAdd(false);
        load(); // Refresh list
    } catch (error) {
        console.error("Save Failed:", error);
        alert("Failed to save payment. Check console for details.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
        await deletePayment(id);
        load();
    } catch (error) {
        console.error("Delete Failed:", error);
        alert("Failed to delete.");
    }
  };

  return (
    <AdminLayout title="Payments">
      <div className="payments-page">
        
        {/* PREMIUM HEADER */}
        <div className="payments-page__header">
            <div className="payments-title">
                <h1>Transactions & Payments</h1>
                <div className="payments-subtitle">Manage all cash flows, online transfers and cheques</div>
            </div>
            <div className="payments-actions">
                <button className="btn-outline" onClick={exportToExcel}>
                    📊 Export Excel
                </button>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>
                    + New Payment
                </button>
            </div>
        </div>

        {/* CONTENT TABLE */}
        <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            padding: '20px'
        }}>
            {loading ? <Loader /> : <DataTable columns={columns} data={payments} />}
        </div>

        {/* ADD MODAL */}
        <Modal 
            open={showAdd} 
            title="Record New Transaction" 
            onClose={() => setShowAdd(false)}
            width="650px"
        >
          <PaymentAddForm onSubmit={add} onCancel={() => setShowAdd(false)} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
