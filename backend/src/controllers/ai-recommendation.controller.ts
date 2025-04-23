import type { Request, Response } from "express"
import { AIRecommendationService } from "../services/ai-recommendation.service"
import type {
  CreateLearningResourceDto,
  UpdateLearningResourceDto,
  LearningResourceFilterDto,
} from "../dto/learning-resource.dto"
import type {
  CreateLearningRecommendationDto,
  UpdateLearningRecommendationDto,
  ResourceInteractionDto,
  GenerateRecommendationsDto,
  RecommendationFeedbackDto,
} from "../dto/learning-recommendation.dto"

export class AIRecommendationController {
  private aiRecommendationService: AIRecommendationService

  constructor() {
    this.aiRecommendationService = new AIRecommendationService()
  }

  // Learning Resource endpoints
  createLearningResource = async (req: Request, res: Response) => {
    try {
      const data: CreateLearningResourceDto = req.body
      const resource = await this.aiRecommendationService.createLearningResource(data)
      return res.status(201).json(resource)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating learning resource", error: error.message })
    }
  }

  updateLearningResource = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateLearningResourceDto = req.body
      const resource = await this.aiRecommendationService.updateLearningResource(id, data)
      return res.status(200).json(resource)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating learning resource", error: error.message })
    }
  }

  deleteLearningResource = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.aiRecommendationService.deleteLearningResource(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting learning resource", error: error.message })
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
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching learning resource", error: error.message })
    }
  }

  getLearningResources = async (req: Request, res: Response) => {
    try {
      const filters: LearningResourceFilterDto = {}

      if (req.query.courseId) {
        filters.courseId = req.query.courseId as string
      }

      if (req.query.semesterId) {
        filters.semesterId = req.query.semesterId as string
      }

      if (req.query.type) {
        filters.type = req.query.type as string
      }

      if (req.query.difficulty) {
        filters.difficulty = Number.parseInt(req.query.difficulty as string)
      }

      if (req.query.tags) {
        filters.tags = (req.query.tags as string).split(",")
      }

      if (req.query.search) {
        filters.search = req.query.search as string
      }

      const resources = await this.aiRecommendationService.getLearningResources(filters)
      return res.status(200).json(resources)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching learning resources", error: error.message })
    }
  }

  // Learning Recommendation endpoints
  createLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const data: CreateLearningRecommendationDto = req.body
      const recommendation = await this.aiRecommendationService.createLearningRecommendation(data)
      return res.status(201).json(recommendation)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating learning recommendation", error: error.message })
    }
  }

  updateLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateLearningRecommendationDto = req.body
      const recommendation = await this.aiRecommendationService.updateLearningRecommendation(id, data)
      return res.status(200).json(recommendation)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating learning recommendation", error: error.message })
    }
  }

  deleteLearningRecommendation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.aiRecommendationService.deleteLearningRecommendation(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting learning recommendation", error: error.message })
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
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching learning recommendation", error: error.message })
    }
  }

  getStudentRecommendations = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId } = req.query
      const recommendations = await this.aiRecommendationService.getStudentRecommendations(
        studentId,
        courseId as string | undefined,
      )
      return res.status(200).json(recommendations)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching student recommendations", error: error.message })
    }
  }

  // Resource Interaction endpoints
  recordInteraction = async (req: Request, res: Response) => {
    try {
      const data: ResourceInteractionDto = req.body
      const interaction = await this.aiRecommendationService.recordInteraction(data)
      return res.status(201).json(interaction)
    } catch (error: any) {
      return res.status(500).json({ message: "Error recording resource interaction", error: error.message })
    }
  }

  getResourceInteractions = async (req: Request, res: Response) => {
    try {
      const { resourceId } = req.params
      const interactions = await this.aiRecommendationService.getResourceInteractions(resourceId)
      return res.status(200).json(interactions)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching resource interactions", error: error.message })
    }
  }

  getStudentInteractions = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const interactions = await this.aiRecommendationService.getStudentInteractions(studentId)
      return res.status(200).json(interactions)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching student interactions", error: error.message })
    }
  }

  // AI Recommendation Generation
  generateRecommendations = async (req: Request, res: Response) => {
    try {
      const data: GenerateRecommendationsDto = req.body
      const recommendations = await this.aiRecommendationService.generateRecommendations(data)
      return res.status(200).json(recommendations)
    } catch (error: any) {
      return res.status(500).json({ message: "Error generating recommendations", error: error.message })
    }
  }

  // Recommendation Feedback
  provideFeedback = async (req: Request, res: Response) => {
    try {
      const data: RecommendationFeedbackDto = req.body
      const result = await this.aiRecommendationService.provideFeedback(data)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error providing feedback", error: error.message })
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
