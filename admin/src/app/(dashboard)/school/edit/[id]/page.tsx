"use client"

import { useEffect } from "react"
import { SchoolForm } from "@/components/schools/school-form"
import { useSchools } from "@/hooks/use-schools"
import { Skeleton } from "@/components/ui/skeleton"

interface EditSchoolPageProps {
  params: {
    id: string
  }
}

export default function EditSchoolPage({ params }: EditSchoolPageProps) {
  const { id } = params
  const { currentSchool, loadSchool, isLoading } = useSchools()

  useEffect(() => {
    loadSchool(id)
  }, [id, loadSchool])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit School</h1>
        <p className="text-muted-foreground">Update school information</p>
      </div>

      {isLoading.currentSchool ? (
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
        <SchoolForm school={currentSchool!} isEdit />
      )}
    </div>
  )
}
