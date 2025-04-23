import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsInt, Min, IsArray } from "class-validator"
import { Expose } from "class-transformer"

export class CreateCourseTopicDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  orderIndex?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  durationHours?: number

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  learningObjectives?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  keywords?: string[]

  @IsEnum(["beginner", "intermediate", "advanced"], {
    message: "Difficulty must be one of: beginner, intermediate, advanced",
  })
  @IsOptional()
  @Expose()
  difficulty?: "beginner" | "intermediate" | "advanced"

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class UpdateCourseTopicDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  orderIndex?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  durationHours?: number

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  learningObjectives?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  keywords?: string[]

  @IsEnum(["beginner", "intermediate", "advanced"], {
    message: "Difficulty must be one of: beginner, intermediate, advanced",
  })
  @IsOptional()
  @Expose()
  difficulty?: "beginner" | "intermediate" | "advanced"

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean
}

export class CourseTopicFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

  @IsEnum(["beginner", "intermediate", "advanced"], {
    message: "Difficulty must be one of: beginner, intermediate, advanced",
  })
  @IsOptional()
  @Expose()
  difficulty?: "beginner" | "intermediate" | "advanced"

  @IsString()
  @IsOptional()
  @Expose()
  search?: string
}
