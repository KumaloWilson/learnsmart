"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useToast } from "./ui/use-toast"

interface Department {
  id: string
  name: string
  schoolId: string
  schoolName?: string
  description?: string
}

export function DepartmentsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchDepartments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchWithAuth("/departments")
      setDepartments(data || [])
    } catch (err) {
      console.error("Failed to fetch departments:", err)
      setError("Failed to load departments. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load departments. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)

    try {
      await fetchWithAuth(`/departments/${deleteId}`, {
        method: "DELETE",
      })

      toast({
        title: "Department deleted",
        description: "The department has been successfully deleted.",
      })

      // Refresh the departments list
      fetchDepartments()
    } catch (err) {
      console.error("Failed to delete department:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete department. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-9 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchDepartments}>
          Try Again
        </Button>
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No departments found.</p>
        <Button asChild className="mt-4">
          <Link href="/departments/new">Add Department</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.schoolName || "Unknown School"}</TableCell>
                <TableCell className="max-w-[400px] truncate">{department.description || "No description"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/departments/${department.id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(department.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
