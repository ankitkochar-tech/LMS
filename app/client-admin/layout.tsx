"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Building2 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/client-admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/client-admin/users", icon: Users },
  { name: "Assignments", href: "/client-admin/assignments", icon: BookOpen },
  { name: "Settings", href: "/client-admin/settings", icon: Settings },
]

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E7EB] transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#0D9488]" />
              <span className="font-semibold text-[#1F2937]">Client Admin</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#1F2937]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-[#CCFBF1] text-[#0D9488]" : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-[#0D9488] flex items-center justify-center">
                <span className="text-xs font-semibold text-white">AA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937] truncate">Alex Admin</p>
                <p className="text-xs text-[#6B7280] truncate">Acme Corp</p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent border-[#E5E7EB]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-[#E5E7EB] lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Building2 className="h-5 w-5 text-[#0D9488]" />
            <span className="font-semibold text-[#1F2937]">AIRX</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
