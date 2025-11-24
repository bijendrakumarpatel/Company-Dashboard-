"use client"

import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import useAuth from "../context/useAuth"

import PrivateRoute from "./PrivateRoute"
import AdminRoute from "./AdminRoute"

// Auth Components
import Login from "../pages/Auth/Login"
import OTPVerify from "../pages/Auth/OTPVerify"
import LoginModal from "../components/Auth/LoginModal"

// Pages
import Home from "../pages/Home/Home"
import Dashboard from "../pages/Dashboard/Dashboard"
import UserDashboard from "../pages/Dashboard/UserDashboard"
import Customers from "../pages/Customers/Customers"
import Products from "../pages/Products/Products"
import Agreements from "../pages/Agreements/Agreements"
import Orders from "../pages/Orders/Orders"
import Payments from "../pages/Payments/Payments"
import Expenses from "../pages/Expenses/Expenses"
import Reports from "../pages/Reports/Reports"
import Settings from "../pages/Settings/Settings"

export default function AppRouter() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user } = useAuth()

  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin/dashboard"
    if (user?.role === "user") return "/user/dashboard"
    return "/"
  }

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home onLoginClick={() => setShowLoginModal(true)} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OTPVerify />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <AdminRoute>
              <Customers />
            </AdminRoute>
          }
        />

        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        <Route
          path="/agreements"
          element={
            <AdminRoute>
              <Agreements />
            </AdminRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <AdminRoute>
              <Payments />
            </AdminRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <AdminRoute>
              <Expenses />
            </AdminRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* SMART REDIRECT */}
        <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
