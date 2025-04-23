import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID } from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateVirtualClassDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  scheduledStartTime: Date

  @IsDate()
  @Type(() => Date)
  @Expose()
  scheduledEndTime: Date

  @IsBoolean()
  @Expose()
  isRecorded: boolean

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsObject()
  @IsOptional()
  @Expose()
  meetingConfig?: object
}

export class UpdateVirtualClassDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  scheduledStartTime?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  scheduledEndTime?: Date

  @IsEnum(["scheduled", "in_progress", "completed", "cancelled"], {
    message: "Status must be one of: scheduled, in_progress, completed, cancelled",
  })
  @IsOptional()
  @Expose()
  status?: "scheduled" | "in_progress" | "completed" | "cancelled"

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  actualStartTime?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  actualEndTime?: Date

  @IsNumber()
  @IsOptional()
  @Expose()
  duration?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isRecorded?: boolean

  @IsString()
  @IsOptional()
  @Expose()
  recordingUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  meetingId?: string

  @IsString()
  @IsOptional()
  @Expose()
  meetingLink?: string

  @IsObject()
  @IsOptional()
  @Expose()
  meetingConfig?: object
}

export class VirtualClassAttendanceDto {
  @IsUUID(4)
  @Expose()
  virtualClassId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  joinTime?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  leaveTime?: Date

  @IsNumber()
  @IsOptional()
  @Expose()
  durationMinutes?: number

  @IsBoolean()
  @Expose()
  isPresent: boolean

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string
}

export class UpdateVirtualClassAttendanceDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  joinTime?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  leaveTime?: Date

  @IsNumber()
  @IsOptional()
  @Expose()
  durationMinutes?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPresent?: boolean

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string
}

export class VirtualClassFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  lecturerProfileId?: string

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
  status?: string

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
