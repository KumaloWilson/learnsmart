"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"

interface Department {
  id: string
  name: string
  description: string
  schoolId: string
  schoolName?: string
  createdAt: string
}

export function DepartmentsTable() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await fetchWithAuth("/departments")
        setDepartments(data)
      } catch (error) {
        console.error("Failed to fetch departments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load departments. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [toast])

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.schoolName && department.schoolName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await fetchWithAuth(`/departments/${deleteId}`, {
          method: "DELETE",
        })

        setDepartments((prev) => prev.filter((dept) => dept.id !== deleteId))

        toast({
          title: "Department deleted",
          description: "The department has been successfully deleted.",
        })
      } catch (error) {
        console.error("Failed to delete department:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete department. Please try again.",
        })
      } finally {
        setDeleteId(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search departments..."
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
              <TableHead>School</TableHead>
              <TableHead>Description</TableHead>
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
                    <Skeleton className="h-6 w-10" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No departments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.schoolName}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{new Date(department.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/departments/${department.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDeleteClick(department.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
