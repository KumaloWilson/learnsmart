"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuizAttempt } from "@/components/quizzes/quiz-attempt"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { startQuizAttempt, getQuizById } from "@/lib/api/quizzes-api"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface QuizAttemptPageProps {
  params: {
    id: string
  }
}

export default function QuizAttemptPage({ params }: QuizAttemptPageProps) {
  const quizId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState<any>(null)
  const [attempt, setAttempt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(quizId)
        setQuiz(quizData)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load quiz details",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId, toast])

  const handleStartQuiz = async () => {
    if (!user?.studentProfileId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Student profile not found",
      })
      return
    }

    setStarting(true)
    try {
      const attemptData = await startQuizAttempt({
        quizId,
        studentProfileId: user.studentProfileId,
      })
      setAttempt(attemptData)
    } catch (error) {
      console.error("Error starting quiz:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start quiz. You may have already attempted this quiz.",
      })
      router.push(`/quizzes/${quizId}`)
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    )
  }

  if (!attempt) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading={quiz?.title || "Start Quiz"}
          text="You are about to start a quiz. Once started, the timer will begin."
        />

        <div className="mt-6 rounded-lg border bg-card p-6">
          <div className="mb-6 space-y-2">
            <h3 className="text-lg font-medium">Quiz Information</h3>
            <p>Time limit: {quiz?.timeLimit} minutes</p>
            <p>Total questions: {quiz?.numberOfQuestions}</p>
            <p>Total marks: {quiz?.totalMarks}</p>
            <p>Passing marks: {quiz?.passingMarks}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Instructions</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>Once you start, the timer cannot be paused</li>
              <li>Answer all questions before submitting</li>
              <li>You can only attempt this quiz once</li>
              <li>Your results will be available immediately after submission</li>
            </ul>
          </div>

          <Button className="mt-6" size="lg" onClick={handleStartQuiz} disabled={starting}>
            {starting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Quiz...
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={quiz?.title || "Quiz"} text={`Time remaining: ${quiz?.timeLimit} minutes`} />

      <QuizAttempt attempt={attempt} quiz={quiz} />
    </DashboardShell>
  )
}
