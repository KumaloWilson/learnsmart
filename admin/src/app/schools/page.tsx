"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchSchools, deleteSchool } from "@/store/slices/schools-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SchoolsTable } from "@/components/schools-table"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/components/ui/use-toast"


export default function SchoolsPage() {
  const dispatch = useAppDispatch()
  const { schools, isLoading, error } = useAppSelector((state) => state.schools)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchSchools())
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
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        const resultAction = await dispatch(deleteSchool(id))
        if (deleteSchool.fulfilled.match(resultAction)) {
          toast({
            title: "Success",
            description: "School deleted successfully",
          })
        }
      } catch (error) {
        console.error("Failed to delete school:", error)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <PageHeader heading="Schools" text="Manage academic schools" />
          <Link href="/schools/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add School
            </Button>
          </Link>
        </div>
        <div className="mt-8">
          <SchoolsTable schools={schools} isLoading={isLoading} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}
