"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SchoolTable } from "@/components/schools/school-table"
import { useSchools } from "@/hooks/use-schools"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SchoolManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const { loadSchools, error } = useSchools()

  useEffect(() => {
    loadSchools().catch((err) => {
      toast({
        title: "Error",
        description: "Failed to load schools. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to load schools:", err)
    })
  }, [loadSchools, toast])

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
