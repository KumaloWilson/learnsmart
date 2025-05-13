"use client"

import { useEffect } from "react"
import { ProgramForm } from "@/components/programs/program-form"
import { usePrograms } from "@/hooks/use-programs"
import { Skeleton } from "@/components/ui/skeleton"

interface EditProgramPageProps {
  params: {
    id: string
  }
}

export default function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = params
  const { currentProgram, loadProgram, isLoading } = usePrograms()

  useEffect(() => {
    loadProgram(id)
  }, [id, loadProgram])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Program</h1>
        <p className="text-muted-foreground">Update program information</p>
      </div>

      {isLoading.currentProgram ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <ProgramForm program={currentProgram!} isEdit />
      )}
    </div>
  )
}
