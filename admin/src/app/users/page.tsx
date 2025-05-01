"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { UsersTable } from "@/components/users-table"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchUsers, updateUserStatus } from "@/store/slices/users-slice"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { users, isLoading, error } = useAppSelector((state) => state.users)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await dispatch(updateUserStatus({ id, isActive })).unwrap()
      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isActive ? "activate" : "deactivate"} user`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Users"
        description="Manage system users including students, lecturers, and administrators"
        actions={
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
