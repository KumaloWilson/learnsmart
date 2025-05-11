import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecommendationsList } from "@/components/recommendations/recommendations-list"

export const metadata: Metadata = {
  title: "Learning Recommendations | Learn Smart",
  description: "Personalized learning recommendations",
}

export default function RecommendationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Learning Recommendations"
        text="Personalized recommendations to help you improve your learning"
      />
      <RecommendationsList />
    </DashboardShell>
  )
}
