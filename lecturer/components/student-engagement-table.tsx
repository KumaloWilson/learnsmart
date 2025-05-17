"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStudentEngagement } from "@/lib/auth/hooks"
import { useAuth } from "@/lib/auth/auth-context"
import { Loader2, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { StudentEngagement } from "@/lib/auth/types"

interface StudentEngagementTableProps {
  courseId: string
  semesterId: string
}

export function StudentEngagementTable({ courseId, semesterId }: StudentEngagementTableProps) {
  const { lecturerProfile } = useAuth()
  const { getStudentEngagement, engagementData, isLoading, error } = useStudentEngagement()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof StudentEngagement>("overallEngagement")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchData = async () => {
      if (
        lecturerProfile?.id &&
        courseId &&
        semesterId &&
        !isInitialLoading &&
        (!engagementData || !engagementData.studentEngagement)
      ) {
        try {
          await getStudentEngagement(lecturerProfile.id, courseId, semesterId)
        } catch (err) {
          console.error("Error fetching student engagement data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, semesterId, getStudentEngagement, engagementData, isInitialLoading])

  const handleSort = (field: keyof StudentEngagement) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedStudents = engagementData?.studentEngagement
    ? [...engagementData.studentEngagement].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        } else {
          // Assume numbers
          return sortDirection === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number)
        }
      })
    : []

  const getEngagementBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "very high":
        return <Badge className="bg-green-600">Very High</Badge>
      case "high":
        return <Badge className="bg-green-500">High</Badge>
      case "moderate":
        return <Badge className="bg-yellow-500">Moderate</Badge>
      case "low":
        return <Badge className="bg-orange-500">Low</Badge>
      case "very low":
        return <Badge className="bg-red-500">Very Low</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  if (isInitialLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Engagement</CardTitle>
          <CardDescription>Detailed engagement metrics for each student</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading student data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Engagement</CardTitle>
          <CardDescription>Detailed engagement metrics for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!engagementData || !engagementData.studentEngagement || engagementData.studentEngagement.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Engagement</CardTitle>
          <CardDescription>Detailed engagement metrics for each student</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No student data available for this course</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Engagement</CardTitle>
        <CardDescription>Detailed engagement metrics for each student</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8" onClick={() => handleSort("overallAttendanceRate")}>
                    Attendance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8" onClick={() => handleSort("quizCompletionRate")}>
                    Quiz Completion
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8" onClick={() => handleSort("assessmentSubmissionRate")}>
                    Assignment
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8" onClick={() => handleSort("overallEngagement")}>
                    Overall
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8" onClick={() => handleSort("engagementLevel")}>
                    Level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.studentProfileId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">{student.studentEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.overallAttendanceRate.toFixed(1)}%</TableCell>
                  <TableCell>{student.quizCompletionRate.toFixed(1)}%</TableCell>
                  <TableCell>{student.assessmentSubmissionRate.toFixed(1)}%</TableCell>
                  <TableCell>{student.overallEngagement.toFixed(1)}%</TableCell>
                  <TableCell>{getEngagementBadge(student.engagementLevel)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${student.studentProfileId}`}>View Student</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
