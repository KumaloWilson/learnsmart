"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ProgramForm } from "@/components/program-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchProgramById, updateProgram } from "@/store/slices/programs-slice"
import { useToast } from "@/components/ui/use-toast"

export default function EditProgramPage({ params }: { params: { id: string } }) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProgram, isLoading, error } = useAppSelector((state) => state.programs)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchProgramById(params.id))
  }, [dispatch, params.id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      router.push("/programs")
    }
  }, [error, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await dispatch(updateProgram({ id: params.id, programData: data })).unwrap()

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
      <PageHeader title={`Edit Program: ${currentProgram?.name}`} description="Update program information" />
      <div className="mt-6">
        {currentProgram && (
          <ProgramForm
            initialData={{
              id: currentProgram.id,
              name: currentProgram.name,
              code: currentProgram.code,
              level: currentProgram.level,
              duration: currentProgram.durationYears,
              departmentId: currentProgram.departmentId,
            }}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        )}
      </div>
    </div>
  )
}
