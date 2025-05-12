"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProgramTable } from "@/components/programs/program-table"
import { usePrograms } from "@/hooks/use-programs"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProgramsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const { loadPrograms, error } = usePrograms()

  useEffect(() => {
    // Call loadPrograms without wrapping in another async function
    loadPrograms()
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to load programs. Please try again.",
          variant: "destructive",
        })
        console.error("Failed to load programs:", err)
      })
  }, []) // Remove loadPrograms from dependency array to prevent infinite loop

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
          <h1 className="text-3xl font-bold tracking-tight">Programs Management</h1>
          <p className="text-muted-foreground">Manage academic programs and degrees</p>
        </div>
        <Button onClick={() => router.push("/programs/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <ProgramTable />
    </div>
  )
}