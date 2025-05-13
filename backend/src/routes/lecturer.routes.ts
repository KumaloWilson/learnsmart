import express from "express"
import { LecturerController } from "../controllers/lecturer.controller"
import { validate, validateParams } from "../middlewares/validation.middleware"
import Joi from "joi"
import { authMiddleware } from "../middlewares/auth.middleware"
import multer from "multer"

const router = express.Router()
const lecturerController = new LecturerController()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Validation schemas
const idParam = Joi.object({
  id: Joi.string().uuid().required(),
})

const userIdParam = Joi.object({
  userId: Joi.string().uuid().required(),
})

const lecturerIdParam = Joi.object({
  lecturerId: Joi.string().uuid().required(),
})

const assessmentIdParam = Joi.object({
  assessmentId: Joi.string().uuid().required(),
})

const lecturerProfileSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().allow("", null),
  departmentId: Joi.string().uuid().required(),
  specialization: Joi.string().allow("", null),
  bio: Joi.string().allow("", null),
  officeLocation: Joi.string().allow("", null),
  officeHours: Joi.string().allow("", null),
})

const courseAssignmentSchema = Joi.object({
  lecturerProfileId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  role: Joi.string().valid("primary", "assistant").required(),
})

const assessmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("assignment", "quiz", "exam", "project").required(),
  dueDate: Joi.date().required(),
  totalPoints: Joi.number().required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  lecturerProfileId: Joi.string().uuid().required(),
  instructions: Joi.string().required(),
})

const gradeSubmissionSchema = Joi.object({
  grade: Joi.number().required(),
  feedback: Joi.string().allow("", null),
})

const teachingMaterialSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string().valid("document", "video", "presentation", "link", "youtube").required(),
  url: Joi.string().required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  lecturerProfileId: Joi.string().uuid().required(),
})

const youtubeVideoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  youtubeUrl: Joi.string().required(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  lecturerProfileId: Joi.string().uuid().required(),
})

const videoUploadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  courseId: Joi.string().uuid().required(),
  semesterId: Joi.string().uuid().required(),
  lecturerProfileId: Joi.string().uuid().required(),
})

// Lecturer profile routes
router.get(
  "/",
  authMiddleware,
  lecturerController.getAllLecturers
)

router.get(
  "/:id",
  authMiddleware,
  //validateParams(idParam),
  lecturerController.getLecturerById
)

router.get(
  "/user/:userId",
  authMiddleware,
  //validateParams(userIdParam),
  lecturerController.getLecturerByUserId
)

router.post(
  "/",
  authMiddleware,
  validate(lecturerProfileSchema),
  lecturerController.createLecturer
)

router.put(
  "/:id",
  authMiddleware,
  // validateParams(idParam),
  //validate(lecturerProfileSchema),
  lecturerController.updateLecturer
)

router.delete(
  "/:id",
  authMiddleware,
  // validateParams(idParam),
  lecturerController.deleteLecturer
)

// Course assignment routes
router.get(
  "/:lecturerId/course-assignments",
  authMiddleware,
  //validateParams(lecturerIdParam),
  lecturerController.getLecturerCourseAssignments
)

router.post(
  "/course-assignments",
  authMiddleware,
  validate(courseAssignmentSchema),
  lecturerController.assignCourseToLecturer
)

router.put(
  "/course-assignments/:id",
  authMiddleware,
  //validateParams(idParam),
  validate(courseAssignmentSchema),
  lecturerController.updateCourseAssignment
)

router.delete(
  "/course-assignments/:id",
  authMiddleware,
  //validateParams(idParam),
  lecturerController.removeCourseAssignment
)

// Assessment routes
router.get(
  "/:lecturerId/assessments",
  authMiddleware,
  //validateParams(lecturerIdParam),
  lecturerController.getLecturerAssessments
)

router.post(
  "/assessments",
  authMiddleware,
  validate(assessmentSchema),
  lecturerController.createAssessment
)

router.put(
  "/assessments/:id",
  authMiddleware,
  //validateParams(idParam),
  validate(assessmentSchema),
  lecturerController.updateAssessment
)

router.delete(
  "/assessments/:id",
  authMiddleware,
  //validateParams(idParam),
  lecturerController.deleteAssessment
)

// Assessment submission routes
router.get(
  "/assessments/:assessmentId/submissions",
  authMiddleware,
  //validateParams(assessmentIdParam),
  lecturerController.getAssessmentSubmissions
)

router.put(
  "/submissions/:id/grade",
  authMiddleware,
  //validateParams(idParam),
  validate(gradeSubmissionSchema),
  lecturerController.gradeSubmission
)

// Teaching material routes
router.get(
  "/:lecturerId/teaching-materials",
  authMiddleware,
  validateParams(lecturerIdParam),
  lecturerController.getTeachingMaterials
)

router.get(
  "/teaching-materials/:id",
  authMiddleware,
  validateParams(idParam),
  lecturerController.getTeachingMaterialById
)

router.post(
  "/teaching-materials",
  authMiddleware,
  validate(teachingMaterialSchema),
  lecturerController.createTeachingMaterial
)

router.put(
  "/teaching-materials/:id",
  authMiddleware,
  validateParams(idParam),
  validate(teachingMaterialSchema),
  lecturerController.updateTeachingMaterial
)

router.delete(
  "/teaching-materials/:id",
  authMiddleware,
  validateParams(idParam),
  lecturerController.deleteTeachingMaterial
)

// Video upload routes
router.post(
  "/videos/upload",
  authMiddleware,
  upload.single("video"),
  validate(videoUploadSchema),
  lecturerController.uploadVideo
)

router.post(
  "/videos/youtube",
  authMiddleware,
  validate(youtubeVideoSchema),
  lecturerController.addYoutubeVideo
)

export default router