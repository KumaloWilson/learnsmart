import { Op } from "sequelize"
import OpenAI from "openai"
import {
  AtRiskStudent,
  StudentProfile,
  Course,
  Semester,
  User,
  CourseMastery,
  TopicProgress,
  CourseTopic,
  PhysicalAttendance,
  VirtualClassAttendance,
  VirtualClass,
  QuizAttempt,
  Quiz,
  AssessmentSubmission,
  Assessment,
} from "../models"
import type {
  CreateAtRiskStudentDto,
  UpdateAtRiskStudentDto,
  AtRiskStudentFilterDto,
  ResolveAtRiskStudentDto,
} from "../dto/at-risk-student.dto"

export class AtRiskStudentService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async findAll(filters?: AtRiskStudentFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.studentProfileId) {
        whereClause.studentProfileId = filters.studentProfileId
      }

      if (filters.courseId) {
        whereClause.courseId = filters.courseId
      }

      if (filters.semesterId) {
        whereClause.semesterId = filters.semesterId
      }

      if (filters.riskLevel) {
        whereClause.riskLevel = filters.riskLevel
      }

      if (filters.isResolved !== undefined) {
        whereClause.isResolved = filters.isResolved
      }
    }

    return AtRiskStudent.findAll({
      where: whereClause,
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
      order: [["riskScore", "DESC"]],
    })
  }

  async findById(id: string) {
    return AtRiskStudent.findByPk(id, {
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })
  }

  async create(data: CreateAtRiskStudentDto) {
    // Check if record already exists
    const existingRecord = await AtRiskStudent.findOne({
      where: {
        studentProfileId: data.studentProfileId,
        courseId: data.courseId,
        semesterId: data.semesterId,
        isResolved: false,
      },
    })

    if (existingRecord) {
      // Update existing record
      await existingRecord.update({
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
        riskFactors: data.riskFactors,
        recommendedActions: data.recommendedActions,
        aiAnalysis: data.aiAnalysis,
        lastUpdated: new Date(),
      })

      return this.findById(existingRecord.id)
    }

    // Create new record
    const atRiskStudent = await AtRiskStudent.create({
      ...data,
      isResolved: false,
      lastUpdated: new Date(),
    })

    return this.findById(atRiskStudent.id)
  }

  async update(id: string, data: UpdateAtRiskStudentDto) {
    const atRiskStudent = await AtRiskStudent.findByPk(id)
    if (!atRiskStudent) {
      throw new Error("At-risk student record not found")
    }

    // If marking as resolved, set resolvedAt
    if (data.isResolved && !atRiskStudent.isResolved) {
      data.resolvedAt = new Date()
    }

    await atRiskStudent.update({
      ...data,
      lastUpdated: new Date(),
    })

    return this.findById(id)
  }

  async resolveAtRiskStudent(data: ResolveAtRiskStudentDto) {
    const { id, resolutionNotes } = data

    const atRiskStudent = await AtRiskStudent.findByPk(id)
    if (!atRiskStudent) {
      throw new Error("At-risk student record not found")
    }

    await atRiskStudent.update({
      isResolved: true,
      resolvedAt: new Date(),
      resolutionNotes,
      lastUpdated: new Date(),
    })

    return this.findById(id)
  }

  async identifyAtRiskStudents(lecturerProfileId: string, courseId: string, semesterId: string, options: any = {}) {
    // Get all students enrolled in the course
    const { CourseEnrollment, StudentProfile } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })

    const atRiskStudents = []

    for (const enrollment of enrollments) {
      const studentProfileId = enrollment.studentProfileId
      const studentName = `${enrollment.studentProfile.user.firstName} ${enrollment.studentProfile.user.lastName}`

      // Get course mastery
      const courseMastery = await CourseMastery.findOne({
        where: {
          studentProfileId,
          courseId,
          semesterId,
        },
      })

      // Get topic progress
      const topics = await CourseTopic.findAll({
        where: {
          courseId,
          semesterId,
          isActive: true,
        },
      })

      const topicProgress = await TopicProgress.findAll({
        where: {
          studentProfileId,
          courseTopicId: {
            [Op.in]: topics.map((t) => t.id),
          },
        },
      })

      const completedTopics = topicProgress.filter((tp) => tp.isCompleted).length
      const totalTopics = topics.length
      const topicCompletionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

      // Get attendance
      const physicalAttendance = await PhysicalAttendance.findAll({
        where: {
          studentProfileId,
          courseId,
          semesterId,
        },
      })

      const virtualClasses = await VirtualClass.findAll({
        where: {
          courseId,
          semesterId,
        },
      })

      const virtualAttendance = await VirtualClassAttendance.findAll({
        where: {
          studentProfileId,
          virtualClassId: {
            [Op.in]: virtualClasses.map((vc) => vc.id),
          },
        },
      })

      const totalPhysicalClasses = await PhysicalAttendance.count({
        where: {
          courseId,
          semesterId,
          studentProfileId: {
            [Op.ne]: studentProfileId, // Any student's attendance record counts as a class
          },
        },
        distinct: true,
        col: "date",
      })

      const attendedPhysicalClasses = physicalAttendance.length
      const attendedVirtualClasses = virtualAttendance.length
      const totalVirtualClasses = virtualClasses.length

      const physicalAttendanceRate =
        totalPhysicalClasses > 0 ? (attendedPhysicalClasses / totalPhysicalClasses) * 100 : 100
      const virtualAttendanceRate = totalVirtualClasses > 0 ? (attendedVirtualClasses / totalVirtualClasses) * 100 : 100
      const overallAttendanceRate =
        (physicalAttendanceRate * totalPhysicalClasses + virtualAttendanceRate * totalVirtualClasses) /
        (totalPhysicalClasses + totalVirtualClasses || 1)

      // Get quiz performance
      const quizAttempts = await QuizAttempt.findAll({
        include: [
          {
            model: Quiz,
            as: "quiz",
            where: {
              courseId,
              semesterId,
            },
            required: true,
          },
        ],
        where: {
          studentProfileId,
        },
      })

      const totalQuizzes = await Quiz.count({
        where: {
          courseId,
          semesterId,
        },
      })

      const attemptedQuizzes = new Set(quizAttempts.map((qa) => qa.quizId)).size
      const quizAttemptRate = totalQuizzes > 0 ? (attemptedQuizzes / totalQuizzes) * 100 : 100

      let quizAverage = 0
      if (quizAttempts.length > 0) {
        const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0)
        const totalPossible = quizAttempts.reduce((sum, attempt) => sum + (attempt.quiz?.totalMarks || 0), 0)
        quizAverage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0
      }

      // Get assignment performance
      const submissions = await AssessmentSubmission.findAll({
        include: [
          {
            model: Assessment,
            as: "assessment",
            where: {
              courseId,
              semesterId,
            },
            required: true,
          },
        ],
        where: {
          studentProfileId,
        },
      })

      const totalAssessments = await Assessment.count({
        where: {
          courseId,
          semesterId,
        },
      })

      const submittedAssessments = new Set(submissions.map((s) => s.assessmentId)).size
      const submissionRate = totalAssessments > 0 ? (submittedAssessments / totalAssessments) * 100 : 100

      let assignmentAverage = 0
      const gradedSubmissions = submissions.filter((s) => s.isGraded)
      if (gradedSubmissions.length > 0) {
        const totalScore = gradedSubmissions.reduce((sum, submission) => sum + (submission.marks || 0), 0)
        const totalPossible = gradedSubmissions.reduce(
          (sum, submission) => sum + (submission.assessment?.totalMarks || 0),
          0,
        )
        assignmentAverage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0
      }

      // Calculate risk factors
      const riskFactors = []
      let riskScore = 0

      // Apply custom thresholds if provided
      const attendanceThreshold = options.attendanceThreshold || 70
      const performanceThreshold = options.performanceThreshold || 60
      const engagementThreshold = options.engagementThreshold || 70

      // Low topic completion
      if (topicCompletionRate < attendanceThreshold - 20) {
        riskFactors.push("Low topic completion rate")
        riskScore += 25
      } else if (topicCompletionRate < attendanceThreshold) {
        riskFactors.push("Moderate topic completion rate")
        riskScore += 15
      }

      // Poor attendance
      if (overallAttendanceRate < attendanceThreshold - 10) {
        riskFactors.push("Poor attendance")
        riskScore += 25
      } else if (overallAttendanceRate < attendanceThreshold) {
        riskFactors.push("Moderate attendance issues")
        riskScore += 15
      }

      // Low quiz performance
      if (quizAverage < performanceThreshold - 10) {
        riskFactors.push("Poor quiz performance")
        riskScore += 20
      } else if (quizAverage < performanceThreshold) {
        riskFactors.push("Moderate quiz performance")
        riskScore += 10
      }

      // Low assignment performance
      if (assignmentAverage < performanceThreshold - 10) {
        riskFactors.push("Poor assignment performance")
        riskScore += 20
      } else if (assignmentAverage < performanceThreshold) {
        riskFactors.push("Moderate assignment performance")
        riskScore += 10
      }

      // Missing quizzes
      if (quizAttemptRate < engagementThreshold) {
        riskFactors.push("Missing quizzes")
        riskScore += 15
      }

      // Missing assignments
      if (submissionRate < engagementThreshold) {
        riskFactors.push("Missing assignments")
        riskScore += 15
      }

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" | "critical" = "low"
      if (riskScore >= 80) {
        riskLevel = "critical"
      } else if (riskScore >= 50) {
        riskLevel = "high"
      } else if (riskScore >= 30) {
        riskLevel = "medium"
      }

      // Only consider students with medium or higher risk
      if (riskLevel === "low") {
        continue
      }

      // Generate AI recommendations
      let recommendedActions = ""
      let aiAnalysis = {}

      try {
        const analysisResult = await this.generateAIRecommendations({
          studentName,
          courseName: (await Course.findByPk(courseId))?.name || "the course",
          riskFactors,
          riskLevel,
          topicCompletionRate,
          overallAttendanceRate,
          quizAverage,
          assignmentAverage,
          quizAttemptRate,
          submissionRate,
        })

        recommendedActions = analysisResult.recommendedActions
        aiAnalysis = analysisResult.fullAnalysis
      } catch (error) {
        console.error("Error generating AI recommendations:", error)
        recommendedActions = this.generateDefaultRecommendations(riskFactors)
        aiAnalysis = {
          error: "Failed to generate AI analysis",
          riskFactors,
          metrics: {
            topicCompletionRate,
            overallAttendanceRate,
            quizAverage,
            assignmentAverage,
            quizAttemptRate,
            submissionRate,
          },
        }
      }

      // Create or update at-risk student record
      const atRiskStudent = await this.create({
        studentProfileId,
        courseId,
        semesterId,
        riskScore,
        riskLevel,
        riskFactors,
        recommendedActions,
        aiAnalysis,
      })

      atRiskStudents.push(atRiskStudent)
    }

    return atRiskStudents
  }

  async getAtRiskStudentsByLecturer(lecturerProfileId: string, options: any = {}) {
    // Get course assignments for this lecturer
    const { CourseAssignment } = require("../models")
    const courseAssignments = await CourseAssignment.findAll({
      where: {
        lecturerProfileId,
        isActive: true,
      },
    })

    const courseIds = courseAssignments.map((ca) => ca.courseId)
    const semesterIds = courseAssignments.map((ca) => ca.semesterId)

    // Get at-risk students for these courses
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
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
      order: [["riskScore", "DESC"]],
    })
  }

  private async generateAIRecommendations(data: any) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          recommendedActions: this.generateDefaultRecommendations(data.riskFactors),
          fullAnalysis: data,
        }
      }

      const prompt = `
        I need to generate personalized recommendations for a student who is at risk in their course.
        
        Student: ${data.studentName}
        Course: ${data.courseName}
        Risk Level: ${data.riskLevel}
        
        Risk Factors:
        ${data.riskFactors.join("\n")}
        
        Performance Metrics:
        - Topic Completion Rate: ${data.topicCompletionRate.toFixed(2)}%
        - Overall Attendance Rate: ${data.overallAttendanceRate.toFixed(2)}%
        - Quiz Average: ${data.quizAverage.toFixed(2)}%
        - Assignment Average: ${data.assignmentAverage.toFixed(2)}%
        - Quiz Attempt Rate: ${data.quizAttemptRate.toFixed(2)}%
        - Assignment Submission Rate: ${data.submissionRate.toFixed(2)}%
        
        Please provide:
        1. A detailed analysis of the student's situation
        2. Specific, actionable recommendations for the lecturer to help this student
        3. Suggested interventions based on the risk factors
        
        Format your response as a JSON object with the following structure:
        {
          "analysis": "Detailed analysis of the student's situation",
          "recommendedActions": "Specific, actionable recommendations for the lecturer",
          "interventions": ["Intervention 1", "Intervention 2", ...],
          "fullAnalysis": {
            // Additional detailed analysis
          }
        }
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an educational analytics AI that provides detailed analysis and recommendations for at-risk students.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      })

      const recommendationsData = JSON.parse(response.choices[0].message.content || "{}") as {
        analysis: string
        recommendedActions: string
        interventions: string[]
        fullAnalysis: object
      }

      return {
        recommendedActions: recommendationsData.recommendedActions,
        fullAnalysis: {
          ...recommendationsData.fullAnalysis,
          analysis: recommendationsData.analysis,
          interventions: recommendationsData.interventions,
        },
      }
    } catch (error) {
      console.error("Error generating AI recommendations:", error)
      return {
        recommendedActions: this.generateDefaultRecommendations(data.riskFactors),
        fullAnalysis: data,
      }
    }
  }

  private generateDefaultRecommendations(riskFactors: string[]): string {
    const recommendations = []

    if (riskFactors.includes("Low topic completion rate") || riskFactors.includes("Moderate topic completion rate")) {
      recommendations.push(
        "Schedule a meeting with the student to discuss their progress and create a plan to complete remaining topics.",
      )
    }

    if (riskFactors.includes("Poor attendance") || riskFactors.includes("Moderate attendance issues")) {
      recommendations.push(
        "Reach out to the student to understand attendance issues and emphasize the importance of regular attendance.",
      )
    }

    if (riskFactors.includes("Poor quiz performance") || riskFactors.includes("Moderate quiz performance")) {
      recommendations.push(
        "Provide additional study resources and consider offering practice quizzes to help improve performance.",
      )
    }

    if (
      riskFactors.includes("Poor assignment performance") ||
      riskFactors.includes("Moderate assignment performance")
    ) {
      recommendations.push(
        "Review assignment feedback with the student and offer guidance on how to improve future submissions.",
      )
    }

    if (riskFactors.includes("Missing quizzes")) {
      recommendations.push("Send reminders about upcoming quizzes and offer makeup opportunities if appropriate.")
    }

    if (riskFactors.includes("Missing assignments")) {
      recommendations.push(
        "Check in with the student about missed assignments and consider offering extensions if appropriate.",
      )
    }

    if (recommendations.length === 0) {
      recommendations.push("Monitor the student's progress and provide support as needed.")
    }

    return recommendations.join(" ")
  }
}
