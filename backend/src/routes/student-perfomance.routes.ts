import express, { Request, Response, NextFunction } from "express"
import { StudentPerformanceController } from "../controllers/student-performance.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = express.Router()
const studentPerformanceController = new StudentPerformanceController()

// Routes
router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.findAll(req, res)
  } catch (err) {
    next(err)
  }
})

router.get("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.findById(req, res)
  } catch (err) {
    next(err)
  }
})

router.get(
  "/student/:studentProfileId/course/:courseId/semester/:semesterId",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await studentPerformanceController.findByStudent(req, res)
    } catch (err) {
      next(err)
    }
  },
)

router.put("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.update(req, res)
  } catch (err) {
    next(err)
  }
})

router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.delete(req, res)
  } catch (err) {
    next(err)
  }
})

router.post("/analysis", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.generatePerformanceAnalysis(req, res)
  } catch (err) {
    next(err)
  }
})

router.post("/class-analysis", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentPerformanceController.generateClassPerformanceAnalysis(req, res)
  } catch (err) {
    next(err)
  }
})

export default router
