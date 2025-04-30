"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpDown, BookOpen, MoreHorizontal, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { lecturerService } from "@/lib/api-services"

interface Course {
  id: string
  code: string
  name: string
  semester: string
  studentCount: number
  role: "primary" | "assistant" | "guest"
  status: "active" | "upcoming" | "completed"
}

export function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const lecturerCourses = await lecturerService.getLecturerCourses(lecturerProfile.id)
        setCourses(lecturerCourses)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user, toast])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase()
    return (
      course.code.toLowerCase().includes(query) ||
      course.name.toLowerCase().includes(query) ||
      course.semester.toLowerCase().includes(query)
    )
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof Course]
    const bValue = b[sortColumn as keyof Course]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="border rounded-md">
          <div className="h-12 px-4 border-b">
            <Skeleton className="h-6 w-full mt-3" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center h-16 px-4 border-b last:border-0">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort("code")} className="px-0 font-medium">
                  Code
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="px-0 font-medium">
                  Course Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("semester")} className="px-0 font-medium">
                  Semester
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("studentCount")} className="px-0 font-medium">
                  Students
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("role")} className="px-0 font-medium">
                  Role
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")} className="px-0 font-medium">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              sortedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.studentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(course.role)}>{getRoleText(course.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(course.status)}>{getStatusText(course.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}`}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}/materials`}>Add Materials</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}/assessments/new`}>Create Assessment</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}/students`}>View Students</Link>
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
    </div>
  )
}

function getRoleBadgeVariant(role: string): "default" | "secondary" | "outline" {
  switch (role) {
    case "primary":
      return "default"
    case "assistant":
      return "secondary"
    case "guest":
      return "outline"
    default:
      return "outline"
  }
}

function getRoleText(role: string): string {
  switch (role) {
    case "primary":
      return "Primary Instructor"
    case "assistant":
      return "Assistant"
    case "guest":
      return "Guest Lecturer"
    default:
      return role
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "active":
      return "default"
    case "upcoming":
      return "secondary"
    case "completed":
      return "outline"
    default:
      return "outline"
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Active"
    case "upcoming":
      return "Upcoming"
    case "completed":
      return "Completed"
    default:
      return status
  }
}
