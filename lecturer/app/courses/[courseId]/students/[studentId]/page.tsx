"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Mail, Phone, User, Calendar, School } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/breadcrumb"
import { StudentTopicProgress } from "@/components/student-topic-progress"
import axiosInstance from "@/lib/axios"
import { format } from "date-fns"

export default function StudentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  const courseId = params.courseId as string
  const { lecturerProfile } = useAuth()

  const [student, setStudent] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("progress")
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false)
  const [semesterId, setSemesterId] = useState<string>("")

  // Fetch student data   
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {  
        // Fetch student details
        const studentResponse = await axiosInstance.get(`/students/${studentId}`)
        setStudent(studentResponse.data)

        // Fetch course details to get semester ID
        if (lecturerProfile?.id && courseId) {
          const courseResponse = await axiosInstance.get(
            `/lecturer-dashboard/${lecturerProfile.id}/course/${courseId}/semester/bbfc180e-11ce-48a5-adb6-95b197339bae`,
          )

          if (courseResponse.data.success) {
            setCourse(courseResponse.data.data.course)
            setSemesterId(courseResponse.data.data.semester.id)
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load student details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (studentId && courseId) {
      fetchData()
    }
  }, [studentId, courseId, lecturerProfile])

  // Fetch attendance data when tab changes
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!student || !courseId || !semesterId) return

      setIsAttendanceLoading(true)

      try {
        // Fetch attendance data
        const response = await axiosInstance.get(
          `/attendance/student/${student.id}/course/${courseId}/semester/${semesterId}`,
        )

        setAttendanceStats(response.data.statistics)
        setAttendanceRecords(response.data.records)
      } catch (err) {
        console.error("Failed to fetch attendance:", err)
      } finally {
        setIsAttendanceLoading(false)
      }
    }

    if (activeTab === "attendance") {
      fetchAttendance()
    }
  }, [student, courseId, semesterId, activeTab])

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

  if (error || !student) {
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
      actions={
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
          { label: course?.name || "Course", href: `/courses/${courseId}` },
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
                  src={`/abstract-geometric-shapes.png?height=96&width=96&query=${student.user.firstName} ${student.user.lastName}`}
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
                    <span>Enrolled: {format(new Date(student.enrollmentDate), "PPP")}</span>
                  </div>

                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{student.program.name}</span>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        student.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="capitalize">{student.status}</span>
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
            {courseId && semesterId && (
              <StudentTopicProgress studentProfileId={student.id} courseId={courseId} semesterId={semesterId} />
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
                {isAttendanceLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : attendanceStats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Classes</p>
                        <p className="text-2xl font-bold">{attendanceStats.totalClasses}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Present</p>
                        <p className="text-2xl font-bold">{attendanceStats.presentCount}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Absent</p>
                        <p className="text-2xl font-bold">{attendanceStats.absentCount}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold">{attendanceStats.attendancePercentage}%</p>
                      </div>
                    </div>

                    {attendanceRecords.length > 0 ? (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-3">Attendance History</h3>
                        <div className="rounded-md border overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Topic</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendanceRecords.map((record) => (
                                <tr key={record.id} className="border-b">
                                  <td className="px-4 py-2 text-sm">{format(new Date(record.date), "PPP")}</td>
                                  <td className="px-4 py-2 text-sm">{record.topic}</td>
                                  <td className="px-4 py-2 text-sm capitalize">{record.type}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        record.isPresent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {record.isPresent ? "Present" : "Absent"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm">{record.notes || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 mt-4">
                        <p className="text-muted-foreground">No attendance records found for this student.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No attendance data available for this student.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
