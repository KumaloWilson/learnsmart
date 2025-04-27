import { Op } from "sequelize"
import {
  CourseAssignment,
  Course,
  Semester,
  StudentProfile,
  CourseEnrollment,
  Assessment,
  AssessmentSubmission,
  Quiz,
  QuizAttempt,
  VirtualClass,
  TeachingMaterial,
  User,
  PhysicalAttendance,
  VirtualClassAttendance,
  StudentPerformance
} from "../models"
import { AttendanceService } from "./attendance.service"
import { StudentPerformanceService } from "./student-performance.service"
import { AtRiskStudentService } from "./at-risk-student.service"
import { CourseTopicService } from "./course-topic.service"
import { CourseMasteryService } from "./course-mastery.service"
import type { LecturerDashboardStatsDto } from "../dto/lecturer-dashboard.dto"
import { LecturerProfile } from "../models/LecturerProfile"
import { AtRiskStudent } from '../models/AtRiskStudent';

export class LecturerDashboardService {
  private attendanceService: AttendanceService
  private studentPerformanceService: StudentPerformanceService
  private atRiskStudentService: AtRiskStudentService
  private courseTopicService: CourseTopicService
  private courseMasteryService: CourseMasteryService

  constructor() {
    this.attendanceService = new AttendanceService()
    this.studentPerformanceService = new StudentPerformanceService()
    this.atRiskStudentService = new AtRiskStudentService()
    this.courseTopicService = new CourseTopicService()
    this.courseMasteryService = new CourseMasteryService()
  }

