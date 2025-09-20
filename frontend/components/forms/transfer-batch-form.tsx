"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, User, FileText } from "lucide-react"
import { transferBatch } from "@/lib/api"

interface TransferBatchFormProps {
  batchId?: string
  onSuccess?: (transferData: any) => void
  onCancel?: () => void
}

export function TransferBatchForm({ batchId, onSuccess, onCancel }: TransferBatchFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: batchId || "",
    toEntityId: "",
    transferReason: "",
  })

  const entityTypes = [
    { category: "Manufacturers", entities: ["Manufacturer01", "Manufacturer02", "Manufacturer03"] },
    { category: "Quality Labs", entities: ["QualityLab01", "QualityLab02", "PesticideLab03"] },
    { category: "Distributors", entities: ["Distributor01", "Distributor02"] },
    { category: "Retailers", entities: ["Retailer01", "Retailer02"] },
  ]

  const transferReasons = [
    "Sale to manufacturer for processing",
    "Transfer to quality lab for testing",
    "Distribution to retail partner",
    "Return for quality issues",
    "Transfer for further processing",
    "Shipment to distribution center",
    "Quality assurance testing",
    "Regulatory compliance check",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const result = await transferBatch(user.userId, formData.batchId, formData.toEntityId, formData.transferReason)
      onSuccess?.(result)
    } catch (error) {
      console.error("Failed to transfer batch:", error)
      // Handle error - could show toast notification
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Transfer Batch
        </CardTitle>
        <CardDescription>Transfer ownership of a herb batch to another entity in the supply chain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Batch Information</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                placeholder="BATCH-ASH-001"
                required
              />
            </div>
          </div>

          {/* Transfer Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Transfer Details</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toEntityId">Transfer To</Label>
              <Select value={formData.toEntityId} onValueChange={(value) => handleInputChange("toEntityId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient entity" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((category) => (
                    <div key={category.category}>
                      <div className="px-2 py-1 text-sm font-medium text-muted-foreground">{category.category}</div>
                      {category.entities.map((entity) => (
                        <SelectItem key={entity} value={entity}>
                          {entity}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferReason">Transfer Reason</Label>
              <Select
                value={formData.transferReason}
                onValueChange={(value) => handleInputChange("transferReason", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transfer reason" />
                </SelectTrigger>
                <SelectContent>
                  {transferReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom reason input */}
            {formData.transferReason && !transferReasons.includes(formData.transferReason) && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Custom Transfer Reason</Label>
                <Textarea
                  id="customReason"
                  value={formData.transferReason}
                  onChange={(e) => handleInputChange("transferReason", e.target.value)}
                  placeholder="Enter custom transfer reason..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Transfer Summary */}
          {formData.batchId && formData.toEntityId && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transfer Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <Badge variant="outline">{user?.userId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <Badge variant="outline">{formData.toEntityId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch:</span>
                  <Badge variant="outline">{formData.batchId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="text-right text-xs max-w-48 truncate">{formData.transferReason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Processing Transfer..." : "Transfer Batch"}
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
