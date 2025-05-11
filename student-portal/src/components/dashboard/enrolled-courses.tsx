"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { getEnrolledCourses } from "@/lib/api/courses-api"
import { ArrowRight, BookOpen } from "lucide-react"

export function EnrolledCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.studentProfileId) return

      try {
        const coursesData = await getEnrolledCourses(user.studentProfileId)
        setCourses(coursesData || [])
      } catch (error) {
        console.error("Error fetching enrolled courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user?.studentProfileId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
          <CardDescription>Your current semester courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Enrolled Courses</CardTitle>
          <CardDescription>Your current semester courses</CardDescription>
        </div>
        <Link href="/courses" className="ml-auto">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No enrolled courses</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You are not enrolled in any courses for the current semester.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link href={`/courses/${course.id}`}>
                    <h3 className="font-semibold hover:underline">{course.name}</h3>
                  </Link>
                  <span className="text-sm text-muted-foreground">{course.code}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <Progress value={course.progress || 0} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
