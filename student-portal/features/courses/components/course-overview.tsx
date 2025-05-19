import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, User, MapPin, Phone, Clock } from "lucide-react"
import type { CourseDetails } from "@/features/courses/types"

interface CourseOverviewProps {
  courseDetails: CourseDetails
}

export function CourseOverview({ courseDetails }: CourseOverviewProps) {
  const { course, virtualClasses } = courseDetails

  // Get unique lecturers from virtual classes
  const uniqueLecturers = virtualClasses.reduce(
    (acc, virtualClass) => {
      const lecturerId = virtualClass.lecturerProfile.id
      if (!acc.some((l) => l.id === lecturerId)) {
        acc.push(virtualClass.lecturerProfile)
      }
      return acc
    },
    [] as CourseDetails["virtualClasses"][0]["lecturerProfile"][],
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Details about {course.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Program</h3>
            <div className="flex items-center mt-1">
              <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-sm text-muted-foreground">
                {course.program.name} ({course.program.code})
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Code
                </Badge>
                <span className="text-sm">{course.code}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Level
                </Badge>
                <span className="text-sm">{course.level}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Credit Hours
                </Badge>
                <span className="text-sm">{course.creditHours}</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Program Level
                </Badge>
                <span className="text-sm capitalize">{course.program.level}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uniqueLecturers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Lecturers</CardTitle>
            <CardDescription>Instructors for this course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uniqueLecturers.map((lecturer) => (
              <div key={lecturer.id} className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <h3 className="text-sm font-medium">
                      {lecturer.title} {lecturer.user.firstName} {lecturer.user.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground">{lecturer.specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">{lecturer.officeLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">{lecturer.officeHours}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">{lecturer.phoneNumber}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{lecturer.bio}</p>

                <Separator className="my-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
