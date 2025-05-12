"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CourseTable } from "@/components/courses/course-table"
import { useCourses } from "@/hooks/use-courses"
import { Plus } from "lucide-react"

export default function CoursesManagement() {
  const router = useRouter()
  const { loadCourses } = useCourses()

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
          <p className="text-muted-foreground">Manage courses and course materials</p>
        </div>
        <Button onClick={() => router.push("/courses/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <CourseTable />
    </div>
  )
}
