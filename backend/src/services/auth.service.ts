import bcrypt from "bcrypt"
import { User } from "../models"
import { TokenService } from "./token.service"
import type { RegisterUserDto, LoginDto, AuthResponseDto, ChangePasswordDto } from "../dto/auth.dto"

export class AuthService {
  private tokenService: TokenService

  constructor() {
    this.tokenService = new TokenService()
  }

  async register(userData: RegisterUserDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email: userData.email,
      },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const user = await User.create(userData as any)

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = await this.tokenService.generateRefreshToken(user)

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await User.findOne({
      where: {
        email: loginData.email,
      },
    })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(loginData.password)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = await this.tokenService.generateRefreshToken(user)

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(token: string): Promise<AuthResponseDto | null> {
    const user = await this.tokenService.verifyRefreshToken(token)

    if (!user) {
      return null
    }

    // Revoke the old refresh token
    await this.tokenService.revokeRefreshToken(token)

    // Generate new tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = await this.tokenService.generateRefreshToken(user)

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async logout(token: string): Promise<boolean> {
    return this.tokenService.revokeRefreshToken(token)
  }

  async logoutAll(userId: string): Promise<boolean> {
    return this.tokenService.revokeAllUserRefreshTokens(userId)
  }

  async forgotPassword(email: string): Promise<string | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return this.tokenService.generatePasswordResetToken(user)
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.tokenService.verifyPasswordResetToken(token)

    if (!user) {
      return false
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user's password
    await user.update({ password: hashedPassword })

    // Mark the token as used
    await this.tokenService.markPasswordResetTokenAsUsed(token)

    return true
  }

  async changePassword(userId: string, data: ChangePasswordDto): Promise<boolean> {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(data.currentPassword)

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.newPassword, salt)

    // Update user's password
    await user.update({ password: hashedPassword })

    // Revoke all refresh tokens for security
    await this.tokenService.revokeAllUserRefreshTokens(userId)

    return true
  }

  async getUserProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user.update(data)
  }
}
