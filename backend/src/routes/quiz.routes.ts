import { Router } from "express"
import { QuizController } from "../controllers/quiz.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validateRequest } from "../middlewares/validation.middleware"
import { body, param, query } from "express-validator"

const router = Router()
const quizController = new QuizController()

// Get all quizzes with optional filters
router.get(
  "/",
  authMiddleware,
  [
    query("lecturerProfileId").optional().isUUID(),
    query("courseId").optional().isUUID(),
    query("semesterId").optional().isUUID(),
    query("isActive").optional().isBoolean(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
  ],
  validateRequest,
  (req, res) => quizController.findAll(req, res),
)

// Get a quiz by ID
router.get("/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  quizController.findById(req, res),
)

// Create a new quiz
router.post(
  "/",
  authMiddleware,
  [
    body("title").isString().notEmpty(),
    body("description").optional().isString(),
    body("topic").isString().notEmpty(),
    body("numberOfQuestions").isInt({ min: 1 }),
    body("timeLimit").isInt({ min: 1 }),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    body("totalMarks").optional().isFloat({ min: 0 }),
    body("passingMarks").optional().isFloat({ min: 0 }),
    body("isActive").optional().isBoolean(),
    body("isRandomized").optional().isBoolean(),
    body("aiPrompt").optional().isObject(),
    body("questionType").isIn(["multiple_choice", "true_false", "short_answer", "mixed"]),
    body("instructions").optional().isString(),
    body("lecturerProfileId").isUUID(),
    body("courseId").isUUID(),
    body("semesterId").isUUID(),
  ],
  validateRequest,
  (req, res) => quizController.create(req, res),
)

// Update a quiz
router.put(
  "/:id",
  authMiddleware,
  [
    param("id").isUUID(),
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("topic").optional().isString(),
    body("numberOfQuestions").optional().isInt({ min: 1 }),
    body("timeLimit").optional().isInt({ min: 1 }),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("totalMarks").optional().isFloat({ min: 0 }),
    body("passingMarks").optional().isFloat({ min: 0 }),
    body("isActive").optional().isBoolean(),
    body("isRandomized").optional().isBoolean(),
    body("aiPrompt").optional().isObject(),
    body("questionType").optional().isIn(["multiple_choice", "true_false", "short_answer", "mixed"]),
    body("instructions").optional().isString(),
  ],
  validateRequest,
  (req, res) => quizController.update(req, res),
)

// Delete (deactivate) a quiz
router.delete("/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  quizController.delete(req, res),
)

// Get quiz attempts with optional filters
router.get(
  "/attempts",
  authMiddleware,
  [
    query("quizId").optional().isUUID(),
    query("studentProfileId").optional().isUUID(),
    query("status").optional().isString(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
  ],
  validateRequest,
  (req, res) => quizController.getQuizAttempts(req, res),
)

// Get a quiz attempt by ID
router.get("/attempts/:id", authMiddleware, [param("id").isUUID()], validateRequest, (req, res) =>
  quizController.getQuizAttemptById(req, res),
)

// Start a quiz attempt
router.post(
  "/attempts/start",
  authMiddleware,
  [body("quizId").isUUID(), body("studentProfileId").isUUID()],
  validateRequest,
  (req, res) => quizController.startQuizAttempt(req, res),
)

// Submit a quiz attempt
router.post(
  "/attempts/:id/submit",
  authMiddleware,
  [param("id").isUUID(), body("answers").isArray()],
  validateRequest,
  (req, res) => quizController.submitQuizAttempt(req, res),
)

// Manually grade a quiz attempt
router.post(
  "/attempts/:id/grade",
  authMiddleware,
  [
    param("id").isUUID(),
    body("score").isFloat({ min: 0 }),
    body("isPassed").isBoolean(),
    body("feedback").optional().isString(),
    body("aiAnalysis").optional().isObject(),
  ],
  validateRequest,
  (req, res) => quizController.manualGradeQuizAttempt(req, res),
)

// Generate quiz questions
router.post(
  "/generate-questions",
  authMiddleware,
  [
    body("topic").isString().notEmpty(),
    body("numberOfQuestions").isInt({ min: 1 }),
    body("questionType").isIn(["multiple_choice", "true_false", "short_answer", "mixed"]),
    body("courseId").isUUID(),
    body("additionalContext").optional().isString(),
  ],
  validateRequest,
  (req, res) => quizController.generateQuizQuestions(req, res),
)

// Get quiz statistics
router.get("/:quizId/statistics", authMiddleware, [param("quizId").isUUID()], validateRequest, (req, res) =>
  quizController.getQuizStatistics(req, res),
)

// Get student quiz performance
router.get(
  "/performance/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  [param("studentProfileId").isUUID(), param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => quizController.getStudentQuizPerformance(req, res),
)

// Get class quiz performance
router.get(
  "/performance/class/course/:courseId/semester/:semesterId",
  authMiddleware,
  [param("courseId").isUUID(), param("semesterId").isUUID()],
  validateRequest,
  (req, res) => quizController.getClassQuizPerformance(req, res),
)

export default router
