"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, BookOpen, Calendar, Clock, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authService, lecturerService } from "@/lib/api-services"

interface CourseDetailsProps {
  courseId: string
}

interface Course {
  id: string
  code: string
  name: string
  description: string
  credits: number
  semester: {
    id: string
    name: string
    startDate: string
    endDate: string
  }
  department: {
    id: string
    name: string
  }
  enrollmentCount: number
  schedule: {
    day: string
    startTime: string
    endTime: string
    location: string
  }[]
  topics: {
    id: string
    name: string
    description: string
  }[]
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        const user = authService.getCurrentUser()
        if (!user) throw new Error("User not authenticated")

        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const courseDetails = await lecturerService.getCourseDetails(courseId, lecturerProfile.id)
        setCourse(courseDetails)
      } catch (err) {
        console.error("Failed to fetch course details:", err)
        setError("Failed to load course details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [courseId])

  if (loading) {
    return <CourseDetailsSkeleton />
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

  if (!course) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Course details could not be found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Basic details about this course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Course Code:</span>
            <span className="text-sm">{course.code}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Department:</span>
            <span className="text-sm">{course.department.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Semester:</span>
            <span className="text-sm">{course.semester.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Enrolled Students:</span>
            <span className="text-sm">{course.enrollmentCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Class times and locations</CardDescription>
        </CardHeader>
        <CardContent>
          {course.schedule && course.schedule.length > 0 ? (
            <div className="space-y-3">
              {course.schedule.map((session, index) => (
                <div key={index} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Badge>{session.day}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {session.startTime} - {session.endTime}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">{session.location}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No schedule information available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>Main topics covered in this course</CardDescription>
        </CardHeader>
        <CardContent>
          {course.topics && course.topics.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {course.topics.map((topic) => (
                <div key={topic.id} className="rounded-md border p-3">
                  <h4 className="font-medium">{topic.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No topics have been added to this course yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CourseDetailsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="mt-2 h-20 w-full" />
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
