import { Op } from "sequelize"
import {
  VirtualClass,
  VirtualClassAttendance,
  LecturerProfile,
  Course,
  Semester,
  StudentProfile,
  User,
} from "../models"
import { NotificationService } from "./notification.service"
import type {
  CreateVirtualClassDto,
  UpdateVirtualClassDto,
  VirtualClassAttendanceDto,
  UpdateVirtualClassAttendanceDto,
  VirtualClassFilterDto,
} from "../dto/virtual-class.dto"

export class VirtualClassService {
  private notificationService: NotificationService
  private jitsiApiKey: string
  private jitsiApiSecret: string

  constructor() {
    this.notificationService = new NotificationService()
    this.jitsiApiKey = process.env.JITSI_API_KEY || ""
    this.jitsiApiSecret = process.env.JITSI_API_SECRET || ""
  }

  async findAll(filters?: VirtualClassFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.lecturerProfileId) {
        whereClause.lecturerProfileId = filters.lecturerProfileId
      }
      if (filters.courseId) {
        whereClause.courseId = filters.courseId
      }
      if (filters.semesterId) {
        whereClause.semesterId = filters.semesterId
      }
      if (filters.status) {
        whereClause.status = filters.status
      }
      if (filters.startDate && filters.endDate) {
        whereClause.scheduledStartTime = {
          [Op.between]: [filters.startDate, filters.endDate],
        }
      } else if (filters.startDate) {
        whereClause.scheduledStartTime = {
          [Op.gte]: filters.startDate,
        }
      } else if (filters.endDate) {
        whereClause.scheduledStartTime = {
          [Op.lte]: filters.endDate,
        }
      }
    }

    return VirtualClass.findAll({
      where: whereClause,
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["scheduledStartTime", "DESC"]],
    })
  }

  async findById(id: string) {
    return VirtualClass.findByPk(id, {
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: VirtualClassAttendance,
          include: [
            {
              model: StudentProfile,
              include: [
                {
                  model: User,
                  attributes: ["firstName", "lastName", "email"],
                },
              ],
            },
          ],
        },
      ],
    })
  }

  async findUpcoming(lecturerProfileId: string, limit = 5) {
    const now = new Date()
    return VirtualClass.findAll({
      where: {
        lecturerProfileId,
        scheduledStartTime: {
          [Op.gt]: now,
        },
        status: "scheduled",
      },
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["scheduledStartTime", "ASC"]],
      limit,
    })
  }

  async create(data: CreateVirtualClassDto) {
    // Create the virtual class
    const virtualClass = await VirtualClass.create(data as any)

    // Create Jitsi meeting
    try {
      const meetingDetails = await this.createJitsiMeeting(virtualClass.id, data.title)
      await virtualClass.update({
        meetingId: meetingDetails.meetingId,
        meetingLink: meetingDetails.meetingLink,
      })
    } catch (error) {
      console.error("Error creating Jitsi meeting:", error)
      // Continue even if Jitsi creation fails
    }

    // Notify enrolled students
    try {
      await this.notifyStudents(virtualClass.id)
    } catch (error) {
      console.error("Error notifying students:", error)
    }

    return this.findById(virtualClass.id)
  }

  async update(id: string, data: UpdateVirtualClassDto) {
    const virtualClass = await VirtualClass.findByPk(id)
    if (!virtualClass) {
      throw new Error("Virtual class not found")
    }

    // If status is changing to in_progress, set actualStartTime
    if (data.status === "in_progress" && virtualClass.status !== "in_progress") {
      data.actualStartTime = new Date()
    }

    // If status is changing to completed, set actualEndTime and calculate duration
    if (data.status === "completed" && virtualClass.status !== "completed") {
      data.actualEndTime = new Date()
      if (virtualClass.actualStartTime) {
        const startTime = virtualClass.actualStartTime.getTime()
        const endTime = data.actualEndTime.getTime()
        data.duration = Math.floor((endTime - startTime) / (1000 * 60)) // Duration in minutes
      }
    }

    await virtualClass.update(data)
    return this.findById(id)
  }

  async delete(id: string) {
    const virtualClass = await VirtualClass.findByPk(id)
    if (!virtualClass) {
      throw new Error("Virtual class not found")
    }

    // Cancel the class instead of deleting it
    await virtualClass.update({ status: "cancelled" })

    // Notify enrolled students about cancellation
    try {
      await this.notifyCancellation(id)
    } catch (error) {
      console.error("Error notifying students about cancellation:", error)
    }

    return { message: "Virtual class cancelled successfully" }
  }

  // Attendance methods
  async getAttendance(virtualClassId: string) {
    return VirtualClassAttendance.findAll({
      where: { virtualClassId },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async recordAttendance(data: VirtualClassAttendanceDto) {
    // Check if attendance record already exists
    const existingAttendance = await VirtualClassAttendance.findOne({
      where: {
        virtualClassId: data.virtualClassId,
        studentProfileId: data.studentProfileId,
      },
    })

    if (existingAttendance) {
      // Update existing record
      return this.updateAttendance(existingAttendance.id, data)
    }

    // Create new attendance record
    return VirtualClassAttendance.create(data as any)
  }

  async updateAttendance(id: string, data: UpdateVirtualClassAttendanceDto) {
    const attendance = await VirtualClassAttendance.findByPk(id)
    if (!attendance) {
      throw new Error("Attendance record not found")
    }

    // If both join and leave times are provided, calculate duration
    if (data.joinTime && data.leaveTime) {
      const joinTime = new Date(data.joinTime).getTime()
      const leaveTime = new Date(data.leaveTime).getTime()
      data.durationMinutes = Math.floor((leaveTime - joinTime) / (1000 * 60)) // Duration in minutes
    }

    await attendance.update(data)
    return VirtualClassAttendance.findByPk(id, {
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async bulkRecordAttendance(virtualClassId: string, attendances: { studentProfileId: string; isPresent: boolean }[]) {
    const results = []
    for (const attendance of attendances) {
      const result = await this.recordAttendance({
        virtualClassId,
        studentProfileId: attendance.studentProfileId,
        isPresent: attendance.isPresent,
      })
      results.push(result)
    }
    return results
  }

  // Jitsi integration methods
  private async createJitsiMeeting(virtualClassId: string, title: string) {
    try {
      // This is a simplified example. In a real implementation, you would use the Jitsi API
      // to create a meeting and get the meeting ID and link.
      const meetingId = `learn-smart-${virtualClassId}`
      const meetingLink = `https://meet.jit.si/${meetingId}`

      // If you have JaaS credentials, you would make an API call like this:
      /*
      const response = await axios.post(
        'https://api.jaas.8x8.vc/meetings',
        {
          name: title,
          start_time: new Date().toISOString(),
          duration: 60, // minutes
          settings: {
            lobby_enabled: true,
            recording_enabled: true,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.jitsiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        meetingId: response.data.id,
        meetingLink: response.data.join_link
      };
      */

      return {
        meetingId,
        meetingLink,
      }
    } catch (error) {
      console.error("Error creating Jitsi meeting:", error)
      throw new Error("Failed to create virtual meeting")
    }
  }

  // Notification methods
  private async notifyStudents(virtualClassId: string) {
    const virtualClass = await this.findById(virtualClassId)
    if (!virtualClass || !virtualClass.course) {
      throw new Error("Virtual class or course not found")
    }

    // Get all students enrolled in the course
    const { CourseEnrollment, StudentProfile } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId: virtualClass.courseId,
        semesterId: virtualClass.semesterId,
        status: "enrolled",
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["id"],
            },
          ],
        },
      ],
    })

    // Send notification to each student
    const userIds = enrollments.map((enrollment: any) => enrollment.studentProfile?.user?.id).filter((id: string) => id)

    if (userIds.length > 0) {
      await this.notificationService.notifyNewAnnouncement(
        "Virtual Class Scheduled",
        `A new virtual class for ${virtualClass.course.name} has been scheduled on ${new Date(
          virtualClass.scheduledStartTime,
        ).toLocaleString()}`,
        userIds,
        virtualClass.lecturerProfileId,
      )
    }
  }

  private async notifyCancellation(virtualClassId: string) {
    const virtualClass = await this.findById(virtualClassId)
    if (!virtualClass || !virtualClass.course) {
      throw new Error("Virtual class or course not found")
    }

    // Get all students enrolled in the course
    const { CourseEnrollment, StudentProfile } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId: virtualClass.courseId,
        semesterId: virtualClass.semesterId,
        status: "enrolled",
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["id"],
            },
          ],
        },
      ],
    })

    // Send notification to each student
    const userIds = enrollments.map((enrollment: any) => enrollment.studentProfile?.user?.id).filter((id: string) => id)

    if (userIds.length > 0) {
      await this.notificationService.notifyNewAnnouncement(
        "Virtual Class Cancelled",
        `The virtual class for ${virtualClass.course.name} scheduled on ${new Date(
          virtualClass.scheduledStartTime,
        ).toLocaleString()} has been cancelled.`,
        userIds,
        virtualClass.lecturerProfileId,
      )
    }
  }

  // Analytics methods
  async getAttendanceStatistics(virtualClassId: string) {
    const attendances = await VirtualClassAttendance.findAll({
      where: { virtualClassId },
    })

    const totalStudents = attendances.length
    const presentStudents = attendances.filter((a) => a.isPresent).length
    const absentStudents = totalStudents - presentStudents
    const attendancePercentage = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0

    return {
      totalStudents,
      presentStudents,
      absentStudents,
      attendancePercentage,
    }
  }

  async getVirtualClassesByCourse(courseId: string, semesterId: string) {
    return VirtualClass.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
      order: [["scheduledStartTime", "DESC"]],
    })
  }
}
