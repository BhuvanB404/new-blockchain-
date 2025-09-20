"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateBatchForm } from "@/components/forms/create-batch-form"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateBatchPage() {
  const router = useRouter()
  const [success, setSuccess] = useState<any>(null)

  const handleSuccess = (batchData: any) => {
    setSuccess(batchData)
  }

  const handleViewBatch = () => {
    router.push(`/dashboard/batches`)
  }

  const handleCreateAnother = () => {
    setSuccess(null)
  }

  if (success) {
    return (
      <DashboardLayout>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
            <h2 className="text-2xl font-bold mb-2">Batch Created Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your herb batch has been registered on the blockchain with ID: <strong>{success.batchId}</strong>
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg text-left">
                <h4 className="font-medium mb-2">Batch Details:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Herb:</span>
                    <span>{success.herbName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{success.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{success.farmLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustainability Score:</span>
                    <span>{success.certifications?.sustainabilityScore || "N/A"}/100</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleViewBatch} className="flex-1">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View My Batches
                </Button>
                <Button variant="outline" onClick={handleCreateAnother} className="flex-1 bg-transparent">
                  Create Another Batch
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <CreateBatchForm onSuccess={handleSuccess} />
    </DashboardLayout>
  )
}
