"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation, Clock, Truck } from "lucide-react"

interface LocationUpdate {
  id: string
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  timestamp: string
  actor: string
  status: "in_transit" | "arrived" | "departed" | "delayed"
  estimatedArrival?: string
  distance?: number
}

interface LocationTrackerProps {
  updates: LocationUpdate[]
  title?: string
  currentLocation?: LocationUpdate
}

export function LocationTracker({
  updates,
  title = "Real-time Location Tracking",
  currentLocation,
}: LocationTrackerProps) {
  const getStatusColor = (status: LocationUpdate["status"]) => {
    switch (status) {
      case "arrived":
        return "bg-green-500"
      case "in_transit":
        return "bg-blue-500"
      case "departed":
        return "bg-yellow-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: LocationUpdate["status"]) => {
    switch (status) {
      case "arrived":
        return "Arrived"
      case "in_transit":
        return "In Transit"
      case "departed":
        return "Departed"
      case "delayed":
        return "Delayed"
      default:
        return "Unknown"
    }
  }

  const calculateProgress = () => {
    if (updates.length === 0) return 0
    const completedStops = updates.filter(
      (update) => update.status === "arrived" || update.status === "departed",
    ).length
    return (completedStops / updates.length) * 100
  }

  const progress = calculateProgress()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Track the real-time movement of batches through the supply chain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location */}
        {currentLocation && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Current Location
              </h4>
              <Badge variant="default">{getStatusLabel(currentLocation.status)}</Badge>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{currentLocation.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actor:</span>
                <span>{currentLocation.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Update:</span>
                <span>{new Date(currentLocation.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coordinates:</span>
                <span className="font-mono text-xs">
                  {currentLocation.coordinates.latitude.toFixed(4)}, {currentLocation.coordinates.longitude.toFixed(4)}
                </span>
              </div>
              {currentLocation.estimatedArrival && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETA:</span>
                  <span>{new Date(currentLocation.estimatedArrival).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Journey Progress</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Location History */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Location History
          </h4>

          <div className="space-y-3">
            {updates.map((update, index) => (
              <div key={update.id} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(update.status)}`}></div>
                  {index < updates.length - 1 && <div className="w-px h-8 bg-border mt-2"></div>}
                </div>

                {/* Update Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium">{update.location}</h5>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(update.status).replace("bg-", "text-")}`}
                    >
                      {getStatusLabel(update.status)}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Actor:</span>
                      <span>{update.actor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{new Date(update.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span className="font-mono text-xs">
                        {update.coordinates.latitude.toFixed(4)}, {update.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                    {update.distance && (
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{update.distance} km</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{updates.length}</div>
            <div className="text-xs text-muted-foreground">Total Stops</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {updates.filter((u) => u.status === "arrived").length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {updates.filter((u) => u.status === "in_transit").length}
            </div>
            <div className="text-xs text-muted-foreground">In Transit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {updates.filter((u) => u.status === "delayed").length}
            </div>
            <div className="text-xs text-muted-foreground">Delayed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
