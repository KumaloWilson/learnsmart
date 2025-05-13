"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLecturers } from "@/hooks/use-lecturers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, BookOpen } from "lucide-react"

interface LecturerDetailProps {
  id: string
}

export function LecturerDetail({ id }: LecturerDetailProps) {
  const router = useRouter()
  const { currentLecturer, loadLecturer, isLoading, error } = useLecturers()

  useEffect(() => {
    loadLecturer(id)
  }, [id, loadLecturer])

  if (isLoading.currentLecturer) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentLecturer) {
    return (
      <Alert>
        <AlertDescription>Lecturer not found</AlertDescription>
      </Alert>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "on_leave":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentLecturer.title} {currentLecturer.user?.firstName} {currentLecturer.user?.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Staff ID: {currentLecturer.staffId}</p>
            <Badge variant={getStatusBadgeVariant(currentLecturer.status)} className="capitalize">
              {currentLecturer.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/lecturers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lecturers
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/lecturers/${id}/courses`)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Course Assignments
          </Button>
          <Button size="sm" onClick={() => router.push(`/lecturers/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Lecturer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic information about the lecturer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{currentLecturer.user?.email}</p>
            </div>
            {currentLecturer.phoneNumber && (
              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p className="text-sm text-muted-foreground">{currentLecturer.phoneNumber}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium">Department</h3>
              <p className="text-sm text-muted-foreground">{currentLecturer.department?.name || "Not assigned"}</p>
            </div>
            <div>
              <h3 className="font-medium">Specialization</h3>
              <p className="text-sm text-muted-foreground">{currentLecturer.specialization}</p>
            </div>
            {currentLecturer.bio && (
              <div>
                <h3 className="font-medium">Bio</h3>
                <p className="text-sm text-muted-foreground">{currentLecturer.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Office & Schedule</CardTitle>
            <CardDescription>Office location and hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentLecturer.officeLocation ? (
              <div>
                <h3 className="font-medium">Office Location</h3>
                <p className="text-sm text-muted-foreground">{currentLecturer.officeLocation}</p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium">Office Location</h3>
                <p className="text-sm text-muted-foreground">Not specified</p>
              </div>
            )}
            {currentLecturer.officeHours ? (
              <div>
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-sm text-muted-foreground">{currentLecturer.officeHours}</p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-sm text-muted-foreground">Not specified</p>
              </div>
            )}
            <div>
              <h3 className="font-medium">Join Date</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentLecturer.joinDate).toLocaleDateString()}</p>
            </div>
            {currentLecturer.endDate && (
              <div>
                <h3 className="font-medium">End Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentLecturer.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
