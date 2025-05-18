"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function CurrentEnrollments() {
  const { profile, isLoading } = useAppSelector((state) => state.student)

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile || !profile.currentEnrollments.length) return null

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Current Enrollments</CardTitle>
        <CardDescription>{profile.currentEnrollments.length} course(s) this semester</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profile.currentEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{enrollment.courseName}</p>
                <p className="text-sm text-muted-foreground">{enrollment.courseCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {enrollment.creditHours} credits
                </Badge>
                <Button size="sm" asChild>
                  <Link href={`/courses/${enrollment.courseId}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
