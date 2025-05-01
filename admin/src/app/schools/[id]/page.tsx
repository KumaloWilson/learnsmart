"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchSchoolById, updateSchool } from "@/store/slices/schools-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { PageHeader } from "@/components/page-header"
import { SchoolForm } from "@/components/school-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function EditSchoolPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { currentSchool, isLoading, error } = useAppSelector((state) => state.schools)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchSchoolById(params.id))
  }, [dispatch, params.id])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const resultAction = await dispatch(updateSchool({ id: params.id, schoolData: data }))
      if (updateSchool.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "School updated successfully",
        })
        router.push("/schools")
      } else if (updateSchool.rejected.match(resultAction)) {
        toast({
          title: "Error",
          description: (resultAction.payload as string) || "Failed to update school",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Skeleton className="mb-4 h-12 w-1/3" />
          <Skeleton className="mb-8 h-6 w-1/2" />
          <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSchool) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <PageHeader heading="School Not Found" text="The requested school could not be found" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageHeader heading={`Edit School: ${currentSchool.name}`} text="Update school details" />
        <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow">
          <SchoolForm initialData={currentSchool} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}
