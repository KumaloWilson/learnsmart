import { Router } from "express"
import { AttendanceController } from "../controllers/attendance.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validateRequest } from "../middlewares/validation.middleware"
import { body, param, query } from "express-validator"

const router = Router()
const attendanceController = new AttendanceController()

// Physical attendance routes
router.post(
  "/physical",
  authMiddleware,
  [
    body("studentProfileId").isUUID(),
    body("courseId").isUUID(),
    body("semesterId").isUUID(),
    body("periodId").isUUID(),
    body("date").isISO8601(),
    body("isPresent").isBoolean(),
    body("notes").optional().isString(),
  ],
  validateRequest,
  (req, res) => attendanceController.recordPhysicalAttendance(req, res),
)

router.post(
  "/physical/bulk",
  authMiddleware,
  [
    body("attendances").isArray(),
    body("attendances.*.studentProfileId").isUUID(),
    body("attendances.*.courseId").isUUID(),
    body("attendances.*.semesterId").isUUID(),
    body("attendances.*.periodId").isUUID(),
    body("attendances.*.date").isISO8601(),
    body("attendances.*.isPresent").isBoolean(),
  ],
  validateRequest,
  (req, res) => attendanceController.bulkRecordPhysicalAttendance(req, res),
)

router.put(
  "/physical/:id",
  authMiddleware,
  [param("id").isUUID(), body("isPresent").optional().isBoolean(), body("notes").optional().isString()],
  validateRequest,
  (req, res) => attendanceController.updatePhysicalAttendance(req, res),
)

router.delete("/physical/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  attendanceController.deletePhysicalAttendance(req, res),
)

router.get("/physical/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  attendanceController.getPhysicalAttendanceById(req, res),
)

router.get(
  "/physical/student/:studentId",
  authMiddleware,
  [param("studentId").isUUID(), query("courseId").optional().isUUID(), query("semesterId").optional().isUUID()],
  validateRequest,
  (req, res) => attendanceController.getPhysicalAttendanceByStudent(req, res),
)

router.get(
  "/physical/course/:courseId/semester/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => attendanceController.getPhysicalAttendanceByCourse(req, res),
)

router.get("/physical/period/:periodId", authMiddleware, [param("periodId").isUUID()], validateRequest, (req, res) =>
  attendanceController.getPhysicalAttendanceByPeriod(req, res),
)

router.get(
  "/physical/statistics/:courseId/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => attendanceController.getPhysicalAttendanceStatistics(req, res),
)

// Virtual attendance routes
router.post(
  "/virtual",
  authMiddleware,
  [
    body("studentProfileId").isUUID(),
    body("virtualClassId").isUUID(),
    body("joinTime").optional().isISO8601(),
    body("leaveTime").optional().isISO8601(),
    body("durationMinutes").optional().isInt({ min: 0 }),
    body("isPresent").isBoolean(),
    body("notes").optional().isString(),
  ],
  validateRequest,
  (req, res) => attendanceController.recordVirtualAttendance(req, res),
)

router.post(
  "/virtual/bulk",
  authMiddleware,
  [
    body("attendances").isArray(),
    body("attendances.*.studentProfileId").isUUID(),
    body("attendances.*.virtualClassId").isUUID(),
    body("attendances.*.isPresent").isBoolean(),
  ],
  validateRequest,
  (req, res) => attendanceController.bulkRecordVirtualAttendance(req, res),
)

router.put(
  "/virtual/:id",
  authMiddleware,
  [
    param("id").isUUID(),
    body("joinTime").optional().isISO8601(),
    body("leaveTime").optional().isISO8601(),
    body("durationMinutes").optional().isInt({ min: 0 }),
    body("isPresent").optional().isBoolean(),
    body("notes").optional().isString(),
  ],
  validateRequest,
  (req, res) => attendanceController.updateVirtualAttendance(req, res),
)

router.delete("/virtual/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  attendanceController.deleteVirtualAttendance(req, res),
)

router.get("/virtual/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  attendanceController.getVirtualAttendanceById(req, res),
)

router.get(
  "/virtual/class/:virtualClassId",
  authMiddleware,
  [param("virtualClassId").isUUID()],
  validateRequest,
  (req, res) => attendanceController.getVirtualAttendanceByVirtualClass(req, res),
)

router.get(
  "/virtual/student/:studentId",
  authMiddleware,
  [param("studentId").isUUID(), query("courseId").optional().isUUID(), query("semesterId").optional().isUUID()],
  validateRequest,
  (req, res) => attendanceController.getVirtualAttendanceByStudent(req, res),
)

router.get(
  "/virtual/statistics/:courseId/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => attendanceController.getVirtualAttendanceStatistics(req, res),
)

// Combined attendance statistics
router.get(
  "/statistics/combined/:courseId/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => attendanceController.getCombinedAttendanceStatistics(req, res),
)

export default router
