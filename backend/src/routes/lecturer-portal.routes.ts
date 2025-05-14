import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, courseTopicValidation } from "../middlewares/validation.middleware"
import { LecturerPortalController } from "../controllers/lecturer-portal-controller"

const router = Router()
const lecturerPortalController = new LecturerPortalController()

// Course Topics Management
router.get("/course-topics/:courseId/:semesterId", authMiddleware, lecturerPortalController.getCourseTopics)
router.get("/course-topic/:id", authMiddleware, lecturerPortalController.getCourseTopic)
router.post(
  "/course-topic",
  [authMiddleware, validate(courseTopicValidation.createCourseTopic)],
  lecturerPortalController.createCourseTopic,
)
router.put(
  "/course-topic/:id",
  [authMiddleware, validate(courseTopicValidation.updateCourseTopic)],
  lecturerPortalController.updateCourseTopic,
)
router.delete("/course-topic/:id", authMiddleware, lecturerPortalController.deleteCourseTopic)
router.post(
  "/reorder-topics/:courseId/:semesterId",
  [authMiddleware, validate(courseTopicValidation.reorderTopics)],
  lecturerPortalController.reorderCourseTopics,
)

// Topic Progress Management
router.get(
  "/topic-progress-statistics/:courseId/:semesterId",
  authMiddleware,
  lecturerPortalController.getTopicProgressStatistics,
)
router.get(
  "/student-topic-progress/:studentProfileId/:courseId/:semesterId",
  authMiddleware,
  lecturerPortalController.getStudentTopicProgress,
)

// Course Mastery Management
router.get(
  "/course-mastery-distribution/:courseId/:semesterId",
  authMiddleware,
  lecturerPortalController.getCourseMasteryDistribution,
)
router.get(
  "/course-student-masteries/:courseId/:semesterId",
  authMiddleware,
  lecturerPortalController.getCourseStudentMasteries,
)
router.get(
  "/course-mastery-statistics/:courseId/:semesterId",
  authMiddleware,
  lecturerPortalController.getCourseMasteryStatistics,
)

// Teaching Materials for Topics
router.get("/topic-teaching-materials/:topicId", authMiddleware, lecturerPortalController.getTopicTeachingMaterials)
router.get("/topic-learning-resources/:topicId", authMiddleware, lecturerPortalController.getTopicLearningResources)

export default router
