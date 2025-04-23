import type { Request, Response } from "express"
import { StudentService } from "../services/student.service"
import { ProgramService } from "../services/program.service"
import type {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
  EnrollStudentInCourseDto,
  UpdateCourseEnrollmentDto,
  CreateAcademicRecordDto,
  UpdateAcademicRecordDto,
  StudentFilterDto,
} from "../dto/student.dto"

export class StudentController {
  private studentService: StudentService
  private programService: ProgramService

  constructor() {
    this.studentService = new StudentService()
    this.programService = new ProgramService()
  }

  // Student profile endpoints
  getAllStudents = async (req: Request, res: Response) => {
    try {
      const filters: StudentFilterDto = {}

      if (req.query.programId) {
        filters.programId = req.query.programId as string
      }
      if (req.query.status) {
        filters.status = req.query.status as "active" | "suspended" | "graduated" | "withdrawn"
      }
      if (req.query.currentLevel) {
        filters.currentLevel = Number.parseInt(req.query.currentLevel as string)
      }
      if (req.query.enrollmentYear) {
        filters.enrollmentYear = Number.parseInt(req.query.enrollmentYear as string)
      }

      const students = await this.studentService.findAll(filters)
      return res.status(200).json(students)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching students", error: error.message })
    }
  }

  getStudentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const student = await this.studentService.findById(id)

      if (!student) {
        return res.status(404).json({ message: "Student not found" })
      }

      return res.status(200).json(student)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching student", error: error.message })
    }
  }

  getStudentByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const student = await this.studentService.findByUserId(userId)

      if (!student) {
        return res.status(404).json({ message: "Student not found" })
      }

      return res.status(200).json(student)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching student", error: error.message })
    }
  }

  getStudentByStudentId = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const student = await this.studentService.findByStudentId(studentId)

      if (!student) {
        return res.status(404).json({ message: "Student not found" })
      }

      return res.status(200).json(student)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching student", error: error.message })
    }
  }

  createStudent = async (req: Request, res: Response) => {
    try {
      const data: CreateStudentProfileDto = req.body

      // If studentId is not provided, generate one
      if (!data.studentId) {
        const program = await this.programService.findById(data.programId)
        if (!program) {
          return res.status(404).json({ message: "Program not found" })
        }

        const enrollmentYear = new Date(data.enrollmentDate).getFullYear()
        data.studentId = await this.studentService.generateStudentId(program.code || "STD", enrollmentYear)
      }

      const student = await this.studentService.create(data)
      return res.status(201).json(student)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating student", error: error.message })
    }
  }

  updateStudent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateStudentProfileDto = req.body
      const student = await this.studentService.update(id, data)
      return res.status(200).json(student)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating student", error: error.message })
    }
  }

  deleteStudent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.studentService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting student", error: error.message })
    }
  }

  // Course enrollment endpoints
  getStudentEnrollments = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const enrollments = await this.studentService.getEnrollments(studentId)
      return res.status(200).json(enrollments)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching enrollments", error: error.message })
    }
  }

  getStudentEnrollmentsBySemester = async (req: Request, res: Response) => {
    try {
      const { studentId, semesterId } = req.params
      const enrollments = await this.studentService.getEnrollmentsBySemester(studentId, semesterId)
      return res.status(200).json(enrollments)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching enrollments", error: error.message })
    }
  }

  enrollStudentInCourse = async (req: Request, res: Response) => {
    try {
      const data: EnrollStudentInCourseDto = req.body
      const enrollment = await this.studentService.enrollInCourse(data)
      return res.status(201).json(enrollment)
    } catch (error: any) {
      return res.status(500).json({ message: "Error enrolling student in course", error: error.message })
    }
  }

  updateEnrollment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateCourseEnrollmentDto = req.body
      const enrollment = await this.studentService.updateEnrollment(id, data)
      return res.status(200).json(enrollment)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating enrollment", error: error.message })
    }
  }

  withdrawFromCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.studentService.withdrawFromCourse(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error withdrawing from course", error: error.message })
    }
  }

  batchEnrollStudents = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId, studentIds } = req.body
      const results = await this.studentService.batchEnrollStudents(courseId, semesterId, studentIds)
      return res.status(200).json(results)
    } catch (error: any) {
      return res.status(500).json({ message: "Error batch enrolling students", error: error.message })
    }
  }

  // Academic record endpoints
  getStudentAcademicRecords = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const records = await this.studentService.getAcademicRecords(studentId)
      return res.status(200).json(records)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching academic records", error: error.message })
    }
  }

  getAcademicRecord = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const record = await this.studentService.getAcademicRecord(id)

      if (!record) {
        return res.status(404).json({ message: "Academic record not found" })
      }

      return res.status(200).json(record)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching academic record", error: error.message })
    }
  }

  createAcademicRecord = async (req: Request, res: Response) => {
    try {
      const data: CreateAcademicRecordDto = req.body
      const record = await this.studentService.createAcademicRecord(data)
      return res.status(201).json(record)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating academic record", error: error.message })
    }
  }

  updateAcademicRecord = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateAcademicRecordDto = req.body
      const record = await this.studentService.updateAcademicRecord(id, data)
      return res.status(200).json(record)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating academic record", error: error.message })
    }
  }

  deleteAcademicRecord = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.studentService.deleteAcademicRecord(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting academic record", error: error.message })
    }
  }
}
