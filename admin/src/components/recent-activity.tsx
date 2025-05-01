"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"

interface ActivityItem {
  id: string
  action: string
  user: {
    name: string
    email: string
  }
  entity: string
  entityId: string
  timestamp: string
}

export function RecentActivity() {
  const { isAuthenticated } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!isAuthenticated) {
        // Don't fetch if not authenticated yet
        return
      }

      try {
        const data = await fetchWithAuth("/dashboard/recent-activity")
        if (data) {
          setActivities(data)
        } else {
          // Fallback data
          setActivities([
            {
              id: "1",
              action: "created",
              user: { name: "John Doe", email: "john@example.com" },
              entity: "Course",
              entityId: "1",
              timestamp: new Date().toISOString(),
            },
            {
              id: "2",
              action: "updated",
              user: { name: "Jane Smith", email: "jane@example.com" },
              entity: "Program",
              entityId: "3",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "3",
              action: "deleted",
              user: { name: "Admin User", email: "admin@example.com" },
              entity: "Department",
              entityId: "2",
              timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              id: "4",
              action: "created",
              user: { name: "Sarah Johnson", email: "sarah@example.com" },
              entity: "School",
              entityId: "4",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "5",
              action: "updated",
              user: { name: "Michael Brown", email: "michael@example.com" },
              entity: "User",
              entityId: "7",
              timestamp: new Date(Date.now() - 172800000).toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch recent activities:", error)
        // Fallback data
        setActivities([
          {
            id: "1",
            action: "created",
            user: { name: "John Doe", email: "john@example.com" },
            entity: "Course",
            entityId: "1",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            action: "updated",
            user: { name: "Jane Smith", email: "jane@example.com" },
            entity: "Program",
            entityId: "3",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            action: "deleted",
            user: { name: "Admin User", email: "admin@example.com" },
            entity: "Department",
            entityId: "2",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recent activity to display</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {activity.user.name} {activity.action} a {activity.entity.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
