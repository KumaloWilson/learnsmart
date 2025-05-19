import { Router } from "express"
import { AIRecommendationController } from "../controllers/ai-recommendation.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, aiRecommendationValidation } from "../middlewares/validation.middleware"

const router = Router()
const aiRecommendationController = new AIRecommendationController()

// Learning Resource routes
router.post(
  "/resources",
  [authMiddleware, validate(aiRecommendationValidation.createLearningResource)],
  aiRecommendationController.createLearningResource,
)

router.put(
  "/resources/:id",
  [authMiddleware, validate(aiRecommendationValidation.updateLearningResource)],
  aiRecommendationController.updateLearningResource,
)

router.delete("/resources/:id", authMiddleware, aiRecommendationController.deleteLearningResource)

router.get("/resources/:id", authMiddleware, aiRecommendationController.getLearningResourceById)

router.get("/resources", authMiddleware, aiRecommendationController.getLearningResources)

// Learning Recommendation routes
router.post(
  "/recommendations",
  [authMiddleware, validate(aiRecommendationValidation.createLearningRecommendation)],
  aiRecommendationController.createLearningRecommendation,
)

router.put(
  "/recommendations/:id",
  [authMiddleware, validate(aiRecommendationValidation.updateLearningRecommendation)],
  aiRecommendationController.updateLearningRecommendation,
)

router.delete("/recommendations/:id", authMiddleware, aiRecommendationController.deleteLearningRecommendation)

router.get("/recommendations/:id", authMiddleware, aiRecommendationController.getLearningRecommendationById)

router.get("/students/:studentId/recommendations", authMiddleware, aiRecommendationController.getStudentRecommendations)

// Resource Interaction routes
router.post(
  "/interactions",
  [authMiddleware, validate(aiRecommendationValidation.recordInteraction)],
  aiRecommendationController.recordInteraction,
)

router.get("/resources/:resourceId/interactions", authMiddleware, aiRecommendationController.getResourceInteractions)

router.get("/students/:studentId/interactions", authMiddleware, aiRecommendationController.getStudentInteractions)

// AI Recommendation Generation
router.post(
  "/generate-recommendations",
  [authMiddleware, validate(aiRecommendationValidation.generateRecommendations)],
  aiRecommendationController.generateRecommendations,
)

// Recommendation Feedback
router.post(
  "/feedback",
  [authMiddleware, validate(aiRecommendationValidation.provideFeedback)],
  aiRecommendationController.provideFeedback,
)

// Mark recommendation as viewed, saved, or completed
router.put(
  "/recommendations/:id/mark",
  [authMiddleware, validate(aiRecommendationValidation.markRecommendation)],
  aiRecommendationController.markRecommendation,
)

export default router
