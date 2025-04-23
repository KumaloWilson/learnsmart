import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDate,
  IsInt,
  Min,
  Max,
  IsEmail,
  MinLength,
  IsPhoneNumber,
} from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateStudentProfileDto {
  @IsString()
  @MinLength(2)
  @Expose()
  firstName: string

  @IsString()
  @MinLength(2)
  @Expose()
  lastName: string

  @IsEmail()
  @Expose()
  email: string

  @IsString()
  @MinLength(8)
  @Expose()
  password: string

  @IsString()
  @Expose()
  studentId: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  dateOfBirth?: Date

  @IsString()
  @IsOptional()
  @Expose()
  gender?: string

  @IsString()
  @IsOptional()
  @Expose()
  address?: string

  @IsPhoneNumber(null)
  @IsOptional()
  @Expose()
  phoneNumber?: string

  @IsUUID(4)
  @Expose()
  programId: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  enrollmentDate: Date

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  @Expose()
  currentLevel?: number
}

export class UpdateStudentProfileDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  dateOfBirth?: Date

  @IsString()
  @IsOptional()
  @Expose()
  gender?: string

  @IsString()
  @IsOptional()
  @Expose()
  address?: string

  @IsPhoneNumber(null)
  @IsOptional()
  @Expose()
  phoneNumber?: string

  @IsEnum(["active", "suspended", "graduated", "withdrawn"], {
    message: "Status must be one of: active, suspended, graduated, withdrawn",
  })
  @IsOptional()
  @Expose()
  status?: "active" | "suspended" | "graduated" | "withdrawn"

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  @Expose()
  currentLevel?: number

  @IsUUID(4)
  @IsOptional()
  @Expose()
  programId?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  graduationDate?: Date
}

export class EnrollStudentInCourseDto {
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

export class UpdateCourseEnrollmentDto {
  @IsEnum(["enrolled", "completed", "failed", "withdrawn"], {
    message: "Status must be one of: enrolled, completed, failed, withdrawn",
  })
  @IsOptional()
  @Expose()
  status?: "enrolled" | "completed" | "failed" | "withdrawn"

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  grade?: number
}

export class CreateAcademicRecordDto {
  @IsUUID(4)
  @Expose()
  studentProfileId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsInt()
  @Min(0)
  @Max(4)
  @Expose()
  gpa: number

  @IsInt()
  @Min(0)
  @Max(4)
  @Expose()
  cgpa: number

  @IsInt()
  @Min(0)
  @Expose()
  totalCredits: number

  @IsInt()
  @Min(0)
  @Expose()
  earnedCredits: number

  @IsString()
  @IsOptional()
  @Expose()
  remarks?: string
}

export class UpdateAcademicRecordDto {
  @IsInt()
  @Min(0)
  @Max(4)
  @IsOptional()
  @Expose()
  gpa?: number

  @IsInt()
  @Min(0)
  @Max(4)
  @IsOptional()
  @Expose()
  cgpa?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  totalCredits?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  earnedCredits?: number

  @IsString()
  @IsOptional()
  @Expose()
  remarks?: string
}

export class StudentFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  programId?: string

  @IsEnum(["active", "suspended", "graduated", "withdrawn"], {
    message: "Status must be one of: active, suspended, graduated, withdrawn",
  })
  @IsOptional()
  @Expose()
  status?: "active" | "suspended" | "graduated" | "withdrawn"

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  @Expose()
  currentLevel?: number

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  @Expose()
  enrollmentYear?: number
}
