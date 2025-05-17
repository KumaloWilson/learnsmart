import { IsString, IsUUID, IsOptional, IsNumber, IsBoolean, IsObject } from "class-validator"

// Create learning recommendation DTO
export class CreateLearningRecommendationDto {
  @IsUUID()
  studentProfileId!: string

  @IsUUID()
  learningResourceId!: string

  @IsUUID()
  courseId!: string

  @IsOptional()
  @IsString()
  reason?: string

  @IsOptional()
  @IsNumber()
  relevanceScore?: number

  @IsOptional()
  @IsBoolean()
  isViewed?: boolean

  @IsOptional()
  @IsBoolean()
  isSaved?: boolean

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean
}

// Update learning recommendation DTO
export class UpdateLearningRecommendationDto {
  @IsOptional()
  @IsString()
  reason?: string

  @IsOptional()
  @IsNumber()
  relevanceScore?: number

  @IsOptional()
  @IsBoolean()
  isViewed?: boolean

  @IsOptional()
  @IsBoolean()
  isSaved?: boolean

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean

  @IsOptional()
  @IsString()
  feedback?: string
}

// Resource interaction DTO
export class ResourceInteractionDto {
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
  @IsObject()
  metadata?: object
}

// Generate recommendations DTO
export class GenerateRecommendationsDto {
  @IsUUID()
  studentProfileId!: string

  @IsUUID()
  courseId!: string

  @IsOptional()
  @IsNumber()
  count?: number

  @IsOptional()
  @IsBoolean()
  includeCompleted?: boolean
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
