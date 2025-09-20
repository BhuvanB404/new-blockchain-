"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, Microscope, FlaskConical, Thermometer, Scale } from "lucide-react"

interface TestResult {
  id: string
  name: string
  value: string
  unit: string
  status: "pass" | "fail" | "warning"
  range: string
  notes?: string
}

interface TestSuite {
  id: string
  batchId: string
  testType: "purity" | "potency" | "contamination" | "identity" | "stability"
  status: "pending" | "in-progress" | "completed" | "failed"
  results: TestResult[]
  startDate: string
  completedDate?: string
  technician: string
  equipment: string
}

export default function TestSuiteComponent() {
  const [activeTest, setActiveTest] = useState<TestSuite | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  const testTypes = [
    { id: "purity", name: "Purity Analysis", icon: FlaskConical, color: "bg-blue-500" },
    { id: "potency", name: "Potency Testing", icon: Scale, color: "bg-green-500" },
    { id: "contamination", name: "Contamination Screen", icon: Microscope, color: "bg-red-500" },
    { id: "identity", name: "Identity Verification", icon: CheckCircle, color: "bg-purple-500" },
    { id: "stability", name: "Stability Testing", icon: Thermometer, color: "bg-orange-500" },
  ]

  const sampleTests: TestSuite[] = [
    {
      id: "TS001",
      batchId: "HB001",
      testType: "purity",
      status: "completed",
      results: [
        { id: "1", name: "Heavy Metals", value: "2.1", unit: "ppm", status: "pass", range: "< 5 ppm" },
        { id: "2", name: "Pesticide Residue", value: "0.05", unit: "mg/kg", status: "pass", range: "< 0.1 mg/kg" },
        { id: "3", name: "Moisture Content", value: "8.2", unit: "%", status: "pass", range: "< 10%" },
      ],
      startDate: "2024-01-15",
      completedDate: "2024-01-17",
      technician: "Dr. Sarah Chen",
      equipment: "HPLC-MS/MS",
    },
    {
      id: "TS002",
      batchId: "HB002",
      testType: "potency",
      status: "in-progress",
      results: [
        { id: "1", name: "Active Compounds", value: "95.2", unit: "%", status: "pass", range: "> 90%" },
        {
          id: "2",
          name: "Curcumin Content",
          value: "3.8",
          unit: "%",
          status: "warning",
          range: "4-6%",
          notes: "Slightly below optimal range",
        },
      ],
      startDate: "2024-01-18",
      technician: "Dr. Raj Patel",
      equipment: "UV-Vis Spectrophotometer",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "pending":
        return "bg-gray-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quality Testing Suite</h2>
          <p className="text-muted-foreground">Comprehensive testing protocols for herb batches and medicines</p>
        </div>
        <Button>
          <FlaskConical className="mr-2 h-4 w-4" />
          New Test Suite
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="protocols">Test Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleTests.map((test) => {
              const testType = testTypes.find((t) => t.id === test.testType)
              const Icon = testType?.icon || FlaskConical

              return (
                <Card
                  key={test.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTest(test)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${testType?.color || "bg-gray-500"}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{testType?.name}</CardTitle>
                          <CardDescription>Batch: {test.batchId}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(test.status)} text-white`}>
                        {test.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{test.status === "completed" ? "100%" : "65%"}</span>
                      </div>
                      <Progress value={test.status === "completed" ? 100 : 65} className="h-2" />
                      <div className="text-xs text-muted-foreground">Technician: {test.technician}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {sampleTests
              .filter((test) => test.status === "completed")
              .map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{testTypes.find((t) => t.id === test.testType)?.name}</CardTitle>
                        <CardDescription>
                          Batch: {test.batchId} • Completed: {test.completedDate}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {test.results.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-muted-foreground">Range: {result.range}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {result.value} {result.unit}
                            </div>
                            {result.notes && <div className="text-xs text-muted-foreground">{result.notes}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {testTypes.map((testType) => {
              const Icon = testType.icon
              return (
                <Card key={testType.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${testType.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle>{testType.name}</CardTitle>
                        <CardDescription>Standard testing protocol</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Duration:</strong> 2-3 days
                      </div>
                      <div>
                        <strong>Equipment:</strong> HPLC, UV-Vis, GC-MS
                      </div>
                      <div>
                        <strong>Standards:</strong> WHO, FDA, Ayush guidelines
                      </div>
                      <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                        View Protocol
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {activeTest && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Details: {activeTest.id}</CardTitle>
            <CardDescription>
              {testTypes.find((t) => t.id === activeTest.testType)?.name} for Batch {activeTest.batchId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Test Information</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div>
                      Status: <Badge className={getStatusColor(activeTest.status)}>{activeTest.status}</Badge>
                    </div>
                    <div>Technician: {activeTest.technician}</div>
                    <div>Equipment: {activeTest.equipment}</div>
                    <div>Start Date: {activeTest.startDate}</div>
                    {activeTest.completedDate && <div>Completed: {activeTest.completedDate}</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Test Results</Label>
                <div className="space-y-3">
                  {activeTest.results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <span>
                        {result.value} {result.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
