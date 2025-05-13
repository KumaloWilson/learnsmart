"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CourseAssignmentTable } from "@/components/lecturers/course-assignment-table"
import { useLecturers } from "@/hooks/use-lecturers"
import { Plus, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function LecturerCoursesPage() {
   const params = useParams()
 
   const id = params.id as string
  const router = useRouter()
  const { currentLecturer, loadLecturer, isLoading } = useLecturers()

  useEffect(() => {
    loadLecturer(id)
  }, [id, loadLecturer])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {isLoading.currentLecturer ? (
            <Skeleton className="h-8 w-64 mb-2" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">
              {currentLecturer?.title} {currentLecturer?.user?.firstName} {currentLecturer?.user?.lastName} - Courses
            </h1>
          )}
          <p className="text-muted-foreground">Manage course assignments for this lecturer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/lecturers/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lecturer
          </Button>
          <Button onClick={() => router.push(`/lecturers/${id}/courses/assign`)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Course
          </Button>
        </div>
      </div>

      <CourseAssignmentTable lecturerId={id} />
    </div>
  )
}
