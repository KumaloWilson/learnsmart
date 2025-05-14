"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MonitorPlay, MoreHorizontal, Plus, Users, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateVirtualClassDialog } from "@/components/create-virtual-class-dialog"

export default function VirtualClassesPage() {
  const { lecturerProfile } = useAuth()
  const { getUpcomingVirtualClasses, virtualClasses, isLoading, error } = useVirtualClasses()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchVirtualClasses = async () => {
      if (lecturerProfile?.id) {
        try {
          await getUpcomingVirtualClasses(lecturerProfile.id)
        } catch (err) {
          console.error("Error fetching virtual classes:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchVirtualClasses()
  }, [lecturerProfile, getUpcomingVirtualClasses])

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

  const isUpcoming = (startTime: string) => {
    const now = new Date()
    const classTime = new Date(startTime)
    return classTime > now
  }

  const canJoin = (startTime: string, endTime: string) => {
    const now = new Date()
    const classStartTime = new Date(startTime)
    const classEndTime = new Date(endTime)

    // Can join 15 minutes before start time and until end time
    const joinTime = new Date(classStartTime)
    joinTime.setMinutes(joinTime.getMinutes() - 15)

    return now >= joinTime && now <= classEndTime
  }

  if (isInitialLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading virtual classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Virtual Classes" description="Manage your online classes and lectures">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Virtual Classes" description="Manage your online classes and lectures">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedule
          </Button>
          <Button variant="outline" className="gap-2">
            <MonitorPlay className="h-4 w-4" /> Recordings
          </Button>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Create Class
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {virtualClasses
                .filter((virtualClass) => isUpcoming(virtualClass.scheduledStartTime))
                .map((virtualClass) => (
                  <Card
                    key={virtualClass.id}
                    className={
                      canJoin(virtualClass.scheduledStartTime, virtualClass.scheduledEndTime)
                        ? "border-blue-200 dark:border-blue-800"
                        : ""
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant={getStatusBadgeVariant(virtualClass.status)}>
                          {virtualClass.status.charAt(0).toUpperCase() + virtualClass.status.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/virtual-classes/${virtualClass.id}/edit`}>Edit Class</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancel Class</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
                      <CardDescription>
                        {virtualClass.course?.code || "No course code"} -{" "}
                        {virtualClass.course?.name || "No course name"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(virtualClass.scheduledStartTime)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Platform: {virtualClass.meetingConfig.platform}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {canJoin(virtualClass.scheduledStartTime, virtualClass.scheduledEndTime) ? (
                        <Button className="w-full gap-2" asChild>
                          <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4" /> Start Class
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full gap-2" asChild>
                          <Link href={`/virtual-classes/${virtualClass.id}`}>
                            <Calendar className="h-4 w-4" /> View Details
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

              {virtualClasses.filter((virtualClass) => isUpcoming(virtualClass.scheduledStartTime)).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No upcoming virtual classes scheduled</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create a Virtual Class
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {virtualClasses
                .filter((virtualClass) => virtualClass.status === "in_progress")
                .map((virtualClass) => (
                  <Card key={virtualClass.id} className="border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="default">In Progress</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>End Class</DropdownMenuItem>
                            <DropdownMenuItem>View Attendance</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
                      <CardDescription>
                        {virtualClass.course?.code || "No course code"} -{" "}
                        {virtualClass.course?.name || "No course name"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(virtualClass.scheduledStartTime)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Platform: {virtualClass.meetingConfig.platform}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full gap-2" asChild>
                        <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4" /> Join Class
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

              {virtualClasses.filter((virtualClass) => virtualClass.status === "in_progress").length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No active virtual classes at the moment</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {virtualClasses
                .filter((virtualClass) => virtualClass.status === "completed")
                .map((virtualClass) => (
                  <Card key={virtualClass.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="secondary">Completed</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/virtual-classes/${virtualClass.id}/attendance`}>View Attendance</Link>
                            </DropdownMenuItem>
                            {virtualClass.recordingUrl && (
                              <DropdownMenuItem asChild>
                                <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                                  View Recording
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
                      <CardDescription>
                        {virtualClass.course?.code || "No course code"} -{" "}
                        {virtualClass.course?.name || "No course name"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(virtualClass.scheduledStartTime)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Duration: {virtualClass.duration || "N/A"} minutes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {virtualClass.recordingUrl ? (
                        <Button variant="secondary" className="w-full gap-2" asChild>
                          <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                            <MonitorPlay className="h-4 w-4" /> View Recording
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full gap-2" asChild>
                          <Link href={`/virtual-classes/${virtualClass.id}/attendance`}>
                            <Users className="h-4 w-4" /> View Attendance
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

              {virtualClasses.filter((virtualClass) => virtualClass.status === "completed").length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <MonitorPlay className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No past virtual classes found</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateVirtualClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        lecturerId={lecturerProfile?.id || ""}
      />
    </PageContainer>
  )
}
