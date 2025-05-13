import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getQuizAttemptById } from "@/lib/api/quizzes-api"

export const metadata: Metadata = {
  title: "Quiz Results | Learn Smart",
  description: "View your quiz results",
}

interface QuizResultsPageProps {
  params: {
    id: string
    attemptId: string
  }
}

export default async function QuizResultsPage({ params }: QuizResultsPageProps) {
  const { id: quizId, attemptId } = params

  try {
    // This is a server component, so we can fetch data directly
    const attempt = await getQuizAttemptById(attemptId)

    if (!attempt || attempt.quizId !== quizId) {
      notFound()
    }

    return (
      <DashboardShell>
        <DashboardHeader heading="Quiz Results" text={`Results for ${attempt.quiz?.title || "Quiz"}`} />

        <Suspense fallback={<QuizResultsSkeleton />}>
          <QuizResults attempt={attempt} />
        </Suspense>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching quiz attempt:", error)
    notFound()
  }
}
