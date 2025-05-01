"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { DepartmentForm } from "@/components/department-form"
import { useAppDispatch } from "@/store"
import { createDepartment } from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"

export default function NewDepartmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await dispatch(createDepartment(data)).unwrap()

      toast({
        title: "Success",
        description: "Department created successfully",
      })

      router.push("/departments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Create Department" description="Add a new academic department to the system" />
      <div className="mt-6">
        <DepartmentForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  )
}
