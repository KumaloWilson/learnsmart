import type { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import type {
  RegisterUserDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "../dto/auth.dto"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request, res: Response) => {
    try {
      const userData: RegisterUserDto = req.body

      // Only admins can create admin accounts
      if (userData.role === "admin" && (!req.user || req.user.role !== "admin")) {
        return res.status(403).json({ message: "Only admins can create admin accounts" })
      }

      const result = await this.authService.register(userData)
      return res.status(201).json(result)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const loginData: LoginDto = req.body
      const result = await this.authService.login(loginData)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(401).json({ message: error.message })
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body
      const result = await this.authService.refreshToken(refreshToken)

      if (!result) {
        return res.status(401).json({ message: "Invalid or expired refresh token" })
      }

      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(401).json({ message: error.message })
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body
      await this.authService.logout(refreshToken)
      return res.status(200).json({ message: "Logged out successfully" })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  logoutAll = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      await this.authService.logoutAll(req.user.id)
      return res.status(200).json({ message: "Logged out from all devices successfully" })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email }: ForgotPasswordDto = req.body
      const resetToken = await this.authService.forgotPassword(email)

      if (!resetToken) {
        // Don't reveal that the email doesn't exist
        return res.status(200).json({
          message: "If your email is registered, you will receive a password reset link",
        })
      }

      // In a real application, you would send an email with the reset link
      // For this example, we'll just return the token
      return res.status(200).json({
        message: "Password reset link sent to your email",
        // Only for development purposes
        resetToken,
        resetLink: `${req.protocol}://${req.get("host")}/reset-password?token=${resetToken}`,
      })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password }: ResetPasswordDto = req.body
      const success = await this.authService.resetPassword(token, password)

      if (!success) {
        return res.status(400).json({ message: "Invalid or expired token" })
      }

      return res.status(200).json({ message: "Password reset successfully" })
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  changePassword = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const data: ChangePasswordDto = req.body
      await this.authService.changePassword(req.user.id, data)
      return res.status(200).json({ message: "Password changed successfully" })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  getProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const user = await this.authService.getUserProfile(req.user.id)
      return res.status(200).json(user)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  updateProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { firstName, lastName } = req.body
      const user = await this.authService.updateUserProfile(req.user.id, { firstName, lastName })
      return res.status(200).json(user)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
