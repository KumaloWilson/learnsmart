import { Router } from "express"
import { VirtualClassController } from "../controllers/virtual-class.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validateRequest } from "../middlewares/validation.middleware"
import { body, param, query } from "express-validator"

const router = Router()
const virtualClassController = new VirtualClassController()

// Get all virtual classes with optional filters
router.get(
  "/",
  authMiddleware,
  [
    query("lecturerProfileId").optional().isUUID(),
    query("courseId").optional().isUUID(),
    query("semesterId").optional().isUUID(),
    query("status").optional().isString(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
  ],
  validateRequest,
  (req, res) => virtualClassController.findAll(req, res),
)

// Get a virtual class by ID
router.get("/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  virtualClassController.findById(req, res),
)

// Get upcoming virtual classes for a lecturer
router.get(
  "/upcoming/:lecturerProfileId",
  authMiddleware,
  [param("lecturerProfileId").isUUID(), query("limit").optional().isInt({ min: 1, max: 50 })],
  validateRequest,
  (req, res) => virtualClassController.findUpcoming(req, res),
)

// Create a new virtual class
router.post(
  "/",
  authMiddleware,
  [
    body("title").isString().notEmpty(),
    body("description").optional().isString(),
    body("scheduledStartTime").isISO8601(),
    body("scheduledEndTime").isISO8601(),
    body("isRecorded").isBoolean(),
    body("lecturerProfileId").isUUID(),
    body("courseId").isUUID(),
    body("semesterId").isUUID(),
    body("meetingConfig").optional().isObject(),
  ],
  validateRequest,
  (req, res) => virtualClassController.create(req, res),
)

// Update a virtual class
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isUUID(),
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("scheduledStartTime").optional().isISO8601(),
    body("scheduledEndTime").optional().isISO8601(),
    body("status").optional().isIn(["scheduled", "in_progress", "completed", "cancelled"]),
    body("actualStartTime").optional().isISO8601(),
    body("actualEndTime").optional().isISO8601(),
    body("duration").optional().isInt({ min: 0 }),
    body("isRecorded").optional().isBoolean(),
    body("recordingUrl").optional().isURL(),
    body("meetingId").optional().isString(),
    body("meetingLink").optional().isString(),
    body("meetingConfig").optional().isObject(),
  ],
  validateRequest,
  (req, res) => virtualClassController.update(req, res),
)

// Delete (cancel) a virtual class
router.delete("/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  virtualClassController.delete(req, res),
)

// Get attendance for a virtual class
router.get(
  "/:virtualClassId/attendance",
  authMiddleware,
  [param("virtualClassId").isUUID()],
  validateRequest,
  (req, res) => virtualClassController.getAttendance(req, res),
)

// Record attendance for a virtual class
router.post(
  "/attendance",
  authMiddleware,
  [
    body("virtualClassId").isUUID(),
    body("studentProfileId").isUUID(),
    body("joinTime").optional().isISO8601(),
    body("leaveTime").optional().isISO8601(),
    body("durationMinutes").optional().isInt({ min: 0 }),
    body("isPresent").isBoolean(),
    body("notes").optional().isString(),
  ],
  validateRequest,
  (req, res) => virtualClassController.recordAttendance(req, res),
)

// Update attendance record
router.put(
  "/attendance/:id",
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
  (req, res) => virtualClassController.updateAttendance(req, res),
)

// Bulk record attendance for a virtual class
router.post(
  "/:virtualClassId/attendance/bulk",
  authMiddleware,
  [
    param("virtualClassId").isUUID(),
    body("attendances").isArray(),
    body("attendances.*.studentProfileId").isUUID(),
    body("attendances.*.isPresent").isBoolean(),
  ],
  validateRequest,
  (req, res) => virtualClassController.bulkRecordAttendance(req, res),
)

// Get attendance statistics for a virtual class
router.get(
  "/:virtualClassId/attendance/statistics",
  authMiddleware,
  [param("virtualClassId").isUUID()],
  validateRequest,
  (req, res) => virtualClassController.getAttendanceStatistics(req, res),
)

// Get virtual classes by course and semester
router.get(
  "/course/:courseId/semester/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => virtualClassController.getVirtualClassesByCourse(req, res),
)

export default router
