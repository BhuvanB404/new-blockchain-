"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SupplyChainTimeline } from "@/components/supply-chain-timeline"
import { QualityMetricsChart } from "@/components/quality-metrics-chart"
import { SustainabilityScore } from "@/components/sustainability-score"
import { SupplyChainMap } from "@/components/maps/supply-chain-map"
import { ArrowLeft, Calendar, Leaf, Shield, AlertTriangle, Factory } from "lucide-react"
import { getConsumerInfo } from "@/lib/api"

export default function VerifyMedicinePage() {
  const params = useParams()
  const router = useRouter()
  const medicineId = params.medicineId as string
  const [medicineData, setMedicineData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (medicineId) {
      loadMedicineData()
    }
  }, [medicineId])

  const loadMedicineData = async () => {
    try {
      // Use a default regulator ID for consumer queries
      const data = await getConsumerInfo("Regulator01", medicineId)
      setMedicineData(data)
    } catch (error) {
      setError("Medicine not found or invalid ID")
      console.error("Failed to load medicine data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !medicineData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Medicine Not Found</h2>
              <p className="text-muted-foreground">
                The medicine ID "{medicineId}" could not be found in our blockchain records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { medicine, ingredients, supplyChain, certificates, sustainability } = medicineData

  // Transform supply chain data for timeline component
  const timelineEvents = supplyChain.map((event: any, index: number) => ({
    id: `event-${index}`,
    event: event.event,
    date: event.date,
    location: event.location,
    actor: event.actor,
    status: event.status,
    details: event.details,
    results: event.results,
    certification: event.certification,
    coordinates: event.coordinates,
  }))

  // Transform supply chain data for map component
  const mapLocations = supplyChain
    .filter((event: any) => event.coordinates)
    .map((event: any, index: number) => ({
      id: `location-${index}`,
      name: event.location,
      coordinates: event.coordinates,
      type:
        event.event.toLowerCase() === "harvest"
          ? ("farm" as const)
          : event.event.toLowerCase().includes("test")
            ? ("lab" as const)
            : event.event.toLowerCase() === "manufacturing"
              ? ("manufacturer" as const)
              : ("distributor" as const),
      actor: event.actor,
      date: event.date,
      details: event.details,
    }))

  // Get quality tests from ingredients
  const qualityTests = ingredients[0]?.qualityTests || []

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Medicine Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-primary" />
                  {medicine.name}
                </CardTitle>
                <CardDescription>Medicine ID: {medicine.id}</CardDescription>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{medicine.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                  <p className="font-medium">{medicine.manufacturingDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{medicine.expiryDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Map */}
        {mapLocations.length > 0 && (
          <SupplyChainMap locations={mapLocations} title="Geographic Journey" height="500px" />
        )}

        {/* Supply Chain Timeline */}
        <SupplyChainTimeline
          events={timelineEvents}
          title="Supply Chain Journey"
          description="Complete traceability from farm to consumer"
        />

        {/* Quality Tests and Sustainability */}
        <div className="grid lg:grid-cols-2 gap-6">
          <QualityMetricsChart tests={qualityTests} />
          <SustainabilityScore data={sustainability} />
        </div>

        {/* Ingredients Details */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Details</CardTitle>
            <CardDescription>Detailed information about herb batches used</CardDescription>
          </CardHeader>
          <CardContent>
            {ingredients.map((ingredient: any, index: number) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{ingredient.herbName}</h4>
                  <Badge variant="outline" className="text-sm">
                    {ingredient.quantity}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch ID:</span>
                      <span className="font-mono">{ingredient.batchId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Farm Location:</span>
                      <span>{ingredient.farmLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Farmer ID:</span>
                      <span className="font-mono">{ingredient.farmerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Harvest Date:</span>
                      <span>{ingredient.harvestDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPS Coordinates:</span>
                      <span className="font-mono text-xs">
                        {ingredient.gpsCoordinates.latitude.toFixed(4)},{" "}
                        {ingredient.gpsCoordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Soil Type:</span>
                      <span>{ingredient.environmentalData.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span>{ingredient.environmentalData.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span>{ingredient.environmentalData.humidity}</span>
                    </div>
                  </div>
                </div>

                {index < ingredients.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
