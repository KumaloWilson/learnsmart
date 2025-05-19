import type { Request, Response } from "express"
import { ProgramService } from "../services/program.service"
import type { CreateProgramDto, UpdateProgramDto } from "../dto/program.dto"

export class ProgramController {
  private programService: ProgramService

  constructor() {
    this.programService = new ProgramService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const programs = await this.programService.findAll()
      return res.status(200).json(programs)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching programs", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const program = await this.programService.findById(id)

      if (!program) {
        return res.status(404).json({ message: "Program not found" })
      }

      return res.status(200).json(program)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching program", error })
    }
  }

  getByDepartment = async (req: Request, res: Response) => {
    try {
      const { departmentId } = req.params
      const programs = await this.programService.findByDepartment(departmentId)
      return res.status(200).json(programs)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching programs by department", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateProgramDto = req.body
      const program = await this.programService.create(data)
      return res.status(201).json(program)
    } catch (error) {
      return res.status(500).json({ message: "Error creating program", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateProgramDto = req.body
      const program = await this.programService.update(id, data)
      return res.status(200).json(program)
    } catch (error) {
      return res.status(500).json({ message: "Error updating program", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.programService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting program", error })
    }
  }
}
