"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Maximize2, Minimize2 } from "lucide-react"

interface LocationPoint {
  id: string
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  type: "farm" | "lab" | "manufacturer" | "distributor" | "retail"
  actor: string
  date: string
  details?: string
}

interface SupplyChainMapProps {
  locations: LocationPoint[]
  title?: string
  height?: string
}

export function SupplyChainMap({ locations, title = "Supply Chain Journey", height = "400px" }: SupplyChainMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Mock map implementation since we can't use external libraries
  // In production, this would integrate with Leaflet or Google Maps
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getLocationColor = (type: LocationPoint["type"]) => {
    switch (type) {
      case "farm":
        return "bg-green-500"
      case "lab":
        return "bg-purple-500"
      case "manufacturer":
        return "bg-blue-500"
      case "distributor":
        return "bg-orange-500"
      case "retail":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLocationIcon = (type: LocationPoint["type"]) => {
    switch (type) {
      case "farm":
        return "🌱"
      case "lab":
        return "🔬"
      case "manufacturer":
        return "🏭"
      case "distributor":
        return "📦"
      case "retail":
        return "🏪"
      default:
        return "📍"
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const centerCoordinates =
    locations.length > 0
      ? {
          lat: locations.reduce((sum, loc) => sum + loc.coordinates.latitude, 0) / locations.length,
          lng: locations.reduce((sum, loc) => sum + loc.coordinates.longitude, 0) / locations.length,
        }
      : { lat: 20.5937, lng: 78.9629 } // Center of India

  return (
    <Card className={isFullscreen ? "fixed inset-4 z-50" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>Interactive map showing the geographic journey</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Container */}
          <div
            ref={mapRef}
            className="relative border rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-blue-50"
            style={{ height: isFullscreen ? "calc(100vh - 200px)" : height }}
          >
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 p-4">
                {/* Mock Map Background */}
                <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-orange-50 rounded-lg relative overflow-hidden">
                  {/* Grid lines to simulate map */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute w-full border-t border-gray-300"
                        style={{ top: `${i * 10}%` }}
                      />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute h-full border-l border-gray-300"
                        style={{ left: `${i * 10}%` }}
                      />
                    ))}
                  </div>

                  {/* Location Points */}
                  {locations.map((location, index) => {
                    // Calculate position based on coordinates (mock positioning)
                    const x = ((location.coordinates.longitude - 68) / (97 - 68)) * 100
                    const y = ((37 - location.coordinates.latitude) / (37 - 8)) * 100

                    return (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{
                          left: `${Math.max(5, Math.min(95, x))}%`,
                          top: `${Math.max(5, Math.min(95, y))}%`,
                        }}
                        onClick={() => setSelectedLocation(location)}
                      >
                        {/* Connection Line to Previous Point */}
                        {index > 0 && (
                          <div className="absolute w-px h-8 bg-primary/50 -top-8 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                        )}

                        {/* Location Marker */}
                        <div
                          className={`w-8 h-8 rounded-full ${getLocationColor(location.type)} flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform`}
                        >
                          {index + 1}
                        </div>

                        {/* Location Label */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                          <div className="font-medium">{location.name}</div>
                          <div className="text-muted-foreground">{location.actor}</div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Path Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {locations.map((location, index) => {
                      if (index === 0) return null

                      const prevLocation = locations[index - 1]
                      const x1 = ((prevLocation.coordinates.longitude - 68) / (97 - 68)) * 100
                      const y1 = ((37 - prevLocation.coordinates.latitude) / (37 - 8)) * 100
                      const x2 = ((location.coordinates.longitude - 68) / (97 - 68)) * 100
                      const y2 = ((37 - location.coordinates.latitude) / (37 - 8)) * 100

                      return (
                        <line
                          key={`line-${index}`}
                          x1={`${Math.max(5, Math.min(95, x1))}%`}
                          y1={`${Math.max(5, Math.min(95, y1))}%`}
                          x2={`${Math.max(5, Math.min(95, x2))}%`}
                          y2={`${Math.max(5, Math.min(95, y2))}%`}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          className="text-primary/60"
                        />
                      )
                    })}
                  </svg>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          {selectedLocation && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-lg">{getLocationIcon(selectedLocation.type)}</span>
                    {selectedLocation.name}
                  </h4>
                  <Badge variant="outline" className={getLocationColor(selectedLocation.type).replace("bg-", "text-")}>
                    {selectedLocation.type}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actor:</span>
                    <span>{selectedLocation.actor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(selectedLocation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-mono text-xs">
                      {selectedLocation.coordinates.latitude.toFixed(4)},{" "}
                      {selectedLocation.coordinates.longitude.toFixed(4)}
                    </span>
                  </div>
                  {selectedLocation.details && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Details:</span>
                      <p className="text-sm mt-1">{selectedLocation.details}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Legend */}
          <div className="flex flex-wrap gap-2">
            {[
              { type: "farm" as const, label: "Farm" },
              { type: "lab" as const, label: "Laboratory" },
              { type: "manufacturer" as const, label: "Manufacturer" },
              { type: "distributor" as const, label: "Distributor" },
              { type: "retail" as const, label: "Retail" },
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${getLocationColor(type)}`}></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
