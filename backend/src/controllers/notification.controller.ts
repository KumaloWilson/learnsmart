import type { Request, Response } from "express"
import { NotificationService } from "../services/notification.service"
import type {
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkCreateNotificationDto,
  NotificationFilterDto,
} from "../dto/notification.dto"

export class NotificationController {
  private notificationService: NotificationService

  constructor() {
    this.notificationService = new NotificationService()
  }

  getAllNotifications = async (req: Request, res: Response) => {
    try {
      const filters: NotificationFilterDto = {}

      if (req.query.userId) {
        filters.userId = req.query.userId as string
      }
      if (req.query.type) {
        filters.type = req.query.type as string
      }
      if (req.query.isRead !== undefined) {
        filters.isRead = req.query.isRead === "true"
      }
      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string)
      }
      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string)
      }

      const notifications = await this.notificationService.findAll(filters)
      return res.status(200).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching notifications", error: error.message })
    }
  }

  getNotificationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.findById(id)

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      return res.status(200).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching notification", error: error.message })
    }
  }

  getUserNotifications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const isRead = req.query.isRead !== undefined ? req.query.isRead === "true" : undefined

      // Ensure the user can only access their own notifications unless they're an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to access these notifications" })
      }

      const notifications = await this.notificationService.findByUser(userId, isRead)
      return res.status(200).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching user notifications", error: error.message })
    }
  }

  getUnreadCount = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params

      // Ensure the user can only access their own notifications unless they're an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to access these notifications" })
      }

      const count = await this.notificationService.countUnread(userId)
      return res.status(200).json({ count })
    } catch (error: any) {
      return res.status(500).json({ message: "Error counting unread notifications", error: error.message })
    }
  }

  createNotification = async (req: Request, res: Response) => {
    try {
      const data: CreateNotificationDto = req.body
      const notification = await this.notificationService.create(data)
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating notification", error: error.message })
    }
  }

  bulkCreateNotifications = async (req: Request, res: Response) => {
    try {
      const data: BulkCreateNotificationDto = req.body
      const notifications = await this.notificationService.bulkCreate(data)
      return res.status(201).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating notifications", error: error.message })
    }
  }

  updateNotification = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateNotificationDto = req.body
      const notification = await this.notificationService.update(id, data)
      return res.status(200).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating notification", error: error.message })
    }
  }

  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.findById(id)

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      // Ensure the user can only mark their own notifications as read unless they're an admin
      if (req.user?.id !== notification.userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to mark this notification as read" })
      }

      const updatedNotification = await this.notificationService.markAsRead(id)
      return res.status(200).json(updatedNotification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking notification as read", error: error.message })
    }
  }

  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params

      // Ensure the user can only mark their own notifications as read unless they're an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to mark these notifications as read" })
      }

      const result = await this.notificationService.markAllAsRead(userId)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking all notifications as read", error: error.message })
    }
  }

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.findById(id)

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      // Ensure the user can only delete their own notifications unless they're an admin
      if (req.user?.id !== notification.userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to delete this notification" })
      }

      const result = await this.notificationService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting notification", error: error.message })
    }
  }

  deleteAllForUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params

      // Ensure the user can only delete their own notifications unless they're an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to delete these notifications" })
      }

      const result = await this.notificationService.deleteAllForUser(userId)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting all notifications", error: error.message })
    }
  }

  // Special notification creation endpoints
  notifyNewAssignment = async (req: Request, res: Response) => {
    try {
      const { assignmentId, courseId, studentIds } = req.body
      const notifications = await this.notificationService.notifyNewAssignment(assignmentId, courseId, studentIds)
      return res.status(201).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating assignment notifications", error: error.message })
    }
  }

  notifyGradePosted = async (req: Request, res: Response) => {
    try {
      const { studentId, courseId, assessmentId } = req.body
      const notification = await this.notificationService.notifyGradePosted(studentId, courseId, assessmentId)
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating grade notification", error: error.message })
    }
  }

  notifyNewAnnouncement = async (req: Request, res: Response) => {
    try {
      const { title, message, userIds, senderId } = req.body
      const notifications = await this.notificationService.notifyNewAnnouncement(title, message, userIds, senderId)
      return res.status(201).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating announcement notifications", error: error.message })
    }
  }

  notifyCourseEnrollment = async (req: Request, res: Response) => {
    try {
      const { studentId, courseId } = req.body
      const notification = await this.notificationService.notifyCourseEnrollment(studentId, courseId)
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating enrollment notification", error: error.message })
    }
  }

  notifyCourseAssignment = async (req: Request, res: Response) => {
    try {
      const { lecturerId, courseId } = req.body
      const notification = await this.notificationService.notifyCourseAssignment(lecturerId, courseId)
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating course assignment notification", error: error.message })
    }
  }
}
