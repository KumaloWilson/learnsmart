"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "../../../components/page-header"
import { UserForm } from "../../../components/user-form"
import { fetchWithAuth } from "../../../lib/api-helpers"
import { useToast } from "../../../components/ui/use-toast"

interface UserPageProps {
  params: {
    id: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth(`/api/users/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.id, toast])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithAuth(`/api/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update user")
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      })
      router.push("/users")
      router.refresh()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-12 w-[250px] mb-4" />
        <Skeleton className="h-6 w-[350px] mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader heading="User Not Found" text="The requested user could not be found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading={`Edit User: ${user.firstName} ${user.lastName}`} text="Update user details" />
      <div className="mt-8">
        <UserForm
          initialData={{
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
