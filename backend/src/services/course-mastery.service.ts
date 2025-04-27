import { Op } from "sequelize"
import { CourseMastery } from "../models/CourseMastery"
import { TopicProgress } from "../models/TopicProgress"
import { CourseTopic } from "../models/CourseTopic"
import { Course } from "../models/Course"
import { StudentProfile } from "../models/StudentProfile"
import { Semester } from "../models/Semester"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { Assessment } from "../models/Assessment"
import { QuizAttempt } from "../models/QuizAttempt"
import { Quiz } from "../models/Quiz"

export class CourseMasteryService {
  /**
   * Calculate and update course mastery for a student
   */
  async calculateAndUpdateCourseMastery(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<CourseMastery> {
    // Get all topic progress for this student in this course
    const courseTopics = await CourseTopic.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const topicProgress = await TopicProgress.findAll({
      where: {
        studentProfileId,
        courseTopicId: {
          [Op.in]: courseTopics.map((topic) => topic.id),
        },
      },
      include: [
        {
          model: CourseTopic,
          where: {
            courseId,
            semesterId,
          },
        },
      ],
    })

    // Calculate topic completion percentage
    const totalTopics = courseTopics.length
    const completedTopics = topicProgress.filter((progress) => progress.isCompleted).length
    const topicCompletionPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    // Calculate average mastery level across topics
    const totalMasteryLevel = topicProgress.reduce((sum, progress) => sum + progress.masteryLevel, 0) || 0
    const averageMasteryLevel = topicProgress.length > 0 ? totalMasteryLevel / topicProgress.length : 0

    // Get quiz attempts for this student in this course
    const quizzes = await Quiz.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    const quizAttempts = await QuizAttempt.findAll({
      where: {
        studentProfileId,
        quizId: {
          [Op.in]: quizzes.map((quiz) => quiz.id),
        },
      },
    })

    // Calculate quiz average
    const totalQuizScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) || 0
    const quizAverage = quizAttempts.length > 0 ? totalQuizScore / quizAttempts.length : 0

    // Get assignment submissions for this student in this course
    const assessments = await Assessment.findAll({
      where: {
        courseId,
        semesterId,
        type: "assignment",
      },
    })

    const assignmentSubmissions = await AssessmentSubmission.findAll({
      where: {
        studentProfileId,
        assessmentId: {
          [Op.in]: assessments.map((assessment) => assessment.id),
        },
      },
    })

    // Calculate assignment average
    const totalAssignmentScore = assignmentSubmissions.reduce((sum, submission) => sum + (submission.marks ?? 0), 0) || 0
    const assignmentAverage = assignmentSubmissions.length > 0 ? totalAssignmentScore / assignmentSubmissions.length : 0

    // Find or create course mastery record
    const [courseMastery, created] = await CourseMastery.findOrCreate({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
      defaults: {
        masteryLevel: averageMasteryLevel,
        quizAverage,
        assignmentAverage,
        topicCompletionPercentage,
        totalTopicsCompleted: completedTopics,
        totalTopics,
        lastUpdated: new Date(),
      },
    })

    // If record already exists, update it
    if (!created) {
      await courseMastery.update({
        masteryLevel: averageMasteryLevel,
        quizAverage,
        assignmentAverage,
        topicCompletionPercentage,
        totalTopicsCompleted: completedTopics,
        totalTopics,
        lastUpdated: new Date(),
      })
    }

    return courseMastery
  }

  /**
   * Get course mastery for a student
   */
  async getCourseMastery(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<CourseMastery | null> {
    return CourseMastery.findOne({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
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

  /**
   * Get all course masteries for a student
   */
  async getStudentCourseMasteries(studentProfileId: string, semesterId?: string): Promise<CourseMastery[]> {
    const whereClause: any = {
      studentProfileId,
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
   * Get all course masteries for a course
   */
  async getCourseStudentMasteries(courseId: string, semesterId: string): Promise<CourseMastery[]> {
    return CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: Course,
              through: { attributes: [] },
              where: {
                id: courseId,
              },
            },
          ],
        },
      ],
      order: [["masteryLevel", "DESC"]],
    })
  }

  /**
   * Get course mastery statistics
   */
  async getCourseMasteryStatistics(
    courseId: string,
    semesterId: string,
  ): Promise<{
    averageMasteryLevel: number
    averageQuizScore: number
    averageAssignmentScore: number
    averageCompletionRate: number
    totalStudents: number
    masteryDistribution: Record<string, number>
  }> {
    const masteries = await CourseMastery.findAll({
      where: {
        courseId,
        semesterId,
      },
    })

    if (masteries.length === 0) {
      return {
        averageMasteryLevel: 0,
        averageQuizScore: 0,
        averageAssignmentScore: 0,
        averageCompletionRate: 0,
        totalStudents: 0,
        masteryDistribution: {
          low: 0,
          medium: 0,
          high: 0,
          mastered: 0,
        },
      }
    }

    const totalMasteryLevel = masteries.reduce((sum, mastery) => sum + mastery.masteryLevel, 0)
    const totalQuizScore = masteries.reduce((sum, mastery) => sum + mastery.quizAverage, 0)
    const totalAssignmentScore = masteries.reduce((sum, mastery) => sum + mastery.assignmentAverage, 0)
    const totalCompletionRate = masteries.reduce((sum, mastery) => sum + mastery.topicCompletionPercentage, 0)

    // Calculate mastery level distribution
    const masteryDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      mastered: 0,
    }

    masteries.forEach((mastery) => {
      if (mastery.masteryLevel < 25) {
        masteryDistribution.low++
      } else if (mastery.masteryLevel < 50) {
        masteryDistribution.medium++
      } else if (mastery.masteryLevel < 75) {
        masteryDistribution.high++
      } else {
        masteryDistribution.mastered++
      }
    })

    return {
      averageMasteryLevel: totalMasteryLevel / masteries.length,
      averageQuizScore: totalQuizScore / masteries.length,
      averageAssignmentScore: totalAssignmentScore / masteries.length,
      averageCompletionRate: totalCompletionRate / masteries.length,
      totalStudents: masteries.length,
      masteryDistribution,
    }
  }
}
