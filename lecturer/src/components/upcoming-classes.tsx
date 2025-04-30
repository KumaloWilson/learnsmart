"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

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

  useEffect(() => {
    // In a real app, fetch from API
    const fetchClasses = async () => {
      try {
        // Mock data for demonstration
        const mockClasses = [
          {
            id: "1",
            title: "Introduction to Programming",
            courseCode: "CS101",
            courseName: "Computer Science Fundamentals",
            startTime: "2025-04-30T10:00:00",
            endTime: "2025-04-30T12:00:00",
            meetingLink: "https://meet.learnsmart.com/cs101",
            isVirtual: true,
            studentCount: 35,
          },
          {
            id: "2",
            title: "Data Structures Lab",
            courseCode: "CS201",
            courseName: "Data Structures and Algorithms",
            startTime: "2025-05-01T14:00:00",
            endTime: "2025-05-01T16:00:00",
            isVirtual: false,
            studentCount: 28,
          },
          {
            id: "3",
            title: "Database Design Principles",
            courseCode: "CS301",
            courseName: "Database Management Systems",
            startTime: "2025-05-02T09:00:00",
            endTime: "2025-05-02T11:00:00",
            meetingLink: "https://meet.learnsmart.com/cs301",
            isVirtual: true,
            studentCount: 22,
          },
          {
            id: "4",
            title: "Web Development Workshop",
            courseCode: "CS401",
            courseName: "Web Technologies",
            startTime: "2025-05-03T13:00:00",
            endTime: "2025-05-03T16:00:00",
            isVirtual: false,
            studentCount: 18,
          },
        ]

        // Simulate API delay
        setTimeout(() => {
          setClasses(mockClasses)
          setLoading(false)
        }, 1000)

        // Real API call would be:
        // const response = await fetch('/api/lecturer/classes/upcoming')
        // const data = await response.json()
        // setClasses(data)
      } catch (error) {
        console.error("Failed to fetch upcoming classes:", error)
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

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
                <Button size="sm" className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Join Class
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
