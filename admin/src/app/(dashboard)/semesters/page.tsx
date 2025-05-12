"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SemesterTable } from "@/components/semesters/semester-table"
import { useSemesters } from "@/hooks/use-semesters"
import { Plus } from "lucide-react"

export default function SemestersManagement() {
  const router = useRouter()
  const { loadSemesters } = useSemesters()

  useEffect(() => {
    loadSemesters()
  }, [loadSemesters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Semesters Management</h1>
          <p className="text-muted-foreground">Manage academic semesters and terms</p>
        </div>
        <Button onClick={() => router.push("/semesters/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Semester
        </Button>
      </div>

      <SemesterTable />
    </div>
  )
}
