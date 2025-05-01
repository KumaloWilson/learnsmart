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
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"

interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export function SemestersTable() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const data = await fetchWithAuth("/semesters")
        setSemesters(data)
      } catch (error) {
        console.error("Failed to fetch semesters:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load semesters. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSemesters()
  }, [toast])

  const filteredSemesters = semesters.filter((semester) =>
    semester.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await fetchWithAuth(`/semesters/${deleteId}`, {
          method: "DELETE",
        })

        setSemesters((prev) => prev.filter((semester) => semester.id !== deleteId))

        toast({
          title: "Semester deleted",
          description: "The semester has been successfully deleted.",
        })
      } catch (error) {
        console.error("Failed to delete semester:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete semester. Please try again.",
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
          placeholder="Search semesters..."
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
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
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
            ) : filteredSemesters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No semesters found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSemesters.map((semester) => (
                <TableRow key={semester.id}>
                  <TableCell className="font-medium">{semester.name}</TableCell>
                  <TableCell>{new Date(semester.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(semester.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={semester.isActive ? "default" : "secondary"}>
                      {semester.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(semester.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/semesters/${semester.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDeleteClick(semester.id)}>
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
              This action cannot be undone. This will permanently delete the semester and may affect course enrollments
              and academic records.
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
