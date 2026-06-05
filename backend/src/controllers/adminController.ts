import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, asyncHandler, sendSuccess } from '../utils/errors'

const prisma = new PrismaClient()

export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const totalUsers = await prisma.user.count()
  const totalTransactions = await prisma.transaction.count()
  const totalDeposits = await prisma.deposit.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  })
  const totalWithdrawals = await prisma.withdrawal.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  })

  const pendingWithdrawals = await prisma.withdrawal.count({
    where: { status: 'PENDING' },
  })

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  })

  sendSuccess(res, {
    stats: {
      totalUsers,
      totalTransactions,
      totalDeposits: totalDeposits._sum.amount || 0,
      totalWithdrawals: totalWithdrawals._sum.amount || 0,
      pendingWithdrawals,
    },
    recentUsers,
  })
})

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { page = 1, limit = 20, role, status } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {}
  if (role) where.role = role
  if (status === 'active') where.isActive = true
  if (status === 'suspended') where.isSuspended = true

  const users = await prisma.user.findMany({
    where,
    skip,
    take: Number(limit),
    include: { wallet: true },
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.user.count({ where })

  sendSuccess(res, {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

export const suspendUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { userId } = req.params

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: true },
  })

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: req.user.id,
      action: 'SUSPEND_USER',
      entity: 'User',
      entityId: userId,
      description: `Suspended user ${user.email}`,
    },
  })

  sendSuccess(res, { user }, 'User suspended successfully')
})

export const activateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { userId } = req.params

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: false },
  })

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: req.user.id,
      action: 'ACTIVATE_USER',
      entity: 'User',
      entityId: userId,
      description: `Activated user ${user.email}`,
    },
  })

  sendSuccess(res, { user }, 'User activated successfully')
})

export const getPendingWithdrawals = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { page = 1, limit = 20 } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const withdrawals = await prisma.withdrawal.findMany({
    where: { status: 'PENDING' },
    skip,
    take: Number(limit),
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  })

  const total = await prisma.withdrawal.count({ where: { status: 'PENDING' } })

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

export const approveWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { withdrawalId } = req.params

  const withdrawal = await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status: 'APPROVED',
      approvedBy: req.user.id,
      approvedAt: new Date(),
    },
  })

  // Create transaction
  await prisma.transaction.create({
    data: {
      userId: withdrawal.userId,
      type: 'WITHDRAWAL',
      amount: withdrawal.amount,
      description: `Withdrawal approved`,
      status: 'COMPLETED',
    },
  })

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: req.user.id,
      action: 'APPROVE_WITHDRAWAL',
      entity: 'Withdrawal',
      entityId: withdrawalId,
      description: `Approved withdrawal of $${withdrawal.amount}`,
    },
  })

  sendSuccess(res, { withdrawal }, 'Withdrawal approved')
})

export const rejectWithdrawal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.role || req.user.role !== 'ADMIN') {
    throw new AppError('Admin access required', 403)
  }

  const { withdrawalId } = req.params
  const { reason } = req.body

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
  })

  if (!withdrawal) {
    throw new AppError('Withdrawal not found', 404)
  }

  // Refund to wallet
  await prisma.wallet.update({
    where: { userId: withdrawal.userId },
    data: { balance: { increment: withdrawal.amount } },
  })

  const updated = await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
      approvedBy: req.user.id,
      approvedAt: new Date(),
    },
  })

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: req.user.id,
      action: 'REJECT_WITHDRAWAL',
      entity: 'Withdrawal',
      entityId: withdrawalId,
      description: `Rejected withdrawal with reason: ${reason}`,
    },
  })

  sendSuccess(res, { withdrawal: updated }, 'Withdrawal rejected')
})
