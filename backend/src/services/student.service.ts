import { Op } from "sequelize"
import { AuthService } from "./auth.service"
import type {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
  EnrollStudentInCourseDto,
  UpdateCourseEnrollmentDto,
  CreateAcademicRecordDto,
  UpdateAcademicRecordDto,
  StudentFilterDto,
} from "../dto/student.dto"
import { AcademicRecord } from "../models/AcademicRecord"
import { Course } from "../models/Course"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { Program } from "../models/Program"
import { Semester } from "../models/Semester"
import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"

export class StudentService {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async findAll(filters?: StudentFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.programId) {
        whereClause.programId = filters.programId
      }
      if (filters.status) {
        whereClause.status = filters.status
      }
      if (filters.currentLevel) {
        whereClause.currentLevel = filters.currentLevel
      }
      if (filters.enrollmentYear) {
        const startDate = new Date(filters.enrollmentYear, 0, 1)
        const endDate = new Date(filters.enrollmentYear, 11, 31)
        whereClause.enrollmentDate = {
          [Op.between]: [startDate, endDate],
        }
      }
    }

    return StudentProfile.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
        {
          model: Program,
          include: ["department"],
        },
      ],
    })
  }

  async findById(id: string) {
    return StudentProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
        {
          model: Program,
          include: ["department"],
        },
      ],
    })
  }

  async findByUserId(userId: string) {
    return StudentProfile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
        {
          model: Program,
          include: ["department"],
        },
      ],
    })
  }

  async findByStudentId(studentId: string) {
    return StudentProfile.findOne({
      where: { studentId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
        {
          model: Program,
          include: ["department"],
        },
      ],
    })
  }

  async create(data: CreateStudentProfileDto) {
    // Create user account first
    const authResult = await this.authService.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: "password123", // Default password, should be changed by the user
      role: "student",
    })

    // Create student profile
    const studentProfile = await StudentProfile.create({
      studentId: data.studentId,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      phoneNumber: data.phoneNumber,
      programId: data.programId,
      enrollmentDate: data.enrollmentDate,
      currentLevel: data.currentLevel || 1,
      userId: authResult.user.id,
    })

    return this.findById(studentProfile.id)
  }

  async update(id: string, data: UpdateStudentProfileDto) {
    const studentProfile = await StudentProfile.findByPk(id)
    if (!studentProfile) {
      throw new Error("Student profile not found")
    }

    await studentProfile.update(data)
    return this.findById(id)
  }

  async delete(id: string) {
    const studentProfile = await StudentProfile.findByPk(id, {
      include: [User],
    })

    if (!studentProfile) {
      throw new Error("Student profile not found")
    }

    // Delete user account
    if (studentProfile.user) {
      await studentProfile.user.destroy()
    }

    // StudentProfile will be deleted by cascade
    return { message: "Student deleted successfully" }
  }

  // Course enrollment methods
  async getEnrollments(studentProfileId: string) {
    return CourseEnrollment.findAll({
      where: { studentProfileId },
      include: [
        {
          model: Course,
          include: ["program"],
        },
        {
          model: Semester,
        },
      ],
    })
  }

  async getEnrollmentsBySemester(studentProfileId: string, semesterId: string) {
    return CourseEnrollment.findAll({
      where: {
        studentProfileId,
        semesterId,
      },
      include: [
        {
          model: Course,
          include: ["program"],
        },
        {
          model: Semester,
        },
      ],
    })
  }

  async enrollInCourse(data: EnrollStudentInCourseDto) {
    // Check if student is already enrolled in this course for this semester
    const existingEnrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId: data.studentProfileId,
        courseId: data.courseId,
        semesterId: data.semesterId,
      },
    })

    if (existingEnrollment) {
      throw new Error("Student is already enrolled in this course for this semester")
    }

    // Check if course is offered in this semester
    const course = await Course.findByPk(data.courseId, {
      include: [
        {
          model: Semester,
          where: {
            id: data.semesterId,
          },
          required: true,
        },
      ],
    })

    if (!course) {
      throw new Error("Course is not offered in this semester")
    }

    // Check if student is enrolled in the program that offers this course
    const studentProfile = await StudentProfile.findByPk(data.studentProfileId)
    if (!studentProfile) {
      throw new Error("Student profile not found")
    }

    const courseDetails = await Course.findByPk(data.courseId, {
      include: ["program"],
    })

    if (!courseDetails) {
      throw new Error("Course not found")
    }

    // Create enrollment
    return CourseEnrollment.create({
      studentProfileId: data.studentProfileId,
      courseId: data.courseId,
      semesterId: data.semesterId,
      status: "enrolled",
    })
  }

  async updateEnrollment(id: string, data: UpdateCourseEnrollmentDto) {
    const enrollment = await CourseEnrollment.findByPk(id)
    if (!enrollment) {
      throw new Error("Enrollment not found")
    }

    // Create update data object
    const updateData: any = { ...data }

    // If grade is provided, calculate letter grade
    if (data.grade !== undefined) {
      updateData.letterGrade = this.calculateLetterGrade(data.grade)
    }

    await enrollment.update(updateData)
    return CourseEnrollment.findByPk(id, {
      include: [
        {
          model: Course,
          include: ["program"],
        },
        {
          model: Semester,
        },
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async withdrawFromCourse(id: string) {
    const enrollment = await CourseEnrollment.findByPk(id)
    if (!enrollment) {
      throw new Error("Enrollment not found")
    }

    await enrollment.update({ status: "withdrawn" })
    return { message: "Student withdrawn from course successfully" }
  }

  // Academic record methods
  async getAcademicRecords(studentProfileId: string) {
    return AcademicRecord.findAll({
      where: { studentProfileId },
      include: [
        {
          model: Semester,
        },
      ],
      order: [[Semester, "startDate", "DESC"]],
    })
  }

  async getAcademicRecord(id: string) {
    return AcademicRecord.findByPk(id, {
      include: [
        {
          model: Semester,
        },
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
            {
              model: Program,
            },
          ],
        },
      ],
    })
  }

  async createAcademicRecord(data: CreateAcademicRecordDto) {
    // Check if record already exists for this student and semester
    const existingRecord = await AcademicRecord.findOne({
      where: {
        studentProfileId: data.studentProfileId,
        semesterId: data.semesterId,
      },
    })

    if (existingRecord) {
      throw new Error("Academic record already exists for this student and semester")
    }

    return AcademicRecord.create(data as any)
  }

  async updateAcademicRecord(id: string, data: UpdateAcademicRecordDto) {
    const record = await AcademicRecord.findByPk(id)
    if (!record) {
      throw new Error("Academic record not found")
    }

    await record.update(data)
    return this.getAcademicRecord(id)
  }

  async deleteAcademicRecord(id: string) {
    const record = await AcademicRecord.findByPk(id)
    if (!record) {
      throw new Error("Academic record not found")
    }

    await record.destroy()
    return { message: "Academic record deleted successfully" }
  }

  // Helper methods
  private calculateLetterGrade(grade: number): string {
    if (grade >= 80) return "A"
    if (grade >= 70) return "B"
    if (grade >= 60) return "C"
    if (grade >= 50) return "D"
    return "F"
  }

  // Batch operations
  async batchEnrollStudents(courseId: string, semesterId: string, studentIds: string[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as { studentId: string; error: string }[],
    }

    for (const studentId of studentIds) {
      try {
        await this.enrollInCourse({
          studentProfileId: studentId,
          courseId,
          semesterId,
        })
        results.success++
      } catch (error: any) {
        results.failed++
        results.errors.push({
          studentId,
          error: error.message,
        })
      }
    }

    return results
  }

  async generateStudentId(programCode: string, enrollmentYear: number): Promise<string> {
    // Format: PROGRAM_CODE/YEAR/SEQUENCE_NUMBER
    // Example: CSC/2023/001

    // Get the count of students in this program for this year
    const startDate = new Date(enrollmentYear, 0, 1)
    const endDate = new Date(enrollmentYear, 11, 31)

    const count = await StudentProfile.count({
      where: {
        studentId: {
          [Op.like]: `${programCode}/${enrollmentYear}/%`,
        },
        enrollmentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    })

    // Generate the sequence number with leading zeros
    const sequenceNumber = (count + 1).toString().padStart(3, "0")

    return `${programCode}/${enrollmentYear}/${sequenceNumber}`
  }
}
