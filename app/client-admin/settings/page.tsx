"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Settings</h1>
        <p className="text-[#6B7280] mt-2">Manage your organization settings</p>
      </div>

      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Organization Details</CardTitle>
          <CardDescription className="text-[#6B7280]">Basic information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-[#1F2937]">
              Organization Name
            </Label>
            <Input id="org-name" defaultValue="Acme Corp" className="border-[#E5E7EB]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-[#1F2937]">
              Admin Email
            </Label>
            <Input id="admin-email" type="email" defaultValue="admin@acme.com" className="border-[#E5E7EB]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seats" className="text-[#1F2937]">
              Total Seats
            </Label>
            <Input id="seats" type="number" defaultValue="100" disabled className="border-[#E5E7EB] bg-[#F9FAFB]" />
            <p className="text-xs text-[#6B7280]">Contact your AIRX representative to adjust seat count</p>
          </div>
          <Button onClick={handleSave} className="bg-[#0D9488] hover:bg-[#0F766E] text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
