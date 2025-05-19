import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"
import type { AttendanceRecord } from "@/features/courses/types"

interface CourseAttendanceProps {
  attendanceRecords: AttendanceRecord[]
}

export function CourseAttendance({ attendanceRecords }: CourseAttendanceProps) {
  if (!attendanceRecords.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>No attendance records available for this course yet.</CardDescription>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>Your attendance record for this course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{attendanceRate.toFixed(0)}%</div>
              <p className="text-sm text-muted-foreground">
                Attended {attendedClasses} out of {totalClasses} classes
              </p>
            </div>
            <Badge
              className={`${
                attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
            >
              {attendanceRate >= 80 ? "Excellent" : attendanceRate >= 60 ? "Good" : "Poor"}
            </Badge>
          </div>
          <Progress value={attendanceRate} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Detailed attendance for each class</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.topic}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
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
    </div>
  )
}
