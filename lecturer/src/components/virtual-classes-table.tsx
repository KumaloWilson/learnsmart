"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, Clock, Users, Video, FileText, ExternalLink, BarChart2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { lecturerService } from "@/lib/api-services"

interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  actualStartTime?: string
  actualEndTime?: string
  courseId: string
  courseName: string
  courseCode: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  isRecorded: boolean
  recordingUrl?: string
  meetingLink: string
  attendanceCount: number
  totalStudents: number
}

export function VirtualClassesTable() {
  const [virtualClasses, setVirtualClasses] = useState<VirtualClass[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchVirtualClasses = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const classes = await lecturerService.getVirtualClasses(lecturerProfile.id)
        setVirtualClasses(classes)
      } catch (error) {
        console.error("Failed to fetch virtual classes:", error)
        toast({
          title: "Error",
          description: "Failed to load virtual classes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVirtualClasses()
  }, [user, toast])

  // Get unique courses for filter dropdown
  const courses =
    virtualClasses.length > 0
      ? [...new Set(virtualClasses.map((virtualClass) => virtualClass.courseId))].map((id) => {
          const course = virtualClasses.find((vc) => vc.courseId === id)
          return { id, name: course?.courseName }
        })
      : []

  // Filter virtual classes based on search term and filters
  const filteredVirtualClasses = virtualClasses.filter((virtualClass) => {
    const matchesSearch =
      virtualClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      virtualClass.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      virtualClass.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      virtualClass.courseCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = courseFilter === "all" || virtualClass.courseId === courseFilter

    const matchesStatus = statusFilter === "all" || virtualClass.status === statusFilter

    return matchesSearch && matchesCourse && matchesStatus
  })

  // Separate upcoming and past classes
  const now = new Date()
  const upcomingClasses = filteredVirtualClasses
    .filter((vc) => new Date(vc.scheduledStartTime) > now || vc.status === "in_progress")
    .sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())

  const pastClasses = filteredVirtualClasses
    .filter((vc) => new Date(vc.scheduledStartTime) <= now && vc.status !== "in_progress")
    .sort((a, b) => new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime())

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Tabs defaultValue="upcoming">
          <TabsList>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </TabsList>
          <div className="mt-4 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search virtual classes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="course-filter" className="whitespace-nowrap">
            Course:
          </Label>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger id="course-filter" className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="whitespace-nowrap">
            Status:
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Classes ({upcomingClasses.length})</TabsTrigger>
          <TabsTrigger value="past">Past Classes ({pastClasses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingClasses.length === 0 ? (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-lg font-semibold">No upcoming classes found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or schedule a new virtual class.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {upcomingClasses.map((virtualClass) => (
                <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} isUpcoming={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastClasses.length === 0 ? (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-lg font-semibold">No past classes found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters to see past virtual classes.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {pastClasses.map((virtualClass) => (
                <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} isUpcoming={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VirtualClassCard({ virtualClass, isUpcoming }: { virtualClass: VirtualClass; isUpcoming: boolean }) {
  let statusBadge

  switch (virtualClass.status) {
    case "scheduled":
      statusBadge = <Badge variant="outline">Scheduled</Badge>
      break
    case "in_progress":
      statusBadge = <Badge variant="default">In Progress</Badge>
      break
    case "completed":
      statusBadge = <Badge variant="secondary">Completed</Badge>
      break
    case "cancelled":
      statusBadge = <Badge variant="destructive">Cancelled</Badge>
      break
    default:
      statusBadge = <Badge variant="outline">Unknown</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
            <CardDescription>{virtualClass.courseName}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {virtualClass.description && <p className="text-sm text-muted-foreground">{virtualClass.description}</p>}

          <div className="flex items-center text-sm">
            <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(virtualClass.scheduledStartTime)}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="mr-1.5 h-4 w-4 text-muted-foreground" />
            <span>
              {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)} (
              {Math.round(
                (new Date(virtualClass.scheduledEndTime).getTime() -
                  new Date(virtualClass.scheduledStartTime).getTime()) /
                  (1000 * 60),
              )}{" "}
              mins)
            </span>
          </div>

          {virtualClass.status === "completed" && (
            <div className="flex items-center text-sm">
              <Users className="mr-1.5 h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{virtualClass.attendanceCount}</span> of {virtualClass.totalStudents}{" "}
                students attended ({Math.round((virtualClass.attendanceCount / virtualClass.totalStudents) * 100)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          {isUpcoming ? (
            <>
              <Link href={`/virtual-classes/${virtualClass.id}/edit`}>
                <Button size="sm" variant="outline">
                  Edit Details
                </Button>
              </Link>
              <Link href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
                  <Video className="mr-1.5 h-4 w-4" />
                  Join Class
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/virtual-classes/${virtualClass.id}`}>
                <Button size="sm" variant="outline">
                  <FileText className="mr-1.5 h-4 w-4" />
                  View Details
                </Button>
              </Link>
              {virtualClass.isRecorded && virtualClass.recordingUrl ? (
                <Link href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="secondary">
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    View Recording
                  </Button>
                </Link>
              ) : (
                <Link href={`/virtual-classes/${virtualClass.id}/analytics`}>
                  <Button size="sm" variant="secondary">
                    <BarChart2 className="mr-1.5 h-4 w-4" />
                    Analytics
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
