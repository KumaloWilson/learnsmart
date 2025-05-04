"use client"

import { useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { SemestersTable } from "@/components/semesters-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchSemesters, deleteSemester } from "@/store/slices/semesters-slice"
import { useToast } from "@/components/ui/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function SemestersPage() {
  const dispatch = useAppDispatch()
  const { semesters: rawSemesters, isLoading, error } = useAppSelector((state) => state.semesters)
  const semesters = rawSemesters.map(semester => ({
    ...semester,
    createdAt: semester.createdAt || new Date().toISOString()
  }))
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchSemesters())
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
      await dispatch(deleteSemester(id)).unwrap()
      toast({
        title: "Success",
        description: "Semester deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting semester:", error)
      toast({
        title: "Error",
        description: "Failed to delete semester",
        variant: "destructive",
      })
    }
  }

  return (
       <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center">
              <PageHeader heading="Semesters" text="Manage academic semesters" />
              <Link href="/semesters/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Semester
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <SemestersTable semesters={semesters} isLoading={isLoading} onDelete={handleDelete} />
            </div>
          </div>
     
    </div>
  )
}
