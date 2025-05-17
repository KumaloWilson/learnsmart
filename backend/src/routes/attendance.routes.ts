import { Router } from "express"
import { AttendanceController } from "../controllers/attendance.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
 import { attendanceValidation } from "../middlewares/validation.middleware"

const router = Router()
const attendanceController = new AttendanceController()

// Basic CRUD operations
router.get("/", authMiddleware, (req, res) =>
  attendanceController.findAll(req, res),
)

router.get("/:id", authMiddleware, (req, res) =>
  attendanceController.findById(req, res),
)

router.post("/", authMiddleware, (req, res) =>
  attendanceController.create(req, res),
)

router.put(
  "/:id",
  authMiddleware,
  (req, res) => attendanceController.update(req, res),
)

router.delete("/:id", authMiddleware, (req, res) =>
  attendanceController.delete(req, res),
)

// Bulk operations
router.post("/bulk", authMiddleware, (req, res) =>
  attendanceController.bulkCreate(req, res),
)

// Statistics and reports
router.get(
  "/statistics/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req, res) => attendanceController.getAttendanceStatistics(req, res),
)

router.get(
  "/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  (req, res) => attendanceController.getStudentAttendanceDetails(req, res),
)

router.get(
  "/report/class/:courseId/semester/:semesterId",
  authMiddleware,
  (req, res) => attendanceController.getClassAttendanceReport(req, res),
)

export default router
