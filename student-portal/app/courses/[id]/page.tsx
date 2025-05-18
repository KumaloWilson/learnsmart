"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, FileText, MonitorPlay, Star, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetCourseDetailsQuery, useGetCourseTopicsQuery } from "@/lib/api/course"
import { useAppSelector } from "@/lib/redux/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isPast, isFuture } from "date-fns"
import Link from "next/link"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { profile } = useAppSelector((state) => state.student)
  const [semesterId, setSemesterId] = useState<string>("")

  // Get the current active semester from enrollments
  useEffect(() => {
    if (profile?.currentEnrollments) {
      const enrollment = profile.currentEnrollments.find((e) => e.courseId === params.id)
      if (enrollment?.semesterId) {
        setSemesterId(enrollment.semesterId)
      } else if (profile.activeSemester?.id) {
        setSemesterId(profile.activeSemester.id)
      }
    }
  }, [profile, params.id])

  const {
    data: courseDetails,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useGetCourseDetailsQuery(
    {
      studentId: profile?.id || "",
      courseId: params.id,
      semesterId: semesterId,
    },
    { skip: !profile?.id || !semesterId },
  )

  const {
    data: courseTopics,
    isLoading: isLoadingTopics,
    error: topicsError,
  } = useGetCourseTopicsQuery(
    {
      studentId: profile?.id || "",
      courseId: params.id,
      semesterId: semesterId,
    },
    { skip: !profile?.id || !semesterId },
  )

  // Calculate course progress based on completed quizzes, assessments, etc.
  const calculateProgress = () => {
    if (!courseDetails) return 0

    // This is a simplified calculation - in a real app, you'd have more complex logic
    const totalItems =
      courseDetails.quizzes.length + courseDetails.assessments.length + courseDetails.virtualClasses.length

    if (totalItems === 0) return 0

    const completedItems =
      courseDetails.quizzes.filter((q) => isPast(new Date(q.endDate))).length +
      courseDetails.assessments.filter((a) => courseDetails.submissions.some((s) => s.assessmentId === a.id)).length +
      courseDetails.virtualClasses.filter((v) => isPast(new Date(v.scheduledEndTime))).length

    return Math.round((completedItems / totalItems) * 100)
  }

  // Sort quizzes by date
  const sortedQuizzes = courseDetails?.quizzes
    ? [...courseDetails.quizzes].sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      })
    : []

  // Filter upcoming and past quizzes
  const upcomingQuizzes = sortedQuizzes.filter((quiz) => isFuture(new Date(quiz.endDate)))

  // Sort virtual classes by date
  const sortedClasses = courseDetails?.virtualClasses
    ? [...courseDetails.virtualClasses].sort((a, b) => {
        return new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime()
      })
    : []

  // Get the next class
  const nextClass = sortedClasses.find((vc) => isFuture(new Date(vc.scheduledStartTime)))

  // Sort course topics by order index
  const sortedTopics = courseTopics ? [...courseTopics].sort((a, b) => a.orderIndex - b.orderIndex) : []

  const isLoading = isLoadingCourse || isLoadingTopics
  const error = courseError || topicsError

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:w-80 space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !courseDetails) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The course you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const course = courseDetails.course
  const progress = calculateProgress()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
          <img
            src={`/abstract-geometric-shapes.png?height=300&width=800&query=${course.name}`}
            alt={course.name}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="container">
            <Badge className="mb-2 bg-blue-500/80 hover:bg-blue-500">{course.program.name}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{courseDetails.performanceSummary?.[0]?.overallPerformance || 0}% Performance</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Course Code: {course.code}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Level {course.level}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.creditHours} credit hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-4 bg-muted/50 p-1">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="classes">Virtual Classes</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Course Overview</h2>
                    <p className="text-sm text-muted-foreground">
                      {courseDetails.quizzes.length} quizzes • {courseDetails.virtualClasses.length} virtual classes •{" "}
                      {sortedTopics.length} topics
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{progress}% complete</span>
                    <Progress value={progress} className="w-24 h-2" />
                  </div>
                </div>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{course.description}</p>
                  </CardContent>
                </Card>

                {courseDetails.materials.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Course Materials</h3>
                    {courseDetails.materials.map((material, index) => (
                      <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-muted-foreground">{material.description}</p>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <a href={material.url} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No course materials available yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="topics" className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Course Topics</h2>
                {sortedTopics.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTopics.map((topic, index) => (
                      <Card key={topic.id} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="py-3 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Topic {topic.orderIndex}: {topic.title}
                            </CardTitle>
                            <Badge variant="outline" className="capitalize">
                              {topic.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{topic.durationHours} hours</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>

                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Learning Objectives</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {topic.learningObjectives.map((objective, i) => (
                                  <li key={i} className="text-sm text-muted-foreground">
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {topic.keywords.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                  {topic.keywords.map((keyword, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No topics available for this course yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
                {courseDetails.quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {courseDetails.quizzes.map((quiz, index) => {
                      const startDate = new Date(quiz.startDate)
                      const endDate = new Date(quiz.endDate)
                      const isActive = isPast(startDate) && isFuture(endDate)
                      const isPastQuiz = isPast(endDate)

                      return (
                        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30">
                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium">{quiz.title}</h3>
                                <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{quiz.timeLimit} minutes</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              {isActive ? (
                                <Button size="sm" asChild>
                                  <Link href={`/quizzes/${quiz.id}`}>Take Quiz</Link>
                                </Button>
                              ) : isPastQuiz ? (
                                <Badge variant="outline" className="bg-muted text-muted-foreground">
                                  Closed
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                                >
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No quizzes available for this course yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="classes" className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Virtual Classes</h2>
                {courseDetails.virtualClasses.length > 0 ? (
                  <div className="space-y-4">
                    {courseDetails.virtualClasses.map((virtualClass, index) => {
                      const startTime = new Date(virtualClass.scheduledStartTime)
                      const endTime = new Date(virtualClass.scheduledEndTime)
                      const isLive = isPast(startTime) && isFuture(endTime)
                      const isPastClass = isPast(endTime)

                      return (
                        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                <MonitorPlay className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{virtualClass.title}</h3>
                                  {isLive && <Badge className="bg-red-500 hover:bg-red-600">Live Now</Badge>}
                                  {virtualClass.attended && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Attended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{virtualClass.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {format(startTime, "MMM d, yyyy")} at {format(startTime, "h:mm a")}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span>
                                    Lecturer: {virtualClass.lecturerProfile.title}{" "}
                                    {virtualClass.lecturerProfile.user.firstName}{" "}
                                    {virtualClass.lecturerProfile.user.lastName}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              {isLive ? (
                                <Button size="sm" asChild>
                                  <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                                    Join Now
                                  </a>
                                </Button>
                              ) : isPastClass ? (
                                virtualClass.recordingUrl ? (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                                      Watch Recording
                                    </a>
                                  </Button>
                                ) : (
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                                    Completed
                                  </Badge>
                                )
                              ) : (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                                    Add to Calendar
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No virtual classes scheduled for this course yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="about" className="animate-fade-in">
                <div className="space-y-6">
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle>About This Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{course.description}</p>

                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Course Details</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Course Code</span>
                            <span className="font-medium">{course.code}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Credit Hours</span>
                            <span className="font-medium">{course.creditHours}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Level</span>
                            <span className="font-medium">{course.level}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Program</span>
                            <span className="font-medium">{course.program.name}</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {courseDetails.virtualClasses.length > 0 && courseDetails.virtualClasses[0].lecturerProfile && (
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Instructor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarImage src="/placeholder.svg?height=64&width=64" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {courseDetails.virtualClasses[0].lecturerProfile.user.firstName.charAt(0)}
                              {courseDetails.virtualClasses[0].lecturerProfile.user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">
                              {courseDetails.virtualClasses[0].lecturerProfile.title}{" "}
                              {courseDetails.virtualClasses[0].lecturerProfile.user.firstName}{" "}
                              {courseDetails.virtualClasses[0].lecturerProfile.user.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {courseDetails.virtualClasses[0].lecturerProfile.specialization}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed">
                              {courseDetails.virtualClasses[0].lecturerProfile.bio}
                            </p>

                            <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">Office Location</p>
                                <p className="text-muted-foreground">
                                  {courseDetails.virtualClasses[0].lecturerProfile.officeLocation}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Office Hours</p>
                                <p className="text-muted-foreground">
                                  {courseDetails.virtualClasses[0].lecturerProfile.officeHours}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-80 space-y-4">
            {nextClass && (
              <Card className="border-0 shadow-md sticky top-20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Next Class</CardTitle>
                  <CardDescription>{nextClass.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        {format(new Date(nextClass.scheduledStartTime), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        {format(new Date(nextClass.scheduledStartTime), "h:mm a")} -{" "}
                        {format(new Date(nextClass.scheduledEndTime), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <MonitorPlay className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm">{nextClass.meetingConfig.platform} Virtual Classroom</span>
                    </div>
                    <Button className="w-full mt-2 shadow-sm" asChild>
                      <a href={nextClass.meetingLink} target="_blank" rel="noopener noreferrer">
                        Join Class
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="progress-ring-container">
                      <svg className="progress-ring" width="120" height="120">
                        <circle
                          className="progress-ring-circle"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="transparent"
                          r="45"
                          cx="60"
                          cy="60"
                        />
                        <circle
                          className="progress-ring-circle"
                          stroke="hsl(var(--primary))"
                          strokeWidth="8"
                          fill="transparent"
                          r="45"
                          cx="60"
                          cy="60"
                          style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                        />
                      </svg>
                      <div className="progress-ring-text">
                        <div className="text-3xl font-bold">{progress}%</div>
                        <div className="text-xs text-muted-foreground">completed</div>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Attendance</span>
                      <span>{courseDetails.performanceSummary?.[0]?.attendancePercentage || 0}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quizzes Completed</span>
                      <span>
                        {courseDetails.quizzes.filter((q) => isPast(new Date(q.endDate))).length}/
                        {courseDetails.quizzes.length}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Classes Attended</span>
                      <span>
                        {courseDetails.attendance.filter((a) => a.isPresent).length}/{courseDetails.attendance.length}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {upcomingQuizzes.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {upcomingQuizzes.slice(0, 2).map((quiz, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-start pb-2 border-b last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-xs text-muted-foreground">Quiz</p>
                        </div>
                        <p className="text-xs font-medium">{format(new Date(quiz.endDate), "MMM d")}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
