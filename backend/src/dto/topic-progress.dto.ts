import { IsBoolean, IsDate, IsInt, IsObject, IsOptional, IsUUID, Max, Min } from "class-validator"
import { Expose, Type } from "class-transformer"

export class UpdateTopicProgressDto {
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
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  masteryLevel?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  timeSpentMinutes?: number

  @IsObject()
  @IsOptional()
  @Expose()
  assessmentResults?: object
}

export class MarkTopicCompletedDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  courseTopicId: string

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  timeSpentMinutes?: number

  @IsObject()
  @IsOptional()
  @Expose()
  assessmentResults?: object
}

export class TopicProgressFilterDto {
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

  @IsBoolean()
  @IsOptional()
  @Expose()
  isCompleted?: boolean
}
