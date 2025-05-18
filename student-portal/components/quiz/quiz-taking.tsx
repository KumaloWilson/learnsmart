"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { updateTimeRemaining, setCurrentQuestionIndex, saveAnswer, submitQuiz } from "@/lib/redux/slices/quizSlice"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Clock, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react"
import type { QuizAttempt } from "@/lib/types/quiz.types"

interface QuizTakingProps {
  attempt: QuizAttempt
}

export function QuizTaking({ attempt }: QuizTakingProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { timeRemaining, currentQuestionIndex, answers, isSubmitting } = useAppSelector((state) => state.quiz)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)

  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle timer countdown
  useEffect(() => {
    if (timeRemaining === null) return

    const timer = setInterval(() => {
      if (timeRemaining <= 0) {
        clearInterval(timer)
        // Auto-submit when time expires
        dispatch(submitQuiz())
        return
      }

      // Show warning when 1 minute remaining
      if (timeRemaining === 60) {
        setShowTimeWarning(true)
      }

      dispatch(updateTimeRemaining(timeRemaining - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch, timeRemaining])

  // Get current question
  const currentQuestion = attempt.questions[currentQuestionIndex]

  // Get current answer if exists
  const currentAnswer = answers.find((a) => a.questionIndex === currentQuestionIndex)

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    dispatch(
      saveAnswer({
        questionIndex: currentQuestionIndex,
        selectedOption: option,
        type: currentQuestion.type,
      }),
    )
  }

  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))
    }
  }

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < attempt.questions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))
    }
  }

  // Go to specific question
  const goToQuestion = (index: number) => {
    dispatch(setCurrentQuestionIndex(index))
  }

  // Handle quiz submission
  const handleSubmit = () => {
    setShowConfirmSubmit(true)
  }

  // Confirm submission
  const confirmSubmit = () => {
    setShowConfirmSubmit(false)
    dispatch(submitQuiz())
  }

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / attempt.questions.length) * 100

  // Calculate answered questions count
  const answeredCount = answers.length

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-in fade-in-50 duration-500">
      {/* Quiz Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{attempt.quiz.title}</h1>
          <p className="text-muted-foreground">{attempt.quiz.topic}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-medium">{timeRemaining !== null ? formatTime(timeRemaining) : "Loading..."}</span>
          </div>
          <Button variant="outline" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Submit Quiz
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Question {currentQuestionIndex + 1} of {attempt.questions.length}
          </span>
          <span>
            {answeredCount} of {attempt.questions.length} answered
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer?.selectedOption || ""}
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            {attempt.questions.map((_, index) => {
              const isAnswered = answers.some((a) => a.questionIndex === index)
              const isCurrent = index === currentQuestionIndex

              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === attempt.questions.length - 1}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your quiz? You have answered {answeredCount} out of{" "}
              {attempt.questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          {answeredCount < attempt.questions.length && (
            <Alert
              variant="warning"
              className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                You have {attempt.questions.length - answeredCount} unanswered questions. Unanswered questions will be
                marked as incorrect.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Submit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Warning Dialog */}
      <Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Warning</DialogTitle>
            <DialogDescription>You have 1 minute remaining to complete the quiz.</DialogDescription>
          </DialogHeader>
          <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              The quiz will be automatically submitted when the time expires.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={() => setShowTimeWarning(false)}>Continue Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
