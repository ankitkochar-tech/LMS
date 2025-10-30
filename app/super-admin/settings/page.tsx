"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        <p className="text-[#6B7280] mt-2">Configure platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Platform Information</CardTitle>
              <CardDescription className="text-[#6B7280]">Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name" className="text-[#1F2937]">
                  Platform Name
                </Label>
                <Input id="platform-name" defaultValue="AIRX — AI Risk Experts" className="border-[#E5E7EB]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email" className="text-[#1F2937]">
                  Support Email
                </Label>
                <Input id="support-email" type="email" defaultValue="support@airx.app" className="border-[#E5E7EB]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-[#1F2937]">
                  Timezone
                </Label>
                <Input id="timezone" defaultValue="UTC (Coordinated Universal Time)" className="border-[#E5E7EB]" />
              </div>
              <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Platform Branding</CardTitle>
              <CardDescription className="text-[#6B7280]">Customize the look and feel of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-[#1F2937]">
                  Platform Logo
                </Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-bold">
                    AIRX
                  </div>
                  <Button variant="outline" className="border-[#E5E7EB] bg-transparent">
                    Upload New Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color" className="text-[#1F2937]">
                  Primary Color
                </Label>
                <div className="flex items-center gap-4">
                  <Input id="primary-color" type="color" defaultValue="#1E3A8A" className="w-20 border-[#E5E7EB]" />
                  <Input defaultValue="#1E3A8A" className="border-[#E5E7EB]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-message" className="text-[#1F2937]">
                  Welcome Message
                </Label>
                <Textarea
                  id="welcome-message"
                  rows={3}
                  defaultValue="Welcome to AIRX — Microlearning platform for AI Risk awareness training."
                  className="border-[#E5E7EB]"
                />
              </div>
              <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Email Notifications</CardTitle>
              <CardDescription className="text-[#6B7280]">Configure automated email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Course Completion Notifications</Label>
                  <p className="text-sm text-[#6B7280]">Send emails when users complete courses</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Reminder Notifications</Label>
                  <p className="text-sm text-[#6B7280]">Send reminders for incomplete courses</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Quiz Score Notifications</Label>
                  <p className="text-sm text-[#6B7280]">Send instant feedback after quiz attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">New User Welcome Emails</Label>
                  <p className="text-sm text-[#6B7280]">Send welcome emails to new learners</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-[#1F2937]">Security Settings</CardTitle>
              <CardDescription className="text-[#6B7280]">Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Two-Factor Authentication</Label>
                  <p className="text-sm text-[#6B7280]">Require 2FA for all admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Session Timeout</Label>
                  <p className="text-sm text-[#6B7280]">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[#1F2937]">Tenant Data Isolation</Label>
                  <p className="text-sm text-[#6B7280]">Enforce strict multi-tenant data separation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy" className="text-[#1F2937]">
                  Minimum Password Length
                </Label>
                <Input id="password-policy" type="number" defaultValue="8" className="border-[#E5E7EB]" />
              </div>
              <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
