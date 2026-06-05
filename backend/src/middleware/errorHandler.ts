import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    })
  } else {
    console.error('Unhandled error:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
}
