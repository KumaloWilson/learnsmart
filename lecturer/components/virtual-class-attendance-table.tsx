"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime, getInitials } from "@/lib/utils"
import Link from "next/link"
import type { VirtualClassAttendance } from "@/lib/auth/types"

interface VirtualClassAttendanceTableProps {
  attendance: VirtualClassAttendance[]
}

export function VirtualClassAttendanceTable({ attendance }: VirtualClassAttendanceTableProps) {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No attendance data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Join Time</TableHead>
            <TableHead>Leave Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={record.studentProfile.user.firstName}
                    />
                    <AvatarFallback>
                      {getInitials(record.studentProfile.user.firstName, record.studentProfile.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {record.studentProfile.user.firstName} {record.studentProfile.user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{record.studentProfile.studentId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{record.joinTime ? formatTime(record.joinTime) : "N/A"}</TableCell>
              <TableCell>{record.leaveTime ? formatTime(record.leaveTime) : "Still in session"}</TableCell>
              <TableCell>{record.durationMinutes ? `${record.durationMinutes} mins` : "N/A"}</TableCell>
              <TableCell>
                <Badge variant={record.isPresent ? "default" : "destructive"}>
                  {record.isPresent ? "Present" : "Absent"}
                </Badge>
              </TableCell>
              <TableCell>{record.notes || "No notes"}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/students/${record.studentProfileId}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
