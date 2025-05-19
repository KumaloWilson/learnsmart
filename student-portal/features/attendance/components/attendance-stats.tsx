import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Chart,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"
import type { AttendanceRecord } from "@/features/attendance/types"
import { ReactElement } from "react"

interface AttendanceStatsProps {
  records: AttendanceRecord[]
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export function AttendanceStats({ records }: AttendanceStatsProps) {
  // Calculate attendance statistics
  const totalClasses = records.length
  const attendedClasses = records.filter((record) => record.isPresent).length
  const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0

  // Group by course
  const courseAttendance = records.reduce(
    (acc, record) => {
      const courseId = record.course.id
      if (!acc[courseId]) {
        acc[courseId] = {
          courseId,
          courseName: record.course.name,
          courseCode: record.course.code,
          total: 0,
          attended: 0,
        }
      }
      acc[courseId].total += 1
      if (record.isPresent) {
        acc[courseId].attended += 1
      }
      return acc
    },
    {} as Record<string, { courseId: string; courseName: string; courseCode: string; total: number; attended: number }>,
  )

  const courseAttendanceArray = Object.values(courseAttendance).map((course) => ({
    ...course,
    rate: course.total > 0 ? (course.attended / course.total) * 100 : 0,
  }))

  // Prepare data for pie chart
  const pieData = [
    { name: "Present", value: attendedClasses, color: "#4ade80" },
    { name: "Absent", value: totalClasses - attendedClasses, color: "#f87171" },
  ]

  // Custom tooltip renderer
  const renderTooltipContent = (props: TooltipProps<number, string>): ReactElement | null => {
    const { active, payload } = props;
    
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    
    // Extract data from payload
    const data = payload[0].payload as PieChartData;
    const value = data.value;
    const percentage = ((value / totalClasses) * 100).toFixed(0);
    
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <span className="font-medium">
            {data.name}: {value} classes ({percentage}%)
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Your attendance statistics across all courses</CardDescription>
          </div>
          <Badge
            className={`${
              attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-yellow-500" : "bg-red-500"
            }`}
          >
            {attendanceRate.toFixed(0)}% Overall Attendance
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-40">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={renderTooltipContent} />
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend
                  items={pieData.map(item => ({ name: item.name, color: item.color }))}
                />
              </ChartContainer>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="text-sm font-medium">Attendance by Course</div>
            {courseAttendanceArray.map((course) => (
              <div key={course.courseId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    {course.courseCode}: {course.courseName}
                  </div>
                  <div className="text-sm">
                    {course.attended}/{course.total} ({course.rate.toFixed(0)}%)
                  </div>
                </div>
                <Progress
                  value={course.rate}
                  className={`h-2 ${
                    course.rate >= 80 ? "bg-green-100" : course.rate >= 60 ? "bg-yellow-100" : "bg-red-100"
                  }`}
                  indicatorClassName={`${
                    course.rate >= 80 ? "bg-green-500" : course.rate >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}