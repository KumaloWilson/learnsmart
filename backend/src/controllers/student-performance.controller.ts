import type { Request, Response } from "express"
import { StudentPerformanceService } from "../services/student-performance.service"
import type {
  CreateStudentPerformanceDto,
  UpdateStudentPerformanceDto,
  GeneratePerformanceAnalysisDto,
  PerformanceFilterDto,
  ClassPerformanceAnalysisDto,
} from "../dto/student-performance.dto"

export class StudentPerformanceController {
  private studentPerformanceService: StudentPerformanceService

  constructor() {
    this.studentPerformanceService = new StudentPerformanceService()
  }

  async findAll(req: Request, res: Response) {
    try {
      const filters: PerformanceFilterDto = req.query as any
      const performances = await this.studentPerformanceService.findAll(filters)
      return res.status(200).json(performances)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const performance = await this.studentPerformanceService.findById(id)
      if (!performance) {
        return res.status(404).json({ message: "Student performance record not found" })
      }
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findByStudent(req: Request, res: Response) {
    try {
      const { studentProfileId, courseId, semesterId } = req.params
      const performance = await this.studentPerformanceService.findByStudent(studentProfileId, courseId, semesterId)
      if (!performance) {
        return res.status(404).json({ message: "Student performance record not found" })
      }
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateStudentPerformanceDto = req.body
      const performance = await this.studentPerformanceService.create(data)
      return res.status(201).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdateStudentPerformanceDto = req.body
      const performance = await this.studentPerformanceService.update(id, data)
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.studentPerformanceService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Analysis methods
  async generatePerformanceAnalysis(req: Request, res: Response) {
    try {
      const data: GeneratePerformanceAnalysisDto = req.body
      const analysis = await this.studentPerformanceService.generatePerformanceAnalysis(data)
      return res.status(200).json(analysis)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async generateClassPerformanceAnalysis(req: Request, res: Response) {
    try {
      const data: ClassPerformanceAnalysisDto = req.body
      const analysis = await this.studentPerformanceService.generateClassPerformanceAnalysis(data)
      return res.status(200).json(analysis)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
