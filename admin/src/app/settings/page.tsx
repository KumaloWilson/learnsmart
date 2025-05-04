"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // System settings
  const [systemName, setSystemName] = useState("Learn Smart")
  const [supportEmail, setSupportEmail] = useState("support@learnsmart.edu")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [systemNotifications, setSystemNotifications] = useState(true)
  const [reminderFrequency, setReminderFrequency] = useState("daily")

  // AI settings
  const [aiRecommendations, setAiRecommendations] = useState(true)
  const [aiModel, setAiModel] = useState("gpt-4")
  const [maxTokens, setMaxTokens] = useState("2000")

  const handleSystemSettingsSave = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "System settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationSettingsSave = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiSettingsSave = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "AI settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update AI settings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />  
      <div className="flex-1 p-8">
      <PageHeader heading="System Settings" text="Configure system-wide settings" />

<Tabs defaultValue="system" className="mt-8">
  <TabsList className="grid w-full grid-cols-3 max-w-md">
    <TabsTrigger value="system">System</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="ai">AI & Learning</TabsTrigger>
  </TabsList>

  <TabsContent value="system" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure general system settings and appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="system-name">System Name</Label>
          <Input id="system-name" value={systemName} onChange={(e) => setSystemName(e.target.value)} />
          <p className="text-sm text-muted-foreground">This name will appear throughout the application</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="support-email">Support Email</Label>
          <Input
            id="support-email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Email address for support inquiries</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, only administrators can access the system
            </p>
          </div>
          <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
        </div>

        <Button onClick={handleSystemSettingsSave} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="notifications" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how and when notifications are sent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Send important notifications via email</p>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">System Notifications</Label>
            <p className="text-sm text-muted-foreground">Show notifications in the application</p>
          </div>
          <Switch checked={systemNotifications} onCheckedChange={setSystemNotifications} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
          <select
            id="reminder-frequency"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={reminderFrequency}
            onChange={(e) => setReminderFrequency(e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="never">Never</option>
          </select>
          <p className="text-sm text-muted-foreground">How often to send reminder notifications</p>
        </div>

        <Button onClick={handleNotificationSettingsSave} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="ai" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle>AI & Learning Settings</CardTitle>
        <CardDescription>Configure AI-powered learning recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">AI Recommendations</Label>
            <p className="text-sm text-muted-foreground">Enable AI-powered learning recommendations</p>
          </div>
          <Switch checked={aiRecommendations} onCheckedChange={setAiRecommendations} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-model">AI Model</Label>
          <select
            id="ai-model"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
          >
            <option value="gpt-3.5">GPT-3.5</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude">Claude</option>
          </select>
          <p className="text-sm text-muted-foreground">Select the AI model to use for recommendations</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input id="max-tokens" type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} />
          <p className="text-sm text-muted-foreground">Maximum tokens to use per AI request</p>
        </div>

        <Button onClick={handleAiSettingsSave} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
      </div>
    </div>
  )
}
