import type { Request, Response } from "express"
import { AIRecommendationService } from "../services/ai-recommendation.service"

export class AIRecommendationController {
  private aiRecommendationService: AIRecommendationService

  constructor() {
    this.aiRecommendationService = new AIRecommendationService()
  }

  // Learning Resource methods
  createLearningResource = async (req: Request, res: Response) => {
    try {
      const resourceData = req.body
      const resource = await this.aiRecommendationService.createLearningResource(resourceData)
      return res.status(201).json(resource)
    } catch (error) {
      console.error("Error creating learning resource:", error)
      return res.status(500).json({ message: "Failed to create learning resource", error: error })
    }
  }

  updateLearningResource = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const resourceData = req.body
      const resource = await this.aiRecommendationService.updateLearningResource(id, resourceData)
      if (!resource) {
        return res.status(404).json({ message: "Learning resource not found" })
      }
      return res.status(200).json(resource)
    } catch (error) {
      console.error("Error updating learning resource:", error)
      return res.status(500).json({ message: "Failed to update learning resource", error: error })
    }
  }

  deleteLearningResource = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.aiRecommendationService.deleteLearningResource(id)
      if (!deleted) {
        return res.status(404).json({ message: "Learning resource not found" })
      }
      return res.status(200).json({ message: "Learning resource deleted successfully" })
    } catch (error) {
      console.error("Error deleting learning resource:", error)
      return res.status(500).json({ message: "Failed to delete learning resource", error: error })
    }
  }

  getLearningResourceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const resource = await this.aiRecommendationService.getLearningResourceById(id)
      if (!resource) {
        return res.status(404).json({ message: "Learning resource not found" })
      }
      return res.status(200).json(resource)
    } catch (error) {
      console.error("Error getting learning resource by ID:", error)
      return res.status(500).json({ message: "Failed to get learning resource", error: error })
    }
  }

  getLearningResources = async (req: Request, res: Response) => {
    try {
      const filters = req.query
      const resources = await this.aiRecommendationService.getLearningResources(filters)
      return res.status(200).json(resources)
    } catch (error) {
      console.error("Error getting learning resources:", error)
      return res.status(500).json({ message: "Failed to get learning resources", error: error })
    }
  }

  // Learning Recommendation methods
  createLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const recommendationData = req.body
      const recommendation = await this.aiRecommendationService.createLearningRecommendation(recommendationData)
      return res.status(201).json(recommendation)
    } catch (error) {
      console.error("Error creating learning recommendation:", error)
      return res.status(500).json({ message: "Failed to create learning recommendation", error: error })
    }
  }

  updateLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const recommendationData = req.body
      const recommendation = await this.aiRecommendationService.updateLearningRecommendation(id, recommendationData)
      if (!recommendation) {
        return res.status(404).json({ message: "Learning recommendation not found" })
      }
      return res.status(200).json(recommendation)
    } catch (error) {
      console.error("Error updating learning recommendation:", error)
      return res.status(500).json({ message: "Failed to update learning recommendation", error: error })
    }
  }

  deleteLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.aiRecommendationService.deleteLearningRecommendation(id)
      if (!deleted) {
        return res.status(404).json({ message: "Learning recommendation not found" })
      }
      return res.status(200).json({ message: "Learning recommendation deleted successfully" })
    } catch (error) {
      console.error("Error deleting learning recommendation:", error)
      return res.status(500).json({ message: "Failed to delete learning recommendation", error: error })
    }
  }

  getLearningRecommendationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const recommendation = await this.aiRecommendationService.getLearningRecommendationById(id)
      if (!recommendation) {
        return res.status(404).json({ message: "Learning recommendation not found" })
      }
      return res.status(200).json(recommendation)
    } catch (error) {
      console.error("Error getting learning recommendation by ID:", error)
      return res.status(500).json({ message: "Failed to get learning recommendation", error: error })
    }
  }

  getStudentRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const recommendations = await this.aiRecommendationService.getStudentRecommendations(studentId)
      return res.status(200).json(recommendations)
    } catch (error) {
      console.error("Error getting student recommendations:", error)
      return res.status(500).json({ message: "Failed to get student recommendations", error: error })
    }
  }

  // Resource Interaction methods
  recordInteraction = async (req: Request, res: Response) => {
    try {
      const interactionData = req.body
      const interaction = await this.aiRecommendationService.recordInteraction(interactionData)
      return res.status(201).json(interaction)
    } catch (error) {
      console.error("Error recording interaction:", error)
      return res.status(500).json({ message: "Failed to record interaction", error: error })
    }
  }

  getResourceInteractions = async (req: Request, res: Response) => {
    try {
      const { resourceId } = req.params
      const interactions = await this.aiRecommendationService.getResourceInteractions(resourceId)
      return res.status(200).json(interactions)
    } catch (error) {
      console.error("Error getting resource interactions:", error)
      return res.status(500).json({ message: "Failed to get resource interactions", error: error })
    }
  }

  getStudentInteractions = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const interactions = await this.aiRecommendationService.getStudentInteractions(studentId)
      return res.status(200).json(interactions)
    } catch (error) {
      console.error("Error getting student interactions:", error)
      return res.status(500).json({ message: "Failed to get student interactions", error: error })
    }
  }

  // AI Recommendation Generation
  generateRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentProfileId, courseId, count } = req.body
      const recommendations = await this.aiRecommendationService.generateRecommendations({
        studentProfileId,
        courseId,
        count,
      })
      return res.status(201).json(recommendations)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      return res.status(500).json({ message: "Failed to generate recommendations", error: error })
    }
  }

  // Recommendation Feedback
  provideFeedback = async (req: Request, res: Response) => {
    try {
      const { recommendationId, isHelpful, feedback } = req.body
      const recommendation = await this.aiRecommendationService.provideFeedback({
        recommendationId,
        isHelpful,
        feedback,
      })
      if (!recommendation) {
        return res.status(404).json({ message: "Learning recommendation not found" })
      }
      return res.status(200).json(recommendation)
    } catch (error) {
      console.error("Error providing feedback:", error)
      return res.status(500).json({ message: "Failed to provide feedback", error: error })
    }
  }

  // Mark recommendation as viewed, saved, or completed
  markRecommendation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { action } = req.body

      if (!["view", "save", "complete"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'view', 'save', or 'complete'" })
      }

      const recommendation = await this.aiRecommendationService.markRecommendation(id, action)
      return res.status(200).json(recommendation)
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking recommendation", error: error.message })
    }
  }
}
