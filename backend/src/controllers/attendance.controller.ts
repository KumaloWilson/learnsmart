import type { Request, Response } from "express"
import { AttendanceService } from "../services/attendance.service"

export class AttendanceController {
  private attendanceService: AttendanceService

  constructor() {
    this.attendanceService = new AttendanceService()
  }

  // Physical attendance methods
  recordPhysicalAttendance = async (req: Request, res: Response) => {
    try {
      const attendanceData = req.body
      const attendance = await this.attendanceService.recordPhysicalAttendance(attendanceData)
      return res.status(201).json(attendance)
    } catch (error) {
      console.error("Error recording physical attendance:", error)
      return res.status(500).json({ message: "Failed to record attendance", error: error.message })
    }
  }

  bulkRecordPhysicalAttendance = async (req: Request, res: Response) => {
    try {
      const { attendances } = req.body
      const result = await this.attendanceService.bulkRecordPhysicalAttendance(attendances)
      return res.status(201).json(result)
    } catch (error) {
      console.error("Error bulk recording physical attendance:", error)
      return res.status(500).json({ message: "Failed to record attendances", error: error.message })
    }
  }

  updatePhysicalAttendance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const attendanceData = req.body
      const attendance = await this.attendanceService.updatePhysicalAttendance(id, attendanceData)
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error updating physical attendance:", error)
      return res.status(500).json({ message: "Failed to update attendance", error: error.message })
    }
  }

  deletePhysicalAttendance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.attendanceService.deletePhysicalAttendance(id)
      if (!deleted) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json({ message: "Attendance record deleted successfully" })
    } catch (error) {
      console.error("Error deleting physical attendance:", error)
      return res.status(500).json({ message: "Failed to delete attendance", error: error.message })
    }
  }

  getPhysicalAttendanceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const attendance = await this.attendanceService.getPhysicalAttendanceById(id)
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting physical attendance by ID:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getPhysicalAttendanceByStudent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId } = req.query
      const attendance = await this.attendanceService.getPhysicalAttendanceByStudent(
        studentId,
        courseId as string,
        semesterId as string,
      )
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting physical attendance by student:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getPhysicalAttendanceByCourse = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const attendance = await this.attendanceService.getPhysicalAttendanceByCourse(courseId, semesterId)
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting physical attendance by course:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getPhysicalAttendanceByPeriod = async (req: Request, res: Response) => {
    try {
      const { periodId } = req.params
      const attendance = await this.attendanceService.getPhysicalAttendanceByPeriod(periodId)
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting physical attendance by period:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getPhysicalAttendanceStatistics = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const statistics = await this.attendanceService.getPhysicalAttendanceStatistics(courseId, semesterId)
      return res.status(200).json(statistics)
    } catch (error) {
      console.error("Error getting physical attendance statistics:", error)
      return res.status(500).json({ message: "Failed to get statistics", error: error.message })
    }
  }

  // Virtual attendance methods
  recordVirtualAttendance = async (req: Request, res: Response) => {
    try {
      const attendanceData = req.body
      const attendance = await this.attendanceService.recordVirtualAttendance(attendanceData)
      return res.status(201).json(attendance)
    } catch (error) {
      console.error("Error recording virtual attendance:", error)
      return res.status(500).json({ message: "Failed to record attendance", error: error.message })
    }
  }

  bulkRecordVirtualAttendance = async (req: Request, res: Response) => {
    try {
      const { attendances } = req.body
      const result = await this.attendanceService.bulkRecordVirtualAttendance(attendances)
      return res.status(201).json(result)
    } catch (error) {
      console.error("Error bulk recording virtual attendance:", error)
      return res.status(500).json({ message: "Failed to record attendances", error: error.message })
    }
  }

  updateVirtualAttendance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const attendanceData = req.body
      const attendance = await this.attendanceService.updateVirtualAttendance(id, attendanceData)
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error updating virtual attendance:", error)
      return res.status(500).json({ message: "Failed to update attendance", error: error.message })
    }
  }

  deleteVirtualAttendance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const deleted = await this.attendanceService.deleteVirtualAttendance(id)
      if (!deleted) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json({ message: "Attendance record deleted successfully" })
    } catch (error) {
      console.error("Error deleting virtual attendance:", error)
      return res.status(500).json({ message: "Failed to delete attendance", error: error.message })
    }
  }

  getVirtualAttendanceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const attendance = await this.attendanceService.getVirtualAttendanceById(id)
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" })
      }
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting virtual attendance by ID:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getVirtualAttendanceByVirtualClass = async (req: Request, res: Response) => {
    try {
      const { virtualClassId } = req.params
      const attendance = await this.attendanceService.getVirtualAttendanceByVirtualClass(virtualClassId)
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting virtual attendance by virtual class:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getVirtualAttendanceByStudent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { courseId, semesterId } = req.query
      const attendance = await this.attendanceService.getVirtualAttendanceByStudent(
        studentId,
        courseId as string,
        semesterId as string,
      )
      return res.status(200).json(attendance)
    } catch (error) {
      console.error("Error getting virtual attendance by student:", error)
      return res.status(500).json({ message: "Failed to get attendance", error: error.message })
    }
  }

  getVirtualAttendanceStatistics = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const statistics = await this.attendanceService.getVirtualAttendanceStatistics(courseId, semesterId)
      return res.status(200).json(statistics)
    } catch (error) {
      console.error("Error getting virtual attendance statistics:", error)
      return res.status(500).json({ message: "Failed to get statistics", error: error.message })
    }
  }

  // Combined attendance statistics
  getCombinedAttendanceStatistics = async (req: Request, res: Response) => {
    try {
      const { courseId, semesterId } = req.params
      const statistics = await this.attendanceService.getCombinedAttendanceStatistics(courseId, semesterId)
      return res.status(200).json(statistics)
    } catch (error) {
      console.error("Error getting combined attendance statistics:", error)
      return res.status(500).json({ message: "Failed to get statistics", error: error.message })
    }
  }
}
