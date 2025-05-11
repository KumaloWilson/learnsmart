"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, GraduationCap, Users, Clock } from "lucide-react"

type Course = {
  id: string
  name: string
  code: string
  description: string
  instructor: string
  semester: string
  progress: number
  status: string
  enrollmentStatus?: string
  startDate: string
  endDate: string
  creditHours: number
  studentsCount?: number
}

type CoursesListProps = {
  courses: Course[]
  emptyMessage?: string
  showEnrollButton?: boolean
  onEnroll?: (courseId: string) => void
  onUnenroll?: (courseId: string) => void
}

export function CoursesList({
  courses,
  emptyMessage = "No courses found.",
  showEnrollButton = false,
  onEnroll,
  onUnenroll,
}: CoursesListProps) {
  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <BookOpen className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No courses found</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          showEnrollButton={showEnrollButton}
          onEnroll={onEnroll}
          onUnenroll={onUnenroll}
        />
      ))}
    </div>
  )
}

function CourseCard({
  course,
  showEnrollButton,
  onEnroll,
  onUnenroll,
}: {
  course: Course
  showEnrollButton?: boolean
  onEnroll?: (courseId: string) => void
  onUnenroll?: (courseId: string) => void
}) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  const isEnrolled = course.enrollmentStatus === "enrolled"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <Badge className={statusColors[course.status] || statusColors.active}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <Calendar className="h-5 w-5 mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Semester</p>
            <p className="text-sm font-medium">{course.semester}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <GraduationCap className="h-5 w-5 mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Instructor</p>
            <p className="text-sm font-medium">{course.instructor}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
            <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Credit Hours</p>
            <p className="text-sm font-medium">{course.creditHours}</p>
          </div>
        </div>

        {course.status === "active" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Course Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {course.studentsCount !== undefined && (
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{course.studentsCount} students enrolled</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
        </div>

        {showEnrollButton ? (
          isEnrolled ? (
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
              {onUnenroll && (
                <Button variant="outline" onClick={() => onUnenroll(course.id)}>
                  Unenroll
                </Button>
              )}
            </div>
          ) : (
            <Button
              onClick={onEnroll ? () => onEnroll(course.id) : undefined}
              disabled={course.status !== "active" && course.status !== "upcoming"}
            >
              Enroll
            </Button>
          )
        ) : (
          <Button variant="outline" asChild>
            <Link href={`/courses/${course.id}`}>View Course</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
