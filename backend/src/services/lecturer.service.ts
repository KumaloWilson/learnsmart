import { LecturerProfile } from "../models/LecturerProfile"
import { CourseAssignment } from "../models/CourseAssignment"
import { Assessment } from "../models/Assessment"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { TeachingMaterial } from "../models/TeachingMaterial"
import { User } from "../models/User"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { StudentProfile } from "../models/StudentProfile"
import { CourseEnrollment } from "../models/CourseEnrollment"

export class LecturerService {
  // Lecturer profile methods
  async getAllLecturers(): Promise<LecturerProfile[]> {
    return LecturerProfile.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    })
  }

  async getLecturerById(id: string): Promise<LecturerProfile | null> {
    return LecturerProfile.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    })
  }

  async getLecturerByUserId(userId: string): Promise<LecturerProfile | null> {
    return LecturerProfile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    })
  }

  async createLecturer(lecturerData: any): Promise<LecturerProfile> {
    return LecturerProfile.create(lecturerData)
  }

  async updateLecturer(id: string, lecturerData: any): Promise<LecturerProfile | null> {
    const lecturer = await LecturerProfile.findByPk(id)
    if (!lecturer) {
      return null
    }

    return lecturer.update(lecturerData)
  }

  async deleteLecturer(id: string): Promise<boolean> {
    const lecturer = await LecturerProfile.findByPk(id)
    if (!lecturer) {
      return false
    }

    await lecturer.destroy()
    return true
  }

  // Course assignment methods
  async getLecturerCourseAssignments(lecturerProfileId: string): Promise<CourseAssignment[]> {
    return CourseAssignment.findAll({
      where: { lecturerProfileId },
      include: [
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })
  }

  async assignCourseToLecturer(assignmentData: any): Promise<CourseAssignment> {
    return CourseAssignment.create(assignmentData)
  }

  async updateCourseAssignment(id: string, assignmentData: any): Promise<CourseAssignment | null> {
    const assignment = await CourseAssignment.findByPk(id)
    if (!assignment) {
      return null
    }

    return assignment.update(assignmentData)
  }

  async removeCourseAssignment(id: string): Promise<boolean> {
    const assignment = await CourseAssignment.findByPk(id)
    if (!assignment) {
      return false
    }

    await assignment.destroy()
    return true
  }

  // Assessment methods
  async getLecturerAssessments(lecturerProfileId: string): Promise<Assessment[]> {
    return Assessment.findAll({
      where: { lecturerProfileId },
      include: [
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })
  }

  async createAssessment(assessmentData: any): Promise<Assessment> {
    return Assessment.create(assessmentData)
  }

  async updateAssessment(id: string, assessmentData: any): Promise<Assessment | null> {
    const assessment = await Assessment.findByPk(id)
    if (!assessment) {
      return null
    }

    return assessment.update(assessmentData)
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const assessment = await Assessment.findByPk(id)
    if (!assessment) {
      return false
    }

    await assessment.destroy()
    return true
  }

  // Assessment submission methods
  async getAssessmentSubmissions(assessmentId: string): Promise<AssessmentSubmission[]> {
    return AssessmentSubmission.findAll({
      where: { assessmentId },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async gradeSubmission(id: string, grade: number, feedback: string): Promise<AssessmentSubmission | null> {
    const submission = await AssessmentSubmission.findByPk(id)
    if (!submission) {
      return null
    }

    return submission.update({
      grade,
      feedback,
      status: "graded",
      gradedAt: new Date(),
    })
  }

  // Teaching material methods
  async getTeachingMaterials(lecturerProfileId: string): Promise<TeachingMaterial[]> {
    return TeachingMaterial.findAll({
      where: { lecturerProfileId },
      include: [
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })
  }

  async getTeachingMaterialById(id: string): Promise<TeachingMaterial | null> {
    return TeachingMaterial.findByPk(id, {
      include: [
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })
  }

  async createTeachingMaterial(materialData: any): Promise<TeachingMaterial> {
    return TeachingMaterial.create(materialData)
  }

  async updateTeachingMaterial(id: string, materialData: any): Promise<TeachingMaterial | null> {
    const material = await TeachingMaterial.findByPk(id)
    if (!material) {
      return null
    }

    return material.update(materialData)
  }

  async deleteTeachingMaterial(id: string): Promise<boolean> {
    const material = await TeachingMaterial.findByPk(id)
    if (!material) {
      return false
    }

    await material.destroy()
    return true
  }

  // Additional methods for analytics
  async getLecturerCourseStudents(
    lecturerProfileId: string,
    courseId: string,
    semesterId: string,
  ): Promise<StudentProfile[]> {
    // Find all students enrolled in a course taught by this lecturer
    return StudentProfile.findAll({
      include: [
        {
          model: CourseEnrollment,
          as: "enrollments",
          where: {
            courseId,
            semesterId,
          },
          required: true,
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    })
  }

  async getLecturerCoursesWithEnrollmentCounts(lecturerProfileId: string): Promise<any[]> {
    // Get all courses assigned to this lecturer with enrollment counts
    const assignments = await CourseAssignment.findAll({
      where: { lecturerProfileId },
      include: [
        {
          model: Course,
          as: "course",
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    })

    const result = []

    for (const assignment of assignments) {
      const enrollmentCount = await CourseEnrollment.count({
        where: {
          courseId: assignment.courseId,
          semesterId: assignment.semesterId,
        },
      })

      result.push({
        ...assignment.toJSON(),
        enrollmentCount,
      })
    }

    return result
  }
  async getLecturerAssessmentStatistics(lecturerProfileId: string): Promise<any> {
    const assessments = await Assessment.findAll({
      where: { lecturerProfileId },
      include: [{
        model: AssessmentSubmission,
        as: 'submissions'
      }]
    })

    const statistics = {
      totalAssessments: assessments.length,
      assessmentsByType: {} as Record<string, number>,
      publishedAssessments: 0,
      unpublishedAssessments: 0,
      averageGrade: 0,
      totalSubmissions: 0,
      gradedSubmissions: 0,
      pendingSubmissions: 0
    }

    let totalGradeSum = 0
    let totalGradedSubmissions = 0

    for (const assessment of assessments) {
      // Count by type
      if (!statistics.assessmentsByType[assessment.type]) {
        statistics.assessmentsByType[assessment.type] = 0
      }
      statistics.assessmentsByType[assessment.type]++

      // Count by publish status
      if (assessment.isPublished) {
        statistics.publishedAssessments++
      } else {
        statistics.unpublishedAssessments++
      }

      // Get submission statistics
      if (assessment.submissions) {
        statistics.totalSubmissions += assessment.submissions.length

        for (const submission of assessment.submissions) {
          if (submission.isGraded) {
            statistics.gradedSubmissions++
            totalGradedSubmissions++
            totalGradeSum += submission.marks || 0
          } else {
            statistics.pendingSubmissions++
          }
        }
      }
    }

    // Calculate average grade
    if (totalGradedSubmissions > 0) {
      statistics.averageGrade = totalGradeSum / totalGradedSubmissions
    }

    return statistics
  }
}
