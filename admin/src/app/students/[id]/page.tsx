"use client"

import { StudentDetails } from "@/components/student-details"

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <StudentDetails studentId={params.id} />
    </div>
  )
}
