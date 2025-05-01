"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store"
import { createSchool } from "@/store/slices/schools-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { PageHeader } from "@/components/page-header"
import { SchoolForm } from "@/components/school-form"
import { useToast } from "@/components/ui/use-toast"


export default function NewSchoolPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const resultAction = await dispatch(createSchool(data))
      if (createSchool.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "School created successfully",
        })
        router.push("/schools")
      } else if (createSchool.rejected.match(resultAction)) {
        toast({
          title: "Error",
          description: (resultAction.payload as string) || "Failed to create school",
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageHeader heading="Add School" text="Create a new school in the system" />
        <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow">
          <SchoolForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}
