"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchAssessments } from "@/lib/redux/slices/assessmentSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Calendar, Clock, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"

export default function AssessmentsPage() {
  const dispatch = useAppDispatch()
  const { assessments, isLoading, error } = useAppSelector((state) => state.assessment)
  const { accessToken } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchAssessments(accessToken))
    }
  }, [dispatch, accessToken])

  const now = new Date()

  // Filter assessments by type and status
  const quizzes = assessments.filter((assessment) => assessment.type === "quiz")
  const assignments = assessments.filter((assessment) => assessment.type === "assignment")
  const exams = assessments.filter((assessment) => assessment.type === "exam")

  const upcoming = assessments.filter((assessment) => new Date(assessment.dueDate) > now)
  const past = assessments.filter((assessment) => new Date(assessment.dueDate) <= now)

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">View and complete your assessments</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : assessments.length === 0 ? (
        <Alert>
          <AlertDescription>No assessments available at this time.</AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.length > 0 ? (
                upcoming.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} />)
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">No upcoming assessments.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.length > 0 ? (
                quizzes.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} />)
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">No quizzes available.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignments.length > 0 ? (
                assignments.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} />)
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">No assignments available.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exams" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exams.length > 0 ? (
                exams.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} />)
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">No exams available.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}

function AssessmentCard({ assessment }) {
  const now = new Date()
  const dueDate = new Date(assessment.dueDate)
  const isPast = now > dueDate
  const isSubmitted = assessment.status === "submitted" || assessment.status === "graded"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assessment.title}</CardTitle>
            <CardDescription className="mt-1">
              {assessment.course.name} ({assessment.course.code})
            </CardDescription>
          </div>
          <Badge
            className={
              assessment.type === "quiz"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-none"
                : assessment.type === "assignment"
                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-none"
                  : "bg-red-100 text-red-800 hover:bg-red-200 border-none"
            }
          >
            {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Due: {formatDate(assessment.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Time: {formatTime(assessment.dueDate)}</span>
          </div>
          {assessment.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Time Limit: {assessment.timeLimit} minutes</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {assessment.totalPoints} points{" "}
              {assessment.totalQuestions ? `• ${assessment.totalQuestions} questions` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSubmitted ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {assessment.status === "graded" ? `Graded: ${assessment.score}/${assessment.totalPoints}` : "Submitted"}
              </span>
            </div>
          ) : isPast ? (
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Missed</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Not submitted</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPast && !isSubmitted ? "outline" : "default"}
          disabled={isPast && !isSubmitted && assessment.type !== "assignment"}
          asChild
        >
          <Link
            href={
              assessment.type === "quiz"
                ? `/assessments/quiz/${assessment.id}`
                : assessment.type === "assignment"
                  ? `/assessments/assignment/${assessment.id}`
                  : `/assessments/exam/${assessment.id}`
            }
          >
            {isSubmitted
              ? assessment.status === "graded"
                ? "View Results"
                : "View Submission"
              : isPast
                ? "View Details"
                : "Start Now"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
