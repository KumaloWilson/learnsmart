"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getStudentDashboard } from "@/lib/api/student-portal-api"
import { formatDistanceToNow, format } from "date-fns"
import { ArrowRight, Video } from "lucide-react"

export function UpcomingClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.studentProfileId) return

      try {
        const dashboardData = await getStudentDashboard(user.studentProfileId)
        setClasses(dashboardData.upcomingVirtualClasses || [])
      } catch (error) {
        console.error("Error fetching upcoming classes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [user?.studentProfileId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Your scheduled virtual classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Your scheduled virtual classes</CardDescription>
        </div>
        <Link href="/virtual-classes" className="ml-auto">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <Video className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No upcoming classes</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You don't have any virtual classes scheduled soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((virtualClass) => (
              <div key={virtualClass.id} className="space-y-2">
                <Link href={`/virtual-classes/${virtualClass.id}`}>
                  <h3 className="font-semibold hover:underline">{virtualClass.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{virtualClass.course?.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{format(new Date(virtualClass.scheduledStartTime), "MMM d, h:mm a")}</Badge>
                  <Badge variant="secondary">
                    {formatDistanceToNow(new Date(virtualClass.scheduledStartTime), { addSuffix: true })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
