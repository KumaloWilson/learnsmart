import { StudentFilterDto, CreateStudentProfileDto, UpdateStudentProfileDto, EnrollStudentInCourseDto, UpdateCourseEnrollmentDto, CreateAcademicRecordDto, UpdateAcademicRecordDto } from "@/types/student"
import { axiosInstance } from "./axios-instance"


export interface StudentProfile {
  id: string
  studentId: string
  userId: string
  programId: string
  dateOfBirth?: Date
  gender?: string
  address?: string
  phoneNumber?: string
  enrollmentDate: Date
  currentLevel: number
  status: "active" | "suspended" | "graduated" | "withdrawn"
  graduationDate?: Date
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
  program?: {
    id: string
    name: string
    code: string
    department?: {
      id: string
      name: string
    }
  }
}

export interface CourseEnrollment {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  status: "enrolled" | "completed" | "failed" | "withdrawn"
  grade?: number
  letterGrade?: string
  createdAt: string
  updatedAt: string
  course?: {
    id: string
    name: string
    code: string
    credits: number
  }
  semester?: {
    id: string
    name: string
    startDate: string
    endDate: string
  }
  studentProfile?: {
    id: string
    studentId: string
    user?: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface AcademicRecord {
  id: string
  studentProfileId: string
  semesterId: string
  gpa: number
  cgpa: number
  totalCredits: number
  earnedCredits: number
  remarks?: string
  createdAt: string
  updatedAt: string
  semester?: {
    id: string
    name: string
    startDate: string
    endDate: string
  }
  studentProfile?: {
    id: string
    studentId: string
    user?: {
      firstName: string
      lastName: string
      email: string
    }
    program?: {
      id: string
      name: string
      code: string
    }
  }
}

export const studentsApi = {
  // Student profile endpoints
  getStudents: async (filters?: StudentFilterDto) => {
    try {
      const queryParams = new URLSearchParams()

      if (filters?.programId) {
        queryParams.append("programId", filters.programId)
      }
      if (filters?.status) {
        queryParams.append("status", filters.status)
      }
      if (filters?.currentLevel) {
        queryParams.append("currentLevel", filters.currentLevel.toString())
      }
      if (filters?.enrollmentYear) {
        queryParams.append("enrollmentYear", filters.enrollmentYear.toString())
      }

      const queryString = queryParams.toString()
      const url = `/students${queryString ? `?${queryString}` : ""}`

      const response = await axiosInstance.get(url)
      return response
    } catch (error) {
      console.error("Error fetching students:", error)
      throw error
    }
  },

  getStudentById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`)
      return response
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error)
      throw error
    }
  },

  getStudentByUserId: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/students/user/${userId}`)
      return response
    } catch (error) {
      console.error(`Error fetching student by user ID ${userId}:`, error)
      throw error
    }
  },

  getStudentByStudentId: async (studentId: string) => {
    try {
      const response = await axiosInstance.get(`/students/student-id/${studentId}`)
      return response
    } catch (error) {
      console.error(`Error fetching student by student ID ${studentId}:`, error)
      throw error
    }
  },

  createStudent: async (data: CreateStudentProfileDto) => {
    try {
      const response = await axiosInstance.post("/students", data)
      return response
    } catch (error) {
      console.error("Error creating student:", error)
      throw error
    }
  },

  updateStudent: async (id: string, data: UpdateStudentProfileDto) => {
    try {
      const response = await axiosInstance.put(`/students/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error updating student ${id}:`, error)
      throw error
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`)
      return response
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error)
      throw error
    }
  },

  // Course enrollment endpoints
  getStudentEnrollments: async (studentId: string) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/enrollments`)
      return response
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error)
      throw error
    }
  },

  getStudentEnrollmentsBySemester: async (studentId: string, semesterId: string) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/enrollments/semester/${semesterId}`)
      return response
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId} in semester ${semesterId}:`, error)
      throw error
    }
  },

  enrollStudentInCourse: async (data: EnrollStudentInCourseDto) => {
    try {
      const response = await axiosInstance.post("/students/enroll", data)
      return response
    } catch (error) {
      console.error("Error enrolling student in course:", error)
      throw error
    }
  },

  updateEnrollment: async (id: string, data: UpdateCourseEnrollmentDto) => {
    try {
      const response = await axiosInstance.put(`/students/enrollment/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error updating enrollment ${id}:`, error)
      throw error
    }
  },

  withdrawFromCourse: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/students/enrollment/${id}`)
      return response
    } catch (error) {
      console.error(`Error withdrawing from course enrollment ${id}:`, error)
      throw error
    }
  },

  batchEnrollStudents: async (courseId: string, semesterId: string, studentIds: string[]) => {
    try {
      const response = await axiosInstance.post("/students/batch-enroll", {
        courseId,
        semesterId,
        studentIds,
      })
      return response
    } catch (error) {
      console.error("Error batch enrolling students:", error)
      throw error
    }
  },

  // Academic record endpoints
  getStudentAcademicRecords: async (studentId: string) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/academic-records`)
      return response
    } catch (error) {
      console.error(`Error fetching academic records for student ${studentId}:`, error)
      throw error
    }
  },

  getAcademicRecord: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/students/academic-record/${id}`)
      return response
    } catch (error) {
      console.error(`Error fetching academic record ${id}:`, error)
      throw error
    }
  },

  createAcademicRecord: async (data: CreateAcademicRecordDto) => {
    try {
      const response = await axiosInstance.post("/students/academic-record", data)
      return response
    } catch (error) {
      console.error("Error creating academic record:", error)
      throw error
    }
  },

  updateAcademicRecord: async (id: string, data: UpdateAcademicRecordDto) => {
    try {
      const response = await axiosInstance.put(`/students/academic-record/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error updating academic record ${id}:`, error)
      throw error
    }
  },

  deleteAcademicRecord: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/students/academic-record/${id}`)
      return response
    } catch (error) {
      console.error(`Error deleting academic record ${id}:`, error)
      throw error
    }
  },
}
