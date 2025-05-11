"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"
import { NotificationSettings } from "@/components/profile/notification-settings"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Profile" text="Manage your account settings" />
        <div className="space-y-6">
          <Skeleton className="h-[40px] w-[300px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardShell>
    )
  }

  // Ensure user is defined and has an id
  const userId = user?.id || "current-user-id"

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your account settings" />

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <PasswordForm userId={userId} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings userId={userId} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
