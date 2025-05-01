"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { DepartmentForm } from "@/components/department-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDepartmentById, updateDepartment } from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentDepartment, isLoading, error } = useAppSelector((state) => state.departments)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchDepartmentById(params.id))
  }, [dispatch, params.id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      router.push("/departments")
    }
  }, [error, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await dispatch(updateDepartment({ id: params.id, departmentData: data })).unwrap()

      toast({
        title: "Success",
        description: "Department updated successfully",
      })

      router.push("/departments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department",
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
      <PageHeader title={`Edit Department: ${currentDepartment?.name}`} description="Update department information" />
      <div className="mt-6">
        <DepartmentForm 
          initialData={currentDepartment ? {
            ...currentDepartment,
            description: currentDepartment.description || ''
          } : undefined} 
          onSubmit={handleSubmit} 
          isLoading={isSaving} 
        />
      </div>
    </div>
  )
}
