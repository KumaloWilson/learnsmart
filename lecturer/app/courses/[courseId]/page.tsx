"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, BookOpen, Calendar, LineChart } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses, useCourseMastery, useStudentEngagement } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CourseMasteryChart } from "@/components/course-mastery-chart"
import { StudentEngagementTable } from "@/components/student-engagement-table"
import { EngagementDistributionChart } from "@/components/engagement-distribution-chart"

export default function CourseDetailsPage() {
  const { courseId } = useParams()
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const {
    getCourseMasteryDistribution,
    masteryData,
    isLoading: isLoadingMastery,
    error: masteryError,
  } = useCourseMastery()
  const {
    getStudentEngagement,
    engagementData,
    isLoading: isLoadingEngagement,
    error: engagementError,
  } = useStudentEngagement()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && courseId) {
        try {
          // Fetch courses if not already loaded
          if (courses.length === 0) {
            await getCourses(lecturerProfile.id)
          }

          // Find the current course
          const currentCourse = courses.find((c) => c.courseId === courseId)
          if (currentCourse) {
            setCourse(currentCourse)

            // Fetch course mastery data
            await getCourseMasteryDistribution(lecturerProfile.id, courseId as string, currentCourse.semesterId)

            // Fetch student engagement data
            await getStudentEngagement(lecturerProfile.id, courseId as string, currentCourse.semesterId)
          } else {
            setError("Course not found")
          }
        } catch (err) {
          console.error("Error fetching course data:", err)
          setError("Failed to load course data")
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, courses, getCourses, getCourseMasteryDistribution, getStudentEngagement])

  if (isInitialLoading || isLoadingCourses) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Course Details" description="View and manage course information">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  if (!course) {
    return (
      <PageContainer title="Course Details" description="View and manage course information">
        <Alert variant="destructive">
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={course.courseName} description={`${course.courseCode} - ${course.semesterName}`}>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.studentCount}</div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Enrolled in this course</p>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/courses/${courseId}/students`}>View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Course materials</p>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/courses/${courseId}/materials`}>View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Scheduled classes</p>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/courses/${courseId}/classes`}>View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mastery">Course Mastery</TabsTrigger>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Details about the course and its content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground mt-1">{course.courseDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Course Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium">Course Code</p>
                      <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Semester</p>
                      <p className="text-sm text-muted-foreground">{course.semesterName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Students</p>
                      <p className="text-sm text-muted-foreground">{course.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Assigned Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(course.assignedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <Button variant="outline" asChild>
                      <Link href={`/courses/${courseId}/students`}>
                        <Users className="mr-2 h-4 w-4" /> Manage Students
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/courses/${courseId}/materials`}>
                        <BookOpen className="mr-2 h-4 w-4" /> Course Materials
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/courses/${courseId}/analytics`}>
                        <LineChart className="mr-2 h-4 w-4" /> View Analytics
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mastery">
          <Card>
            <CardHeader>
              <CardTitle>Course Mastery</CardTitle>
              <CardDescription>Student mastery levels for this course</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMastery ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : masteryError ? (
                <Alert variant="destructive">
                  <AlertDescription>{masteryError}</AlertDescription>
                </Alert>
              ) : masteryData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Average Mastery</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{masteryData.averageMastery}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Quiz Score</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{masteryData.averageQuizScore}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Assignment Score</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{masteryData.averageAssignmentScore}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Topic Completion</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{masteryData.averageTopicCompletion}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Mastery Distribution</h3>
                    <div className="h-80">
                      <CourseMasteryChart distribution={masteryData.distribution} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No mastery data available for this course</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement</CardTitle>
              <CardDescription>Engagement metrics for students in this course</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEngagement ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : engagementError ? (
                <Alert variant="destructive">
                  <AlertDescription>{engagementError}</AlertDescription>
                </Alert>
              ) : engagementData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Overall Attendance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{engagementData.classAverages.overallAttendanceRate}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Quiz Completion</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{engagementData.classAverages.quizCompletionRate}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Assessment Submission</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                          {engagementData.classAverages.assessmentSubmissionRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Engagement Distribution</h3>
                    <div className="h-80">
                      <EngagementDistributionChart distribution={engagementData.engagementDistribution} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Student Engagement Details</h3>
                    <StudentEngagementTable students={engagementData.studentEngagement} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No engagement data available for this course</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
