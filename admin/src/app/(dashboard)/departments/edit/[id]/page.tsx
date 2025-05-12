"use client"

import { useEffect } from "react"
import { DepartmentForm } from "@/components/departments/department-form"
import { useDepartments } from "@/hooks/use-departments"
import { Skeleton } from "@/components/ui/skeleton"

interface EditDepartmentPageProps {
  params: {
    id: string
  }
}

export default function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  const { id } = params
  const { currentDepartment, loadDepartment, isLoading } = useDepartments()

  useEffect(() => {
    loadDepartment(id)
  }, [id, loadDepartment])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Department</h1>
        <p className="text-muted-foreground">Update department information</p>
      </div>

      {isLoading.currentDepartment ? (
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
        <DepartmentForm department={currentDepartment!} isEdit />
      )}
    </div>
  )
}
