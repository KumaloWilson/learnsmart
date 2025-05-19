import { IsString, IsOptional, IsEnum, IsUUID, IsDate, IsObject, IsArray, IsBoolean } from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateNotificationDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @Expose()
  message: string

  @IsEnum(["info", "success", "warning", "error", "assignment", "grade", "announcement", "enrollment", "system"], {
    message: "Type must be one of: info, success, warning, error, assignment, grade, announcement, enrollment, system",
  })
  @Expose()
  type: "info" | "success" | "warning" | "error" | "assignment" | "grade" | "announcement" | "enrollment" | "system"

  @IsUUID(4)
  @Expose()
  userId: string

  @IsString()
  @IsOptional()
  @Expose()
  link?: string

  @IsObject()
  @IsOptional()
  @Expose()
  metadata?: object

  @IsUUID(4)
  @IsOptional()
  @Expose()
  senderId?: string
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  @Expose()
  isRead?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  readAt?: Date

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean
}

export class BulkCreateNotificationDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @Expose()
  message: string

  @IsEnum(["info", "success", "warning", "error", "assignment", "grade", "announcement", "enrollment", "system"], {
    message: "Type must be one of: info, success, warning, error, assignment, grade, announcement, enrollment, system",
  })
  @Expose()
  type: "info" | "success" | "warning" | "error" | "assignment" | "grade" | "announcement" | "enrollment" | "system"

  @IsArray()
  @IsUUID(4, { each: true })
  @Expose()
  userIds: string[]

  @IsString()
  @IsOptional()
  @Expose()
  link?: string

  @IsObject()
  @IsOptional()
  @Expose()
  metadata?: object

  @IsUUID(4)
  @IsOptional()
  @Expose()
  senderId?: string
}

export class NotificationFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  userId?: string

  @IsString()
  @IsOptional()
  @Expose()
  type?: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isRead?: boolean

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
