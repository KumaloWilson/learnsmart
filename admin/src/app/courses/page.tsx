"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { CoursesTable } from "@/components/courses-table"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCourses, deleteCourse } from "@/store/slices/courses-slice"
import { useToast } from "@/components/ui/use-toast"

export default function CoursesPage() {
  const dispatch = useAppDispatch()
  const { courses, isLoading, error } = useAppSelector((state) => state.courses)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchCourses())
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
      await dispatch(deleteCourse(id)).unwrap()
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Courses"
        description="Manage academic courses across all programs"
        actions={
          <Link href="/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <CoursesTable 
          courses={courses.map(course => ({
            ...course,
            description: course.description || '',
            createdAt: course.createdAt || '',
            updatedAt: course.updatedAt || ''
          }))} 
          isLoading={isLoading} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  )
}
