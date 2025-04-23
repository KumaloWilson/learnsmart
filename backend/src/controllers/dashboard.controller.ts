import type { Request, Response } from "express"
import { DashboardService } from "../services/dashboard.service"

export class DashboardController {
  private dashboardService: DashboardService

  constructor() {
    this.dashboardService = new DashboardService()
  }

  getOverviewStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.dashboardService.getOverviewStats()
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching overview stats", error: error.message })
    }
  }

  getEnrollmentStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.dashboardService.getEnrollmentStats()
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching enrollment stats", error: error.message })
    }
  }

  getAcademicPerformance = async (req: Request, res: Response) => {
    try {
      const stats = await this.dashboardService.getAcademicPerformance()
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching academic performance stats", error: error.message })
    }
  }

  getUserActivity = async (req: Request, res: Response) => {
    try {
      const stats = await this.dashboardService.getUserActivity()
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching user activity stats", error: error.message })
    }
  }

  getCourseStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.dashboardService.getCourseStats()
      return res.status(200).json(stats)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching course stats", error: error.message })
    }
  }

  getRecentActivity = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 10
      const activity = await this.dashboardService.getRecentActivity(limit)
      return res.status(200).json(activity)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching recent activity", error: error.message })
    }
  }

  getUpcomingEvents = async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? Number.parseInt(req.query.days as string) : 7
      const events = await this.dashboardService.getUpcomingEvents(days)
      return res.status(200).json(events)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching upcoming events", error: error.message })
    }
  }

  getSystemHealth = async (req: Request, res: Response) => {
    try {
      const health = await this.dashboardService.getSystemHealth()
      return res.status(200).json(health)
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching system health", error: error.message })
    }
  }

  getAllDashboardData = async (req: Request, res: Response) => {
    try {
      const [overview, enrollments, performance, userActivity, courseStats, recentActivity, upcomingEvents] =
        await Promise.all([
          this.dashboardService.getOverviewStats(),
          this.dashboardService.getEnrollmentStats(),
          this.dashboardService.getAcademicPerformance(),
          this.dashboardService.getUserActivity(),
          this.dashboardService.getCourseStats(),
          this.dashboardService.getRecentActivity(),
          this.dashboardService.getUpcomingEvents(),
        ])

      return res.status(200).json({
        overview,
        enrollments,
        performance,
        userActivity,
        courseStats,
        recentActivity,
        upcomingEvents,
      })
    } catch (error: any) {
      return res.status(500).json({ message: "Error fetching dashboard data", error: error.message })
    }
  }
}
