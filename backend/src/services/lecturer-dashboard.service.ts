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
} from "../models"
import { AttendanceService } from "./attendance.service"
import { StudentPerformanceService } from "./student-performance.service"
import type {
  LecturerDashboardStatsDto,
  CourseStatisticsDto,
  StudentProgressDto,
  TeachingLoadDto,
  UpcomingScheduleDto,
} from "../dto/lecturer-dashboard.dto"

export class LecturerDashboardService {
  private attendanceService: AttendanceService
  private studentPerformanceService: StudentPerformanceService

  constructor() {
    this.attendanceService = new AttendanceService()
    this.studentPerformanceService = new StudentPerformanceService()
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
        courseId: {
          [Op.in]: courseIds,
        },
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
        courseId: courseIds[0],
        semesterId,
      })
      const totalPerformance = performances.reduce((sum, perf) => sum + perf.overallPerformance, 0)
      averagePerformance = performances.length > 0 ? totalPerformance / performances.length : 0
    }

    return {
      totalCourses,
      totalStudents,
      upcomingClasses,
      pendingAssignments,
      recentQuizzes,
      averageAttendance,
      averagePerformance,
    }
  }

  async getCourseStatistics(data: CourseStatisticsDto) {
    const { courseId, semesterId } = data

    // Get course details
    const course = await Course.findByPk(courseId, {
      include: ["program"],
    })

    if (!course) {
      throw new Error("Course not found")
    }

    // Get enrollment statistics
    const totalEnrollments = await CourseEnrollment.count({
      where: {
        courseId,
        semesterId,
      },
    })

    const activeEnrollments = await CourseEnrollment.count({
      where: {
        courseId,
        semesterId,
        status: "enrolled",
      },
    })

    // Get assignment statistics
    const assignments = await Assessment.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: AssessmentSubmission,
          required: false,
        },
      ],
    })

    const totalAssignments = assignments.length
    const totalSubmissions = assignments.reduce((sum, assignment) => sum + (assignment.submissions?.length || 0), 0)
    const submissionRate = totalAssignments > 0 ? (totalSubmissions / (totalAssignments * activeEnrollments)) * 100 : 0

    // Get quiz statistics
    const quizzes = await Quiz.findAll({
      where: {
        courseId,
        semesterId,
      },
      include: [
        {
          model: QuizAttempt,
          required: false,
        },
      ],
    })

    const totalQuizzes = quizzes.length
    const totalAttempts = quizzes.reduce((sum, quiz) => sum + (quiz.attempts?.length || 0), 0)
    const attemptRate = totalQuizzes > 0 ? (totalAttempts / (totalQuizzes * activeEnrollments)) * 100 : 0

    // Get attendance statistics
    const attendanceStats = await this.attendanceService.getAttendanceStatistics({
      courseId,
      semesterId,
    })

    // Get performance statistics
    const performances = await this.studentPerformanceService.findAll({
      courseId,
      semesterId,
    })

    const averagePerformance =
      performances.length > 0
        ? performances.reduce((sum, perf) => sum + perf.overallPerformance, 0) / performances.length
        : 0

    // Get teaching materials
    const teachingMaterials = await TeachingMaterial.count({
      where: {
        courseId,
        semesterId,
      },
    })

    return {
      course: {
        id: course.id,
        name: course.name,
        code: course.code,
        program: course.program?.name,
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
      },
      assignments: {
        total: totalAssignments,
        submissions: totalSubmissions,
        submissionRate,
      },
      quizzes: {
        total: totalQuizzes,
        attempts: totalAttempts,
        attemptRate,
      },
      attendance: attendanceStats,
      performance: {
        averagePerformance,
        categoryDistribution: {
          excellent: performances.filter((p) => p.performanceCategory === "excellent").length,
          good: performances.filter((p) => p.performanceCategory === "good").length,
          average: performances.filter((p) => p.performanceCategory === "average").length,
          below_average: performances.filter((p) => p.performanceCategory === "below_average").length,
          poor: performances.filter((p) => p.performanceCategory === "poor").length,
        },
      },
      teachingMaterials,
    }
  }

  async getStudentProgress(data: StudentProgressDto) {
    const { studentProfileId, courseId, semesterId } = data

    // Get student details
    const student = await StudentProfile.findByPk(studentProfileId, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    })

    if (!student) {
      throw new Error("Student not found")
    }

    // Get enrollment details
    const enrollment = await CourseEnrollment.findOne({
      where: {
        studentProfileId,
        courseId,
        semesterId,
      },
    })

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course")
    }

    // Get attendance details
    const attendanceDetails = await this.attendanceService.getStudentAttendanceDetails(
      studentProfileId,
      courseId,
      semesterId,
    )

    // Get assignment submissions
    const submissions = await AssessmentSubmission.findAll({
      include: [
        {
          model: Assessment,
          where: {
            courseId,
            semesterId,
          },
          required: true,
        },
      ],
      where: {
        studentProfileId,
      },
    })

    // Get quiz attempts
    const attempts = await QuizAttempt.findAll({
      include: [
        {
          model: Quiz,
          where: {
            courseId,
            semesterId,
          },
          required: true,
        },
      ],
      where: {
        studentProfileId,
      },
    })

    // Get performance analysis
    const performance = await this.studentPerformanceService.findByStudent(studentProfileId, courseId, semesterId)

    return {
      student: {
        id: student.id,
        name: `${student.user?.firstName} ${student.user?.lastName}`,
        email: student.user?.email,
        studentId: student.studentId,
      },
      enrollment: {
        status: enrollment.status,
        enrollmentDate: enrollment.createdAt,
      },
      attendance: attendanceDetails,
      assignments: submissions.map((submission) => ({
        assessmentId: submission.assessmentId,
        assessmentTitle: submission.assessment?.title,
        submissionDate: submission.createdAt,
        isGraded: submission.isGraded,
        marks: submission.marks,
        totalMarks: submission.assessment?.totalMarks,
        feedback: submission.feedback,
      })),
      quizzes: attempts.map((attempt) => ({
        quizId: attempt.quizId,
        quizTitle: attempt.quiz?.title,
        attemptDate: attempt.startTime,
        status: attempt.status,
        score: attempt.score,
        totalMarks: attempt.quiz?.totalMarks,
        isPassed: attempt.isPassed,
      })),
      performance: performance
        ? {
            attendancePercentage: performance.attendancePercentage,
            assignmentAverage: performance.assignmentAverage,
            quizAverage: performance.quizAverage,
            overallPerformance: performance.overallPerformance,
            performanceCategory: performance.performanceCategory,
            strengths: performance.strengths,
            weaknesses: performance.weaknesses,
            recommendations: performance.recommendations,
          }
        : null,
    }
  }

  async getTeachingLoad(data: TeachingLoadDto) {
    const { lecturerProfileId, semesterId } = data

    // Get course assignments
    const whereClause: any = {
      lecturerProfileId,
      isActive: true,
    }

    if (semesterId) {
      whereClause.semesterId = semesterId
    }

    const courseAssignments = await CourseAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
    })

    // Group by semester
    const semesterGroups: Record<string, any[]> = {}
    courseAssignments.forEach((assignment) => {
      if (!semesterGroups[assignment.semesterId]) {
        semesterGroups[assignment.semesterId] = []
      }
      semesterGroups[assignment.semesterId].push(assignment)
    })

    // Calculate teaching load for each semester
    const teachingLoad = Object.entries(semesterGroups).map(([semesterId, assignments]) => {
      const semester = assignments[0].semester
      const totalCourses = assignments.length
      const primaryCourses = assignments.filter((a) => a.role === "primary").length
      const assistantCourses = assignments.filter((a) => a.role === "assistant").length
      const guestCourses = assignments.filter((a) => a.role === "guest").length

      return {
        semesterId,
        semesterName: semester?.name,
        academicYear: semester?.academicYear,
        totalCourses,
        primaryCourses,
        assistantCourses,
        guestCourses,
        courses: assignments.map((assignment) => ({
          courseId: assignment.courseId,
          courseName: assignment.course?.name,
          courseCode: assignment.course?.code,
          role: assignment.role,
        })),
      }
    })

    return {
      lecturerProfileId,
      teachingLoad,
    }
  }

  async getUpcomingSchedule(data: UpcomingScheduleDto) {
    const { lecturerProfileId, days = 7 } = data
    const now = new Date()
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    // Get upcoming virtual classes
    const virtualClasses = await VirtualClass.findAll({
      where: {
        lecturerProfileId,
        scheduledStartTime: {
          [Op.between]: [now, endDate],
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
    })

    // Get upcoming assignment deadlines
    const assignments = await Assessment.findAll({
      where: {
        lecturerProfileId,
        dueDate: {
          [Op.between]: [now, endDate],
        },
      },
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["dueDate", "ASC"]],
    })

    // Get upcoming quiz deadlines
    const quizzes = await Quiz.findAll({
      where: {
        lecturerProfileId,
        endDate: {
          [Op.between]: [now, endDate],
        },
      },
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["endDate", "ASC"]],
    })

    // Combine all events
    const events = [
      ...virtualClasses.map((vc) => ({
        type: "virtual_class",
        id: vc.id,
        title: vc.title,
        description: vc.description,
        startTime: vc.scheduledStartTime,
        endTime: vc.scheduledEndTime,
        course: vc.course?.name,
        courseId: vc.courseId,
        semester: vc.semester?.name,
        semesterId: vc.semesterId,
      })),
      ...assignments.map((a) => ({
        type: "assignment",
        id: a.id,
        title: a.title,
        description: a.description,
        startTime: null,
        endTime: a.dueDate,
        course: a.course?.name,
        courseId: a.courseId,
        semester: a.semester?.name,
        semesterId: a.semesterId,
      })),
      ...quizzes.map((q) => ({
        type: "quiz",
        id: q.id,
        title: q.title,
        description: q.description,
        startTime: q.startDate,
        endTime: q.endDate,
        course: q.course?.name,
        courseId: q.courseId,
        semester: q.semester?.name,
        semesterId: q.semesterId,
      })),
    ]

    // Sort by start time
    events.sort((a, b) => {
      const timeA = a.startTime || a.endTime
      const timeB = b.startTime || b.endTime
      return new Date(timeA).getTime() - new Date(timeB).getTime()
    })

    return {
      lecturerProfileId,
      days,
      events,
    }
  }
}
