"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import StudentTable from "@/components/students/student-table"
import { useStudents } from "@/hooks/use-students"
import { Plus } from "lucide-react"

export default function StudentsManagement() {
  const router = useRouter()
  const { getStudents } = useStudents()

  useEffect(() => {
    getStudents()
  }, [getStudents])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
          <p className="text-muted-foreground">Manage student information and records</p>
        </div>
        <Button onClick={() => router.push("/students/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <StudentTable />
    </div>
  )
}
