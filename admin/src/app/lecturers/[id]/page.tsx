"use client"

import { PageHeader } from "@/components/page-header"
import { LecturerDetails } from "@/components/lecturer-details"

export default function LecturerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader heading="Lecturer Details" subheading="View and manage lecturer information" />
      <LecturerDetails lecturerId={params.id} />
    </div>
  )
}
