"use client"
import { useRouter } from "next/navigation"
import { useGetQuizAttemptQuery } from "@/lib/api/quiz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

export default function QuizAttemptDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: quizAttempt, isLoading, error } = useGetQuizAttemptQuery(params.id)

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP 'at' p")
  }

  // Calculate duration in minutes
  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "In progress"

    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMinutes = Math.round((end - start) / (1000 * 60))

    return `${durationMinutes} minutes`
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !quizAttempt) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load quiz attempt details. The attempt may not exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push("/quiz-history")}>Back to Quiz History</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/quiz-history")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quiz History
        </Button>
        <h1 className="text-2xl font-bold">{quizAttempt.quiz.title} - Results</h1>
        <p className="text-muted-foreground">{quizAttempt.quiz.description}</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-muted/30">
          <CardTitle>Quiz Summary</CardTitle>
          <CardDescription>
            {quizAttempt.quiz.course.name} - {quizAttempt.quiz.topic}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Started</h3>
                  <p>{formatDate(quizAttempt.startTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  <p>{quizAttempt.endTime ? formatDate(quizAttempt.endTime) : "In progress"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p>{calculateDuration(quizAttempt.startTime, quizAttempt.endTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="capitalize">{quizAttempt.status.replace(/_/g, " ")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Your Score</h3>
                <div className="text-5xl font-bold mt-2">
                  {quizAttempt.score !== null ? `${quizAttempt.score}%` : "--"}
                </div>
                <div className="mt-1">
                  {quizAttempt.isPassed !== null &&
                    (quizAttempt.isPassed ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1 justify-center">
                        <CheckCircle className="h-4 w-4" /> Passed
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1 justify-center">
                        <AlertCircle className="h-4 w-4" /> Failed
                      </span>
                    ))}
                </div>
                {quizAttempt.score !== null && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Score</span>
                      <span>{quizAttempt.score}%</span>
                    </div>
                    <Progress value={quizAttempt.score} className="h-2" />

                    <div className="flex justify-between text-sm mt-4">
                      <span>Passing Score</span>
                      <span>{quizAttempt.quiz.passingMarks}%</span>
                    </div>
                    <Progress value={quizAttempt.quiz.passingMarks} className="h-2 bg-muted" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {quizAttempt.feedback && (
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h3 className="text-lg font-medium mb-2">Feedback</h3>
              <p>{quizAttempt.feedback}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {quizAttempt.aiAnalysis && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>AI-generated analysis of your quiz performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {quizAttempt.aiAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="text-sm">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  {quizAttempt.aiAnalysis.weaknesses.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {quizAttempt.aiAnalysis.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific weaknesses identified.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {quizAttempt.aiAnalysis.recommendations.map((recommendation, i) => (
                    <li key={i} className="text-sm">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Question Review</h3>

        {quizAttempt.questions.map((question, index) => {
          const userAnswer = quizAttempt.answers?.[index]
          const isCorrect = userAnswer?.selectedOption === question.correctAnswer
          const questionResult = quizAttempt.aiAnalysis?.questionResults?.[index]

          return (
            <Card
              key={index}
              className={`border-l-4 ${isCorrect ? "border-l-green-500" : userAnswer ? "border-l-red-500" : "border-l-gray-300"}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                  {userAnswer &&
                    (isCorrect ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
                        <CheckCircle className="h-4 w-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1 text-sm">
                        <AlertCircle className="h-4 w-4" /> Incorrect
                      </span>
                    ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{question.question}</p>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-md ${
                        option === question.correctAnswer
                          ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : option === userAnswer?.selectedOption && !isCorrect
                            ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-2">
                          {option === question.correctAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : option === userAnswer?.selectedOption && !isCorrect ? (
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{option}</p>
                          {option === question.correctAnswer && (
                            <p className="text-xs text-muted-foreground mt-1">{question.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {questionResult?.explanation && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>{questionResult.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/quiz-history")}>
          Back to Quiz History
        </Button>
        <Button onClick={() => router.push(`/courses/${quizAttempt.quiz.courseId}`)}>Go to Course</Button>
      </div>
    </div>
  )
}
