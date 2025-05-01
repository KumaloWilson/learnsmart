"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { DepartmentsTable } from "@/components/departments-table"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDepartments, deleteDepartment, Department } from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"

export default function DepartmentsPage() {
  const dispatch = useAppDispatch()
  const { departments, isLoading, error } = useAppSelector((state) => state.departments)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteDepartment(id)).unwrap()
      toast({
        title: "Success",
        description: "Department deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Departments"
        description="Manage academic departments across all schools"
        actions={
          <Link href="/departments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <DepartmentsTable 
          departments={departments.map(dept => ({
            ...dept,
            description: dept.description || '',
            createdAt: dept.createdAt || new Date().toISOString(),
            updatedAt: dept.updatedAt || new Date().toISOString()
          }))}
          isLoading={isLoading} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  )
}
