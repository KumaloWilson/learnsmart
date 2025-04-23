import { Router } from "express"
import { CourseController } from "../controllers/course.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"

const router = Router()
const courseController = new CourseController()

// Public routes
router.get("/", courseController.getAll)
router.get("/:id", courseController.getById)
router.get("/program/:programId", courseController.getByProgram)

// Admin only routes
router.post("/", [authMiddleware, adminMiddleware], courseController.create)
router.put("/:id", [authMiddleware, adminMiddleware], courseController.update)
router.delete("/:id", [authMiddleware, adminMiddleware], courseController.delete)
router.post("/:courseId/semester/:semesterId", [authMiddleware, adminMiddleware], courseController.assignToSemester)
router.delete("/:courseId/semester/:semesterId", [authMiddleware, adminMiddleware], courseController.removeFromSemester)

export default router
