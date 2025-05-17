import type { Request, Response } from "express"
import { LecturerDashboardService } from "../services/lecturer-dashboard.service"
import { AtRiskStudentService } from "../services/at-risk-student.service"
import { CourseTopicService } from "../services/course-topic.service"
import { CourseMasteryService } from "../services/course-mastery.service"
import { AttendanceService } from "../services/attendance.service"
import { StudentPerformanceService } from "../services/student-performance.service"
import { VirtualClassService } from "../services/virtual-class.service"

export class LecturerDashboardController {
  private lecturerDashboardService: LecturerDashboardService
  private atRiskStudentService: AtRiskStudentService
  private courseTopicService: CourseTopicService
  private courseMasteryService: CourseMasteryService
  private attendanceService: AttendanceService
  private studentPerformanceService: StudentPerformanceService
  private virtualClassService: VirtualClassService

  constructor() {
    this.lecturerDashboardService = new LecturerDashboardService()
    this.atRiskStudentService = new AtRiskStudentService()
    this.courseTopicService = new CourseTopicService()
    this.courseMasteryService = new CourseMasteryService()
    this.attendanceService = new AttendanceService()
    this.studentPerformanceService = new StudentPerformanceService()
    this.virtualClassService = new VirtualClassService()
  }

  getDashboardOverview = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId } = req.params
      const { startDate, endDate, includeAttendance, includePerformance, includeQuizzes, includeAssessments } =
        req.query

      const dashboardData = await this.lecturerDashboardService.getDashboardOverview(lecturerProfileId, {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        includeAttendance: includeAttendance === "true",
        includePerformance: includePerformance === "true",
        includeQuizzes: includeQuizzes === "true",
        includeAssessments: includeAssessments === "true",
      })

      return res.status(200).json({
        success: true,
        data: dashboardData,
      })
    } catch (error) {
      console.error("Error getting lecturer dashboard overview:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve lecturer dashboard overview",
        error: error,
      })
    }
  }

  getLecturerCourses = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId } = req.params
      const courses = await this.lecturerDashboardService.getLecturerCourses(lecturerProfileId)

      return res.status(200).json({
        success: true,
        data: courses,
      })
    } catch (error) {
      console.error("Error getting lecturer courses:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve lecturer courses",
        error: error,
      })
    }
  }

  getLecturerCourseDetails = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId, courseId, semesterId } = req.params
      const course = await this.lecturerDashboardService.getLecturerCourseDetails(lecturerProfileId, courseId, semesterId )

      return res.status(200).json({
        success: true,
        data: course,
      })
    } catch (error) {
      console.error("Error getting lecturer course:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve lecturer course details",
        error: error,
      })
    }
  }

  getAtRiskStudents = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId } = req.params
      const atRiskStudents = await this.atRiskStudentService.getAtRiskStudentsByLecturer(lecturerProfileId)

      return res.status(200).json({
        success: true,
        data: atRiskStudents,
      })
    } catch (error) {
      console.error("Error getting at-risk students:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve at-risk students",
        error: error,
      })
    }
  }

  identifyAtRiskStudents = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId, courseId, semesterId } = req.params
      const { attendanceThreshold, performanceThreshold, engagementThreshold } = req.body

      const atRiskStudents = await this.atRiskStudentService.identifyAtRiskStudents(
        courseId,
        semesterId,
        {
          attendanceThreshold,
          performanceThreshold
        }
      )

      return res.status(200).json({
        success: true,
        data: atRiskStudents,
        message: "At-risk students identified successfully",
      })
    } catch (error) {
      console.error("Error identifying at-risk students:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to identify at-risk students",
        error: error,
      })
    }
  }

  getCourseTopicProgress = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const topicProgress = await this.courseTopicService.getCourseTopicProgress(courseId, semesterId)

      return res.status(200).json({
        success: true,
        data: topicProgress,
      })
    } catch (error) {
      console.error("Error getting course topic progress:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve course topic progress",
        error: error,
      })
    }
  }

  getCourseMasteryDistribution = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const masteryDistribution = await this.courseMasteryService.getCourseMasteryDistribution(courseId, semesterId)

      return res.status(200).json({
        success: true,
        data: masteryDistribution,
      })
    } catch (error) {
      console.error("Error getting course mastery distribution:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve course mastery distribution",
        error: error,
      })
    }
  }

  getAttendanceOverview = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const attendanceOverview = await this.attendanceService.getAttendanceStatistics({
        courseId,
        semesterId,
      })

      return res.status(200).json({
        success: true,
        data: attendanceOverview,
      })
    } catch (error) {
      console.error("Error getting attendance overview:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve attendance overview",
        error: error,
      })
    }
  }

  getPerformanceOverview = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const performanceOverview = await this.studentPerformanceService.getCoursePerformanceAnalytics(
        courseId,
        semesterId,
      )

      return res.status(200).json({
        success: true,
        data: performanceOverview,
      })
    } catch (error) {
      console.error("Error getting performance overview:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve performance overview",
        error: error,
      })
    }
  }

  getStudentEngagement = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const studentEngagement = await this.lecturerDashboardService.getStudentEngagement(courseId, semesterId)

      return res.status(200).json({
        success: true,
        data: studentEngagement,
      })
    } catch (error) {
      console.error("Error getting student engagement:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve student engagement",
        error: error,
      })
    }
  }

  getTeachingMaterials = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const teachingMaterials = await this.lecturerDashboardService.getTeachingMaterials(courseId, semesterId)

      return res.status(200).json({
        success: true,
        data: teachingMaterials,
      })
    } catch (error) {
      console.error("Error getting teaching materials:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve teaching materials",
        error: error,
      })
    }
  }

  getUpcomingClasses = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId } = req.params
      const upcomingClasses = await this.virtualClassService.findUpcoming(lecturerProfileId, 10)

      return res.status(200).json({
        success: true,
        data: upcomingClasses,
      })
    } catch (error) {
      console.error("Error getting upcoming classes:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve upcoming classes",
        error: error,
      })
    }
  }

  getCoursePerformanceAnalytics = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params

      const analysis = await this.studentPerformanceService.generateClassPerformanceAnalysis({
        courseId,
        semesterId,
      })

      return res.status(200).json({
        success: true,
        data: analysis,
      })
    } catch (error) {
      console.error("Error getting course performance analytics:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve course performance analytics",
        error: error,
      })
    }
  }
}
