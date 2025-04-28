"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { DepartmentForm } from "../../../components/department-form"
import { PageHeader } from "../../../components/page-header"
import { useToast } from "../../../hooks/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  const [department, setDepartment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await fetchWithAuth(`/departments/${params.id}`)
        setDepartment(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load department details",
          variant: "destructive",
        })
        router.push("/departments")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartment()
  }, [params.id, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await fetchWithAuth(`/departments/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })

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
      <PageHeader heading={`Edit Department: ${department?.name}`} text="Update department information" />
      <div className="mt-6">
        <DepartmentForm initialData={department} onSubmit={handleSubmit} isLoading={isSaving} />
      </div>
    </div>
  )
}
