import { Program } from "../models"
import type { CreateProgramDto, UpdateProgramDto } from "../dto/program.dto"

export class ProgramService {
  async findAll() {
    return Program.findAll({
      include: ["department", "courses"],
    })
  }

  async findById(id: string) {
    return Program.findByPk(id, {
      include: ["department", "courses"],
    })
  }

  async findByDepartment(departmentId: string) {
    return Program.findAll({
      where: { departmentId },
      include: ["courses"],
    })
  }

  async create(data: CreateProgramDto) {
    return Program.create(data as any)
  }

  async update(id: string, data: UpdateProgramDto) {
    const program = await Program.findByPk(id)
    if (!program) {
      throw new Error("Program not found")
    }
    return program.update(data)
  }

  async delete(id: string) {
    const program = await Program.findByPk(id)
    if (!program) {
      throw new Error("Program not found")
    }
    await program.destroy()
    return { message: "Program deleted successfully" }
  }
}
