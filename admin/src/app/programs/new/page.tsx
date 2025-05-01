"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ProgramForm } from "@/components/program-form"
import { useAppDispatch } from "@/store"
import { createProgram } from "@/store/slices/programs-slice"
import { useToast } from "@/components/ui/use-toast"

export default function NewProgramPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await dispatch(createProgram(data)).unwrap()

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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Create Program" description="Add a new academic program to the system" />
      <div className="mt-6">
        <ProgramForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  )
}
