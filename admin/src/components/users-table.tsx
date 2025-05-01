"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"


interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchWithAuth("/users")
        setUsers(data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStatusChangeClick = (id: string, currentStatus: boolean) => {
    setStatusChangeId(id)
    setNewStatus(!currentStatus)
  }

  const handleStatusChangeConfirm = async () => {
    if (statusChangeId) {
      try {
        await fetchWithAuth(`/users/${statusChangeId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ isActive: newStatus }),
        })

        setUsers((prev) => prev.map((user) => (user.id === statusChangeId ? { ...user, isActive: newStatus } : user)))

        toast({
          title: `User ${newStatus ? "activated" : "deactivated"}`,
          description: `The user has been successfully ${newStatus ? "activated" : "deactivated"}.`,
        })
      } catch (error) {
        console.error(`Failed to ${newStatus ? "activate" : "deactivate"} user:`, error)
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to ${newStatus ? "activate" : "deactivate"} user. Please try again.`,
        })
      } finally {
        setStatusChangeId(null)
      }
    }
  }

  const handleStatusChangeCancel = () => {
    setStatusChangeId(null)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive"
      case "lecturer":
        return "secondary"
      case "student":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => handleStatusChangeClick(user.id, user.isActive)}
                      />
                      <span>{user.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/users/${user.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {user.role === "Student" && (
                          <Link href={`/users/${user.id}/student-profile`}>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Student Details
                            </DropdownMenuItem>
                          </Link>
                        )}
                        {user.role === "Lecturer" && (
                          <Link href={`/users/${user.id}/lecturer-profile`}>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Lecturer Details
                            </DropdownMenuItem>
                          </Link>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!statusChangeId} onOpenChange={(open) => !open && setStatusChangeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{newStatus ? "Activate User" : "Deactivate User"}</AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus
                ? "This will allow the user to access the system again. Are you sure you want to proceed?"
                : "This will prevent the user from accessing the system. Are you sure you want to proceed?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStatusChangeCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChangeConfirm}>
              {newStatus ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
