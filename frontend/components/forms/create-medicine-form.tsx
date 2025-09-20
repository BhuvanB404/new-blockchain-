"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package, Plus, X } from "lucide-react"
import { createMedicine } from "@/lib/api"

interface CreateMedicineFormProps {
  onSuccess?: (medicineData: any) => void
  onCancel?: () => void
}

export function CreateMedicineForm({ onSuccess, onCancel }: CreateMedicineFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    medicineId: "",
    medicineName: "",
    batchIds: [] as string[],
    manufacturingDate: "",
    expiryDate: "",
    description: "",
    dosage: "",
    instructions: "",
  })
  const [newBatchId, setNewBatchId] = useState("")

  const commonMedicines = [
    "Ashwagandha Capsules",
    "Turmeric Tablets",
    "Brahmi Syrup",
    "Neem Oil",
    "Tulsi Drops",
    "Amla Juice",
    "Ginger Powder",
    "Cardamom Extract",
    "Cinnamon Oil",
    "Fenugreek Capsules",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addBatchId = () => {
    if (newBatchId.trim() && !formData.batchIds.includes(newBatchId.trim())) {
      setFormData((prev) => ({
        ...prev,
        batchIds: [...prev.batchIds, newBatchId.trim()],
      }))
      setNewBatchId("")
    }
  }

  const removeBatchId = (batchId: string) => {
    setFormData((prev) => ({
      ...prev,
      batchIds: prev.batchIds.filter((id) => id !== batchId),
    }))
  }

  const generateMedicineId = () => {
    const nameCode = formData.medicineName
      .split(" ")
      .map((word) => word.substring(0, 3))
      .join("")
      .toUpperCase()
    const timestamp = Date.now().toString().slice(-3)
    const medicineId = `MED-${nameCode}-${timestamp}`
    setFormData((prev) => ({ ...prev, medicineId }))
  }

  const calculateExpiryDate = () => {
    if (formData.manufacturingDate) {
      const mfgDate = new Date(formData.manufacturingDate)
      const expiryDate = new Date(mfgDate)
      expiryDate.setFullYear(expiryDate.getFullYear() + 2) // Default 2 years shelf life
      setFormData((prev) => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split("T")[0],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const medicineData = {
        medicineId: formData.medicineId,
        medicineName: formData.medicineName,
        batchIds: formData.batchIds,
        manufacturingDate: formData.manufacturingDate,
        expiryDate: formData.expiryDate,
      }

      const result = await createMedicine(user.userId, medicineData)
      onSuccess?.(result)
    } catch (error) {
      console.error("Failed to create medicine:", error)
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
          Create New Medicine
        </CardTitle>
        <CardDescription>Create a new Ayurvedic medicine using processed herb batches</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine ID */}
          <div className="space-y-2">
            <Label htmlFor="medicineId">Medicine ID</Label>
            <div className="flex gap-2">
              <Input
                id="medicineId"
                value={formData.medicineId}
                onChange={(e) => handleInputChange("medicineId", e.target.value)}
                placeholder="MED-ASHCAP-001"
                required
              />
              <Button type="button" variant="outline" onClick={generateMedicineId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Medicine Name */}
          <div className="space-y-2">
            <Label htmlFor="medicineName">Medicine Name</Label>
            <Input
              id="medicineName"
              value={formData.medicineName}
              onChange={(e) => handleInputChange("medicineName", e.target.value)}
              placeholder="Ashwagandha Capsules"
              list="common-medicines"
              required
            />
            <datalist id="common-medicines">
              {commonMedicines.map((medicine) => (
                <option key={medicine} value={medicine} />
              ))}
            </datalist>
          </div>

          {/* Batch IDs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Ingredient Batches</Label>
            </div>

            <div className="flex gap-2">
              <Input
                value={newBatchId}
                onChange={(e) => setNewBatchId(e.target.value)}
                placeholder="Enter batch ID (e.g., BATCH-ASH-001)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBatchId())}
              />
              <Button type="button" variant="outline" onClick={addBatchId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.batchIds.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Selected Batches:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.batchIds.map((batchId) => (
                    <Badge key={batchId} variant="secondary" className="flex items-center gap-1">
                      {batchId}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeBatchId(batchId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Manufacturing Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
              <Input
                id="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => handleInputChange("manufacturingDate", e.target.value)}
                onBlur={calculateExpiryDate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the medicine and its benefits..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange("dosage", e.target.value)}
                  placeholder="1-2 capsules daily"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Input
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange("instructions", e.target.value)}
                  placeholder="Take with warm water after meals"
                />
              </div>
            </div>
          </div>

          {/* Medicine Summary */}
          {formData.medicineId && formData.medicineName && formData.batchIds.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Medicine Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medicine ID:</span>
                  <Badge variant="outline">{formData.medicineId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.medicineName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batches Used:</span>
                  <Badge variant="outline">{formData.batchIds.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <Badge variant="outline">{user?.userId}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading || formData.batchIds.length === 0}>
              {loading ? "Creating Medicine..." : "Create Medicine"}
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
