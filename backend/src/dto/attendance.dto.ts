import { IsString, IsOptional, IsUUID, IsDate, IsBoolean, IsInt, Min, Max, IsArray } from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreatePhysicalAttendanceDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  date: Date

  @IsString()
  @Expose()
  topic: string

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsBoolean()
  @Expose()
  isPresent: boolean
}

export class UpdatePhysicalAttendanceDto {
  @IsString()
  @IsOptional()
  @Expose()
  topic?: string

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPresent?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  date?: Date
}

export class BulkCreateAttendanceDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  date: Date

  @IsString()
  @Expose()
  topic: string

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsArray()
  @Expose()
  attendances: {
    studentProfileId: string
    isPresent: boolean
    notes?: string
  }[]
}

export class AttendanceFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  studentProfileId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  lecturerProfileId?: string

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

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPresent?: boolean
}

export class AttendanceStatisticsParamsDto {
  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  studentProfileId?: string
}

export class AttendanceStatisticsDto {
  @IsInt()
  @Expose()
  totalClasses: number

  @IsInt()
  @Expose()
  totalPhysicalClasses: number

  @IsInt()
  @Expose()
  totalVirtualClasses: number

  @IsInt()
  @Expose()
  presentCount: number

  @IsInt()
  @Expose()
  absentCount: number

  @IsInt()
  @Min(0)
  @Max(100)
  @Expose()
  attendancePercentage: number
}