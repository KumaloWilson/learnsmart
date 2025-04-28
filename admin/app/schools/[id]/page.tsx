"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "../../../components/page-header"
import { SchoolForm } from "../../../components/school-form"
import { useToast } from "../../../hooks/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"


interface School {
  id: string
  name: string
  code?: string
  description?: string
}

export default function EditSchoolPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data = await fetchWithAuth(`/schools/${params.id}`)
        setSchool(data)
      } catch (error) {
        console.error("Failed to fetch school:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load school details. Please try again.",
        })
        router.push("/schools")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchool()
  }, [params.id, router, toast])

  if (isLoading) {
    return <div className="flex-1 p-8 text-center">Loading school details...</div>
  }

  if (!school) {
    return <div className="flex-1 p-8 text-center">School not found</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader heading="Edit School" text={`Update details for ${school.name}`} />

      <div className="mx-auto max-w-2xl">
        <SchoolForm school={school} />
      </div>
    </div>
  )
}
