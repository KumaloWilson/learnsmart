"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LecturerTable } from "@/components/lecturers/lecturer-table"
import { useLecturers } from "@/hooks/use-lecturers"
import { Plus } from "lucide-react"

export default function LecturersManagement() {
  const router = useRouter()
  const { loadLecturers } = useLecturers()

  // Remove loadLecturers from the dependency array
  useEffect(() => {
    loadLecturers()
  }, [loadLecturers]) // Empty dependency array

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lecturers Management</h1>
          <p className="text-muted-foreground">Manage lecturer information and course assignments</p>
        </div>
        <Button onClick={() => router.push("/lecturers/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lecturer
        </Button>
      </div>

      <LecturerTable />
    </div>
  )
}