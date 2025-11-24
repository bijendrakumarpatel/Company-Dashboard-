"use client"

import { useState } from "react"
import { FaTimes, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import useAuth from "../../context/useAuth"
import "./LoginModal.css"

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth()
  const [userType, setUserType] = useState("admin") // 'admin' or 'user'
  const [email, setEmail] = useState("admin@ricemill.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simulate API call (will connect to Neon in production)
      const mockUsers = {
        admin: {
          id: 1,
          email: "admin@ricemill.com",
          name: "Admin User",
          role: "admin",
          is_premium: true,
        },
        user: {
          id: 2,
          email: "user@example.com",
          name: "John Doe",
          role: "user",
          is_premium: false,
        },
      }

      const user = mockUsers[userType]
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

      // In production, this will call your backend
      login({
        user,
        accessToken: token,
        refreshToken: token,
      })

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="login-modal-header">
          <h2>Welcome Back</h2>
          <p>Login to access your dashboard</p>
        </div>

        {/* User Type Tabs */}
        <div className="login-type-tabs">
          <button
            className={`tab ${userType === "admin" ? "active" : ""}`}
            onClick={() => {
              setUserType("admin")
              setEmail("admin@ricemill.com")
              setPassword("admin123")
            }}
          >
            Admin
          </button>
          <button
            className={`tab ${userType === "user" ? "active" : ""}`}
            onClick={() => {
              setUserType("user")
              setEmail("user@example.com")
              setPassword("user123")
            }}
          >
            User
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          {/* Email Input */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p>
            <strong>Admin:</strong> admin@ricemill.com / admin123
          </p>
          <p>
            <strong>User:</strong> user@example.com / user123
          </p>
        </div>
      </div>
    </div>
  )
}
