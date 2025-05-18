"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, Video } from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDashboardQuery } from "@/lib/api/dashboard"
import { formatDistanceToNow, format, isAfter, isBefore, parseISO } from "date-fns"

export function UpcomingClasses() {
  const { profile } = useAppSelector((state) => state.student)

  const { data: dashboardData, isLoading } = useGetDashboardQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  // Get the current date and time
  const now = new Date()

  // Sort upcoming classes by start time
  const sortedClasses = dashboardData?.upcomingVirtualClasses
    ? [...dashboardData.upcomingVirtualClasses].sort((a, b) => {
        return new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime()
      })
    : []

  // Filter to only show the next 3 classes
  const upcomingClasses = sortedClasses.slice(0, 3)

  // Check if a class is happening now
  const isClassLive = (startTime: string, endTime: string) => {
    const start = parseISO(startTime)
    const end = parseISO(endTime)
    return isAfter(now, start) && isBefore(now, end)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </>
        ) : upcomingClasses.length > 0 ? (
          <>
            {upcomingClasses.map((virtualClass) => {
              const isLive = isClassLive(virtualClass.scheduledStartTime, virtualClass.scheduledEndTime)

              return (
                <div key={virtualClass.id} className="flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{virtualClass.title}</h3>
                      {isLive && <Badge className="bg-red-500 hover:bg-red-600">Live Now</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{virtualClass.course.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(virtualClass.scheduledStartTime), "MMM d, yyyy")} at{" "}
                        {format(new Date(virtualClass.scheduledStartTime), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(virtualClass.scheduledStartTime), { addSuffix: true })}</span>
                    </div>
                    <div className="pt-1">
                      <Button size="sm" className="w-full" asChild>
                        <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                          {isLive ? "Join Now" : "View Details"}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No upcoming classes scheduled.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
