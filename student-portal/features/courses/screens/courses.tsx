"use client"

import { useAppSelector } from "@/redux/hooks"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Clock, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Courses() {
  const { studentProfile } = useAppSelector((state) => state.auth)

  if (!studentProfile) {
    return <CoursesSkeletonLoader />
  }

  const { currentEnrollments, program } = studentProfile

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">
          Manage and access your enrolled courses for {program.name} ({program.code})
        </p>
      </div>

      {currentEnrollments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Courses</CardTitle>
            <CardDescription>You are not currently enrolled in any courses.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{enrollment.courseName}</CardTitle>
                  <Badge variant="outline">{enrollment.courseCode}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {enrollment.status === "enrolled" ? "Currently enrolled" : enrollment.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Credit Hours: {enrollment.creditHours}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      Grade: {enrollment.grade ? `${enrollment.grade} (${enrollment.letterGrade})` : "Not graded yet"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/courses/${enrollment.courseId}?semesterId=${studentProfile.activeSemester.id}`}
                    className="flex items-center justify-center"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>View Course</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function CoursesSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
