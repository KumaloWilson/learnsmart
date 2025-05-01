"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!isAuthenticated) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchWithAuth("/dashboard/recent-activity")
        setActivities(data || [])
      } catch (err) {
        console.error("Failed to fetch recent activities:", err)
        setError("Failed to load recent activity data. Please try again later.")
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
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
