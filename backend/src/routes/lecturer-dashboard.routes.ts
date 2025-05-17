import express from "express"
import { LecturerDashboardController } from "../controllers/lecturer-dashboard.controller"
import Joi from "joi"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = express.Router()
const lecturerDashboardController = new LecturerDashboardController()


// Routes
router.get(
  "/:lecturerProfileId",
  authMiddleware,
  lecturerDashboardController.getDashboardOverview,
)

router.get(
  "/:lecturerProfileId/courses",
  authMiddleware,
  lecturerDashboardController.getLecturerCourses,
)

router.get(
  "/:lecturerProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  lecturerDashboardController.getLecturerCourseDetails,
)

router.get(
  "/:lecturerProfileId/at-risk-students",
  authMiddleware,
  lecturerDashboardController.getAtRiskStudents,
)

router.post(
  "/:lecturerProfileId/identify-at-risk/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.identifyAtRiskStudents,
)

router.get(
  "/:lecturerProfileId/course-topic-progress/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getCourseTopicProgress,
)

router.get(
  "/:lecturerProfileId/course-mastery-distribution/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getCourseMasteryDistribution,
)

router.get(
  "/:lecturerProfileId/attendance-overview/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getAttendanceOverview,
)

router.get(
  "/:lecturerProfileId/performance-overview/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getPerformanceOverview,
)

router.get(
  "/:lecturerProfileId/student-engagement/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getStudentEngagement,
)

router.get(
  "/:lecturerProfileId/teaching-materials/:courseId/:semesterId",
  authMiddleware,
  lecturerDashboardController.getTeachingMaterials,
)

router.get(
  "/:lecturerProfileId/upcoming-classes",
  authMiddleware,
  lecturerDashboardController.getUpcomingClasses,
)

router.get(
  "/course/:courseId/semester/:semesterId/performance-analytics",
  authMiddleware,
  lecturerDashboardController.getCoursePerformanceAnalytics,
)

export default router
