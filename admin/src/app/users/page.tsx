"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { UsersTable } from "@/components/users-table"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchUsers, updateUserStatus } from "@/store/slices/users-slice"
import { useToast } from "@/components/ui/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <PageHeader heading="Users" text="Manage users in the system" />
          <Link href="/users/new">
            <Button>
              <Plus className="mr-2" />
              Add User
            </Button>
          </Link>
        </div>
        <UsersTable
         
        />
        </div>
    </div>
  )
}
