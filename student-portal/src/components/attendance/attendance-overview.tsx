"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { getAttendanceData } from "@/lib/api/attendance-api"
import { PieChart } from "@/components/charts"
import { useAuth } from "@/contexts/auth-context"

export function AttendanceOverview() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentProfileId) return

      setIsLoading(true)
      try {
        const data = await getAttendanceData({})
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
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Loading attendance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!attendanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>No attendance data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No attendance data is available yet.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data for attendance chart
  const attendanceChartData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        label: "Attendance",
        data: [75, 15, 10],
        backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(239, 68, 68, 0.7)", "rgba(250, 204, 21, 0.7)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)", "rgb(250, 204, 21)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Your attendance across all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Attendance Rate</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">75%</div>
                  <p className="text-sm text-muted-foreground">30 classes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">15%</div>
                  <p className="text-sm text-muted-foreground">6 classes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Late</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">10%</div>
                  <p className="text-sm text-muted-foreground">4 classes</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="h-[300px]">
            <PieChart data={attendanceChartData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
