"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, BookOpen } from "lucide-react"
import type { QuizAttempt } from "@/lib/types/quiz.types"

interface QuizResultsProps {
  result: QuizAttempt
}

export function QuizResults({ result }: QuizResultsProps) {
  const router = useRouter()
  const { quiz, score, isPassed, answers, questions } = result

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Calculate time taken
  const calculateTimeTaken = () => {
    if (!result.startTime || !result.endTime) return "N/A"

    const start = new Date(result.startTime).getTime()
    const end = new Date(result.endTime).getTime()
    const diffMs = end - start

    const minutes = Math.floor(diffMs / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    return `${minutes} min ${seconds} sec`
  }

  // Navigate back to course
  const goToCourse = () => {
    router.push(`/course/${quiz.courseId}`)
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-in fade-in-50 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
        <p className="text-muted-foreground">{quiz.title}</p>
      </div>

      {/* Results Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Summary</CardTitle>
          <CardDescription>Your quiz performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{score}%</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`${isPassed ? "text-green-500" : "text-red-500"} stroke-current`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <Badge
              className={
                isPassed
                  ? "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                  : "bg-red-100 text-red-800 hover:bg-red-200 border-none"
              }
            >
              {isPassed ? "Passed" : "Failed"}
            </Badge>
            <p className="text-center text-muted-foreground">
              {isPassed
                ? "Congratulations! You have passed the quiz."
                : "You did not meet the passing score. Keep practicing!"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Passing Score</div>
              <div className="text-lg font-medium">{quiz.passingMarks}%</div>
            </div>
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Time Taken</div>
              <div className="text-lg font-medium">{calculateTimeTaken()}</div>
            </div>
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-lg font-medium">{formatDate(result.endTime || "")}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={goToCourse} className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            Return to Course
          </Button>
        </CardFooter>
      </Card>

      {/* Questions and Answers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Questions & Answers</h2>
        {questions.map((question, index) => {
          const userAnswer = answers?.find((a) => a.questionIndex === index)
          const isCorrect = userAnswer?.selectedOption === question.correctAnswer

          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader
                className={
                  userAnswer
                    ? isCorrect
                      ? "bg-green-50 dark:bg-green-950/20 border-b border-green-100 dark:border-green-900"
                      : "bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900"
                    : "bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900"
                }
              >
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {index + 1}. {question.question}
                  </CardTitle>
                  {userAnswer ? (
                    isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                        <XCircle className="mr-1 h-3 w-3" />
                        Incorrect
                      </Badge>
                    )
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Not Answered</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center p-3 rounded-md border ${
                        option === question.correctAnswer
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          : userAnswer?.selectedOption === option && option !== question.correctAnswer
                            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                            : ""
                      }`}
                    >
                      <div className="flex-1">{option}</div>
                      {option === question.correctAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {userAnswer?.selectedOption === option && option !== question.correctAnswer && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
