"use client"

import { useState, useEffect } from "react"
import { FaUser, FaShoppingCart, FaHeart, FaFileAlt, FaDownload, FaLogout } from "react-icons/fa"
import useAuth from "../../context/useAuth"
import { useNavigate } from "react-router-dom"
import "./UserDashboard.css"

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userOrders, setUserOrders] = useState([])
  const [activeTab, setActiveTab] = useState("orders")

  useEffect(() => {
    // Simulate fetching user orders from database
    setUserOrders([
      {
        id: 1,
        orderNumber: "ORD-2025-001",
        date: "2025-01-15",
        amount: 15000,
        status: "Delivered",
        items: 5,
      },
      {
        id: 2,
        orderNumber: "ORD-2025-002",
        date: "2025-01-10",
        amount: 8500,
        status: "Processing",
        items: 3,
      },
      {
        id: 3,
        orderNumber: "ORD-2025-003",
        date: "2025-01-05",
        amount: 22000,
        status: "Delivered",
        items: 8,
      },
    ])
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const stats = [
    { label: "Total Orders", value: "12", icon: <FaShoppingCart /> },
    { label: "Total Spent", value: "₹1,25,000", icon: <FaFileAlt /> },
    { label: "Favorites", value: "8", icon: <FaHeart /> },
    { label: "Documents", value: "15", icon: <FaDownload /> },
  ]

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="user-header">
        <div className="user-header-container">
          <h1>My Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <FaLogout /> Logout
          </button>
        </div>
      </header>

      <div className="user-dashboard-container">
        {/* Sidebar */}
        <aside className="user-sidebar">
          <div className="user-profile">
            <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
            <div className="user-info">
              <h3>{user?.name || "User"}</h3>
              <p>{user?.email}</p>
              <span className={`user-badge ${user?.subscription_plan}`}>{user?.subscription_plan || "Free"} Plan</span>
            </div>
          </div>

          <nav className="user-nav">
            <button
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingCart /> Orders
            </button>
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser /> Profile
            </button>
            <button
              className={`nav-item ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              <FaFileAlt /> Documents
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="user-main">
          {/* Stats */}
          <div className="user-stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "orders" && (
            <div className="tab-content">
              <h2>My Orders</h2>
              <div className="orders-list">
                {userOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h4>{order.orderNumber}</h4>
                        <p className="order-date">{new Date(order.date).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <div>
                        <span>Amount:</span>
                        <strong>₹{order.amount.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span>Items:</span>
                        <strong>{order.items}</strong>
                      </div>
                    </div>
                    <button className="order-action">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="tab-content">
              <h2>My Profile</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={user?.name || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={user?.email || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label>Subscription Plan</label>
                  <select defaultValue={user?.subscription_plan}>
                    <option value="free">Free</option>
                    <option value="pro">Professional</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <button className="save-btn">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="tab-content">
              <h2>My Documents</h2>
              <div className="documents-list">
                <div className="document-item">
                  <div className="doc-icon">📄</div>
                  <div>
                    <h4>Invoice - ORD-2025-001</h4>
                    <p>January 15, 2025</p>
                  </div>
                  <button className="doc-action">
                    <FaDownload /> Download
                  </button>
                </div>
                <div className="document-item">
                  <div className="doc-icon">📋</div>
                  <div>
                    <h4>Agreement - AG-2025-05</h4>
                    <p>January 10, 2025</p>
                  </div>
                  <button className="doc-action">
                    <FaDownload /> Download
                  </button>
                </div>
                <div className="document-item">
                  <div className="doc-icon">📊</div>
                  <div>
                    <h4>Receipt - REC-2025-12</h4>
                    <p>January 5, 2025</p>
                  </div>
                  <button className="doc-action">
                    <FaDownload /> Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
