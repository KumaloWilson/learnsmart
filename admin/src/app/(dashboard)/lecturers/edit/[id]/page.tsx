"use client"

import { useEffect } from "react"
import { LecturerForm } from "@/components/lecturers/lecturer-form"
import { useLecturers } from "@/hooks/use-lecturers"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"


export default function EditLecturerPage() {

  const params = useParams()
  const id = params.id as string

  const { currentLecturer, loadLecturer, isLoading } = useLecturers()

  useEffect(() => {
    loadLecturer(id)
  }, [id, loadLecturer])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Lecturer</h1>
        <p className="text-muted-foreground">Update lecturer information</p>
      </div>

      {isLoading.currentLecturer ? (
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
        <LecturerForm lecturer={currentLecturer!} isEdit />
      )}
    </div>
  )
}
