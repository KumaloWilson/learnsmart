import { TopicProgress } from "../models/TopicProgress"
import { CourseTopic } from "../models/CourseTopic"
import { StudentProfile } from "../models/StudentProfile"
import { CourseMasteryService } from "./course-mastery.service"
import { NotificationService } from "./notification.service"

export class TopicProgressService {
  private courseMasteryService: CourseMasteryService
  private notificationService: NotificationService

  constructor() {
    this.courseMasteryService = new CourseMasteryService()
    this.notificationService = new NotificationService()
  }

  /**
   * Create or update topic progress
   */
  async createOrUpdateTopicProgress(
    studentProfileId: string,
    courseTopicId: string,
    progressData: {
      isCompleted?: boolean
      completedAt?: Date
      masteryLevel?: number
      timeSpentMinutes?: number
      assessmentResults?: object
    },
  ): Promise<TopicProgress> {
    // Find existing progress or create new one
    const [progress, created] = await TopicProgress.findOrCreate({
      where: {
        studentProfileId,
        courseTopicId,
      },
      defaults: {
        isCompleted: progressData.isCompleted || false,
        completedAt: progressData.isCompleted ? progressData.completedAt || new Date() : null,
        masteryLevel: progressData.masteryLevel || 0,
        timeSpentMinutes: progressData.timeSpentMinutes || 0,
        assessmentResults: progressData.assessmentResults || null,
      },
    })

    // If not created, update the existing record
    if (!created) {
      // If completing the topic for the first time
      const wasCompleted = progress.isCompleted
      const nowCompleted = progressData.isCompleted || progress.isCompleted

      await progress.update({
        isCompleted: nowCompleted,
        completedAt: nowCompleted && !wasCompleted ? new Date() : progress.completedAt,
        masteryLevel: progressData.masteryLevel !== undefined ? progressData.masteryLevel : progress.masteryLevel,
        timeSpentMinutes:
          progressData.timeSpentMinutes !== undefined
            ? progress.timeSpentMinutes + progressData.timeSpentMinutes
            : progress.timeSpentMinutes,
        assessmentResults: progressData.assessmentResults || progress.assessmentResults,
      })

      // Send notification if topic is completed for the first time
      if (nowCompleted && !wasCompleted) {
        const topic = await CourseTopic.findByPk(courseTopicId)
        const student = await StudentProfile.findByPk(studentProfileId, {
          attributes: ["id", "userId"],
        })

        if (topic && student) {
          await this.notificationService.createNotification({
            userId: student.userId,
            title: "Topic Completed",
            message: `You have completed the topic: ${topic.title}`,
            type: "success",
            relatedId: topic.id,
            relatedType: "course_topic",
          })
        }
      }
    }

    // Update course mastery
    const topic = await CourseTopic.findByPk(courseTopicId)
    if (topic) {
      await this.courseMasteryService.calculateAndUpdateCourseMastery(
        studentProfileId,
        topic.courseId,
        topic.semesterId,
      )
    }

    return progress
  }

  /**
   * Get topic progress by ID
   */
  async getTopicProgressById(id: string): Promise<TopicProgress | null> {
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
   * Get topic progress for a student and topic
   */
  async getTopicProgress(studentProfileId: string, courseTopicId: string): Promise<TopicProgress | null> {
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
   * Get all topic progress for a student in a course
   */
  async getStudentCourseProgress(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<TopicProgress[]> {
    // Get all topics for the course
    const topics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    // Get progress for each topic
    return TopicProgress.findAll({
      where: {
        studentProfileId,
        courseTopicId: topics.map((topic) => topic.id),
      },
      include: [
        {
          model: CourseTopic,
        },
      ],
      order: [[CourseTopic, "orderIndex", "ASC"]],
    })
  }

  /**
   * Update topic progress
   */
  async updateTopicProgress(id: string, progressData: Partial<TopicProgress>): Promise<TopicProgress | null> {
    const progress = await TopicProgress.findByPk(id)

    if (!progress) {
      return null
    }

    await progress.update(progressData)
    return progress
  }

  /**
   * Delete topic progress
   */
  async deleteTopicProgress(id: string): Promise<boolean> {
    const progress = await TopicProgress.findByPk(id)

    if (!progress) {
      return false
    }

    await progress.destroy()
    return true
  }

  /**
   * Record time spent on a topic
   */
  async recordTimeSpent(studentProfileId: string, courseTopicId: string, minutes: number): Promise<TopicProgress> {
    return this.createOrUpdateTopicProgress(studentProfileId, courseTopicId, {
      timeSpentMinutes: minutes,
    })
  }

  /**
   * Update mastery level for a topic
   */
  async updateMasteryLevel(
    studentProfileId: string,
    courseTopicId: string,
    masteryLevel: number,
  ): Promise<TopicProgress> {
    return this.createOrUpdateTopicProgress(studentProfileId, courseTopicId, {
      masteryLevel,
    })
  }

  /**
   * Mark a topic as completed
   */
  async markTopicCompleted(
    studentProfileId: string,
    courseTopicId: string,
    masteryLevel?: number,
  ): Promise<TopicProgress> {
    return this.createOrUpdateTopicProgress(studentProfileId, courseTopicId, {
      isCompleted: true,
      completedAt: new Date(),
      masteryLevel,
    })
  }

  /**
   * Record assessment results for a topic
   */
  async recordAssessmentResults(
    studentProfileId: string,
    courseTopicId: string,
    results: object,
    masteryLevel?: number,
  ): Promise<TopicProgress> {
    return this.createOrUpdateTopicProgress(studentProfileId, courseTopicId, {
      assessmentResults: results,
      masteryLevel,
    })
  }
}
