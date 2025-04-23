import { IsArray, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, Max, Min } from "class-validator"
import { Expose } from "class-transformer"

export class CreateLearningResourceDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["video", "article", "book", "exercise", "quiz", "other"], {
    message: "Type must be one of: video, article, book, exercise, quiz, other",
  })
  @Expose()
  type: "video" | "article" | "book" | "exercise" | "quiz" | "other"

  @IsString()
  @Expose()
  url: string

  @IsString()
  @IsOptional()
  @Expose()
  content?: string

  @IsObject()
  @IsOptional()
  @Expose()
  metadata?: any

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  tags?: string[]

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  difficulty?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Expose()
  durationMinutes?: number

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string
}

export class UpdateLearningResourceDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["video", "article", "book", "exercise", "quiz", "other"], {
    message: "Type must be one of: video, article, book, exercise, quiz, other",
  })
  @IsOptional()
  @Expose()
  type?: "video" | "article" | "book" | "exercise" | "quiz" | "other"

  @IsString()
  @IsOptional()
  @Expose()
  url?: string

  @IsString()
  @IsOptional()
  @Expose()
  content?: string

  @IsObject()
  @IsOptional()
  @Expose()
  metadata?: any

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  tags?: string[]

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  difficulty?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Expose()
  durationMinutes?: number

  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string
}

export class LearningResourceFilterDto {
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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  tags?: string[]

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  difficulty?: number

  @IsString()
  @IsOptional()
  @Expose()
  search?: string
}
