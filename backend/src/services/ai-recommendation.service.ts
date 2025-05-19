import { Op } from "sequelize"
import OpenAI from "openai"

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
} from "../dto/learning-recommendation.dto"
import { Assessment } from "../models/Assessment"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { Course } from "../models/Course"
import { LearningRecommendation } from "../models/LearningRecommendation"
import { LearningResource } from "../models/LearningResource"
import { Quiz } from "../models/Quiz"
import { QuizAttempt } from "../models/QuizAttempt"
import { ResourceInteraction } from "../models/ResourceInteraction"
import { StudentPerformance } from "../models/StudentPerformance"
import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"
import axios from "axios"

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

  // Get recommendations for a student
  async getRecommendationsForStudent(
    studentProfileId: string,
    courseId?: string,
    limit = 10,
    includeCompleted = false,
  ) {
    const whereClause: any = { studentProfileId }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (!includeCompleted) {
      whereClause.isCompleted = false
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
      order: [["relevanceScore", "DESC"]],
      limit,
    })
  }

  // Resource Interaction methods
  async recordInteraction(data: ResourceInteractionDto) {
    return ResourceInteraction.create(data as any)
  }

  // Record resource interaction with more parameters
  async recordResourceInteraction(
    studentProfileId: string,
    learningResourceId: string,
    interactionType: string,
    durationSeconds?: number,
    rating?: number,
    feedback?: string,
    metadata?: any,
  ) {
    return ResourceInteraction.create({
      studentProfileId,
      learningResourceId,
      interactionType,
      durationSeconds,
      rating,
      feedback,
      metadata,
    })
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

  // AI Recommendation Generation with Resource Creation
async generateRecommendations(data: GenerateRecommendationsDto) {
  const { studentProfileId, courseId, count = 5, includeCompleted = false } = data

  console.log(`Generating recommendations for student ${studentProfileId} in course ${courseId}`)

  try {
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
      console.error("Student profile not found for ID:", studentProfileId)
      throw new Error("Student profile not found")
    }

    // Get course details
    const course = await Course.findByPk(courseId)
    if (!course) {
      console.error("Course not found for ID:", courseId)
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
    console.log(`Found ${existingResourceIds.length} existing recommendations`)

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

    console.log(`Found ${availableResources.length} available resources for recommendations`)

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

 

    // Check if we need to generate resources first
    if (availableResources.length < count) {
      console.log(`Not enough resources available (${availableResources.length}). Generating new resources.`)
      
      // Generate resources based on course data
      const newResources = await this.generateLearningResources(course, studentData, count - availableResources.length)
      
      // Add newly created resources to the available resources
      if (newResources && newResources.length > 0) {
        availableResources.push(...newResources)
        console.log(`Generated ${newResources.length} new resources. Total available: ${availableResources.length}`)
      }
    }

    // If still no resources available, return empty array
    if (availableResources.length === 0) {
      console.log("No resources available and unable to generate new ones.")
      return []
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

    console.log(`Sending request to AI with ${resourcesData.length} resources`)

    // Use OpenAI to generate personalized recommendations
    const prompt = this.buildRecommendationPrompt(studentData, course, resourcesData)

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        model: "Qwen/Qwen3-30B-A3B",
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
      }
    )

    // Log the raw API response for debugging
    console.log("AI API Raw Response:", JSON.stringify(response.data))

    // Safely parse the response content
    let recommendationsData;
    try {
      const responseContent = response.data.choices[0].message.content;
      console.log("Response content:", responseContent);
      
      if (!responseContent) {
        console.error("Empty response content from API");
        return [];
      }
      
      recommendationsData = JSON.parse(responseContent);
      console.log("Parsed recommendations data:", JSON.stringify(recommendationsData));
      
      if (!recommendationsData || !recommendationsData.recommendations || !Array.isArray(recommendationsData.recommendations)) {
        console.error("Invalid recommendations format from API");
        return [];
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return [];
    }

    // Create recommendations in the database
    const createdRecommendations = []

    for (const rec of recommendationsData.recommendations) {
      console.log(`Processing recommendation for resource ID: ${rec.resourceId}`);
      
      // Verify resource ID format and existence
      if (!rec.resourceId) {
        console.log("Skipping recommendation with missing resourceId");
        continue;
      }
      
      // Find matching resource - check both exact match and string/number conversion
      let resource = availableResources.find((r) => 
        r.id === rec.resourceId || 
        r.id.toString() === rec.resourceId.toString()
      );
      
      if (!resource) {
        console.log(`Resource ID ${rec.resourceId} not found in available resources`);
        console.log("Available resource IDs:", availableResources.map(r => r.id));
        continue;
      }

      console.log(`Creating recommendation for resource: ${resource.title} (${resource.id})`);

      try {
        // Create the recommendation
        const recommendation = await this.createLearningRecommendation({
          studentProfileId,
          learningResourceId: resource.id,
          courseId,
          reason: rec.reason || "Recommended based on your learning patterns",
          relevanceScore: rec.relevanceScore || 0.5,
        })

        // Get the full recommendation with related data
        const fullRecommendation = await this.getLearningRecommendationById(recommendation.id)
        createdRecommendations.push(fullRecommendation)

        console.log(`Successfully created recommendation ID: ${recommendation.id}`);

        // Stop if we've reached the requested count
        if (createdRecommendations.length >= count) break
      } catch (recError) {
        console.error(`Error creating recommendation for resource ${resource.id}:`, recError);
        // Continue with other recommendations
      }
    }

    console.log(`Created ${createdRecommendations.length} recommendations successfully`);
    return createdRecommendations
  } catch (error: any) {
    console.error("Error generating recommendations:", error)
    // Return empty array instead of throwing to avoid breaking the API
    return []
  }
}

// New method to generate learning resources based on course data
async generateLearningResources(courseData: Course, studentData: any, count: number = 5) {
  console.log(`Generating ${count} learning resources for course ${courseData.code}`)
  
  try {
    // Use AI to generate resource suggestions
    const prompt = this.buildResourceGenerationPrompt(courseData, studentData, count)

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        model: "Qwen/Qwen3-30B-A3B",
        messages: [
          {
            role: "system",
            content:
              "You are an AI learning assistant that helps generate appropriate learning resources for courses based on curriculum and student needs.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }
    )

    // Log the raw API response for debugging
    console.log("AI Resource Generation Response:", JSON.stringify(response.data))

    // Safely parse the response content
    let resourcesData;
    try {
      const responseContent = response.data.choices[0].message.content;
      console.log("Resource generation response content:", responseContent);
      
      if (!responseContent) {
        console.error("Empty resource generation response content from API");
        return [];
      }
      
      resourcesData = JSON.parse(responseContent);
      console.log("Parsed resources data:", JSON.stringify(resourcesData));
      
      if (!resourcesData || !resourcesData.resources || !Array.isArray(resourcesData.resources)) {
        console.error("Invalid resources format from API");
        return [];
      }
    } catch (parseError) {
      console.error("Error parsing AI resource generation response:", parseError);
      return [];
    }

    // Create resources in the database
    const createdResources = []

    for (const res of resourcesData.resources) {
      console.log(`Processing generated resource: ${res.title}`);
      
      try {
        // Create the resource using CreateLearningResourceDto
        const resourceDto: CreateLearningResourceDto = {
          title: res.title,
          description: res.description || `Resource for ${courseData.name}`,
          type: this.validateResourceType(res.type),
          url: res.url || `https://resources.example.com/${courseData.code}/${encodeURIComponent(res.title)}`,
          content: res.content,
          tags: res.tags || [],
          difficulty: res.difficulty || 3,
          durationMinutes: res.durationMinutes || 30,
          courseId: courseData.id,
          metadata: res.metadata || {}
        }

        // Create the resource
        const resource = await this.createLearningResource(resourceDto)
        createdResources.push(resource)

        console.log(`Successfully created resource ID: ${resource.id}`);
      } catch (resError) {
        console.error(`Error creating resource ${res.title}:`, resError);
        // Continue with other resources
      }
    }

    console.log(`Created ${createdResources.length} resources successfully`);
    return createdResources
  } catch (error: any) {
    console.error("Error generating learning resources:", error)
    return []
  }
}

// Helper method to validate resource type
private validateResourceType(type: string): "video" | "article" | "book" | "exercise" | "quiz" | "other" {
  const validTypes = ["video", "article", "book", "exercise", "quiz", "other"]
  
  if (validTypes.includes(type.toLowerCase())) {
    return type.toLowerCase() as "video" | "article" | "book" | "exercise" | "quiz" | "other"
  }
  
  // Default to article if invalid type
  return "article"
}

// Helper method to build the prompt for resource generation
private buildResourceGenerationPrompt(courseData: any, studentData: any, count: number): string {
  return `
I need to generate ${count} learning resources for a course based on its details.

Course Information:
- Title: ${courseData.title}
- Code: ${courseData.code}
- Description: ${courseData.description}
- Credit Hours: ${courseData.creditHours}

Student Performance Data (to understand what kind of resources might be helpful):
${JSON.stringify(studentData.performances)}

Based on this course information, please suggest ${count} learning resources that would be appropriate for this course. 
For each resource, provide:

1. Title: A clear, descriptive title
2. Description: A brief description of the resource content
3. Type: Must be one of: video, article, book, exercise, quiz, other
4. URL: A placeholder URL or actual URL if you can recommend a real resource but i' prefer a real resource for videos use youtube
5. Content: Optional textual content for the resource
6. Tags: Array of relevant topic tags
7. Difficulty: A number between 1-5 (1=beginner, 5=advanced)
8. Duration in minutes: Estimated time to complete the resource
9. Metadata: Any additional relevant information

Return your suggestions in the following JSON format:
{
  "resources": [
    {
      "title": "Resource Title",
      "description": "Resource description...",
      "type": "article",
      "url": "https://example.com/resource",
      "content": "Optional content text",
      "tags": ["tag1", "tag2"],
      "difficulty": 3,
      "durationMinutes": 30,
      "metadata": { "author": "Author Name", "publishedDate": "2025-01-01" }
    },
    ...
  ]
}

Make sure each resource is relevant to the course subject matter and appropriate for the academic level.
`
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
1. The resource ID (use the exact ID string from the available resources list)
2. A specific reason why this resource would benefit this student
3. A relevance score from 0.0 to 1.0 indicating how relevant this resource is to the student's needs

IMPORTANT: Make sure to use the exact resource IDs from the provided list.

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
async provideFeedback(recommendationId: string, isHelpful: boolean, feedback?: string) {
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

// Mark recommendation as viewed
async markRecommendationAsViewed(id: string) {
  return this.markRecommendation(id, "view")
}

// Mark recommendation as saved
async markRecommendationAsSaved(id: string) {
  return this.markRecommendation(id, "save")
}

// Mark recommendation as completed
async markRecommendationAsCompleted(id: string) {
  return this.markRecommendation(id, "complete")
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