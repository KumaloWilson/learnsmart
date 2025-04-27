import { Op, type Sequelize } from "sequelize"
import { CourseTopic, Course, Semester, TopicProgress } from "../models"
import type { CreateCourseTopicDto, UpdateCourseTopicDto, CourseTopicFilterDto } from "../dto/course-topic.dto"

export class CourseTopicService {
  private sequelize: Sequelize

  constructor() {
    this.sequelize = CourseTopic.sequelize!
  }

  async findAll(filters?: CourseTopicFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.courseId) {
        whereClause.courseId = filters.courseId
      }

      if (filters.semesterId) {
        whereClause.semesterId = filters.semesterId
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive
      }

      if (filters.difficulty) {
        whereClause.difficulty = filters.difficulty
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

    return CourseTopic.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["orderIndex", "ASC"]],
    })
  }

  async findById(id: string) {
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

  async create(data: CreateCourseTopicDto) {
    // Check if course exists
    const course = await Course.findByPk(data.courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    // Check if semester exists
    const semester = await Semester.findByPk(data.semesterId)
    if (!semester) {
      throw new Error("Semester not found")
    }

    // If orderIndex is not provided, set it to the next available index
    if (!data.orderIndex) {
      const maxOrderIndex = await CourseTopic.max("orderIndex", {
        where: {
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
      })
      data.orderIndex = (maxOrderIndex || 0) + 1
    }

    return CourseTopic.create(data)
  }

  async update(id: string, data: UpdateCourseTopicDto) {
    const topic = await CourseTopic.findByPk(id)
    if (!topic) {
      throw new Error("Course topic not found")
    }

    await topic.update(data)
    return this.findById(id)
  }

  async delete(id: string) {
    const topic = await CourseTopic.findByPk(id)
    if (!topic) {
      throw new Error("Course topic not found")
    }

    // Check if there are any progress records for this topic
    const progressCount = await TopicProgress.count({
      where: {
        courseTopicId: id,
      },
    })

    if (progressCount > 0) {
      // Instead of deleting, mark as inactive
      await topic.update({ isActive: false })
      return { message: "Course topic marked as inactive due to existing progress records" }
    }

    await topic.destroy()
    return { message: "Course topic deleted successfully" }
  }

  async reorderTopics(courseId: string, semesterId: string, topicIds: string[]) {
    // Verify all topics exist and belong to the course and semester
    const topics = await CourseTopic.findAll({
      where: {
        id: {
          [Op.in]: topicIds,
        },
        courseId,
        semesterId,
      },
    })

    if (topics.length !== topicIds.length) {
      throw new Error("One or more topics not found or do not belong to the specified course and semester")
    }

    // Update order indexes
    for (let i = 0; i < topicIds.length; i++) {
      await CourseTopic.update(
        { orderIndex: i + 1 },
        {
          where: {
            id: topicIds[i],
          },
        },
      )
    }

    return this.findAll({ courseId, semesterId })
  }

  async getCourseTopicProgress(courseId: string, semesterId: string) {
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
    const topicProgress = await Promise.all(
      topics.map(async (topic) => {
        const completedCount = await TopicProgress.count({
          where: {
            courseTopicId: topic.id,
            isCompleted: true,
          },
        })

        const totalStudents = await TopicProgress.count({
          where: {
            courseTopicId: topic.id,
          },
        })

        const averageMastery = await TopicProgress.findOne({
          attributes: [[this.sequelize.fn("AVG", this.sequelize.col("masteryLevel")), "averageMastery"]],
          where: {
            courseTopicId: topic.id,
          },
          raw: true,
        })

        return {
          topic,
          completedCount,
          totalStudents,
          completionRate: totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0,
          averageMastery: averageMastery ? Number((averageMastery as any).averageMastery) || 0 : 0,
        }
      }),
    )

    return {
      courseId,
      semesterId,
      totalTopics: topics.length,
      topicProgress,
    }
  }
}
