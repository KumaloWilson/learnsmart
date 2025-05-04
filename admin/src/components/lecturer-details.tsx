"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchLecturerById,
  fetchLecturerCourseAssignments,
  fetchLecturerAssessments,
  fetchTeachingMaterials,
} from "@/store/slices/lecturers-slice"
import { fetchDepartments } from "@/store/slices/departments-slice"
import { CourseAssignmentsTable } from "./course-assignments-table"
import { AssessmentsTable } from "./assessments-table"
import { Pencil, ArrowLeft } from "lucide-react"

interface LecturerDetailsProps {
  lecturerId: string
}

export function LecturerDetails({ lecturerId }: LecturerDetailsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentLecturer, loading } = useAppSelector((state) => state.lecturers)
  const { departments } = useAppSelector((state) => state.departments)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    dispatch(fetchLecturerById(lecturerId))
    dispatch(fetchDepartments())
    dispatch(fetchLecturerCourseAssignments(lecturerId))
    dispatch(fetchLecturerAssessments(lecturerId))
    dispatch(fetchTeachingMaterials(lecturerId))
  }, [dispatch, lecturerId])

  if (loading || !currentLecturer) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Loading lecturer details...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const departmentName = departments.find((d) => d.id === currentLecturer.departmentId)?.name || "Unknown"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/lecturers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lecturers
        </Button>
        <Button onClick={() => router.push(`/lecturers/${lecturerId}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Lecturer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {currentLecturer.title} {currentLecturer.user?.firstName} {currentLecturer.user?.lastName}
              </CardTitle>
              <CardDescription>Staff ID: {currentLecturer.staffId}</CardDescription>
            </div>
            <Badge className={getStatusBadgeColor(currentLecturer.status)}>
              {currentLecturer.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Course Assignments</TabsTrigger>
          <TabsTrigger value="materials">Teaching Materials</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lecturer Profile</CardTitle>
              <CardDescription>Personal and professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1">
                    {currentLecturer.title} {currentLecturer.user?.firstName} {currentLecturer.user?.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{currentLecturer.user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Staff ID</h3>
                  <p className="mt-1">{currentLecturer.staffId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="mt-1">{departmentName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
                  <p className="mt-1">{currentLecturer.specialization || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1">{currentLecturer.phoneNumber || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Office Location</h3>
                  <p className="mt-1">{currentLecturer.officeLocation || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Office Hours</h3>
                  <p className="mt-1">{currentLecturer.officeHours || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                  <p className="mt-1">{formatDate(currentLecturer.joinDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <Badge className={getStatusBadgeColor(currentLecturer.status)}>
                      {currentLecturer.status.replace("_", " ")}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="mt-1">{currentLecturer.bio || "No bio provided"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-4">
          <CourseAssignmentsTable lecturerId={lecturerId} />
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          <TeachingMaterialsTable lecturerId={lecturerId} />
        </TabsContent>

        <TabsContent value="assessments" className="mt-4">
          <AssessmentsTable lecturerId={lecturerId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
