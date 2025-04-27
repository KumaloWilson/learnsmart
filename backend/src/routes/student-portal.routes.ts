import { Router } from "express"
import multer from "multer"
import { StudentPortalController } from "../controllers/student-portal.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, aiRecommendationValidation } from "../middlewares/validation.middleware"

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

// Existing routes...

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
