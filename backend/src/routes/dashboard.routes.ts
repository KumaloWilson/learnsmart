import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()

const dashboardController = new DashboardController()

// All dashboard routes are admin-only
router.use(authMiddleware, adminMiddleware)

router.get("/overview", dashboardController.getOverviewStats)
router.get("/enrollments", dashboardController.getEnrollmentStats)
router.get("/performance", dashboardController.getAcademicPerformance)
router.get("/user-activity", dashboardController.getUserActivity)
router.get("/courses", dashboardController.getCourseStats)
router.get("/recent-activity", dashboardController.getRecentActivity)
router.get("/upcoming-events", dashboardController.getUpcomingEvents)
router.get("/system-health", dashboardController.getSystemHealth)
router.get("/all", dashboardController.getAllDashboardData)

export default router
