import express from "express"
import { StudentPerformanceController } from "../controllers/student-performance.controller"
import { validateDto, validateParams, validateQuery } from "../middlewares/validation.middleware"
import Joi from "joi"
import { authMiddleware } from "../middlewares/auth.middleware"
import {
  CreateStudentPerformanceDto,
  UpdateStudentPerformanceDto,
  GeneratePerformanceAnalysisDto,
  ClassPerformanceAnalysisDto,
} from "../dto/student-performance.dto"

const router = express.Router()
const studentPerformanceController = new StudentPerformanceController()

// Routes
router.get(
  "/",
  authMiddleware,
  validateQuery(
    Joi.object({
      studentProfileId: Joi.string().uuid(),
      courseId: Joi.string().uuid(),
      semesterId: Joi.string().uuid(),
      performanceCategory: Joi.string(),
      minOverallPerformance: Joi.number().min(0).max(100),
      maxOverallPerformance: Joi.number().min(0).max(100),
    }),
  ),
  studentPerformanceController.findAll,
)

router.get(
  "/:id",
  authMiddleware,
  validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
    }),
  ),
  studentPerformanceController.findById,
)

router.get(
  "/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  validateParams(
    Joi.object({
      studentProfileId: Joi.string().uuid().required(),
      courseId: Joi.string().uuid().required(),
      semesterId: Joi.string().uuid().required(),
    }),
  ),
  studentPerformanceController.findByStudent,
)

router.post("/", authMiddleware, validateDto(CreateStudentPerformanceDto), studentPerformanceController.create)

router.put(
  "/:id",
  authMiddleware,
  validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
    }),
  ),
  validateDto(UpdateStudentPerformanceDto),
  studentPerformanceController.update,
)

router.delete(
  "/:id",
  authMiddleware,
  validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
    }),
  ),
  studentPerformanceController.delete,
)

router.post(
  "/analysis",
  authMiddleware,
  validateDto(GeneratePerformanceAnalysisDto),
  studentPerformanceController.generatePerformanceAnalysis,
)

router.post(
  "/class-analysis",
  authMiddleware,
  validateDto(ClassPerformanceAnalysisDto),
  studentPerformanceController.generateClassPerformanceAnalysis,
)

export default router
