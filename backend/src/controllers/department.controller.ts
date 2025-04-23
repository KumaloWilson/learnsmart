import type { Request, Response } from "express"
import { DepartmentService } from "../services/department.service"
import type { CreateDepartmentDto, UpdateDepartmentDto } from "../dto/department.dto"

export class DepartmentController {
  private departmentService: DepartmentService

  constructor() {
    this.departmentService = new DepartmentService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const departments = await this.departmentService.findAll()
      return res.status(200).json(departments)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching departments", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const department = await this.departmentService.findById(id)

      if (!department) {
        return res.status(404).json({ message: "Department not found" })
      }

      return res.status(200).json(department)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching department", error })
    }
  }

  getBySchool = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.params
      const departments = await this.departmentService.findBySchool(schoolId)
      return res.status(200).json(departments)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching departments by school", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateDepartmentDto = req.body
      const department = await this.departmentService.create(data)
      return res.status(201).json(department)
    } catch (error) {
      return res.status(500).json({ message: "Error creating department", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateDepartmentDto = req.body
      const department = await this.departmentService.update(id, data)
      return res.status(200).json(department)
    } catch (error) {
      return res.status(500).json({ message: "Error updating department", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.departmentService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting department", error })
    }
  }
}
