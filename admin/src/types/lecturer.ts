export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  
  export interface Department {
    id: string
    name: string
  }
  
  export interface LecturerProfile {
    id: string
    userId: string
    staffId: string
    title: string
    specialization: string
    bio: string
    officeLocation: string
    officeHours: string
    phoneNumber: string
    departmentId: string
    status: "active" | "on_leave" | "retired" | "terminated"
    joinDate: string
    endDate: string | null
    createdAt: string
    updatedAt: string
    user?: User
    department?: Department
  }
  
  export interface Course {
    id: string
    code: string
    title: string
    description: string
    creditHours: number
  }
  
  export interface Semester {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
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
    enrollmentCount?: number
  }
  
  export interface Assessment {
    id: string
    title: string
    description: string
    type: "quiz" | "assignment" | "exam" | "project" | "other"
    totalMarks: number
    weightage: number
    dueDate: string
    isPublished: boolean
    publishDate: string | null
    lecturerProfileId: string
    courseId: string
    semesterId: string
    createdAt: string
    updatedAt: string
    course?: Course
    semester?: Semester
  }
  
  export interface TeachingMaterial {
    id: string
    title: string
    description: string
    type: "lecture_note" | "assignment" | "resource" | "syllabus" | "video" | "youtube" | "other"
    fileUrl: string | null
    fileName: string | null
    fileType: string | null
    fileSize: number | null
    youtubeUrl: string | null
    videoThumbnail: string | null
    videoDuration: number | null
    isPublished: boolean
    publishDate: string | null
    lecturerProfileId: string
    courseId: string
    semesterId: string
    createdAt: string
    updatedAt: string
    course?: Course
    semester?: Semester
  }
  
  export interface LecturerFilter {
    departmentId?: string
    status?: "active" | "on_leave" | "retired" | "terminated"
    joinYear?: number
  }
  