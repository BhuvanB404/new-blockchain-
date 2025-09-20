"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Package, CheckCircle, AlertTriangle, Clock, Leaf } from "lucide-react"

interface BatchAnalyticsData {
  totalBatches: number
  passedTests: number
  failedTests: number
  pendingTests: number
  averageQualityScore: number
  topHerbs: Array<{
    name: string
    count: number
    passRate: number
  }>
  monthlyTrends: Array<{
    month: string
    batches: number
    passRate: number
  }>
}

interface BatchAnalyticsProps {
  data: BatchAnalyticsData
  title?: string
}

export function BatchAnalytics({ data, title = "Batch Analytics" }: BatchAnalyticsProps) {
  const passRate = data.totalBatches > 0 ? (data.passedTests / data.totalBatches) * 100 : 0
  const failRate = data.totalBatches > 0 ? (data.failedTests / data.totalBatches) * 100 : 0

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPassRateBadge = (rate: number) => {
    if (rate >= 90) return "default"
    if (rate >= 70) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{data.totalBatches}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passed Tests</p>
                <p className="text-2xl font-bold text-green-600">{data.passedTests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Tests</p>
                <p className="text-2xl font-bold text-red-600">{data.failedTests}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Tests</p>
                <p className="text-2xl font-bold text-yellow-600">{data.pendingTests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quality Overview
          </CardTitle>
          <CardDescription>Overall quality metrics and pass rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getPassRateColor(passRate)}`}>{passRate.toFixed(1)}%</div>
                <Badge variant={getPassRateBadge(passRate)} className="mt-2">
                  Overall Pass Rate
                </Badge>
              </div>
              <Progress value={passRate} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pass Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{passRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fail Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{failRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Quality Score</span>
                <span className="text-sm font-medium">{data.averageQualityScore}/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Herbs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Top Performing Herbs
          </CardTitle>
          <CardDescription>Most frequently processed herbs and their quality rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topHerbs.map((herb, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{herb.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {herb.count} batches
                      </Badge>
                      <Badge
                        variant={herb.passRate >= 90 ? "default" : herb.passRate >= 70 ? "secondary" : "destructive"}
                      >
                        {herb.passRate.toFixed(0)}% pass rate
                      </Badge>
                    </div>
                  </div>
                  <Progress value={herb.passRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trends
          </CardTitle>
          <CardDescription>Batch processing and quality trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{trend.month}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {trend.batches} batches
                      </Badge>
                      <div className="flex items-center gap-1">
                        {trend.passRate >= 90 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${trend.passRate >= 90 ? "text-green-600" : "text-red-600"}`}
                        >
                          {trend.passRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress value={trend.passRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
