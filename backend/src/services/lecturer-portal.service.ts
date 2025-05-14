import { StorageService } from "./storage.service"
import { CourseTopicService } from "./course-topic.service"
import { TopicProgressService } from "./topic-progress.service"
import { CourseMasteryService } from "./course-mastery.service"
import { CourseAssignment } from "../models/CourseAssignment"
import { CourseTopic } from "../models/CourseTopic"

export class LecturerPortalService {
  private storageService: StorageService
  private courseTopicService: CourseTopicService
  private topicProgressService: TopicProgressService
  private courseMasteryService: CourseMasteryService

  constructor() {
    this.storageService = new StorageService()
    this.courseTopicService = new CourseTopicService()
    this.topicProgressService = new TopicProgressService()
    this.courseMasteryService = new CourseMasteryService()
  }

  // Existing methods...

  // Course Topic Management
  async getCourseTopics(lecturerProfileId: string, courseId: string, semesterId: string) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.getCourseTopics(courseId, semesterId)
  }

  async createCourseTopic(
    lecturerProfileId: string,
    topicData: {
      title: string
      description?: string
      orderIndex: number
      durationHours: number
      learningObjectives?: string[]
      keywords?: string[]
      difficulty: "beginner" | "intermediate" | "advanced"
      courseId: string
      semesterId: string
    },
  ) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId: topicData.courseId,
        semesterId: topicData.semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.createCourseTopic(topicData)
  }

  async updateCourseTopic(lecturerProfileId: string, topicId: string, topicData: Partial<CourseTopic>) {
    const topic = await CourseTopic.findByPk(topicId)
    if (!topic) {
      throw new Error("Course topic not found")
    }

    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId: topic.courseId,
        semesterId: topic.semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.updateCourseTopic(topicId, topicData)
  }

  async deleteCourseTopic(lecturerProfileId: string, topicId: string) {
    const topic = await CourseTopic.findByPk(topicId)
    if (!topic) {
      throw new Error("Course topic not found")
    }

    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId: topic.courseId,
        semesterId: topic.semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.deleteCourseTopic(topicId)
  }

  // Topic Progress Management
  async getTopicProgressStatistics(lecturerProfileId: string, courseId: string, semesterId: string) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.getTopicProgressStatistics(courseId, semesterId)
  }

  async getStudentTopicProgress(
    lecturerProfileId: string,
    studentProfileId: string,
    courseId: string,
    semesterId: string,
  ) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseTopicService.getStudentTopicProgress(studentProfileId, courseId, semesterId)
  }

  // Course Mastery Management
  async getCourseMasteryDistribution(lecturerProfileId: string, courseId: string, semesterId: string) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseMasteryService.getCourseMasteryDistribution(courseId, semesterId)
  }

  async getCourseStudentMasteries(lecturerProfileId: string, courseId: string, semesterId: string) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseMasteryService.getCourseStudentMasteries(courseId, semesterId)
  }

  async getCourseMasteryStatistics(lecturerProfileId: string, courseId: string, semesterId: string) {
    // Verify lecturer is assigned to this course
    const assignment = await CourseAssignment.findOne({
      where: {
        lecturerProfileId,
        courseId,
        semesterId,
      },
    })

    if (!assignment) {
      throw new Error("Lecturer is not assigned to this course")
    }

    return this.courseMasteryService.getCourseMasteryStatistics(courseId, semesterId)
  }
}
