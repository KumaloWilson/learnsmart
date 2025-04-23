import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateLearningRecommendationDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  learningResourceId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsString()
  @IsOptional()
  @Expose()
  reason?: string

  @IsNumber()
  @Min(0)
  @Max(1)
  @Expose()
  relevanceScore: number
}

export class UpdateLearningRecommendationDto {
  @IsBoolean()
  @IsOptional()
  @Expose()
  isViewed?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  viewedAt?: Date

  @IsBoolean()
  @IsOptional()
  @Expose()
  isSaved?: boolean

  @IsBoolean()
  @IsOptional()
  @Expose()
  isCompleted?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  completedAt?: Date

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  rating?: number

  @IsString()
  @IsOptional()
  @Expose()
  feedback?: string
}

export class ResourceInteractionDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  learningResourceId: string

  @IsEnum(["view", "save", "complete", "rate", "share"], {
    message: "Interaction type must be one of: view, save, complete, rate, share",
  })
  @Expose()
  interactionType: "view" | "save" | "complete" | "rate" | "share"

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  durationSeconds?: number

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  rating?: number

  @IsString()
  @IsOptional()
  @Expose()
  feedback?: string

  @IsObject()
  @IsOptional()
  @Expose()
  metadata?: any
}

export class GenerateRecommendationsDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  @Expose()
  count?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  includeCompleted?: boolean
}

export class RecommendationFeedbackDto {
  @IsUUID(4)
  @Expose()
  recommendationId: string

  @IsBoolean()
  @Expose()
  isHelpful: boolean

  @IsString()
  @IsOptional()
  @Expose()
  feedback?: string
}
