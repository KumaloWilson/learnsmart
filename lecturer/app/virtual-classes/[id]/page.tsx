"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Video, Loader2, ArrowLeft, Edit, Trash2, Play, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses, useVirtualClassActions, useVirtualClassAttendance } from "@/lib/auth/hooks"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VirtualClassAttendanceTable } from "@/components/virtual-class-attendance-table"

export default function VirtualClassDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { lecturerProfile } = useAuth()
  const { getUpcomingVirtualClasses, virtualClasses, isLoading } = useVirtualClasses()
  const {
    updateVirtualClass,
    deleteVirtualClass,
    isLoading: isActionLoading,
    error,
    success,
  } = useVirtualClassActions()
  const {
    getVirtualClassAttendance,
    getVirtualClassAttendanceStatistics,
    attendance,
    statistics,
    isLoading: isLoadingAttendance,
  } = useVirtualClassAttendance()
  const [virtualClass, setVirtualClass] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStartingClass, setIsStartingClass] = useState(false)
  const [isEndingClass, setIsEndingClass] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && id) {
        try {
          // Fetch virtual classes if not already loaded
          if (virtualClasses.length === 0) {
            await getUpcomingVirtualClasses(lecturerProfile.id)
          }

          // Find the current virtual class
          const currentClass = virtualClasses.find((vc) => vc.id === id)
          if (currentClass) {
            setVirtualClass(currentClass)

            // Fetch attendance data if class is in progress or completed
            if (currentClass.status === "in_progress" || currentClass.status === "completed") {
              await getVirtualClassAttendance(id as string)
              await getVirtualClassAttendanceStatistics(id as string)
            }
          }
        } catch (err) {
          console.error("Error fetching virtual class data:", err)
        }
      }
    }

    fetchData()
  }, [
    lecturerProfile,
    id,
    virtualClasses,
    getUpcomingVirtualClasses,
    getVirtualClassAttendance,
    getVirtualClassAttendanceStatistics,
  ])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
    if (success) {
      toast({
        title: "Success",
        description: success,
      })
      if (isDeleteDialogOpen) {
        router.push("/virtual-classes")
      }
    }
  }, [error, success, toast, router, isDeleteDialogOpen])

  const handleStartClass = async () => {
    if (!virtualClass) return

    setIsStartingClass(true)
    try {
      await updateVirtualClass(virtualClass.id, {
        status: "in_progress",
        actualStartTime: new Date().toISOString(),
      })

      // Update local state
      setVirtualClass({
        ...virtualClass,
        status: "in_progress",
        actualStartTime: new Date().toISOString(),
      })

      // Open the meeting link in a new tab
      window.open(virtualClass.meetingLink, "_blank")
    } catch (err) {
      console.error("Error starting class:", err)
    } finally {
      setIsStartingClass(false)
    }
  }

  const handleEndClass = async () => {
    if (!virtualClass) return

    setIsEndingClass(true)
    try {
      const now = new Date()
      const startTime = new Date(virtualClass.actualStartTime || virtualClass.scheduledStartTime)
      const durationMinutes = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60))

      await updateVirtualClass(virtualClass.id, {
        status: "completed",
        actualEndTime: now.toISOString(),
        duration: durationMinutes,
      })

      // Update local state
      setVirtualClass({
        ...virtualClass,
        status: "completed",
        actualEndTime: now.toISOString(),
        duration: durationMinutes,
      })
    } catch (err) {
      console.error("Error ending class:", err)
    } finally {
      setIsEndingClass(false)
    }
  }

  const handleDeleteClass = async () => {
    if (!virtualClass) return

    try {
      await deleteVirtualClass(virtualClass.id)
    } catch (err) {
      console.error("Error deleting class:", err)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "outline"
      case "in_progress":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const canJoin = (virtualClass: any) => {
    if (!virtualClass) return false

    const now = new Date()
    const classStartTime = new Date(virtualClass.scheduledStartTime)
    const classEndTime = new Date(virtualClass.scheduledEndTime)

    // Can join 15 minutes before start time and until end time
    const joinTime = new Date(classStartTime)
    joinTime.setMinutes(joinTime.getMinutes() - 15)

    return now >= joinTime && now <= classEndTime
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading virtual class details...</p>
        </div>
      </div>
    )
  }

  if (!virtualClass) {
    return (
      <PageContainer title="Virtual Class Details" description="View and manage virtual class">
        <Alert variant="destructive">
          <AlertDescription>Virtual class not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/virtual-classes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Virtual Classes
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={virtualClass.title} description="Virtual class details and management">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/virtual-classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Badge variant={getStatusBadgeVariant(virtualClass.status)}>
            {virtualClass.status.charAt(0).toUpperCase() + virtualClass.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {virtualClass.status === "scheduled" && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/virtual-classes/${virtualClass.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
          {virtualClass.status === "scheduled" && canJoin(virtualClass) && (
            <Button onClick={handleStartClass} disabled={isStartingClass}>
              {isStartingClass ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start Class
                </>
              )}
            </Button>
          )}
          {virtualClass.status === "in_progress" && (
            <>
              <Button variant="outline" asChild>
                <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="mr-2 h-4 w-4" /> Join Class
                </a>
              </Button>
              <Button variant="destructive" onClick={handleEndClass} disabled={isEndingClass}>
                {isEndingClass ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ending...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> End Class
                  </>
                )}
              </Button>
            </>
          )}
          {virtualClass.status === "completed" && virtualClass.recordingUrl && (
            <Button variant="outline" asChild>
              <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="mr-2 h-4 w-4" /> View Recording
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {virtualClass.course?.code || "No course code"} - {virtualClass.course?.name || "No course name"}
            </div>
            <p className="text-sm text-muted-foreground">{virtualClass.semester?.name || "No semester"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-lg font-medium">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formatDate(virtualClass.scheduledStartTime)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Meeting Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{virtualClass.meetingConfig.platform}</div>
            <p className="text-sm text-muted-foreground">Passcode: {virtualClass.meetingConfig.passcode || "None"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="attendance" disabled={virtualClass.status === "scheduled"}>
            Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>Information about this virtual class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-muted-foreground">{virtualClass.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Status Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {virtualClass.status.charAt(0).toUpperCase() + virtualClass.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recording</p>
                    <p className="text-sm text-muted-foreground">{virtualClass.isRecorded ? "Yes" : "No"}</p>
                  </div>
                  {virtualClass.status === "in_progress" && (
                    <div>
                      <p className="text-sm font-medium">Started At</p>
                      <p className="text-sm text-muted-foreground">
                        {virtualClass.actualStartTime ? formatTime(virtualClass.actualStartTime) : "Not started yet"}
                      </p>
                    </div>
                  )}
                  {virtualClass.status === "completed" && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Started At</p>
                        <p className="text-sm text-muted-foreground">
                          {virtualClass.actualStartTime ? formatTime(virtualClass.actualStartTime) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ended At</p>
                        <p className="text-sm text-muted-foreground">
                          {virtualClass.actualEndTime ? formatTime(virtualClass.actualEndTime) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {virtualClass.duration ? `${virtualClass.duration} minutes` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Recording URL</p>
                        <p className="text-sm text-muted-foreground">
                          {virtualClass.recordingUrl ? (
                            <a
                              href={virtualClass.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Recording
                            </a>
                          ) : (
                            "Not available"
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Meeting Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Meeting ID</p>
                    <p className="text-sm text-muted-foreground">{virtualClass.meetingId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Meeting Link</p>
                    <p className="text-sm text-primary">
                      <a
                        href={virtualClass.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {virtualClass.meetingLink}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Platform</p>
                    <p className="text-sm text-muted-foreground">{virtualClass.meetingConfig.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Passcode</p>
                    <p className="text-sm text-muted-foreground">{virtualClass.meetingConfig.passcode || "None"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Student attendance for this virtual class</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAttendance ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {statistics && (
                    <div className="grid gap-6 md:grid-cols-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Present</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{statistics.presentStudents}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{statistics.absentStudents}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{statistics.attendancePercentage}%</div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <VirtualClassAttendanceTable attendance={attendance} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this virtual class?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the virtual class and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} disabled={isActionLoading}>
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
