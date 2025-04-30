"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { lecturerService } from "@/lib/api-services"

interface UpcomingClass {
  id: string
  title: string
  courseCode: string
  courseName: string
  startTime: string
  endTime: string
  meetingLink?: string
  isVirtual: boolean
  studentCount: number
}

export function UpcomingClasses() {
  const [classes, setClasses] = useState<UpcomingClass[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const upcomingClasses = await lecturerService.getUpcomingClasses(lecturerProfile.id)
        setClasses(upcomingClasses)
      } catch (error) {
        console.error("Failed to fetch upcoming classes:", error)
        toast({
          title: "Error",
          description: "Failed to load upcoming classes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [user, toast])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No upcoming classes scheduled</p>
      ) : (
        classes.map((classItem) => (
          <div key={classItem.id} className="border-b pb-4 last:border-0 last:pb-0">
            <h3 className="font-medium">{classItem.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Badge variant={classItem.isVirtual ? "default" : "outline"}>
                {classItem.isVirtual ? "Virtual" : "In-Person"}
              </Badge>
              <span>
                {classItem.courseCode}: {classItem.courseName}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(classItem.startTime), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(classItem.startTime), "h:mm a")} - {format(new Date(classItem.endTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{classItem.studentCount} students</span>
                </div>
              </div>
              {classItem.isVirtual && classItem.meetingLink && (
                <Button size="sm" className="flex items-center gap-1" asChild>
                  <a href={classItem.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Join Class
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
