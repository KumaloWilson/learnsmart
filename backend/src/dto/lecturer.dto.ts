import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator"
import { Expose, Type } from "class-transformer"
import type { Express } from "express"

export class CreateLecturerProfileDto {
  @IsString()
  @Expose()
  firstName: string

  @IsString()
  @Expose()
  lastName: string

  @IsEmail()
  @Expose()
  email: string

  @IsString()
  @Expose()
  password: string

  @IsString()
  @Expose()
  staffId: string

  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  specialization?: string

  @IsString()
  @IsOptional()
  @Expose()
  bio?: string

  @IsString()
  @IsOptional()
  @Expose()
  officeLocation?: string

  @IsString()
  @IsOptional()
  @Expose()
  officeHours?: string

  @IsPhoneNumber(null)
  @IsOptional()
  @Expose()
  phoneNumber?: string

  @IsUUID(4)
  @Expose()
  departmentId: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  joinDate: Date
}

export class UpdateLecturerProfileDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  specialization?: string

  @IsString()
  @IsOptional()
  @Expose()
  bio?: string

  @IsString()
  @IsOptional()
  @Expose()
  officeLocation?: string

  @IsString()
  @IsOptional()
  @Expose()
  officeHours?: string

  @IsPhoneNumber(null)
  @IsOptional()
  @Expose()
  phoneNumber?: string

  @IsEnum(["active", "on_leave", "retired", "terminated"], {
    message: "Status must be one of: active, on_leave, retired, terminated",
  })
  @IsOptional()
  @Expose()
  status?: "active" | "on_leave" | "retired" | "terminated"

  @IsUUID(4)
  @IsOptional()
  @Expose()
  departmentId?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  endDate?: Date
}

export class AssignCourseDto {
  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsEnum(["primary", "assistant", "guest"], {
    message: "Role must be one of: primary, assistant, guest",
  })
  @IsOptional()
  @Expose()
  role?: "primary" | "assistant" | "guest"
}

export class UpdateCourseAssignmentDto {
  @IsEnum(["primary", "assistant", "guest"], {
    message: "Role must be one of: primary, assistant, guest",
  })
  @IsOptional()
  @Expose()
  role?: "primary" | "assistant" | "guest"

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean
}

export class CreateTeachingMaterialDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["lecture_note", "assignment", "resource", "syllabus", "video", "youtube", "other"], {
    message: "Type must be one of: lecture_note, assignment, resource, syllabus, video, youtube, other",
  })
  @Expose()
  type: "lecture_note" | "assignment" | "resource" | "syllabus" | "video" | "youtube" | "other"

  @IsString()
  @IsOptional()
  @Expose()
  fileUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileName?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileType?: string

  @IsInt()
  @IsOptional()
  @Expose()
  fileSize?: number

  @IsString()
  @IsOptional()
  @Expose()
  youtubeUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  videoThumbnail?: string

  @IsInt()
  @IsOptional()
  @Expose()
  videoDuration?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  publishDate?: Date

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class UpdateTeachingMaterialDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["lecture_note", "assignment", "resource", "syllabus", "video", "youtube", "other"], {
    message: "Type must be one of: lecture_note, assignment, resource, syllabus, video, youtube, other",
  })
  @IsOptional()
  @Expose()
  type?: "lecture_note" | "assignment" | "resource" | "syllabus" | "video" | "youtube" | "other"

  @IsString()
  @IsOptional()
  @Expose()
  fileUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileName?: string

  @IsString()
  @IsOptional()
  @Expose()
  fileType?: string

  @IsInt()
  @IsOptional()
  @Expose()
  fileSize?: number

  @IsString()
  @IsOptional()
  @Expose()
  youtubeUrl?: string

  @IsString()
  @IsOptional()
  @Expose()
  videoThumbnail?: string

  @IsInt()
  @IsOptional()
  @Expose()
  videoDuration?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  publishDate?: Date
}

export class CreateAssessmentDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["quiz", "assignment", "exam", "project", "other"], {
    message: "Type must be one of: quiz, assignment, exam, project, other",
  })
  @Expose()
  type: "quiz" | "assignment" | "exam" | "project" | "other"

  @IsInt()
  @Min(0)
  @Expose()
  totalMarks: number

  @IsInt()
  @Min(0)
  @Max(100)
  @Expose()
  weightage: number

  @IsDate()
  @Type(() => Date)
  @Expose()
  dueDate: Date

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  publishDate?: Date

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class UpdateAssessmentDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsEnum(["quiz", "assignment", "exam", "project", "other"], {
    message: "Type must be one of: quiz, assignment, exam, project, other",
  })
  @IsOptional()
  @Expose()
  type?: "quiz" | "assignment" | "exam" | "project" | "other"

  @IsInt()
  @Min(0)
  @IsOptional()
  @Expose()
  totalMarks?: number

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Expose()
  weightage?: number

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  dueDate?: Date

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  publishDate?: Date
}

export class GradeSubmissionDto {
  @IsInt()
  @Min(0)
  @Expose()
  marks: number

  @IsString()
  @IsOptional()
  @Expose()
  feedback?: string
}

export class LecturerFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  departmentId?: string

  @IsEnum(["active", "on_leave", "retired", "terminated"], {
    message: "Status must be one of: active, on_leave, retired, terminated",
  })
  @IsOptional()
  @Expose()
  status?: "active" | "on_leave" | "retired" | "terminated"

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  @Expose()
  joinYear?: number
}

export class UploadVideoDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @Expose()
  file: Express.Multer.File

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean
}

export class AddYoutubeVideoDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsString()
  @Expose()
  youtubeUrl: string

  @IsString()
  @IsOptional()
  @Expose()
  videoThumbnail?: string

  @IsInt()
  @IsOptional()
  @Expose()
  videoDuration?: number

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isPublished?: boolean
}
