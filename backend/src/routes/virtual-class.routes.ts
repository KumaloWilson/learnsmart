import { Router } from "express"
import { VirtualClassController } from "../controllers/virtual-class.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
//import { validate, validateParams, validateQuery } from "../middlewares/validation.middleware"
import { virtualClassValidation } from "../middlewares/validation.middleware"

const router = Router()
const virtualClassController = new VirtualClassController()

// Get all virtual classes with optional filters
router.get(
  "/",
  authMiddleware,
  (req, res) =>
  virtualClassController.findAll(req, res),
)

// Get a virtual class by ID
router.get(
  "/:id",
   authMiddleware,
   // validateParams(virtualClassValidation.virtualClassIdParam), 
  (req, res) =>  virtualClassController.findById(req, res),
)

// Get upcoming virtual classes for a lecturer
router.get(
  "/upcoming/:lecturerProfileId",
  authMiddleware,
  // validateParams(virtualClassValidation.lecturerIdParam),
  // validateQuery(virtualClassValidation.limitQuery),
  (req, res) => virtualClassController.findUpcoming(req, res),
)

// Create a new virtual class
router.post("/", authMiddleware,
 //validate(virtualClassValidation.createVirtualClass),
  (req, res) =>
  virtualClassController.create(req, res),
)

// Update a virtual class
router.put(
  "/:id",
  authMiddleware,
  //validateParams(virtualClassValidation.virtualClassIdParam),
  //validate(virtualClassValidation.updateVirtualClass),
  (req, res) => virtualClassController.update(req, res),
)

// Delete (cancel) a virtual class
router.delete(
  "/:id",
   authMiddleware,
    //validateParams(virtualClassValidation.virtualClassIdParam),
     (req, res) =>
  virtualClassController.delete(req, res),
)

// Get attendance for a virtual class
router.get(
  "/:virtualClassId/attendance",
  authMiddleware,
  //validateParams(virtualClassValidation.virtualClassIdParam),
  (req, res) => virtualClassController.getAttendance(req, res),
)

// Record attendance for a virtual class
router.post("/attendance", authMiddleware,
   //validate(virtualClassValidation.recordAttendance),
    (req, res) =>
  virtualClassController.recordAttendance(req, res),
)

// Update attendance record
router.put(
  "/attendance/:id",
  authMiddleware,
  // validateParams(virtualClassValidation.attendanceIdParam),
  // validate(virtualClassValidation.updateAttendance),
  (req, res) => virtualClassController.updateAttendance(req, res),
)

// Bulk record attendance for a virtual class
router.post(
  "/:virtualClassId/attendance/bulk",
  authMiddleware,
  // validateParams(virtualClassValidation.virtualClassIdParam),
  // validate(virtualClassValidation.bulkRecordAttendance),
  (req, res) => virtualClassController.bulkRecordAttendance(req, res),
)

// Get attendance statistics for a virtual class
router.get(
  "/:virtualClassId/attendance/statistics",
  authMiddleware,
  //validateParams(virtualClassValidation.virtualClassIdParam),
  (req, res) => virtualClassController.getAttendanceStatistics(req, res),
)

// Get virtual classes by course and semester
router.get(
  "/course/:courseId/semester/:semesterId",
  authMiddleware,
  //validateParams(virtualClassValidation.courseAndSemesterParams),
  (req, res) => virtualClassController.getVirtualClassesByCourse(req, res),
)

export default router
