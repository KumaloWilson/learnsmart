"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2, Plus, Search } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useQuizzes, useCourses } from "@/lib/auth/hooks"
import { formatDateShort } from "@/lib/utils"
import Link from "next/link"
import { CreateQuizDialog } from "@/components/create-quiz-dialog"

export default function CourseQuizzesPage() {
  const { courseId } = useParams()
  const { lecturerProfile } = useAuth()
  const { getQuizzesByFilters, quizzes, isLoading, error } = useQuizzes()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [courseDetails, setCourseDetails] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && courseId && !isInitialLoading) {
        try {
          // Fetch courses to get course details if not already loaded
          if (courses.length === 0) {
            const coursesData = await getCourses(lecturerProfile.id)
            const course = coursesData.find((c) => c.courseId === courseId)
            setCourseDetails(course)
          } else {
            const course = courses.find((c) => c.courseId === courseId)
            setCourseDetails(course)
          }

          // Fetch quizzes for this course only if not already loaded
          if (quizzes.length === 0) {
            await getQuizzesByFilters({
              lecturerProfileId: lecturerProfile.id,
              courseId: courseId as string,
            })
          }
        } catch (err) {
          console.error("Error fetching data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, getQuizzesByFilters, getCourses, courses, quizzes.length, isInitialLoading])

  const handleSearch = async () => {
    if (lecturerProfile?.id && courseId) {
      try {
        await getQuizzesByFilters({
          lecturerProfileId: lecturerProfile.id,
          courseId: courseId as string,
          search: searchTerm,
        })
      } catch (err) {
        console.error("Error searching quizzes:", err)
      }
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeQuizzes = filteredQuizzes.filter((quiz) => quiz.isActive)
  const inactiveQuizzes = filteredQuizzes.filter((quiz) => !quiz.isActive)

  const isQuizActive = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.isActive
  }

  const isQuizUpcoming = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    return now < startDate && quiz.isActive
  }

  const isQuizExpired = (quiz: any) => {
    const now = new Date()
    const endDate = new Date(quiz.endDate)
    return now > endDate || !quiz.isActive
  }

  const getQuizStatusBadge = (quiz: any) => {
    if (isQuizActive(quiz)) {
      return <Badge variant="default">Active</Badge>
    } else if (isQuizUpcoming(quiz)) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (isQuizExpired(quiz)) {
      return <Badge variant="secondary">Expired</Badge>
    } else {
      return <Badge variant="destructive">Inactive</Badge>
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Course Quizzes" description="Quizzes for this course">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={courseDetails ? `${courseDetails.courseCode} - Quizzes` : "Course Quizzes"}
      description={courseDetails ? `Quizzes for ${courseDetails.courseName}` : "Quizzes for this course"}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Button className="w-full md:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="all">All Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeQuizzes.length > 0 ? (
                activeQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        {getQuizStatusBadge(quiz)}
                      </div>
                      <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {formatDateShort(quiz.startDate)} - {formatDateShort(quiz.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{quiz.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Questions:</span>
                          <span>{quiz.numberOfQuestions}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Passing:</span>
                          <span>
                            {quiz.passingMarks}/{quiz.totalMarks}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {searchTerm ? "No active quizzes match your search" : "No active quizzes found for this course"}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveQuizzes.length > 0 ? (
                inactiveQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        {getQuizStatusBadge(quiz)}
                      </div>
                      <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {formatDateShort(quiz.startDate)} - {formatDateShort(quiz.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{quiz.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Questions:</span>
                          <span>{quiz.numberOfQuestions}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Passing:</span>
                          <span>
                            {quiz.passingMarks}/{quiz.totalMarks}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {searchTerm ? "No inactive quizzes match your search" : "No inactive quizzes found for this course"}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        {getQuizStatusBadge(quiz)}
                      </div>
                      <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {formatDateShort(quiz.startDate)} - {formatDateShort(quiz.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{quiz.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Questions:</span>
                          <span>{quiz.numberOfQuestions}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Passing:</span>
                          <span>
                            {quiz.passingMarks}/{quiz.totalMarks}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  {searchTerm ? "No quizzes match your search" : "No quizzes found for this course"}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {courseDetails && (
        <CreateQuizDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          lecturerId={lecturerProfile?.id || ""}
          initialCourseId={courseDetails.courseId}
          initialSemesterId={courseDetails.semesterId}
        />
      )}
    </PageContainer>
  )
}
