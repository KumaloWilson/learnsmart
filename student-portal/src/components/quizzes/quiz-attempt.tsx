"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { submitQuizAttempt } from "@/lib/api/quizzes-api"

type QuizQuestion = {
  id: string
  text: string
  type: "multiple_choice" | "single_choice" | "text" | "true_false"
  options?: {
    id: string
    text: string
  }[]
  required: boolean
}

type QuizAttemptProps = {
  quizId: string
  title: string
  description: string
  duration: number // in minutes
  questions: QuizQuestion[]
}

export function QuizAttempt({ quizId, title, description, duration, questions }: QuizAttemptProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [timeRemaining, setTimeRemaining] = useState(duration * 60) // convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  // Format time remaining as mm:ss
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

  // Handle timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(true) // Auto-submit when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Handle single choice answer
  const handleSingleChoiceChange = (questionId: string, optionId: string) => {
    handleAnswerChange(questionId, optionId)
  }

  // Handle multiple choice answer
  const handleMultipleChoiceChange = (questionId: string, optionId: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || []

    if (checked) {
      handleAnswerChange(questionId, [...currentAnswers, optionId])
    } else {
      handleAnswerChange(
        questionId,
        currentAnswers.filter((id) => id !== optionId),
      )
    }
  }

  // Handle text answer
  const handleTextChange = (questionId: string, value: string) => {
    handleAnswerChange(questionId, value)
  }

  // Handle true/false answer
  const handleTrueFalseChange = (questionId: string, value: string) => {
    handleAnswerChange(questionId, value)
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const questionId = questions[currentQuestionIndex].id
    return !!answers[questionId]
  }

  // Check if all required questions are answered
  const areAllRequiredQuestionsAnswered = () => {
    return questions.filter((q) => q.required).every((q) => !!answers[q.id])
  }

  // Handle quiz submission
  const handleSubmit = async (isAutoSubmit = false) => {
    try {
      if (!isAutoSubmit && !areAllRequiredQuestionsAnswered()) {
        toast({
          title: "Required questions not answered",
          description: "Please answer all required questions before submitting.",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: Array.isArray(answer) ? answer : [answer],
      }))

      const response = await submitQuizAttempt(quizId, {
        answers: formattedAnswers,
        timeSpent: duration * 60 - timeRemaining,
      })

      toast({
        title: "Quiz submitted successfully",
        description: isAutoSubmit
          ? "Time's up! Your quiz has been automatically submitted."
          : "Your quiz has been submitted successfully.",
      })

      // Redirect to results page
      router.push(`/quizzes/${quizId}/results/${response.attemptId}`)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      toast({
        title: "Failed to submit quiz",
        description: "An error occurred while submitting your quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Current question
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-2 text-lg font-medium">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className={timeRemaining < 60 ? "text-red-500" : ""}>{formatTimeRemaining()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-start">
            <span className="mr-2">{currentQuestionIndex + 1}.</span>
            <span>
              {currentQuestion.text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === "single_choice" && currentQuestion.options && (
            <RadioGroup
              value={(answers[currentQuestion.id] as string) || ""}
              onValueChange={(value) => handleSingleChoiceChange(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.text}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const currentAnswers = (answers[currentQuestion.id] as string[]) || []
                const isChecked = currentAnswers.includes(option.id)

                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleMultipleChoiceChange(currentQuestion.id, option.id, checked === true)
                      }
                    />
                    <Label htmlFor={option.id}>{option.text}</Label>
                  </div>
                )
              })}
            </div>
          )}

          {currentQuestion.type === "text" && (
            <Textarea
              placeholder="Type your answer here..."
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
              className="min-h-[150px]"
            />
          )}

          {currentQuestion.type === "true_false" && (
            <RadioGroup
              value={(answers[currentQuestion.id] as string) || ""}
              onValueChange={(value) => handleTrueFalseChange(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </div>
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setShowConfirmSubmit(true)}>
              <Save className="mr-2 h-4 w-4" />
              Submit Quiz
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex flex-wrap gap-2">
        {questions.map((_, index) => {
          const questionId = questions[index].id
          const isAnswered = !!answers[questionId]
          const isRequired = questions[index].required

          return (
            <Button
              key={index}
              variant={currentQuestionIndex === index ? "default" : isAnswered ? "outline" : "ghost"}
              size="sm"
              className={`w-10 h-10 p-0 ${isRequired && !isAnswered ? "border-red-500" : ""}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
              {isAnswered && <CheckCircle className="absolute -right-1 -top-1 h-3 w-3 text-green-500" />}
            </Button>
          )
        })}
      </div>

      {showConfirmSubmit && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Are you sure you want to submit?</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              {!areAllRequiredQuestionsAnswered()
                ? "You have not answered all required questions. Are you sure you want to submit?"
                : "Once submitted, you cannot change your answers."}
            </p>
            <div className="flex space-x-2">
              <Button onClick={() => handleSubmit()} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Yes, Submit Quiz"}
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmSubmit(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {timeRemaining < 60 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Time is running out!</AlertTitle>
          <AlertDescription>
            You have less than a minute remaining. Your quiz will be automatically submitted when time runs out.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
