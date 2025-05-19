import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AcademicRecord } from "@/features/auth/types"

interface AcademicSummaryProps {
  academicRecords: AcademicRecord[]
  currentPerformance: AcademicRecord
}

export function AcademicSummary({ academicRecords, currentPerformance }: AcademicSummaryProps) {
  if (!academicRecords.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Summary</CardTitle>
          <CardDescription>No academic records available.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Summary</CardTitle>
        <CardDescription>Your academic performance across semesters</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semester</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Credits Earned</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academicRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.semesterName}</TableCell>
                <TableCell>{record.academicYear}</TableCell>
                <TableCell>{record.gpa.toFixed(2)}</TableCell>
                <TableCell>{record.cgpa.toFixed(2)}</TableCell>
                <TableCell>
                  {record.earnedCredits}/{record.totalCredits}
                </TableCell>
                <TableCell>{record.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
