import { User, LecturerProfile, TeachingMaterial, Course, Semester } from "../models"
import { AuthService } from "./auth.service"
import { StorageService } from "./storage.service"
import type {
  CreateTeachingMaterialDto,
  UpdateTeachingMaterialDto,
  UploadVideoDto,
  AddYoutubeVideoDto,
} from "../dto/lecturer.dto"

export class LecturerService {
  private authService: AuthService
  private storageService: StorageService

  constructor() {
    this.authService = new AuthService()
    this.storageService = new StorageService()
  }

  // Existing methods...

  // Teaching material methods
  async getTeachingMaterials(lecturerProfileId: string, courseId?: string, semesterId?: string) {
    const whereClause: any = { lecturerProfileId }

    if (courseId) {
      whereClause.courseId = courseId
    }

    if (semesterId) {
      whereClause.semesterId = semesterId
    }

    return TeachingMaterial.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async getTeachingMaterialById(id: string) {
    return TeachingMaterial.findByPk(id, {
      include: [
        {
          model: Course,
        },
        {
          model: Semester,
        },
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async createTeachingMaterial(data: CreateTeachingMaterialDto) {
    return TeachingMaterial.create(data)
  }

  async updateTeachingMaterial(id: string, data: UpdateTeachingMaterialDto) {
    const material = await TeachingMaterial.findByPk(id)
    if (!material) {
      throw new Error("Teaching material not found")
    }

    await material.update(data)
    return this.getTeachingMaterialById(id)
  }

  async deleteTeachingMaterial(id: string) {
    const material = await TeachingMaterial.findByPk(id)
    if (!material) {
      throw new Error("Teaching material not found")
    }

    // If it's a file stored in Supabase, delete it
    if (material.type !== "youtube" && material.fileUrl && material.fileUrl.includes("supabase")) {
      try {
        // Extract the path from the URL
        const url = new URL(material.fileUrl)
        const pathParts = url.pathname.split("/")
        const bucketName = pathParts[2] // Assuming URL format: /storage/v1/object/public/bucket-name/path
        const filePath = pathParts.slice(3).join("/")

        await this.storageService.deleteFile(bucketName, filePath)
      } catch (error) {
        console.error("Failed to delete file from storage:", error)
        // Continue with deletion even if file removal fails
      }
    }

    await material.destroy()
    return { message: "Teaching material deleted successfully" }
  }

  // New methods for video uploads
  async uploadVideo(data: UploadVideoDto) {
    const { title, description, file, lecturerProfileId, courseId, semesterId, isPublished } = data

    // Generate a unique file path
    const timestamp = Date.now()
    const filePath = `courses/${courseId}/videos/${timestamp}_${file.originalname.replace(/\s+/g, "_")}`

    // Upload to Supabase
    const fileUrl = await this.storageService.uploadFile("course-materials", filePath, file.buffer, file.mimetype)

    // Create teaching material record
    return this.createTeachingMaterial({
      title,
      description,
      type: "video",
      fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishDate: isPublished !== false ? new Date() : undefined,
      lecturerProfileId,
      courseId,
      semesterId,
    })
  }

  async addYoutubeVideo(data: AddYoutubeVideoDto) {
    const {
      title,
      description,
      youtubeUrl,
      videoThumbnail,
      videoDuration,
      lecturerProfileId,
      courseId,
      semesterId,
      isPublished,
    } = data

    // Extract YouTube video ID if full URL is provided
    let processedUrl = youtubeUrl
    try {
      const url = new URL(youtubeUrl)
      if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
        // Extract video ID from various YouTube URL formats
        let videoId
        if (url.hostname.includes("youtu.be")) {
          videoId = url.pathname.substring(1)
        } else if (url.searchParams.has("v")) {
          videoId = url.searchParams.get("v")
        }

        if (videoId) {
          processedUrl = `https://www.youtube.com/embed/${videoId}`
        }
      }
    } catch (error) {
      // If URL parsing fails, use the original URL
      console.error("Failed to parse YouTube URL:", error)
    }

    // Create teaching material record
    return this.createTeachingMaterial({
      title,
      description,
      type: "youtube",
      fileUrl: processedUrl,
      youtubeUrl: processedUrl,
      videoThumbnail:
        videoThumbnail || `https://img.youtube.com/vi/${this.extractYoutubeId(processedUrl)}/hqdefault.jpg`,
      videoDuration,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishDate: isPublished !== false ? new Date() : undefined,
      lecturerProfileId,
      courseId,
      semesterId,
    })
  }

  // Helper method to extract YouTube video ID
  private extractYoutubeId(url: string): string {
    try {
      // Handle embed URLs
      if (url.includes("/embed/")) {
        return url.split("/embed/")[1].split("?")[0]
      }

      // Handle youtu.be URLs
      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1].split("?")[0]
      }

      // Handle standard YouTube URLs
      const urlObj = new URL(url)
      return urlObj.searchParams.get("v") || ""
    } catch (error) {
      return ""
    }
  }

  // Other existing methods...
}
