"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useSemesters } from "@/hooks/use-semesters"
import { MoreHorizontal, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Semester } from "@/types/semester"

export function SemesterTable() {
  const router = useRouter()
  const { toast } = useToast()
  const { semesters, isLoading, error, loadSemesters, removeSemester } = useSemesters()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadSemesters()
  }, [loadSemesters])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const filteredSemesters = semesters.filter(
    (semester) =>
      semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.academicYear.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      await removeSemester(id)
      toast({
        title: "Success",
        description: "Semester deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete semester",
        variant: "destructive",
      })
    }
  }

  const getSemesterStatus = (semester: Semester) => {
    const now = new Date()
    const startDate = new Date(semester.startDate)
    const endDate = new Date(semester.endDate)

    if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="secondary">Completed</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  if (isLoading.semesters) {
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
                <TableHead>Academic Year</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
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
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
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
            placeholder="Search semesters..."
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
              <TableHead>Academic Year</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSemesters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No semesters found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSemesters.map((semester) => (
                <TableRow key={semester.id}>
                  <TableCell className="font-medium">{semester.name}</TableCell>
                  <TableCell>{semester.academicYear}</TableCell>
                  <TableCell>{format(new Date(semester.startDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(semester.endDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{getSemesterStatus(semester)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/semesters/${semester.id}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/semesters/edit/${semester.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(semester.id)}>Delete</DropdownMenuItem>
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
