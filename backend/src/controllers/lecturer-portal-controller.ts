import type { Request, Response } from "express"
import { CourseTopicService } from "../services/course-topic.service"
import { TopicProgressService } from "../services/topic-progress.service"
import { CourseMasteryService } from "../services/course-mastery.service"
import type { CreateCourseTopicDto, UpdateCourseTopicDto } from "../dto/course-topic.dto"
import { LecturerPortalService } from "../services/lecturer-portal.service"

export class LecturerPortalController {
  private lecturerPortalService: LecturerPortalService
  private courseTopicService: CourseTopicService
  private topicProgressService: TopicProgressService
  private courseMasteryService: CourseMasteryService

  constructor() {
    this.lecturerPortalService = new LecturerPortalService()
    this.courseTopicService = new CourseTopicService()
    this.topicProgressService = new TopicProgressService()
    this.courseMasteryService = new CourseMasteryService()
  }

  // Course Topics Management
  async getCourseTopics(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const topics = await this.courseTopicService.getCourseTopics(courseId, semesterId)
      return res.status(200).json(topics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getCourseTopic(req: Request, res: Response) {
    try {
      const { id } = req.params
      const topic = await this.courseTopicService.getTopicById(id)
      if (!topic) {
        return res.status(404).json({ message: "Course topic not found" })
      }
      return res.status(200).json(topic)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async createCourseTopic(req: Request, res: Response) {
    try {
      const topicData: CreateCourseTopicDto = req.body
      const topic = await this.courseTopicService.createCourseTopic(topicData)
      return res.status(201).json(topic)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async updateCourseTopic(req: Request, res: Response) {
    try {
      const { id } = req.params
      const topicData: UpdateCourseTopicDto = req.body
      const topic = await this.courseTopicService.updateCourseTopic(id, topicData)
      if (!topic) {
        return res.status(404).json({ message: "Course topic not found" })
      }
      return res.status(200).json(topic)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async deleteCourseTopic(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.courseTopicService.deleteCourseTopic(id)
      if (!result) {
        return res.status(404).json({ message: "Course topic not found" })
      }
      return res.status(200).json({ message: "Course topic deleted successfully" })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async reorderCourseTopics(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const { topicOrder } = req.body
      const result = await this.courseTopicService.reorderTopics(courseId, semesterId, topicOrder)
      if (!result) {
        return res.status(400).json({ message: "Failed to reorder topics" })
      }
      return res.status(200).json({ message: "Topics reordered successfully" })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Topic Progress Management
  async getTopicProgressStatistics(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const statistics = await this.courseTopicService.getTopicProgressStatistics(courseId, semesterId)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getStudentTopicProgress(req: Request, res: Response) {
    try {
      const { studentProfileId, courseId, semesterId } = req.params
      const progress = await this.courseTopicService.getStudentTopicProgress(studentProfileId, courseId, semesterId)
      return res.status(200).json(progress)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Course Mastery Management
  async getCourseMasteryDistribution(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const distribution = await this.courseMasteryService.getCourseMasteryDistribution(courseId, semesterId)
      return res.status(200).json(distribution)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getCourseStudentMasteries(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const masteries = await this.courseMasteryService.getCourseStudentMasteries(courseId, semesterId)
      return res.status(200).json(masteries)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getCourseMasteryStatistics(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const statistics = await this.courseMasteryService.getCourseMasteryStatistics(courseId, semesterId)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Teaching Materials for Topics
  async getTopicTeachingMaterials(req: Request, res: Response) {
    try {
      const { topicId } = req.params
      const materials = await this.courseTopicService.getTopicTeachingMaterials(topicId)
      return res.status(200).json(materials)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getTopicLearningResources(req: Request, res: Response) {
    try {
      const { topicId } = req.params
      const resources = await this.courseTopicService.getTopicLearningResources(topicId)
      return res.status(200).json(resources)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
