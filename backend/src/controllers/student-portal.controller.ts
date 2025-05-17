import type { Request, Response } from "express"
import { StudentPortalService } from "../services/student-portal.service"
import { StorageService } from "../services/storage.service"
import { AIRecommendationService } from "../services/ai-recommendation.service"
import type {
  StudentAssessmentSubmissionDto,
  JoinVirtualClassDto,
  StudentQuizAttemptDto,
  StudentDashboardFilterDto,
} from "../dto/student-portal.dto"
import { QuizService } from "../services/quiz.service"
import { SubmitQuizAttemptDto } from "../dto/quiz.dto"
import { CourseTopicService } from "../services/course-topic.service"

export class StudentPortalController {
  private studentPortalService: StudentPortalService
  private storageService: StorageService
  private quizService: QuizService
  private courseTopicService: CourseTopicService
  private aiRecommendationService: AIRecommendationService

  constructor() {
    this.studentPortalService = new StudentPortalService()
    this.storageService = new StorageService()
    this.aiRecommendationService = new AIRecommendationService()
  }

  // Dashboard
  getDashboard = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const filters: StudentDashboardFilterDto = {}

      if (req.query.courseId) {
        filters.courseId = req.query.courseId as string
      }

      if (req.query.semesterId) {
        filters.semesterId = req.query.semesterId as string
      }

