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

  @IsArray()
  @Expose()
  attendanceRecords: {
    studentProfileId: string
    isPresent: boolean
    notes?: string
  }[]
}

export class BulkCreatePhysicalAttendanceItemDto {
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
  attendanceRecords: {
    studentProfileId: string
    isPresent: boolean
    notes?: string
  }[]
}

export class BulkCreatePhysicalAttendanceDto {
  @IsArray()
  @Type(() => BulkCreatePhysicalAttendanceItemDto)
  @Expose()
  attendances: BulkCreatePhysicalAttendanceItemDto[]
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

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  date?: Date
}

export class UpdateAttendanceRecordDto {
  @IsBoolean()
  @IsBoolean()
  @IsOptional()
  @Expose()
  isPresent?: boolean

  @IsString()
  @IsOptional()
  @Expose()
  notes?: string
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

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPresent?: boolean

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
