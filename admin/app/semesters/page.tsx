"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "react-day-picker"
import { PageHeader } from "../../components/page-header"
import { SemestersTable } from "../../components/semesters-table"
import { useToast } from "../../hooks/use-toast"
import { fetchWithAuth } from "../../lib/api-helpers"

export default function SemestersPage() {
  const { toast } = useToast()
  const [semesters, setSemesters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetchWithAuth("/api/semesters")
        if (!response.ok) {
          throw new Error("Failed to fetch semesters")
        }
        const data = await response.json()
        setSemesters(data)
      } catch (error) {
        console.error("Error fetching semesters:", error)
        toast({
          title: "Error",
          description: "Failed to load semesters",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSemesters()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/semesters/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete semester")
      }

      setSemesters(semesters.filter((semester: any) => semester.id !== id))
      toast({
        title: "Success",
        description: "Semester deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting semester:", error)
      toast({
        title: "Error",
        description: "Failed to delete semester",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <PageHeader heading="Semesters" text="Manage academic semesters" />
        <Link href="/semesters/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <SemestersTable semesters={semesters} isLoading={isLoading} onDelete={handleDelete} />
      </div>
    </div>
  )
}