      const dashboard = await this.studentPortalService.getStudentDashboard(studentId, filters)
      return res.status(200).json(dashboard)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching dashboard", error: error.message })
    }
  }

  // Courses
  getEnrolledCourses = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { semesterId } = req.query

      const courses = await this.studentPortalService.getEnrolledCourses(studentId, semesterId as string | undefined)
      return res.status(200).json(courses)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching enrolled courses", error: error.message })
    }
  }

  getCourseDetails = async (req: Request, res: Response) => {
    try {
      const { studentId, courseId, semesterId } = req.params

      const courseDetails = await this.studentPortalService.getCourseDetails(courseId, semesterId, studentId)
      return res.status(200).json(courseDetails)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching course details", error: error.message })
    }
  }

  // Assessments
  getAssessments = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId } = req.query

      const assessments = await this.studentPortalService.getAssessments(
        studentId,
        courseId as string | undefined,
        semesterId as string | undefined,
      )
      return res.status(200).json(assessments)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching assessments", error: error.message })
    }
  }

  getAssessmentById = async (req: Request, res: Response) => {
    try {
      const { studentId, assessmentId } = req.params

      const assessment = await this.studentPortalService.getAssessmentById(assessmentId, studentId)
      return res.status(200).json(assessment)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching assessment", error: error.message })
    }
  }

  submitAssessment = async (req: Request, res: Response) => {
    try {
      const data: StudentAssessmentSubmissionDto = {
        ...req.body,
        studentProfileId: req.params.studentId,
      }

      // Handle file upload if present
      if (req.file) {
        const fileUrl = await this.storageService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
        data.fileUrl = fileUrl
        data.fileName = req.file.originalname
        data.fileType = req.file.mimetype
        data.fileSize = req.file.size
      }

      const submission = await this.studentPortalService.submitAssessment(data)
      return res.status(201).json(submission)
    } catch (error: any) {
      return res.status(500).json({ message: "Error submitting assessment", error: error.message })
    }
  }

  // Virtual Classes
  getVirtualClasses = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId } = req.query

      const virtualClasses = await this.studentPortalService.getVirtualClasses(
        studentId,
        courseId as string | undefined,
        semesterId as string | undefined,
      )
      return res.status(200).json(virtualClasses)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching virtual classes", error: error.message })
    }
  }

  joinVirtualClass = async (req: Request, res: Response) => {
    try {
      const data: JoinVirtualClassDto = {
        ...req.body,
        studentProfileId: req.params.studentId,
      }

      const attendance = await this.studentPortalService.joinVirtualClass(data)
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: "Error joining virtual class", error: error.message })
    }
  }

  // Materials
  getMaterials = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId, type } = req.query

      const materials = await this.studentPortalService.getMaterials(studentId, {
        courseId: courseId as string | undefined,
        semesterId: semesterId as string | undefined,
        type: type as string | undefined,
      })
      return res.status(200).json(materials)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching materials", error: error.message })
    }
  }

  // Performance
  getPerformance = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId, assessmentType } = req.query

      const performance = await this.studentPortalService.getPerformance(studentId, {
        courseId: courseId as string | undefined,
        semesterId: semesterId as string | undefined,
        assessmentType: assessmentType as string | undefined,
      })
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching performance", error: error.message })
    }
  }

  // Attendance
  getAttendance = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId, startDate, endDate } = req.query

      const attendance = await this.studentPortalService.getAttendance(studentId, {
        courseId: courseId as string | undefined,
        semesterId: semesterId as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      })
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching attendance", error: error.message })
    }
  }

  // Academic Records
  getAcademicRecords = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params

      const records = await this.studentPortalService.getAcademicRecords(studentId)
      return res.status(200).json(records)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching academic records", error: error.message })
    }
  }

  // Quiz Attempts
  attemptQuiz = async (req: Request, res: Response) => {
    try {
     const { id } = req.params
     const data: SubmitQuizAttemptDto = req.body

      const attempt = await this.quizService.submitQuizAttempt(id, data)
      return res.status(201).json(attempt)
    } catch (error: any) {
      return res.status(500).json({ message: "Error submitting quiz attempt", error: error.message })
    }
  }

  getQuizAttempts = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { isStudentID } = req.query

      const attempts = await this.quizService.getAttemptsByStudent(studentId, isStudentID === 'true')
      return res.status(200).json(attempts)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching quiz attempts", error: error.message })
    }
  }

  // getQuizAttemptDetails = async (req: Request, res: Response) => {
  //   try {
  //     const { studentId, attemptId } = req.params

  //     const attempt = await this.studentPortalService.getQuizAttemptDetails(attemptId, studentId)
  //     return res.status(200).json(attempt)
  //   } catch (error: any) {
  //     return res.status(500).json({ message: "Error fetching quiz attempt details", error: error.message })
  //   }
  // }

  // Course Topics
  getCourseTopics = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params

      const topics = await this.courseTopicService.getCourseTopics(courseId, semesterId)
      return res.status(200).json(topics)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching course topics", error: error.message })
    }
  }

  // markTopicCompleted = async (req: Request, res: Response) => {
  //   try {
  //     const { studentId, courseTopicId } = req.params
  //     const { timeSpentMinutes } = req.body

  //     const progress = await this.studentPortalService.markTopicCompleted(
  //       studentId,
  //       courseTopicId,
  //       timeSpentMinutes || 0,
  //     )
  //     return res.status(200).json(progress)
  //   } catch (error: any) {
  //     return res.status(500).json({ message: "Error marking topic as completed", error: error.message })
  //   }
  // }

  // getCourseMastery = async (req: Request, res: Response) => {
  //   try {
  //     const { studentId } = req.params
  //     const { courseId, semesterId } = req.query

  //     const mastery = await this.studentPortalService.getCourseMastery(
  //       studentId,
  //       courseId as string | undefined,
  //       semesterId as string | undefined,
  //     )
  //     return res.status(200).json(mastery)
  //   } catch (error: any) {
  //     return res.status(500).json({ message: "Error fetching course mastery", error: error.message })
  //   }
  // }

  // AI Recommendations
  getRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, limit, includeCompleted } = req.query

      const recommendations = await this.aiRecommendationService.getRecommendationsForStudent(
        studentId,
        courseId as string | undefined,
        Number(limit) || 10,
        includeCompleted === "true",
      )
      return res.status(200).json(recommendations)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching recommendations", error: error.message })
    }
  }

  generateRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, count, includeCompleted } = req.body

      const recommendations = await this.aiRecommendationService.generateRecommendations({
        studentProfileId: studentId,
        courseId,
        count: count || 5,
        includeCompleted: includeCompleted || false,
      })
      return res.status(200).json(recommendations)
    } catch (error: any) {
      return res.status(500).json({ message: "Error generating recommendations", error: error.message })
    }
  }

  markRecommendation = async (req: Request, res: Response) => {
    try {
      const { recommendationId } = req.params
      const { action } = req.body

      let result
      if (action === "view") {
        result = await this.aiRecommendationService.markRecommendationAsViewed(recommendationId)
      } else if (action === "save") {
        result = await this.aiRecommendationService.markRecommendationAsSaved(recommendationId)
      } else if (action === "complete") {
        result = await this.aiRecommendationService.markRecommendationAsCompleted(recommendationId)
      } else {
        return res.status(400).json({ message: "Invalid action" })
      }

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking recommendation", error: error.message })
    }
  }

  provideFeedback = async (req: Request, res: Response) => {
    try {
      const { recommendationId, isHelpful, feedback } = req.body

      const result = await this.aiRecommendationService.provideFeedback(recommendationId, isHelpful, feedback)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error providing feedback", error: error.message })
    }
  }

  recordInteraction = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { learningResourceId, interactionType, durationSeconds, rating, feedback, metadata } = req.body

      const interaction = await this.aiRecommendationService.recordResourceInteraction(
        studentId,
        learningResourceId,
        interactionType,
        durationSeconds,
        rating,
        feedback,
        metadata,
      )
      return res.status(201).json(interaction)
    } catch (error: any) {
      return res.status(500).json({ message: "Error recording interaction", error: error.message })
    }
  }
}
