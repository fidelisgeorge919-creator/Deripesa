import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, asyncHandler, sendSuccess } from '../utils/errors'

const prisma = new PrismaClient()

export const getWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.id },
  })

  if (!wallet) {
    throw new AppError('Wallet not found', 404)
  }

  sendSuccess(res, wallet)
})

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { page = 1, limit = 20, type, status } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = { userId: req.user.id }
  if (type) where.type = type
  if (status) where.status = status

  const transactions = await prisma.transaction.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.transaction.count({ where })

  sendSuccess(res, {
    transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

export const getEarnings = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.id },
  })

  const taskEarnings = await prisma.transaction.aggregate({
    where: {
      userId: req.user.id,
      type: 'TASK_REWARD',
      status: 'COMPLETED',
    },
    _sum: { amount: true },
  })

  const referralEarnings = await prisma.transaction.aggregate({
    where: {
      userId: req.user.id,
      type: 'REFERRAL_BONUS',
      status: 'COMPLETED',
    },
    _sum: { amount: true },
  })

  sendSuccess(res, {
    totalEarnings: wallet?.earnings || 0,
    taskEarnings: taskEarnings._sum.amount || 0,
    referralEarnings: referralEarnings._sum.amount || 0,
    bonusBalance: wallet?.bonusBalance || 0,
  })
})

export const getDepositHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { page = 1, limit = 20, status } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = { userId: req.user.id }
  if (status) where.status = status

  const deposits = await prisma.deposit.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.deposit.count({ where })

  sendSuccess(res, {
    deposits,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

export const getWithdrawalHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { page = 1, limit = 20, status } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = { userId: req.user.id }
  if (status) where.status = status

  const withdrawals = await prisma.withdrawal.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.withdrawal.count({ where })

  sendSuccess(res, {
    withdrawals,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})
