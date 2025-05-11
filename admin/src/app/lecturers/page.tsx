"use client"

import { PageHeader } from "@/components/page-header"
import { LecturersTable } from "@/components/lecturers-table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAppDispatch, useAppSelector } from "@/store"
import { useToast } from "@/components/ui/use-toast"
import { fetchLecturers, deleteLecturer } from "@/store/slices/lecturers-slice"
import { useEffect, useCallback } from "react"

export default function LecturersPage() {
  const dispatch = useAppDispatch()
  const { lecturers, error, loading } = useAppSelector((state) => state.lecturers)
  const { toast } = useToast()

  // Fetch lecturers only once when component mounts
  useEffect(() => {
    dispatch(fetchLecturers())
  }, [dispatch])

  // Handle errors with a separate effect
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Memoize the delete handler to prevent recreation on each render
  const handleDelete = useCallback(async (id: string) => {
    try {
      await dispatch(deleteLecturer(id)).unwrap()
      toast({
        title: "Success",
        description: "Lecturer deleted successfully",
      })
    } catch{
      toast({
        title: "Error",
        description: "Failed to delete lecturer",
        variant: "destructive",
      })
    }
  }, [dispatch, toast])

  // Process the lecturers data to include department name and properly format fields
  const processedLecturers = lecturers?.map(lecturer => {
    return {
      id: lecturer.id,
      firstName: lecturer.user?.firstName || "",
      lastName: lecturer.user?.lastName || "",
      email: lecturer.user?.email || "",
      title: lecturer.title || "",
      department: lecturer.departmentId || "", // Ideally would map to department name
      specialization: lecturer.specialization || "",
      status: lecturer.status || "inactive",
      staffId: lecturer.staffId || "",
      // Add any other fields needed by the table
    }
  }) || []

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <PageHeader
          title="Lecturer Management"
          description="Manage lecturer profiles, course assignments, and teaching materials"
        />
        <div className="mt-6">
          <LecturersTable 
            data={processedLecturers} 
            isLoading={loading}
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  )
}