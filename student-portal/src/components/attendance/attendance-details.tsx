"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getAttendance } from "@/lib/api/attendance-api"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export function AttendanceDetails() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentProfileId) return

      setIsLoading(true)
      try {
        const data = await getAttendance(user.studentProfileId)
        setAttendanceData(data)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load attendance data. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>Loading attendance details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!attendanceData || !attendanceData.records || attendanceData.records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>No attendance records available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No attendance records are available yet.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data for attendance records
  const attendanceRecords = [
    {
      id: "record1",
      course: "Introduction to Computer Science",
      date: "2023-12-05",
      status: "present",
      type: "Physical",
      duration: 90,
    },
    {
      id: "record2",
      course: "Data Structures and Algorithms",
      date: "2023-12-04",
      status: "absent",
      type: "Physical",
      duration: 90,
    },
    {
      id: "record3",
      course: "Database Systems",
      date: "2023-12-03",
      status: "late",
      type: "Physical",
      duration: 90,
      lateMinutes: 10,
    },
    {
      id: "record4",
      course: "Web Development",
      date: "2023-12-02",
      status: "present",
      type: "Virtual",
      duration: 120,
    },
    {
      id: "record5",
      course: "Introduction to Computer Science",
      date: "2023-12-01",
      status: "present",
      type: "Physical",
      duration: 90,
    },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "present") return <CheckCircle2 className="h-5 w-5 text-green-500" />
    if (status === "absent") return <XCircle className="h-5 w-5 text-red-500" />
    if (status === "late") return <Clock className="h-5 w-5 text-yellow-500" />
    return null
  }

  const getStatusBadge = (status: string) => {
    if (status === "present") return <Badge className="bg-green-500">Present</Badge>
    if (status === "absent") return <Badge className="bg-red-500">Absent</Badge>
    if (status === "late") return <Badge className="bg-yellow-500">Late</Badge>
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>Your attendance records for all classes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.course}</TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    {getStatusBadge(record.status)}
                    {record.status === "late" && record.lateMinutes && (
                      <span className="text-xs text-muted-foreground">({record.lateMinutes} min)</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.duration} min</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
