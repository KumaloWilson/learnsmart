"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchCourses } from "@/lib/redux/slices/courseSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BookOpen, Calendar } from "lucide-react"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"

export default function CoursesPage() {
  const dispatch = useAppDispatch()
  const { courses, isLoading, error } = useAppSelector((state) => state.courses)
  const { accessToken } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCourses(accessToken))
    }
  }, [dispatch, accessToken])

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">View and manage your enrolled courses</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.name}
              code={course.code}
              instructor={
                course.instructor
                  ? `${course.instructor.title} ${course.instructor.firstName} ${course.instructor.lastName}`
                  : "Not assigned"
              }
              creditHours={course.creditHours}
              progress={course.progress?.overall || 0}
              semester={course.semester?.name || "Current Semester"}
              startDate={course.startDate}
              endDate={course.endDate}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-muted-foreground">You are not enrolled in any courses.</p>
        </div>
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}

interface CourseCardProps {
  id: string
  title: string
  code: string
  instructor: string
  creditHours: number
  progress: number
  semester: string
  startDate: string
  endDate: string
}

function CourseCard({
  id,
  title,
  code,
  instructor,
  creditHours,
  progress,
  semester,
  startDate,
  endDate,
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={`/placeholder.svg?height=200&width=400&text=${code}`}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {code}
          </Badge>
        </div>
        <CardDescription>{instructor}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{creditHours} Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{semester}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
