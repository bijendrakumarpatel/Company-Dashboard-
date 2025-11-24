"use client"

import { useEffect, useState } from "react"
import AuthContext from "./AuthContext"
import { me as fetchMe, logout as apiLogout } from "../api/authApi"
import { tokenStorage } from "../api/apiClient"

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      const accessToken = tokenStorage.getAccessToken()
      if (!accessToken) {
        setUser(null)
        setUserType(null)
        return
      }

      const currentUser = await fetchMe()
      setUser(currentUser || null)
      setUserType(currentUser?.role || null)
    } catch (err) {
      console.error("AUTH: failed to load user", err)
      setUser(null)
      setUserType(null)
      tokenStorage.clear()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = ({ user, accessToken, refreshToken }) => {
    if (accessToken && refreshToken) {
      tokenStorage.setTokens({ accessToken, refreshToken })
    }
    setUser(user)
    setUserType(user?.role || null)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (err) {
      console.warn("AUTH: logout error", err)
    } finally {
      tokenStorage.clear()
      setUser(null)
      setUserType(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