  async getDashboardStats(lecturerProfileId: string): Promise<LecturerDashboardStatsDto> {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Get active semester
    const activeSemester = await Semester.findOne({
      where: {
        isActive: true,
      },
    })

    const semesterId = activeSemester?.id

    // Get course assignments for this lecturer
    const courseAssignments = await CourseAssignment.findAll({
      where: {
        lecturerProfileId,
        isActive: true,
        ...(semesterId ? { semesterId } : {}),
      },
      include: [Course],
    })

    const courseIds = courseAssignments.map((ca) => ca.courseId)

    // Count total courses
    const totalCourses = courseIds.length

    // Count total students enrolled in these courses
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId: courseIds,
        ...(semesterId ? { semesterId } : {}),
        status: "enrolled",
      },
      attributes: ["studentProfileId"],
      group: ["studentProfileId"],
    })

    const totalStudents = enrollments.length

    // Count upcoming classes
    const upcomingClasses = await VirtualClass.count({
      where: {
        lecturerProfileId,
        scheduledStartTime: {
          [Op.between]: [now, oneWeekAhead],
        },
        status: "scheduled",
      },
    })

    // Count pending assignments
    const pendingAssignments = await Assessment.count({
      where: {
        lecturerProfileId,
        courseId: {
          [Op.in]: courseIds,
        },
        ...(semesterId ? { semesterId } : {}),
        dueDate: {
          [Op.gt]: now,
        },
      },
    })

    // Count recent quizzes
    const recentQuizzes = await Quiz.count({
      where: {
        lecturerProfileId,
        courseId: {
          [Op.in]: courseIds,
        },
        ...(semesterId ? { semesterId } : {}),
        createdAt: {
          [Op.gt]: oneWeekAgo,
        },
      },
    })

    // Calculate average attendance
    let averageAttendance = 0
    if (courseIds.length > 0 && semesterId) {
      const attendancePromises = courseIds.map((courseId) =>
        this.attendanceService.getAttendanceStatistics({
          courseId,
          semesterId,
        }),
      )
      const attendanceResults = await Promise.all(attendancePromises)
      const totalAttendance = attendanceResults.reduce((sum, result) => sum + result.attendancePercentage, 0)
      averageAttendance = attendanceResults.length > 0 ? totalAttendance / attendanceResults.length : 0
    }

    // Calculate average performance
    let averagePerformance = 0
    if (courseIds.length > 0 && semesterId) {
      const performances = await this.studentPerformanceService.findAll({
        courseId: courseIds.join(','),
        semesterId,
      })
      const totalPerformance = performances.reduce((sum, perf) => sum + perf.overallPerformance, 0)
      averagePerformance = performances.length > 0 ? totalPerformance / performances.length : 0
    }

    // Get at-risk students count
    const atRiskStudentsCount = await AtRiskStudent.count({
      where: {
        courseId: {
          [Op.in]: courseIds,
        },
        ...(semesterId ? { semesterId } : {}),
        isResolved: false,
      },
    })

    // Get critical at-risk students count
    const criticalAtRiskStudentsCount = await AtRiskStudent.count({
      where: {
        courseId: {
          [Op.in]: courseIds,
        },
        ...(semesterId ? { semesterId } : {}),
        isResolved: false,
        riskLevel: "critical",
      },
    })

    return {
      totalCourses,
      totalStudents,
      upcomingClasses,
      pendingAssignments,
      recentQuizzes,
      averageAttendance,
      averagePerformance,
      atRiskStudentsCount,
      criticalAtRiskStudentsCount,
    }
  }

  async getDashboardOverview(lecturerProfileId: string, options: any = {}) {
    const {
      startDate,
      endDate,
      includeAttendance = true,
      includePerformance = true,
      includeQuizzes = true,
      includeAssessments = true,
    } = options

    // Get lecturer profile with user details
    const lecturerProfile = await LecturerProfile.findByPk(lecturerProfileId, {
      include: [{ model: User, as: "user" }],
    })

    if (!lecturerProfile) {
      throw new Error("Lecturer profile not found")
    }

    // Get assigned courses for the lecturer
    const courseAssignments = await CourseAssignment.findAll({
      where: { lecturerProfileId },
      include: [
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    const courseIds = courseAssignments.map((assignment) => assignment.courseId)
    const semesterIds = courseAssignments.map((assignment) => assignment.semesterId)

    // Prepare date filters
    const dateFilter: any = {}
    if (startDate || endDate) {
      if (startDate) dateFilter[Op.gte] = startDate
      if (endDate) dateFilter[Op.lte] = endDate
    }

    // Get student counts for each course
    const enrollmentCounts = await CourseEnrollment.findAll({
      attributes: [
        "courseId",
        "semesterId",
        [CourseEnrollment.sequelize!.fn("COUNT", CourseEnrollment.sequelize!.col("studentProfileId")), "studentCount"],
      ],
      where: {
        courseId: { [Op.in]: courseIds },
        semesterId: { [Op.in]: semesterIds },
      },
      group: ["courseId", "semesterId"],
    })

    // Build enrollment map for easy access
    const enrollmentMap: Record<string, number> = {}
    enrollmentCounts.forEach((count: any) => {
      const key = `${count.courseId}-${count.semesterId}`
      enrollmentMap[key] = count.get("studentCount")
    })

    // Get upcoming classes
    const now = new Date()
    const upcomingClasses = await VirtualClass.findAll({
      where: {
        lecturerProfileId,
        scheduledStartTime: { [Op.gt]: now },
      },
      include: [
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
      order: [["scheduledStartTime", "ASC"]],
      limit: 5,
    })

    // Prepare result object
    const result: any = {
      lecturer: {
        id: lecturerProfile.id,
        name: `${lecturerProfile.user?.firstName} ${lecturerProfile.user?.lastName}` || 'Unknown',
        email: lecturerProfile.user?.email,
        department: lecturerProfile.department,
        specialization: lecturerProfile.specialization,
      },
      courses: courseAssignments.map((assignment) => ({
        id: assignment.courseId,
        name: assignment.course?.name,
        code: assignment.course?.code,
        semesterId: assignment.semesterId,
        semesterName: assignment.semester?.name,
        studentCount: enrollmentMap[`${assignment.courseId}-${assignment.semesterId}`] || 0,
      })),
      upcomingClasses: upcomingClasses.map((virtualClass) => ({
        id: virtualClass.id,
        title: virtualClass.title,
        courseId: virtualClass.courseId,
        courseName: virtualClass.course?.name,
        courseCode: virtualClass.course?.code,
        startTime: virtualClass.scheduledStartTime,
        endTime: virtualClass.scheduledEndTime,
        meetingLink: virtualClass.meetingLink,
      })),
      summary: {
        totalCourses: courseAssignments.length,
        totalStudents: Object.values(enrollmentMap).reduce((sum, count) => sum + count, 0),
        upcomingClassesCount: upcomingClasses.length,
      },
    }

    // Add attendance data if requested
    if (includeAttendance) {
      // Get attendance statistics
      const attendanceData = await this.getAttendanceOverview(courseIds, semesterIds, dateFilter)
      result.attendance = attendanceData
    }

    // Add performance data if requested
    if (includePerformance) {
      // Get performance statistics
      const performanceData = await this.getPerformanceOverview(courseIds, semesterIds, dateFilter)
      result.performance = performanceData
    }

    // Add quiz data if requested
    if (includeQuizzes) {
      // Get quiz statistics
      const quizData = await this.getQuizOverview(courseIds, semesterIds, dateFilter)
      result.quizzes = quizData
    }

    // Add assessment data if requested
    if (includeAssessments) {
      // Get assessment statistics
      const assessmentData = await this.getAssessmentOverview(courseIds, semesterIds, dateFilter)
      result.assessments = assessmentData
    }

    return result
  }

  async getLecturerCourses(lecturerProfileId: string) {
    const courseAssignments = await CourseAssignment.findAll({
      where: { lecturerProfileId },
      include: [
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    const courseIds = courseAssignments.map((assignment) => assignment.courseId)
    const semesterIds = courseAssignments.map((assignment) => assignment.semesterId)

    // Get student counts for each course
    const enrollmentCounts = await CourseEnrollment.findAll({
      attributes: [
        "courseId",
        "semesterId",
        [CourseEnrollment.sequelize!.fn("COUNT", CourseEnrollment.sequelize!.col("studentProfileId")), "studentCount"],
      ],
      where: {
        courseId: { [Op.in]: courseIds },
        semesterId: { [Op.in]: semesterIds },
      },
      group: ["courseId", "semesterId"],
    })

    // Build enrollment map for easy access
    const enrollmentMap: Record<string, number> = {}
    enrollmentCounts.forEach((count: any) => {
      const key = `${count.courseId}-${count.semesterId}`
      enrollmentMap[key] = count.get("studentCount")
    })

    return courseAssignments.map((assignment) => ({
      id: assignment.id,
      courseId: assignment.courseId,
      courseName: assignment.course?.name,
      courseCode: assignment.course?.code,
      courseDescription: assignment.course?.description,
      semesterId: assignment.semesterId,
      semesterName: assignment.semester?.name,
      studentCount: enrollmentMap[`${assignment.courseId}-${assignment.semesterId}`] || 0,
      assignedDate: assignment.createdAt,
    }))
  }

  private async getAttendanceOverview(courseIds: string[], semesterIds: string[], dateFilter: any) {
    // Get physical attendance records
    const physicalAttendanceQuery: any = {
      courseId: { [Op.in]: courseIds },
      semesterId: { [Op.in]: semesterIds },
    }

    if (Object.keys(dateFilter).length > 0) {
      physicalAttendanceQuery.date = dateFilter
    }

    const physicalAttendance = await PhysicalAttendance.findAll({
      where: physicalAttendanceQuery,
      include: [
        { model: StudentProfile, as: "studentProfile", include: [{ association: "user" }] },
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    // Get virtual attendance records
    const virtualAttendanceQuery: any = {
      "$virtualClass.courseId$": { [Op.in]: courseIds },
      "$virtualClass.semesterId$": { [Op.in]: semesterIds },
    }

    if (Object.keys(dateFilter).length > 0) {
      virtualAttendanceQuery["$virtualClass.startTime$"] = dateFilter
    }

    const virtualAttendance = await VirtualClassAttendance.findAll({
      where: virtualAttendanceQuery,
      include: [
        {
          model: VirtualClass,
          as: "virtualClass",
          include: [
            { model: Course, as: "course" },
            { model: Semester, as: "semester" },
          ],
        },
        { model: StudentProfile, as: "studentProfile", include: [{ association: "user" }] },
      ],
    })

    // Calculate attendance statistics
    const courseAttendance: Record<string, any> = {}

    // Process physical attendance
    physicalAttendance.forEach((record) => {
      const key = `${record.courseId}-${record.semesterId}`
      if (!courseAttendance[key]) {
        courseAttendance[key] = {
          courseId: record.courseId,
          courseName: record.course?.name,
          courseCode: record.course?.code,
          semesterId: record.semesterId,
          semesterName: record.semester?.name,
          physicalSessions: new Set(),
          physicalAttendance: 0,
          virtualSessions: new Set(),
          virtualAttendance: 0,
        }
      }

      courseAttendance[key].physicalSessions.add(record.id)
      if (record.isPresent) {
        courseAttendance[key].physicalAttendance++
      }
    })

    // Process virtual attendance
    virtualAttendance.forEach((record) => {
      const key = `${record.virtualClass?.courseId}-${record.virtualClass?.semesterId}`
      if (!courseAttendance[key]) {
        courseAttendance[key] = {
          courseId: record.virtualClass?.courseId,
          courseName: record.virtualClass?.course?.name,
          courseCode: record.virtualClass?.course?.code,
          semesterId: record.virtualClass?.semesterId,
          semesterName: record.virtualClass?.semester?.name,
          physicalSessions: new Set(),
          physicalAttendance: 0,
          virtualSessions: new Set(),
          virtualAttendance: 0,
        }
      }

      courseAttendance[key].virtualSessions.add(record.virtualClassId)
      if (record.isPresent) {
        courseAttendance[key].virtualAttendance++
      }
    })

    // Convert sets to counts and calculate rates
    const attendanceStats = Object.values(courseAttendance).map((stats: any) => {
      const physicalSessionCount = stats.physicalSessions.size
      const virtualSessionCount = stats.virtualSessions.size

      return {
        courseId: stats.courseId,
        courseName: stats.courseName,
        courseCode: stats.courseCode,
        semesterId: stats.semesterId,
        semesterName: stats.semesterName,
        physicalSessionCount,
        physicalAttendanceCount: stats.physicalAttendance,
        physicalAttendanceRate: physicalSessionCount > 0 ? (stats.physicalAttendance / physicalSessionCount) * 100 : 0,
        virtualSessionCount,
        virtualAttendanceCount: stats.virtualAttendance,
        virtualAttendanceRate: virtualSessionCount > 0 ? (stats.virtualAttendance / virtualSessionCount) * 100 : 0,
        totalSessionCount: physicalSessionCount + virtualSessionCount,
        totalAttendanceCount: stats.physicalAttendance + stats.virtualAttendance,
        overallAttendanceRate:
          physicalSessionCount + virtualSessionCount > 0
            ? ((stats.physicalAttendance + stats.virtualAttendance) / (physicalSessionCount + virtualSessionCount)) *
              100
            : 0,
      }
    })

    return {
      courseAttendance: attendanceStats,
      totalPhysicalSessions: attendanceStats.reduce((sum, stat) => sum + stat.physicalSessionCount, 0),
      totalVirtualSessions: attendanceStats.reduce((sum, stat) => sum + stat.virtualSessionCount, 0),
      averageAttendanceRate:
        attendanceStats.length > 0
          ? attendanceStats.reduce((sum, stat) => sum + stat.overallAttendanceRate, 0) / attendanceStats.length
          : 0,
    }
  }

  private async getPerformanceOverview(courseIds: string[], semesterIds: string[], dateFilter: any) {
    // Prepare query
    const performanceQuery: any = {
      courseId: { [Op.in]: courseIds },
      semesterId: { [Op.in]: semesterIds },
    }

    if (Object.keys(dateFilter).length > 0) {
      performanceQuery.performanceDate = dateFilter
    }

    // Get performance records
    const performanceRecords = await StudentPerformance.findAll({
      where: performanceQuery,
      include: [
        { model: StudentProfile, as: "studentProfile", include: [{ association: "user" }] },
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    // Group by course and semester
    const coursePerformance: Record<string, any> = {}

    performanceRecords.forEach((record) => {
      const key = `${record.courseId}-${record.semesterId}`
      if (!coursePerformance[key]) {
        coursePerformance[key] = {
          courseId: record.courseId,
          courseName: record.course?.name,
          courseCode: record.course?.code,
          semesterId: record.semesterId,
          semesterName: record.semester?.name,
          totalScore: 0,
          recordCount: 0,
          highestScore: 0,
          lowestScore: 100,
          performanceByType: {},
        }
      }

      coursePerformance[key].totalScore += record.score
      coursePerformance[key].recordCount++
      coursePerformance[key].highestScore = Math.max(coursePerformance[key].highestScore, record.score)
      coursePerformance[key].lowestScore = Math.min(coursePerformance[key].lowestScore, record.score)

      // Track performance by type
      if (!coursePerformance[key].performanceByType[record.performanceType]) {
        coursePerformance[key].performanceByType[record.performanceType] = {
          total: 0,
          count: 0,
        }
      }

      coursePerformance[key].performanceByType[record.performanceType].total += record.score
      coursePerformance[key].performanceByType[record.performanceType].count++
    })

    // Calculate averages and format results
    const performanceStats = Object.values(coursePerformance).map((stats: any) => {
      // Calculate average for each performance type
      const performanceByType: Record<string, number> = {}
      Object.keys(stats.performanceByType).forEach((type) => {
        const { total, count } = stats.performanceByType[type]
        performanceByType[type] = count > 0 ? total / count : 0
      })

      return {
        courseId: stats.courseId,
        courseName: stats.courseName,
        courseCode: stats.courseCode,
        semesterId: stats.semesterId,
        semesterName: stats.semesterName,
        averageScore: stats.recordCount > 0 ? stats.totalScore / stats.recordCount : 0,
        highestScore: stats.highestScore,
        lowestScore: stats.lowestScore,
        assessmentCount: stats.recordCount,
        performanceByType,
      }
    })

    return {
      coursePerformance: performanceStats,
      totalAssessments: performanceStats.reduce((sum, stat) => sum + stat.assessmentCount, 0),
      averageScore:
        performanceStats.length > 0
          ? performanceStats.reduce((sum, stat) => sum + stat.averageScore, 0) / performanceStats.length
          : 0,
    }
  }

  private async getQuizOverview(courseIds: string[], semesterIds: string[], dateFilter: any) {
    // Prepare quiz query
    const quizQuery: any = {
      courseId: { [Op.in]: courseIds },
      semesterId: { [Op.in]: semesterIds },
    }

    if (Object.keys(dateFilter).length > 0) {
      quizQuery.dueDate = dateFilter
    }

    // Get quizzes
    const quizzes = await Quiz.findAll({
      where: quizQuery,
      include: [
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    const quizIds = quizzes.map((quiz) => quiz.id)

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: {
        quizId: { [Op.in]: quizIds },
      },
      include: [
        { model: StudentProfile, as: "studentProfile", include: [{ association: "user" }] },
        { model: Quiz, as: "quiz" },
      ],
    })

    // Group by course and semester
    const courseQuizzes: Record<string, any> = {}

    quizzes.forEach((quiz) => {
      const key = `${quiz.courseId}-${quiz.semesterId}`
      if (!courseQuizzes[key]) {
        courseQuizzes[key] = {
          courseId: quiz.courseId,
          courseName: quiz.course.name,
          courseCode: quiz.course.code,
          semesterId: quiz.semesterId,
          semesterName: quiz.semester.name,
          quizCount: 0,
          quizzes: [],
        }
      }

      courseQuizzes[key].quizCount++
      courseQuizzes[key].quizzes.push({
        id: quiz.id,
        title: quiz.title,
        dueDate: quiz.dueDate,
        totalPoints: quiz.totalPoints,
        timeLimit: quiz.timeLimit,
      })
    })

    // Process quiz attempts
    const quizAttemptMap: Record<string, any[]> = {}
    quizAttempts.forEach((attempt) => {
      if (!quizAttemptMap[attempt.quizId]) {
        quizAttemptMap[attempt.quizId] = []
      }
      quizAttemptMap[attempt.quizId].push(attempt)
    })

    // Calculate quiz statistics
    const quizStats = Object.values(courseQuizzes).map((stats: any) => {
      // Calculate attempt statistics for each quiz
      stats.quizzes = stats.quizzes.map((quiz: any) => {
        const attempts = quizAttemptMap[quiz.id] || []
        const attemptCount = attempts.length
        const completedAttempts = attempts.filter((attempt) => attempt.isSubmitted)
        const completedCount = completedAttempts.length
        const totalScore = completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0)

        return {
          ...quiz,
          attemptCount,
          completedCount,
          averageScore: completedCount > 0 ? totalScore / completedCount : 0,
          completionRate: attemptCount > 0 ? (completedCount / attemptCount) * 100 : 0,
        }
      })

      // Calculate overall statistics for the course
      const totalAttempts = stats.quizzes.reduce((sum: number, quiz: any) => sum + quiz.attemptCount, 0)
      const totalCompleted = stats.quizzes.reduce((sum: number, quiz: any) => sum + quiz.completedCount, 0)
      const totalAverageScore = stats.quizzes.reduce((sum: number, quiz: any) => sum + quiz.averageScore, 0)

      return {
        courseId: stats.courseId,
        courseName: stats.courseName,
        courseCode: stats.courseCode,
        semesterId: stats.semesterId,
        semesterName: stats.semesterName,
        quizCount: stats.quizCount,
        totalAttempts,
        totalCompleted,
        completionRate: totalAttempts > 0 ? (totalCompleted / totalAttempts) * 100 : 0,
        averageScore: stats.quizCount > 0 ? totalAverageScore / stats.quizCount : 0,
        quizzes: stats.quizzes,
      }
    })

    return {
      courseQuizzes: quizStats,
      totalQuizzes: quizStats.reduce((sum, stat) => sum + stat.quizCount, 0),
      totalAttempts: quizStats.reduce((sum, stat) => sum + stat.totalAttempts, 0),
      totalCompleted: quizStats.reduce((sum, stat) => sum + stat.totalCompleted, 0),
      overallCompletionRate:
        quizStats.reduce((sum, stat) => sum + stat.totalAttempts, 0) > 0
          ? (quizStats.reduce((sum, stat) => sum + stat.totalCompleted, 0) /
              quizStats.reduce((sum, stat) => sum + stat.totalAttempts, 0)) *
            100
          : 0,
      overallAverageScore:
        quizStats.length > 0 ? quizStats.reduce((sum, stat) => sum + stat.averageScore, 0) / quizStats.length : 0,
    }
  }

  private async getAssessmentOverview(courseIds: string[], semesterIds: string[], dateFilter: any) {
    // Prepare assessment query
    const assessmentQuery: any = {
      courseId: { [Op.in]: courseIds },
      semesterId: { [Op.in]: semesterIds },
    }

    if (Object.keys(dateFilter).length > 0) {
      assessmentQuery.dueDate = dateFilter
    }

    // Get assessments
    const assessments = await Assessment.findAll({
      where: assessmentQuery,
      include: [
        { model: Course, as: "course" },
        { model: Semester, as: "semester" },
      ],
    })

    const assessmentIds = assessments.map((assessment) => assessment.id)

    // Get assessment submissions
    const submissions = await AssessmentSubmission.findAll({
      where: {
        assessmentId: { [Op.in]: assessmentIds },
      },
      include: [
        { model: StudentProfile, as: "studentProfile", include: [{ association: "user" }] },
        { model: Assessment, as: "assessment" },
      ],
    })

    // Group by course and semester
    const courseAssessments: Record<string, any> = {}

    assessments.forEach((assessment) => {
      const key = `${assessment.courseId}-${assessment.semesterId}`
      if (!courseAssessments[key]) {
        courseAssessments[key] = {
          courseId: assessment.courseId,
          courseName: assessment.course.name,
          courseCode: assessment.course.code,
          semesterId: assessment.semesterId,
          semesterName: assessment.semester.name,
          assessmentCount: 0,
          assessments: [],
        }
      }

      courseAssessments[key].assessmentCount++
      courseAssessments[key].assessments.push({
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        dueDate: assessment.dueDate,
        totalPoints: assessment.totalPoints,
        assessmentType: assessment.assessmentType,
      })
    })

    // Process submissions
    const submissionMap: Record<string, any[]> = {}
    submissions.forEach((submission) => {
      if (!submissionMap[submission.assessmentId]) {
        submissionMap[submission.assessmentId] = []
      }
      submissionMap[submission.assessmentId].push(submission)
    })

    // Calculate assessment statistics
    const assessmentStats = Object.values(courseAssessments).map((stats: any) => {
      // Calculate submission statistics for each assessment
      stats.assessments = stats.assessments.map((assessment: any) => {
        const assessmentSubmissions = submissionMap[assessment.id] || []
        const submissionCount = assessmentSubmissions.length
        const gradedSubmissions = assessmentSubmissions.filter((submission) => submission.isGraded)
        const gradedCount = gradedSubmissions.length
        const totalScore = gradedSubmissions.reduce((sum, submission) => sum + submission.marks, 0)

        return {
          ...assessment,
          submissionCount,
          gradedCount,
          averageScore: gradedCount > 0 ? totalScore / gradedCount : 0,
          submissionRate: submissionCount > 0 ? (submissionCount / submissionCount) * 100 : 0,
        }
      })

      // Calculate overall statistics for the course
      const totalSubmissions = stats.assessments.reduce(
        (sum: number, assessment: any) => sum + assessment.submissionCount,
        0,
      )
      const totalGraded = stats.assessments.reduce((sum: number, assessment: any) => sum + assessment.gradedCount, 0)
      const totalAverageScore = stats.assessments.reduce(
        (sum: number, assessment: any) => sum + assessment.averageScore,
        0,
      )

      return {
        courseId: stats.courseId,
        courseName: stats.courseName,
        courseCode: stats.courseCode,
        semesterId: stats.semesterId,
        semesterName: stats.semesterName,
        assessmentCount: stats.assessmentCount,
        totalSubmissions,
        totalGraded,
        gradingRate: totalSubmissions > 0 ? (totalGraded / totalSubmissions) * 100 : 0,
        averageScore: stats.assessmentCount > 0 ? totalAverageScore / stats.assessmentCount : 0,
        assessments: stats.assessments,
      }
    })

    return {
      courseAssessments: assessmentStats,
      totalAssessments: assessmentStats.reduce((sum, stat) => sum + stat.assessmentCount, 0),
      totalSubmissions: assessmentStats.reduce((sum, stat) => sum + stat.totalSubmissions, 0),
      totalGraded: assessmentStats.reduce((sum, stat) => sum + stat.totalGraded, 0),
      overallGradingRate:
        assessmentStats.reduce((sum, stat) => sum + stat.totalSubmissions, 0) > 0
          ? (assessmentStats.reduce((sum, stat) => sum + stat.totalGraded, 0) /
              assessmentStats.reduce((sum, stat) => sum + stat.totalSubmissions, 0)) *
            100
          : 0,
      overallAverageScore:
        assessmentStats.length > 0
          ? assessmentStats.reduce((sum, stat) => sum + stat.averageScore, 0) / assessmentStats.length
          : 0,
    }
  }

  async getStudentEngagement(courseId: string, semesterId: string) {
    // Get enrolled students
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [{ association: "user" }],
        },
      ],
    })

    const studentIds = enrollments.map((enrollment) => enrollment.studentProfileId)

    // Get attendance data
    const physicalAttendance = await PhysicalAttendance.findAll({
      where: {
        studentProfileId: { [Op.in]: studentIds },
        courseId,
        semesterId,
      },
    })

    const virtualAttendance = await VirtualClassAttendance.findAll({
      include: [
        {
          model: VirtualClass,
          as: "virtualClass",
          where: {
            courseId,
            semesterId,
          },
        },
      ],
      where: {
        studentProfileId: { [Op.in]: studentIds },
      },
    })

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      include: [
        {
          model: Quiz,
          as: "quiz",
          where: {
            courseId,
            semesterId,
          },
        },
      ],
      where: {
        studentProfileId: { [Op.in]: studentIds },
      },
    })

    // Get assessment submissions
    const assessmentSubmissions = await AssessmentSubmission.findAll({
      include: [
        {
          model: Assessment,
          as: "assessment",
          where: {
            courseId,
            semesterId,
          },
        },
      ],
      where: {
        studentProfileId: { [Op.in]: studentIds },
      },
    })

    // Calculate engagement metrics for each student
    const studentEngagement = enrollments.map((enrollment) => {
      const studentId = enrollment.studentProfileId

      // Calculate attendance
      const studentPhysicalAttendance = physicalAttendance.filter((record) => record.studentProfileId === studentId)
      const studentVirtualAttendance = virtualAttendance.filter((record) => record.studentProfileId === studentId)

      const physicalAttendanceRate =
        studentPhysicalAttendance.length > 0
          ? (studentPhysicalAttendance.filter((record) => record.isPresent).length / studentPhysicalAttendance.length) *
            100
          : 0

      const virtualAttendanceRate =
        studentVirtualAttendance.length > 0
          ? (studentVirtualAttendance.filter((record) => record.isPresent).length / studentVirtualAttendance.length) *
            100
          : 0

      // Calculate quiz engagement
      const studentQuizAttempts = quizAttempts.filter((attempt) => attempt.studentProfileId === studentId)

      const quizCompletionRate =
        studentQuizAttempts.length > 0
          ? (studentQuizAttempts.filter((attempt) => attempt.isSubmitted).length / studentQuizAttempts.length) * 100
          : 0

      // Calculate assessment engagement
      const studentAssessmentSubmissions = assessmentSubmissions.filter(
        (submission) => submission.studentProfileId === studentId,
      )

      const assessmentSubmissionRate =
        studentAssessmentSubmissions.length > 0
          ? (studentAssessmentSubmissions.filter((submission) => submission.submittedAt !== null).length /
              studentAssessmentSubmissions.length) *
            100
          : 0

      // Calculate overall engagement score (weighted average)
      const attendanceWeight = 0.4
      const quizWeight = 0.3
      const assessmentWeight = 0.3

      const overallEngagement =
        ((physicalAttendanceRate + virtualAttendanceRate) / 2) * attendanceWeight +
        quizCompletionRate * quizWeight +
        assessmentSubmissionRate * assessmentWeight

      return {
        studentProfileId: studentId,
        studentName: enrollment.studentProfile.user.fullName,
        studentEmail: enrollment.studentProfile.user.email,
        physicalAttendanceRate,
        virtualAttendanceRate,
        overallAttendanceRate: (physicalAttendanceRate + virtualAttendanceRate) / 2,
        quizCompletionRate,
        assessmentSubmissionRate,
        overallEngagement,
        engagementLevel: this.getEngagementLevel(overallEngagement),
      }
    })

    // Sort by engagement level (descending)
    studentEngagement.sort((a, b) => b.overallEngagement - a.overallEngagement)

    // Calculate class averages
    const classAverages = {
      physicalAttendanceRate:
        studentEngagement.reduce((sum, student) => sum + student.physicalAttendanceRate, 0) / studentEngagement.length,
      virtualAttendanceRate:
        studentEngagement.reduce((sum, student) => sum + student.virtualAttendanceRate, 0) / studentEngagement.length,
      overallAttendanceRate:
        studentEngagement.reduce((sum, student) => sum + student.overallAttendanceRate, 0) / studentEngagement.length,
      quizCompletionRate:
        studentEngagement.reduce((sum, student) => sum + student.quizCompletionRate, 0) / studentEngagement.length,
      assessmentSubmissionRate:
        studentEngagement.reduce((sum, student) => sum + student.assessmentSubmissionRate, 0) /
        studentEngagement.length,
      overallEngagement:
        studentEngagement.reduce((sum, student) => sum + student.overallEngagement, 0) / studentEngagement.length,
    }

    // Calculate engagement distribution
    const engagementDistribution = {
      veryHigh: studentEngagement.filter((student) => student.engagementLevel === "Very High").length,
      high: studentEngagement.filter((student) => student.engagementLevel === "High").length,
      moderate: studentEngagement.filter((student) => student.engagementLevel === "Moderate").length,
      low: studentEngagement.filter((student) => student.engagementLevel === "Low").length,
      veryLow: studentEngagement.filter((student) => student.engagementLevel === "Very Low").length,
    }

    return {
      courseId,
      semesterId,
      studentCount: studentEngagement.length,
      studentEngagement,
      classAverages,
      engagementDistribution,
      topEngagedStudents: studentEngagement.slice(0, 5),
      leastEngagedStudents: [...studentEngagement].reverse().slice(0, 5),
    }
  }

  private getEngagementLevel(engagementScore: number): string {
    if (engagementScore >= 90) return "Very High"
    if (engagementScore >= 75) return "High"
    if (engagementScore >= 60) return "Moderate"
    if (engagementScore >= 40) return "Low"
    return "Very Low"
  }

  async getTeachingMaterials(courseId: string, semesterId: string) {
    const teachingMaterials = await TeachingMaterial.findAll({
      where: {
        courseId,
        semesterId,
      },
      order: [["createdAt", "DESC"]],
    })

    // Group by type
    const materialsByType: Record<string, any[]> = {}
    teachingMaterials.forEach((material) => {
      if (!materialsByType[material.type]) {
        materialsByType[material.type] = []
      }
      materialsByType[material.type].push({
        id: material.id,
        title: material.title,
        description: material.description,
        fileUrl: material.fileUrl,
        fileType: material.fileType,
        fileSize: material.fileSize,
        uploadDate: material.createdAt,
        type: material.type,
      })
    })

    return {
      courseId,
      semesterId,
      totalMaterials: teachingMaterials.length,
      materialsByType,
      recentMaterials: teachingMaterials.slice(0, 5).map((material) => ({
        id: material.id,
        title: material.title,
        description: material.description,
        fileUrl: material.fileUrl,
        fileType: material.fileType,
        fileSize: material.fileSize,
        uploadDate: material.createdAt,
        type: material.type,
      })),
    }
  }
}
