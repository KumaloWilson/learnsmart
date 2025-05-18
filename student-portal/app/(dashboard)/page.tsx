"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationCenter } from "@/components/notification-center"
import Link from "next/link"
import { StudentInfo } from "@/components/dashboard/student-info"
import { UpcomingClasses } from "@/components/dashboard/upcoming-classes"
import { PerformanceSummary } from "@/components/dashboard/performance-summary"
import { useAppSelector } from "@/lib/redux/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDashboardQuery } from "@/lib/api/dashboard"
import { useEffect } from "react"

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const { profile, isLoading: profileLoading } = useAppSelector((state) => state.student)

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch,
  } = useGetDashboardQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  // Refetch dashboard data when profile ID becomes available
  useEffect(() => {
    if (profile?.id) {
      refetch()
    }
  }, [profile?.id, refetch])

  const isLoading = profileLoading || dashboardLoading

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <NotificationCenter />
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <div className="grid gap-6">
          <section className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-72" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold gradient-heading">
                      Welcome back, {user?.firstName || "Student"}!
                    </h2>
                    <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
                  </>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dashboard-card border-l-4 border-l-blue-500 dark:border-l-blue-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-8 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardData?.enrollments?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.enrollments?.length === 1
                          ? "1 course in progress"
                          : `${dashboardData?.enrollments?.length || 0} courses in progress`}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-amber-500 dark:border-l-amber-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                  <div className="p-1 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-8 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{dashboardData?.upcomingVirtualClasses?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.upcomingVirtualClasses?.[0]?.title
                          ? `Next: ${dashboardData.upcomingVirtualClasses[0].title}`
                          : "No upcoming classes"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-green-500 dark:border-l-green-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {dashboardData?.performanceSummary?.[0]?.overallPerformance
                          ? `${dashboardData.performanceSummary[0].overallPerformance}%`
                          : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.performanceSummary?.[0]?.performanceCategory
                          ? `Overall: ${dashboardData.performanceSummary[0].performanceCategory}`
                          : "No performance data yet"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-purple-500 dark:border-l-purple-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {dashboardData?.performanceSummary?.[0]?.attendancePercentage
                          ? `${dashboardData.performanceSummary[0].attendancePercentage}%`
                          : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.attendanceSummary?.length
                          ? `${dashboardData.attendanceSummary.length} classes attended`
                          : "No attendance records"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3 animate-fade-in">
            <div className="md:col-span-2">
              <Tabs defaultValue="in-progress" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">My Courses</h2>
                  <TabsList>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="in-progress" className="space-y-4">
                  {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-video w-full">
                            <Skeleton className="h-full w-full" />
                          </div>
                          <CardHeader>
                            <Skeleton className="h-5 w-48 mb-1" />
                            <Skeleton className="h-4 w-32" />
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                            <Skeleton className="h-2 w-full" />
                            <div className="flex items-center justify-between pt-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : dashboardData?.enrollments?.length ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {dashboardData.enrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="overflow-hidden course-card">
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={`/abstract-geometric-shapes.png?height=100&width=200&query=${enrollment.course.name}`}
                              alt={enrollment.course.name}
                              className="object-cover w-full h-full transition-transform hover:scale-105"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle className="line-clamp-1">{enrollment.course.name}</CardTitle>
                            <CardDescription>{enrollment.course.code}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">
                                {dashboardData.performanceSummary?.[0]?.overallPerformance || 0}%
                              </span>
                            </div>
                            <Progress
                              value={dashboardData.performanceSummary?.[0]?.overallPerformance || 0}
                              className="h-2"
                            />
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{enrollment.course.creditHours} credit hours</span>
                              </div>
                              <Button size="sm" className="transition-all" asChild>
                                <Link href={`/courses/${enrollment.courseId}`}>Continue</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No courses in progress.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No completed courses yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <StudentInfo />
              <UpcomingClasses />
              <PerformanceSummary />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
