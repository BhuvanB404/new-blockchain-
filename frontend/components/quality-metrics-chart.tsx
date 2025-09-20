"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, FlaskConical } from "lucide-react"

interface QualityTest {
  testType: string
  status: "PASSED" | "FAILED"
  results: Record<string, number>
  standards: {
    valid: boolean
    issues: string[]
    warnings: string[]
  }
  laboratory: {
    id: string
    location: string
  }
  testDate: string
}

interface QualityMetricsChartProps {
  tests: QualityTest[]
  title?: string
}

export function QualityMetricsChart({ tests, title = "Quality Test Results" }: QualityMetricsChartProps) {
  const getTestTypeColor = (testType: string) => {
    switch (testType.toLowerCase()) {
      case "moisture":
        return "text-blue-600"
      case "heavy_metals":
        return "text-purple-600"
      case "pesticide":
      case "pesticide_failure":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getProgressValue = (value: number, testType: string) => {
    // Convert test values to percentage for progress bars
    switch (testType.toLowerCase()) {
      case "moisture":
        return Math.min((value / 15) * 100, 100) // Max 15% moisture
      case "heavy_metals":
        return Math.min((value / 0.1) * 100, 100) // Max 0.1ppm for heavy metals
      case "pesticide":
      case "pesticide_failure":
        return Math.min((value / 1.0) * 100, 100) // Max 1.0ppm for pesticides
      default:
        return Math.min(value, 100)
    }
  }

  const getProgressColor = (status: string, value: number) => {
    if (status === "FAILED") return "bg-destructive"
    if (value > 80) return "bg-warning"
    return "bg-success"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Laboratory test results and compliance status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tests.map((test, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold capitalize ${getTestTypeColor(test.testType)}`}>
                  {test.testType.replace(/_/g, " ")}
                </h4>
                <p className="text-sm text-muted-foreground">{test.laboratory.location}</p>
              </div>
              <Badge variant={test.status === "PASSED" ? "default" : "destructive"}>
                {test.status === "PASSED" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {test.status}
              </Badge>
            </div>

            <div className="space-y-3">
              {Object.entries(test.results).map(([metric, value]) => {
                const progressValue = getProgressValue(value, test.testType)
                const isHigh = progressValue > 80

                return (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{metric.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className={`font-mono ${isHigh ? "text-warning" : "text-muted-foreground"}`}>
                        {value}
                        {metric.includes("moisture")
                          ? "%"
                          : metric.includes("temp")
                            ? "°C"
                            : metric.includes("ppm") ||
                                metric.includes("pesticide") ||
                                metric.includes("lead") ||
                                metric.includes("cadmium") ||
                                metric.includes("mercury") ||
                                metric.includes("arsenic") ||
                                metric.includes("chromium")
                              ? "ppm"
                              : metric.includes("purity")
                                ? "%"
                                : ""}
                      </span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                )
              })}
            </div>

            {test.standards.issues.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-1">Issues Found:</p>
                <ul className="text-sm text-destructive space-y-1">
                  {test.standards.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {test.standards.warnings.length > 0 && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning mb-1">Warnings:</p>
                <ul className="text-sm text-warning space-y-1">
                  {test.standards.warnings.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {index < tests.length - 1 && <div className="border-t pt-4" />}
          </div>
        ))}

        {tests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No quality tests available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
