import jwt, { SignOptions } from "jsonwebtoken"
import crypto from "crypto"
import { PasswordResetToken } from "../models/PasswordResetToken"
import { RefreshToken } from "../models/RefreshToken"
import { User } from "../models/User"

export class TokenService {
  private readonly JWT_SECRET: jwt.Secret
  private readonly JWT_EXPIRES_IN: string
  private readonly REFRESH_TOKEN_EXPIRES_IN: number // in days

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "default_secret"
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"
    this.REFRESH_TOKEN_EXPIRES_IN = 7 // 7 days
  }

  generateAccessToken(user: User): string {

    if (!user) {
      throw new Error("User is required to generate access token")
    }
    if (!user.id || !user.email || !user.role) {
      throw new Error("User must have id, email, and role to generate access token")
    }
    if (typeof user.id !== "string" || typeof user.email !== "string" || typeof user.role !== "string") {
      throw new Error("User id, email, and role must be strings")
    }
    // Ensure that the JWT_SECRET is a valid string
    if (typeof this.JWT_SECRET !== "string") {
      throw new Error("JWT_SECRET must be a string")
    }
    if (this.JWT_SECRET.length < 10) {
      throw new Error("JWT_SECRET must be at least 10 characters long")
    }
    if (this.JWT_EXPIRES_IN.length < 2) {
      throw new Error("JWT_EXPIRES_IN must be at least 2 characters long")
    }
    if (this.REFRESH_TOKEN_EXPIRES_IN < 1) {
      throw new Error("REFRESH_TOKEN_EXPIRES_IN must be at least 1 day")
    }
    if (this.REFRESH_TOKEN_EXPIRES_IN > 30) {
      throw new Error("REFRESH_TOKEN_EXPIRES_IN must be at most 30 days")
    }
    if (this.JWT_EXPIRES_IN !== "1h" && this.JWT_EXPIRES_IN !== "2h") {
      throw new Error("JWT_EXPIRES_IN must be either '1h' or '2h'")
    }
   
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRES_IN,
      },
    )
  }


  async generateRefreshToken(user: User): Promise<string> {
    const token = crypto.randomBytes(40).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_IN)

    await RefreshToken.create({
      token,
      userId: user.id,
      expiresAt,
      revoked: false,
    })

    return token
  }

  async verifyRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await RefreshToken.findOne({
      where: {
        token,
        revoked: false,
      },
      include: [User],
    })

    if (!refreshToken) {
      return null
    }

    if (new Date() > refreshToken.expiresAt) {
      await refreshToken.update({ revoked: true })
      return null
    }

    return refreshToken.user || null
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await RefreshToken.findOne({
      where: {
        token,
      },
    })

    if (!refreshToken) {
      return false
    }

    await refreshToken.update({ revoked: true })
    return true
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<boolean> {
    await RefreshToken.update(
      { revoked: true },
      {
        where: {
          userId,
          revoked: false,
        },
      },
    )
    return true
  }

  async generatePasswordResetToken(user: User): Promise<string> {
    const token = crypto.randomBytes(20).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    await PasswordResetToken.create({
      token,
      userId: user.id,
      expiresAt,
      used: false,
    })

    return token
  }

  async verifyPasswordResetToken(token: string): Promise<User | null> {
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        used: false,
      },
      include: [User],
    })

    if (!resetToken) {
      return null
    }

    if (new Date() > resetToken.expiresAt) {
      await resetToken.update({ used: true })
      return null
    }

    return resetToken.user || null
  }

  async markPasswordResetTokenAsUsed(token: string): Promise<boolean> {
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
      },
    })

    if (!resetToken) {
      return false
    }

    await resetToken.update({ used: true })
    return true
  }
}
