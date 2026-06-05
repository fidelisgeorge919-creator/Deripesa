import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, asyncHandler, sendSuccess } from '../utils/errors'

const prisma = new PrismaClient()

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, type, status } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = { status: 'ACTIVE' }
  if (type) where.type = type

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.task.count({ where })

  sendSuccess(res, {
    tasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const task = await prisma.task.findUnique({
    where: { id },
  })

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  sendSuccess(res, task)
})

export const completeTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { taskId } = req.body

  if (!taskId) {
    throw new AppError('Task ID required', 400)
  }

  // Check if task exists
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  })

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  // Check if user already completed this task today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existingCompletion = await prisma.userTask.findFirst({
    where: {
      userId: req.user.id,
      taskId,
      createdAt: {
        gte: today,
      },
    },
  })

  if (existingCompletion) {
    throw new AppError('Task already completed today', 409)
  }

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId: req.user.id,
      taskId,
      status: 'COMPLETED',
      reward: task.reward,
      completedAt: new Date(),
    },
  })

  // Update wallet
  await prisma.wallet.update({
    where: { userId: req.user.id },
    data: {
      balance: { increment: task.reward },
      earnings: { increment: task.reward },
    },
  })

  // Create transaction
  await prisma.transaction.create({
    data: {
      userId: req.user.id,
      type: 'TASK_REWARD',
      amount: task.reward,
      description: `Completed task: ${task.title}`,
      status: 'COMPLETED',
    },
  })

  sendSuccess(res, {
    userTask,
    reward: task.reward,
  }, 'Task completed successfully')
})

export const getCompletedTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { page = 1, limit = 20 } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const completedTasks = await prisma.userTask.findMany({
    where: { userId: req.user.id },
    skip,
    take: Number(limit),
    include: { task: true },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.userTask.count({
    where: { userId: req.user.id },
  })

  sendSuccess(res, {
    tasks: completedTasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})
