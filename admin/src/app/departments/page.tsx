"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DepartmentsTable } from "@/components/departments-table"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchDepartments,
  deleteDepartment,
} from "@/store/slices/departments-slice"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function DepartmentsPage() {
  const dispatch = useAppDispatch()
  const { departments, isLoading, error } = useAppSelector(
    (state) => state.departments
  )
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      console.error("Department fetch error:", error)
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const sanitizedDepartments = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      description: dept.description || "",
      createdAt: dept.createdAt || new Date().toISOString(),
      updatedAt: dept.updatedAt || new Date().toISOString(),
    }))
  }, [departments])

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this department?"
    )
    if (!confirmed) return

    try {
      await dispatch(deleteDepartment(id)).unwrap()
      toast({
        title: "Success",
        description: "Department deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
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
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No departments found. Click "Add Department" to create one.
            </div>
          ) : (
            <DepartmentsTable
              departments={sanitizedDepartments}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
