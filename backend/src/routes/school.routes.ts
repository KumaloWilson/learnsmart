import { Router } from "express"
import { SchoolController } from "../controllers/school.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const schoolController = new SchoolController()

// Public routes
router.get("/", schoolController.getAll)
router.get("/:id", schoolController.getById)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], schoolController.create)
router.put("/:id", [authMiddleware, adminMiddleware], schoolController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], schoolController.delete)

export default router
