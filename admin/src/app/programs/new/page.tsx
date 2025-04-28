"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "../../../components/page-header"
import { ProgramForm } from "../../../components/program-form"
import { fetchWithAuth } from "../../../lib/api-helpers"
import { useToast } from "../../../components/ui/use-toast"

export default function NewProgramPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await fetchWithAuth("/programs", {
        method: "POST",
        body: JSON.stringify(data),
      })

      toast({
        title: "Success",
        description: "Program created successfully",
      })

      router.push("/programs")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Create Program" text="Add a new academic program to the system" />
      <div className="mt-6">
        <ProgramForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
