import { Department } from "../models"
import type { CreateDepartmentDto, UpdateDepartmentDto } from "../dto/department.dto"

export class DepartmentService {
  async findAll() {
    return Department.findAll({
      include: ["school", "programs"],
    })
  }

  async findById(id: string) {
    return Department.findByPk(id, {
      include: ["school", "programs"],
    })
  }

  async findBySchool(schoolId: string) {
    return Department.findAll({
      where: { schoolId },
      include: ["programs"],
    })
  }

  async create(data: CreateDepartmentDto) {
    return Department.create(data as any)
  }

  async update(id: string, data: UpdateDepartmentDto) {
    const department = await Department.findByPk(id)
    if (!department) {
      throw new Error("Department not found")
    }
    return department.update(data)
  }

  async delete(id: string) {
    const department = await Department.findByPk(id)
    if (!department) {
      throw new Error("Department not found")
    }
    await department.destroy()
    return { message: "Department deleted successfully" }
  }
}
