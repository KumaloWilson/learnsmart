export interface CreateStudentProfileDto {
    firstName: string
    lastName: string
    email: string
    password: string
    studentId?: string
    dateOfBirth?: Date
    gender?: string
    address?: string
    phoneNumber?: string
    programId: string
    enrollmentDate: Date
    currentLevel?: number
  }
  
  export interface UpdateStudentProfileDto {
    dateOfBirth?: Date
    gender?: string
    address?: string
    phoneNumber?: string
    status?: "active" | "suspended" | "graduated" | "withdrawn"
    currentLevel?: number
    programId?: string
    graduationDate?: Date
  }
  
  export interface EnrollStudentInCourseDto {
    studentProfileId: string
    courseId: string
    semesterId: string
  }
  
  export interface UpdateCourseEnrollmentDto {
    status?: "enrolled" | "completed" | "failed" | "withdrawn"
    grade?: number
  }
  
  export interface CreateAcademicRecordDto {
    studentProfileId: string
    semesterId: string
    gpa: number
    cgpa: number
    totalCredits: number
    earnedCredits: number
    remarks?: string
  }
  
  export interface UpdateAcademicRecordDto {
    gpa?: number
    cgpa?: number
    totalCredits?: number
    earnedCredits?: number
    remarks?: string
  }
  
  export interface StudentFilterDto {
    programId?: string
    status?: "active" | "suspended" | "graduated" | "withdrawn"
    currentLevel?: number
    enrollmentYear?: number
  }
  
  export interface BatchEnrollmentDto {
    courseId: string
    semesterId: string
    studentIds: string[]
  }
  