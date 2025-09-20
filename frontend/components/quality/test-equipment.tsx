"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Microscope,
  FlaskConical,
  Thermometer,
  Scale,
  Zap,
  Activity,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface Equipment {
  id: string
  name: string
  type: string
  status: "available" | "in-use" | "maintenance" | "calibration"
  location: string
  lastCalibration: string
  nextCalibration: string
  utilization: number
  currentTest?: string
  icon: any
}

export default function TestEquipmentComponent() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const equipment: Equipment[] = [
    {
      id: "EQ001",
      name: "HPLC-MS/MS System",
      type: "Chromatography",
      status: "in-use",
      location: "Lab A - Station 1",
      lastCalibration: "2024-01-10",
      nextCalibration: "2024-04-10",
      utilization: 85,
      currentTest: "Purity Analysis - Batch HB001",
      icon: FlaskConical,
    },
    {
      id: "EQ002",
      name: "UV-Vis Spectrophotometer",
      type: "Spectroscopy",
      status: "available",
      location: "Lab B - Station 2",
      lastCalibration: "2024-01-15",
      nextCalibration: "2024-04-15",
      utilization: 62,
      icon: Zap,
    },
    {
      id: "EQ003",
      name: "Analytical Balance",
      type: "Weighing",
      status: "available",
      location: "Lab A - Station 3",
      lastCalibration: "2024-01-20",
      nextCalibration: "2024-02-20",
      utilization: 45,
      icon: Scale,
    },
    {
      id: "EQ004",
      name: "Microscope System",
      type: "Imaging",
      status: "maintenance",
      location: "Lab C - Station 1",
      lastCalibration: "2023-12-15",
      nextCalibration: "2024-03-15",
      utilization: 0,
      icon: Microscope,
    },
    {
      id: "EQ005",
      name: "Stability Chamber",
      type: "Environmental",
      status: "in-use",
      location: "Environmental Lab",
      lastCalibration: "2024-01-05",
      nextCalibration: "2024-07-05",
      utilization: 90,
      currentTest: "Stability Testing - Multiple Batches",
      icon: Thermometer,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "in-use":
        return "bg-blue-500"
      case "maintenance":
        return "bg-red-500"
      case "calibration":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-use":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "calibration":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const availableEquipment = equipment.filter((eq) => eq.status === "available")
  const inUseEquipment = equipment.filter((eq) => eq.status === "in-use")
  const maintenanceEquipment = equipment.filter((eq) => eq.status === "maintenance" || eq.status === "calibration")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Laboratory Equipment</h2>
          <p className="text-muted-foreground">Monitor and manage testing equipment status and utilization</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Calibration
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Equipment Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableEquipment.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inUseEquipment.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maintenanceEquipment.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Equipment</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="in-use">In Use</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map((eq) => {
              const Icon = eq.icon
              return (
                <Card
                  key={eq.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEquipment(eq)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary">
                          <Icon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{eq.name}</CardTitle>
                          <CardDescription>{eq.type}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(eq.status)}
                        <Badge variant="secondary" className={`${getStatusColor(eq.status)} text-white`}>
                          {eq.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="font-medium">Location: {eq.location}</div>
                        {eq.currentTest && <div className="text-muted-foreground mt-1">Current: {eq.currentTest}</div>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>{eq.utilization}%</span>
                        </div>
                        <Progress value={eq.utilization} className="h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground">Next calibration: {eq.nextCalibration}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableEquipment.map((eq) => {
              const Icon = eq.icon
              return (
                <Card key={eq.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-green-500">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{eq.name}</CardTitle>
                        <CardDescription>{eq.location}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Reserve Equipment
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="in-use">
          <div className="space-y-4">
            {inUseEquipment.map((eq) => (
              <Card key={eq.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{eq.name}</CardTitle>
                      <CardDescription>{eq.location}</CardDescription>
                    </div>
                    <Badge className="bg-blue-500 text-white">In Use</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">Current Test: {eq.currentTest}</div>
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span>{eq.utilization}%</span>
                    </div>
                    <Progress value={eq.utilization} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-4">
            {maintenanceEquipment.map((eq) => (
              <Card key={eq.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{eq.name}</CardTitle>
                      <CardDescription>{eq.location}</CardDescription>
                    </div>
                    <Badge className="bg-red-500 text-white">Maintenance</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Last Calibration: {eq.lastCalibration}</div>
                    <div>Next Calibration: {eq.nextCalibration}</div>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Schedule Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedEquipment && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Equipment Details: {selectedEquipment.name}</CardTitle>
            <CardDescription>
              {selectedEquipment.type} • {selectedEquipment.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedEquipment.status)}
                      <span>Status: {selectedEquipment.status}</span>
                    </div>
                    <div>Utilization: {selectedEquipment.utilization}%</div>
                    {selectedEquipment.currentTest && <div>Current Test: {selectedEquipment.currentTest}</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Calibration Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div>Last Calibration: {selectedEquipment.lastCalibration}</div>
                    <div>Next Calibration: {selectedEquipment.nextCalibration}</div>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Calibration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
