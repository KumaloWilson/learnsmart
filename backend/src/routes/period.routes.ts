import { Router } from "express"
import { PeriodController } from "../controllers/period.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const periodController = new PeriodController()

// Public routes
router.get("/", periodController.getAll)
router.get("/:id", periodController.getById)
router.get("/semester/:semesterId", periodController.getBySemester)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], periodController.create)
router.put("/:id", [authMiddleware, adminMiddleware], periodController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], periodController.delete)

export default router
