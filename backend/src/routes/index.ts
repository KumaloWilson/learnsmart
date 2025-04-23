import { Router } from "express"
import authRoutes from "./auth.routes"
import schoolRoutes from "./school.routes"
import departmentRoutes from "./department.routes"
import programRoutes from "./program.routes"
import courseRoutes from "./course.routes"
import semesterRoutes from "./semester.routes"
import periodRoutes from "./period.routes"
import studentRoutes from "./student.routes"
import lecturerRoutes from "./lecturer.routes"
import notificationRoutes from "./notification.routes"
import dashboardRoutes from "./dashboard.routes"
import virtualClassRoutes from "./virtual-class.routes"
import quizRoutes from "./quiz.routes"
import attendanceRoutes from "./attendance.routes"
import studentPerformanceRoutes from "./student-performance.routes"
import lecturerDashboardRoutes from "./lecturer-dashboard.routes"
import studentPortalRoutes from "./student-portal.routes"
import aiRecommendationRoutes from "./ai-recommendation.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/schools", schoolRoutes)
router.use("/departments", departmentRoutes)
router.use("/programs", programRoutes)
router.use("/courses", courseRoutes)
router.use("/semesters", semesterRoutes)
router.use("/periods", periodRoutes)
router.use("/students", studentRoutes)
router.use("/lecturers", lecturerRoutes)
router.use("/notifications", notificationRoutes)
router.use("/dashboard", dashboardRoutes)
router.use("/virtual-classes", virtualClassRoutes)
router.use("/quizzes", quizRoutes)
router.use("/attendance", attendanceRoutes)
router.use("/student-performance", studentPerformanceRoutes)
router.use("/lecturer-dashboard", lecturerDashboardRoutes)
router.use("/student-portal", studentPortalRoutes)
router.use("/ai-recommendations", aiRecommendationRoutes)

export default router
