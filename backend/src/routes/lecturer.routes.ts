import { Router } from "express"
import multer from "multer"
import { LecturerController } from "../controllers/lecturer.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validate, lecturerValidation } from "../middlewares/validation.middleware"

const router = Router()
const lecturerController = new LecturerController()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith("video/")) {
      cb(null, true)
    } else {
      cb(new Error("Only video files are allowed"))
    }
  },
})

// Existing routes...

// Teaching material routes
router.get("/:lecturerId/teaching-materials", authMiddleware, lecturerController.getTeachingMaterials)
router.get("/teaching-material/:id", authMiddleware, lecturerController.getTeachingMaterialById)
router.post(
  "/teaching-material",
  [authMiddleware, validate(lecturerValidation.createTeachingMaterial)],
  lecturerController.createTeachingMaterial,
)
router.put(
  "/teaching-material/:id",
  [authMiddleware, validate(lecturerValidation.updateTeachingMaterial)],
  lecturerController.updateTeachingMaterial,
)
router.delete("/teaching-material/:id", authMiddleware, lecturerController.deleteTeachingMaterial)

// Video upload routes
router.post("/upload-video", [authMiddleware, upload.single("video")], lecturerController.uploadVideo)

router.post(
  "/add-youtube-video",
  [authMiddleware, validate(lecturerValidation.addYoutubeVideo)],
  lecturerController.addYoutubeVideo,
)

// Other existing routes...

export default router
