"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { SemesterForm } from "@/components/semester-form"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/api-helpers"

export default function NewSemesterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithAuth("/api/semesters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create semester")
      }

      toast({
        title: "Success",
        description: "Semester created successfully",
      })
      router.push("/semesters")
      router.refresh()
    } catch (error) {
      console.error("Error creating semester:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create semester",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Create New Semester" text="Add a new academic semester" />
      <div className="mt-8">
        <SemesterForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
