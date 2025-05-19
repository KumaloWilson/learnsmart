import { IsEmail, IsString, IsEnum, MinLength, Matches } from "class-validator"
import { Expose } from "class-transformer"
import { Department } from "../models/Department"
import { Program } from "../models/Program"
import { Course } from "../models/Course"

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
    dateOfBirth?: Date
    gender?: string
    address?: string
    phoneNumber?: string
    
    // Program details
    programId: string
    program?: {
      id: string
      name: string
      code?: string
      description?: string
      durationYears: number
      level: "undergraduate" | "postgraduate" | "doctorate"
      department?: Department
      courses?: Course[]
    }

    // Active semester information
    activeSemester?: {
      id: string
      name: string
      startDate: Date
      endDate: Date
      academicYear: number
    }

    // Current semester academic performance
    currentSemesterPerformance?: {
      id: string
      gpa: number
      cgpa: number
      totalCredits: number
      earnedCredits: number
      remarks?: string
    }

    // Academic records history
    academicRecords?: Array<{
      id: string
      semesterId: string
      semesterName?: string
      academicYear?: number
      gpa: number
      cgpa: number
      totalCredits: number
      earnedCredits: number
      remarks?: string
    }>

    // Current semester course enrollments
    currentEnrollments?: Array<{
      id: string
      courseId: string
      courseName?: string
      courseCode?: string
      status: "enrolled" | "completed" | "failed" | "withdrawn"
      grade?: number
      letterGrade?: string
      creditHours?: number
    }>

    // Learning recommendations
    learningRecommendations?: Array<{
      id: string
      resourceId: string
      resourceTitle?: string
      resourceType?: "video" | "article" | "book" | "exercise" | "quiz" | "other"
      resourceUrl?: string
      courseId: string
      courseName?: string
      courseCode?: string
      relevanceScore: number
      isViewed: boolean
      isSaved: boolean
      isCompleted: boolean
      completedAt?: Date
      rating?: number
      feedback?: string
    }>

    // Notifications
    notifications?: Array<{
      id: string
      title: string
      message: string
      type: "info" | "success" | "warning" | "error" | "assignment" | "grade" | "announcement" | "enrollment" | "system"
      isRead: boolean
      readAt?: Date
      link?: string
      metadata?: object
      createdAt: Date
    }>
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