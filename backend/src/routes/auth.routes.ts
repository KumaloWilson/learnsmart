import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/admin.middleware"
import { validate, authValidation } from "../middlewares/validation.middleware"

const router = Router()
const authController = new AuthController()

// Public routes
router.post("/login", validate(authValidation.login), authController.login)
router.post("/refresh-token", validate(authValidation.refreshToken), authController.refreshToken)
router.post("/forgot-password", validate(authValidation.forgotPassword), authController.forgotPassword)
router.post("/reset-password", validate(authValidation.resetPassword), authController.resetPassword)

// Protected routes
router.post("/register", [authMiddleware, adminMiddleware, validate(authValidation.register)], authController.register) // Only admins can register new users
router.post("/logout", [authMiddleware, validate(authValidation.refreshToken)], authController.logout)
router.post("/logout-all", authMiddleware, authController.logoutAll)
router.post(
  "/change-password",
  [authMiddleware, validate(authValidation.changePassword)],
  authController.changePassword,
)
router.get("/profile", authMiddleware, authController.getProfile)
router.put("/profile", [authMiddleware, validate(authValidation.updateProfile)], authController.updateProfile)

// Public registration for development purposes only
// In production, you would remove this route and only allow admins to create accounts
if (process.env.NODE_ENV === "development") {
  router.post("/dev/register", validate(authValidation.register), authController.register)
}

export default router
