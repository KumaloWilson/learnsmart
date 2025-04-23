import { Router } from "express"
import { StudentController } from "../controllers/student.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"
import { validate, studentValidation } from "../middlewares/validation.middleware"

const router = Router()
const studentController = new StudentController()

// Student profile routes
router.get("/", [authMiddleware, adminMiddleware], studentController.getAllStudents)
router.get("/:id", authMiddleware, studentController.getStudentById)
router.get("/user/:userId", authMiddleware, studentController.getStudentByUserId)
router.get("/student-id/:studentId", authMiddleware, studentController.getStudentByStudentId)
router.post(
  "/",
  [authMiddleware, adminMiddleware, validate(studentValidation.createStudent)],
  studentController.createStudent,
)
router.put(
  "/:id",
  [authMiddleware, adminMiddleware, validate(studentValidation.updateStudent)],
  studentController.updateStudent,
)
router.delete("/:id", [authMiddleware, adminMiddleware], studentController.deleteStudent)

// Course enrollment routes
router.get("/:studentId/enrollments", authMiddleware, studentController.getStudentEnrollments)
router.get(
  "/:studentId/enrollments/semester/:semesterId",
  authMiddleware,
  studentController.getStudentEnrollmentsBySemester,
)
router.post(
  "/enroll",
  [authMiddleware, adminMiddleware, validate(studentValidation.enrollInCourse)],
  studentController.enrollStudentInCourse,
)
router.put(
  "/enrollment/:id",
  [authMiddleware, adminMiddleware, validate(studentValidation.updateEnrollment)],
  studentController.updateEnrollment,
)
router.delete("/enrollment/:id", [authMiddleware, adminMiddleware], studentController.withdrawFromCourse)
router.post(
  "/batch-enroll",
  [authMiddleware, adminMiddleware, validate(studentValidation.batchEnroll)],
  studentController.batchEnrollStudents,
)

// Academic record routes
router.get("/:studentId/academic-records", authMiddleware, studentController.getStudentAcademicRecords)
router.get("/academic-record/:id", authMiddleware, studentController.getAcademicRecord)
router.post(
  "/academic-record",
  [authMiddleware, adminMiddleware, validate(studentValidation.createAcademicRecord)],
  studentController.createAcademicRecord,
)
router.put(
  "/academic-record/:id",
  [authMiddleware, adminMiddleware, validate(studentValidation.updateAcademicRecord)],
  studentController.updateAcademicRecord,
)
router.delete("/academic-record/:id", [authMiddleware, adminMiddleware], studentController.deleteAcademicRecord)

export default router
