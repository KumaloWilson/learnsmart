import { IsString, IsUUID, IsOptional, IsDate, IsNumber, IsBoolean, IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

// Dashboard filter DTO
export class StudentDashboardFilterDto {
  @IsOptional()
  @IsUUID()
  courseId?: string

  @IsOptional()
  @IsUUID()
  semesterId?: string
}

// Assessment submission DTO
export class StudentAssessmentSubmissionDto {
  @IsUUID()
  assessmentId!: string

  @IsUUID()
  studentProfileId!: string

  @IsOptional()
  @IsString()
  submissionText?: string

  @IsOptional()
  @IsString()
  fileUrl?: string

  @IsOptional()
  @IsString()
  fileName?: string

  @IsOptional()
  @IsString()
  fileType?: string

  @IsOptional()
  @IsNumber()
  fileSize?: number
}

// Virtual class join DTO
export class JoinVirtualClassDto {
  @IsUUID()
  virtualClassId!: string

  @IsUUID()
  studentProfileId!: string
}

// Materials filter DTO
export class StudentMaterialsFilterDto {
  @IsOptional()
  @IsUUID()
  courseId?: string

  @IsOptional()
  @IsUUID()
  semesterId?: string

  @IsOptional()
  @IsString()
  type?: string
}

// Performance filter DTO
export class StudentPerformanceFilterDto {
  @IsOptional()
  @IsUUID()
  courseId?: string

  @IsOptional()
  @IsUUID()
  semesterId?: string

  @IsOptional()
  @IsString()
  assessmentType?: string
}

// Attendance filter DTO
export class StudentAttendanceFilterDto {
  @IsOptional()
  @IsUUID()
  courseId?: string

  @IsOptional()
  @IsUUID()
  semesterId?: string

  @IsOptional()
  @IsDate()
  startDate?: Date

  @IsOptional()
  @IsDate()
  endDate?: Date
}

// Quiz response DTO
export class QuizResponseDto {
  @IsUUID()
  questionId!: string

  @IsOptional()
  @IsUUID()
  optionId?: string

  @IsOptional()
  @IsString()
  textResponse?: string

  @IsOptional()
  @IsBoolean()
  booleanResponse?: boolean
}

// Quiz attempt DTO
export class StudentQuizAttemptDto {
  @IsUUID()
  quizId!: string

  @IsUUID()
  studentProfileId!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizResponseDto)
  responses!: QuizResponseDto[]

  @IsOptional()
  @IsDate()
  startTime?: Date
}

// Topic progress DTO
export class TopicProgressDto {
  @IsUUID()
  courseTopicId!: string

  @IsUUID()
  studentProfileId!: string

  @IsNumber()
  timeSpentMinutes!: number
}

// Recommendation feedback DTO
export class RecommendationFeedbackDto {
  @IsUUID()
  recommendationId!: string

  @IsBoolean()
  isHelpful!: boolean

  @IsOptional()
  @IsString()
  feedback?: string
}

// Resource interaction DTO
export class StudentResourceInteractionDto {
  @IsUUID()
  studentProfileId!: string

  @IsUUID()
  learningResourceId!: string

  @IsString()
  interactionType!: string

  @IsOptional()
  @IsNumber()
  durationSeconds?: number

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsOptional()
  @IsString()
  feedback?: string

  @IsOptional()
  metadata?: any
}
