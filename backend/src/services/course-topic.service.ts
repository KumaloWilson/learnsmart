import { Op } from "sequelize"
import { CourseTopic } from "../models/CourseTopic"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { TopicProgress } from "../models/TopicProgress"
import { TeachingMaterial } from "../models/TeachingMaterial"
import { LearningResource } from "../models/LearningResource"
import { StudentProfile } from "../models/StudentProfile"
import { CreateCourseTopicDto } from "../dto/course-topic.dto"

export class CourseTopicService {
  /**
   * Create a new course topic
   */
  async createCourseTopic(topicData: CreateCourseTopicDto): Promise<CourseTopic> {
    return CourseTopic.create(topicData as any)
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
   * Get course topic progress for all students
   */
  async getCourseTopicProgress(
    courseId: string,
    semesterId: string,
  ): Promise<{
    courseId: string
    semesterId: string
    topics: Array<{
      id: string
      title: string
      orderIndex: number
      difficulty: string
      completionRate: number
      averageMasteryLevel: number
    }>
    overallCompletionRate: number
    totalStudents: number
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

    // Get all students enrolled in the course
    const { CourseEnrollment } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
        },
      ],
    })

    const studentIds = enrollments.map((e: { studentProfileId: any }) => e.studentProfileId)
    const totalStudents = studentIds.length

    // Calculate progress for each topic
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic) => {
        const progress = await TopicProgress.findAll({
          where: {
            courseTopicId: topic.id,
            studentProfileId: {
              [Op.in]: studentIds,
            },
          },
        })

        const completedCount = progress.filter((p) => p.isCompleted).length
        const completionRate = totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0

        const totalMasteryLevel = progress.reduce((sum, p) => sum + p.masteryLevel, 0)
        const averageMasteryLevel = progress.length > 0 ? totalMasteryLevel / progress.length : 0

        return {
          id: topic.id,
          title: topic.title,
          orderIndex: topic.orderIndex,
          difficulty: topic.difficulty,
          completionRate,
          averageMasteryLevel,
        }
      }),
    )

    // Calculate overall completion rate
    const totalCompletedTopics = await TopicProgress.count({
      where: {
        courseTopicId: {
          [Op.in]: topics.map((t) => t.id),
        },
        studentProfileId: {
          [Op.in]: studentIds,
        },
        isCompleted: true,
      },
    })

    const totalPossibleCompletions = topics.length * totalStudents
    const overallCompletionRate =
      totalPossibleCompletions > 0 ? (totalCompletedTopics / totalPossibleCompletions) * 100 : 0

    return {
      courseId,
      semesterId,
      topics: topicsWithProgress,
      overallCompletionRate,
      totalStudents,
    }
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
