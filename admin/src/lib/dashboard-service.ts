import api from "./api"
import type { DashboardOverview, EnrollmentData, UserActivity, RecentActivity, SystemHealth } from "@/types/dashboard"

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get<DashboardOverview>("/dashboard/overview")
    return response.data
  },

  async getEnrollments(): Promise<EnrollmentData> {
    const response = await api.get<EnrollmentData>("/dashboard/enrollments")
    return response.data
  },

  async getUserActivity(): Promise<UserActivity> {
    const response = await api.get<UserActivity>("/dashboard/user-activity")
    return response.data
  },

  async getRecentActivity(): Promise<RecentActivity> {
    const response = await api.get<RecentActivity>("/dashboard/recent-activity")
    return response.data
  },

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get<SystemHealth>("/dashboard/system-health")
    return response.data
  },
}

export default dashboardService
