"use client"

import { useEffect } from "react"
import { SemesterForm } from "@/components/semesters/semester-form"
import { useSemesters } from "@/hooks/use-semesters"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"



export default function EditSemesterPage() {
    const params = useParams()
  
    const id = params.id as string
  const { currentSemester, loadSemester, isLoading } = useSemesters()

  useEffect(() => {
    loadSemester(id)
  }, [id, loadSemester])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Semester</h1>
        <p className="text-muted-foreground">Update semester information</p>
      </div>

      {isLoading.currentSemester ? (
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
        <SemesterForm semester={currentSemester!} isEdit />
      )}
    </div>
  )
}
