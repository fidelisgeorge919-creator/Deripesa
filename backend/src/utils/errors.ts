export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export const sendSuccess = (res: any, data: any, message: string = 'Success', statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export const sendError = (res: any, message: string, statusCode: number = 500, data?: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    data,
  })
}
