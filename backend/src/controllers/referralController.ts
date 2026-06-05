import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, asyncHandler, sendSuccess } from '../utils/errors'

const prisma = new PrismaClient()

export const getReferrals = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { page = 1, limit = 20 } = req.query

  const skip = (Number(page) - 1) * Number(limit)

  const referrals = await prisma.user.findMany({
    where: { referredById: req.user.id },
    skip,
    take: Number(limit),
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      referralCode: true,
      createdAt: true,
    },
  })

  const total = await prisma.user.count({
    where: { referredById: req.user.id },
  })

  sendSuccess(res, {
    referrals,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  })
})

export const getReferralStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const stats = await prisma.referralStat.findUnique({
    where: { userId: req.user.id },
  })

  if (!stats) {
    throw new AppError('Referral stats not found', 404)
  }

  // Get level-wise referral earnings
  const level1Earnings = await prisma.transaction.aggregate({
    where: {
      userId: req.user.id,
      type: 'REFERRAL_BONUS',
      status: 'COMPLETED',
    },
    _sum: { amount: true },
  })

  sendSuccess(res, {
    ...stats,
    totalCommissionEarned: level1Earnings._sum.amount || 0,
  })
})

export const getReferralLink = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const referralLink = `${baseUrl}/register?ref=${user.referralCode}`

  sendSuccess(res, {
    referralCode: user.referralCode,
    referralLink,
  })
})

export const getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 20 } = req.query

  const leaderboard = await prisma.referralStat.findMany({
    take: Number(limit),
    orderBy: { totalCommission: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  })

  sendSuccess(res, { leaderboard })
})

export const claimReferralReward = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  // Find unclaimed rewards
  const rewards = await prisma.reward.findMany({
    where: {
      userId: req.user.id,
      claimed: false,
      type: 'REFERRAL',
    },
  })

  if (rewards.length === 0) {
    throw new AppError('No unclaimed rewards', 404)
  }

  const totalReward = rewards.reduce((sum, r) => sum + r.amount, 0)

  // Update wallet
  await prisma.wallet.update({
    where: { userId: req.user.id },
    data: {
      balance: { increment: totalReward },
      earnings: { increment: totalReward },
    },
  })

  // Mark rewards as claimed
  await prisma.reward.updateMany({
    where: {
      id: { in: rewards.map(r => r.id) },
    },
    data: {
      claimed: true,
      claimedAt: new Date(),
    },
  })

  // Create transaction
  await prisma.transaction.create({
    data: {
      userId: req.user.id,
      type: 'REFERRAL_BONUS',
      amount: totalReward,
      description: 'Referral rewards claimed',
      status: 'COMPLETED',
    },
  })

  sendSuccess(res, {
    amount: totalReward,
    rewardsCount: rewards.length,
  }, 'Rewards claimed successfully')
})
