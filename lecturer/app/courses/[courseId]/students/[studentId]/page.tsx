"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStudent, useCourse } from "@/lib/auth/hooks"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Mail, Phone, User, Calendar, School } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/breadcrumb"
import { StudentTopicProgress } from "@/components/student-topic-progress"

export default function StudentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  const courseId = params.courseId as string

  const { student, getStudentById, isLoading: studentLoading, error: studentError } = useStudent()
  const { course, loading: courseLoading } = useCourse(courseId)

  const [activeTab, setActiveTab] = useState("progress")

  useEffect(() => {
    if (studentId) {
      getStudentById(studentId)
    }
  }, [studentId, getStudentById])

  const loading = studentLoading || courseLoading

  if (loading) {
    return (
      <PageContainer title="Student Details" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (studentError || !student) {
    return (
      <PageContainer title="Student Details">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load student details. The student may not exist or you don't have permission to view their
              details.
            </p>
            <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/students`)} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`Student: ${student.user.firstName} ${student.user.lastName}`}
      description="View detailed information about this student"
      backButton={
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/courses/${courseId}/students`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      }
    >
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course?.courseName || "Course", href: `/courses/${courseId}` },
          { label: "Students", href: `/courses/${courseId}/students` },
          { label: `${student.user.firstName} ${student.user.lastName}` },
        ]}
        className="mb-4"
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 border">
                <AvatarImage
                  src={`/placeholder.svg?height=96&width=96`}
                  alt={`${student.user.firstName} ${student.user.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {student.user.firstName.charAt(0)}
                  {student.user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold">
                    {student.user.firstName} {student.user.lastName}
                  </h2>
                  <p className="text-muted-foreground">Student ID: {student.studentId}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.user.email}</span>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.phoneNumber || "Not provided"}</span>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Level {student.currentLevel}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.program.name}</span>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        student.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span>{student.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Topic Progress</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6">
            {course && (
              <StudentTopicProgress studentProfileId={student.id} courseId={courseId} semesterId={course.semesterId} />
            )}
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Assessments</CardTitle>
                <CardDescription>View this student's assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Assessment data will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance</CardTitle>
                <CardDescription>View this student's attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Attendance data will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
