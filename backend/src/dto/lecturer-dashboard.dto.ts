import { IsInt, IsOptional, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class LecturerDashboardStatsDto {
  @IsInt()
  @Expose()
  totalCourses: number

  @IsInt()
  @Expose()
  totalStudents: number

  @IsInt()
  @Expose()
  upcomingClasses: number

  @IsInt()
  @Expose()
  pendingAssignments: number

  @IsInt()
  @Expose()
  recentQuizzes: number

  @IsInt()
  @Expose()
  atRiskStudentsCount: number

  @IsInt()
  @Expose()
  criticalAtRiskStudentsCount: number

  @IsInt()
  @Expose()
  averageAttendance: number

  @IsInt()
  @Expose()
  averagePerformance: number
}

export class CourseStatisticsDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class StudentProgressDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class TeachingLoadDto {
  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string
}

export class UpcomingScheduleDto {
  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsInt()
  @IsOptional()
  @Expose()
  days?: number
}
