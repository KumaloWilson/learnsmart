import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuizDetails } from "@/components/quizzes/quiz-details"
import { QuizDetailsSkeleton } from "@/components/skeletons/quiz-details-skeleton"
import { getQuizById } from "@/lib/api/quizzes-api"

export const metadata: Metadata = {
  title: "Quiz Details | Learn Smart",
  description: "Take a quiz",
}

interface QuizPageProps {
  params: {
    id: string
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const quizId = params.id

  try {
    // This is a server component, so we can fetch data directly
    const quiz = await getQuizById(quizId)
    
    if (!quiz) {
      notFound()
    }

    return (
      <DashboardShell>
        <DashboardHeader heading={quiz.title} text={`Time limit: ${quiz.timeLimit} minutes`} />

        <Suspense fallback={<QuizDetailsSkeleton />}>
          <QuizDetails quiz={quiz} />
        </Suspense>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching quiz:", error)
    notFound()
  }
}
