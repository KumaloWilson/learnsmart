import { Op, fn, col, literal } from "sequelize"
import {
  User,
  StudentProfile,
  LecturerProfile,
  Course,
  Program,
  Department,
  School,
  CourseEnrollment,
  AcademicRecord,
  Assessment,
  Semester, // Import Semester model
} from "../models"
import type {
  DashboardStatsDto,
  EnrollmentStatsDto,
  AcademicPerformanceDto,
  UserActivityDto,
  CourseStatsDto,
} from "../dto/dashboard.dto"

export class DashboardService {
  async getOverviewStats(): Promise<DashboardStatsDto> {
    const [
      totalStudents,
      totalLecturers,
      totalCourses,
      totalPrograms,
      totalDepartments,
      totalSchools,
      activeStudents,
      activeLecturers,
      recentEnrollments,
      upcomingAssessments,
    ] = await Promise.all([
      StudentProfile.count(),
      LecturerProfile.count(),
      Course.count(),
      Program.count(),
      Department.count(),
      School.count(),
      StudentProfile.count({
        where: {
          status: "active",
        },
      }),
      LecturerProfile.count({
        where: {
          status: "active",
        },
      }),
      CourseEnrollment.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
          },
        },
      }),
      Assessment.count({
        where: {
          dueDate: {
            [Op.between]: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))], // Next 7 days
          },
        },
      }),
    ])

    return {
      totalStudents,
      totalLecturers,
      totalCourses,
      totalPrograms,
      totalDepartments,
      totalSchools,
      activeStudents,
      activeLecturers,
      recentEnrollments,
      upcomingAssessments,
    }
  }

  async getEnrollmentStats(): Promise<EnrollmentStatsDto> {
    const totalEnrollments = await CourseEnrollment.count()

    const enrollmentsByProgram = await CourseEnrollment.findAll({
      attributes: [
        [col("course.programId"), "programId"],
        [col("course.program.name"), "programName"],
        [fn("COUNT", col("CourseEnrollment.id")), "count"],
      ],
      include: [
        {
          model: Course,
          attributes: [],
          include: [
            {
              model: Program,
              attributes: [],
            },
          ],
        },
      ],
      group: [col("course.programId"), col("course.program.name")],
      raw: true,
    })

    const enrollmentsByLevel = await CourseEnrollment.findAll({
      attributes: [
        [col("studentProfile.currentLevel"), "level"],
        [fn("COUNT", col("CourseEnrollment.id")), "count"],
      ],
      include: [
        {
          model: StudentProfile,
          attributes: [],
        },
      ],
      group: [col("studentProfile.currentLevel")],
      raw: true,
    })

    // Get enrollment trend by month for the last 12 months
    const enrollmentTrend = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const count = await CourseEnrollment.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      })

      enrollmentTrend.push({
        period: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
        count,
      })
    }

    return {
      totalEnrollments,
      enrollmentsByProgram: enrollmentsByProgram.map((item: any) => ({
        programId: item.programId,
        programName: item.programName,
        count: Number(item.count),
      })),
      enrollmentsByLevel: enrollmentsByLevel.map((item: any) => ({
        level: Number(item.level),
        count: Number(item.count),
      })),
      enrollmentTrend,
    }
  }

  async getAcademicPerformance(): Promise<AcademicPerformanceDto> {
    const averageGpaResult = await AcademicRecord.findOne({
      attributes: [[fn("AVG", col("gpa")), "averageGpa"]],
      raw: true,
    })

    const averageGpa = Number(averageGpaResult?.gpa || 0)

    const performanceByProgram = await AcademicRecord.findAll({
      attributes: [
        [col("studentProfile.programId"), "programId"],
        [col("studentProfile.program.name"), "programName"],
        [fn("AVG", col("AcademicRecord.gpa")), "averageGpa"],
      ],
      include: [
        {
          model: StudentProfile,
          attributes: [],
          include: [
            {
              model: Program,
              attributes: [],
            },
          ],
        },
      ],
      group: [col("studentProfile.programId"), col("studentProfile.program.name")],
      raw: true,
    })

    const performanceByLevel = await AcademicRecord.findAll({
      attributes: [
        [col("studentProfile.currentLevel"), "level"],
        [fn("AVG", col("AcademicRecord.gpa")), "averageGpa"],
      ],
      include: [
        {
          model: StudentProfile,
          attributes: [],
        },
      ],
      group: [col("studentProfile.currentLevel")],
      raw: true,
    })

    // Get performance trend by semester for the last 6 semesters
    const performanceTrend = await AcademicRecord.findAll({
      attributes: [
        [col("semester.name"), "period"],
        [fn("AVG", col("AcademicRecord.gpa")), "averageGpa"],
      ],
      include: [
        {
          model: StudentProfile,
          attributes: [],
        },
        {
          model: Semester,
          attributes: [],
        },
      ],
      group: [col("semester.name")],
      order: [[col("semester.startDate"), "DESC"]],
      limit: 6,
      raw: true,
    })

    return {
      averageGpa,
      performanceByProgram: performanceByProgram.map((item: any) => ({
        programId: item.programId,
        programName: item.programName,
        averageGpa: Number(item.averageGpa),
      })),
      performanceByLevel: performanceByLevel.map((item: any) => ({
        level: Number(item.level),
        averageGpa: Number(item.averageGpa),
      })),
      performanceTrend: performanceTrend.map((item: any) => ({
        period: item.period,
        averageGpa: Number(item.averageGpa),
      })),
    }
  }

  async getUserActivity(): Promise<UserActivityDto> {
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))

    const [newUsers, activeUsers, usersByRole] = await Promise.all([
      User.count({
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
      }),
      User.count(),
      User.findAll({
        attributes: ["role", [fn("COUNT", col("id")), "count"]],
        group: ["role"],
        raw: true,
      }),
    ])

    // Get user registration trend by month for the last 12 months
    const activityTrend = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const count = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      })

      activityTrend.push({
        period: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`,
        count,
      })
    }

    return {
      newUsers,
      activeUsers,
      usersByRole: usersByRole.map((item: any) => ({
        role: item.role,
        count: Number(item.count),
      })),
      activityTrend,
    }
  }

  async getCourseStats(): Promise<CourseStatsDto> {
    const [totalCourses, activeCourses] = await Promise.all([
      Course.count(),
      Course.count({
        include: [
          {
            model: Semester,
            where: {
              isActive: true,
            },
            required: true,
          },
        ],
      }),
    ])

    const coursesByProgram = await Course.findAll({
      attributes: [
        ["programId", "programId"],
        [col("program.name"), "programName"],
        [fn("COUNT", col("Course.id")), "count"],
      ],
      include: [
        {
          model: Program,
          attributes: [],
        },
      ],
      group: ["Course.programId", "program.name"],
      raw: true,
    })

    const coursesByLevel = await Course.findAll({
      attributes: ["level", [fn("COUNT", col("id")), "count"]],
      group: ["level"],
      raw: true,
    })

    const popularCourses = await CourseEnrollment.findAll({
      attributes: [
        ["courseId", "courseId"],
        [col("course.name"), "courseName"],
        [fn("COUNT", col("CourseEnrollment.id")), "enrollmentCount"],
      ],
      include: [
        {
          model: Course,
          attributes: [],
        },
      ],
      group: ["CourseEnrollment.courseId", "course.name"],
      order: [[literal("enrollmentCount"), "DESC"]],
      limit: 10,
      raw: true,
    })

    return {
      totalCourses,
      activeCourses,
      coursesByProgram: coursesByProgram.map((item: any) => ({
        programId: item.programId,
        programName: item.programName,
        count: Number(item.count),
      })),
      coursesByLevel: coursesByLevel.map((item: any) => ({
        level: Number(item.level),
        count: Number(item.count),
      })),
      popularCourses: popularCourses.map((item: any) => ({
        courseId: item.courseId,
        courseName: item.courseName,
        enrollmentCount: Number(item.enrollmentCount),
      })),
    }
  }

  // Additional admin dashboard methods
  async getRecentActivity(limit = 10) {
    // Get recent enrollments
    const recentEnrollments = await CourseEnrollment.findAll({
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
        {
          model: Course,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    })

    // Get recent assessments
    const recentAssessments = await Assessment.findAll({
      include: [
        {
          model: Course,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    })

    // Get recent users
    const recentUsers = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit,
    })

    return {
      recentEnrollments,
      recentAssessments,
      recentUsers,
    }
  }

  async getUpcomingEvents(days = 7) {
    const endDate = new Date(new Date().setDate(new Date().getDate() + days))

    // Get upcoming assessments
    const upcomingAssessments = await Assessment.findAll({
      where: {
        dueDate: {
          [Op.between]: [new Date(), endDate],
        },
      },
      include: [
        {
          model: Course,
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    return {
      upcomingAssessments,
    }
  }

  async getSystemHealth() {
    // This would typically include server metrics, database stats, etc.
    // For this example, we'll return some mock data
    return {
      status: "healthy",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      databaseConnections: 10, // Mock value
      activeUsers: 25, // Mock value
      apiRequests: {
        total: 1000,
        successful: 950,
        failed: 50,
      },
      lastBackup: new Date(new Date().setDate(new Date().getDate() - 1)),
    }
  }
}
