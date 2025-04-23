import { Op } from "sequelize"
import OpenAI from "openai"
import {
  LearningResource,
  LearningRecommendation,
  ResourceInteraction,
  StudentProfile,
  Course,
  StudentPerformance,
  AssessmentSubmission,
  Assessment,
  QuizAttempt,
  Quiz,
  User,
} from "../models"
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

export class AIRecommendationService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  // Learning Resource methods
  async createLearningResource(data: CreateLearningResourceDto) {
    return LearningResource.create(data as any)
  }

  async updateLearningResource(id: string, data: UpdateLearningResourceDto) {
    const resource = await LearningResource.findByPk(id)
    if (!resource) {
      throw new Error("Learning resource not found")
    }

    await resource.update(data)
    return LearningResource.findByPk(id, {
      include: ["course", "semester"],
    })
  }

  async deleteLearningResource(id: string) {
    const resource = await LearningResource.findByPk(id)
    if (!resource) {
      throw new Error("Learning resource not found")
    }

    await resource.destroy()
    return { message: "Learning resource deleted successfully" }
  }

  async getLearningResourceById(id: string) {
    return LearningResource.findByPk(id, {
      include: ["course", "semester"],
    })
  }

  async getLearningResources(filters?: LearningResourceFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.courseId) {
        whereClause.courseId = filters.courseId
      }

      if (filters.semesterId) {
        whereClause.semesterId = filters.semesterId
      }

      if (filters.type) {
        whereClause.type = filters.type
      }

      if (filters.difficulty) {
        whereClause.difficulty = filters.difficulty
      }

      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: filters.tags,
        }
      }

      if (filters.search) {
        whereClause[Op.or] = [
          {
            title: {
              [Op.iLike]: `%${filters.search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${filters.search}%`,
            },
          },
        ]
      }
    }

    return LearningResource.findAll({
      where: whereClause,
      include: ["course", "semester"],
      order: [["createdAt", "DESC"]],
    })
  }

  // Learning Recommendation methods
  async createLearningRecommendation(data: CreateLearningRecommendationDto) {
    return LearningRecommendation.create(data as any)
  }

  async updateLearningRecommendation(id: string, data: UpdateLearningRecommendationDto) {
    const recommendation = await LearningRecommendation.findByPk(id)
    if (!recommendation) {
      throw new Error("Learning recommendation not found")
    }

    await recommendation.update(data)
    return LearningRecommendation.findByPk(id, {
      include: [
        {
          model: LearningResource,
          as: "learningResource",
        },
        "course",
      ],
    })
  }

  async deleteLearningRecommendation(id: string) {
    const recommendation = await LearningRecommendation.findByPk(id)
    if (!recommendation) {
      throw new Error("Learning recommendation not found")
    }

    await recommendation.destroy()
    return { message: "Learning recommendation deleted successfully" }
  }

  async getLearningRecommendationById(id: string) {
    return LearningRecommendation.findByPk(id, {
      include: [
        {
          model: LearningResource,
          as: "learningResource",
        },
        "course",
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async getStudentRecommendations(studentProfileId: string, courseId?: string) {
    const whereClause: any = { studentProfileId }

    if (courseId) {
      whereClause.courseId = courseId
    }

    return LearningRecommendation.findAll({
      where: whereClause,
      include: [
        {
          model: LearningResource,
          as: "learningResource",
        },
        "course",
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  // Resource Interaction methods
  async recordInteraction(data: ResourceInteractionDto) {
    return ResourceInteraction.create(data as any)
  }

  async getResourceInteractions(learningResourceId: string) {
    return ResourceInteraction.findAll({
      where: { learningResourceId },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async getStudentInteractions(studentProfileId: string) {
    return ResourceInteraction.findAll({
      where: { studentProfileId },
      include: [
        {
          model: LearningResource,
          as: "learningResource",
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  // AI Recommendation Generation
  async generateRecommendations(data: GenerateRecommendationsDto) {
    const { studentProfileId, courseId, count = 5, includeCompleted = false } = data

    // Get student profile with user info
    const studentProfile = await StudentProfile.findByPk(studentProfileId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    })

    if (!studentProfile) {
      throw new Error("Student profile not found")
    }

    // Get course details
    const course = await Course.findByPk(courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    // Get student performance data
    const performances = await StudentPerformance.findAll({
      where: {
        studentProfileId,
        courseId,
      },
    })

    // Get assessment submissions
    const submissions = await AssessmentSubmission.findAll({
      where: {
        studentProfileId,
      },
      include: [
        {
          model: Assessment,
          as: "assessment",
          where: {
            courseId,
          },
          required: true,
        },
      ],
    })

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: {
        studentProfileId,
      },
      include: [
        {
          model: Quiz,
          as: "quiz",
          where: {
            courseId,
          },
          required: true,
        },
      ],
    })

    // Get existing recommendations to avoid duplicates
    const existingRecommendations = await LearningRecommendation.findAll({
      where: {
        studentProfileId,
        courseId,
        ...(includeCompleted ? {} : { isCompleted: false }),
      },
      attributes: ["learningResourceId"],
    })

    const existingResourceIds = existingRecommendations.map((rec) => rec.learningResourceId)

    // Get student interactions to understand preferences
    const interactions = await ResourceInteraction.findAll({
      where: {
        studentProfileId,
      },
      include: [
        {
          model: LearningResource,
          as: "learningResource",
          where: {
            courseId,
          },
          required: true,
        },
      ],
    })

    // Get available learning resources for this course
    const availableResources = await LearningResource.findAll({
      where: {
        courseId,
        id: {
          [Op.notIn]: existingResourceIds,
        },
      },
    })

    if (availableResources.length === 0) {
      return []
    }

    // Prepare student data for AI analysis
    const studentData = {
      name: `${studentProfile.user?.firstName} ${studentProfile.user?.lastName}`,
      performances: performances.map((p) => ({
        attendancePercentage: p.attendancePercentage,
        assignmentAverage: p.assignmentAverage,
        quizAverage: p.quizAverage,
        overallPerformance: p.overallPerformance,
        performanceCategory: p.performanceCategory,
      })),
      submissions: submissions.map((s) => ({
        assessmentTitle: s.assessment?.title,
        assessmentType: s.assessment?.type,
        isGraded: s.isGraded,
        marks: s.marks,
        submissionDate: s.submissionDate,
      })),
      quizAttempts: quizAttempts.map((q) => ({
        quizTitle: q.quiz?.title,
        score: q.score,
        maxScore: q.quiz?.totalMarks,
        percentageScore: q.score,
        startTime: q.startTime,
        endTime: q.endTime || new Date(),
      })),
      interactions: interactions.map((i) => ({
        resourceType: i.learningResource?.type,
        resourceTitle: i.learningResource?.title,
        interactionType: i.interactionType,
        rating: i.rating,
        durationSeconds: i.durationSeconds,
      })),
    }

    // Prepare course data
    const courseData = {
      title: course.name,
      code: course.code,
      description: course.description,
      creditHours: course.creditHours,
    }

    // Prepare available resources data
    const resourcesData = availableResources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type,
      tags: r.tags,
      difficulty: r.difficulty,
      durationMinutes: r.durationMinutes,
    }))

    try {
      // Use OpenAI to generate personalized recommendations
      const prompt = this.buildRecommendationPrompt(studentData, courseData, resourcesData)

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an AI learning assistant that provides personalized resource recommendations to students based on their performance and learning patterns.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      })

      const recommendationsData = JSON.parse(response.choices[0].message.content || "{}") as {
        recommendations: Array<{
          resourceId: string
          reason: string
          relevanceScore: number
        }>
      }

      // Create recommendations in the database
      const createdRecommendations = []

      for (const rec of recommendationsData.recommendations) {
        // Verify that the resource exists
        const resource = availableResources.find((r) => r.id === rec.resourceId)
        if (!resource) continue

        // Create the recommendation
        const recommendation = await this.createLearningRecommendation({
          studentProfileId,
          learningResourceId: rec.resourceId,
          courseId,
          reason: rec.reason,
          relevanceScore: rec.relevanceScore,
        })

        // Get the full recommendation with related data
        const fullRecommendation = await this.getLearningRecommendationById(recommendation.id)
        createdRecommendations.push(fullRecommendation)

        // Stop if we've reached the requested count
        if (createdRecommendations.length >= count) break
      }

      return createdRecommendations
    } catch (error: any) {
      console.error("Error generating recommendations:", error)
      throw new Error(`Failed to generate recommendations: ${error.message}`)
    }
  }

  // Helper method to build the prompt for OpenAI
  private buildRecommendationPrompt(studentData: any, courseData: any, resourcesData: any[]): string {
    return `
I need to recommend learning resources for a student based on their performance and learning patterns.

Student Information:
- Name: ${studentData.name}
- Performance Summary: ${JSON.stringify(studentData.performances)}
- Assessment Submissions: ${JSON.stringify(studentData.submissions)}
- Quiz Attempts: ${JSON.stringify(studentData.quizAttempts)}
- Resource Interactions: ${JSON.stringify(studentData.interactions)}

Course Information:
- Title: ${courseData.title}
- Code: ${courseData.code}
- Description: ${courseData.description}
- Credit Hours: ${courseData.creditHours}

Available Learning Resources:
${JSON.stringify(resourcesData)}

Based on the student's performance, learning patterns, and available resources, please recommend up to 5 learning resources that would be most beneficial for this student. For each recommendation, provide:
1. The resource ID
2. A specific reason why this resource would benefit this student
3. A relevance score from 0.0 to 1.0 indicating how relevant this resource is to the student's needs

Return your recommendations in the following JSON format:
{
  "recommendations": [
    {
      "resourceId": "resource-id-1",
      "reason": "This resource addresses the student's weakness in topic X",
      "relevanceScore": 0.95
    },
    ...
  ]
}
`
  }

  // Recommendation Feedback
  async provideFeedback(data: RecommendationFeedbackDto) {
    const { recommendationId, isHelpful, feedback } = data

    const recommendation = await LearningRecommendation.findByPk(recommendationId)
    if (!recommendation) {
      throw new Error("Recommendation not found")
    }

    // Record the feedback in the recommendation
    await recommendation.update({
      feedback: feedback || (isHelpful ? "Helpful" : "Not helpful"),
    })

    // Record an interaction for this feedback
    await ResourceInteraction.create({
      studentProfileId: recommendation.studentProfileId,
      learningResourceId: recommendation.learningResourceId,
      interactionType: "rate",
      feedback: feedback || (isHelpful ? "Helpful" : "Not helpful"),
      metadata: { isHelpful, recommendationId },
    })

    return { message: "Feedback recorded successfully" }
  }

  // Mark recommendation as viewed, saved, or completed
  async markRecommendation(id: string, action: "view" | "save" | "complete") {
    const recommendation = await LearningRecommendation.findByPk(id)
    if (!recommendation) {
      throw new Error("Recommendation not found")
    }

    const updateData: any = {}
    const now = new Date()

    if (action === "view") {
      updateData.isViewed = true
      updateData.viewedAt = now
    } else if (action === "save") {
      updateData.isSaved = true
    } else if (action === "complete") {
      updateData.isCompleted = true
      updateData.completedAt = now
    }

    await recommendation.update(updateData)

    // Record an interaction
    await ResourceInteraction.create({
      studentProfileId: recommendation.studentProfileId,
      learningResourceId: recommendation.learningResourceId,
      interactionType: action,
    })

    return this.getLearningRecommendationById(id)
  }
}
