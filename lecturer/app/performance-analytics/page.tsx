"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, AlertCircle, Search, Filter, BarChart3, Users, BookOpen } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"
import { useStudentPerformances, usePerformanceAnalysis } from "@/lib/auth/hooks"
import type { PerformanceFilterDto, StudentPerformance } from "@/lib/auth/types"
import { PerformanceDistributionChart } from "@/components/performance-distribution-chart"
import { PerformanceMetricsChart } from "@/components/performance-metrics-chart"
import { PerformanceCategoryChart } from "@/components/performance-category-chart"
import { format } from "date-fns"

export default function PerformanceAnalyticsPage() {
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading: isCoursesLoading } = useCourses()
  const {
    getStudentPerformances,
    performances,
    isLoading: isPerformancesLoading,
    error: performancesError,
  } = useStudentPerformances()
  const {
    generateClassAnalysis,
    classAnalysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
  } = usePerformanceAnalysis()

  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedSemester, setSelectedSemester] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [performanceRange, setPerformanceRange] = useState<[number, number]>([0, 100])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [filteredPerformances, setFilteredPerformances] = useState<StudentPerformance[]>([])
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)

  // Get unique semesters from courses
  const semesters = courses
    ? [
        ...new Set(
          courses
            .map((course) => ({ id: course.semesterId, name: course.semesterName }))
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i),
        ),
      ]
    : []

  useEffect(() => {
    if (lecturerProfile?.id) {
      getCourses(lecturerProfile.id)
    }
  }, [lecturerProfile, getCourses])

  useEffect(() => {
    const fetchPerformances = async () => {
      if (!lecturerProfile?.id) return

      const filters: PerformanceFilterDto = {}

      if (selectedCourse !== "all") {
        filters.courseId = selectedCourse
      }

      if (selectedSemester !== "all") {
        filters.semesterId = selectedSemester
      }

      if (selectedCategory !== "all") {
        filters.performanceCategory = selectedCategory
      }

      if (performanceRange[0] > 0) {
        filters.minOverallPerformance = performanceRange[0]
      }

      if (performanceRange[1] < 100) {
        filters.maxOverallPerformance = performanceRange[1]
      }

      await getStudentPerformances(filters)
    }

    fetchPerformances()
  }, [lecturerProfile, selectedCourse, selectedSemester, selectedCategory, performanceRange, getStudentPerformances])

  useEffect(() => {
    if (performances) {
      let filtered = [...performances]

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.studentProfile.user.firstName.toLowerCase().includes(query) ||
            p.studentProfile.user.lastName.toLowerCase().includes(query) ||
            p.studentProfile.user.email.toLowerCase().includes(query) ||
            p.studentProfile.studentId.toLowerCase().includes(query) ||
            p.course.name.toLowerCase().includes(query) ||
            p.course.code.toLowerCase().includes(query),
        )
      }

      setFilteredPerformances(filtered)
    }
  }, [performances, searchQuery])

  const handleGenerateClassAnalysis = async () => {
    if (selectedCourse === "all" || selectedSemester === "all") {
      return
    }

    setIsGeneratingAnalysis(true)
    try {
      await generateClassAnalysis({
        courseId: selectedCourse,
        semesterId: selectedSemester,
      })
    } finally {
      setIsGeneratingAnalysis(false)
    }
  }

  const getPerformanceBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "average":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-orange-100 text-orange-800"
      case "failing":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAverages = () => {
    if (!filteredPerformances || filteredPerformances.length === 0) {
      return {
        avgAttendance: 0,
        avgAssignment: 0,
        avgQuiz: 0,
        avgOverall: 0,
      }
    }

    const sum = filteredPerformances.reduce(
      (acc, curr) => {
        return {
          attendance: acc.attendance + curr.attendancePercentage,
          assignment: acc.assignment + curr.assignmentAverage,
          quiz: acc.quiz + curr.quizAverage,
          overall: acc.overall + curr.overallPerformance,
        }
      },
      { attendance: 0, assignment: 0, quiz: 0, overall: 0 },
    )

    const count = filteredPerformances.length

    return {
      avgAttendance: Math.round(sum.attendance / count),
      avgAssignment: Math.round(sum.assignment / count),
      avgQuiz: Math.round(sum.quiz / count),
      avgOverall: Math.round(sum.overall / count),
    }
  }

  const averages = calculateAverages()

  const getCategoryDistribution = () => {
    if (!filteredPerformances || filteredPerformances.length === 0) {
      return {
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0,
        failing: 0,
      }
    }

    const distribution = filteredPerformances.reduce(
      (acc, curr) => {
        const category = curr.performanceCategory.toLowerCase()
        return {
          ...acc,
          [category]: (acc[category] || 0) + 1,
        }
      },
      { excellent: 0, good: 0, average: 0, poor: 0, failing: 0 },
    )

    return distribution
  }

  const categoryDistribution = getCategoryDistribution()

  return (
    <PageContainer title="Performance Analytics" description="Track and analyze student performance">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Performance Filters</CardTitle>
                <CardDescription>Filter student performance data</CardDescription>
              </div>
              <Button variant="outline" className="gap-2 self-start" onClick={() => window.print()}>
                <Download className="h-4 w-4" /> Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses?.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        {course.courseCode}: {course.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Performance Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="failing">Failing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Performance Range: {performanceRange[0]}% - {performanceRange[1]}%
                </label>
                <Slider
                  value={performanceRange}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setPerformanceRange(value as [number, number])}
                  className="py-4"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, or course..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="default"
                className="gap-2"
                disabled={selectedCourse === "all" || selectedSemester === "all" || isGeneratingAnalysis}
                onClick={handleGenerateClassAnalysis}
              >
                <BarChart3 className="h-4 w-4" /> Generate Class Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading state */}
        {(isCoursesLoading || isPerformancesLoading) && (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>
        )}

        {/* Error state */}
        {performancesError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{performancesError}</AlertDescription>
          </Alert>
        )}

        {/* Performance Overview */}
        {!isCoursesLoading && !isPerformancesLoading && filteredPerformances && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averages.avgAttendance}%</div>
                  <p className="text-xs text-muted-foreground">Across {filteredPerformances.length} students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Assignment Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averages.avgAssignment}%</div>
                  <p className="text-xs text-muted-foreground">Across {filteredPerformances.length} students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averages.avgQuiz}%</div>
                  <p className="text-xs text-muted-foreground">Across {filteredPerformances.length} students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averages.avgOverall}%</div>
                  <p className="text-xs text-muted-foreground">Across {filteredPerformances.length} students</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="classAnalysis">Class Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Distribution</CardTitle>
                      <CardDescription>Student performance distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <PerformanceDistributionChart performances={filteredPerformances} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Categories</CardTitle>
                      <CardDescription>Distribution by performance category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <PerformanceCategoryChart distribution={categoryDistribution} />
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Comparison of key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                      <PerformanceMetricsChart performances={filteredPerformances} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Performance</CardTitle>
                    <CardDescription>Individual student performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredPerformances.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No performance data found for the selected filters.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Course</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Attendance</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Assignment</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Quiz</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Overall</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPerformances.map((performance) => (
                                <tr key={performance.id} className="border-t hover:bg-muted/50">
                                  <td className="px-4 py-3 text-sm">
                                    <div>
                                      <p className="font-medium">
                                        {performance.studentProfile.user.firstName}{" "}
                                        {performance.studentProfile.user.lastName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {performance.studentProfile.studentId}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <div>
                                      <p>{performance.course.name}</p>
                                      <p className="text-xs text-muted-foreground">{performance.course.code}</p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm">{performance.attendancePercentage}%</td>
                                  <td className="px-4 py-3 text-sm">{performance.assignmentAverage}%</td>
                                  <td className="px-4 py-3 text-sm">{performance.quizAverage}%</td>
                                  <td className="px-4 py-3 text-sm">{performance.overallPerformance}%</td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge className={getPerformanceBadgeColor(performance.performanceCategory)}>
                                      {performance.performanceCategory}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {format(new Date(performance.lastUpdated), "MMM d, yyyy")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classAnalysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Analysis</CardTitle>
                    <CardDescription>
                      {classAnalysis
                        ? `Analysis for ${classAnalysis.courseName} (${classAnalysis.semesterName})`
                        : "Select a course and semester, then generate class analysis"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAnalysisLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[100px] w-full" />
                      </div>
                    ) : analysisError ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{analysisError}</AlertDescription>
                      </Alert>
                    ) : !classAnalysis ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Select a specific course and semester, then click "Generate Class Analysis" to view detailed
                          insights.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Students</p>
                            </div>
                            <p className="text-2xl font-bold">{classAnalysis.totalStudents}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Attendance</p>
                            </div>
                            <p className="text-2xl font-bold">{classAnalysis.averageAttendance}%</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Filter className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Assignment</p>
                            </div>
                            <p className="text-2xl font-bold">{classAnalysis.averageAssignmentScore}%</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Filter className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Quiz</p>
                            </div>
                            <p className="text-2xl font-bold">{classAnalysis.averageQuizScore}%</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Overall</p>
                            </div>
                            <p className="text-2xl font-bold">{classAnalysis.averageOverallPerformance}%</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Performance Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-5 gap-2 mb-4">
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">Excellent</div>
                                  <div className="text-lg font-semibold">
                                    {classAnalysis.performanceDistribution.excellent}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">Good</div>
                                  <div className="text-lg font-semibold">
                                    {classAnalysis.performanceDistribution.good}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">Average</div>
                                  <div className="text-lg font-semibold">
                                    {classAnalysis.performanceDistribution.average}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">Poor</div>
                                  <div className="text-lg font-semibold">
                                    {classAnalysis.performanceDistribution.poor}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">Failing</div>
                                  <div className="text-lg font-semibold">
                                    {classAnalysis.performanceDistribution.failing}
                                  </div>
                                </div>
                              </div>
                              <div className="h-[150px]">
                                <PerformanceCategoryChart
                                  distribution={{
                                    excellent: classAnalysis.performanceDistribution.excellent,
                                    good: classAnalysis.performanceDistribution.good,
                                    average: classAnalysis.performanceDistribution.average,
                                    poor: classAnalysis.performanceDistribution.poor,
                                    failing: classAnalysis.performanceDistribution.failing,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc pl-5 space-y-2">
                                {classAnalysis.recommendations.map((recommendation, index) => (
                                  <li key={index} className="text-sm">
                                    {recommendation}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="rounded-md border overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-muted/50">
                                      <th className="px-4 py-2 text-left text-xs font-medium">Student</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium">Performance</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium">Category</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {classAnalysis.topPerformers.map((student) => (
                                      <tr key={student.studentId} className="border-t">
                                        <td className="px-4 py-2 text-sm">{student.studentName}</td>
                                        <td className="px-4 py-2 text-sm">{student.overallPerformance}%</td>
                                        <td className="px-4 py-2 text-sm">
                                          <Badge className={getPerformanceBadgeColor(student.performanceCategory)}>
                                            {student.performanceCategory}
                                          </Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Struggling Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="rounded-md border overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-muted/50">
                                      <th className="px-4 py-2 text-left text-xs font-medium">Student</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium">Performance</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium">Weaknesses</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {classAnalysis.strugglingStudents.map((student) => (
                                      <tr key={student.studentId} className="border-t">
                                        <td className="px-4 py-2 text-sm">{student.studentName}</td>
                                        <td className="px-4 py-2 text-sm">{student.overallPerformance}%</td>
                                        <td className="px-4 py-2 text-sm text-xs">{student.weaknesses}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageContainer>
  )
}
