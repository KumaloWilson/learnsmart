"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { UserForm } from "@/components/user-form"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/store"
import { createUser } from "@/store/slices/users-slice"

export default function NewUserPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await dispatch(createUser(data)).unwrap()

      toast({
        title: "Success",
        description: "User created successfully",
      })

      router.push("/users")
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Create New User" text="Add a new user to the system" />
      <div className="mt-8">
        <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
