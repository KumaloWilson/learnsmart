import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models"

interface TokenPayload {
  id: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
      },
      file?: Express.Multer.File
      files?: { [fieldname: string]: Express.Multer.File[] }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" })
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Token error" })
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: "Token malformatted" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as TokenPayload

    const user = await User.findByPk(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    }

    return next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
