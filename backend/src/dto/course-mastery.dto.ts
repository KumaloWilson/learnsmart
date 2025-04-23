import { IsDate, IsEnum, IsInt, IsObject, IsOptional, IsUUID, Max, Min } from "class-validator"
import { Expose, Type } from "class-transformer"

export class UpdateCourseMasteryDto {
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  masteryLevel?: number

  @IsEnum(["beginner", "intermediate", "advanced", "expert"], {
    message: "Mastery status must be one of: beginner, intermediate, advanced, expert",
  })
  @IsOptional()
  @Expose()
  masteryStatus?: "beginner" | "intermediate" | "advanced" | "expert"

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  lastUpdated?: Date

  @IsObject()
  @IsOptional()
  @Expose()
  masteryData?: object
}

export class CalculateCourseMasteryDto {
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

export class CourseMasteryFilterDto {
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

  @IsEnum(["beginner", "intermediate", "advanced", "expert"], {
    message: "Mastery status must be one of: beginner, intermediate, advanced, expert",
  })
  @IsOptional()
  @Expose()
  masteryStatus?: "beginner" | "intermediate" | "advanced" | "expert"

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  minMasteryLevel?: number

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  maxMasteryLevel?: number
}
