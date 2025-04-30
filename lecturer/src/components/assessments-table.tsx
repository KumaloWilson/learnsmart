"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authService, lecturerService } from "@/lib/api-services"

interface Assessment {
  id: string
  title: string
  type: "assignment" | "quiz" | "exam" | "project"
  dueDate: string
  totalPoints: number
  submissionCount: number
  totalStudents: number
  averageScore: number | null
  status: "upcoming" | "active" | "past_due" | "completed"
  courseId: string
  courseName: string
}

export function AssessmentsTable() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true)
        const user = authService.getCurrentUser()
        if (!user) throw new Error("User not authenticated")

        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const assessmentsData = await lecturerService.getLecturerAssessments(lecturerProfile.id)
        setAssessments(assessmentsData)
        setFilteredAssessments(assessmentsData)
      } catch (err) {
        console.error("Failed to fetch assessments:", err)
        setError("Failed to load assessment data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  useEffect(() => {
    let result = [...assessments]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(query) || assessment.courseName.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((assessment) => assessment.type === typeFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((assessment) => assessment.status === statusFilter)
    }

    setFilteredAssessments(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, typeFilter, statusFilter, assessments])

  const handleDeleteAssessment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        await lecturerService.deleteAssessment(id)
        setAssessments(assessments.filter((assessment) => assessment.id !== id))
      } catch (err) {
        console.error("Failed to delete assessment:", err)
        alert("Failed to delete assessment. Please try again.")
      }
    }
  }

  const getAssessmentTypeBadge = (type: string) => {
    switch (type) {
      case "assignment":
        return <Badge className="bg-blue-500">Assignment</Badge>
      case "quiz":
        return <Badge className="bg-green-500">Quiz</Badge>
      case "exam":
        return <Badge className="bg-purple-500">Exam</Badge>
      case "project":
        return <Badge className="bg-amber-500">Project</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAssessments = filteredAssessments.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return <AssessmentsTableSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>Manage all your course assessments</CardDescription>
        </div>
        <Link href="/assessments/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No assessments found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {assessments.length > 0
                ? "No assessments match your search criteria."
                : "You haven't created any assessments yet."}
            </p>
            <Link href="/assessments/new" passHref>
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>{assessment.courseName}</TableCell>
                      <TableCell>{getAssessmentTypeBadge(assessment.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(assessment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="mr-1 inline-block h-3 w-3" />
                          {new Date(assessment.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assessment.submissionCount} / {assessment.totalStudents}
                      </TableCell>
                      <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/assessments/${assessment.id}`} className="flex w-full">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/assessments/${assessment.id}/submissions`} className="flex w-full">
                                View Submissions
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/assessments/${assessment.id}/edit`} className="flex w-full">
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteAssessment(assessment.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function AssessmentsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3 mt-1" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
