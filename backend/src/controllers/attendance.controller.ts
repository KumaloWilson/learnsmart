import type { Request, Response } from "express"
import { AttendanceService } from "../services/attendance.service"
import type {
  CreatePhysicalAttendanceDto,
  UpdatePhysicalAttendanceDto,
  BulkCreateAttendanceDto,
  AttendanceFilterDto,
  AttendanceStatisticsDto,
  AttendanceStatisticsParamsDto,
} from "../dto/attendance.dto"

export class AttendanceController {
  private attendanceService: AttendanceService

  constructor() {
    this.attendanceService = new AttendanceService()
  }

  async findAll(req: Request, res: Response) {
    try {
      const filters: AttendanceFilterDto = req.query as any
      const attendances = await this.attendanceService.findAll(filters)
      return res.status(200).json(attendances)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const attendance = await this.attendanceService.findById(id)
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreatePhysicalAttendanceDto = req.body
      const attendance = await this.attendanceService.create(data)
      return res.status(201).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdatePhysicalAttendanceDto = req.body
      const attendance = await this.attendanceService.update(id, data)
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async bulkCreate(req: Request, res: Response) {
    try {
      const data: BulkCreateAttendanceDto = req.body
      const attendances = await this.attendanceService.bulkCreate(data)
      return res.status(201).json(attendances)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.attendanceService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Statistics methods
  async getAttendanceStatistics(req: Request, res: Response) {
    try {
      const params: AttendanceStatisticsParamsDto = {
        courseId: req.params.courseId,
        semesterId: req.params.semesterId,
        studentProfileId: req.query.studentProfileId as string,
      }
      const statistics = await this.attendanceService.getAttendanceStatistics(params)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getStudentAttendanceDetails(req: Request, res: Response) {
    try {
      const { studentProfileId, courseId, semesterId } = req.params
      const details = await this.attendanceService.getStudentAttendanceDetails(studentProfileId, courseId, semesterId)
      return res.status(200).json(details)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getClassAttendanceReport(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const report = await this.attendanceService.getClassAttendanceReport(courseId, semesterId)
      return res.status(200).json(report)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}