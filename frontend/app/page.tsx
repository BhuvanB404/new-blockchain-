"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRScanner } from "@/components/qr-scanner"
import { useAuth } from "@/contexts/auth-context"
import { Shield, Leaf, Users, MapPin, QrCode, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginId.trim()) return

    setIsLoading(true)
    try {
      await login(loginId.trim())
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      // Handle error - could show toast notification
    } finally {
      setIsLoading(false)
    }
  }

  const handleQRScan = (medicineId: string) => {
    router.push(`/verify/${medicineId}`)
  }

  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-balance">AyurChain</span>
          </div>
          <Button variant="outline" onClick={() => setShowLogin(true)} className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Blockchain-powered
            <span className="text-primary block">Ayurveda traceability</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Track your Ayurvedic medicines from farm to consumer with complete transparency. Verify authenticity,
            quality tests, and sustainability scores instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setShowQRScanner(true)} className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Verify Medicine
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowLogin(true)}>
              Access Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Blockchain Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Immutable records ensure complete transparency and prevent counterfeiting
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-12 w-12 mx-auto text-success mb-4" />
              <CardTitle>Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Comprehensive testing for moisture, heavy metals, and pesticides</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 mx-auto text-info mb-4" />
              <CardTitle>GPS Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track the complete journey from harvest location to your hands</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-warning mb-4" />
              <CardTitle>Multi-stakeholder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Farmers, manufacturers, labs, and regulators working together</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <QRScanner onScan={handleQRScan} onClose={() => setShowQRScanner(false)} />
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In to AyurChain</CardTitle>
              <CardDescription>Enter your user ID to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="e.g., Regulator01, Farmer02, Manufacturer01"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowLogin(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
