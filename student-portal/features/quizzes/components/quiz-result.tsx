"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, BookOpen, ArrowLeft } from "lucide-react"
import { QuizAttempt } from "../types"

interface QuizResultsProps {
  attempt: QuizAttempt
  onClose: () => void
}

export function QuizResults({ attempt, onClose }: QuizResultsProps) {
  if (!attempt.score || !attempt.answers || !attempt.quiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results Unavailable</CardTitle>
          <CardDescription>The quiz results could not be loaded. Please try again later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onClose}>Return to Quizzes</Button>
        </CardContent>
      </Card>
    )
  }

  const scorePercentage = Math.round((attempt.score / attempt.quiz.totalMarks) * 100)
  const isPassed = attempt.isPassed
  const timedOut = attempt.status === "timed_out"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{attempt.quiz.title} Results</CardTitle>
              <CardDescription>{attempt.quiz.description}</CardDescription>
            </div>
            <Badge variant={isPassed ? "default" : "destructive"}>{isPassed ? "Passed" : "Failed"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {timedOut && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-amber-800">Quiz Timed Out</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Your quiz was automatically submitted because the time limit was reached. Unanswered questions were
                    marked as incorrect.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Your Score</span>
              <span className="font-bold text-lg">
                {attempt.score} / {attempt.quiz.totalMarks} ({scorePercentage}%)
              </span>
            </div>
            <Progress value={scorePercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span className="font-medium">
                Passing: {Math.round((attempt.quiz.passingMarks / attempt.quiz.totalMarks) * 100)}%
              </span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-md p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <BookOpen className="h-4 w-4" />
                <span>Quiz Details</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span>{attempt.quiz.numberOfQuestions}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span>{attempt.quiz.timeLimit} minutes</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span>{new Date(attempt.endTime || "").toLocaleString()}</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted rounded-md p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <CheckCircle className="h-4 w-4" />
                <span>Performance</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Correct Answers:</span>
                  <span className="text-green-600 font-medium">
                    {Math.round((attempt.score / attempt.quiz.totalMarks) * attempt.quiz.numberOfQuestions)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Incorrect Answers:</span>
                  <span className="text-red-600 font-medium">
                    {attempt.quiz.numberOfQuestions -
                      Math.round((attempt.score / attempt.quiz.totalMarks) * attempt.quiz.numberOfQuestions)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={isPassed ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {isPassed ? "Passed" : "Failed"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {attempt.feedback && (
            <div className="bg-muted rounded-md p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>Feedback</span>
              </div>
              <p className="text-sm">{attempt.feedback}</p>
            </div>
          )}

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-lg">Question Review</h3>
            {attempt.questions.map((question, index) => {
              const answer = attempt.answers?.find((a) => a.questionIndex === index)
              const isCorrect = answer?.selectedOption === question.correctAnswer

              return (
                <Card key={index} className={`border ${isCorrect ? "border-green-200" : "border-red-200"}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      {answer ? (
                        isCorrect ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" /> Correct
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" /> Incorrect
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" /> Unanswered
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-2">{question.question}</p>

                    {question.options && (
                      <div className="space-y-1 mt-2 text-sm">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded-md ${
                              option === question.correctAnswer
                                ? "bg-green-50 border border-green-200"
                                : option === answer?.selectedOption && option !== question.correctAnswer
                                  ? "bg-red-50 border border-red-200"
                                  : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-xs font-medium">(Correct Answer)</span>
                            )}
                            {option === answer?.selectedOption && option !== question.correctAnswer && (
                              <span className="ml-2 text-red-600 text-xs font-medium">(Your Answer)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button onClick={onClose} className="w-full mt-4 flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Quizzes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
