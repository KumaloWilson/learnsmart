import { Router } from "express"
import { QuizController } from "../controllers/quiz.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, validateParams, validateQuery } from "../middlewares/validation.middleware"
import { quizValidation } from "../middlewares/validation.middleware"

const router = Router()
const quizController = new QuizController()

// Get all quizzes with optional filters
router.get("/", authMiddleware, validateQuery(quizValidation.getQuizzesQuery), (req, res) =>
  quizController.findAll(req, res),
)

// Get a quiz by ID
router.get("/:id", authMiddleware, validateParams(quizValidation.quizIdParam), (req, res) =>
  quizController.findById(req, res),
)

// Create a new quiz
router.post("/", authMiddleware, validate(quizValidation.createQuiz), (req, res) => quizController.create(req, res))

// Update a quiz
router.put(
  "/:id",
  authMiddleware,
  validateParams(quizValidation.quizIdParam),
  validate(quizValidation.updateQuiz),
  (req, res) => quizController.update(req, res),
)

// Delete (deactivate) a quiz
router.delete("/:id", authMiddleware, validateParams(quizValidation.quizIdParam), (req, res) =>
  quizController.delete(req, res),
)

// Get quiz attempts with optional filters
router.get("/attempts", authMiddleware, validateQuery(quizValidation.getQuizAttemptsQuery), (req, res) =>
  quizController.getQuizAttempts(req, res),
)

// Get a quiz attempt by ID
router.get("/attempts/:id", authMiddleware, validateParams(quizValidation.attemptIdParam), (req, res) =>
  quizController.getQuizAttemptById(req, res),
)

// Start a quiz attempt
router.post("/attempts/start", authMiddleware, validate(quizValidation.startQuizAttempt), (req, res) =>
  quizController.startQuizAttempt(req, res),
)

// Submit a quiz attempt
router.post(
  "/attempts/:id/submit",
  authMiddleware,
  validateParams(quizValidation.attemptIdParam),
  validate(quizValidation.submitQuizAttempt),
  (req, res) => quizController.submitQuizAttempt(req, res),
)

// Manually grade a quiz attempt
router.post(
  "/attempts/:id/grade",
  authMiddleware,
  validateParams(quizValidation.attemptIdParam),
  validate(quizValidation.manualGradeQuizAttempt),
  (req, res) => quizController.manualGradeQuizAttempt(req, res),
)

// Generate quiz questions
router.post("/generate-questions", authMiddleware, validate(quizValidation.generateQuizQuestions), (req, res) =>
  quizController.generateQuizQuestions(req, res),
)

// Get quiz statistics
router.get("/:quizId/statistics", authMiddleware, validateParams(quizValidation.quizIdParam), (req, res) =>
  quizController.getQuizStatistics(req, res),
)

// Get student quiz performance
router.get(
  "/performance/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  validateParams(quizValidation.studentPerformanceParams),
  (req, res) => quizController.getStudentQuizPerformance(req, res),
)

// Get class quiz performance
router.get(
  "/performance/class/course/:courseId/semester/:semesterId",
  authMiddleware,
  validateParams(quizValidation.courseAndSemesterParams),
  (req, res) => quizController.getClassQuizPerformance(req, res),
)

export default router
