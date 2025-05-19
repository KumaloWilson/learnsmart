"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchCourseDetails, fetchCourseTopics, clearCourseDetails } from "@/features/courses/redux/coursesSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Calendar, Clock, GraduationCap, Video, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { CourseOverview } from "@/features/courses/components/course-overview"
import { CourseTopics } from "@/features/courses/components/course-topics"
import { CourseQuizzes } from "@/features/courses/components/course-quizzes"
import { CourseVirtualClasses } from "@/features/courses/components/course-virtual-classes"
import { CourseAttendance } from "@/features/courses/components/course-attendance"

interface CourseDetailsProps {
  courseId: string
  semesterId: string
}

export function CourseDetails({ courseId, semesterId }: CourseDetailsProps) {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { currentCourseDetails, currentCourseTopics, isLoadingDetails, isLoadingTopics, error } = useAppSelector(
    (state) => state.courses,
  )
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchCourseDetails({
          studentProfileId: studentProfile.id,
          courseId,
          semesterId,
          token: accessToken,
        }),
      )

      dispatch(
        fetchCourseTopics({
          studentProfileId: studentProfile.id,
          courseId,
          semesterId,
          token: accessToken,
        }),
      )
    }

    // Cleanup function to clear course details when unmounting
    return () => {
      dispatch(clearCourseDetails())
    }
  }, [dispatch, studentProfile?.id, courseId, semesterId, accessToken])

  if (isLoadingDetails || isLoadingTopics || !studentProfile) {
    return <CourseDetailsSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentCourseDetails) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Course details not found.</AlertDescription>
      </Alert>
    )
  }

  const { course, quizzes, virtualClasses, attendance } = currentCourseDetails

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <Badge variant="outline" className="text-base px-3 py-1">
            {course.code}
          </Badge>
        </div>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.creditHours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.level}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{course.program.name}</div>
            <p className="text-xs text-muted-foreground">{course.program.code}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Topics</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Classes</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Attendance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CourseOverview courseDetails={currentCourseDetails} />
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <CourseTopics topics={currentCourseTopics} />
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <CourseQuizzes quizzes={quizzes} quizAttempts={currentCourseDetails.quizAttempts} />
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <CourseVirtualClasses virtualClasses={virtualClasses} />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <CourseAttendance attendanceRecords={attendance} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseDetailsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
