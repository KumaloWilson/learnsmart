import { Op } from "sequelize"
import axios from "axios"
import { AttendanceService } from "./attendance.service"
import type {
  CreateStudentPerformanceDto,
  UpdateStudentPerformanceDto,
  GeneratePerformanceAnalysisDto,
  PerformanceFilterDto,
  ClassPerformanceAnalysisDto,
} from "../dto/student-performance.dto"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { Course } from "../models/Course"
import { CourseEnrollment } from "../models/CourseEnrollment" // Added import
import { QuizAttempt } from "../models/QuizAttempt"
import { Semester } from "../models/Semester"
import { StudentPerformance } from "../models/StudentPerformance"
import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"
import { Quiz } from "../models/Quiz" // Added import
import { Assessment } from "../models/Assessment" // Added import

export class StudentPerformanceService {
  private attendanceService: AttendanceService
  private openaiApiKey: string

  constructor() {
    this.attendanceService = new AttendanceService()
    this.openaiApiKey = process.env.OPENAI_API_KEY || ""
  }

  async findAll(filters?: PerformanceFilterDto) {
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
      if (filters.performanceCategory) {
        whereClause.performanceCategory = filters.performanceCategory
      }
      if (filters.minOverallPerformance !== undefined) {
        whereClause.overallPerformance = {
          ...whereClause.overallPerformance,
          [Op.gte]: filters.minOverallPerformance,
        }
      }
      if (filters.maxOverallPerformance !== undefined) {
        whereClause.overallPerformance = {
          ...whereClause.overallPerformance,
          [Op.lte]: filters.maxOverallPerformance,
        }
      }
    }

