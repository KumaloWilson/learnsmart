import type { Request, Response } from "express"
import { StudentPortalService } from "../services/student-portal.service"
import { StorageService } from "../services/storage.service"
import { AIRecommendationService } from "../services/ai-recommendation.service"

export class StudentPortalController {
  private studentPortalService: StudentPortalService
  private storageService: StorageService
  private aiRecommendationService: AIRecommendationService

  constructor() {
    this.studentPortalService = new StudentPortalService()
    this.storageService = new StorageService()
    this.aiRecommendationService = new AIRecommendationService()
  }

  // Existing methods...

  // AI Recommendation endpoints
  getRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId } = req.query

      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" })
      }

      const recommendations = await this.aiRecommendationService.getStudentRecommendations(
        studentId,
        courseId as string,
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

      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" })
      }

      const recommendations = await this.aiRecommendationService.generateRecommendations({
        studentProfileId: studentId,
        courseId,
        count: count ? Number.parseInt(count as string) : undefined,
        includeCompleted: includeCompleted === "true",
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

      if (!["view", "save", "complete"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'view', 'save', or 'complete'" })
      }

      const recommendation = await this.aiRecommendationService.markRecommendation(recommendationId, action)
      return res.status(200).json(recommendation)
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking recommendation", error: error.message })
    }
  }

  provideFeedback = async (req: Request, res: Response) => {
    try {
      const { recommendationId, isHelpful, feedback } = req.body

      const result = await this.aiRecommendationService.provideFeedback({
        recommendationId,
        isHelpful,
        feedback,
      })

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error providing feedback", error: error.message })
    }
  }

  recordInteraction = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { learningResourceId, interactionType, durationSeconds, rating, feedback, metadata } = req.body

      const interaction = await this.aiRecommendationService.recordInteraction({
        studentProfileId: studentId,
        learningResourceId,
        interactionType,
        durationSeconds,
        rating,
        feedback,
        metadata,
      })

      return res.status(201).json(interaction)
    } catch (error: any) {
      return res.status(500).json({ message: "Error recording interaction", error: error.message })
    }
  }
}
