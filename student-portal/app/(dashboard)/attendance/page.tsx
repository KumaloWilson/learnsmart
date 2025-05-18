"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, XCircle } from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useGetDashboardQuery } from "@/lib/api/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function AttendancePage() {
  const { profile } = useAppSelector((state) => state.student)

  const { data: dashboardData, isLoading } = useGetDashboardQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  // Group attendance records by course
  const attendanceByCourseName =
    dashboardData?.attendanceSummary?.reduce(
      (acc, record) => {
        const courseName = record.course.name
        if (!acc[courseName]) {
          acc[courseName] = []
        }
        acc[courseName].push(record)
        return acc
      },
      {} as Record<string, typeof dashboardData.attendanceSummary>,
    ) || {}

  // Calculate overall attendance percentage
  const calculateOverallAttendance = () => {
    if (!dashboardData?.attendanceSummary?.length) return 0

    const presentCount = dashboardData.attendanceSummary.filter((record) => record.isPresent).length
    return Math.round((presentCount / dashboardData.attendanceSummary.length) * 100)
  }

  const overallAttendance = calculateOverallAttendance()

  // Get performance impact from performance summary
  const getPerformanceImpact = () => {
    if (!dashboardData?.performanceSummary?.[0]) return null

    const performanceSummary = dashboardData.performanceSummary[0]
    if (performanceSummary.attendancePercentage >= 90) {
      return {
        status: "positive",
        message: "Your excellent attendance is positively impacting your performance.",
      }
    } else if (performanceSummary.attendancePercentage >= 75) {
      return {
        status: "neutral",
        message: "Your good attendance is helping your academic performance.",
      }
    } else {
      return {
        status: "negative",
        message: "Your attendance needs improvement and may be affecting your performance.",
      }
    }
  }

  const performanceImpact = getPerformanceImpact()

  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Records</h1>
          <p className="text-muted-foreground">Track your class attendance and performance impact</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold mb-2">{overallAttendance}%</div>
                <Progress value={overallAttendance} className="h-2 mb-1" />
                <p className="text-sm text-muted-foreground mt-2">
                  {dashboardData?.attendanceSummary?.filter((record) => record.isPresent).length || 0} present out of{" "}
                  {dashboardData?.attendanceSummary?.length || 0} classes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Impact</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : performanceImpact ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={
                      performanceImpact.status === "positive"
                        ? "bg-green-500"
                        : performanceImpact.status === "neutral"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {performanceImpact.status === "positive"
                      ? "Positive"
                      : performanceImpact.status === "neutral"
                        ? "Neutral"
                        : "Needs Improvement"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{performanceImpact.message}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No performance data available yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Students are required to maintain at least 75% attendance in all courses. Falling below this threshold may
              affect your grades and eligibility for exams.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          {Object.keys(attendanceByCourseName).map((courseName) => (
            <TabsTrigger key={courseName} value={courseName}>
              {courseName}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Complete history of your class attendance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : dashboardData?.attendanceSummary?.length ? (
                <div className="space-y-1">
                  {dashboardData.attendanceSummary.map((record) => (
                    <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-muted">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{record.topic}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{record.course.name}</p>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.date), "EEEE, MMMM d, yyyy")}
                            </p>
                          </div>
                          {record.notes && <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>}
                        </div>
                      </div>
                      <Badge variant={record.isPresent ? "default" : "destructive"} className="flex items-center gap-1">
                        {record.isPresent ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Absent</span>
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No attendance records found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(attendanceByCourseName).map(([courseName, records]) => (
          <TabsContent key={courseName} value={courseName} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{courseName}</CardTitle>
                <CardDescription>Attendance records for this course</CardDescription>
              </CardHeader>
              <CardContent>
                {records.length > 0 ? (
                  <div className="space-y-1">
                    {records.map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-muted">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{record.topic}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.date), "EEEE, MMMM d, yyyy")}
                            </p>
                            {record.notes && <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>}
                          </div>
                        </div>
                        <Badge
                          variant={record.isPresent ? "default" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          {record.isPresent ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Present</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Absent</span>
                            </>
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No attendance records found for this course.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
