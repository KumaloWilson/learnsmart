import { Router, Request, Response } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, courseTopicValidation } from "../middlewares/validation.middleware"
import { LecturerPortalController } from "../controllers/lecturer-portal-controller"

const router = Router()
const lecturerPortalController = new LecturerPortalController()

// Course Topics Management
router.get(
  "/course-topics/course/:courseId/semester/:semesterId", 
  authMiddleware, 
  (req: Request, res: Response) => lecturerPortalController.getCourseTopics(req, res)
)

router.get(
  "/course-topic/:id", 
  authMiddleware, 
  (req: Request, res: Response) => lecturerPortalController.getCourseTopic(req, res)
)

router.post(
  "/course-topic",
  [authMiddleware, validate(courseTopicValidation.createCourseTopic)],
  (req: Request, res: Response) => lecturerPortalController.createCourseTopic(req, res)
)

router.put(
  "/course-topic/:id",
  [authMiddleware, validate(courseTopicValidation.updateCourseTopic)],
  (req: Request, res: Response) => lecturerPortalController.updateCourseTopic(req, res)
)

router.delete(
  "/course-topic/:id", 
  authMiddleware, 
  (req: Request, res: Response) => lecturerPortalController.deleteCourseTopic(req, res)
)

router.post(
  "/reorder-topics/:courseId/:semesterId",
  [authMiddleware, validate(courseTopicValidation.reorderTopics)],
  (req: Request, res: Response) => lecturerPortalController.reorderCourseTopics(req, res)
)

// Topic Progress Management
router.get(
  "/topic-progress-statistics/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req: Request, res: Response) => lecturerPortalController.getTopicProgressStatistics(req, res)
)

router.get(
  "/student-topic-progress/studentProfile/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req: Request, res: Response) => lecturerPortalController.getStudentTopicProgress(req, res)
)

// Course Mastery Management
router.get(
  "/course-mastery-distribution/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req: Request, res: Response) => lecturerPortalController.getCourseMasteryDistribution(req, res)
)

router.get(
  "/course-student-masteries/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req: Request, res: Response) => lecturerPortalController.getCourseStudentMasteries(req, res)
)

router.get(
  "/course-mastery-statistics/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req: Request, res: Response) => lecturerPortalController.getCourseMasteryStatistics(req, res)
)

// Teaching Materials for Topics
router.get(
  "/topic-teaching-materials/topic/:topicId", 
  authMiddleware, 
  (req: Request, res: Response) => lecturerPortalController.getTopicTeachingMaterials(req, res)
)

router.get(
  "/topic-learning-resources/topic/:topicId", 
  authMiddleware, 
  (req: Request, res: Response) => lecturerPortalController.getTopicLearningResources(req, res)
)

export default router