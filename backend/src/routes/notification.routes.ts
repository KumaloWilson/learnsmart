import { Router } from "express"
import { NotificationController } from "../controllers/notification.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"
import { validate, notificationValidation } from "../middlewares/validation.middleware"

const router = Router()
const notificationController = new NotificationController()

// Admin routes
router.get("/", [authMiddleware, adminMiddleware], notificationController.getAllNotifications)
router.post(
  "/",
  [authMiddleware, adminMiddleware, validate(notificationValidation.createNotification)],
  notificationController.createNotification,
)
router.post(
  "/bulk",
  [authMiddleware, adminMiddleware, validate(notificationValidation.bulkCreateNotifications)],
  notificationController.bulkCreateNotifications,
)

// Special notification creation endpoints (admin only)
router.post(
  "/assignment",
  [authMiddleware, adminMiddleware, validate(notificationValidation.notifyNewAssignment)],
  notificationController.notifyNewAssignment,
)
router.post(
  "/grade",
  [authMiddleware, adminMiddleware, validate(notificationValidation.notifyGradePosted)],
  notificationController.notifyGradePosted,
)
router.post(
  "/announcement",
  [authMiddleware, adminMiddleware, validate(notificationValidation.notifyNewAnnouncement)],
  notificationController.notifyNewAnnouncement,
)
router.post(
  "/enrollment",
  [authMiddleware, adminMiddleware, validate(notificationValidation.notifyCourseEnrollment)],
  notificationController.notifyCourseEnrollment,
)
router.post(
  "/course-assignment",
  [authMiddleware, adminMiddleware, validate(notificationValidation.notifyCourseAssignment)],
  notificationController.notifyCourseAssignment,
)

// User routes (protected by auth)
router.get("/:id", authMiddleware, notificationController.getNotificationById)
router.get("/user/:userId", authMiddleware, notificationController.getUserNotifications)
router.get("/user/:userId/unread-count", authMiddleware, notificationController.getUnreadCount)
router.put(
  "/:id",
  [authMiddleware, validate(notificationValidation.updateNotification)],
  notificationController.updateNotification,
)
router.put("/:id/read", authMiddleware, notificationController.markAsRead)
router.put("/user/:userId/read-all", authMiddleware, notificationController.markAllAsRead)
router.delete("/:id", authMiddleware, notificationController.deleteNotification)
router.delete("/user/:userId/delete-all", authMiddleware, notificationController.deleteAllForUser)

export default router
