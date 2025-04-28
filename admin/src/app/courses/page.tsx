"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CoursesTable } from "../../components/courses-table"
import { PageHeader } from "../../components/page-header"
import { fetchWithAuth } from "../../lib/api-helpers"
import { useToast } from "../../components/ui/use-toast"

export default function CoursesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const { toast } = useToast()

  const loadCourses = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/courses")
      setCourses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/courses/${id}`, { method: "DELETE" })
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
      loadCourses()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  // Load courses on component mount
  useEffect(() => {
    loadCourses()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="Courses"
        text="Manage courses across all programs"
        children={
          <Link href="/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <CoursesTable courses={courses} isLoading={isLoading} onDelete={handleDelete} />
      </div>
    </div>
  )
}
