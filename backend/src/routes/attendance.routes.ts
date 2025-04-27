import { Router } from "express"
import { AttendanceController } from "../controllers/attendance.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, validateParams, validateQuery } from "../middlewares/validation.middleware"
import { attendanceValidation } from "../middlewares/validation.middleware"

const router = Router()
const attendanceController = new AttendanceController()

// Basic CRUD operations
router.get("/", authMiddleware, validateQuery(attendanceValidation.attendanceFilters), (req, res) =>
  attendanceController.findAll(req, res),
)

router.get("/:id", authMiddleware, validateParams(attendanceValidation.idParam), (req, res) =>
  attendanceController.findById(req, res),
)

router.post("/", authMiddleware, validate(attendanceValidation.createAttendance), (req, res) =>
  attendanceController.create(req, res),
)

router.put(
  "/:id",
  authMiddleware,
  validateParams(attendanceValidation.idParam),
  validate(attendanceValidation.updateAttendance),
  (req, res) => attendanceController.update(req, res),
)

router.delete("/:id", authMiddleware, validateParams(attendanceValidation.idParam), (req, res) =>
  attendanceController.delete(req, res),
)

// Bulk operations
router.post("/bulk", authMiddleware, validate(attendanceValidation.bulkCreateAttendance), (req, res) =>
  attendanceController.bulkCreate(req, res),
)

// Statistics and reports
router.get(
  "/statistics/:courseId/:semesterId",
  authMiddleware,
  validateParams(attendanceValidation.courseAndSemesterParams),
  validateQuery(attendanceValidation.statisticsQuery),
  (req, res) => attendanceController.getAttendanceStatistics(req, res),
)

router.get(
  "/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  validateParams(attendanceValidation.studentCourseParams),
  (req, res) => attendanceController.getStudentAttendanceDetails(req, res),
)

router.get(
  "/report/class/:courseId/:semesterId",
  authMiddleware,
  validateParams(attendanceValidation.courseAndSemesterParams),
  (req, res) => attendanceController.getClassAttendanceReport(req, res),
)

export default router
