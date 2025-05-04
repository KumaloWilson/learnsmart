"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchStudentById, fetchStudentEnrollments, fetchStudentAcademicRecords } from "@/store/slices/students-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Edit, ArrowLeft, GraduationCap, BookOpen, BarChart } from "lucide-react"
import { EnrollmentTable } from "./enrollment-table"
import { AcademicRecordsTable } from "./academic-records-table"

interface StudentDetailsProps {
  studentId: string
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { currentStudent, enrollments, academicRecords, isLoading } = useSelector((state: RootState) => state.students)

  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    dispatch(fetchStudentById(studentId))
    dispatch(fetchStudentEnrollments(studentId))
    dispatch(fetchStudentAcademicRecords(studentId))
  }, [dispatch, studentId])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading || !currentStudent) {
    return <div className="flex justify-center p-8">Loading student details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Button onClick={() => router.push(`/students/${studentId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Student
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <GraduationCap className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="enrollments">
            <BookOpen className="mr-2 h-4 w-4" />
            Course Enrollments
          </TabsTrigger>
          <TabsTrigger value="academic-records">
            <BarChart className="mr-2 h-4 w-4" />
            Academic Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Personal and academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                  <p className="mt-1 text-lg font-semibold">{currentStudent.studentId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={`mt-1 ${getStatusBadgeColor(currentStudent.status)}`}>
                    {currentStudent.status.charAt(0).toUpperCase() + currentStudent.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg font-semibold">
                    {currentStudent.user?.firstName} {currentStudent.user?.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{currentStudent.user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Program</h3>
                  <p className="mt-1">{currentStudent.program?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="mt-1">{currentStudent.program?.department?.name}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current Level</h3>
                  <p className="mt-1">Level {currentStudent.currentLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Enrollment Date</h3>
                  <p className="mt-1">
                    {currentStudent.enrollmentDate ? format(new Date(currentStudent.enrollmentDate), "PPP") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p className="mt-1">
                    {currentStudent.dateOfBirth ? format(new Date(currentStudent.dateOfBirth), "PPP") : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p className="mt-1">{currentStudent.gender || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1">{currentStudent.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Graduation Date</h3>
                  <p className="mt-1">
                    {currentStudent.graduationDate ? format(new Date(currentStudent.graduationDate), "PPP") : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">{currentStudent.address || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="pt-4">
          <EnrollmentTable studentId={studentId} enrollments={enrollments} />
        </TabsContent>

        <TabsContent value="academic-records" className="pt-4">
          <AcademicRecordsTable studentId={studentId} academicRecords={academicRecords} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
