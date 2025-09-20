"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, FileText } from "lucide-react"
import { addQualityTest } from "@/lib/api"

interface QualityTestFormProps {
  batchId?: string
  onSuccess?: (testData: any) => void
  onCancel?: () => void
}

export function QualityTestForm({ batchId, onSuccess, onCancel }: QualityTestFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: batchId || "",
    labId: user?.userId || "",
    testType: "",
    testResults: {} as Record<string, number>,
    testDate: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().split(" ")[0] + "Z",
    certification: "",
    labLocation: "",
  })

  const testTypes = [
    { value: "moisture", label: "Moisture Content", fields: ["moisture", "temperature", "humidity", "testDuration"] },
    { value: "heavy_metals", label: "Heavy Metals", fields: ["lead", "cadmium", "mercury", "arsenic", "chromium"] },
    {
      value: "pesticide",
      label: "Pesticide Residue",
      fields: ["pesticide", "organochlorines", "organophosphates", "purity"],
    },
    {
      value: "microbial",
      label: "Microbial Testing",
      fields: ["totalBacterialCount", "yeastMold", "ecoli", "salmonella"],
    },
    {
      value: "aflatoxin",
      label: "Aflatoxin Testing",
      fields: ["aflatoxinB1", "aflatoxinB2", "aflatoxinG1", "aflatoxinG2"],
    },
  ]

  const fieldLabels: Record<string, string> = {
    moisture: "Moisture (%)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    testDuration: "Test Duration (hours)",
    lead: "Lead (ppm)",
    cadmium: "Cadmium (ppm)",
    mercury: "Mercury (ppm)",
    arsenic: "Arsenic (ppm)",
    chromium: "Chromium (ppm)",
    pesticide: "Pesticide (ppm)",
    organochlorines: "Organochlorines (ppm)",
    organophosphates: "Organophosphates (ppm)",
    purity: "Purity (%)",
    totalBacterialCount: "Total Bacterial Count (CFU/g)",
    yeastMold: "Yeast & Mold (CFU/g)",
    ecoli: "E. coli (CFU/g)",
    salmonella: "Salmonella (Present/Absent)",
    aflatoxinB1: "Aflatoxin B1 (ppb)",
    aflatoxinB2: "Aflatoxin B2 (ppb)",
    aflatoxinG1: "Aflatoxin G1 (ppb)",
    aflatoxinG2: "Aflatoxin G2 (ppb)",
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTestResultChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      testResults: {
        ...prev.testResults,
        [field]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleTestTypeChange = (testType: string) => {
    const selectedTest = testTypes.find((t) => t.value === testType)
    if (selectedTest) {
      const newResults: Record<string, number> = {}
      selectedTest.fields.forEach((field) => {
        newResults[field] = 0
      })
      setFormData((prev) => ({
        ...prev,
        testType,
        testResults: newResults,
      }))
    }
  }

  const generateCertificationId = () => {
    const testCode = formData.testType.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const certId = `CERT-${testCode}-${timestamp}`
    setFormData((prev) => ({ ...prev, certification: certId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const result = await addQualityTest(user.userId, formData)
      onSuccess?.(result)
    } catch (error) {
      console.error("Failed to add quality test:", error)
      // Handle error - could show toast notification
    } finally {
      setLoading(false)
    }
  }

  const selectedTestType = testTypes.find((t) => t.value === formData.testType)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Add Quality Test Results
        </CardTitle>
        <CardDescription>Record laboratory test results for herb batch quality assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch and Lab Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                placeholder="BATCH-ASH-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labId">Laboratory ID</Label>
              <Input
                id="labId"
                value={formData.labId}
                onChange={(e) => handleInputChange("labId", e.target.value)}
                placeholder="QualityLab01"
                required
              />
            </div>
          </div>

          {/* Test Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Select value={formData.testType} onValueChange={handleTestTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((test) => (
                  <SelectItem key={test.value} value={test.value}>
                    {test.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Test Results */}
          {selectedTestType && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base font-medium">Test Results</Label>
                <Badge variant="outline">{selectedTestType.label}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {selectedTestType.fields.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{fieldLabels[field] || field}</Label>
                    <Input
                      id={field}
                      type="number"
                      step="any"
                      value={formData.testResults[field] || ""}
                      onChange={(e) => handleTestResultChange(field, e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testDate">Test Date & Time</Label>
              <Input
                id="testDate"
                type="datetime-local"
                value={formData.testDate.slice(0, 16)}
                onChange={(e) => handleInputChange("testDate", e.target.value + ":00Z")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labLocation">Laboratory Location</Label>
              <Input
                id="labLocation"
                value={formData.labLocation}
                onChange={(e) => handleInputChange("labLocation", e.target.value)}
                placeholder="AIIMS Delhi - Block C"
                required
              />
            </div>
          </div>

          {/* Certification */}
          <div className="space-y-2">
            <Label htmlFor="certification">Certification ID</Label>
            <div className="flex gap-2">
              <Input
                id="certification"
                value={formData.certification}
                onChange={(e) => handleInputChange("certification", e.target.value)}
                placeholder="CERT-MOI-123456"
                required
              />
              <Button type="button" variant="outline" onClick={generateCertificationId}>
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Adding Test Results..." : "Add Test Results"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
