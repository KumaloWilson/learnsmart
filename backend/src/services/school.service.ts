
import type { CreateSchoolDto, UpdateSchoolDto } from "../dto/school.dto"
import { School } from "../models/School"

export class SchoolService {
  async findAll() {
    return School.findAll({
      include: ["departments"],
    })
  }

  async findById(id: string) {
    return School.findByPk(id, {
      include: ["departments"],
    })
  }

  async create(data: CreateSchoolDto) {
    return School.create(data as any)
  }

  async update(id: string, data: UpdateSchoolDto) {
    const school = await School.findByPk(id)
    if (!school) {
      throw new Error("School not found")
    }
    return school.update(data)
  }

  async delete(id: string) {
    const school = await School.findByPk(id)
    if (!school) {
      throw new Error("School not found")
    }
    await school.destroy()
    return { message: "School deleted successfully" }
  }
}
