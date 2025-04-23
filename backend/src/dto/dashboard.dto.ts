import { IsInt, IsNumber, IsObject } from "class-validator"
import { Expose } from "class-transformer"

export class DashboardStatsDto {
  @IsInt()
  @Expose()
  totalStudents: number

  @IsInt()
  @Expose()
  totalLecturers: number

  @IsInt()
  @Expose()
  totalCourses: number

  @IsInt()
  @Expose()
  totalPrograms: number

  @IsInt()
  @Expose()
  totalDepartments: number

  @IsInt()
  @Expose()
  totalSchools: number

  @IsInt()
  @Expose()
  activeStudents: number

  @IsInt()
  @Expose()
  activeLecturers: number

  @IsInt()
  @Expose()
  recentEnrollments: number

  @IsInt()
  @Expose()
  upcomingAssessments: number
}

export class EnrollmentStatsDto {
  @IsInt()
  @Expose()
  totalEnrollments: number

  @IsObject()
  @Expose()
  enrollmentsByProgram: {
    programId: string
    programName: string
    count: number
  }[]

  @IsObject()
  @Expose()
  enrollmentsByLevel: {
    level: number
    count: number
  }[]

  @IsObject()
  @Expose()
  enrollmentTrend: {
    period: string
    count: number
  }[]
}

export class AcademicPerformanceDto {
  @IsNumber()
  @Expose()
  averageGpa: number

  @IsObject()
  @Expose()
  performanceByProgram: {
    programId: string
    programName: string
    averageGpa: number
  }[]

  @IsObject()
  @Expose()
  performanceByLevel: {
    level: number
    averageGpa: number
  }[]

  @IsObject()
  @Expose()
  performanceTrend: {
    period: string
    averageGpa: number
  }[]
}

export class UserActivityDto {
  @IsInt()
  @Expose()
  newUsers: number

  @IsInt()
  @Expose()
  activeUsers: number

  @IsObject()
  @Expose()
  usersByRole: {
    role: string
    count: number
  }[]

  @IsObject()
  @Expose()
  activityTrend: {
    period: string
    count: number
  }[]
}

export class CourseStatsDto {
  @IsInt()
  @Expose()
  totalCourses: number

  @IsInt()
  @Expose()
  activeCourses: number

  @IsObject()
  @Expose()
  coursesByProgram: {
    programId: string
    programName: string
    count: number
  }[]

  @IsObject()
  @Expose()
  coursesByLevel: {
    level: number
    count: number
  }[]

  @IsObject()
  @Expose()
  popularCourses: {
    courseId: string
    courseName: string
    enrollmentCount: number
  }[]
}
