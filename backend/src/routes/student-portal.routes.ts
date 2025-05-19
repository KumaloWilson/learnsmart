import { Router } from "express"
import multer from "multer"
import { StudentPortalController } from "../controllers/student-portal.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, aiRecommendationValidation, studentPortalValidation } from "../middlewares/validation.middleware"

const router = Router()
const studentPortalController = new StudentPortalController()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for submissions
  },
})

// Dashboard
router.get("/:studentId/dashboard", authMiddleware, studentPortalController.getDashboard)

// Courses
router.get("/:studentId/courses/semester/:semesterId", authMiddleware, studentPortalController.getEnrolledCourses)
router.get("/:studentId/course/:courseId/semester/:semesterId", authMiddleware, studentPortalController.getCourseDetails)

// Assessments
router.get("/:studentId/assessments", authMiddleware, studentPortalController.getAssessments)
router.get("/:studentId/assessment/:assessmentId", authMiddleware, studentPortalController.getAssessmentById)
router.post(
  "/:studentId/assessment/:assessmentId/submit",
  [authMiddleware, upload.single("file"), validate(studentPortalValidation.submitAssessment)],
  studentPortalController.submitAssessment,
)

// Virtual Classes
router.get("/:studentId/virtual-classes", authMiddleware, studentPortalController.getVirtualClasses)
router.post(
  "/:studentId/virtual-class/join",
  [authMiddleware, validate(studentPortalValidation.joinVirtualClass)],
  studentPortalController.joinVirtualClass,
)

// Materials
router.get("/:studentId/materials", authMiddleware, studentPortalController.getMaterials)

// Performance
router.get("/:studentId/performance/course/:courseId/semester/:semesterId", authMiddleware, studentPortalController.getPerformance)

// Attendance
router.get("/:studentId/attendance", authMiddleware, studentPortalController.getAttendance)

// Academic Records
router.get("/:studentId/academic-records", authMiddleware, studentPortalController.getAcademicRecords)

// Quiz Attempts
router.post(
  "/:studentId/quiz/attempt",
  [authMiddleware, validate(studentPortalValidation.attemptQuiz)],
  studentPortalController.attemptQuiz,
)

router.get("/:studentId/quiz/attempts", authMiddleware, studentPortalController.getQuizAttempts)


// Course Topics
router.get("/:studentId/course-topics/course/:courseId/semester/:semesterId", authMiddleware, studentPortalController.getCourseTopics)
// router.post(
//   "/:studentId/mark-topic-completed/:courseTopicId",
//   authMiddleware,
//   studentPortalController.markTopicCompleted,
// )

//router.get("/:studentId/course-mastery", authMiddleware, studentPortalController.getCourseMastery)

// AI Recommendation routes
router.get("/:studentId/recommendations", authMiddleware, studentPortalController.getRecommendations)

router.post(
  "/:studentId/generate-recommendations",
  [authMiddleware, validate(aiRecommendationValidation.generateRecommendations)],
  studentPortalController.generateRecommendations,
)

router.put(
  "/recommendations/:recommendationId/mark",
  [authMiddleware, validate(aiRecommendationValidation.markRecommendation)],
  studentPortalController.markRecommendation,
)

router.post(
  "/recommendations/feedback",
  [authMiddleware, validate(aiRecommendationValidation.provideFeedback)],
  studentPortalController.provideFeedback,
)

router.post(
  "/:studentId/record-interaction",
  [authMiddleware, validate(aiRecommendationValidation.recordInteraction)],
  studentPortalController.recordInteraction,
)

export default router
