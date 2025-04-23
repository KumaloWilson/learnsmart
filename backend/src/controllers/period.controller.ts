import type { Request, Response } from "express"
import { PeriodService } from "../services/period.service"
import type { CreatePeriodDto, UpdatePeriodDto } from "../dto/period.dto"

export class PeriodController {
  private periodService: PeriodService

  constructor() {
    this.periodService = new PeriodService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const periods = await this.periodService.findAll()
      return res.status(200).json(periods)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching periods", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const period = await this.periodService.findById(id)

      if (!period) {
        return res.status(404).json({ message: "Period not found" })
      }

      return res.status(200).json(period)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching period", error })
    }
  }

  getBySemester = async (req: Request, res: Response) => {
    try {
      const { semesterId } = req.params
      const periods = await this.periodService.findBySemester(semesterId)
      return res.status(200).json(periods)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching periods by semester", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreatePeriodDto = req.body
      const period = await this.periodService.create(data)
      return res.status(201).json(period)
    } catch (error) {
      return res.status(500).json({ message: "Error creating period", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdatePeriodDto = req.body
      const period = await this.periodService.update(id, data)
      return res.status(200).json(period)
    } catch (error) {
      return res.status(500).json({ message: "Error updating period", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.periodService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting period", error })
    }
  }
}
