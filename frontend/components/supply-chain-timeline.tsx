"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  User,
  FlaskConical,
  Package,
  Factory,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useState } from "react"

interface TimelineEvent {
  id: string
  event: string
  date: string
  location: string
  actor: string
  status?: "PASSED" | "FAILED" | "PENDING"
  details: string
  results?: Record<string, any>
  certification?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

interface SupplyChainTimelineProps {
  events: TimelineEvent[]
  title?: string
  description?: string
}

export function SupplyChainTimeline({
  events,
  title = "Supply Chain Timeline",
  description = "Track the complete journey",
}: SupplyChainTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.event.toLowerCase()) {
      case "harvest":
        return <Package className="h-4 w-4" />
      case "quality test":
        return <FlaskConical className="h-4 w-4" />
      case "manufacturing":
        return <Factory className="h-4 w-4" />
      case "transfer":
        return <Truck className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PASSED":
        return "bg-success"
      case "FAILED":
        return "bg-destructive"
      case "PENDING":
        return "bg-warning"
      default:
        return "bg-primary"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "PASSED":
        return <CheckCircle className="h-3 w-3" />
      case "FAILED":
        return <AlertTriangle className="h-3 w-3" />
      case "PENDING":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${getStatusColor(event.status)} flex items-center justify-center text-white`}
                >
                  {getEventIcon(event)}
                </div>
                {index < events.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{event.event}</h4>
                    {event.status && (
                      <Badge
                        variant={
                          event.status === "PASSED"
                            ? "default"
                            : event.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {getStatusIcon(event.status)}
                        {event.status}
                      </Badge>
                    )}
                  </div>
                  {(event.results || event.certification) && (
                    <Button variant="ghost" size="sm" onClick={() => toggleEventExpansion(event.id)}>
                      {expandedEvents.has(event.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">{event.details}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {event.actor}
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedEvents.has(event.id) && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                    {event.certification && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Certification</p>
                        <p className="text-sm font-mono">{event.certification}</p>
                      </div>
                    )}
                    {event.results && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Test Results</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(event.results).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                              <span className="font-medium">
                                {value}
                                {typeof value === "number" && key.includes("ppm")
                                  ? "ppm"
                                  : typeof value === "number" && key.includes("temp")
                                    ? "°C"
                                    : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.coordinates && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">GPS Coordinates</p>
                        <p className="text-sm font-mono">
                          {event.coordinates.latitude.toFixed(4)}, {event.coordinates.longitude.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
