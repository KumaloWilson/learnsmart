"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AtRiskStudent {
  id: string
  name: string
  studentId: string
  courseCode: string
  attendanceRate: number
  assignmentCompletion: number
  riskLevel: "low" | "medium" | "high" | "critical"
  riskFactors: string[]
}

export function AtRiskStudentsTable() {
  const [students, setStudents] = useState<AtRiskStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // In a real app, fetch from API
    const fetchAtRiskStudents = async () => {
      try {
        // Mock data for demonstration
        const mockStudents = [
          {
            id: "1",
            name: "John Smith",
            studentId: "ST12345",
            courseCode: "CS101",
            attendanceRate: 45,
            assignmentCompletion: 30,
            riskLevel: "critical" as const,
            riskFactors: ["Low attendance", "Missing assignments", "Failed midterm"],
          },
          {
            id: "2",
            name: "Emma Johnson",
            studentId: "ST23456",
            courseCode: "CS201",
            attendanceRate: 60,
            assignmentCompletion: 50,
            riskLevel: "high" as const,
            riskFactors: ["Low quiz scores", "Inconsistent attendance"],
          },
          {
            id: "3",
            name: "Michael Brown",
            studentId: "ST34567",
            courseCode: "CS301",
            attendanceRate: 70,
            assignmentCompletion: 65,
            riskLevel: "medium" as const,
            riskFactors: ["Declining performance", "Late submissions"],
          },
          {
            id: "4",
            name: "Sophia Davis",
            studentId: "ST45678",
            courseCode: "CS101",
            attendanceRate: 75,
            assignmentCompletion: 70,
            riskLevel: "low" as const,
            riskFactors: ["Recent absences", "Missed one assignment"],
          },
        ]

        // Simulate API delay
        setTimeout(() => {
          setStudents(mockStudents)
          setLoading(false)
        }, 1000)

        // Real API call would be:
        // const response = await fetch('/api/lecturer/students/at-risk')
        // const data = await response.json()
        // setStudents(data)
      } catch (error) {
        console.error("Failed to fetch at-risk students:", error)
        setLoading(false)
      }
    }

    fetchAtRiskStudents()
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof AtRiskStudent]
    const bValue = b[sortColumn as keyof AtRiskStudent]

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
      <div className="w-full">
        <div className="flex items-center h-10 px-4">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="border rounded-md">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center h-16 px-4 border-b last:border-0">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <Button variant="ghost" onClick={() => handleSort("name")} className="px-0 font-medium">
                  Student
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("courseCode")} className="px-0 font-medium">
                  Course
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("riskLevel")} className="px-0 font-medium">
                  Risk Level
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No at-risk students found
                </TableCell>
              </TableRow>
            ) : (
              sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div>{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.studentId}</div>
                  </TableCell>
                  <TableCell>{student.courseCode}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(student.riskLevel)} className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      {getRiskLevelText(student.riskLevel)}
                    </Badge>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact Student</DropdownMenuItem>
                        <DropdownMenuItem>Create Intervention Plan</DropdownMenuItem>
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

function getRiskBadgeVariant(riskLevel: string): "default" | "secondary" | "destructive" | "outline" {
  switch (riskLevel) {
    case "critical":
      return "destructive"
    case "high":
      return "default"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

function getRiskLevelText(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "Critical Risk"
    case "high":
      return "High Risk"
    case "medium":
      return "Medium Risk"
    case "low":
      return "Low Risk"
    default:
      return riskLevel
  }
}
