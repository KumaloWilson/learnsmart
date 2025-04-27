import { Op } from "sequelize"
import { CourseTopic } from "../models/CourseTopic"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { TopicProgress } from "../models/TopicProgress"
import { TeachingMaterial } from "../models/TeachingMaterial"
import { LearningResource } from "../models/LearningResource"

export class CourseTopicService {
  /**
   * Create a new course topic
   */
  async createCourseTopic(topicData: {
    title: string
    description?: string
    orderIndex: number
    durationHours: number
    learningObjectives?: string[]
    keywords?: string[]
    difficulty: "beginner" | "intermediate" | "advanced"
    courseId: string
    semesterId: string
    isActive?: boolean
  }): Promise<CourseTopic> {
    return CourseTopic.create(topicData)
  }

  /**
   * Get a course topic by ID
   */
  async getTopicById(id: string): Promise<CourseTopic | null> {
    return CourseTopic.findByPk(id, {
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
    })
  }

  /**
   * Get all topics for a course
   */
  async getCourseTopics(courseId: string, semesterId: string): Promise<CourseTopic[]> {
    return CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
      },
      order: [["orderIndex", "ASC"]],
    })
  }

  /**
   * Update a course topic
   */
  async updateCourseTopic(id: string, topicData: Partial<CourseTopic>): Promise<CourseTopic | null> {
    const topic = await CourseTopic.findByPk(id)

    if (!topic) {
      return null
    }

    await topic.update(topicData)
    return topic
  }

  /**
   * Delete a course topic
   */
  async deleteCourseTopic(id: string): Promise<boolean> {
    const topic = await CourseTopic.findByPk(id)

    if (!topic) {
      return false
    }

    await topic.destroy()
    return true
  }

  /**
   * Reorder course topics
   */
  async reorderTopics(
    courseId: string,
    semesterId: string,
    topicOrder: { id: string; orderIndex: number }[],
  ): Promise<boolean> {
    try {
      for (const item of topicOrder) {
        await CourseTopic.update(
          { orderIndex: item.orderIndex },
          {
            where: {
              id: item.id,
              courseId,
              semesterId,
            },
          },
        )
      }
      return true
    } catch (error) {
      console.error("Error reordering topics:", error)
      return false
    }
  }

  /**
   * Get topic progress for a student
   */
  async getStudentTopicProgress(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<{
    topics: CourseTopic[]
    progress: TopicProgress[]
    completionPercentage: number
  }> {
    const topics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
      },
      order: [["orderIndex", "ASC"]],
    })

    const progress = await TopicProgress.findAll({
      where: {
        studentProfileId,
        courseTopicId: {
          [Op.in]: topics.map((topic) => topic.id),
        },
      },
    })

    const completedTopics = progress.filter((p) => p.isCompleted).length
    const completionPercentage = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0

    return {
      topics,
      progress,
      completionPercentage,
    }
  }

  /**
   * Get topic progress statistics for a course
   */
  async getTopicProgressStatistics(
    courseId: string,
    semesterId: string,
  ): Promise<
    {
      topicId: string
      title: string
      completionRate: number
      averageMasteryLevel: number
      averageTimeSpent: number
      difficulty: string
    }[]
  > {
    const topics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const result = []

    for (const topic of topics) {
      const progress = await TopicProgress.findAll({
        where: {
          courseTopicId: topic.id,
        },
      })

      const totalProgress = progress.length
      const completedProgress = progress.filter((p) => p.isCompleted).length
      const completionRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0

      const totalMasteryLevel = progress.reduce((sum, p) => sum + p.masteryLevel, 0)
      const averageMasteryLevel = totalProgress > 0 ? totalMasteryLevel / totalProgress : 0

      const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpentMinutes, 0)
      const averageTimeSpent = totalProgress > 0 ? totalTimeSpent / totalProgress : 0

      result.push({
        topicId: topic.id,
        title: topic.title,
        completionRate,
        averageMasteryLevel,
        averageTimeSpent,
        difficulty: topic.difficulty,
      })
    }

    return result
  }

  /**
   * Get teaching materials for a topic
   */
  async getTopicTeachingMaterials(topicId: string): Promise<TeachingMaterial[]> {
    return TeachingMaterial.findAll({
      where: {
        courseTopicId: topicId,
      },
      order: [["createdAt", "DESC"]],
    })
  }

  /**
   * Get learning resources for a topic
   */
  async getTopicLearningResources(topicId: string): Promise<LearningResource[]> {
    return LearningResource.findAll({
      where: {
        courseTopicId: topicId,
      },
      order: [["createdAt", "DESC"]],
    })
  }
}
