// Suggested type updates to match the backend validation
import type { User } from "./auth"
import type { Department } from "./department"
import type { Course } from "./course"
import type { Semester } from "./semester"

export interface Lecturer {
  id: string
  staffId: string
  title: string
  specialization: string
  bio: string | null
  officeLocation: string | null
  officeHours: string | null
  phoneNumber: string | null
  status: "active" | "inactive" | "on_leave"
  joinDate: string
  endDate: string | null
  userId: string
  departmentId: string
  createdAt: string
  updatedAt: string
  user?: User
  department?: Department
}

export interface CreateLecturerDto {
  title: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  departmentId: string
  specialization: string
  bio?: string
  officeLocation?: string
  officeHours?: string
  // status field removed from CreateLecturerDto
  joinDate?: string
}

export interface UpdateLecturerDto {
  title?: string
  specialization?: string
  bio?: string
  officeLocation?: string
  officeHours?: string
  phoneNumber?: string
  status?: "active" | "inactive" | "on_leave"
  endDate?: string | null
  departmentId?: string
}

export interface CourseAssignment {
  id: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  role: "primary" | "assistant" | "guest"
  isActive: boolean
  createdAt: string
  updatedAt: string
  course?: Course
  semester?: Semester
  lecturer?: Lecturer
}

export interface CreateCourseAssignmentDto {
  lecturerProfileId: string
  courseId: string
  semesterId: string
  role: "primary" | "assistant" | "guest"
  isActive?: boolean
}

export interface UpdateCourseAssignmentDto {
  role?: "primary" | "assistant" | "guest"
  isActive?: boolean
}

export const LECTURER_TITLES = [
  { value: "Dr.", label: "Dr." },
  { value: "Prof.", label: "Prof." },
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
]

export const LECTURER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
]

export const ASSIGNMENT_ROLES = [
  { value: "primary", label: "Primary Lecturer" },
  { value: "assistant", label: "Assistant Lecturer" },
  { value: "guest", label: "Guest Lecturer" },
]