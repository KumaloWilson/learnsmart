import { Semester } from "../models"
import type { CreateSemesterDto, UpdateSemesterDto } from "../dto/semester.dto"

export class SemesterService {
  async findAll() {
    return Semester.findAll({
      include: ["courses", "periods"],
    })
  }

  async findById(id: string) {
    return Semester.findByPk(id, {
      include: ["courses", "periods"],
    })
  }

  async findActive() {
    return Semester.findOne({
      where: { isActive: true },
      include: ["courses", "periods"],
    })
  }

  async create(data: CreateSemesterDto) {
    // If this semester is active, deactivate all others
    if (data.isActive) {
      await Semester.update({ isActive: false }, { where: {} })
    }
    return Semester.create(data as any)
  }

  async update(id: string, data: UpdateSemesterDto) {
    const semester = await Semester.findByPk(id)
    if (!semester) {
      throw new Error("Semester not found")
    }

    // If this semester is being set to active, deactivate all others
    if (data.isActive) {
      await Semester.update({ isActive: false }, { where: {} })
    }

    return semester.update(data)
  }

  async delete(id: string) {
    const semester = await Semester.findByPk(id)
    if (!semester) {
      throw new Error("Semester not found")
    }
    await semester.destroy()
    return { message: "Semester deleted successfully" }
  }
}
