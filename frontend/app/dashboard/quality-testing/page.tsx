import DashboardLayout from "@/components/dashboard-layout"
import TestSuiteComponent from "@/components/quality/test-suite"
import TestEquipmentComponent from "@/components/quality/test-equipment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QualityTestingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Testing</h1>
          <p className="text-muted-foreground">
            Comprehensive quality assurance and testing management for Ayurveda medicines
          </p>
        </div>

        <Tabs defaultValue="test-suites" className="space-y-6">
          <TabsList>
            <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="test-suites">
            <TestSuiteComponent />
          </TabsContent>

          <TabsContent value="equipment">
            <TestEquipmentComponent />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
