import type { Request, Response } from "express"
import { NotificationService } from "../services/notification.service"
import type {
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkCreateNotificationDto,
} from "../dto/notification.dto"

export class NotificationController {
  private notificationService: NotificationService

  constructor() {
    this.notificationService = new NotificationService()
  }

  getAllNotifications = async (req: Request, res: Response) => {
    try {
      const notifications = await this.notificationService.getAllNotifications()
      return res.status(200).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching notifications", error: error.message })
    }
  }

  getNotificationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.getNotificationById(id)

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

      // Ensure the user can only access their own notifications unless they're an admin
      if (req.user?.id !== userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to access these notifications" })
      }

      const notifications = await this.notificationService.getUserNotifications(userId)
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

      const count = await this.notificationService.getUnreadCount(userId)
      return res.status(200).json({ count })
    } catch (error: any) {
      return res.status(500).json({ message: "Error counting unread notifications", error: error.message })
    }
  }

  createNotification = async (req: Request, res: Response) => {
    try {
      const data: CreateNotificationDto = req.body
      const notification = await this.notificationService.createNotification(data)
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating notification", error: error.message })
    }
  }

  bulkCreateNotifications = async (req: Request, res: Response) => {
    try {
      const notifications: any[] = req.body
      const createdNotifications = await this.notificationService.bulkCreateNotifications(notifications)
      return res.status(201).json(createdNotifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating notifications", error: error.message })
    }
  }

  updateNotification = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateNotificationDto = req.body
      const notification = await this.notificationService.updateNotification(id, data)
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }
      
      return res.status(200).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating notification", error: error.message })
    }
  }

  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.getNotificationById(id)

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

      const affectedCount = await this.notificationService.markAllAsRead(userId)
      return res.status(200).json({ affectedCount })
    } catch (error: any) {
      return res.status(500).json({ message: "Error marking all notifications as read", error: error.message })
    }
  }

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const notification = await this.notificationService.getNotificationById(id)

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      // Ensure the user can only delete their own notifications unless they're an admin
      if (req.user?.id !== notification.userId && req.user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to delete this notification" })
      }

      const result = await this.notificationService.deleteNotification(id)
      return res.status(200).json({ success: result })
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

      const affectedCount = await this.notificationService.deleteAllForUser(userId)
      return res.status(200).json({ affectedCount })
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting all notifications", error: error.message })
    }
  }

  // Special notification creation endpoints
  notifyNewAssignment = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId, assessmentId, title, dueDate } = req.body
      
      const notifications = await this.notificationService.notifyNewAssignment({
        courseId,
        semesterId,
        assessmentId,
        title,
        dueDate: new Date(dueDate)
      })
      
      return res.status(201).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating assignment notifications", error: error.message })
    }
  }

  notifyGradePosted = async (req: Request, res: Response) => {
    try {
      const { studentProfileId, assessmentId, grade } = req.body
      
      const notification = await this.notificationService.notifyGradePosted({
        studentProfileId,
        assessmentId,
        grade
      })
      
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating grade notification", error: error.message })
    }
  }

  notifyNewAnnouncement = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId, title, message } = req.body
      
      const notifications = await this.notificationService.notifyNewAnnouncement({
        courseId,
        semesterId,
        title,
        message
      })
      
      return res.status(201).json(notifications)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating announcement notifications", error: error.message })
    }
  }

  notifyCourseEnrollment = async (req: Request, res: Response) => {
    try {
      const { studentProfileId, courseId, semesterId } = req.body
      
      const notification = await this.notificationService.notifyCourseEnrollment({
        studentProfileId,
        courseId,
        semesterId
      })
      
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating enrollment notification", error: error.message })
    }
  }

  notifyCourseAssignment = async (req: Request, res: Response) => {
    try {
      const { lecturerProfileId, courseId, semesterId } = req.body
      
      const notification = await this.notificationService.notifyCourseAssignment({
        lecturerProfileId,
        courseId,
        semesterId
      })
      
      return res.status(201).json(notification)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating course assignment notification", error: error.message })
    }
  }
}