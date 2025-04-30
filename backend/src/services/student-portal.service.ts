import { Op } from "sequelize"
import { StorageService } from "./storage.service"
import type {
  StudentAssessmentSubmissionDto,
  JoinVirtualClassDto,
  StudentDashboardFilterDto,
  StudentPerformanceFilterDto,
  StudentAttendanceFilterDto,
  StudentMaterialsFilterDto,
} from "../dto/student-portal.dto"
import { AcademicRecord } from "../models/AcademicRecord"
import { Assessment } from "../models/Assessment"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { Course } from "../models/Course"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { LecturerProfile } from "../models/LecturerProfile"
import { PhysicalAttendance } from "../models/PhysicalAttendance"
import { Quiz } from "../models/Quiz"
import { QuizAttempt } from "../models/QuizAttempt"
import { Semester } from "../models/Semester"
import { StudentPerformance } from "../models/StudentPerformance"
import { TeachingMaterial } from "../models/TeachingMaterial"
import { User } from "../models/User"
import { VirtualClass } from "../models/VirtualClass"
import { VirtualClassAttendance } from "../models/VirtualClassAttendance"

export class StudentPortalService {
  private storageService: StorageService

  constructor() {
    this.storageService = new StorageService()
  }

  // Dashboard methods
  async getStudentDashboard(studentProfileId: string, filters?: StudentDashboardFilterDto) {
    const whereClause: any = {}

    if (filters?.semesterId) {
      whereClause.semesterId = filters.semesterId
    }

    if (filters?.courseId) {
      whereClause.courseId = filters.courseId
    }

    // Get enrolled courses
    const enrollments = await CourseEnrollment.findAll({
      where: {
        studentProfileId,
        ...whereClause,
      },
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
    })

    // Get upcoming assessments
    const now = new Date()
    const assessmentWhereClause: any = {
      dueDate: {
        [Op.gte]: now,
      },
      isPublished: true,
    }

    if (filters?.courseId) {
      assessmentWhereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      assessmentWhereClause.semesterId = filters.semesterId
    }

    const upcomingAssessments = await Assessment.findAll({
      where: assessmentWhereClause,
      include: [
        {
          model: Course,
        },
      ],
      order: [["dueDate", "ASC"]],
      limit: 5,
    })

    // Get upcoming virtual classes
    const virtualClassWhereClause: any = {
      startTime: {
        [Op.gte]: now,
      },
    }

    if (filters?.courseId) {
      virtualClassWhereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      virtualClassWhereClause.semesterId = filters.semesterId
    }

    const upcomingVirtualClasses = await VirtualClass.findAll({
      where: virtualClassWhereClause,
      include: [
        {
          model: Course,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["startTime", "ASC"]],
      limit: 5,
    })

    // Get recent materials
    const materialWhereClause: any = {
      isPublished: true,
    }

    if (filters?.courseId) {
      materialWhereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      materialWhereClause.semesterId = filters.semesterId
    }

    const recentMaterials = await TeachingMaterial.findAll({
      where: materialWhereClause,
      include: [
        {
          model: Course,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    })

    // Get performance summary
    const performanceSummary = await StudentPerformance.findAll({
      where: {
        studentProfileId,
        ...(filters?.courseId ? { courseId: filters.courseId } : {}),
        ...(filters?.semesterId ? { semesterId: filters.semesterId } : {}),
      },
      include: [
        {
          model: Course,
        },
      ],
    })

    // Get attendance summary
    const attendanceSummary = await PhysicalAttendance.findAll({
      where: {
        studentProfileId,
        ...(filters?.courseId ? { courseId: filters.courseId } : {}),
        ...(filters?.semesterId ? { semesterId: filters.semesterId } : {}),
      },
      include: [
        {
          model: Course,
        },
      ],
    })

    return {
      enrollments,
      upcomingAssessments,
      upcomingVirtualClasses,
      recentMaterials,
      performanceSummary,
      attendanceSummary,
    }
  }

  // Course methods
  async getEnrolledCourses(studentProfileId: string, semesterId?: string) {
    const whereClause: any = { studentProfileId }

    if (semesterId) {
      whereClause.semesterId = semesterId
    }

    return CourseEnrollment.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          include: ["program"],
        },
        {
          model: Semester,
        },
      ],
      order: [[Semester, "startDate", "DESC"]],
    })
  }

  async getCourseDetails(courseId: string, semesterId: string, studentProfileId: string) {
    // Check if student is enrolled in this course
    const enrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
    })

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course")
    }

    // Get course details
    const course = await Course.findByPk(courseId, {
      include: ["program"],
    })

    if (!course) {
      throw new Error("Course not found")
    }

    // Get course materials
    const materials = await TeachingMaterial.findAll({
      where: {
        courseId,
        semesterId,
        isPublished: true,
      },
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    // Get assessments
    const assessments = await Assessment.findAll({
      where: {
        courseId,
        semesterId,
        isPublished: true,
      },
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    // Get student's submissions
    const submissions = await AssessmentSubmission.findAll({
      where: {
        studentProfileId,
      },
      include: [
        {
          model: Assessment,
          where: {
            courseId,
            semesterId,
          },
          required: true,
        },
      ],
    })

    // Get quizzes
    const quizzes = await Quiz.findAll({
      where: {
        courseId,
        semesterId,
        isPublished: true,
      },
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    // Get student's quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: {
        studentProfileId,
      },
      include: [
        {
          model: Quiz,
          where: {
            courseId,
            semesterId,
          },
          required: true,
        },
      ],
    })

    // Get virtual classes
    const virtualClasses = await VirtualClass.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["startTime", "DESC"]],
    })

    // Get student's attendance
    const attendance = await PhysicalAttendance.findAll({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
      order: [["date", "DESC"]],
    })

    return {
      course,
      materials,
      assessments,
      submissions,
      quizzes,
      quizAttempts,
      virtualClasses,
      attendance,
    }
  }

  // Assessment methods
  async getAssessments(studentProfileId: string, courseId?: string, semesterId?: string) {
    // First, get the student's enrollments
    const enrollmentWhereClause: any = { studentProfileId }

    if (courseId) {
      enrollmentWhereClause.courseId = courseId
    }

    if (semesterId) {
      enrollmentWhereClause.semesterId = semesterId
    }

    const enrollments = await CourseEnrollment.findAll({
      where: enrollmentWhereClause,
      attributes: ["courseId", "semesterId"],
    })

    if (enrollments.length === 0) {
      return []
    }

    // Create a where clause for assessments based on enrollments
    const assessmentWhereClause: any = {
      isPublished: true,
      [Op.or]: enrollments.map((e) => ({
        courseId: e.courseId,
        semesterId: e.semesterId,
      })),
    }

    // Get assessments
    const assessments = await Assessment.findAll({
      where: assessmentWhereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    // Get student's submissions
    const submissions = await AssessmentSubmission.findAll({
      where: {
        studentProfileId,
        assessmentId: {
          [Op.in]: assessments.map((a) => a.id),
        },
      },
    })

    // Combine assessments with submission status
    return assessments.map((assessment) => {
      const submission = submissions.find((s) => s.assessmentId === assessment.id)
      return {
        ...assessment.toJSON(),
        submission: submission || null,
      }
    })
  }

  async getAssessmentById(assessmentId: string, studentProfileId: string) {
    const assessment = await Assessment.findByPk(assessmentId, {
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
    })

    if (!assessment) {
      throw new Error("Assessment not found")
    }

    if (!assessment.isPublished) {
      throw new Error("Assessment is not published")
    }

    // Check if student is enrolled in this course
    const enrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId,
        courseId: assessment.courseId,
        semesterId: assessment.semesterId,
      },
    })

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course")
    }

    // Get student's submission
    const submission = await AssessmentSubmission.findOne({
      where: {
        studentProfileId,
        assessmentId,
      },
    })

    return {
      ...assessment.toJSON(),
      submission: submission || null,
    }
  }

  async submitAssessment(data: StudentAssessmentSubmissionDto) {
    const { assessmentId, studentProfileId, submissionText, fileUrl, fileName, fileType, fileSize } = data

    // Check if assessment exists and is published
    const assessment = await Assessment.findByPk(assessmentId)

    if (!assessment) {
      throw new Error("Assessment not found")
    }

    if (!assessment.isPublished) {
      throw new Error("Assessment is not published")
    }

    // Check if student is enrolled in this course
    const enrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId,
        courseId: assessment.courseId,
        semesterId: assessment.semesterId,
      },
    })

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course")
    }

    // Check if due date has passed
    const now = new Date()
    if (assessment.dueDate < now) {
      throw new Error("Assessment due date has passed")
    }

    // Check if student has already submitted
    const existingSubmission = await AssessmentSubmission.findOne({
      where: {
        studentProfileId,
        assessmentId,
      },
    })

    if (existingSubmission) {
      throw new Error("You have already submitted this assessment")
    }

    // Create submission
    return AssessmentSubmission.create({
      assessmentId,
      studentProfileId,
      submissionText,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      submissionDate: now,
      isGraded: false,
    })
  }

  // Virtual class methods
  async getVirtualClasses(studentProfileId: string, courseId?: string, semesterId?: string) {
    // First, get the student's enrollments
    const enrollmentWhereClause: any = { studentProfileId }

    if (courseId) {
      enrollmentWhereClause.courseId = courseId
    }

    if (semesterId) {
      enrollmentWhereClause.semesterId = semesterId
    }

    const enrollments = await CourseEnrollment.findAll({
      where: enrollmentWhereClause,
      attributes: ["courseId", "semesterId"],
    })

    if (enrollments.length === 0) {
      return []
    }

    // Create a where clause for virtual classes based on enrollments
    const virtualClassWhereClause: any = {
      [Op.or]: enrollments.map((e) => ({
        courseId: e.courseId,
        semesterId: e.semesterId,
      })),
    }

    // Get virtual classes
    const virtualClasses = await VirtualClass.findAll({
      where: virtualClassWhereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["startTime", "DESC"]],
    })

    // Get student's attendance
    const attendances = await VirtualClassAttendance.findAll({
      where: {
        studentProfileId,
        virtualClassId: {
          [Op.in]: virtualClasses.map((vc) => vc.id),
        },
      },
    })

    // Combine virtual classes with attendance status
    return virtualClasses.map((virtualClass) => {
      const attendance = attendances.find((a) => a.virtualClassId === virtualClass.id)
      return {
        ...virtualClass.toJSON(),
        attended: !!attendance,
        joinTime: attendance?.joinTime,
        leaveTime: attendance?.leaveTime,
      }
    })
  }

  async joinVirtualClass(data: JoinVirtualClassDto) {
    const { virtualClassId, studentProfileId } = data

    // Check if virtual class exists
    const virtualClass = await VirtualClass.findByPk(virtualClassId)

    if (!virtualClass) {
      throw new Error("Virtual class not found")
    }

    // Check if student is enrolled in this course
    const enrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId,
        courseId: virtualClass.courseId,
        semesterId: virtualClass.semesterId,
      },
    })

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course")
    }

    // Check if student has already joined
    const existingAttendance = await VirtualClassAttendance.findOne({
      where: {
        studentProfileId,
        virtualClassId,
      },
    })

    if (existingAttendance) {
      // Update leave time
      await existingAttendance.update({
        leaveTime: new Date(),
      })

      return existingAttendance
    }

    // Create attendance record
    return VirtualClassAttendance.create({
      virtualClassId,
      studentProfileId,
      joinTime: new Date(),
    })
  }

  // Materials methods
  async getMaterials(studentProfileId: string, filters?: StudentMaterialsFilterDto) {
    // First, get the student's enrollments
    const enrollmentWhereClause: any = { studentProfileId }

    if (filters?.courseId) {
      enrollmentWhereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      enrollmentWhereClause.semesterId = filters.semesterId
    }

    const enrollments = await CourseEnrollment.findAll({
      where: enrollmentWhereClause,
      attributes: ["courseId", "semesterId"],
    })

    if (enrollments.length === 0) {
      return []
    }

    // Create a where clause for materials based on enrollments
    const materialWhereClause: any = {
      isPublished: true,
      [Op.or]: enrollments.map((e) => ({
        courseId: e.courseId,
        semesterId: e.semesterId,
      })),
    }

    if (filters?.type) {
      materialWhereClause.type = filters.type
    }

    // Get materials
    return TeachingMaterial.findAll({
      where: materialWhereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  // Performance methods
  async getPerformance(studentProfileId: string, filters?: StudentPerformanceFilterDto) {
    const whereClause: any = { studentProfileId }

    if (filters?.courseId) {
      whereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      whereClause.semesterId = filters.semesterId
    }

    if (filters?.assessmentType) {
      whereClause.assessmentType = filters.assessmentType
    }

    return StudentPerformance.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [
        [Semester, "startDate", "DESC"],
        [Course, "code", "ASC"],
      ],
    })
  }

  // Attendance methods
  async getAttendance(studentProfileId: string, filters?: StudentAttendanceFilterDto) {
    const whereClause: any = { studentProfileId }

    if (filters?.courseId) {
      whereClause.courseId = filters.courseId
    }

    if (filters?.semesterId) {
      whereClause.semesterId = filters.semesterId
    }

    if (filters?.startDate) {
      whereClause.date = {
        ...whereClause.date,
        [Op.gte]: filters.startDate,
      }
    }

    if (filters?.endDate) {
      whereClause.date = {
        ...whereClause.date,
        [Op.lte]: filters.endDate,
      }
    }

    return PhysicalAttendance.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["date", "DESC"]],
    })
  }

  // Academic records methods
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
}
