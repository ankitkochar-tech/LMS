"use client"

import type { ReactNode } from "react"
import Link from "link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  navigation: Array<{
    name: string
    href: string
    icon: ReactNode
  }>
  userRole: string
}

export function DashboardLayout({ children, navigation, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sidebar-border">
            <Shield className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">AI Governance</h1>
              <p className="text-xs text-sidebar-foreground/60">{userRole}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
