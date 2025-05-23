import type { CreatePeriodDto, UpdatePeriodDto } from "../dto/period.dto"
import { Period } from "../models/Period"

export class PeriodService {
  async findAll() {
    return Period.findAll({
      include: ["semester"],
    })
  }

  async findById(id: string) {
    return Period.findByPk(id, {
      include: ["semester"],
    })
  }

  async findBySemester(semesterId: string) {
    return Period.findAll({
      where: { semesterId },
    })
  }

  async create(data: CreatePeriodDto) {
    return Period.create(data as any)
  }

  async update(id: string, data: UpdatePeriodDto) {
    const period = await Period.findByPk(id)
    if (!period) {
      throw new Error("Period not found")
    }
    return period.update(data)
  }

  async delete(id: string) {
    const period = await Period.findByPk(id)
    if (!period) {
      throw new Error("Period not found")
    }
    await period.destroy()
    return { message: "Period deleted successfully" }
  }
}
