"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SchoolTable } from "@/components/schools/school-table"
import { useSchools } from "@/hooks/use-schools"
import { Plus } from "lucide-react"

export default function SchoolManagement() {
  const router = useRouter()
  const { loadSchools } = useSchools()

  useEffect(() => {
    loadSchools()
  }, [loadSchools])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
          <p className="text-muted-foreground">Manage schools and their departments</p>
        </div>
        <Button onClick={() => router.push("/school/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      <SchoolTable />
    </div>
  )
}
