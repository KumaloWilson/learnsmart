"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Loader2, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses } from "@/lib/auth/hooks"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"
import { CreateVirtualClassDialog } from "@/components/create-virtual-class-dialog"

interface CourseVirtualClassesProps {
  courseId: string
  semesterId: string
  limit?: number
}

export function CourseVirtualClasses({ courseId, semesterId, limit = 3 }: CourseVirtualClassesProps) {
  const { lecturerProfile } = useAuth()
  const { getVirtualClassesByCourseAndSemester, virtualClasses, isLoading } = useVirtualClasses()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (courseId && semesterId) {
        try {
          await getVirtualClassesByCourseAndSemester(courseId, semesterId)
        } catch (err) {
          console.error("Error fetching virtual classes:", err)
        }
      }
    }

    fetchData()
  }, [courseId, semesterId, getVirtualClassesByCourseAndSemester])

  const getUpcomingClasses = () => {
    const now = new Date()
    return virtualClasses
      .filter((vc) => {
        const startTime = new Date(vc.scheduledStartTime)
        return vc.status === "scheduled" && startTime > now
      })
      .sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
      .slice(0, limit)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "outline"
      case "in_progress":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Virtual Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const upcomingClasses = getUpcomingClasses()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Virtual Classes</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingClasses.length > 0 ? (
          <div className="space-y-4">
            {upcomingClasses.map((virtualClass) => (
              <div key={virtualClass.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{virtualClass.title}</h4>
                    <Badge variant={getStatusBadgeVariant(virtualClass.status)}>
                      {virtualClass.status.charAt(0).toUpperCase() + virtualClass.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDate(virtualClass.scheduledStartTime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
                    </span>
                  </div>
                  <div className="pt-1">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2 text-center">
              <Button variant="link" asChild className="text-sm">
                <Link href={`/courses/${courseId}/virtual-classes`}>View All Virtual Classes</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No upcoming virtual classes</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Virtual Class
            </Button>
          </div>
        )}
      </CardContent>

      <CreateVirtualClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultCourseId={courseId}
        defaultSemesterId={semesterId}
      />
    </Card>
  )
}
