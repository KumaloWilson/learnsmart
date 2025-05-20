import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Enrollment } from "@/features/auth/types"
import Link from "next/link"
import { useAppSelector } from "@/redux/hooks"

interface CurrentCoursesProps {
  enrollments: Enrollment[]
}

export function CurrentCourses({ enrollments }: CurrentCoursesProps) {
    const { studentProfile } = useAppSelector((state) => state.auth)
    console.log(enrollments)

  
  if (!enrollments.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
          <CardDescription>You are not enrolled in any courses this semester.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Courses</CardTitle>
        <CardDescription>Your active course enrollments for this semester</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrollments.map((course) => (
            <div key={course.id} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{course.courseName}</h3>
                  <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                </div>
                <Badge variant={course.status === "enrolled" ? "outline" : "secondary"} className="capitalize">
                  {course.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Credit Hours: {course.creditHours}</span>
                {course.grade && (
                  <span>
                    Grade: {course.grade} ({course.letterGrade})
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Progress value={course.grade ? 100 : 0} className="w-2/3" />
                <Link href={`/courses/${course.courseId}?semesterId=${studentProfile?.activeSemester?.id}`}>
                
                 <Button size="sm" variant="ghost" className="gap-1">
                  <span>View Course</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
                </Link>
               
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
