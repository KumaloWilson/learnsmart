"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "../../components/page-header"
import { UsersTable } from "../../components/users-table"
import { fetchWithAuth } from "../../lib/api-helpers"
import { useToast } from "../../components/ui/use-toast"


export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const { toast } = useToast()

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/users")
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await fetchWithAuth(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      })

      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
      })

      loadUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isActive ? "activate" : "deactivate"} user`,
        variant: "destructive",
      })
    }
  }

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="Users"
        text="Manage system users including students, lecturers, and administrators"
        children={
          <Link href="/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        }
      />
      <div className="mt-6">
        <UsersTable users={users} isLoading={isLoading} onStatusChange={handleStatusChange} />
      </div>
    </div>
  )
}
