import express from "express"
import { LecturerDashboardController } from "../controllers/lecturer-dashboard.controller"
import { validate, validateParams, validateQuery } from "../middlewares/validation.middleware"
import Joi from "joi"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = express.Router()
const lecturerDashboardController = new LecturerDashboardController()

// Validation schemas
const lecturerIdParam = Joi.object({
  lecturerProfileId: Joi.string().uuid().required(),
})

const courseAndSemesterParams = Joi.object({
  lecturerProfileId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
})

const dashboardQuerySchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  includeAttendance: Joi.boolean().default(true),
  includePerformance: Joi.boolean().default(true),
  includeQuizzes: Joi.boolean().default(true),
  includeAssessments: Joi.boolean().default(true),
})

// Routes
router.get(
  "/:lecturerProfileId",
  authMiddleware,
  validateParams(lecturerIdParam),
  validateQuery(dashboardQuerySchema),
  lecturerDashboardController.getDashboardOverview,
)

router.get(
  "/:lecturerProfileId/courses",
  authMiddleware,
  validateParams(lecturerIdParam),
  lecturerDashboardController.getLecturerCourses,
)

router.get(
  "/:lecturerProfileId/at-risk-students",
  authMiddleware,
  validateParams(lecturerIdParam),
  lecturerDashboardController.getAtRiskStudents,
)

router.post(
  "/:lecturerProfileId/identify-at-risk/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  validate(
    Joi.object({
      attendanceThreshold: Joi.number().min(0).max(100).default(70),
      performanceThreshold: Joi.number().min(0).max(100).default(60),
      engagementThreshold: Joi.number().min(0).max(100).default(50),
    }),
  ),
  lecturerDashboardController.identifyAtRiskStudents,
)

router.get(
  "/:lecturerProfileId/course-topic-progress/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getCourseTopicProgress,
)

router.get(
  "/:lecturerProfileId/course-mastery-distribution/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getCourseMasteryDistribution,
)

router.get(
  "/:lecturerProfileId/attendance-overview/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getAttendanceOverview,
)

router.get(
  "/:lecturerProfileId/performance-overview/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getPerformanceOverview,
)

router.get(
  "/:lecturerProfileId/student-engagement/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getStudentEngagement,
)

router.get(
  "/:lecturerProfileId/teaching-materials/:courseId/:semesterId",
  authMiddleware,
  validateParams(courseAndSemesterParams),
  lecturerDashboardController.getTeachingMaterials,
)

router.get(
  "/:lecturerProfileId/upcoming-classes",
  authMiddleware,
  validateParams(lecturerIdParam),
  lecturerDashboardController.getUpcomingClasses,
)

router.get(
  "/course/:courseId/semester/:semesterId/performance-analytics",
  authMiddleware,
  validateParams(
    Joi.object({
      courseId: Joi.string().uuid().required(),
      semesterId: Joi.string().uuid().required(),
    }),
  ),
  lecturerDashboardController.getCoursePerformanceAnalytics,
)

export default router
