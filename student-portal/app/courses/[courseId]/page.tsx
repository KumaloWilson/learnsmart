"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchCourseDetails } from "@/lib/redux/slices/courseSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  Video,
  CheckCircle,
  XCircle,
  ExternalLink,
  Tag,
  Target,
  Timer,
} from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"

export default function CourseDetailsPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const courseId = params.courseId as string
  const { courseDetails, courseTopics, isLoading, error } = useAppSelector((state) => state.course)
  const { accessToken } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (courseId && accessToken) {
      dispatch(fetchCourseDetails({ courseId, token: accessToken }))
    }
  }, [dispatch, courseId, accessToken])

  const content = (
    <div className="flex flex-col gap-6 w-full h-full animate-in fade-in-50 duration-500">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !courseDetails ? (
        <Alert className="m-4">
          <AlertDescription>Course details not found</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{courseDetails.course.name}</h1>
            <p className="text-muted-foreground">
              {courseDetails.course.code} • {courseDetails.course.creditHours} Credits
            </p>
          </div>

          {/* Course Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Key information about this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">Level</span>
                  </div>
                  <p>{courseDetails.course.level}</p>
                </div>
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">Credit Hours</span>
                  </div>
                  <p>{courseDetails.course.creditHours}</p>
                </div>
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="font-medium">Program</span>
                  </div>
                  <p>{courseDetails.course.program.code}</p>
                </div>
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">Lecturer</span>
                  </div>
                  <p>
                    {courseDetails.virtualClasses.length > 0
                      ? `${courseDetails.virtualClasses[0].lecturerProfile.title} ${courseDetails.virtualClasses[0].lecturerProfile.user.firstName} ${courseDetails.virtualClasses[0].lecturerProfile.user.lastName}`
                      : "Not assigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            {/* Topics Tab */}
            <TabsContent value="topics" className="mt-4 space-y-4">
              <h2 className="text-2xl font-bold">Course Topics</h2>
              {courseTopics && courseTopics.length > 0 ? (
                // Sort topics by order index
                [...courseTopics]
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((topic) => (
                    <Card key={topic.id} className="overflow-hidden">
                      <CardHeader className="bg-primary/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{topic.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">
                                {topic.difficulty}
                              </Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Timer className="h-3.5 w-3.5 mr-1" />
                                {topic.durationHours} hour{topic.durationHours !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">Topic {topic.orderIndex}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm mb-4">{topic.description}</p>

                        {topic.learningObjectives && topic.learningObjectives.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium flex items-center mb-2">
                              <Target className="h-4 w-4 mr-2" />
                              Learning Objectives
                            </h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {topic.learningObjectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {topic.keywords && topic.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center mb-2">
                              <Tag className="h-4 w-4 mr-2" />
                              Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {topic.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Alert>
                  <AlertDescription>No topics available for this course yet.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="mt-4 space-y-4">
              <h2 className="text-2xl font-bold">Virtual Classes</h2>
              {courseDetails.virtualClasses && courseDetails.virtualClasses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Sort virtual classes by date */}
                  {[...courseDetails.virtualClasses]
                    .sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
                    .map((virtualClass) => (
                      <Card key={virtualClass.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{virtualClass.title}</CardTitle>
                          <CardDescription>{virtualClass.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatDate(virtualClass.scheduledStartTime)} •{" "}
                                {formatTime(virtualClass.scheduledStartTime)} -{" "}
                                {formatTime(virtualClass.scheduledEndTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                                {virtualClass.lecturerProfile.user.lastName}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <Badge variant="outline" className="capitalize">
                              {virtualClass.status}
                            </Badge>
                            <Button asChild size="sm">
                              <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Class
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No virtual classes scheduled for this course yet.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-4 space-y-4">
              <h2 className="text-2xl font-bold">Quizzes</h2>
              {courseDetails.quizzes && courseDetails.quizzes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Sort quizzes by date */}
                  {[...courseDetails.quizzes]
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .map((quiz) => {
                      const now = new Date()
                      const isActive = now >= new Date(quiz.startDate) && now <= new Date(quiz.endDate)
                      const isPast = now > new Date(quiz.endDate)
                      const isFuture = now < new Date(quiz.startDate)

                      return (
                        <Card key={quiz.id} className="overflow-hidden">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle>{quiz.title}</CardTitle>
                              <Badge
                                className={
                                  isActive
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                                    : isPast
                                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border-none"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-none"
                                }
                              >
                                {isActive ? "Active" : isPast ? "Closed" : "Upcoming"}
                              </Badge>
                            </div>
                            <CardDescription>{quiz.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Topic</p>
                                <p className="text-sm font-medium">{quiz.topic}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Questions</p>
                                <p className="text-sm font-medium">{quiz.numberOfQuestions}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Time Limit</p>
                                <p className="text-sm font-medium">{quiz.timeLimit} minutes</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Total Marks</p>
                                <p className="text-sm font-medium">{quiz.totalMarks}</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Available</p>
                              <p className="text-sm">
                                {formatDate(quiz.startDate)} to {formatDate(quiz.endDate)}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Instructions</p>
                              <p className="text-sm">{quiz.instructions}</p>
                            </div>

                            <Button className="w-full" disabled={!isActive} asChild={isActive}>
                              {isActive ? (
                                <Link href={`/assessments/quiz/${quiz.id}`}>Take Quiz</Link>
                              ) : (
                                <span>{isPast ? "Closed" : "Not Available Yet"}</span>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>No quizzes available for this course yet.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="mt-4 space-y-4">
              <h2 className="text-2xl font-bold">Attendance Records</h2>
              {courseDetails.attendance && courseDetails.attendance.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>Your attendance records for this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                        <div>Date</div>
                        <div>Topic</div>
                        <div>Notes</div>
                        <div className="text-right">Status</div>
                      </div>
                      <div className="divide-y">
                        {courseDetails.attendance.map((record) => (
                          <div key={record.id} className="grid grid-cols-4 p-3">
                            <div>{formatDate(record.date)}</div>
                            <div>{record.topic}</div>
                            <div className="text-sm text-muted-foreground">{record.notes}</div>
                            <div className="flex justify-end">
                              {record.isPresent ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Present
                                </div>
                              ) : (
                                <div className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Absent
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertDescription>No attendance records available for this course yet.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}
