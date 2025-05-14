import { TopicProgress } from "../models/TopicProgress"
import { CourseTopic } from "../models/CourseTopic"
import { StudentProfile } from "../models/StudentProfile"
import { CourseMasteryService } from "./course-mastery.service"
import { NotificationService } from "./notification.service"
import { Op } from "sequelize"

export class TopicProgressService {
  private courseMasteryService: CourseMasteryService
  private notificationService: NotificationService

  constructor() {
    this.courseMasteryService = new CourseMasteryService()
    this.notificationService = new NotificationService()
  }

  /**
   * Find all topic progress entries with optional filters
   */
  async findAll(filters: {
    studentProfileId?: string
    courseId?: string
    semesterId?: string
    isCompleted?: boolean
  }): Promise<TopicProgress[]> {
    const whereClause: any = {}
    const topicWhereClause: any = {}

    if (filters.studentProfileId) {
      whereClause.studentProfileId = filters.studentProfileId
    }

    if (filters.courseId) {
      topicWhereClause.courseId = filters.courseId
    }

    if (filters.semesterId) {
      topicWhereClause.semesterId = filters.semesterId
    }

    if (filters.isCompleted !== undefined) {
      whereClause.isCompleted = filters.isCompleted
    }

    return TopicProgress.findAll({
      where: whereClause,
      include: [
        {
          model: CourseTopic,
          where: Object.keys(topicWhereClause).length > 0 ? topicWhereClause : undefined,
          required: true,
        },
        {
          model: StudentProfile,
        },
      ],
      order: [[CourseTopic, "orderIndex", "ASC"]],
    })
  }

  /**
   * Find topic progress by ID
   */
  async findById(id: string): Promise<TopicProgress | null> {
    return TopicProgress.findByPk(id, {
      include: [
        {
          model: CourseTopic,
        },
        {
          model: StudentProfile,
        },
      ],
    })
  }

  /**
   * Find topic progress by student and topic
   */
  async findByStudentAndTopic(studentProfileId: string, courseTopicId: string): Promise<TopicProgress | null> {
    return TopicProgress.findOne({
      where: {
        studentProfileId,
        courseTopicId,
      },
      include: [
        {
          model: CourseTopic,
        },
      ],
    })
  }

  /**
   * Mark a topic as completed
   */
  async markTopicCompleted(data: {
    studentProfileId: string
    courseTopicId: string
    timeSpentMinutes?: number
    assessmentResults?: object
  }): Promise<TopicProgress> {
    const { studentProfileId, courseTopicId, timeSpentMinutes, assessmentResults } = data

    // Find the topic to get course and semester IDs
    const topic = await CourseTopic.findByPk(courseTopicId)
    if (!topic) {
      throw new Error("Course topic not found")
    }

    // Find or create progress record
    const [progress, created] = await TopicProgress.findOrCreate({
      where: {
        studentProfileId,
        courseTopicId,
      },
      defaults: {
        isCompleted: true,
        completedAt: new Date(),
        masteryLevel: 100, // Default to full mastery when marked as completed
        timeSpentMinutes: timeSpentMinutes || 0,
        assessmentResults: assessmentResults || null,
      },
    })

    // If not created, update the existing record
    if (!created) {
      await progress.update({
        isCompleted: true,
        completedAt: new Date(),
        masteryLevel: 100, // Set to full mastery when marked as completed
        timeSpentMinutes: progress.timeSpentMinutes + (timeSpentMinutes || 0),
        assessmentResults: assessmentResults || progress.assessmentResults,
      })
    }

    // Send notification
    const student = await StudentProfile.findByPk(studentProfileId, {
      attributes: ["id", "userId"],
    })

    if (student) {
      await this.notificationService.createNotification({
        userId: student.userId,
        title: "Topic Completed",
        message: `You have completed the topic: ${topic.title}`,
        type: "success",
        relatedId: topic.id,
        relatedType: "course_topic",
      })
    }

    // Update course mastery
    await this.courseMasteryService.calculateAndUpdateCourseMastery(studentProfileId, topic.courseId, topic.semesterId)

    return progress
  }

  /**
   * Update topic progress
   */
  async updateTopicProgress(
    id: string,
    data: {
      isCompleted?: boolean
      completedAt?: Date
      masteryLevel?: number
      timeSpentMinutes?: number
      assessmentResults?: object
    },
  ): Promise<TopicProgress | null> {
    const progress = await TopicProgress.findByPk(id, {
      include: [
        {
          model: CourseTopic,
        },
      ],
    })

    if (!progress) {
      return null
    }

    // If marking as completed for the first time
    if (data.isCompleted && !progress.isCompleted) {
      data.completedAt = new Date()
    }

    await progress.update(data)

    // Update course mastery if the topic is associated with a course
    if (progress.courseTopic) {
      await this.courseMasteryService.calculateAndUpdateCourseMastery(
        progress.studentProfileId,
        progress.courseTopic.courseId,
        progress.courseTopic.semesterId,
      )
    }

    return progress
  }

  /**
   * Get student course progress
   */
  async getStudentCourseProgress(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<{
    topics: CourseTopic[]
    progress: TopicProgress[]
    completionPercentage: number
    averageMasteryLevel: number
  }> {
    // Get all topics for the course
    const topics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
        isActive: true,
      },
      order: [["orderIndex", "ASC"]],
    })

    // Get progress for each topic
    const progress = await TopicProgress.findAll({
      where: {
        studentProfileId,
        courseTopicId: {
          [Op.in]: topics.map((topic) => topic.id),
        },
      },
    })

    // Calculate completion percentage
    const completedTopics = progress.filter((p) => p.isCompleted).length
    const completionPercentage = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0

    // Calculate average mastery level
    const totalMasteryLevel = progress.reduce((sum, p) => sum + p.masteryLevel, 0)
    const averageMasteryLevel = progress.length > 0 ? totalMasteryLevel / progress.length : 0

    return {
      topics,
      progress,
      completionPercentage,
      averageMasteryLevel,
    }
  }
}
