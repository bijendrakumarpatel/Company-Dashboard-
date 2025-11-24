"use client"
import { useNavigate } from "react-router-dom"
import { FaSignOutAlt, FaBars } from "react-icons/fa"
import useAuth from "../../context/useAuth"
import "./Navbar.css"

export default function Navbar({ title = "Dashboard", onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-toggle" onClick={onMenuToggle}>
          <FaBars />
        </button>
        <h1 className="navbar__title">{title}</h1>
        <p className="navbar__subtitle">Manage your company data in one place.</p>
      </div>

      <div className="navbar__right">
        <div className="navbar__search">
          <input placeholder="Search..." />
        </div>

        <div className="navbar__user">
          <div className="navbar__avatar">{user?.name?.charAt(0) || "A"}</div>
          <div className="navbar__user-info">
            <span className="navbar__user-name">{user?.name || "Admin"}</span>
            <span className="navbar__user-role">{user?.role === "admin" ? "Administrator" : "User"}</span>
          </div>
          <button className="navbar__logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  )
}
