"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import type { AttendanceRecord } from "@/features/attendance/types"

interface AttendanceCalendarProps {
  records: AttendanceRecord[]
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates to attendance records
  const attendanceMap = records.reduce(
    (acc, record) => {
      const date = new Date(record.date).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(record)
      return acc
    },
    {} as Record<string, AttendanceRecord[]>,
  )

  // Get records for the selected date
  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""
  const selectedDateRecords = attendanceMap[selectedDateStr] || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
        <CardDescription>View your attendance records by date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                present: Object.keys(attendanceMap)
                  .filter((dateStr) => attendanceMap[dateStr].some((record) => record.isPresent))
                  .map((dateStr) => new Date(dateStr)),
                absent: Object.keys(attendanceMap)
                  .filter((dateStr) => attendanceMap[dateStr].some((record) => !record.isPresent))
                  .map((dateStr) => new Date(dateStr)),
              }}
              modifiersClassNames={{
                present: "bg-green-100 text-green-700 font-medium",
                absent: "bg-red-100 text-red-700 font-medium",
              }}
            />
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-100" />
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-100" />
                <span>Absent</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">
              {date
                ? date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
                : "Select a date"}
            </h3>
            {selectedDateRecords.length > 0 ? (
              <div className="space-y-3">
                {selectedDateRecords.map((record) => (
                  <div key={record.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {record.course.code}: {record.topic}
                      </div>
                      {record.isPresent ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Present
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <XCircle className="mr-1 h-3 w-3" />
                          Absent
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{record.notes}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No attendance records for this date.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
