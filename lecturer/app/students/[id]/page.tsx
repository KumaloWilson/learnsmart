"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Mail, Phone, User, Calendar, School, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import axiosInstance from "@/lib/axios"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { lecturerProfile } = useAuth()
  const studentId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false)

  const { getCourses, courses } = useCourses()

  useEffect(() => {
    if (lecturerProfile?.id) {
      getCourses(lecturerProfile.id)
    }
  }, [lecturerProfile, getCourses])

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(`/students/${studentId}`)
        setStudent(response.data)
      } catch (err) {
        console.error("Failed to fetch student:", err)
        setError("Failed to load student profile. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      fetchStudent()
    }
  }, [studentId])

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!student || !courses || courses.length === 0) return

      setIsAttendanceLoading(true)

      try {
        // Find courses this student is enrolled in
        const studentCourses = courses.filter(
          (course) => course.students && course.students.some((s) => s.id === student.id),
        )

        if (studentCourses.length === 0) {
          setAttendanceStats(null)
          setAttendanceRecords([])
          return
        }

        // Use the first course for now (could be enhanced to show all courses)
        const courseId = studentCourses[0].courseId
        const semesterId = studentCourses[0].semesterId

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
  }, [student, courses, activeTab])

  if (isLoading) {
    return (
      <PageContainer title="Student Profile" description="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (error || !student) {
    return (
      <PageContainer title="Student Profile" description="Error">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Failed to load student profile"}</p>
              <Button onClick={() => router.push("/students")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`${student.user.firstName} ${student.user.lastName}`}
      description={`Student ID: ${student.studentId}`}
      actions={
        <Button variant="outline" onClick={() => router.push("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      }
    >
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
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Detailed student information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm">
                          {student.user.firstName} {student.user.lastName}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Gender</p>
                        <p className="text-sm capitalize">{student.gender || "Not specified"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm">
                          {student.dateOfBirth ? format(new Date(student.dateOfBirth), "PPP") : "Not specified"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm">{student.user.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm">{student.phoneNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Academic Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Student ID</p>
                        <p className="text-sm">{student.studentId}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Program</p>
                        <p className="text-sm">{student.program.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm">{student.program.department.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Current Level</p>
                        <p className="text-sm">{student.currentLevel}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm capitalize">{student.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-1">
                        <p className="text-sm font-medium">Address</p>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{student.address || "No address provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>View this student's attendance history</CardDescription>
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

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>View this student's academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Performance data will be implemented in a future update.</p>
                  <Button variant="outline" className="mt-4">
                    Request Performance Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}
