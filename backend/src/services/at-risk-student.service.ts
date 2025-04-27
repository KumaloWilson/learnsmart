import { Op } from "sequelize"
import { AtRiskStudent } from "../models/AtRiskStudent"
import { StudentProfile } from "../models/StudentProfile"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { User } from "../models/User"
import { CourseMastery } from "../models/CourseMastery"
import { PhysicalAttendance } from "../models/PhysicalAttendance"
import { VirtualClassAttendance } from "../models/VirtualClassAttendance"
import { QuizAttempt } from "../models/QuizAttempt"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { NotificationService } from "./notification.service"
import type { CreateAtRiskStudentDto, ResolveAtRiskStudentDto } from "../dto/at-risk-student.dto"
import { Quiz } from "../models/Quiz"
import { Assessment } from "../models/Assessment"
import { CourseAssignment } from "../models/CourseAssignment"

export class AtRiskStudentService {
  private notificationService: NotificationService

  constructor() {
    this.notificationService = new NotificationService()
  }

  /**
   * Identify students at risk based on various factors
   */
  async identifyAtRiskStudents(
    courseId: string,
    semesterId: string,
    options: {
      attendanceThreshold?: number
      performanceThreshold?: number
    } = {},
  ): Promise<AtRiskStudent[]> {
    const { attendanceThreshold = 70, performanceThreshold = 60 } = options

    // Get all students enrolled in the course
    const studentProfiles = await StudentProfile.findAll({
      include: [
        {
          model: Course,
          through: { attributes: [] },
          where: {
            id: courseId,
          },
        },
        {
          model: User,
        },
      ],
    })

    const atRiskStudents: AtRiskStudent[] = []

    // Check each student for risk factors
    for (const studentProfile of studentProfiles) {
      const riskFactors: string[] = []
      let riskScore = 0

      // Check attendance
      const physicalAttendance = await PhysicalAttendance.findAll({
        where: {
          studentProfileId: studentProfile.id,
          courseId,
          semesterId,
        },
      })

      const virtualAttendance = await VirtualClassAttendance.findAll({
        where: {
          studentProfileId: studentProfile.id,
          courseId,
          semesterId,
        },
      })

      const totalAttendanceRecords = physicalAttendance.length + virtualAttendance.length
      const attendedRecords =
        physicalAttendance.filter((a) => a.isPresent).length + virtualAttendance.filter((a) => a.isPresent).length

      const attendanceRate = totalAttendanceRecords > 0 ? (attendedRecords / totalAttendanceRecords) * 100 : 100

      if (attendanceRate < attendanceThreshold) {
        riskFactors.push(`Low attendance rate (${attendanceRate.toFixed(1)}%)`)
        riskScore += (attendanceThreshold - attendanceRate) / 10
      }

      // Check course mastery
      const courseMastery = await CourseMastery.findOne({
        where: {
          studentProfileId: studentProfile.id,
          courseId,
          semesterId,
        },
      })

      if (courseMastery) {
        if (courseMastery.masteryLevel < performanceThreshold) {
          riskFactors.push(`Low mastery level (${courseMastery.masteryLevel.toFixed(1)}%)`)
          riskScore += (performanceThreshold - courseMastery.masteryLevel) / 10
        }

        if (courseMastery.quizAverage < performanceThreshold) {
          riskFactors.push(`Low quiz performance (${courseMastery.quizAverage.toFixed(1)}%)`)
          riskScore += (performanceThreshold - courseMastery.quizAverage) / 10
        }

        if (courseMastery.assignmentAverage < performanceThreshold) {
          riskFactors.push(`Low assignment performance (${courseMastery.assignmentAverage.toFixed(1)}%)`)
          riskScore += (performanceThreshold - courseMastery.assignmentAverage) / 10
        }

        if (courseMastery.topicCompletionPercentage < 50) {
          riskFactors.push(`Low topic completion (${courseMastery.topicCompletionPercentage.toFixed(1)}%)`)
          riskScore += (50 - courseMastery.topicCompletionPercentage) / 10
        }
      } else {
        riskFactors.push("No course mastery data available")
        riskScore += 5
      }

      // Check recent quiz attempts
      const recentQuizAttempts = await QuizAttempt.findAll({
        where: {
          studentProfileId: studentProfile.id,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        include: [
          {
            model: Quiz,
            where: {
              courseId,
              semesterId,
            },
          },
        ],
      })

      if (recentQuizAttempts.length > 0) {
        const averageScore =
          recentQuizAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / recentQuizAttempts.length
        if (averageScore < performanceThreshold) {
          riskFactors.push(`Recent quiz average below threshold (${averageScore.toFixed(1)}%)`)
          riskScore += (performanceThreshold - averageScore) / 10
        }
      }

      // Check recent assessment submissions
      const recentSubmissions = await AssessmentSubmission.findAll({
        where: {
          studentProfileId: studentProfile.id,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        include: [
          {
            model: Assessment,
            where: {
              courseId,
              semesterId,
            },
          },
        ],
      })

      if (recentSubmissions.length > 0) {
        const averageScore =
          recentSubmissions.reduce((sum, submission) => sum + (submission.marks ?? 0), 0) / recentSubmissions.length
        if (averageScore < performanceThreshold) {
          riskFactors.push(`Recent assessment average below threshold (${averageScore.toFixed(1)}%)`)
          riskScore += (performanceThreshold - averageScore) / 10
        }
      }

      // If there are risk factors, create or update at-risk student record
      if (riskFactors.length > 0) {
        // Determine risk level
        let riskLevel: "low" | "medium" | "high" | "critical" = "low"
        if (riskScore > 30) {
          riskLevel = "critical"
        } else if (riskScore > 20) {
          riskLevel = "high"
        } else if (riskScore > 10) {
          riskLevel = "medium"
        }

        // Generate recommended actions
        const recommendedActions = this.generateRecommendedActions(riskFactors, riskLevel)

        // Check if student is already marked as at-risk
        const existingRecord = await AtRiskStudent.findOne({
          where: {
            studentProfileId: studentProfile.id,
            courseId,
            semesterId,
            isResolved: false,
          },
        })

        if (existingRecord) {
          // Update existing record
          await existingRecord.update({
            riskScore,
            riskLevel,
            riskFactors,
            recommendedActions,
            lastUpdated: new Date(),
          })
          atRiskStudents.push(existingRecord)
        } else {
          // Create new record
          const newAtRiskStudent = await AtRiskStudent.create({
            studentProfileId: studentProfile.id,
            courseId,
            semesterId,
            riskScore,
            riskLevel,
            riskFactors,
            recommendedActions,
            isResolved: false,
            lastUpdated: new Date(),
          })
          atRiskStudents.push(newAtRiskStudent)

          // Send notification to student and relevant staff
          await this.notificationService.createNotification({
            userId: studentProfile.userId,
            title: "Academic Risk Alert",
            message: `You have been identified as at risk in ${courseMastery?.course?.name || "your course"}. Please check your student portal for details.`,
            type: "warning",
            relatedId: newAtRiskStudent.id,
            relatedType: "at_risk_student",
          })
        }
      }
    }

    return atRiskStudents
  }

  /**
   * Get at-risk students by lecturer
   */
  async getAtRiskStudentsByLecturer(
    lecturerProfileId: string,
    options: { includeResolved?: boolean } = {},
  ): Promise<AtRiskStudent[]> {
    // Get course assignments for this lecturer
    const courseAssignments = await CourseAssignment.findAll({
      where: {
        lecturerProfileId,
        isActive: true,
      },
    })

    if (courseAssignments.length === 0) {
      return []
    }

    // Extract course and semester IDs
    const courseIds = courseAssignments.map((ca) => ca.courseId)
    const semesterIds = courseAssignments.map((ca) => ca.semesterId)

    // Find at-risk students for these courses
    return AtRiskStudent.findAll({
      where: {
        courseId: {
          [Op.in]: courseIds,
        },
        semesterId: {
          [Op.in]: semesterIds,
        },
        isResolved: options.includeResolved ? undefined : false,
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [
        ["riskLevel", "DESC"],
        ["lastUpdated", "DESC"],
      ],
    })
  }

  /**
   * Generate recommended actions based on risk factors
   */
  private generateRecommendedActions(riskFactors: string[], riskLevel: "low" | "medium" | "high" | "critical"): string {
    const actions: string[] = []

    if (riskFactors.some((factor) => factor.includes("attendance"))) {
      actions.push("Improve class attendance and participation")
    }

    if (riskFactors.some((factor) => factor.includes("mastery"))) {
      actions.push("Review course materials and seek additional learning resources")
    }

    if (riskFactors.some((factor) => factor.includes("quiz"))) {
      actions.push("Practice with additional quizzes and review incorrect answers")
    }

    if (riskFactors.some((factor) => factor.includes("assignment"))) {
      actions.push("Seek feedback on assignments and improve submission quality")
    }

    if (riskFactors.some((factor) => factor.includes("topic completion"))) {
      actions.push("Complete all required course topics and activities")
    }

    if (riskLevel === "high" || riskLevel === "critical") {
      actions.push("Schedule a meeting with your academic advisor")
      actions.push("Consider joining a study group or seeking peer tutoring")
    }

    return actions.join("\n- ")
  }

  /**
   * Create a new at-risk student record
   */
  async createAtRiskStudent(data: CreateAtRiskStudentDto): Promise<AtRiskStudent> {
    const atRiskStudent = await AtRiskStudent.create({
      ...data,
      isResolved: false,
      lastUpdated: new Date(),
    })

    // Send notification to student
    const studentProfile = await StudentProfile.findByPk(data.studentProfileId, {
      include: [User],
    })

    if (studentProfile) {
      await this.notificationService.createNotification({
        userId: studentProfile.userId,
        title: "Academic Risk Alert",
        message: `You have been identified as at risk in your course. Please check your student portal for details.`,
        type: "warning",
        relatedId: atRiskStudent.id,
        relatedType: "at_risk_student",
      })
    }

    return atRiskStudent
  }

  /**
   * Get at-risk student by ID
   */
  async getAtRiskStudentById(id: string): Promise<AtRiskStudent | null> {
    return AtRiskStudent.findByPk(id, {
      include: [
        {
          model: StudentProfile,
          include: [User],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
    })
  }

  /**
   * Get all at-risk students with optional filters
   */
  async getAtRiskStudents(
    filters: {
      studentProfileId?: string
      courseId?: string
      semesterId?: string
      riskLevel?: "low" | "medium" | "high" | "critical"
      isResolved?: boolean
    } = {},
  ): Promise<AtRiskStudent[]> {
    return AtRiskStudent.findAll({
      where: {
        ...filters,
      },
      include: [
        {
          model: StudentProfile,
          include: [User],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [
        ["riskLevel", "DESC"],
        ["lastUpdated", "DESC"],
      ],
    })
  }

  /**
   * Update an at-risk student record
   */
  async updateAtRiskStudent(id: string, data: Partial<AtRiskStudent>): Promise<AtRiskStudent | null> {
    const atRiskStudent = await AtRiskStudent.findByPk(id)

    if (!atRiskStudent) {
      return null
    }

    await atRiskStudent.update({
      ...data,
      lastUpdated: new Date(),
    })

    return atRiskStudent
  }

  /**
   * Resolve an at-risk student record
   */
  async resolveAtRiskStudent(id: string, data: ResolveAtRiskStudentDto): Promise<AtRiskStudent | null> {
    const atRiskStudent = await AtRiskStudent.findByPk(id)

    if (!atRiskStudent) {
      return null
    }

    await atRiskStudent.update({
      isResolved: true,
      resolvedAt: new Date(),
      resolutionNotes: data.resolutionNotes,
      lastUpdated: new Date(),
    })

    // Send notification to student
    const studentProfile = await StudentProfile.findByPk(atRiskStudent.studentProfileId, {
      include: [User],
    })

    if (studentProfile) {
      await this.notificationService.createNotification({
        userId: studentProfile.userId,
        title: "Academic Risk Status Updated",
        message: "Your at-risk status has been resolved. Keep up the good work!",
        type: "success",
        relatedId: atRiskStudent.id,
        relatedType: "at_risk_student",
      })
    }

    return atRiskStudent
  }

  /**
   * Delete an at-risk student record
   */
  async deleteAtRiskStudent(id: string): Promise<boolean> {
    const atRiskStudent = await AtRiskStudent.findByPk(id)

    if (!atRiskStudent) {
      return false
    }

    await atRiskStudent.destroy()
    return true
  }

  /**
   * Get at-risk statistics for a course
   */
  async getAtRiskStatistics(
    courseId: string,
    semesterId: string,
  ): Promise<{
    totalAtRisk: number
    byRiskLevel: Record<string, number>
    resolvedCount: number
    unresolvedCount: number
  }> {
    const atRiskStudents = await AtRiskStudent.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const byRiskLevel = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    let resolvedCount = 0
    let unresolvedCount = 0

    atRiskStudents.forEach((student) => {
      byRiskLevel[student.riskLevel]++
      if (student.isResolved) {
        resolvedCount++
      } else {
        unresolvedCount++
      }
    })

    return {
      totalAtRisk: atRiskStudents.length,
      byRiskLevel,
      resolvedCount,
      unresolvedCount,
    }
  }
}
