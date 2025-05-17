import { CourseMastery } from "../models/CourseMastery"
import { TopicProgress } from "../models/TopicProgress"
import { CourseTopic } from "../models/CourseTopic"
import { StudentProfile } from "../models/StudentProfile"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { User } from "../models/User"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { Op } from "sequelize"

export class CourseMasteryService {
  /**
   * Calculate and update course mastery for a student
   */
  async calculateAndUpdateCourseMastery(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<CourseMastery> {
    // Get all topics for the course
    const topics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
        isActive: true,
      },
    })

    if (topics.length === 0) {
      throw new Error("No active topics found for this course")
    }

    // Get progress for each topic
    const progress = await TopicProgress.findAll({
      where: {
        studentProfileId,
        courseTopicId: {
          [Op.in]: topics.map((topic) => topic.id),
        },
      },
    })

    // Calculate mastery level
    let masteryLevel = 0
    if (progress.length > 0) {
      // Sum up mastery levels for all topics
      const totalMasteryLevel = progress.reduce((sum, p) => sum + p.masteryLevel, 0)
      // Calculate average mastery level
      masteryLevel = totalMasteryLevel / topics.length
    }

    // Find or create course mastery record
    const [courseMastery, created] = await CourseMastery.findOrCreate({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
      defaults: {
        masteryLevel,
        lastUpdated: new Date(),
      },
    })

    // If not created, update the existing record
    if (!created) {
      await courseMastery.update({
        masteryLevel,
        lastUpdated: new Date(),
      })
    }

    return courseMastery
  }

  /**
   * Get course mastery by ID
   */
  async getCourseMasteryById(id: string): Promise<CourseMastery | null> {
    return CourseMastery.findByPk(id, {
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
   * Get course mastery for a student
   */
  async getStudentCourseMastery(
    studentProfileId: string,
    courseId?: string,
    semesterId?: string,
  ): Promise<CourseMastery[]> {
    const whereClause: any = { studentProfileId }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (semesterId) {
      whereClause.semesterId = semesterId
    }

    return CourseMastery.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["lastUpdated", "DESC"]],
    })
  }

  /**
   * Get course mastery distribution for a course
   */
  async getCourseMasteryDistribution(
    courseId: string,
    semesterId: string,
  ): Promise<{
    courseId: string
    semesterId: string
    totalStudents: number
    averageMastery: number
    distribution: {
      range: string
      count: number
      percentage: number
    }[]
  }> {
    // Get all masteries for the course
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const totalStudents = masteries.length
    const averageMastery = totalStudents > 0 ? masteries.reduce((sum, m) => sum + m.masteryLevel, 0) / totalStudents : 0

    // Define mastery ranges
    const ranges = [
      { min: 0, max: 20, label: "0-20%" },
      { min: 20, max: 40, label: "20-40%" },
      { min: 40, max: 60, label: "40-60%" },
      { min: 60, max: 80, label: "60-80%" },
      { min: 80, max: 100, label: "80-100%" },
    ]

    // Calculate distribution
    const distribution = ranges.map((range) => {
      const count = masteries.filter((m) => m.masteryLevel >= range.min && m.masteryLevel < range.max).length
      return {
        range: range.label,
        count,
        percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0,
      }
    })

    return {
      courseId,
      semesterId,
      totalStudents,
      averageMastery,
      distribution,
    }
  }

  /**
   * Get course student masteries
   */
  async getCourseStudentMasteries(
    courseId: string,
    semesterId: string,
  ): Promise<
    {
      studentId: string
      studentName: string
      masteryLevel: number
      lastUpdated: Date
    }[]
  > {
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
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
      ],
      order: [["masteryLevel", "DESC"]],
    })

    return masteries.map((mastery) => ({
      studentId: mastery.studentProfileId,
      studentName: `${mastery.studentProfile?.user?.firstName || ''} ${mastery.studentProfile?.user?.lastName || ''}`,
      masteryLevel: mastery.masteryLevel,
      lastUpdated: mastery.lastUpdated,
    }))
  }

  /**
   * Get course mastery statistics
   */
  async getCourseMasteryStatistics(
    courseId: string,
    semesterId: string,
  ): Promise<{
    courseId: string
    semesterId: string
    totalStudents: number
    averageMastery: number
    highestMastery: number
    lowestMastery: number
    medianMastery: number
    studentsAbove80Percent: number
    studentsBelow40Percent: number
  }> {
    // Get all masteries for the course
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const totalStudents = masteries.length

    if (totalStudents === 0) {
      return {
        courseId,
        semesterId,
        totalStudents: 0,
        averageMastery: 0,
        highestMastery: 0,
        lowestMastery: 0,
        medianMastery: 0,
        studentsAbove80Percent: 0,
        studentsBelow40Percent: 0,
      }
    }

    // Calculate statistics
    const masteryLevels = masteries.map((m) => m.masteryLevel).sort((a, b) => a - b)
    const averageMastery = masteryLevels.reduce((sum, level) => sum + level, 0) / totalStudents
    const highestMastery = masteryLevels[masteryLevels.length - 1]
    const lowestMastery = masteryLevels[0]

    // Calculate median
    const mid = Math.floor(masteryLevels.length / 2)
    const medianMastery =
      masteryLevels.length % 2 === 0 ? (masteryLevels[mid - 1] + masteryLevels[mid]) / 2 : masteryLevels[mid]

    // Count students above 80% and below 40%
    const studentsAbove80Percent = masteryLevels.filter((level) => level >= 80).length
    const studentsBelow40Percent = masteryLevels.filter((level) => level < 40).length

    return {
      courseId,
      semesterId,
      totalStudents,
      averageMastery,
      highestMastery,
      lowestMastery,
      medianMastery,
      studentsAbove80Percent,
      studentsBelow40Percent,
    }
  }

  /**
   * Update course mastery
   */
  async updateCourseMastery(
    id: string,
    data: {
      masteryLevel: number
      lastUpdated?: Date
    },
  ): Promise<CourseMastery | null> {
    const mastery = await CourseMastery.findByPk(id)

    if (!mastery) {
      return null
    }

    await mastery.update({
      masteryLevel: data.masteryLevel,
      lastUpdated: data.lastUpdated || new Date(),
    })

    return mastery
  }

  /**
   * Delete course mastery
   */
  async deleteCourseMastery(id: string): Promise<boolean> {
    const mastery = await CourseMastery.findByPk(id)

    if (!mastery) {
      return false
    }

    await mastery.destroy()
    return true
  }

  /**
   * Get top performing students
   */
  async getTopPerformingStudents(
    courseId: string,
    semesterId: string,
    limit = 10,
  ): Promise<
    {
      studentId: string
      studentName: string
      masteryLevel: number
    }[]
  > {
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
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
      ],
      order: [["masteryLevel", "DESC"]],
      limit,
    })

    return masteries.map((mastery) => ({
      studentId: mastery.studentProfileId,
      studentName: `${mastery.studentProfile?.user?.firstName || ''} ${mastery.studentProfile?.user?.lastName || ''}`,
      masteryLevel: mastery.masteryLevel,
    }))
  }

  /**
   * Get struggling students
   */
  async getStrugglingStudents(
    courseId: string,
    semesterId: string,
    threshold = 40,
    limit = 10,
  ): Promise<
    {
      studentId: string
      studentName: string
      masteryLevel: number
    }[]
  > {
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
        masteryLevel: {
          [Op.lt]: threshold,
        },
      },
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
      ],
      order: [["masteryLevel", "ASC"]],
      limit,
    })

    return masteries.map((mastery) => ({
      studentId: mastery.studentProfileId,
      studentName: `${mastery.studentProfile?.user?.firstName || ''} ${mastery.studentProfile?.user?.lastName || ''}`,
      masteryLevel: mastery.masteryLevel,
    }))
  }

  /**
   * Get course mastery trends
   */
  async getCourseMasteryTrends(
    courseId: string,
    semesterId: string,
    days = 30,
  ): Promise<
    {
      date: string
      averageMastery: number
      studentCount: number
    }[]
  > {
    // Calculate the start date (days ago from now)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all enrollments for the course
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
      },
      attributes: ["studentProfileId"],
    })

    const studentIds = enrollments.map((e) => e.studentProfileId)

    // Get all masteries for these students
    const masteries = await CourseMastery.findAll({
      where: {
        studentProfileId: {
          [Op.in]: studentIds,
        },
        courseId,
        semesterId,
        lastUpdated: {
          [Op.gte]: startDate,
        },
      },
      order: [["lastUpdated", "ASC"]],
    })

    // Group masteries by date
    const masteryByDate = new Map<string, { sum: number; count: number }>()

    masteries.forEach((mastery) => {
      const dateStr = mastery.lastUpdated.toISOString().split("T")[0]
      if (!masteryByDate.has(dateStr)) {
        masteryByDate.set(dateStr, { sum: 0, count: 0 })
      }
      const current = masteryByDate.get(dateStr)!
      current.sum += mastery.masteryLevel
      current.count += 1
    })

    // Convert to array and calculate averages
    const result: { date: string; averageMastery: number; studentCount: number }[] = []

    // Ensure we have entries for all days in the range
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      if (masteryByDate.has(dateStr)) {
        const { sum, count } = masteryByDate.get(dateStr)!
        result.push({
          date: dateStr,
          averageMastery: count > 0 ? sum / count : 0,
          studentCount: count,
        })
      } else {
        result.push({
          date: dateStr,
          averageMastery: 0,
          studentCount: 0,
        })
      }
    }

    return result
  }
}
