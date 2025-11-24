"use client"
import { NavLink, useNavigate } from "react-router-dom"
import { FaTimes, FaSignOutAlt } from "react-icons/fa"
import useAuth from "../../context/useAuth"
import "./Sidebar.css"

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Customers", path: "/customers" },
  { label: "Products", path: "/products" },
  { label: "Agreements", path: "/agreements" },
  { label: "Orders", path: "/orders" },
  { label: "Payments", path: "/payments" },
  { label: "Expenses", path: "/expenses" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <span className="sidebar__brand-logo">L</span>
            <span className="sidebar__brand-name">Laxmi Mill</span>
          </div>
          <button className="sidebar__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => "sidebar__link" + (isActive ? " sidebar__link--active" : "")}
            >
              <span className="sidebar__link-dot" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-profile">
            <div className="sidebar__user-avatar">{user?.name?.charAt(0) || "A"}</div>
            <div>
              <p className="sidebar__user-name">{user?.name || "Admin"}</p>
              <p className="sidebar__user-email">{user?.email}</p>
            </div>
          </div>
          <button className="sidebar__logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
