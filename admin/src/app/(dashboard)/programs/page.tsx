"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProgramTable } from "@/components/programs/program-table"
import { usePrograms } from "@/hooks/use-programs"
import { Plus } from "lucide-react"

export default function ProgramsManagement() {
  const router = useRouter()
  const { loadPrograms } = usePrograms()

  useEffect(() => {
    loadPrograms()
  }, [loadPrograms])

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
