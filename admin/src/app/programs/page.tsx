"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "../../components/page-header"
import { ProgramsTable } from "../../components/programs-table"
import { fetchWithAuth } from "../../lib/api-helpers"
import { useToast } from "../../components/ui/use-toast"

export default function ProgramsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const { toast } = useToast()

  const loadPrograms = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/programs")
      setPrograms(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load programs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetchWithAuth(`/programs/${id}`, { method: "DELETE" })
      toast({
        title: "Success",
        description: "Program deleted successfully",
      })
      loadPrograms()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      })
    }
  }

  // Load programs on component mount
  useEffect(() => {
    loadPrograms()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="Programs"
        text="Manage academic programs across all departments"
        children={
          <Link href="/programs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <ProgramsTable programs={programs} isLoading={isLoading} onDelete={handleDelete} />
      </div>
    </div>
  )
}
