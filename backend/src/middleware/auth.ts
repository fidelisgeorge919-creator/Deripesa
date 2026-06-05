import { Request, Response, NextFunction } from 'express'
import { verifyToken, JWTPayload } from './auth'
import { AppError } from './errors'

export interface AuthRequest extends Request {
  user?: JWTPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('No token provided', 401)
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      throw new AppError('Invalid token', 401)
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401)
    }

    if (req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403)
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }
}
