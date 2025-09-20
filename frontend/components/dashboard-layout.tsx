"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Leaf,
  LogOut,
  Home,
  Package,
  Users,
  FlaskConical,
  Shield,
  BarChart3,
  Plus,
  Search,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavigationItems = () => {
    const baseItems = [{ href: "/dashboard", icon: Home, label: "Dashboard" }]

    switch (user?.role) {
      case "regulator":
        return [
          ...baseItems,
          { href: "/dashboard/ledger", icon: BarChart3, label: "Ledger View" },
          { href: "/dashboard/onboard", icon: Users, label: "Onboard Entities" },
          { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
        ]
      case "farmer":
        return [
          ...baseItems,
          { href: "/dashboard/batches", icon: Package, label: "My Batches" },
          { href: "/dashboard/create-batch", icon: Plus, label: "Create Batch" },
          { href: "/dashboard/transfers", icon: Search, label: "Transfers" },
        ]
      case "manufacturer":
        return [
          ...baseItems,
          { href: "/dashboard/batches", icon: Package, label: "Received Batches" },
          { href: "/dashboard/medicines", icon: Plus, label: "Create Medicine" },
          { href: "/dashboard/transfers", icon: Search, label: "Transfers" },
        ]
      case "laboratory":
        return [
          ...baseItems,
          { href: "/dashboard/quality-testing", icon: FlaskConical, label: "Quality Testing" },
          { href: "/dashboard/tests", icon: FlaskConical, label: "Quality Tests" },
          { href: "/dashboard/pending", icon: Search, label: "Pending Tests" },
          { href: "/dashboard/certifications", icon: Shield, label: "Certifications" },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AyurChain</span>
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>•</span>
                <span className="capitalize">{user.role}</span>
                <span>•</span>
                <span>{user.userId}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { DashboardLayout }
