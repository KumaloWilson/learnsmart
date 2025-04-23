import { IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID, Max, Min } from "class-validator"
import { Expose } from "class-transformer"

export class CreateStudentPerformanceDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  attendancePercentage: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  assignmentAverage: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  quizAverage: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  overallPerformance: number

  @IsEnum(["excellent", "good", "average", "below_average", "poor"], {
    message: "Performance category must be one of: excellent, good, average, below_average, poor",
  })
  @Expose()
  performanceCategory: "excellent" | "good" | "average" | "below_average" | "poor"

  @IsString()
  @IsOptional()
  @Expose()
  strengths?: string

  @IsString()
  @IsOptional()
  @Expose()
  weaknesses?: string

  @IsString()
  @IsOptional()
  @Expose()
  recommendations?: string

  @IsObject()
  @IsOptional()
  @Expose()
  aiAnalysis?: object
}

export class UpdateStudentPerformanceDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  attendancePercentage?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  assignmentAverage?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  quizAverage?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  overallPerformance?: number

  @IsEnum(["excellent", "good", "average", "below_average", "poor"], {
    message: "Performance category must be one of: excellent, good, average, below_average, poor",
  })
  @IsOptional()
  @Expose()
  performanceCategory?: "excellent" | "good" | "average" | "below_average" | "poor"

  @IsString()
  @IsOptional()
  @Expose()
  strengths?: string

  @IsString()
  @IsOptional()
  @Expose()
  weaknesses?: string

  @IsString()
  @IsOptional()
  @Expose()
  recommendations?: string

  @IsObject()
  @IsOptional()
  @Expose()
  aiAnalysis?: object
}

export class GeneratePerformanceAnalysisDto {
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

export class PerformanceFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  studentProfileId?: string

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
  performanceCategory?: string

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  minOverallPerformance?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  maxOverallPerformance?: number
}

export class ClassPerformanceAnalysisDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}
