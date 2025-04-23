import { Op } from "sequelize"
import {
  PhysicalAttendance,
  VirtualClassAttendance,
  LecturerProfile,
  Course,
  Semester,
  StudentProfile,
  User,
  VirtualClass,
} from "../models"
import type {
  CreatePhysicalAttendanceDto,
  UpdatePhysicalAttendanceDto,
  BulkCreateAttendanceDto,
  AttendanceFilterDto,
  AttendanceStatisticsDto,
  AttendanceStatisticsParamsDto,
} from "../dto/attendance.dto"

export class AttendanceService {
  // Physical attendance methods
  async findAll(filters?: AttendanceFilterDto) {
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
      if (filters.studentProfileId) {
        whereClause.studentProfileId = filters.studentProfileId
      }
      if (filters.isPresent !== undefined) {
        whereClause.isPresent = filters.isPresent
      }
      if (filters.startDate && filters.endDate) {
        whereClause.date = {
          [Op.between]: [filters.startDate, filters.endDate],
        }
      } else if (filters.startDate) {
        whereClause.date = {
          [Op.gte]: filters.startDate,
        }
      } else if (filters.endDate) {
        whereClause.date = {
          [Op.lte]: filters.endDate,
        }
      }
    }

    return PhysicalAttendance.findAll({
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
      order: [["date", "DESC"]],
    })
  }

  async findById(id: string) {
    return PhysicalAttendance.findByPk(id, {
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

  async create(data: CreatePhysicalAttendanceDto) {
    // Check if attendance record already exists
    const existingAttendance = await PhysicalAttendance.findOne({
      where: {
        date: data.date,
        courseId: data.courseId,
        semesterId: data.semesterId,
        studentProfileId: data.studentProfileId,
      },
    })

    if (existingAttendance) {
      // Update existing record
      return this.update(existingAttendance.id, {
        topic: data.topic,
        notes: data.notes,
        isPresent: data.isPresent,
      })
    }

    // Create new attendance record
    return PhysicalAttendance.create(data as any)
  }

  async update(id: string, data: UpdatePhysicalAttendanceDto) {
    const attendance = await PhysicalAttendance.findByPk(id)
    if (!attendance) {
      throw new Error("Attendance record not found")
    }

    await attendance.update(data)
    return this.findById(id)
  }

  async bulkCreate(data: BulkCreateAttendanceDto) {
    const results = []
    for (const attendance of data.attendances) {
      const result = await this.create({
        date: data.date,
        topic: data.topic,
        notes: data.notes,
        lecturerProfileId: data.lecturerProfileId,
        courseId: data.courseId,
        semesterId: data.semesterId,
        studentProfileId: attendance.studentProfileId,
        isPresent: attendance.isPresent,
      })
      results.push(result)
    }
    return results
  }

  async delete(id: string) {
    const attendance = await PhysicalAttendance.findByPk(id)
    if (!attendance) {
      throw new Error("Attendance record not found")
    }

    await attendance.destroy()
    return { message: "Attendance record deleted successfully" }
  }

  // Combined attendance statistics (physical + virtual)
  async getAttendanceStatistics(params: AttendanceStatisticsParamsDto): Promise<AttendanceStatisticsDto> {
    const { courseId, semesterId, studentProfileId } = params

    // Get physical attendance records
    const physicalWhereClause: any = {
      courseId,
      semesterId,
    }

    if (studentProfileId) {
      physicalWhereClause.studentProfileId = studentProfileId
    }

    const physicalAttendances = await PhysicalAttendance.findAll({
      where: physicalWhereClause,
    })

    // Get virtual attendance records
    const virtualClasses = await VirtualClass.findAll({
      where: {
        courseId,
        semesterId,
        status: {
          [Op.in]: ["completed", "in_progress"],
        },
      },
    })

    const virtualClassIds = virtualClasses.map((vc) => vc.id)

    const virtualWhereClause: any = {
      virtualClassId: {
        [Op.in]: virtualClassIds,
      },
    }

    if (studentProfileId) {
      virtualWhereClause.studentProfileId = studentProfileId
    }

    const virtualAttendances = await VirtualClassAttendance.findAll({
      where: virtualWhereClause,
    })

    // Calculate statistics
    const totalPhysicalClasses = await this.countUniqueDates(physicalWhereClause)
    const totalVirtualClasses = virtualClasses.length
    const totalClasses = totalPhysicalClasses + totalVirtualClasses

    let presentCount = 0
    let absentCount = 0

    if (studentProfileId) {
      // For a specific student
      presentCount =
        physicalAttendances.filter((a) => a.isPresent).length + virtualAttendances.filter((a) => a.isPresent).length
      absentCount = totalClasses - presentCount
    } else {
      // For all students in the course
      const uniqueStudents = await this.getUniqueStudentsInCourse(courseId, semesterId)
      const totalPossibleAttendances = uniqueStudents.length * totalClasses

      const physicalPresentCount = physicalAttendances.filter((a) => a.isPresent).length
      const virtualPresentCount = virtualAttendances.filter((a) => a.isPresent).length
      presentCount = physicalPresentCount + virtualPresentCount
      absentCount = totalPossibleAttendances - presentCount
    }

    const attendancePercentage = totalClasses > 0 ? (presentCount / (presentCount + absentCount)) * 100 : 0

    return {
      totalClasses,
      totalPhysicalClasses,
      totalVirtualClasses,
      presentCount,
      absentCount,
      attendancePercentage,
    }
  }

  async getStudentAttendanceDetails(studentProfileId: string, courseId: string, semesterId: string) {
    // Get physical attendance records
    const physicalAttendances = await PhysicalAttendance.findAll({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
      order: [["date", "DESC"]],
    })

    // Get virtual attendance records
    const virtualClasses = await VirtualClass.findAll({
      where: {
        courseId,
        semesterId,
        status: {
          [Op.in]: ["completed", "in_progress"],
        },
      },
    })

    const virtualClassIds = virtualClasses.map((vc) => vc.id)

    const virtualAttendances = await VirtualClassAttendance.findAll({
      where: {
        studentProfileId,
        virtualClassId: {
          [Op.in]: virtualClassIds,
        },
      },
      include: [
        {
          model: VirtualClass,
        },
      ],
    })

    // Format the attendance records
    const physicalRecords = physicalAttendances.map((pa) => ({
      id: pa.id,
      date: pa.date,
      type: "physical",
      topic: pa.topic,
      isPresent: pa.isPresent,
      notes: pa.notes,
    }))

    const virtualRecords = virtualAttendances.map((va) => ({
      id: va.id,
      date: va.virtualClass?.scheduledStartTime,
      type: "virtual",
      topic: va.virtualClass?.title,
      isPresent: va.isPresent,
      joinTime: va.joinTime,
      leaveTime: va.leaveTime,
      durationMinutes: va.durationMinutes,
      notes: va.notes,
    }))

    // Combine and sort by date
    const allRecords = [...physicalRecords, ...virtualRecords].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      return dateB - dateA // Sort in descending order (newest first)
    })

    // Calculate statistics
    const stats = await this.getAttendanceStatistics({
      courseId,
      semesterId,
      studentProfileId,
    })

    return {
      records: allRecords,
      statistics: stats,
    }
  }

  async getClassAttendanceReport(courseId: string, semesterId: string) {
    // Get all students enrolled in the course
    const { CourseEnrollment, StudentProfile } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
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

    // Get attendance statistics for each student
    const studentReports = []
    for (const enrollment of enrollments) {
      const studentProfileId = enrollment.studentProfileId
      const stats = await this.getAttendanceStatistics({
        courseId,
        semesterId,
        studentProfileId,
      })

      studentReports.push({
        studentProfileId,
        studentName: `${enrollment.studentProfile?.user?.firstName} ${enrollment.studentProfile?.user?.lastName}`,
        studentEmail: enrollment.studentProfile?.user?.email,
        attendancePercentage: stats.attendancePercentage,
        presentCount: stats.presentCount,
        absentCount: stats.absentCount,
        totalClasses: stats.totalClasses,
      })
    }

    // Sort by attendance percentage (descending)
    studentReports.sort((a, b) => b.attendancePercentage - a.attendancePercentage)

    // Calculate class average
    const classAverage =
      studentReports.length > 0
        ? studentReports.reduce((sum, report) => sum + report.attendancePercentage, 0) / studentReports.length
        : 0

    return {
      courseId,
      semesterId,
      totalStudents: studentReports.length,
      classAverageAttendance: classAverage,
      studentReports,
    }
  }

  // Helper methods
  private async countUniqueDates(whereClause: any): Promise<number> {
    const attendances = await PhysicalAttendance.findAll({
      where: whereClause,
      attributes: ["date"],
      group: ["date"],
    })
    return attendances.length
  }

  private async getUniqueStudentsInCourse(courseId: string, semesterId: string): Promise<string[]> {
    const { CourseEnrollment } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
      attributes: ["studentProfileId"],
    })
    return enrollments.map((e: any) => e.studentProfileId)
  }
}
