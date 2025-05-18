"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchCoursePerformance } from "@/lib/redux/slices/performanceSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils/date-utils"
import { MainLayout } from "@/components/main-layout"

export default function CoursePerformance() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const courseId = params.courseId as string
  const { coursePerformance, isLoading, error } = useAppSelector((state) => state.performance)
  const { accessToken } = useAppSelector((state) => state.auth)
  const { currentCourse } = useAppSelector((state) => state.courses)

  useEffect(() => {
    if (courseId && accessToken) {
      dispatch(fetchCoursePerformance({ courseId, token: accessToken }))
    }
  }, [dispatch, courseId, accessToken])

  const content = (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !coursePerformance ? (
        <Alert className="m-4">
          <AlertDescription>Performance data not available for this course.</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Course Performance</h1>
            <p className="text-muted-foreground">
              Performance details for {currentCourse?.name || `Course ${courseId}`}
            </p>
          </div>

          {/* Overall Performance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
              <CardDescription>Your performance in {currentCourse?.name || "this course"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Grade</span>
                  <span className="text-sm font-medium">{coursePerformance.currentGrade}</span>
                </div>
                <Progress value={coursePerformance.overallPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <PerformanceMetric
                  title="Overall"
                  value={`${coursePerformance.overallPercentage}%`}
                  description="Total performance"
                />
                <PerformanceMetric
                  title="Attendance"
                  value={`${coursePerformance.attendancePercentage}%`}
                  description="Class attendance"
                />
                <PerformanceMetric
                  title="Assignments"
                  value={`${coursePerformance.assignmentAverage}%`}
                  description="Average score"
                />
                <PerformanceMetric
                  title="Quizzes"
                  value={`${coursePerformance.quizAverage}%`}
                  description="Average score"
                />
              </div>
            </CardContent>
          </Card>

          {/* Detailed Performance Tabs */}
          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Performance</CardTitle>
                  <CardDescription>Your performance in course assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  {coursePerformance.assignments && coursePerformance.assignments.length > 0 ? (
                    <div className="space-y-4">
                      {coursePerformance.assignments.map((assignment) => (
                        <div key={assignment.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">Due: {formatDate(assignment.dueDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {assignment.score} / {assignment.totalPoints}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {((assignment.score / assignment.totalPoints) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <Progress value={(assignment.score / assignment.totalPoints) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No assignment data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Performance</CardTitle>
                  <CardDescription>Your performance in course quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  {coursePerformance.quizzes && coursePerformance.quizzes.length > 0 ? (
                    <div className="space-y-4">
                      {coursePerformance.quizzes.map((quiz) => (
                        <div key={quiz.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{quiz.title}</h4>
                              <p className="text-sm text-muted-foreground">Date: {formatDate(quiz.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {quiz.score} / {quiz.totalPoints}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {((quiz.score / quiz.totalPoints) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <Progress value={(quiz.score / quiz.totalPoints) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No quiz data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                  <CardDescription>Your attendance for this course</CardDescription>
                </CardHeader>
                <CardContent>
                  {coursePerformance.attendance && coursePerformance.attendance.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium">Overall Attendance</p>
                          <p className="text-sm text-muted-foreground">
                            {coursePerformance.attendanceCount} of {coursePerformance.totalClasses} classes attended
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{coursePerformance.attendancePercentage}%</p>
                        </div>
                      </div>
                      <Progress value={coursePerformance.attendancePercentage} className="h-2 mb-6" />

                      <div className="border rounded-md divide-y">
                        {coursePerformance.attendance.map((record) => (
                          <div key={record.id} className="flex justify-between items-center p-4">
                            <div>
                              <p className="font-medium">{record.topic}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                            </div>
                            <div>
                              {record.isPresent ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Present
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                  Absent
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No attendance data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Feedback and Recommendations */}
          {coursePerformance.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Instructor Feedback</CardTitle>
                <CardDescription>Feedback and recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Strengths</h4>
                  <p className="text-muted-foreground">{coursePerformance.feedback.strengths}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Areas for Improvement</h4>
                  <p className="text-muted-foreground">{coursePerformance.feedback.areasForImprovement}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <p className="text-muted-foreground">{coursePerformance.feedback.recommendations}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}

interface PerformanceMetricProps {
  title: string
  value: string
  description: string
}

function PerformanceMetric({ title, value, description }: PerformanceMetricProps) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
