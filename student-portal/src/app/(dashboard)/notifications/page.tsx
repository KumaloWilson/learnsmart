import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { NotificationsListSkeleton } from "@/components/skeletons/notifications-list-skeleton"
import { MarkAllAsReadButton } from "@/components/notifications/mark-all-as-read-button"
import { getNotifications } from "@/lib/api/notifications-api"

export const metadata: Metadata = {
  title: "Notifications | Learn Smart",
  description: "View your notifications",
}

async function getNotificationsList() {
  try {
    return await getNotifications()
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return []
  }
}

export default async function NotificationsPage() {
  const notifications = await getNotificationsList()
  const userId = "current-user-id" // In a real app, get this from auth context or session

  return (
    <DashboardShell>
      <DashboardHeader heading="Notifications" text="Stay updated with important announcements">
        <MarkAllAsReadButton userId={userId} />
      </DashboardHeader>

      <Suspense fallback={<NotificationsListSkeleton />}>
        <NotificationsList notifications={notifications} />
      </Suspense>
    </DashboardShell>
  )
}
