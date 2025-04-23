import type { Request, Response } from "express"
import { LecturerService } from "../services/lecturer.service"
import { DepartmentService } from "../services/department.service"
import type { CreateTeachingMaterialDto, UpdateTeachingMaterialDto, AddYoutubeVideoDto } from "../dto/lecturer.dto"

export class LecturerController {
  private lecturerService: LecturerService
  private departmentService: DepartmentService

  constructor() {
    this.lecturerService = new LecturerService()
    this.departmentService = new DepartmentService()
  }

  // Existing methods...

  // Teaching material endpoints
  getTeachingMaterials = async (req: Request, res: Response) => {
    try {
      const { lecturerId } = req.params
      const { courseId, semesterId } = req.query
      const materials = await this.lecturerService.getTeachingMaterials(
        lecturerId,
        courseId as string | undefined,
        semesterId as string | undefined,
      )
      return res.status(200).json(materials)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching teaching materials", error: error.message })
    }
  }

  getTeachingMaterialById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const material = await this.lecturerService.getTeachingMaterialById(id)

      if (!material) {
        return res.status(404).json({ message: "Teaching material not found" })
      }

      return res.status(200).json(material)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching teaching material", error: error.message })
    }
  }

  createTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const data: CreateTeachingMaterialDto = req.body
      const material = await this.lecturerService.createTeachingMaterial(data)
      return res.status(201).json(material)
    } catch (error: any) {
      return res.status(500).json({ message: "Error creating teaching material", error: error.message })
    }
  }

  updateTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const data: UpdateTeachingMaterialDto = req.body
      const material = await this.lecturerService.updateTeachingMaterial(id, data)
      return res.status(200).json(material)
    } catch (error: any) {
      return res.status(500).json({ message: "Error updating teaching material", error: error.message })
    }
  }

  deleteTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.lecturerService.deleteTeachingMaterial(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error deleting teaching material", error: error.message })
    }
  }

  // New video upload endpoints
  uploadVideo = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" })
      }

      const { title, description, lecturerProfileId, courseId, semesterId, isPublished } = req.body

      const result = await this.lecturerService.uploadVideo({
        title,
        description,
        file: req.file,
        lecturerProfileId,
        courseId,
        semesterId,
        isPublished: isPublished === "true",
      })

      return res.status(201).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error uploading video", error: error.message })
    }
  }

  addYoutubeVideo = async (req: Request, res: Response) => {
    try {
      const data: AddYoutubeVideoDto = req.body

      if (!data.youtubeUrl) {
        return res.status(400).json({ message: "YouTube URL is required" })
      }

      const result = await this.lecturerService.addYoutubeVideo(data)
      return res.status(201).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: "Error adding YouTube video", error: error.message })
    }
  }

  // Other existing methods...
}
