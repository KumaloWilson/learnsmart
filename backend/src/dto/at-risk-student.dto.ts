import {
  IsDate,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsBoolean,
  IsArray,
} from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateAtRiskStudentDto {
  @IsUUID(4)
  @Expose()
  studentProfileId!: string

  @IsUUID(4)
  @Expose()
  courseId!: string

  @IsUUID(4)
  @Expose()
  semesterId!: string

  @IsInt()
  @Min(0)
  @Max(100)
  @Expose()
  riskScore!: number

  @IsEnum(["low", "medium", "high", "critical"], {
    message: "Risk level must be one of: low, medium, high, critical",
  })
  @Expose()
  riskLevel!: "low" | "medium" | "high" | "critical"

  @IsArray()
  @IsString({ each: true })
  @Expose()
  riskFactors!: string[]

  @IsString()
  @IsOptional()
  @Expose()
  recommendedActions?: string

  @IsObject()
  @IsOptional()
  @Expose()
  aiAnalysis?: object
}

export class ResolveAtRiskStudentDto {
  @IsString()
  @Expose()
  resolutionNotes!: string
}

export class UpdateAtRiskStudentDto {
  @IsEnum(["low", "medium", "high", "critical"], {
    message: "Risk level must be one of: low, medium, high, critical",
  })
  @IsOptional()
  @Expose()
  riskLevel?: "low" | "medium" | "high" | "critical"

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  riskScore?: number

  @IsString()
  @IsOptional()
  @Expose()
  riskFactors?: string

  @IsString()
  @IsOptional()
  @Expose()
  recommendedActions?: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isResolved?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  resolvedAt?: Date

  @IsString()
  @IsOptional()
  @Expose()
  resolutionNotes?: string

  @IsObject()
  @IsOptional()
  @Expose()
  aiAnalysis?: object
}

export class IdentifyAtRiskStudentsDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  attendanceThreshold?: number

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  performanceThreshold?: number
}

export class AtRiskStudentFilterDto {
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

  @IsEnum(["low", "medium", "high", "critical"], {
    message: "Risk level must be one of: low, medium, high, critical",
  })
  @IsOptional()
  @Expose()
  riskLevel?: "low" | "medium" | "high" | "critical"

  @IsBoolean()
  @IsOptional()
  @Expose()
  isResolved?: boolean
}
