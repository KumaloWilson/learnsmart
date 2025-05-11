"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUnreadNotificationsCount } from "@/lib/api/notifications-api"

type NotificationIndicatorProps = {
  userId: string
}

export function NotificationIndicator({ userId }: NotificationIndicatorProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const count = await getUnreadNotificationsCount(userId)
        setUnreadCount(count)
      } catch (error) {
        console.error("Failed to fetch unread notifications count:", error)
      }
    }

    fetchUnreadCount()

    // Set up polling to check for new notifications
    const interval = setInterval(fetchUnreadCount, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [userId])

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  )
}
