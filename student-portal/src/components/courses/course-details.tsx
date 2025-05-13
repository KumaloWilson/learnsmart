"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Users, BookOpen, Calendar } from "lucide-react"

interface CourseDetailsProps {
  course: any
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  const handleEnroll = async () => {
    try {
      // API call to enroll in the course would go here
      toast({
        title: "Enrolled Successfully",
        description: `You have been enrolled in ${course.name}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course. Please try again.",
      })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{course.name}</CardTitle>
                  <CardDescription className="text-lg mt-1">{course.code}</CardDescription>
                </div>
                <Badge variant={course.isEnrolled ? "secondary" : "outline"}>
                  {course.isEnrolled ? "Enrolled" : "Not Enrolled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{course.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.creditHours} Credit Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.enrollmentCount} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.department?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.semester?.name}</span>
                  </div>
                </div>

                {course.isEnrolled && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Course Progress</span>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {!course.isEnrolled && (
                  <Button onClick={handleEnroll} className="mt-4">
                    Enroll in Course
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={course.lecturer?.avatarUrl || "/placeholder.svg?height=64&width=64"}
                    alt={course.lecturer?.name || "Instructor"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{course.lecturer?.name || "TBA"}</h3>
                  <p className="text-sm text-muted-foreground">{course.lecturer?.title || "Lecturer"}</p>
                  <p className="text-sm text-muted-foreground">{course.lecturer?.email || ""}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Materials</span>
                  <Badge variant="outline">{course.materialsCount || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Assessments</span>
                  <Badge variant="outline">{course.assessmentsCount || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quizzes</span>
                  <Badge variant="outline">{course.quizzesCount || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Virtual Classes</span>
                  <Badge variant="outline">{course.virtualClassesCount || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
