import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { FaChartBar, FaArrowRight, FaClock, FaHandPointer, FaDollarSign } from 'react-icons/fa'; // Added new icons

// Correct Imports
import { getSummary } from "../../api/dashboardApi";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import CardsSection from "./CardsSection";

import "./Dashboard.css";

// Helper function to provide a minimal fallback structure for summary if API fails
const emptySummary = {
    summary: {
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    },
    recentOrders: []
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      // --- FETCHING REAL DATA FROM DATABASE API ---
      const data = await getSummary(); 
      
      setSummary(data.summary || emptySummary.summary);
      setRecentOrders(data.recentOrders || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      // Fallback to empty data structure
      setSummary(emptySummary.summary);
      setRecentOrders(emptySummary.recentOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- Premium Column Definitions ---
  const columns = [
    { 
      header: "Order ID", 
      accessor: "id",
      render: (row) => <span className="font-medium" style={{ color: 'var(--primary)' }}>#{row.id}</span>
    },
    { 
      header: "Customer", 
      accessor: "customer_name",
      render: (row) => (
        <div className="customer-cell">
          <div className="customer-avatar">{row.customer_name?.charAt(0)}</div>
          <span>{row.customer_name || "Unknown"}</span>
        </div>
      )
    },
    { 
      header: "Amount", 
      accessor: "total_amount",
      render: (row) => <strong style={{ color: 'var(--text-main)' }}><FaDollarSign style={{ marginRight: '4px', fontSize: '12px', color: 'var(--success-color)' }} />{Number(row.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => {
        const status = row.status?.toLowerCase() || "pending";
        return <span className={`status-badge status-${status.replace(' ', '-')}`}>{row.status}</span>;
      }
    },
    { 
      header: "Date", 
      accessor: "order_date",
      render: (row) => new Date(row.order_date).toLocaleDateString('en-IN')
    },
  ];

  return (
    <AdminLayout title="Overview">
      {loading ? (
        <div className="dashboard-page" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader size={40} />
        </div>
      ) : (
        <div className="dashboard-page fade-in"> {/* Added fade-in class */}
          {/* 1. Stats Row (Top Cards) */}
          <CardsSection summary={summary} />

          {/* 2. Content Row */}
          <div className="dashboard-page__row">
            
            {/* Left Panel: Recent Orders (75% width) */}
            <div className="dashboard-page__panel">
              <div className="panel-header">
                <h3 className="panel-title"><FaChartBar /> Recent Orders</h3>
                <button className="btn-link">View All <FaArrowRight style={{ marginLeft: '5px' }} /></button>
              </div>
              <DataTable
                columns={columns}
                data={recentOrders}
                emptyText="No recent orders found."
              />
            </div>

            {/* Right Panel: Activity / Charts (25% width) */}
            <div className="dashboard-page__panel">
              <div className="panel-header">
                <h3 className="panel-title"><FaClock /> Activity Log</h3>
                <button className="btn-link">Full Log <FaHandPointer style={{ marginLeft: '5px' }} /></button>
              </div>
              
              <div className="activity-placeholder">
                <div className="activity-item">
                  <span className="dot dot-blue"></span>
                  <p>New order received <b>#1026</b></p>
                  <span className="time">2 min ago</span>
                </div>
                <div className="activity-item">
                  <span className="dot dot-green"></span>
                  <p>Payment verified for <b>#1025</b></p>
                  <span className="time">15 min ago</span>
                </div>
                <div className="activity-item">
                  <span className="dot dot-amber"></span>
                  <p>Order <b>#1024</b> waiting approval</p>
                  <span className="time">1 hour ago</span>
                </div>
                <div className="activity-item">
                  <span className="dot dot-gray"></span>
                  <p>System backup completed</p>
                  <span className="time">5 hours ago</span>
                </div>
              </div>

              <div className="chart-placeholder">
                <p>Sales Chart Area (Placeholder)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
