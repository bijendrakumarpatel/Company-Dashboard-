"use client"
import { Navigate } from "react-router-dom"
import useAuth from "../context/useAuth"

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/" replace />
  // Allow any authenticated user (admin or regular user)
  return children
}
