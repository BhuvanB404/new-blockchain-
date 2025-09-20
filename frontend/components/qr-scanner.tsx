"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Search, X } from "lucide-react"

interface QRScannerProps {
  onScan: (medicineId: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [manualId, setManualId] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualId.trim()) {
      onScan(manualId.trim())
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Verify Medicine
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">QR Scanner will be available in production</p>
          <Button variant="outline" onClick={() => setIsScanning(!isScanning)} disabled>
            {isScanning ? "Stop Scanning" : "Start QR Scan"}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medicineId">Medicine ID</Label>
            <Input
              id="medicineId"
              placeholder="Enter medicine ID (e.g., MED-ASHWA-001)"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Verify Medicine
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
