import type { Request, Response } from "express"
import { SchoolService } from "../services/school.service"
import type { CreateSchoolDto, UpdateSchoolDto } from "../dto/school.dto"

export class SchoolController {
  private schoolService: SchoolService

  constructor() {
    this.schoolService = new SchoolService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const schools = await this.schoolService.findAll()
      return res.status(200).json(schools)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching schools", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const school = await this.schoolService.findById(id)

      if (!school) {
        return res.status(404).json({ message: "School not found" })
      }

      return res.status(200).json(school)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching school", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateSchoolDto = req.body
      const school = await this.schoolService.create(data)
      return res.status(201).json(school)
    } catch (error) {
      return res.status(500).json({ message: "Error creating school", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateSchoolDto = req.body
      const school = await this.schoolService.update(id, data)
      return res.status(200).json(school)
    } catch (error) {
      return res.status(500).json({ message: "Error updating school", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.schoolService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting school", error })
    }
  }
}
