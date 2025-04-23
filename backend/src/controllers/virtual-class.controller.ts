import type { Request, Response } from "express"
import { VirtualClassService } from "../services/virtual-class.service"
import type {
  CreateVirtualClassDto,
  UpdateVirtualClassDto,
  VirtualClassAttendanceDto,
  UpdateVirtualClassAttendanceDto,
  VirtualClassFilterDto,
} from "../dto/virtual-class.dto"

export class VirtualClassController {
  private virtualClassService: VirtualClassService

  constructor() {
    this.virtualClassService = new VirtualClassService()
  }

  async findAll(req: Request, res: Response) {
    try {
      const filters: VirtualClassFilterDto = req.query as any
      const virtualClasses = await this.virtualClassService.findAll(filters)
      return res.status(200).json(virtualClasses)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const virtualClass = await this.virtualClassService.findById(id)
      if (!virtualClass) {
        return res.status(404).json({ message: "Virtual class not found" })
      }
      return res.status(200).json(virtualClass)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findUpcoming(req: Request, res: Response) {
    try {
      const { lecturerProfileId } = req.params
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 5
      const virtualClasses = await this.virtualClassService.findUpcoming(lecturerProfileId, limit)
      return res.status(200).json(virtualClasses)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateVirtualClassDto = req.body
      const virtualClass = await this.virtualClassService.create(data)
      return res.status(201).json(virtualClass)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdateVirtualClassDto = req.body
      const virtualClass = await this.virtualClassService.update(id, data)
      return res.status(200).json(virtualClass)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.virtualClassService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Attendance methods
  async getAttendance(req: Request, res: Response) {
    try {
      const { virtualClassId } = req.params
      const attendance = await this.virtualClassService.getAttendance(virtualClassId)
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async recordAttendance(req: Request, res: Response) {
    try {
      const data: VirtualClassAttendanceDto = req.body
      const attendance = await this.virtualClassService.recordAttendance(data)
      return res.status(201).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async updateAttendance(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdateVirtualClassAttendanceDto = req.body
      const attendance = await this.virtualClassService.updateAttendance(id, data)
      return res.status(200).json(attendance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async bulkRecordAttendance(req: Request, res: Response) {
    try {
      const { virtualClassId } = req.params
      const { attendances } = req.body
      const result = await this.virtualClassService.bulkRecordAttendance(virtualClassId, attendances)
      return res.status(201).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Analytics methods
  async getAttendanceStatistics(req: Request, res: Response) {
    try {
      const { virtualClassId } = req.params
      const statistics = await this.virtualClassService.getAttendanceStatistics(virtualClassId)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getVirtualClassesByCourse(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const virtualClasses = await this.virtualClassService.getVirtualClassesByCourse(courseId, semesterId)
      return res.status(200).json(virtualClasses)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
