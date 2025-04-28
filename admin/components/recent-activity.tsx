"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await fetchWithAuth("/dashboard/recent-activity")
        setActivities(data || [])
      } catch (error) {
        console.error("Failed to fetch recent activities:", error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

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

  // If no real data, show placeholder data
  const displayActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            action: "created",
            user: { name: "Admin User", email: "admin@example.com" },
            entity: "Course",
            entityId: "course-123",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            action: "updated",
            user: { name: "John Doe", email: "john@example.com" },
            entity: "Program",
            entityId: "program-456",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            action: "deleted",
            user: { name: "Jane Smith", email: "jane@example.com" },
            entity: "Department",
            entityId: "dept-789",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ]

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
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
