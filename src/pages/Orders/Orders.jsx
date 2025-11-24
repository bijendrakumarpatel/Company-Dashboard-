import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import { getOrders } from "../../api/orderApi";
import OrderDetails from "./OrderDetails";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const load = async () => {
    try {
      const res = await getOrders();
      // Fallback if API returns nothing
      setOrders(Array.isArray(res) ? res : []); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pending";
    if (s === 'paid' || s === 'completed') return <span className="status-badge status-paid">Paid</span>;
    if (s === 'pending') return <span className="status-badge status-pending">Pending</span>;
    if (s === 'cancelled' || s === 'failed') return <span className="status-badge status-failed">Cancelled</span>;
    return <span className="status-badge status-shipped">{status}</span>;
  };

  const columns = [
    { 
      header: "Order ID", 
      accessor: "id",
      render: (row) => <span style={{fontWeight: 600, color: '#4f46e5'}}>#{row.id}</span> 
    },
    { 
      header: "Customer", 
      accessor: "customerName",
      render: (row) => (
        <div style={{display:'flex', flexDirection:'column'}}>
            <span style={{fontWeight: 500}}>{row.customerName}</span>
            <span style={{fontSize: '11px', color: '#64748b'}}>View Profile</span>
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: "date",
      render: (row) => new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => <span className="amount-cell">₹{Number(row.amount).toLocaleString('en-IN')}</span>
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => getStatusBadge(row.status)
    },
    {
      header: "Action",
      key: "action",
      render: (row) => (
        <button className="btn-view" onClick={() => setDetails(row)}>
          View Details
        </button>
      )
    }
  ];

  return (
    <AdminLayout title="Orders">
      <div className="orders-page">
        {/* Header */}
        <div className="orders-page__header">
          <div className="orders-page__title">
            <h1>Orders Management</h1>
            <div className="orders-page__subtitle">Track and manage customer orders & payments</div>
          </div>
          {/* Optional: Add Export/Filter Buttons here */}
        </div>

        {/* Content */}
        <div className="orders-content">
          {loading ? <Loader /> : <DataTable columns={columns} data={orders} />}
        </div>

        {/* Details Modal */}
        <Modal
          open={!!details}
          title="Order Summary"
          onClose={() => setDetails(null)}
          width="600px"
        >
          <OrderDetails order={details} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
