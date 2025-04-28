"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DepartmentsTable } from "../../components/departments-table"
import { PageHeader } from "../../components/page-header"
import { useToast } from "../../hooks/use-toast"
import { fetchWithAuth } from "../../lib/api-helpers"

export default function DepartmentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const { toast } = useToast()

  const loadDepartments = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/departments")
      setDepartments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/departments/${id}`, { method: "DELETE" })
      toast({
        title: "Success",
        description: "Department deleted successfully",
      })
      loadDepartments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      })
    }
  }

  // Load departments on component mount
  useEffect(() => {
    loadDepartments()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="Departments"
        text="Manage academic departments across all schools"
        children={
          <Link href="/departments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <DepartmentsTable departments={departments} isLoading={isLoading} onDelete={handleDelete} />
      </div>
    </div>
  )
}
