"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, ExternalLink, Video } from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useGetVirtualClassesQuery, useJoinVirtualClassMutation } from "@/lib/api/course"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceToNow, isPast, isFuture, isAfter, isBefore, parseISO } from "date-fns"
import { toast } from "@/components/ui/use-toast"

export default function VirtualClassroomPage() {
  const { profile } = useAppSelector((state) => state.student)
  const [courseFilter, setCourseFilter] = useState<string | undefined>(undefined)

  const { data: virtualClasses, isLoading } = useGetVirtualClassesQuery(
    {
      studentId: profile?.id || "",
      courseId: courseFilter,
    },
    { skip: !profile?.id },
  )

  const [joinVirtualClass, { isLoading: isJoining }] = useJoinVirtualClassMutation()

  // Get the current date and time
  const now = new Date()

  // Check if a class is happening now
  const isClassLive = (startTime: string, endTime: string) => {
    const start = parseISO(startTime)
    const end = parseISO(endTime)
    return isAfter(now, start) && isBefore(now, end)
  }

  // Sort classes by start time
  const sortedClasses = virtualClasses
    ? [...virtualClasses].sort((a, b) => {
        return new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime()
      })
    : []

  // Filter classes
  const liveClasses = sortedClasses.filter((vc) => isClassLive(vc.scheduledStartTime, vc.scheduledEndTime))
  const upcomingClasses = sortedClasses.filter((vc) => isFuture(new Date(vc.scheduledStartTime)))
  const pastClasses = sortedClasses.filter((vc) => isPast(new Date(vc.scheduledEndTime)))

  // Get unique courses for filtering
  const courses = virtualClasses
    ? [...new Map(virtualClasses.map((item) => [item.course.id, item.course])).values()]
    : []

  // Handle joining a virtual class
  const handleJoinClass = async (virtualClassId: string) => {
    if (!profile?.id) return

    try {
      await joinVirtualClass({
        virtualClassId,
        studentProfileId: profile.id,
      }).unwrap()

      toast({
        title: "Joined class successfully",
        description: "Your attendance has been recorded",
      })

      // Open the meeting link in a new tab
      const virtualClass = virtualClasses?.find((vc) => vc.id === virtualClassId)
      if (virtualClass?.meetingLink) {
        window.open(virtualClass.meetingLink, "_blank")
      }
    } catch (error) {
      toast({
        title: "Failed to join class",
        description: "There was an error recording your attendance",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Virtual Classroom</h1>
          <p className="text-muted-foreground">Join live classes or watch recordings of past sessions</p>
        </div>

        <div className="mt-4 md:mt-0">
          <select
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={courseFilter || ""}
            onChange={(e) => setCourseFilter(e.target.value || undefined)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code}: {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="past">Past Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : liveClasses.length > 0 ? (
            <>
              <h2 className="text-lg font-medium mb-3">Live Now</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {liveClasses.map((virtualClass) => (
                  <Card key={virtualClass.id} className="overflow-hidden border-red-200 dark:border-red-800">
                    <CardHeader className="pb-2 bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{virtualClass.title}</CardTitle>
                        <Badge className="bg-red-500 hover:bg-red-600">Live</Badge>
                      </div>
                      <CardDescription>{virtualClass.course.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      <p className="text-sm">{virtualClass.description}</p>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(virtualClass.scheduledStartTime), "EEEE, MMMM d")}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(virtualClass.scheduledStartTime), "h:mm a")} -{" "}
                          {format(new Date(virtualClass.scheduledEndTime), "h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {virtualClass.lecturerProfile.user.firstName.charAt(0)}
                            {virtualClass.lecturerProfile.user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                          {virtualClass.lecturerProfile.user.lastName}
                        </span>
                      </div>

                      <Button
                        className="w-full mt-2"
                        onClick={() => handleJoinClass(virtualClass.id)}
                        disabled={isJoining || virtualClass.attended}
                      >
                        {virtualClass.attended ? (
                          <>Already Joined</>
                        ) : (
                          <>
                            Join Now <ExternalLink className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : null}

          <h2 className="text-lg font-medium mb-3">Upcoming Classes</h2>
          {upcomingClasses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingClasses.map((virtualClass) => (
                <Card key={virtualClass.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{virtualClass.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {virtualClass.course.code}
                      </Badge>
                    </div>
                    <CardDescription>{virtualClass.course.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm">{virtualClass.description}</p>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(virtualClass.scheduledStartTime), "EEEE, MMMM d")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(virtualClass.scheduledStartTime), "h:mm a")} -{" "}
                        {format(new Date(virtualClass.scheduledEndTime), "h:mm a")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {virtualClass.lecturerProfile.user.firstName.charAt(0)}
                          {virtualClass.lecturerProfile.user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                        {virtualClass.lecturerProfile.user.lastName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        Starts {formatDistanceToNow(new Date(virtualClass.scheduledStartTime), { addSuffix: true })}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`data:text/calendar;charset=utf-8,${encodeURIComponent(
                            `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${virtualClass.title}
DESCRIPTION:${virtualClass.description}
LOCATION:${virtualClass.meetingLink}
DTSTART:${new Date(virtualClass.scheduledStartTime)
                              .toISOString()
                              .replace(/[-:]/g, "")
                              .replace(/\.\d{3}/g, "")}
DTEND:${new Date(virtualClass.scheduledEndTime)
                              .toISOString()
                              .replace(/[-:]/g, "")
                              .replace(/\.\d{3}/g, "")}
END:VEVENT
END:VCALENDAR`,
                          )}`}
                          download={`${virtualClass.title.replace(/\s+/g, "-")}.ics`}
                        >
                          Add to Calendar
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Classes</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are no upcoming virtual classes scheduled at the moment. Check back later or contact your
                    instructor.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <h2 className="text-lg font-medium mb-3">Past Classes</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pastClasses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastClasses.map((virtualClass) => (
                <Card key={virtualClass.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{virtualClass.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {virtualClass.course.code}
                      </Badge>
                    </div>
                    <CardDescription>{virtualClass.course.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm">{virtualClass.description}</p>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(virtualClass.scheduledStartTime), "EEEE, MMMM d")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(virtualClass.scheduledStartTime), "h:mm a")} -{" "}
                        {format(new Date(virtualClass.scheduledEndTime), "h:mm a")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {virtualClass.lecturerProfile.user.firstName.charAt(0)}
                          {virtualClass.lecturerProfile.user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                        {virtualClass.lecturerProfile.user.lastName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {virtualClass.attended && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Attended
                        </Badge>
                      )}
                      {!virtualClass.attended && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Missed
                        </Badge>
                      )}
                    </div>

                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      disabled={!virtualClass.recordingUrl}
                      asChild={!!virtualClass.recordingUrl}
                    >
                      {virtualClass.recordingUrl ? (
                        <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                          Watch Recording
                        </a>
                      ) : (
                        <span>Recording Unavailable</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Past Classes</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are no past virtual classes available. Check the upcoming classes tab for scheduled sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
