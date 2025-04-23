import type { Request, Response } from "express"
import { LecturerDashboardService } from "../services/lecturer-dashboard.service"
import type {
  CourseStatisticsDto,
  StudentProgressDto,
  TeachingLoadDto,
  UpcomingScheduleDto,
} from "../dto/lecturer-dashboard.dto"

export class LecturerDashboardController {
  private lecturerDashboardService: LecturerDashboardService

  constructor() {
    this.lecturerDashboardService = new LecturerDashboardService()
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
      const { lecturerProfileId } = req.params
      const stats = await this.lecturerDashboardService.getDashboardStats(lecturerProfileId)
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getCourseStatistics(req: Request, res: Response) {
    try {
      const data: CourseStatisticsDto = {
        courseId: req.params.courseId,
        semesterId: req.params.semesterId,
      }
      const statistics = await this.lecturerDashboardService.getCourseStatistics(data)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getStudentProgress(req: Request, res: Response) {
    try {
      const data: StudentProgressDto = {
        studentProfileId: req.params.studentProfileId,
        courseId: req.params.courseId,
        semesterId: req.params.semesterId,
      }
      const progress = await this.lecturerDashboardService.getStudentProgress(data)
      return res.status(200).json(progress)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getTeachingLoad(req: Request, res: Response) {
    try {
      const data: TeachingLoadDto = {
        lecturerProfileId: req.params.lecturerProfileId,
        semesterId: req.query.semesterId as string,
      }
      const teachingLoad = await this.lecturerDashboardService.getTeachingLoad(data)
      return res.status(200).json(teachingLoad)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getUpcomingSchedule(req: Request, res: Response) {
    try {
      const data: UpcomingScheduleDto = {
        lecturerProfileId: req.params.lecturerProfileId,
        days: req.query.days ? Number.parseInt(req.query.days as string) : undefined,
      }
      const schedule = await this.lecturerDashboardService.getUpcomingSchedule(data)
      return res.status(200).json(schedule)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
