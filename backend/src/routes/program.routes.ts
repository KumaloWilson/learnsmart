import { Router } from "express"
import { ProgramController } from "../controllers/program.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const programController = new ProgramController()

// Public routes
router.get("/", programController.getAll)
router.get("/:id", programController.getById)
router.get("/department/:departmentId", programController.getByDepartment)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], programController.create)
router.put("/:id", [authMiddleware, adminMiddleware], programController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], programController.delete)

export default router
