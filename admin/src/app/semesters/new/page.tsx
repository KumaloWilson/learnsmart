"use client"

import { PageHeader } from "@/components/page-header"
import { SemesterForm } from "@/components/semester-form"

export default function NewSemesterPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Create New Semester" text="Add a new academic semester" />
      <div className="mt-8">
        <SemesterForm />
      </div>
    </div>
  )
}
