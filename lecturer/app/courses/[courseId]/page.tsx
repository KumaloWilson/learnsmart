"use client"
import Link from "next/link"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Video, FileQuestion, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { CourseTopicsSection } from "@/components/course-topics-section"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourseDetail } from "@/lib/auth/hooks"
import { useEffect, useState, useRef } from "react"

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""

  // Default semester ID to use until we get the course details
  const defaultSemesterId = "bbfc180e-11ce-48a5-adb6-95b197339bae"
  const [semesterId, setSemesterId] = useState(defaultSemesterId)
  
  // Track if we've already updated the semester ID to prevent loops
  const semesterUpdated = useRef(false)
  
  // Prevent auto-refetching behavior by not destructuring refetch
  const { courseDetail, isLoading: loading, error } = useCourseDetail(lecturerId, courseId, semesterId)
console.log("courseDetail", courseDetail)
  // Update semesterId if we get it from courseDetail, but only once
  useEffect(() => {
    if (
      courseDetail?.semester?.id && 
      courseDetail.semester.id !== semesterId && 
      !semesterUpdated.current
    ) {
      semesterUpdated.current = true
      setSemesterId(courseDetail.semester.id)
    }
  }, [courseDetail, semesterId])

  if (loading) {
    return (
      <PageContainer title="Course Details" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error || !courseDetail) {
    return (
      <PageContainer title="Course Not Found">
        <div className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading course details</h2>
          <p className="text-muted-foreground mb-4">{error || "Course information could not be found"}</p>
          <Button onClick={() => router.push("/courses")}>Return to Courses</Button>
        </div>
      </PageContainer>
    )
  }

  const course = courseDetail.course
  const semester = courseDetail.semester

  return (
    <PageContainer title={`Course: ${course.name}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">Course Code: {course.code}</p>
            <p className="text-muted-foreground">Semester: {semester.name}</p>
          </div>
          <Button variant="outline" onClick={() => router.push(`/courses/${course.id}/topics`)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Course Topics
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="bg-muted px-3 py-1 rounded-md text-sm">Level: {course.level}</div>
              <div className="bg-muted px-3 py-1 rounded-md text-sm">Credit Hours: {course.creditHours}</div>
              <div className="bg-muted px-3 py-1 rounded-md text-sm">Program: {course.program.name}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Total Students</p>
                <p className="text-2xl font-bold">{courseDetail.enrollmentStats.total}</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Enrolled</p>
                <p className="text-2xl font-bold">{courseDetail.enrollmentStats.statusCounts.enrolled}</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{courseDetail.enrollmentStats.statusCounts.completed}</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Average Grade</p>
                <p className="text-2xl font-bold">{courseDetail.enrollmentStats.averageGrade || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={`/courses/${course.id}/students`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>View and manage students enrolled in this course</CardDescription>
                <p className="mt-2 text-sm font-medium">{courseDetail.enrollmentStats.total} students</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/courses/${course.id}/virtual-classes`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Virtual Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Schedule and manage virtual classes</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/courses/${course.id}/quizzes`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Create and manage quizzes forrr this course</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/courses/${course.id}/topics`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Course Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Manage course topics and learning objectives</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {courseDetail && (
          <div className="mt-8">
            <CourseTopicsSection courseId={courseId} semesterId={semester.id} />
          </div>
        )}
      </div>
    </PageContainer>
  )
}