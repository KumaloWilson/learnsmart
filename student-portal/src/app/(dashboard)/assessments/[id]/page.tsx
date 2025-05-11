import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AssessmentDetails } from "@/components/assessments/assessment-details"
import { AssessmentDetailsSkeleton } from "@/components/skeletons/assessment-details-skeleton"
import { getAssessmentById } from "@/lib/api/assessments-api"

export const metadata: Metadata = {
  title: "Assessment Details | Learn Smart",
  description: "View and submit assessment",
}

interface AssessmentPageProps {
  params: {
    id: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const assessmentId = params.id

  try {
    // This is a server component, so we can fetch data directly
    const assessment = await getAssessmentById(assessmentId)

    if (!assessment) {
      notFound()
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={assessment.title}
          text={`Due: ${new Date(assessment.dueDate).toLocaleDateString()}`}
        />

        <Suspense fallback={<AssessmentDetailsSkeleton />}>
          <AssessmentDetails assessment={assessment} />
        </Suspense>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching assessment:", error)
    notFound()
  }
}
