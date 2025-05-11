import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuizzesList } from "@/components/quizzes/quizzes-list"
import { QuizzesListSkeleton } from "@/components/skeletons/quizzes-list-skeleton"
import { QuizFilters } from "@/components/quizzes/quiz-filters"

export const metadata: Metadata = {
  title: "Quizzes | Learn Smart",
  description: "Take quizzes for your courses",
}

export default function QuizzesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Quizzes" text="Take quizzes to test your knowledge" />

      <QuizFilters />

      <Suspense fallback={<QuizzesListSkeleton />}>
        <QuizzesList quizzes={[]} />
      </Suspense>
    </DashboardShell>
  )
}
