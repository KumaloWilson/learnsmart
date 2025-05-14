"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getEngagementLevelColor } from "@/lib/utils"
import Link from "next/link"
import type { StudentEngagement } from "@/lib/auth/types"

interface StudentEngagementTableProps {
  students: StudentEngagement[]
}

export function StudentEngagementTable({ students }: StudentEngagementTableProps) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No student engagement data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Quiz Completion</TableHead>
            <TableHead>Assessment Submission</TableHead>
            <TableHead>Overall Engagement</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.studentProfileId}>
              <TableCell>
                <div className="font-medium">{student.studentName}</div>
                <div className="text-sm text-muted-foreground">{student.studentEmail}</div>
              </TableCell>
              <TableCell>{student.overallAttendanceRate}%</TableCell>
              <TableCell>{student.quizCompletionRate}%</TableCell>
              <TableCell>{student.assessmentSubmissionRate}%</TableCell>
              <TableCell>{student.overallEngagement}%</TableCell>
              <TableCell>
                <Badge className={getEngagementLevelColor(student.engagementLevel)}>{student.engagementLevel}</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/students/${student.studentProfileId}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
