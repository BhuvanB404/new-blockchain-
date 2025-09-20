"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Target, Search } from "lucide-react"

interface GPSCoordinates {
  latitude: number
  longitude: number
}

interface GPSPickerProps {
  value?: GPSCoordinates
  onChange?: (coordinates: GPSCoordinates) => void
  title?: string
  showCurrentLocation?: boolean
}

export function GPSPicker({
  value = { latitude: 0, longitude: 0 },
  onChange,
  title = "Select GPS Location",
  showCurrentLocation = true,
}: GPSPickerProps) {
  const [coordinates, setCoordinates] = useState<GPSCoordinates>(value)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Common locations in India for quick selection
  const commonLocations = [
    { name: "Wayanad, Kerala", lat: 11.6854, lng: 76.132 },
    { name: "Mysuru, Karnataka", lat: 12.2958, lng: 76.6394 },
    { name: "Haridwar, Uttarakhand", lat: 29.9457, lng: 78.1642 },
    { name: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Mumbai, Maharashtra", lat: 19.076, lng: 72.8777 },
    { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
    { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  ]

  useEffect(() => {
    setCoordinates(value)
  }, [value])

  const handleCoordinateChange = (field: "latitude" | "longitude", val: string) => {
    const numValue = Number.parseFloat(val) || 0
    const newCoordinates = { ...coordinates, [field]: numValue }
    setCoordinates(newCoordinates)
    onChange?.(newCoordinates)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setCoordinates(newCoordinates)
        onChange?.(newCoordinates)
        setIsGettingLocation(false)
      },
      (error) => {
        setLocationError("Unable to retrieve your location")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const selectCommonLocation = (location: (typeof commonLocations)[0]) => {
    const newCoordinates = { latitude: location.lat, longitude: location.lng }
    setCoordinates(newCoordinates)
    onChange?.(newCoordinates)
  }

  const validateCoordinates = (coords: GPSCoordinates) => {
    return coords.latitude >= -90 && coords.latitude <= 90 && coords.longitude >= -180 && coords.longitude <= 180
  }

  const isValidCoordinates = validateCoordinates(coordinates)

  const filteredLocations = commonLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Enter GPS coordinates manually or select from common locations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Coordinate Input */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={coordinates.latitude || ""}
                onChange={(e) => handleCoordinateChange("latitude", e.target.value)}
                placeholder="11.6854"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={coordinates.longitude || ""}
                onChange={(e) => handleCoordinateChange("longitude", e.target.value)}
                placeholder="76.1320"
              />
            </div>
          </div>

          {/* Coordinate Validation */}
          <div className="flex items-center gap-2">
            {isValidCoordinates ? (
              <Badge variant="default" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Valid Coordinates
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Invalid Coordinates
              </Badge>
            )}
            {coordinates.latitude !== 0 && coordinates.longitude !== 0 && (
              <span className="text-xs text-muted-foreground font-mono">
                {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
              </span>
            )}
          </div>
        </div>

        {/* Current Location */}
        {showCurrentLocation && (
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full bg-transparent"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isGettingLocation ? "Getting Location..." : "Use Current Location"}
            </Button>
            {locationError && <p className="text-sm text-destructive">{locationError}</p>}
          </div>
        )}

        {/* Common Locations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Quick Select Locations</Label>
          </div>

          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />

          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {filteredLocations.map((location) => (
              <Button
                key={location.name}
                variant="ghost"
                className="justify-start h-auto p-3 text-left"
                onClick={() => selectCommonLocation(location)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Mini Map Preview */}
        {isValidCoordinates && coordinates.latitude !== 0 && coordinates.longitude !== 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Location Preview</Label>
            <div className="h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-mono">
                {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
