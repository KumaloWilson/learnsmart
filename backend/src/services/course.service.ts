import type { CreateCourseDto, UpdateCourseDto } from "../dto/course.dto"
import { Course } from "../models/Course"

export class CourseService {
  async findAll() {
    return Course.findAll({
      include: ["program", "semesters"],
    })
  }

  async findById(id: string) {
    return Course.findByPk(id, {
      include: ["program", "semesters"],
    })
  }

  async findByProgram(programId: string) {
    return Course.findAll({
      where: { programId },
      include: ["semesters"],
    })
  }

  async create(data: CreateCourseDto) {
    return Course.create(data as any)
  }

  async update(id: string, data: UpdateCourseDto) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error("Course not found")
    }
    return course.update(data)
  }

  async delete(id: string) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error("Course not found")
    }
    await course.destroy()
    return { message: "Course deleted successfully" }
  }

  async assignToSemester(courseId: string, semesterId: string) {
    const course = await Course.findByPk(courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    await course.$add("semesters", semesterId)
    return { message: "Course assigned to semester successfully" }
  }

  async removeFromSemester(courseId: string, semesterId: string) {
    const course = await Course.findByPk(courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    await course.$remove("semesters", semesterId)
    return { message: "Course removed from semester successfully" }
  }
}
