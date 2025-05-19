"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourseStudentMasteries } from "@/lib/auth/hooks"
import { formatDistanceToNow } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface StudentMasteryTableProps {
  courseId: string
  semesterId: string
}

export function StudentMasteryTable({ courseId, semesterId }: StudentMasteryTableProps) {
  const { studentMasteries, loading, error, refetch } = useCourseStudentMasteries(courseId, semesterId)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (courseId && semesterId) {
      // refetch()
    }
  }, [courseId, semesterId, refetch])

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "bg-green-500"
    if (level >= 60) return "bg-blue-500"
    if (level >= 40) return "bg-yellow-500"
    if (level >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  const filteredMasteries = studentMasteries.filter((student) =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Mastery Levels</CardTitle>
          <CardDescription>View individual student mastery levels for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>Failed to load student mastery data. Please try again later.</p>
            <p className="text-sm text-destructive mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!studentMasteries || studentMasteries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Mastery Levels</CardTitle>
          <CardDescription>View individual student mastery levels for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>No student mastery data available for this course.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Mastery Levels</CardTitle>
        <CardDescription>View individual student mastery levels for this course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Mastery Level</TableHead>
                <TableHead className="hidden md:table-cell">Progress</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMasteries.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>{student.masteryLevel}%</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Progress value={student.masteryLevel} className={getMasteryColor(student.masteryLevel)} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDistanceToNow(new Date(student.lastUpdated), { addSuffix: true })}
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
