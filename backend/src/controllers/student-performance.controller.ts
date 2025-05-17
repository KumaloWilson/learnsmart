import type { Request, Response } from "express"
import { StudentPerformanceService } from "../services/student-performance.service"
import { NotificationService } from "../services/notification.service"

export class StudentPerformanceController {
  private studentPerformanceService: StudentPerformanceService
  private notificationService: NotificationService

  constructor() {
    this.studentPerformanceService = new StudentPerformanceService()
    this.notificationService = new NotificationService()
  }

  findAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query
      const records = await this.studentPerformanceService.findAll(filters)
      return res.status(200).json({
        success: true,
        data: records,
      })
    } catch (error) {
      console.error("Error getting performance records:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve performance records",
        error: error,
      })
    }
  }

  findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const record = await this.studentPerformanceService.findById(id)

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Performance record not found",
        })
      }

      return res.status(200).json({
        success: true,
        data: record,
      })
    } catch (error) {
      console.error("Error getting performance record:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve performance record",
        error: error,
      })
    }
  }

  findByStudent = async (req: Request, res: Response) => {
    try {
      const { studentProfileId, courseId, semesterId } = req.params
      const record = await this.studentPerformanceService.findByStudent(studentProfileId, courseId, semesterId)

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Performance record not found",
        })
      }

      return res.status(200).json({
        success: true,
        data: record,
      })
    } catch (error) {
      console.error("Error getting student performance record:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve student performance record",
        error: error,
      })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const performanceData = req.body
      const record = await this.studentPerformanceService.create(performanceData)

      if (!record) {
        throw new Error("Failed to create performance record")
      }

      // Send notification to student
      await this.notificationService.createNotification({
        userId: performanceData.studentProfileId,
        title: "Performance Record Updated",
        message: `Your performance record for this course has been updated.`,
        type: "PERFORMANCE",
        isRead: false,
        metadata: {
          performanceId: record.id,
          courseId: performanceData.courseId,
          overallPerformance: performanceData.overallPerformance,
          performanceCategory: performanceData.performanceCategory,
        },
      })

      return res.status(201).json({
        success: true,
        data: record,
        message: "Performance record created successfully",
      })
    } catch (error) {
      console.error("Error creating performance record:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to create performance record",
        error: error,
      })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const updateData = req.body

      const updated = await this.studentPerformanceService.update(id, updateData)

      return res.status(200).json({
        success: true,
        data: updated,
        message: "Performance record updated successfully",
      })
    } catch (error) {
      console.error("Error updating performance record:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to update performance record",
        error: error,
      })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.studentPerformanceService.delete(id)

      return res.status(200).json({
        success: true,
        message: "Performance record deleted successfully",
        data: result,
      })
    } catch (error) {
      console.error("Error deleting performance record:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to delete performance record",
        error: error,
      })
    }
  }

  generatePerformanceAnalysis = async (req: Request, res: Response) => {
    try {
      const analysisData = req.body
      const analysis = await this.studentPerformanceService.generatePerformanceAnalysis(analysisData)


      if (!analysis) {
        throw new Error("Failed to generate performance analysis")
      }


      return res.status(200).json({
        success: true,
        data: analysis,
        message: "Performance analysis generated successfully",
      })
    } catch (error) {
      console.error("Error generating performance analysis:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to generate performance analysis",
        error: error,
      })
    }
  }

  generateClassPerformanceAnalysis = async (req: Request, res: Response) => {
    try {
      const analysisData = req.body
      const analysis = await this.studentPerformanceService.generateClassPerformanceAnalysis(analysisData)

      return res.status(200).json({
        success: true,
        data: analysis,
        message: "Class performance analysis generated successfully",
      })
    } catch (error) {
      console.error("Error generating class performance analysis:", error)
      return res.status(500).json({
        success: false,
        message: "Failed to generate class performance analysis",
        error: error,
      })
    }
  }
}
