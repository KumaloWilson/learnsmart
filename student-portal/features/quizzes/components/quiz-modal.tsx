"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Info } from "lucide-react"
import { QuizAnswer } from "../types"
import { clearCurrentQuiz, setQuizActive, startQuiz, submitQuiz } from "../redux/quizSlice"
import { QuizNavigation } from "./quiz-naviagtion"
import { QuizQuestionComponent } from "./quiz-question"
import { QuizResults } from "./quiz-result"
import { QuizTimer } from "./quiz-timer"


interface QuizModalProps {
  quizId: string
  isOpen: boolean
  onClose: () => void
}

export function QuizModal({ quizId, isOpen, onClose }: QuizModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { currentAttempt, isLoading, error, isSubmitting, answers, isQuizActive } = useAppSelector(
    (state) => state.quiz,
  )
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isExitWarningOpen, setIsExitWarningOpen] = useState(false)
  const [isSubmitWarningOpen, setIsSubmitWarningOpen] = useState(false)
  const [attemptedNavigation, setAttemptedNavigation] = useState<string | null>(null)

  // Start the quiz when the modal opens
  useEffect(() => {
    if (isOpen && !currentAttempt && !isLoading && studentProfile?.id && accessToken) {
      dispatch(
        startQuiz({
          quizId,
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [isOpen, currentAttempt, isLoading, quizId, studentProfile?.id, accessToken, dispatch])

  // Prevent navigation away from the quiz
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isQuizActive && !showResults) {
        e.preventDefault()
        e.returnValue = "You have an active quiz. Are you sure you want to leave?"
        return e.returnValue
      }
    }

    // Add event listeners for browser navigation (refresh, close tab)
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Proxy the router.push method to intercept navigation
    // This is a workaround since App Router doesn't have events like Pages Router
    const originalPush = router.push.bind(router)
    const originalReplace = router.replace.bind(router)
    
    // @ts-ignore - we're intentionally modifying the router methods
    router.push = (href: string, options?: any) => {
      if (isQuizActive && !showResults) {
        setAttemptedNavigation(href)
        setIsExitWarningOpen(true)
        return Promise.resolve(false)
      }
      return originalPush(href, options)
    }
    
    // @ts-ignore - we're intentionally modifying the router methods
    router.replace = (href: string, options?: any) => {
      if (isQuizActive && !showResults) {
        setAttemptedNavigation(href)
        setIsExitWarningOpen(true)
        return Promise.resolve(false)
      }
      return originalReplace(href, options)
    }

    // Clean up event listeners and router overrides
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // @ts-ignore - restore original methods
      router.push = originalPush
      // @ts-ignore - restore original methods
      router.replace = originalReplace
    }
  }, [isQuizActive, showResults, router])

  // Handle quiz timeout
  const handleTimeExpired = useCallback(() => {
    if (!currentAttempt || !accessToken) return

    // Generate random incorrect answers for unanswered questions
    const finalAnswers: QuizAnswer[] = [...answers]

    currentAttempt.questions.forEach((question, index) => {
      const hasAnswer = finalAnswers.some((answer) => answer.questionIndex === index)

      if (!hasAnswer && question.options && question.correctAnswer) {
        // Find an incorrect option
        const incorrectOptions = question.options.filter((option) => option !== question.correctAnswer)

        // If there are incorrect options, pick a random one
        if (incorrectOptions.length > 0) {
          const randomIndex = Math.floor(Math.random() * incorrectOptions.length)
          const randomIncorrectOption = incorrectOptions[randomIndex]

          const randomAnswer: QuizAnswer = {
            questionIndex: index,
            selectedOption: randomIncorrectOption,
            type: question.type,
          }

          finalAnswers.push(randomAnswer)
        } else {
          // If all options are correct (shouldn't happen), just pick the first option
          const randomAnswer: QuizAnswer = {
            questionIndex: index,
            selectedOption: question.options[0],
            type: question.type,
          }

          finalAnswers.push(randomAnswer)
        }
      }
    })

    // Submit the quiz with the timeout flag
    dispatch(
      submitQuiz({
        attemptId: currentAttempt.id,
        answers: finalAnswers,
        token: accessToken,
        timedOut: true,
      }),
    ).then(() => {
      setShowResults(true)
    })
  }, [currentAttempt, accessToken, answers, dispatch])

  // Handle navigation between questions
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentAttempt && currentQuestionIndex < currentAttempt.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Handle quiz submission
  const handleSubmit = () => {
    if (!currentAttempt || !accessToken) return

    // Check if all questions are answered
    const answeredQuestions = answers.length
    const totalQuestions = currentAttempt.questions.length

    if (answeredQuestions < totalQuestions) {
      setIsSubmitWarningOpen(true)
      return
    }

    submitQuizAttempt()
  }

  const submitQuizAttempt = () => {
    if (!currentAttempt || !accessToken) return

    // Generate random incorrect answers for unanswered questions
    const finalAnswers: QuizAnswer[] = [...answers]

    currentAttempt.questions.forEach((question, index) => {
      const hasAnswer = finalAnswers.some((answer) => answer.questionIndex === index)

      if (!hasAnswer && question.options && question.correctAnswer) {
        // Find an incorrect option
        const incorrectOptions = question.options.filter((option) => option !== question.correctAnswer)

        // If there are incorrect options, pick a random one
        if (incorrectOptions.length > 0) {
          const randomIndex = Math.floor(Math.random() * incorrectOptions.length)
          const randomIncorrectOption = incorrectOptions[randomIndex]

          const randomAnswer: QuizAnswer = {
            questionIndex: index,
            selectedOption: randomIncorrectOption,
            type: question.type,
          }

          finalAnswers.push(randomAnswer)
        } else {
          // If all options are correct (shouldn't happen), just pick the first option
          const randomAnswer: QuizAnswer = {
            questionIndex: index,
            selectedOption: question.options[0],
            type: question.type,
          }

          finalAnswers.push(randomAnswer)
        }
      }
    })

    dispatch(
      submitQuiz({
        attemptId: currentAttempt.id,
        answers: finalAnswers,
        token: accessToken,
      }),
    ).then(() => {
      setShowResults(true)
      setIsSubmitWarningOpen(false)
    })
  }

  // Handle modal close
  const handleModalClose = () => {
    if (isQuizActive && !showResults) {
      setIsExitWarningOpen(true)
      return
    }

    dispatch(clearCurrentQuiz())
    dispatch(setQuizActive(false))
    setShowResults(false)
    setCurrentQuestionIndex(0)
    onClose()
  }

  // Handle exit confirmation
  const handleExitConfirm = () => {
    handleTimeExpired() // Submit with random answers
    setIsExitWarningOpen(false)
    
    // If this was triggered by router navigation, continue to that route after submission
    if (attemptedNavigation) {
      const destination = attemptedNavigation
      setAttemptedNavigation(null)
      // Need to use setTimeout to ensure state updates before navigation
      setTimeout(() => router.push(destination), 0)
    }
  }

  // Get the current answer for the question
  const getCurrentAnswer = (questionIndex: number) => {
    const answer = answers.find((a) => a.questionIndex === questionIndex)
    return answer?.selectedOption
  }

  // Render loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading quiz...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render error state
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleModalClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render results
  if (showResults && currentAttempt) {
    return (
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <QuizResults attempt={currentAttempt} onClose={handleModalClose} />
        </DialogContent>
      </Dialog>
    )
  }

  // Render exit warning
  if (isExitWarningOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have an active quiz. If you leave now, your progress will be lost and the quiz will be automatically
                submitted with random answers for unanswered questions.
              </AlertDescription>
            </Alert>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsExitWarningOpen(false)}>
                Continue Quiz
              </Button>
              <Button
                variant="destructive"
                onClick={handleExitConfirm}
              >
                Exit and Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render submit warning
  if (isSubmitWarningOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You have unanswered questions. If you submit now, these questions will be marked as incorrect.
              </AlertDescription>
            </Alert>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsSubmitWarningOpen(false)}>
                Continue Quiz
              </Button>
              <Button onClick={submitQuizAttempt}>Submit Anyway</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render quiz
  if (!currentAttempt) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{currentAttempt.quiz?.title}</h2>
            <p className="text-muted-foreground">{currentAttempt.quiz?.description}</p>
          </div>

          <QuizTimer onTimeExpired={handleTimeExpired} />

          <Separator />

          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {currentAttempt.quiz?.instructions || "Answer all questions. Your progress is saved automatically."}
              </AlertDescription>
            </Alert>

            {currentAttempt.questions[currentQuestionIndex] && (
              <QuizQuestionComponent
                question={currentAttempt.questions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                currentAnswer={getCurrentAnswer(currentQuestionIndex)}
              />
            )}

            <QuizNavigation
              currentQuestion={currentQuestionIndex}
              totalQuestions={currentAttempt.questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}