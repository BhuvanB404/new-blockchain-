"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, FlaskConical, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, Leaf } from "lucide-react"
import { fetchLedger } from "@/lib/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      if (user?.role === "regulator") {
        const ledgerData = await fetchLedger(user.userId)
        processLedgerData(ledgerData)
      }
      // Add other role-specific data loading here
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const processLedgerData = (data: any[]) => {
    const batches = data.filter((item) => item.batchId)
    const medicines = data.filter((item) => item.medicineId)
    const farmers = data.filter((item) => item.farmerId)
    const manufacturers = data.filter((item) => item.manufacturerId)
    const labs = data.filter((item) => item.laboratoryId)

    setStats({
      totalBatches: batches.length,
      totalMedicines: medicines.length,
      totalFarmers: farmers.length,
      totalManufacturers: manufacturers.length,
      totalLabs: labs.length,
      passedTests: batches.filter((b) => b.qualityStatus === "TESTED_PASSED").length,
      failedTests: batches.filter((b) => b.qualityStatus === "TESTED_FAILED").length,
    })

    setRecentActivity(data.slice(0, 5))
  }

  const getRoleSpecificStats = () => {
    switch (user?.role) {
      case "regulator":
        return [
          { title: "Total Batches", value: stats?.totalBatches || 0, icon: Package, color: "text-blue-600" },
          { title: "Total Medicines", value: stats?.totalMedicines || 0, icon: Leaf, color: "text-green-600" },
          { title: "Active Farmers", value: stats?.totalFarmers || 0, icon: Users, color: "text-purple-600" },
          { title: "Quality Labs", value: stats?.totalLabs || 0, icon: FlaskConical, color: "text-orange-600" },
        ]
      case "farmer":
        return [
          { title: "My Batches", value: 3, icon: Package, color: "text-green-600" },
          { title: "Pending Tests", value: 1, icon: Clock, color: "text-yellow-600" },
          { title: "Passed Tests", value: 2, icon: CheckCircle, color: "text-green-600" },
          { title: "Transfers", value: 5, icon: TrendingUp, color: "text-blue-600" },
        ]
      case "manufacturer":
        return [
          { title: "Received Batches", value: 8, icon: Package, color: "text-blue-600" },
          { title: "Medicines Created", value: 3, icon: Leaf, color: "text-green-600" },
          { title: "Quality Passed", value: 7, icon: CheckCircle, color: "text-green-600" },
          { title: "In Production", value: 2, icon: Clock, color: "text-yellow-600" },
        ]
      case "laboratory":
        return [
          { title: "Tests Completed", value: 15, icon: FlaskConical, color: "text-purple-600" },
          { title: "Pending Tests", value: 3, icon: Clock, color: "text-yellow-600" },
          { title: "Passed", value: 12, icon: CheckCircle, color: "text-green-600" },
          { title: "Failed", value: 3, icon: AlertTriangle, color: "text-red-600" },
        ]
      default:
        return []
    }
  }

  const roleStats = getRoleSpecificStats()

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back, {user?.name || user?.userId}</h1>
          <p className="text-muted-foreground">
            {user?.role === "regulator" && "Monitor the entire Ayurveda supply chain ecosystem"}
            {user?.role === "farmer" && "Manage your herb batches and track their journey"}
            {user?.role === "manufacturer" && "Process batches and create quality medicines"}
            {user?.role === "laboratory" && "Conduct quality tests and issue certifications"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates in the supply chain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.batchId && `Batch ${activity.batchId}`}
                        {activity.medicineId && `Medicine ${activity.medicineId}`}
                        {activity.farmerId && `Farmer ${activity.farmerId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.herbName || activity.medicineName || "Entity onboarded"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.qualityStatus === "TESTED_PASSED"
                          ? "default"
                          : activity.qualityStatus === "TESTED_FAILED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {activity.status || activity.qualityStatus || "Active"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.role === "regulator" && (
                <>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Onboard New Entity
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    View Full Ledger
                  </Button>
                </>
              )}
              {user?.role === "farmer" && (
                <>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Create New Batch
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Transfer Batch
                  </Button>
                </>
              )}
              {user?.role === "manufacturer" && (
                <>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Leaf className="h-4 w-4 mr-2" />
                    Create Medicine
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    View Batches
                  </Button>
                </>
              )}
              {user?.role === "laboratory" && (
                <>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Add Quality Test
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Issue Certificate
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
