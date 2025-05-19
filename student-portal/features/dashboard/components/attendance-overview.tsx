import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"
import { AttendanceRecord } from "../types"


interface AttendanceOverviewProps {
  attendanceRecords: AttendanceRecord[]
}

export function AttendanceOverview({ attendanceRecords }: AttendanceOverviewProps) {
  if (!attendanceRecords.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>No attendance records available at this time.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Sort records by date (newest first)
  const sortedRecords = [...attendanceRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate attendance statistics
  const totalClasses = sortedRecords.length
  const attendedClasses = sortedRecords.filter((record) => record.isPresent).length
  const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Your attendance records for this semester</CardDescription>
          </div>
          <Badge
            className={`${attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
          >
            {attendanceRate.toFixed(0)}% Attendance Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>{record.course.code}</TableCell>
                <TableCell>{record.topic}</TableCell>
                <TableCell>
                  {record.isPresent ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Present</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="mr-1 h-4 w-4" />
                      <span>Absent</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
