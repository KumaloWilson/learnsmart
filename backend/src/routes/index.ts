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
import lecturerPortalRoutes from "./lecturer-portal.routes"
import notificationRoutes from "./notification.routes"
import dashboardRoutes from "./dashboard.routes"
import virtualClassRoutes from "./virtual-class.routes"
import quizRoutes from "./quiz.routes"
import attendanceRoutes from "./attendance.routes"
import studentPerformanceRoutes from "./student-perfomance.routes"
import lecturerDashboardRoutes from "./lecturer-dashboard.routes"
import studentPortalRoutes from "./student-portal.routes"
import aiRecommendationRoutes from "./ai-recommendation.routes"

const router = Router()

router.use("/auth", authRoutes) //done
router.use("/dashboard", dashboardRoutes) //done
router.use("/schools", schoolRoutes) //done
router.use("/departments", departmentRoutes) //done
router.use("/programs", programRoutes) //done
router.use("/courses", courseRoutes) //done
router.use("/semesters", semesterRoutes) //done
router.use("/periods", periodRoutes) //done
router.use("/students", studentRoutes) //done
router.use("/lecturers", lecturerRoutes) //done



router.use("/lecturer-dashboard", lecturerDashboardRoutes) 
router.use("/lecturer-portal", lecturerPortalRoutes)
router.use("/notifications", notificationRoutes)
router.use("/virtual-classes", virtualClassRoutes)
router.use("/quizzes", quizRoutes)
router.use("/attendance", attendanceRoutes)
router.use("/student-performance", studentPerformanceRoutes)
router.use("/ai-recommendations", aiRecommendationRoutes)


router.use("/student-portal", studentPortalRoutes)

export default router
