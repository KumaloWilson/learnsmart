"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Loader2, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses, useVirtualClasses } from "@/lib/auth/hooks"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"
import { CreateVirtualClassDialog } from "@/components/create-virtual-class-dialog"

export default function CourseVirtualClassesPage() {
  const { courseId } = useParams() as { courseId: string }
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const { getVirtualClassesByCourseAndSemester, virtualClasses, isLoading: isLoadingClasses } = useVirtualClasses()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id) {
        try {
          // Fetch courses if not already loaded
          if (courses.length === 0) {
            await getCourses(lecturerProfile.id)
          }

          // Find the current course
          const currentCourse = courses.find((c) => c.courseId === courseId)
          if (currentCourse) {
            setCourse(currentCourse)

            // Fetch virtual classes for this course and semester only if not already loaded
            if (virtualClasses.length === 0) {
              await getVirtualClassesByCourseAndSemester(courseId, currentCourse.semesterId)
            }
          }
        } catch (err) {
          console.error("Error fetching data:", err)
        }
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, courses, getCourses, getVirtualClassesByCourseAndSemester, virtualClasses.length])

  const filterVirtualClasses = (status: string) => {
    const now = new Date()

    return virtualClasses.filter((vc) => {
      const startTime = new Date(vc.scheduledStartTime)
      const endTime = new Date(vc.scheduledEndTime)

      if (status === "upcoming") {
        return vc.status === "scheduled" && startTime > now
      } else if (status === "active") {
        return vc.status === "in_progress" || (vc.status === "scheduled" && startTime <= now && endTime >= now)
      } else if (status === "past") {
        return vc.status === "completed" || (vc.status === "scheduled" && endTime < now)
      }
      return true
    })
  }

  const getStatusBadgeVariant = (status: string, startTime: Date, endTime: Date) => {
    const now = new Date()

    if (status === "in_progress") {
      return "default"
    } else if (status === "completed") {
      return "secondary"
    } else if (status === "cancelled") {
      return "destructive"
    } else if (startTime <= now && endTime >= now) {
      return "default" // Active class
    } else if (endTime < now) {
      return "destructive" // Missed class
    } else {
      return "outline" // Upcoming class
    }
  }

  const getStatusLabel = (status: string, startTime: Date, endTime: Date) => {
    const now = new Date()

    if (status === "in_progress") {
      return "In Progress"
    } else if (status === "completed") {
      return "Completed"
    } else if (status === "cancelled") {
      return "Cancelled"
    } else if (startTime <= now && endTime >= now) {
      return "Active" // Active class
    } else if (endTime < now) {
      return "Missed" // Missed class
    } else {
      return "Upcoming" // Upcoming class
    }
  }

  if (isLoadingCourses || isLoadingClasses) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading virtual classes...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <PageContainer title="Course Not Found" description="The requested course could not be found">
        <Alert variant="destructive">
          <AlertDescription>Course not found. Please check the URL and try again.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`${course.courseName} - Virtual Classes`}
      description={`${course.courseCode} - ${course.semesterName}`}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Virtual Class
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterVirtualClasses("upcoming").length > 0 ? (
              filterVirtualClasses("upcoming").map((virtualClass) => (
                <VirtualClassCard
                  key={virtualClass.id}
                  virtualClass={virtualClass}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No upcoming virtual classes</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Virtual Class
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterVirtualClasses("active").length > 0 ? (
              filterVirtualClasses("active").map((virtualClass) => (
                <VirtualClassCard
                  key={virtualClass.id}
                  virtualClass={virtualClass}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No active virtual classes</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterVirtualClasses("past").length > 0 ? (
              filterVirtualClasses("past").map((virtualClass) => (
                <VirtualClassCard
                  key={virtualClass.id}
                  virtualClass={virtualClass}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusLabel={getStatusLabel}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No past virtual classes</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateVirtualClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultCourseId={courseId}
        defaultSemesterId={course.semesterId}
      />
    </PageContainer>
  )
}

interface VirtualClassCardProps {
  virtualClass: any
  getStatusBadgeVariant: (status: string, startTime: Date, endTime: Date) => string
  getStatusLabel: (status: string, startTime: Date, endTime: Date) => string
}

function VirtualClassCard({ virtualClass, getStatusBadgeVariant, getStatusLabel }: VirtualClassCardProps) {
  const startTime = new Date(virtualClass.scheduledStartTime)
  const endTime = new Date(virtualClass.scheduledEndTime)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
          <Badge variant={getStatusBadgeVariant(virtualClass.status, startTime, endTime)}>
            {getStatusLabel(virtualClass.status, startTime, endTime)}
          </Badge>
        </div>
        <CardDescription>{virtualClass.meetingConfig.platform}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{formatDate(virtualClass.scheduledStartTime)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
            </span>
          </div>
          {virtualClass.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{virtualClass.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/virtual-classes/${virtualClass.id}`}>
            <Video className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
