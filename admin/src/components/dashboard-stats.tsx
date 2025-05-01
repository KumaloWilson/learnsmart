import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalStudents: number
    totalLecturers: number
    totalCourses: number
    totalPrograms: number
    totalSchools: number
    totalDepartments: number
    recentActivities?: any[]
    courseEnrollmentData?: any[]
    atRiskStudentsData?: any[]
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Enrolled students</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLecturers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Active lecturers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Available courses</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPrograms.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Academic programs</p>
        </CardContent>
      </Card>
    </div>
  )
}
