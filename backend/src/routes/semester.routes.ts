import { Router } from "express"
import { SemesterController } from "../controllers/semester.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const semesterController = new SemesterController()

// Public routes
router.get("/", semesterController.getAll)
router.get("/active", semesterController.getActive)
router.get("/:id", semesterController.getById)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], semesterController.create)
router.put("/:id", [authMiddleware, adminMiddleware], semesterController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], semesterController.delete)

export default router
