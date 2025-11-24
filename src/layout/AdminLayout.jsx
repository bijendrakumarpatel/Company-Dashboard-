"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import "./layout.css"

export default function AdminLayout({ title = "Dashboard", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-root">
      <div className="admin-layout">
        <div className="admin-layout__sidebar">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="admin-layout__content">
          <Navbar title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="admin-layout__main">{children}</main>
        </div>
      </div>
    </div>
  )
}
