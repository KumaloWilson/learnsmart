import type { Request, Response } from "express"
import { LecturerService } from "../services/lecturer.service"
import { StorageService } from "../services/storage.service"
import { NotificationService } from "../services/notification.service"
import { AuthService } from "../services/auth.service"

export class LecturerController {
  private authService: AuthService
  private lecturerService: LecturerService
  private storageService: StorageService
  private notificationService: NotificationService

  constructor() {
    this.authService = new AuthService()
    this.lecturerService = new LecturerService()
    this.storageService = new StorageService()
    this.notificationService = new NotificationService()
  }

  // Lecturer profile methods
  getAllLecturers = async (req: Request, res: Response) => {
    try {
      const lecturers = await this.lecturerService.getAllLecturers()
      return res.status(200).json(lecturers)
    } catch (error) {
      console.error("Error getting all lecturers:", error)
      return res.status(500).json({ message: "Failed to get lecturers", error: error })
    }
  }

  getLecturerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const lecturer = await this.lecturerService.getLecturerById(id)
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" })
      }
      return res.status(200).json(lecturer)
    } catch (error) {
      console.error("Error getting lecturer by ID:", error)
      return res.status(500).json({ message: "Failed to get lecturer", error: error })
    }
  }

  getLecturerByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params
      const lecturer = await this.lecturerService.getLecturerByUserId(userId)
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" })
      }
      return res.status(200).json(lecturer)
    } catch (error) {
      console.error("Error getting lecturer by user ID:", error)
      return res.status(500).json({ message: "Failed to get lecturer", error: error })
    }
  }

  createLecturer = async (req: Request, res: Response) => {
    try {
      const lecturerData = req.body
  
      // 1. Register the user first
      const authResult = await this.authService.register({
        firstName: lecturerData.firstName,
        lastName: lecturerData.lastName,
        email: lecturerData.email,
        password: "password123?", // Default password
        role: "lecturer",
      })
  
      // 3. Auto-generate staffId
      const staffId = `STAFF-${Math.floor(100000 + Math.random() * 900000)}`
  
      // 4. Build complete lecturer profile
      const completeLecturerData = {
        ...lecturerData,
        userId: authResult.user.id,
        staffId,
        status: "active",
        joinDate: new Date(),
      }
  
      // 5. Create lecturer profile
      const lecturer = await this.lecturerService.createLecturer(completeLecturerData)
  
      return res.status(201).json(lecturer)
    } catch (error) {
      console.error("Error creating lecturer:", error)
      return res.status(500).json({ message: "Failed to create lecturer", error })
    }
  }
  

  updateLecturer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const lecturerData = req.body
      const lecturer = await this.lecturerService.updateLecturer(id, lecturerData)
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" })
      }
      return res.status(200).json(lecturer)
    } catch (error) {
      console.error("Error updating lecturer:", error)
      return res.status(500).json({ message: "Failed to update lecturer", error: error })
    }
  }

  deleteLecturer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.lecturerService.deleteLecturer(id)
      if (!deleted) {
        return res.status(404).json({ message: "Lecturer not found" })
      }
      return res.status(200).json({ message: "Lecturer deleted successfully" })
    } catch (error) {
      console.error("Error deleting lecturer:", error)
      return res.status(500).json({ message: "Failed to delete lecturer", error: error })
    }
  }

  // Course assignment methods
  getLecturerCourseAssignments = async (req: Request, res: Response) => {
    try {
      const { lecturerId } = req.params
      const assignments = await this.lecturerService.getLecturerCourseAssignments(lecturerId)
      return res.status(200).json(assignments)
    } catch (error) {
      console.error("Error getting lecturer course assignments:", error)
      return res.status(500).json({ message: "Failed to get course assignments", error: error })
    }
  }

  assignCourseToLecturer = async (req: Request, res: Response) => {
    try {
      const assignmentData = req.body
      const assignment = await this.lecturerService.assignCourseToLecturer(assignmentData)

      // Notify the lecturer about the course assignment
      await this.notificationService.notifyCourseAssignment({
        lecturerProfileId: assignmentData.lecturerProfileId,
        courseId: assignmentData.courseId,
        semesterId: assignmentData.semesterId,
      })

      return res.status(201).json(assignment)
    } catch (error) {
      console.error("Error assigning course to lecturer:", error)
      return res.status(500).json({ message: "Failed to assign course", error: error })
    }
  }

  updateCourseAssignment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const assignmentData = req.body
      const assignment = await this.lecturerService.updateCourseAssignment(id, assignmentData)
      if (!assignment) {
        return res.status(404).json({ message: "Course assignment not found" })
      }
      return res.status(200).json(assignment)
    } catch (error) {
      console.error("Error updating course assignment:", error)
      return res.status(500).json({ message: "Failed to update course assignment", error: error })
    }
  }

  removeCourseAssignment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.lecturerService.removeCourseAssignment(id)
      if (!deleted) {
        return res.status(404).json({ message: "Course assignment not found" })
      }
      return res.status(200).json({ message: "Course assignment removed successfully" })
    } catch (error) {
      console.error("Error removing course assignment:", error)
      return res.status(500).json({ message: "Failed to remove course assignment", error: error })
    }
  }

  // Assessment methods
  getLecturerAssessments = async (req: Request, res: Response) => {
    try {
      const { lecturerId } = req.params
      const assessments = await this.lecturerService.getLecturerAssessments(lecturerId)
      return res.status(200).json(assessments)
    } catch (error) {
      console.error("Error getting lecturer assessments:", error)
      return res.status(500).json({ message: "Failed to get assessments", error: error })
    }
  }

  createAssessment = async (req: Request, res: Response) => {
    try {
      const assessmentData = req.body
      const assessment = await this.lecturerService.createAssessment(assessmentData)

      // Notify students about the new assessment
      await this.notificationService.notifyNewAssignment({
        courseId: assessmentData.courseId,
        semesterId: assessmentData.semesterId,
        assessmentId: assessment.id,
        title: assessmentData.title,
        dueDate: assessmentData.dueDate,
      })

      return res.status(201).json(assessment)
    } catch (error) {
      console.error("Error creating assessment:", error)
      return res.status(500).json({ message: "Failed to create assessment", error: error })
    }
  }

  updateAssessment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const assessmentData = req.body
      const assessment = await this.lecturerService.updateAssessment(id, assessmentData)
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" })
      }
      return res.status(200).json(assessment)
    } catch (error) {
      console.error("Error updating assessment:", error)
      return res.status(500).json({ message: "Failed to update assessment", error: error })
    }
  }

  deleteAssessment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.lecturerService.deleteAssessment(id)
      if (!deleted) {
        return res.status(404).json({ message: "Assessment not found" })
      }
      return res.status(200).json({ message: "Assessment deleted successfully" })
    } catch (error) {
      console.error("Error deleting assessment:", error)
      return res.status(500).json({ message: "Failed to delete assessment", error: error })
    }
  }

  // Assessment submission methods
  getAssessmentSubmissions = async (req: Request, res: Response) => {
    try {
      const { assessmentId } = req.params
      const submissions = await this.lecturerService.getAssessmentSubmissions(assessmentId)
      return res.status(200).json(submissions)
    } catch (error) {
      console.error("Error getting assessment submissions:", error)
      return res.status(500).json({ message: "Failed to get submissions", error: error })
    }
  }

  gradeSubmission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { grade, feedback } = req.body
      const submission = await this.lecturerService.gradeSubmission(id, grade, feedback)
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" })
      }

      // Notify student about the grade
      await this.notificationService.notifyGradePosted({
        studentProfileId: submission.studentProfileId,
        assessmentId: submission.assessmentId,
        grade: grade,
      })

      return res.status(200).json(submission)
    } catch (error) {
      console.error("Error grading submission:", error)
      return res.status(500).json({ message: "Failed to grade submission", error: error })
    }
  }

  // Teaching material methods
  getTeachingMaterials = async (req: Request, res: Response) => {
    try {
      const { lecturerId } = req.params
      const materials = await this.lecturerService.getTeachingMaterials(lecturerId)
      return res.status(200).json(materials)
    } catch (error) {
      console.error("Error getting teaching materials:", error)
      return res.status(500).json({ message: "Failed to get teaching materials", error: error })
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
    } catch (error) {
      console.error("Error getting teaching material by ID:", error)
      return res.status(500).json({ message: "Failed to get teaching material", error: error })
    }
  }

  createTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const materialData = req.body
      const material = await this.lecturerService.createTeachingMaterial(materialData)

      // Notify students about the new teaching material
      await this.notificationService.notifyNewAnnouncement({
        courseId: materialData.courseId,
        semesterId: materialData.semesterId,
        title: `New material: ${materialData.title}`,
        message: `A new teaching material "${materialData.title}" has been added to your course.`,
      })

      return res.status(201).json(material)
    } catch (error) {
      console.error("Error creating teaching material:", error)
      return res.status(500).json({ message: "Failed to create teaching material", error: error })
    }
  }

  updateTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const materialData = req.body
      const material = await this.lecturerService.updateTeachingMaterial(id, materialData)
      if (!material) {
        return res.status(404).json({ message: "Teaching material not found" })
      }
      return res.status(200).json(material)
    } catch (error) {
      console.error("Error updating teaching material:", error)
      return res.status(500).json({ message: "Failed to update teaching material", error: error })
    }
  }

  deleteTeachingMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.lecturerService.deleteTeachingMaterial(id)
      if (!deleted) {
        return res.status(404).json({ message: "Teaching material not found" })
      }
      return res.status(200).json({ message: "Teaching material deleted successfully" })
    } catch (error) {
      console.error("Error deleting teaching material:", error)
      return res.status(500).json({ message: "Failed to delete teaching material", error: error })
    }
  }

  // Video upload methods
  uploadVideo = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" })
      }

      const { courseId, semesterId, title, description } = req.body

      // Upload the video to storage
      const fileBuffer = req.file.buffer
      const fileName = `${Date.now()}-${req.file.originalname}`
      const fileUrl = await this.storageService.uploadFile(fileBuffer, fileName, req.file.mimetype)

      // Create a teaching material record
      const materialData = {
        title,
        description,
        type: "video",
        url: fileUrl,
        courseId,
        semesterId,
        lecturerProfileId: req.body.lecturerProfileId,
      }

      const material = await this.lecturerService.createTeachingMaterial(materialData)

      // Notify students about the new video
      await this.notificationService.notifyNewAnnouncement({
        courseId,
        semesterId,
        title: `New video: ${title}`,
        message: `A new video "${title}" has been added to your course.`,
      })

      return res.status(201).json(material)
    } catch (error) {
      console.error("Error uploading video:", error)
      return res.status(500).json({ message: "Failed to upload video", error: error })
    }
  }

  addYoutubeVideo = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId, title, description, youtubeUrl } = req.body

      // Create a teaching material record
      const materialData = {
        title,
        description,
        type: "youtube",
        url: youtubeUrl,
        courseId,
        semesterId,
        lecturerProfileId: req.body.lecturerProfileId,
      }

      const material = await this.lecturerService.createTeachingMaterial(materialData)

      // Notify students about the new video
      await this.notificationService.notifyNewAnnouncement({
        courseId,
        semesterId,
        title: `New video: ${title}`,
        message: `A new video "${title}" has been added to your course.`,
      })

      return res.status(201).json(material)
    } catch (error) {
      console.error("Error adding YouTube video:", error)
      return res.status(500).json({ message: "Failed to add YouTube video", error: error })
    }
  }
}
