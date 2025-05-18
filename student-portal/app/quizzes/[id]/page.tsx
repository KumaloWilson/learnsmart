"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { useStartQuizMutation, useSubmitQuizMutation, type QuizAnswer } from "@/lib/api/quiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { profile } = useAppSelector((state) => state.student)

  const [startQuiz, { isLoading: isStarting }] = useStartQuizMutation()
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation()

  const [quizAttempt, setQuizAttempt] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)

  // Check for existing quiz attempt in localStorage
  useEffect(() => {
    const checkExistingAttempt = async () => {
      try {
        setIsLoading(true)

        // Check if there's a saved attempt in localStorage
        const savedAttempt = localStorage.getItem(`quiz_attempt_${params.id}`)

        if (savedAttempt) {
          const parsedAttempt = JSON.parse(savedAttempt)

          // Check if the attempt is still valid (not expired or completed)
          const now = new Date()
          const startTime = new Date(parsedAttempt.startTime)
          const timeLimit = parsedAttempt.quiz.timeLimit * 60 * 1000 // convert minutes to milliseconds
          const expiryTime = new Date(startTime.getTime() + timeLimit)

          if (parsedAttempt.status === "in_progress" && now < expiryTime) {
            // Valid attempt, load it
            setQuizAttempt(parsedAttempt)

            // Load saved answers if any
            const savedAnswers = localStorage.getItem(`quiz_answers_${parsedAttempt.id}`)
            if (savedAnswers) {
              setAnswers(JSON.parse(savedAnswers))
            }

            // Calculate remaining time
            const remainingMs = expiryTime.getTime() - now.getTime()
            setTimeRemaining(Math.floor(remainingMs / 1000))
          } else if (parsedAttempt.status === "completed" || parsedAttempt.status === "timed_out") {
            // Completed attempt, show results
            setQuizAttempt(parsedAttempt)
            setQuizCompleted(true)
            setQuizResults(parsedAttempt)

            if (parsedAttempt.answers) {
              setAnswers(parsedAttempt.answers)
            }
          } else {
            // Expired attempt, start a new one
            await startNewQuiz()
          }
        } else {
          // No saved attempt, start a new one
          await startNewQuiz()
        }
      } catch (err) {
        console.error("Error checking existing attempt:", err)
        setError("Failed to load quiz. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (profile?.id) {
      checkExistingAttempt()
    }
  }, [profile?.id, params.id])

  // Start a new quiz attempt
  const startNewQuiz = async () => {
    if (!profile?.id) {
      setError("User profile not found. Please log in again.")
      return
    }

    try {
      const response = await startQuiz({
        quizId: params.id,
        studentProfileId: profile.id,
      }).unwrap()

      setQuizAttempt(response)
      setTimeRemaining(response.quiz.timeLimit * 60) // convert minutes to seconds

      // Save attempt to localStorage
      localStorage.setItem(`quiz_attempt_${params.id}`, JSON.stringify(response))

      // Initialize empty answers array
      const initialAnswers = response.questions.map((_, index) => ({
        questionIndex: index,
        selectedOption: "",
        type: "multiple_choice",
      }))

      setAnswers(initialAnswers)
      localStorage.setItem(`quiz_answers_${response.id}`, JSON.stringify(initialAnswers))
    } catch (err) {
      console.error("Error starting quiz:", err)
      setError("Failed to start quiz. Please try again.")
    }
  }

  // Handle countdown timer
  useEffect(() => {
    if (timeRemaining === null || quizCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, quizCompleted])

  // Handle time up - auto submit with random answers for unanswered questions
  const handleTimeUp = async () => {
    if (!quizAttempt) return

    // Create a copy of current answers
    const finalAnswers = [...answers]

    // Fill in random answers for any unanswered questions
    quizAttempt.questions.forEach((_, index) => {
      if (!finalAnswers[index].selectedOption) {
        const options = quizAttempt.questions[index].options
        const randomOption = options[Math.floor(Math.random() * options.length)]
        finalAnswers[index].selectedOption = randomOption
      }
    })

    // Submit the quiz
    await handleSubmitQuiz(finalAnswers)

    toast({
      title: "Time's up!",
      description: "Your quiz has been automatically submitted.",
      variant: "destructive",
    })
  }

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, option: string) => {
    const updatedAnswers = [...answers]
    updatedAnswers[questionIndex] = {
      ...updatedAnswers[questionIndex],
      selectedOption: option,
    }

    setAnswers(updatedAnswers)

    // Save to localStorage
    if (quizAttempt) {
      localStorage.setItem(`quiz_answers_${quizAttempt.id}`, JSON.stringify(updatedAnswers))
    }
  }

  // Navigate to next/previous question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < (quizAttempt?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = async (finalAnswers = answers) => {
    if (!quizAttempt) return

    try {
      const response = await submitQuiz({
        attemptId: quizAttempt.id,
        answers: finalAnswers,
      }).unwrap()

      // Clear localStorage
      localStorage.removeItem(`quiz_attempt_${params.id}`)
      localStorage.removeItem(`quiz_answers_${quizAttempt.id}`)

      // Show results
      setQuizCompleted(true)
      setQuizResults(response)

      toast({
        title: "Quiz submitted successfully!",
        description: `Your score: ${response.score}%`,
        variant: response.isPassed ? "default" : "destructive",
      })
    } catch (err) {
      console.error("Error submitting quiz:", err)
      toast({
        title: "Failed to submit quiz",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      })
    }
  }

  // Format time remaining
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return "--:--"

    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!quizAttempt) return 0

    const answeredCount = answers.filter((a) => a.selectedOption).length
    return Math.round((answeredCount / quizAttempt.questions.length) * 100)
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

  if (error) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  if (!quizAttempt) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Quiz Not Found</AlertTitle>
          <AlertDescription>The quiz you're looking for doesn't exist or you don't have access to it.</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  // Quiz results view
  if (quizCompleted && quizResults) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-muted/30">
            <CardTitle>{quizResults.quiz.title} - Results</CardTitle>
            <CardDescription>{quizResults.quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium">Your Score</h3>
                <div className="text-4xl font-bold mt-2">{quizResults.score}%</div>
                <div className="mt-1">
                  {quizResults.isPassed ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Passed
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Failed
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Correct Answers</span>
                    <span>
                      {quizResults.aiAnalysis?.correctAnswers || 0}/{quizResults.aiAnalysis?.totalQuestions || 0}
                    </span>
                  </div>
                  <Progress
                    value={(quizResults.aiAnalysis?.correctAnswers / quizResults.aiAnalysis?.totalQuestions) * 100 || 0}
                    className="h-2"
                  />

                  <div className="flex justify-between text-sm mt-4">
                    <span>Passing Score</span>
                    <span>{quizResults.quiz.passingMarks}%</span>
                  </div>
                  <Progress value={quizResults.quiz.passingMarks} className="h-2 bg-muted" />
                </div>
              </div>
            </div>

            {quizResults.aiAnalysis && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Performance Analysis</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {quizResults.aiAnalysis.strengths.map((strength: string, i: number) => (
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
                      {quizResults.aiAnalysis.weaknesses.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {quizResults.aiAnalysis.weaknesses.map((weakness: string, i: number) => (
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
                      {quizResults.aiAnalysis.recommendations.map((recommendation: string, i: number) => (
                        <li key={i} className="text-sm">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => router.push(`/courses/${quizResults.quiz.courseId}`)}>
              Back to Course
            </Button>
            <Button onClick={() => router.push("/courses")}>View All Courses</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Question Review</h3>

          {quizResults.aiAnalysis?.questionResults.map((result: any, index: number) => (
            <Card key={index} className={`border-l-4 ${result.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                  {result.isCorrect ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
                      <CheckCircle className="h-4 w-4" /> Correct
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1 text-sm">
                      <AlertCircle className="h-4 w-4" /> Incorrect
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{result.question}</p>

                <div className="space-y-2">
                  {quizResults.questions[index].options.map((option: string, optionIndex: number) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-md ${
                        option === quizResults.questions[index].correctAnswer
                          ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : option === result.userAnswer.selectedOption && !result.isCorrect
                            ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-2">
                          {option === quizResults.questions[index].correctAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : option === result.userAnswer.selectedOption && !result.isCorrect ? (
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{option}</p>
                          {option === quizResults.questions[index].correctAnswer && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {quizResults.questions[index].explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Quiz taking view
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quizAttempt.quiz.title}</CardTitle>
              <CardDescription>{quizAttempt.quiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-md">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-mono font-medium">{formatTimeRemaining()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quizAttempt.questions.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{calculateProgress()}% answered</span>
              <Progress value={calculateProgress()} className="w-24 h-2" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">{quizAttempt.questions[currentQuestionIndex].question}</h3>

            <RadioGroup
              value={answers[currentQuestionIndex]?.selectedOption || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
              className="space-y-3"
            >
              {quizAttempt.questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === quizAttempt.questions.length - 1 ? (
              <Button onClick={() => handleSubmitQuiz()} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={goToNextQuestion} disabled={currentQuestionIndex === quizAttempt.questions.length - 1}>
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {quizAttempt.questions.map((_, index) => (
          <Button
            key={index}
            variant={index === currentQuestionIndex ? "default" : answers[index]?.selectedOption ? "outline" : "ghost"}
            className={`h-10 w-10 p-0 ${answers[index]?.selectedOption ? "border-primary/50" : ""}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
