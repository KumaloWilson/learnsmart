import type { Request, Response, NextFunction } from "express"

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" })
  }

  return next()
}
