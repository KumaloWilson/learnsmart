"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { format } from "date-fns"
import { Edit, BookOpen, FileText, ArrowLeft } from "lucide-react"

interface StudentDetailProps {
  studentId: string
}

export default function StudentDetail({ studentId }: StudentDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentStudent, loading, error, getStudentById } = useStudents()

  useEffect(() => {
    getStudentById(studentId)
  }, [studentId, getStudentById])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "graduated":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>Loading student information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!currentStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Not Found</CardTitle>
          <CardDescription>The requested student could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/students")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>
            {currentStudent.user?.firstName} {currentStudent.user?.lastName}
          </CardTitle>
          <CardDescription>Student ID: {currentStudent.studentId}</CardDescription>
          <div className="mt-2">
            <Badge className={getStatusBadgeColor(currentStudent.status)}>
              {currentStudent.status.charAt(0).toUpperCase() + currentStudent.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/students/${studentId}/enrollments`)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Enrollments
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/students/${studentId}/academic-records`)}>
            <FileText className="mr-2 h-4 w-4" />
            Academic Records
          </Button>
          <Button size="sm" onClick={() => router.push(`/students/edit/${studentId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Personal Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd>{currentStudent.user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
              <dd>{currentStudent.phoneNumber || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
              <dd>
                {currentStudent.dateOfBirth
                  ? format(new Date(currentStudent.dateOfBirth), "MMMM d, yyyy")
                  : "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
              <dd>{currentStudent.gender || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Address</dt>
              <dd>{currentStudent.address || "Not provided"}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium">Academic Information</h3>
          <Separator className="my-2" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Program</dt>
              <dd>{currentStudent.program?.name || "Not assigned"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Department</dt>
              <dd>{currentStudent.program?.department?.name || "Not assigned"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Current Level</dt>
              <dd>{currentStudent.currentLevel}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Enrollment Date</dt>
              <dd>
                {currentStudent.enrollmentDate
                  ? format(new Date(currentStudent.enrollmentDate), "MMMM d, yyyy")
                  : "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Graduation Date</dt>
              <dd>
                {currentStudent.graduationDate
                  ? format(new Date(currentStudent.graduationDate), "MMMM d, yyyy")
                  : "Not graduated"}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </CardFooter>
    </Card>
  )
}
