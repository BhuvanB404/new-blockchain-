"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GPSPicker } from "@/components/maps/gps-picker"
import { MapPin, Thermometer, Leaf, Plus } from "lucide-react"
import { createHerbBatch } from "@/lib/api"

interface CreateBatchFormProps {
  onSuccess?: (batchData: any) => void
  onCancel?: () => void
}

export function CreateBatchForm({ onSuccess, onCancel }: CreateBatchFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showGPSPicker, setShowGPSPicker] = useState(false)
  const [formData, setFormData] = useState({
    batchId: "",
    herbName: "",
    harvestDate: "",
    farmLocation: "",
    quantity: "",
    gpsCoordinates: {
      latitude: 0,
      longitude: 0,
    },
    collectorId: user?.userId || "",
    environmentalData: {
      temperature: "",
      humidity: "",
      soilType: "",
    },
  })

  const herbOptions = [
    "Ashwagandha",
    "Turmeric",
    "Brahmi",
    "Neem",
    "Tulsi",
    "Amla",
    "Ginger",
    "Cardamom",
    "Cinnamon",
    "Fenugreek",
  ]

  const soilTypes = ["Red laterite soil", "Black cotton soil", "Alluvial soil", "Sandy soil", "Clay soil", "Loamy soil"]

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleGPSChange = (coordinates: { latitude: number; longitude: number }) => {
    setFormData((prev) => ({
      ...prev,
      gpsCoordinates: coordinates,
    }))
  }

  const generateBatchId = () => {
    const herbCode = formData.herbName.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const batchId = `BATCH-${herbCode}-${timestamp}`
    setFormData((prev) => ({ ...prev, batchId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const batchData = {
        ...formData,
        gpsCoordinates: {
          latitude: formData.gpsCoordinates.latitude,
          longitude: formData.gpsCoordinates.longitude,
        },
      }

      const result = await createHerbBatch(user.userId, batchData)
      onSuccess?.(result)
    } catch (error) {
      console.error("Failed to create batch:", error)
      // Handle error - could show toast notification
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Create New Herb Batch
        </CardTitle>
        <CardDescription>
          Register a new herb batch on the blockchain with complete traceability information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch ID */}
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <div className="flex gap-2">
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                placeholder="BATCH-ASH-001"
                required
              />
              <Button type="button" variant="outline" onClick={generateBatchId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Herb Selection */}
          <div className="space-y-2">
            <Label htmlFor="herbName">Herb Name</Label>
            <Select value={formData.herbName} onValueChange={(value) => handleInputChange("herbName", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select herb type" />
              </SelectTrigger>
              <SelectContent>
                {herbOptions.map((herb) => (
                  <SelectItem key={herb} value={herb}>
                    {herb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="250kg"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Location Information</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmLocation">Farm Location</Label>
              <Input
                id="farmLocation"
                value={formData.farmLocation}
                onChange={(e) => handleInputChange("farmLocation", e.target.value)}
                placeholder="Wayanad, Kerala"
                required
              />
            </div>

            {/* GPS Coordinates Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">GPS Coordinates</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowGPSPicker(!showGPSPicker)}>
                  {showGPSPicker ? "Hide GPS Picker" : "Show GPS Picker"}
                </Button>
              </div>

              {showGPSPicker ? (
                <GPSPicker value={formData.gpsCoordinates} onChange={handleGPSChange} title="Select Farm Location" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.gpsCoordinates.latitude || ""}
                      onChange={(e) =>
                        handleGPSChange({
                          ...formData.gpsCoordinates,
                          latitude: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="11.6854"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.gpsCoordinates.longitude || ""}
                      onChange={(e) =>
                        handleGPSChange({
                          ...formData.gpsCoordinates,
                          longitude: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="76.1320"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Environmental Conditions</Label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  value={formData.environmentalData.temperature}
                  onChange={(e) => handleInputChange("environmentalData.temperature", e.target.value)}
                  placeholder="28°C"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity</Label>
                <Input
                  id="humidity"
                  value={formData.environmentalData.humidity}
                  onChange={(e) => handleInputChange("environmentalData.humidity", e.target.value)}
                  placeholder="75%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select
                  value={formData.environmentalData.soilType}
                  onValueChange={(value) => handleInputChange("environmentalData.soilType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Collector Information */}
          <div className="space-y-2">
            <Label htmlFor="collectorId">Collector ID</Label>
            <Input
              id="collectorId"
              value={formData.collectorId}
              onChange={(e) => handleInputChange("collectorId", e.target.value)}
              placeholder="Farmer01"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating Batch..." : "Create Batch"}
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
