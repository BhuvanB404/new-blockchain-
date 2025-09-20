"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, MapPin, Calendar, Users, Award } from "lucide-react"

interface SustainabilityData {
  averageSustainabilityScore: number
  farmsInvolved: string[]
  locations: string[]
  harvestDates: string[]
  conservationStatus?: string
  vulnerabilityStatus?: string
}

interface SustainabilityScoreProps {
  data: SustainabilityData
  title?: string
}

export function SustainabilityScore({ data, title = "Sustainability Assessment" }: SustainabilityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 70) return "secondary"
    return "destructive"
  }

  const getConservationColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "moderate":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
        <CardDescription>Environmental impact and sustainability metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(data.averageSustainabilityScore)}`}>
              {data.averageSustainabilityScore}/100
            </div>
            <Badge variant={getScoreBadgeVariant(data.averageSustainabilityScore)} className="text-lg px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              {getScoreLabel(data.averageSustainabilityScore)}
            </Badge>
          </div>
          <Progress value={data.averageSustainabilityScore} className="h-3" />
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Supply Chain Participants
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Farms Involved</span>
                <Badge variant="outline">{data.farmsInvolved.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Harvest Batches</span>
                <Badge variant="outline">{data.harvestDates.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Geographic Regions</span>
                <Badge variant="outline">{data.locations.length}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Environmental Status
            </h4>
            <div className="space-y-3">
              {data.conservationStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conservation Status</span>
                  <Badge variant="outline" className={getConservationColor(data.conservationStatus)}>
                    {data.conservationStatus}
                  </Badge>
                </div>
              )}
              {data.vulnerabilityStatus && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vulnerability Status</span>
                  <Badge variant="outline" className={getConservationColor(data.vulnerabilityStatus)}>
                    {data.vulnerabilityStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Source Locations
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.locations.map((location, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {location}
              </Badge>
            ))}
          </div>
        </div>

        {/* Harvest Timeline */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Harvest Timeline
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.harvestDates.map((date, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {new Date(date).toLocaleDateString()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h5 className="font-medium mb-3">Score Factors</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Seasonal Compliance</span>
                <span className="text-green-600 font-medium">✓ Passed</span>
              </div>
              <div className="flex justify-between">
                <span>Geographic Compliance</span>
                <span className="text-green-600 font-medium">✓ Passed</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Conservation Impact</span>
                <span className="text-green-600 font-medium">Low Risk</span>
              </div>
              <div className="flex justify-between">
                <span>Biodiversity Impact</span>
                <span className="text-green-600 font-medium">Positive</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