    return StudentPerformance.findAll({
      where: whereClause,
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
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
      order: [["lastUpdated", "DESC"]],
    })
  }

  async findById(id: string) {
    return StudentPerformance.findByPk(id, {
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
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
    })
  }

  async findByStudent(studentProfileId: string, courseId: string, semesterId: string) {
    return StudentPerformance.findOne({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
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
    })
  }

  async create(data: CreateStudentPerformanceDto) {
    // Check if performance record already exists
    const existingPerformance = await StudentPerformance.findOne({
      where: {
        studentProfileId: data.studentProfileId,
        courseId: data.courseId,
        semesterId: data.semesterId,
      },
    })

    if (existingPerformance) {
      // Update existing record
      return this.update(existingPerformance.id, {
        attendancePercentage: data.attendancePercentage,
        assignmentAverage: data.assignmentAverage,
        quizAverage: data.quizAverage,
        overallPerformance: data.overallPerformance,
        performanceCategory: data.performanceCategory,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,
        aiAnalysis: data.aiAnalysis,
      })
    }

    // Create new performance record
    return StudentPerformance.create({
      ...data,
      lastUpdated: new Date(),
    })
  }

  async update(id: string, data: UpdateStudentPerformanceDto) {
    const performance = await StudentPerformance.findByPk(id)
    if (!performance) {
      throw new Error("Student performance record not found")
    }

    await performance.update({
      ...data,
      lastUpdated: new Date(),
    })
    return this.findById(id)
  }

  async delete(id: string) {
    const performance = await StudentPerformance.findByPk(id)
    if (!performance) {
      throw new Error("Student performance record not found")
    }

    await performance.destroy()
    return { message: "Student performance record deleted successfully" }
  }

  // Analysis methods
  async generatePerformanceAnalysis(data: GeneratePerformanceAnalysisDto) {
    const { studentProfileId, courseId, semesterId } = data

    // Get student data
    const student = await StudentProfile.findByPk(studentProfileId, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    })

    if (!student) {
      throw new Error("Student not found")
    }

    // Get course data
    const course = await Course.findByPk(courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    // Get attendance statistics
    const attendanceStats = await this.attendanceService.getAttendanceStatistics({
      courseId,
      semesterId,
      studentProfileId,
    })

    // Get assignment performance
    const assignmentPerformance = await this.getAssignmentPerformance(studentProfileId, courseId, semesterId)

    // Get quiz performance
    const quizPerformance = await this.getQuizPerformance(studentProfileId, courseId, semesterId)

    // Calculate overall performance
    const attendanceWeight = 0.3
    const assignmentWeight = 0.4
    const quizWeight = 0.3

    const overallPerformance =
      attendanceStats.attendancePercentage * attendanceWeight +
      assignmentPerformance.averageScore * assignmentWeight +
      quizPerformance.averageScore * quizWeight

    // Determine performance category
    let performanceCategory: "excellent" | "good" | "average" | "below_average" | "poor" = "average"
    if (overallPerformance >= 90) {
      performanceCategory = "excellent"
    } else if (overallPerformance >= 80) {
      performanceCategory = "good"
    } else if (overallPerformance >= 70) {
      performanceCategory = "average"
    } else if (overallPerformance >= 60) {
      performanceCategory = "below_average"
    } else {
      performanceCategory = "poor"
    }

    // Generate AI analysis
    let strengths = ""
    let weaknesses = ""
    let recommendations = ""
    let aiAnalysis = {}

    interface AnalysisResult {
      strengths: string
      weaknesses: string
      recommendations: string
      fullAnalysis: Record<string, any>
    }

    try {
      const analysisResult = (await this.generateAIAnalysis({
        studentName: `${student.user?.firstName} ${student.user?.lastName}`,
        courseName: course.name,
        attendancePercentage: attendanceStats.attendancePercentage,
        assignmentAverage: assignmentPerformance.averageScore,
        quizAverage: quizPerformance.averageScore,
        overallPerformance,
        performanceCategory,
        assignmentDetails: assignmentPerformance.assignments,
        quizDetails: quizPerformance.quizzes,
      })) as AnalysisResult

      strengths = analysisResult.strengths
      weaknesses = analysisResult.weaknesses
      recommendations = analysisResult.recommendations
      aiAnalysis = analysisResult.fullAnalysis
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      // Provide default analysis if AI fails
      strengths = this.generateDefaultStrengths(
        attendanceStats.attendancePercentage,
        assignmentPerformance.averageScore,
        quizPerformance.averageScore,
      )
      weaknesses = this.generateDefaultWeaknesses(
        attendanceStats.attendancePercentage,
        assignmentPerformance.averageScore,
        quizPerformance.averageScore,
      )
      recommendations = this.generateDefaultRecommendations(
        attendanceStats.attendancePercentage,
        assignmentPerformance.averageScore,
        quizPerformance.averageScore,
      )
      aiAnalysis = {
        error: "AI analysis generation failed",
        attendanceStats,
        assignmentPerformance,
        quizPerformance,
      }
    }

    // Create or update performance record
    return this.create({
      studentProfileId,
      courseId,
      semesterId,
      attendancePercentage: attendanceStats.attendancePercentage,
      assignmentAverage: assignmentPerformance.averageScore,
      quizAverage: quizPerformance.averageScore,
      overallPerformance,
      performanceCategory,
      strengths,
      weaknesses,
      recommendations,
      aiAnalysis,
    })
  }

  async generateClassPerformanceAnalysis(data: ClassPerformanceAnalysisDto) {
    const { courseId, semesterId } = data

    // Get all students enrolled in the course - FIXED: using imports instead of require
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
      include: [
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

    // Generate performance analysis for each student
    const studentAnalyses = []
    for (const enrollment of enrollments) {
      try {
        const analysis = await this.generatePerformanceAnalysis({
          studentProfileId: enrollment.studentProfileId,
          courseId,
          semesterId,
        })
        studentAnalyses.push(analysis)
      } catch (error) {
        console.error(`Error generating analysis for student ${enrollment.studentProfileId}:`, error)
      }
    }

    // Calculate class averages
    const attendanceAverage =
      studentAnalyses.length > 0
        ? studentAnalyses
            .filter((analysis): analysis is NonNullable<typeof analysis> => analysis !== null)
            .reduce((sum, analysis) => sum + analysis.attendancePercentage, 0) / studentAnalyses.length
        : 0
    const validAnalyses = studentAnalyses.filter(
      (analysis): analysis is NonNullable<typeof analysis> => analysis !== null,
    )
    const assignmentAverage =
      validAnalyses.length > 0
        ? validAnalyses.reduce((sum, analysis) => sum + analysis.assignmentAverage, 0) / validAnalyses.length
        : 0
    const quizAverage =
      validAnalyses.length > 0
        ? validAnalyses.reduce((sum, analysis) => sum + analysis.quizAverage, 0) / validAnalyses.length
        : 0
    const overallAverage =
      validAnalyses.length > 0
        ? validAnalyses.reduce((sum, analysis) => sum + analysis.overallPerformance, 0) / validAnalyses.length
        : 0

    // Count students in each performance category
    const categoryCounts = {
      excellent: studentAnalyses.filter(
        (a): a is NonNullable<typeof a> => a !== null && a.performanceCategory === "excellent",
      ).length,
      good: studentAnalyses.filter((a): a is NonNullable<typeof a> => a !== null && a.performanceCategory === "good")
        .length,
      average: studentAnalyses.filter(
        (a): a is NonNullable<typeof a> => a !== null && a.performanceCategory === "average",
      ).length,
      below_average: studentAnalyses.filter(
        (a): a is NonNullable<typeof a> => a !== null && a.performanceCategory === "below_average",
      ).length,
      poor: studentAnalyses.filter((a): a is NonNullable<typeof a> => a !== null && a.performanceCategory === "poor")
        .length,
    }

    // Generate class-level recommendations
    let classRecommendations = ""
    try {
      classRecommendations = await this.generateClassRecommendations({
        courseName: (await Course.findByPk(courseId))?.name || "the course",
        attendanceAverage,
        assignmentAverage,
        quizAverage,
        overallAverage,
        categoryCounts,
        totalStudents: studentAnalyses.length,
      })
    } catch (error) {
      console.error("Error generating class recommendations:", error)
      classRecommendations = this.generateDefaultClassRecommendations(
        attendanceAverage,
        assignmentAverage,
        quizAverage,
        overallAverage,
      )
    }

    return {
      courseId,
      semesterId,
      totalStudents: studentAnalyses.length,
      attendanceAverage,
      assignmentAverage,
      quizAverage,
      overallAverage,
      categoryCounts,
      classRecommendations,
      studentAnalyses,
    }
  }

  // Add the missing method for lecturer dashboard controller
  async getCoursePerformanceAnalytics(courseId: string, semesterId: string) {
    // This is a wrapper around generateClassPerformanceAnalysis
    return this.generateClassPerformanceAnalysis({
      courseId,
      semesterId,
    })
  }

  // Helper methods
  private async getAssignmentPerformance(studentProfileId: string, courseId: string, semesterId: string) {
    // FIXED: using imports instead of require
    const submissions = await AssessmentSubmission.findAll({
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
      where: {
        studentProfileId,
        isGraded: true,
      },
    })

    const totalSubmissions = submissions.length
    const totalMarks = submissions.reduce((sum, submission) => {
      const assessment = submission.assessment
      return sum + (assessment ? assessment.totalMarks : 0)
    }, 0)
    const earnedMarks = submissions.reduce((sum, submission) => sum + (submission.marks || 0), 0)
    const averageScore = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0

    return {
      totalSubmissions,
      totalMarks,
      earnedMarks,
      averageScore,
      assignments: submissions.map((submission) => ({
        assessmentId: submission.assessmentId,
        assessmentTitle: submission.assessment?.title,
        marks: submission.marks,
        totalMarks: submission.assessment?.totalMarks,
        submissionDate: submission.createdAt,
        feedback: submission.feedback,
      })),
    }
  }

  private async getQuizPerformance(studentProfileId: string, courseId: string, semesterId: string) {
    // FIXED: using imports instead of require
    const attempts = await QuizAttempt.findAll({
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
      where: {
        studentProfileId,
        status: {
          [Op.in]: ["completed", "submitted"],
        },
      },
    })

    const totalAttempts = attempts.length
    const totalMarks = attempts.reduce((sum, attempt) => {
      const quiz = attempt.quiz
      return sum + (quiz ? quiz.totalMarks : 0)
    }, 0)
    const earnedMarks = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0)
    const averageScore = totalMarks > 0 ? (earnedMarks / totalMarks) * 100 : 0

    return {
      totalAttempts,
      totalMarks,
      earnedMarks,
      averageScore,
      quizzes: attempts.map((attempt) => ({
        quizId: attempt.quizId,
        quizTitle: attempt.quiz?.title,
        score: attempt.score,
        totalMarks: attempt.quiz?.totalMarks,
        isPassed: attempt.isPassed,
        attemptDate: attempt.startTime,
      })),
    }
  }

  private async generateAIAnalysis(data: any) {
    try {
      if (!this.openaiApiKey) {
        // Return default analysis if no API key is available
        return {
          strengths: this.generateDefaultStrengths(data.attendancePercentage, data.assignmentAverage, data.quizAverage),
          weaknesses: this.generateDefaultWeaknesses(
            data.attendancePercentage,
            data.assignmentAverage,
            data.quizAverage,
          ),
          recommendations: this.generateDefaultRecommendations(
            data.attendancePercentage,
            data.assignmentAverage,
            data.quizAverage,
          ),
          fullAnalysis: data,
        }
      }

      // Prepare the prompt for OpenAI
      const prompt = `
        Analyze the academic performance of student ${data.studentName} in ${data.courseName}.
        
        Performance metrics:
        - Attendance: ${data.attendancePercentage.toFixed(2)}%
        - Assignment Average: ${data.assignmentAverage.toFixed(2)}%
        - Quiz Average: ${data.quizAverage.toFixed(2)}%
        - Overall Performance: ${data.overallPerformance.toFixed(2)}%
        - Performance Category: ${data.performanceCategory}
        
        Assignment Details:
        ${JSON.stringify(data.assignmentDetails, null, 2)}
        
        Quiz Details:
        ${JSON.stringify(data.quizDetails, null, 2)}
        
        Please provide:
        1. A list of the student's academic strengths
        2. A list of areas where the student needs improvement
        3. Specific recommendations for improvement
        
        Format your response as a JSON object with the following structure:
        {
          "strengths": "Detailed analysis of strengths",
          "weaknesses": "Detailed analysis of weaknesses",
          "recommendations": "Specific recommendations for improvement",
          "fullAnalysis": {
            // Additional detailed analysis
          }
        }
      `

      // Call OpenAI API
      const response = await axios.post(
        "https://api.deepinfra.com/v1/openai/chat/completions",
        {
          model: "Qwen/Qwen3-30B-A3B",
          messages: [
            {
              role: "system",
              content:
                "You are an educational analytics AI that provides detailed analysis of student performance. Provide your analysis in JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Parse the response
      const content = response.data.choices[0].message.content
      let analysis = {}

      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        analysis = JSON.parse(jsonString)
      } catch (error) {
        console.error("Error parsing OpenAI response:", error)
        return {
          strengths: this.generateDefaultStrengths(data.attendancePercentage, data.assignmentAverage, data.quizAverage),
          weaknesses: this.generateDefaultWeaknesses(
            data.attendancePercentage,
            data.assignmentAverage,
            data.quizAverage,
          ),
          recommendations: this.generateDefaultRecommendations(
            data.attendancePercentage,
            data.assignmentAverage,
            data.quizAverage,
          ),
          fullAnalysis: data,
        }
      }

      return analysis
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      return {
        strengths: this.generateDefaultStrengths(data.attendancePercentage, data.assignmentAverage, data.quizAverage),
        weaknesses: this.generateDefaultWeaknesses(data.attendancePercentage, data.assignmentAverage, data.quizAverage),
        recommendations: this.generateDefaultRecommendations(
          data.attendancePercentage,
          data.assignmentAverage,
          data.quizAverage,
        ),
        fullAnalysis: data,
      }
    }
  }

  private async generateClassRecommendations(data: any) {
    try {
      if (!this.openaiApiKey) {
        // Return default recommendations if no API key is available
        return this.generateDefaultClassRecommendations(
          data.attendanceAverage,
          data.assignmentAverage,
          data.quizAverage,
          data.overallAverage,
        )
      }

      // Prepare the prompt for OpenAI
      const prompt = `
        Analyze the class performance for ${data.courseName}.
        
        Class metrics:
        - Total Students: ${data.totalStudents}
        - Average Attendance: ${data.attendanceAverage.toFixed(2)}%
        - Average Assignment Score: ${data.assignmentAverage.toFixed(2)}%
        - Average Quiz Score: ${data.quizAverage.toFixed(2)}%
        - Overall Average Performance: ${data.overallAverage.toFixed(2)}%
        
        Performance Categories:
        - Excellent: ${data.categoryCounts.excellent} students
        - Good: ${data.categoryCounts.good} students
        - Average: ${data.categoryCounts.average} students
        - Below Average: ${data.categoryCounts.below_average} students
        - Poor: ${data.categoryCounts.poor} students
        
        Please provide specific recommendations for improving the overall class performance. Consider teaching strategies, content delivery methods, assessment approaches, and student engagement techniques.
      `

      // Call OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an educational analytics AI that provides detailed recommendations for improving class performance.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Return the response
      return response.data.choices[0].message.content
    } catch (error) {
      console.error("Error generating class recommendations:", error)
      return this.generateDefaultClassRecommendations(
        data.attendanceAverage,
        data.assignmentAverage,
        data.quizAverage,
        data.overallAverage,
      )
    }
  }

  private generateDefaultStrengths(
    attendancePercentage: number,
    assignmentAverage: number,
    quizAverage: number,
  ): string {
    const strengths = []

    if (attendancePercentage >= 80) {
      strengths.push("Consistent class attendance")
    }
    if (assignmentAverage >= 80) {
      strengths.push("Strong performance on assignments")
    }
    if (quizAverage >= 80) {
      strengths.push("Good quiz performance")
    }

    if (strengths.length === 0) {
      strengths.push("No specific strengths identified")
    }

    return strengths.join(". ") + "."
  }

  private generateDefaultWeaknesses(
    attendancePercentage: number,
    assignmentAverage: number,
    quizAverage: number,
  ): string {
    const weaknesses = []

    if (attendancePercentage < 70) {
      weaknesses.push("Inconsistent class attendance")
    }
    if (assignmentAverage < 70) {
      weaknesses.push("Difficulty with assignments")
    }
    if (quizAverage < 70) {
      weaknesses.push("Struggles with quizzes")
    }

    if (weaknesses.length === 0) {
      weaknesses.push("No significant weaknesses identified")
    }

    return weaknesses.join(". ") + "."
  }

  private generateDefaultRecommendations(
    attendancePercentage: number,
    assignmentAverage: number,
    quizAverage: number,
  ): string {
    const recommendations = []

    if (attendancePercentage < 70) {
      recommendations.push("Improve class attendance to better understand course material")
    }
    if (assignmentAverage < 70) {
      recommendations.push("Seek additional help with assignments, possibly through tutoring or study groups")
    }
    if (quizAverage < 70) {
      recommendations.push("Develop better study strategies for quizzes, such as regular review sessions")
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue with current study habits to maintain performance")
    }

    return recommendations.join(". ") + "."
  }

  private generateDefaultClassRecommendations(
    attendanceAverage: number,
    assignmentAverage: number,
    quizAverage: number,
    overallAverage: number,
  ): string {
    const recommendations = []

    if (attendanceAverage < 70) {
      recommendations.push(
        "Implement strategies to improve attendance, such as participation grades or more engaging class activities",
      )
    }
    if (assignmentAverage < 70) {
      recommendations.push(
        "Review assignment structure and difficulty. Consider providing more examples or breaking complex assignments into smaller parts",
      )
    }
    if (quizAverage < 70) {
      recommendations.push(
        "Adjust quiz format or provide more review materials. Consider implementing practice quizzes or study guides",
      )
    }
    if (overallAverage < 70) {
      recommendations.push(
        "Review overall teaching approach and consider implementing more active learning strategies or additional support resources",
      )
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Continue with current teaching strategies while looking for opportunities to further engage students",
      )
    }

    return recommendations.join(". ") + "."
  }
}