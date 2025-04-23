import { IsArray, IsDate, IsOptional, IsString, IsUUID, IsNumber } from "class-validator"
import { Expose, Type } from "class-transformer"

export class StudentCourseDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class StudentAssessmentSubmissionDto {
  @IsUUID(4)
  @Expose()
  assessmentId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsString()
  @IsOptional()
  @Expose()
  submissionText?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileName?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileType?: string

  @IsNumber()
  @IsOptional()
  @Expose()
  fileSize?: number
}

export class StudentQuizAttemptDto {
  @IsUUID(4)
  @Expose()
  quizId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsArray()
  @Expose()
  answers: {
    questionId: string
    selectedOptionId: string
  }[]
}

export class JoinVirtualClassDto {
  @IsUUID(4)
  @Expose()
  virtualClassId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string
}

export class StudentDashboardFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  startDate?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  endDate?: Date
}

export class StudentPerformanceFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsString()
  @IsOptional()
  @Expose()
  assessmentType?: string
}

export class StudentAttendanceFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  startDate?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  endDate?: Date
}

export class StudentMaterialsFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsString()
  @IsOptional()
  @Expose()
  type?: string
}
