import type { Request, Response } from "express"
import { SemesterService } from "../services/semester.service"
import type { CreateSemesterDto, UpdateSemesterDto } from "../dto/semester.dto"

export class SemesterController {
  private semesterService: SemesterService

  constructor() {
    this.semesterService = new SemesterService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const semesters = await this.semesterService.findAll()
      return res.status(200).json(semesters)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching semesters", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const semester = await this.semesterService.findById(id)

      if (!semester) {
        return res.status(404).json({ message: "Semester not found" })
      }

      return res.status(200).json(semester)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching semester", error })
    }
  }

  getActive = async (req: Request, res: Response) => {
    try {
      const semester = await this.semesterService.findActive()

      if (!semester) {
        return res.status(404).json({ message: "No active semester found" })
      }

      return res.status(200).json(semester)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching active semester", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateSemesterDto = req.body
      const semester = await this.semesterService.create(data)
      return res.status(201).json(semester)
    } catch (error) {
      return res.status(500).json({ message: "Error creating semester", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateSemesterDto = req.body
      const semester = await this.semesterService.update(id, data)
      return res.status(200).json(semester)
    } catch (error) {
      return res.status(500).json({ message: "Error updating semester", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.semesterService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting semester", error })
    }
  }
}
