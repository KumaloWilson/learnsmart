"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { useCourse } from "@/lib/auth/hooks"
import PageContainer from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Video, FileQuestion, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
// Import the CourseTopicsSection component
import { CourseTopicsSection } from "@/components/course-topics-section"

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { course, loading, error } = useCourse(params.courseId)
  const router = useRouter()
  const courseId = params.courseId

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

  if (error || !course) {
    return notFound()
  }

  return (
    <PageContainer title={`Course: ${course.name}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">Course Code: {course.code}</p>
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
                <CardDescription>Create and manage quizzes for this course</CardDescription>
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
        {course && (
          <div className="mt-8">
            <CourseTopicsSection courseId={courseId} semesterId={course.semesterId} />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
