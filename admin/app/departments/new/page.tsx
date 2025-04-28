"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DepartmentForm } from "../../../components/department-form"
import { PageHeader } from "../../../components/page-header"
import { useToast } from "../../../hooks/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"

export default function NewDepartmentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await fetchWithAuth("/departments", {
        method: "POST",
        body: JSON.stringify(data),
      })

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
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Create Department" description="Add a new academic department to the system" />
      <div className="mt-6">
        <DepartmentForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
