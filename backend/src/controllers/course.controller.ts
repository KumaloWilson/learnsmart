import type { Request, Response } from "express"
import { CourseService } from "../services/course.service"
import type { CreateCourseDto, UpdateCourseDto } from "../dto/course.dto"

export class CourseController {
  private courseService: CourseService

  constructor() {
    this.courseService = new CourseService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const courses = await this.courseService.findAll()
      return res.status(200).json(courses)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching courses", error })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const course = await this.courseService.findById(id)

      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }

      return res.status(200).json(course)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching course", error })
    }
  }

  getByProgram = async (req: Request, res: Response) => {
    try {
      const { programId } = req.params
      const courses = await this.courseService.findByProgram(programId)
      return res.status(200).json(courses)
    } catch (error) {
      return res.status(500).json({ message: "Error fetching courses by program", error })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateCourseDto = req.body
      const course = await this.courseService.create(data)
      return res.status(201).json(course)
    } catch (error) {
      return res.status(500).json({ message: "Error creating course", error })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateCourseDto = req.body
      const course = await this.courseService.update(id, data)
      return res.status(200).json(course)
    } catch (error) {
      return res.status(500).json({ message: "Error updating course", error })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.courseService.delete(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error deleting course", error })
    }
  }

  assignToSemester = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const result = await this.courseService.assignToSemester(courseId, semesterId)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error assigning course to semester", error })
    }
  }

  removeFromSemester = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const result = await this.courseService.removeFromSemester(courseId, semesterId)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ message: "Error removing course from semester", error })
    }
  }
}
