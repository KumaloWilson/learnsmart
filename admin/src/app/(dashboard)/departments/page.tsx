"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DepartmentTable } from "@/components/departments/department-table"
import { useDepartments } from "@/hooks/use-departments"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DepartmentsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const { loadDepartments, error } = useDepartments()

  useEffect(() => {
    loadDepartments().catch((err) => {
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to load departments:", err)
    })
  }, [loadDepartments, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments Management</h1>
          <p className="text-muted-foreground">Manage academic departments</p>
        </div>
        <Button onClick={() => router.push("/departments/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <DepartmentTable />
    </div>
  )
}
