import { IsEmail, IsString, IsEnum, MinLength, Matches } from "class-validator"
import { Expose } from "class-transformer"
import { Department } from "../models/Department"
import { Program } from "../models/Program"

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  firstName: string

  @IsString()
  @MinLength(2)
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  })
  password: string

  @IsEnum(["admin", "lecturer", "student"], {
    message: "Role must be one of: admin, lecturer, student",
  })
  role: "admin" | "lecturer" | "student"
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  token: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  })
  password: string
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  })
  newPassword: string
}

export class AuthResponseDto {
  @Expose()
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }

  @Expose()
  accessToken: string

  @Expose()
  refreshToken: string

  @Expose()
  studentProfile?: {
    id: string
    studentId: string
    status: "active" | "suspended" | "graduated" | "withdrawn"
    currentLevel: number
    enrollmentDate: Date
    graduationDate?: Date
    programId: string
    program?: Program,
    dateOfBirth?: Date
    gender?: string
    address?: string
    phoneNumber?: string
  }

  @Expose()
  lecturerProfile?: {
    id: string
    staffId: string
    title?: string
    specialization?: string
    status: "active" | "on_leave" | "retired" | "terminated"
    joinDate: Date
    departmentId: string
    department?: Department
    bio?: string
    officeLocation?: string
    officeHours?: string
    phoneNumber?: string
  }
}