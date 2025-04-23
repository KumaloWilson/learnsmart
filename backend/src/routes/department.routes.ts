import { Router } from "express"
import { DepartmentController } from "../controllers/department.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const departmentController = new DepartmentController()

// Public routes
router.get("/", departmentController.getAll)
router.get("/:id", departmentController.getById)
router.get("/school/:schoolId", departmentController.getBySchool)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], departmentController.create)
router.put("/:id", [authMiddleware, adminMiddleware], departmentController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], departmentController.delete)

export default router
