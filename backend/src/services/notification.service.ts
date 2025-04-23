import { Notification } from "../models/Notification"
import { User } from "../models/User"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { StudentProfile } from "../models/StudentProfile"
import { LecturerProfile } from "../models/LecturerProfile"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"

export class NotificationService {
  async getAllNotifications(): Promise<Notification[]> {
    return Notification.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return Notification.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    })
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Notification.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }

  async createNotification(notificationData: any): Promise<Notification> {
    return Notification.create(notificationData)
  }

  async bulkCreateNotifications(notifications: any[]): Promise<Notification[]> {
    return Notification.bulkCreate(notifications)
  }

  async updateNotification(id: string, notificationData: any): Promise<Notification | null> {
    const notification = await Notification.findByPk(id)
    if (!notification) {
      return null
    }

    return notification.update(notificationData)
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await Notification.findByPk(id)
    if (!notification) {
      return null
    }

    return notification.update({ isRead: true })
  }

  async markAllAsRead(userId: string): Promise<number> {
    const [affectedCount] = await Notification.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false,
        },
      },
    )

    return affectedCount
  }

  async deleteNotification(id: string): Promise<boolean> {
    const notification = await Notification.findByPk(id)
    if (!notification) {
      return false
    }

    await notification.destroy()
    return true
  }

  async deleteAllForUser(userId: string): Promise<number> {
    return Notification.destroy({
      where: { userId },
    })
  }

  // Special notification creation methods
  async notifyNewAssignment(data: {
    courseId: string
    semesterId: string
    assessmentId: string
    title: string
    dueDate: Date
  }): Promise<Notification[]> {
    try {
      // Find all students enrolled in this course
      const enrollments = await CourseEnrollment.findAll({
        where: {
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
        include: [
          {
            model: StudentProfile,
            as: "studentProfile",
            include: [
              {
                model: User,
                as: "user",
              },
            ],
          },
        ],
      })

      // Create a notification for each student
      const notifications = []

      for (const enrollment of enrollments) {
        if (!enrollment.studentProfile) {
          continue;
        }
        const userId = enrollment.studentProfile.id

        const notification = await this.createNotification({
          userId,
          title: `New Assignment: ${data.title}`,
          message: `A new assignment has been posted for your course. Due date: ${new Date(data.dueDate).toLocaleDateString()}`,
          type: "assignment",
          isRead: false,
          metadata: {
            assessmentId: data.assessmentId,
            courseId: data.courseId,
            semesterId: data.semesterId,
          },
        })

        notifications.push(notification)
      }

      return notifications
    } catch (error) {
      console.error("Error in notifyNewAssignment:", error)
      throw error
    }
  }

  async notifyGradePosted(data: {
    studentProfileId: string
    assessmentId: string
    grade: number
  }): Promise<Notification | null> {
    try {
      // Find the student profile
      const studentProfile = await StudentProfile.findByPk(data.studentProfileId, {
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      })

      if (!studentProfile) {
        return null
      }

      // Create a notification for the student
      return this.createNotification({
        userId: studentProfile.userId,
        title: "Grade Posted",
        message: `Your assignment has been graded. You received a grade of ${data.grade}.`,
        type: "grade",
        isRead: false,
        metadata: {
          assessmentId: data.assessmentId,
          grade: data.grade,
        },
      })
    } catch (error) {
      console.error("Error in notifyGradePosted:", error)
      throw error
    }
  }

  async notifyNewAnnouncement(data: { courseId: string; semesterId: string; title: string; message: string }): Promise<
    Notification[]
  > {
    try {
      // Find all students enrolled in this course
      const enrollments = await CourseEnrollment.findAll({
        where: {
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
        include: [
          {
            model: StudentProfile,
            as: "studentProfile",
            include: [
              {
                model: User,
                as: "user",
              },
            ],
          },
        ],
      })

      // Create a notification for each student
      const notifications = []

      for (const enrollment of enrollments) {
        if (!enrollment.studentProfile) {
          continue;
        }
        const userId = enrollment.studentProfile.id

        const notification = await this.createNotification({
          userId,
          title: data.title,
          message: data.message,
          type: "announcement",
          isRead: false,
          metadata: {
            courseId: data.courseId,
            semesterId: data.semesterId,
          },
        })

        notifications.push(notification)
      }

      return notifications
    } catch (error) {
      console.error("Error in notifyNewAnnouncement:", error)
      throw error
    }
  }

  async notifyCourseEnrollment(data: {
    studentProfileId: string
    courseId: string
    semesterId: string
  }): Promise<Notification | null> {
    try {
      // Find the student profile
      const studentProfile = await StudentProfile.findByPk(data.studentProfileId, {
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      })

      if (!studentProfile) {
        return null
      }

      // Find the course
      const course = await Course.findByPk(data.courseId)

      if (!course) {
        return null
      }

      // Find the semester
      const semester = await Semester.findByPk(data.semesterId)

      if (!semester) {
        return null
      }

      // Create a notification for the student
      return this.createNotification({
        userId: studentProfile.userId,
        title: "Course Enrollment",
        message: `You have been enrolled in ${course.name} for ${semester.name}.`,
        type: "enrollment",
        isRead: false,
        metadata: {
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
      })
    } catch (error) {
      console.error("Error in notifyCourseEnrollment:", error)
      throw error
    }
  }

  async notifyCourseAssignment(data: {
    lecturerProfileId: string
    courseId: string
    semesterId: string
  }): Promise<Notification | null> {
    try {
      // Find the lecturer profile
      const lecturerProfile = await LecturerProfile.findByPk(data.lecturerProfileId, {
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      })

      if (!lecturerProfile) {
        return null
      }

      // Find the course
      const course = await Course.findByPk(data.courseId)

      if (!course) {
        return null
      }

      // Find the semester
      const semester = await Semester.findByPk(data.semesterId)

      if (!semester) {
        return null
      }

      // Create a notification for the lecturer
      return this.createNotification({
        userId: lecturerProfile.userId,
        title: "Course Assignment",
        message: `You have been assigned to teach ${course.name} for ${semester.name}.`,
        type: "course_assignment",
        isRead: false,
        metadata: {
          courseId: data.courseId,
          semesterId: data.semesterId,
        },
      })
    } catch (error) {
      console.error("Error in notifyCourseAssignment:", error)
      throw error
    }
  }
}
