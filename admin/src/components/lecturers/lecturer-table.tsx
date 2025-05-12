"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useLecturers } from "@/hooks/use-lecturers"
import { MoreHorizontal, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function LecturerTable() {
  const router = useRouter()
  const { toast } = useToast()
  const { lecturers, isLoading, error, loadLecturers, removeLecturer } = useLecturers()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadLecturers()
  }, [loadLecturers])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.user!.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.user!.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.user!.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      await removeLecturer(id)
      toast({
        title: "Success",
        description: "Lecturer deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete lecturer",
        variant: "destructive",
      })
    }
  }

  if (isLoading.lecturers) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[40px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lecturers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLecturers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No lecturers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLecturers.map((lecturer) => (
                <TableRow key={lecturer.id}>
                  <TableCell className="font-medium">
                    {lecturer.user!.firstName} {lecturer.user!.lastName}
                  </TableCell>
                  <TableCell>{lecturer.user!.email}</TableCell>
                  <TableCell>{lecturer.department?.name || "N/A"}</TableCell>
                  <TableCell>{lecturer.specialization}</TableCell>
                  <TableCell>
                    {lecturer.status ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/lecturers/${lecturer.id}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/lecturers/edit/${lecturer.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/lecturers/${lecturer.id}/courses`)}>
                          Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(lecturer.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
