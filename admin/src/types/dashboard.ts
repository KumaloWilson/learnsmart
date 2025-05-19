export interface DashboardOverview {
  totalStudents: number
  totalLecturers: number
  totalCourses: number
  totalPrograms: number
  totalDepartments: number
  totalSchools: number
  activeStudents: number
  activeLecturers: number
  recentEnrollments: number
  upcomingAssessments: number
}

export interface EnrollmentData {
  totalEnrollments: number
  enrollmentsByProgram: EnrollmentByProgram[]
  enrollmentsByLevel: EnrollmentByLevel[]
  enrollmentTrend: TrendData[]
}

export interface EnrollmentByProgram {
  program: string
  count: number
}

export interface EnrollmentByLevel {
  level: string
  count: number
}

export interface UserActivity {
  newUsers: number
  activeUsers: number
  usersByRole: UsersByRole[]
  activityTrend: TrendData[]
}

export interface UsersByRole {
  role: string
  count: number
}

export interface TrendData {
  period: string
  count: number
}

export interface RecentActivity {
  recentEnrollments: RecentEnrollment[]
  recentAssessments: RecentAssessment[]
  recentUsers: RecentUser[]
}

export interface RecentEnrollment {
  id: string
  studentName: string
  programName: string
  enrollmentDate: string
}

export interface RecentAssessment {
  id: string
  title: string
  courseName: string
  dueDate: string
}

export interface RecentUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export interface SystemHealth {
  status: string
  uptime: number
  memoryUsage: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  }
  databaseConnections: number
  activeUsers: number
  apiRequests: {
    total: number
    successful: number
    failed: number
  }
  lastBackup: string
}
