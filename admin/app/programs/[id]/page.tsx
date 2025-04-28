"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "../../../components/page-header"
import { ProgramForm } from "../../../components/program-form"
import { useToast } from "../../../hooks/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"

export default function EditProgramPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const data = await fetchWithAuth(`/programs/${params.id}`)
        setProgram(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load program details",
          variant: "destructive",
        })
        router.push("/programs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()
  }, [params.id, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await fetchWithAuth(`/programs/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })

      toast({
        title: "Success",
        description: "Program updated successfully",
      })

      router.push("/programs")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update program",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-32 w-full max-w-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading={`Edit Program: ${program?.name}`} text="Update program information" />
      <div className="mt-6">
        <ProgramForm initialData={program} onSubmit={handleSubmit} isLoading={isSaving} />
      </div>
    </div>
  )
}
