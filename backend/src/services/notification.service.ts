import { Op } from "sequelize"
import { Notification, User } from "../models"
import type {
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkCreateNotificationDto,
  NotificationFilterDto,
} from "../dto/notification.dto"

export class NotificationService {
  async findAll(filters?: NotificationFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.userId) {
        whereClause.userId = filters.userId
      }
      if (filters.type) {
        whereClause.type = filters.type
      }
      if (filters.isRead !== undefined) {
        whereClause.isRead = filters.isRead
      }
      if (filters.startDate && filters.endDate) {
        whereClause.createdAt = {
          [Op.between]: [filters.startDate, filters.endDate],
        }
      } else if (filters.startDate) {
        whereClause.createdAt = {
          [Op.gte]: filters.startDate,
        }
      } else if (filters.endDate) {
        whereClause.createdAt = {
          [Op.lte]: filters.endDate,
        }
      }
    }

    // Only return active notifications
    whereClause.isActive = true

    return Notification.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async findById(id: string) {
    return Notification.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
      ],
    })
  }

  async findByUser(userId: string, isRead?: boolean) {
    const whereClause: any = {
      userId,
      isActive: true,
    }

    if (isRead !== undefined) {
      whereClause.isRead = isRead
    }

    return Notification.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async countUnread(userId: string) {
    return Notification.count({
      where: {
        userId,
        isRead: false,
        isActive: true,
      },
    })
  }

  async create(data: CreateNotificationDto) {
    return Notification.create(data)
  }

  async bulkCreate(data: BulkCreateNotificationDto) {
    const notifications = data.userIds.map((userId) => ({
      title: data.title,
      message: data.message,
      type: data.type,
      userId,
      link: data.link,
      metadata: data.metadata,
      senderId: data.senderId,
      isRead: false,
      isActive: true,
    }))

    return Notification.bulkCreate(notifications)
  }

  async update(id: string, data: UpdateNotificationDto) {
    const notification = await Notification.findByPk(id)
    if (!notification) {
      throw new Error("Notification not found")
    }

    // If marking as read and readAt is not provided, set it to now
    if (data.isRead && !data.readAt) {
      data.readAt = new Date()
    }

    await notification.update(data)
    return this.findById(id)
  }

  async markAsRead(id: string) {
    return this.update(id, {
      isRead: true,
      readAt: new Date(),
    })
  }

  async markAllAsRead(userId: string) {
    await Notification.update(
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        where: {
          userId,
          isRead: false,
          isActive: true,
        },
      },
    )
    return { message: "All notifications marked as read" }
  }

  async delete(id: string) {
    const notification = await Notification.findByPk(id)
    if (!notification) {
      throw new Error("Notification not found")
    }

    // Soft delete by setting isActive to false
    await notification.update({ isActive: false })
    return { message: "Notification deleted successfully" }
  }

  async deleteAllForUser(userId: string) {
    await Notification.update(
      { isActive: false },
      {
        where: {
          userId,
          isActive: true,
        },
      },
    )
    return { message: "All notifications deleted successfully" }
  }

  // Helper methods for creating specific types of notifications
  async notifyNewAssignment(assignmentId: string, courseId: string, studentIds: string[]) {
    const course = await this.getCourseName(courseId)
    return this.bulkCreate({
      title: "New Assignment",
      message: `A new assignment has been posted for ${course}`,
      type: "assignment",
      userIds: studentIds,
      link: `/student/assignments/${assignmentId}`,
      metadata: {
        assignmentId,
        courseId,
      },
    })
  }

  async notifyGradePosted(studentId: string, courseId: string, assessmentId: string) {
    const course = await this.getCourseName(courseId)
    return this.create({
      title: "Grade Posted",
      message: `Your grade has been posted for ${course}`,
      type: "grade",
      userId: studentId,
      link: `/student/grades/${assessmentId}`,
      metadata: {
        assessmentId,
        courseId,
      },
    })
  }

  async notifyNewAnnouncement(title: string, message: string, userIds: string[], senderId?: string) {
    return this.bulkCreate({
      title,
      message,
      type: "announcement",
      userIds,
      senderId,
    })
  }

  async notifyCourseEnrollment(studentId: string, courseId: string) {
    const course = await this.getCourseName(courseId)
    return this.create({
      title: "Course Enrollment",
      message: `You have been enrolled in ${course}`,
      type: "enrollment",
      userId: studentId,
      link: `/student/courses/${courseId}`,
      metadata: {
        courseId,
      },
    })
  }

  async notifyCourseAssignment(lecturerId: string, courseId: string) {
    const course = await this.getCourseName(courseId)
    return this.create({
      title: "Course Assignment",
      message: `You have been assigned to teach ${course}`,
      type: "info",
      userId: lecturerId,
      link: `/lecturer/courses/${courseId}`,
      metadata: {
        courseId,
      },
    })
  }

  // Helper method to get course name
  private async getCourseName(courseId: string): Promise<string> {
    try {
      const { Course } = require("../models")
      const course = await Course.findByPk(courseId)
      return course ? course.name : "the course"
    } catch (error) {
      return "the course"
    }
  }
}
