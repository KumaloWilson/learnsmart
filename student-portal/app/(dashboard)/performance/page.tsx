"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Award, BookOpen, Calendar, Clock, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector } from "@/lib/redux/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetAcademicRecordsQuery,
  useGetStudentAttendanceQuery,
  useGetStudentPerformanceQuery,
} from "@/lib/api/performance"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"

export default function PerformancePage() {
  const { profile } = useAppSelector((state) => state.student)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)

  // Get all attendance records to extract courses and semesters
  const { data: attendanceData, isLoading: attendanceLoading } = useGetStudentAttendanceQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  // Get academic records
  const { data: academicRecords, isLoading: academicRecordsLoading } = useGetAcademicRecordsQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  // Get performance data for selected course and semester
  const { data: performanceData, isLoading: performanceLoading } = useGetStudentPerformanceQuery(
    {
      studentId: profile?.id || "",
      courseId: selectedCourse || "",
      semesterId: selectedSemester || "",
    },
    {
      skip: !profile?.id || !selectedCourse || !selectedSemester,
    },
  )

  // Extract unique courses and semesters from attendance data
  const courses = attendanceData
    ? [...new Map(attendanceData.map((item) => [item.course.id, item.course])).values()]
    : []

  const semesters = attendanceData
    ? [...new Map(attendanceData.map((item) => [item.semester.id, item.semester])).values()]
    : []

  // Set default selections when data is loaded
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id)
    }
    if (semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0].id)
    }
  }, [courses, semesters, selectedCourse, selectedSemester])

  // Get performance data for the selected course
  const coursePerformance = performanceData?.[0]

  // Get academic record for the selected semester
  const academicRecord = academicRecords?.find((record) => record.semesterId === selectedSemester)

  // Function to get color based on performance category
  const getPerformanceColor = (category: string) => {
    switch (category) {
      case "excellent":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
      case "average":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "poor":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300"
      case "failing":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Function to get GPA color
  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.5) return "text-yellow-600"
    if (gpa >= 2.0) return "text-orange-600"
    return "text-red-600"
  }

  const isLoading = attendanceLoading || performanceLoading || academicRecordsLoading

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Performance Tracking</h1>
          <div className="flex items-center gap-2">
            <Select value={selectedCourse || ""} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester || ""} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        {isLoading ? (
          <div className="grid gap-6">
            <section>
              <h2 className="text-lg font-medium mb-4">Overview</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="dashboard-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <Skeleton className="h-10 w-48 mb-4" />
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        ) : (
          <div className="grid gap-6">
            <section>
              <h2 className="text-lg font-medium mb-4">Overview</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="dashboard-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Award className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getGpaColor(academicRecord?.gpa || 0)}`}>
                      {academicRecord?.gpa.toFixed(2) || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">CGPA: {academicRecord?.cgpa.toFixed(2) || "N/A"}</p>
                  </CardContent>
                </Card>

                <Card className="dashboard-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Course Performance</CardTitle>
                    <div
                      className={`p-1 rounded-full ${
                        coursePerformance
                          ? getPerformanceColor(coursePerformance.performanceCategory)
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {coursePerformance?.overallPerformance >= 70 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {coursePerformance ? `${coursePerformance.overallPerformance}%` : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {coursePerformance
                        ? `${coursePerformance.performanceCategory.charAt(0).toUpperCase()}${coursePerformance.performanceCategory.slice(
                            1,
                          )}`
                        : "No data available"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="dashboard-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                    <div
                      className={`p-1 rounded-full ${
                        coursePerformance?.attendancePercentage >= 80
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-yellow-100 dark:bg-yellow-900"
                      }`}
                    >
                      <Clock
                        className={`h-4 w-4 ${
                          coursePerformance?.attendancePercentage >= 80
                            ? "text-green-700 dark:text-green-300"
                            : "text-yellow-700 dark:text-yellow-300"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {coursePerformance ? `${coursePerformance.attendancePercentage}%` : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {coursePerformance?.attendancePercentage >= 90
                        ? "Excellent attendance"
                        : coursePerformance?.attendancePercentage >= 80
                          ? "Good attendance"
                          : coursePerformance?.attendancePercentage >= 70
                            ? "Average attendance"
                            : "Needs improvement"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="dashboard-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Credits</CardTitle>
                    <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <BookOpen className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{academicRecord ? academicRecord.earnedCredits : "N/A"}</div>
                    <p className="text-xs text-muted-foreground">
                      {academicRecord ? `of ${academicRecord.totalCredits} total credits` : "No credit data available"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="performance">Course Performance</TabsTrigger>
                  <TabsTrigger value="academic">Academic Records</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                  {coursePerformance ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                          <CardDescription>
                            {coursePerformance.course.code} - {coursePerformance.course.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Overall Performance</span>
                                <span className="text-sm font-medium">{coursePerformance.overallPerformance}%</span>
                              </div>
                              <Progress value={coursePerformance.overallPerformance} className="h-2 mb-1" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className={getPerformanceColor(coursePerformance.performanceCategory)}
                                >
                                  {coursePerformance.performanceCategory.charAt(0).toUpperCase() +
                                    coursePerformance.performanceCategory.slice(1)}
                                </Badge>
                                <span>
                                  Last updated: {format(parseISO(coursePerformance.lastUpdated), "MMM d, yyyy")}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Attendance</span>
                                <span className="text-sm font-medium">{coursePerformance.attendancePercentage}%</span>
                              </div>
                              <Progress value={coursePerformance.attendancePercentage} className="h-2" />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Assignments</span>
                                <span className="text-sm font-medium">{coursePerformance.assignmentAverage}%</span>
                              </div>
                              <Progress value={coursePerformance.assignmentAverage} className="h-2" />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Quizzes</span>
                                <span className="text-sm font-medium">{coursePerformance.quizAverage}%</span>
                              </div>
                              <Progress value={coursePerformance.quizAverage} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Strengths & Areas for Improvement</CardTitle>
                          <CardDescription>Personalized feedback on your performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <h3 className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                                <TrendingUp className="h-4 w-4" />
                                Strengths
                              </h3>
                              <p className="text-sm text-green-700/80 dark:text-green-400/80">
                                {coursePerformance.strengths || "No strengths identified yet."}
                              </p>
                            </div>

                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <h3 className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                                <TrendingDown className="h-4 w-4" />
                                Areas for Improvement
                              </h3>
                              <p className="text-sm text-red-700/80 dark:text-red-400/80">
                                {coursePerformance.weaknesses || "No areas for improvement identified yet."}
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                              <h3 className="text-sm font-medium mb-2">AI Analysis</h3>
                              <div className="text-sm text-muted-foreground">
                                <p>
                                  Based on your performance data, you're showing{" "}
                                  {coursePerformance.performanceCategory === "excellent" ||
                                  coursePerformance.performanceCategory === "good"
                                    ? "strong progress"
                                    : coursePerformance.performanceCategory === "average"
                                      ? "steady progress"
                                      : "some challenges"}{" "}
                                  in this course.
                                </p>
                                <p className="mt-2">
                                  {coursePerformance.aiAnalysis.assignmentDetails.length === 0 &&
                                  coursePerformance.aiAnalysis.quizDetails.length === 0
                                    ? "Complete more assignments and quizzes to receive detailed AI analysis of your performance patterns."
                                    : "Your performance data is being analyzed to provide personalized insights."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Performance Data Available</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                          There is no performance data available for the selected course and semester. This could be
                          because you haven't completed any assessments yet or the course has just started.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="academic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Records</CardTitle>
                      <CardDescription>Your academic performance across semesters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {academicRecords && academicRecords.length > 0 ? (
                        <div className="space-y-6">
                          {academicRecords.map((record) => (
                            <div
                              key={record.id}
                              className={`p-4 rounded-lg border ${
                                record.semesterId === selectedSemester ? "bg-primary/5 border-primary/20" : "bg-card"
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-medium">{record.semester.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Academic Year: {record.semester.academicYear}
                                  </p>
                                </div>
                                <Badge
                                  className={`mt-2 md:mt-0 ${
                                    record.gpa >= 3.5
                                      ? "bg-green-500"
                                      : record.gpa >= 3.0
                                        ? "bg-blue-500"
                                        : record.gpa >= 2.5
                                          ? "bg-yellow-500"
                                          : record.gpa >= 2.0
                                            ? "bg-orange-500"
                                            : "bg-red-500"
                                  }`}
                                >
                                  GPA: {record.gpa.toFixed(2)}
                                </Badge>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">GPA</span>
                                    <span className="text-sm font-medium">{record.gpa.toFixed(2)}</span>
                                  </div>
                                  <Progress
                                    value={(record.gpa / 4) * 100}
                                    className="h-2 mb-3"
                                    indicatorClassName={
                                      record.gpa >= 3.5
                                        ? "bg-green-500"
                                        : record.gpa >= 3.0
                                          ? "bg-blue-500"
                                          : record.gpa >= 2.5
                                            ? "bg-yellow-500"
                                            : record.gpa >= 2.0
                                              ? "bg-orange-500"
                                              : "bg-red-500"
                                    }
                                  />

                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">CGPA</span>
                                    <span className="text-sm font-medium">{record.cgpa.toFixed(2)}</span>
                                  </div>
                                  <Progress
                                    value={(record.cgpa / 4) * 100}
                                    className="h-2"
                                    indicatorClassName={
                                      record.cgpa >= 3.5
                                        ? "bg-green-500"
                                        : record.cgpa >= 3.0
                                          ? "bg-blue-500"
                                          : record.cgpa >= 2.5
                                            ? "bg-yellow-500"
                                            : record.cgpa >= 2.0
                                              ? "bg-orange-500"
                                              : "bg-red-500"
                                    }
                                  />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Credits Earned</span>
                                    <span className="text-sm font-medium">
                                      {record.earnedCredits} / {record.totalCredits}
                                    </span>
                                  </div>
                                  <Progress
                                    value={(record.earnedCredits / record.totalCredits) * 100}
                                    className="h-2 mb-3"
                                  />

                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-1">Remarks</h4>
                                    <p className="text-sm text-muted-foreground">{record.remarks}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No academic records available.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  {coursePerformance ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Personalized Recommendations</CardTitle>
                        <CardDescription>
                          Based on your performance in {coursePerformance.course.code} - {coursePerformance.course.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                              <Award className="h-4 w-4" />
                              Recommendations for Improvement
                            </h3>
                            <div className="text-sm text-blue-700/80 dark:text-blue-400/80 space-y-2">
                              {coursePerformance.recommendations ? (
                                <p>{coursePerformance.recommendations}</p>
                              ) : (
                                <p>No specific recommendations available yet.</p>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-card rounded-lg border">
                              <h3 className="text-sm font-medium mb-3">Focus Areas</h3>
                              <ul className="space-y-2 text-sm">
                                {coursePerformance.assignmentAverage < 70 && (
                                  <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                    <span>
                                      <span className="font-medium">Assignments:</span> Your assignment average is below
                                      70%. Focus on improving assignment submissions.
                                    </span>
                                  </li>
                                )}
                                {coursePerformance.quizAverage < 70 && (
                                  <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                    <span>
                                      <span className="font-medium">Quizzes:</span> Your quiz average is below 70%.
                                      Focus on improving quiz performance.
                                    </span>
                                  </li>
                                )}
                                {coursePerformance.attendancePercentage < 80 && (
                                  <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                    <span>
                                      <span className="font-medium">Attendance:</span> Your attendance is below 80%.
                                      Improve your class attendance.
                                    </span>
                                  </li>
                                )}
                                {coursePerformance.assignmentAverage >= 70 &&
                                  coursePerformance.quizAverage >= 70 &&
                                  coursePerformance.attendancePercentage >= 80 && (
                                    <li className="flex items-start gap-2">
                                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                      <span>
                                        You're performing well in all areas. Continue your current study habits and look
                                        for opportunities to excel further.
                                      </span>
                                    </li>
                                  )}
                              </ul>
                            </div>

                            <div className="p-4 bg-card rounded-lg border">
                              <h3 className="text-sm font-medium mb-3">Resource Recommendations</h3>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                  <span>
                                    <span className="font-medium">Study Materials:</span> Access additional study
                                    materials in the course content section.
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                  <span>
                                    <span className="font-medium">Office Hours:</span> Attend your instructor's office
                                    hours for personalized help.
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Award className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                  <span>
                                    <span className="font-medium">Practice Quizzes:</span> Take practice quizzes to
                                    improve your test-taking skills.
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                          Recommendations will be available once you have performance data for the selected course and
                          semester.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
