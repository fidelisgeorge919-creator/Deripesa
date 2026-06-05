import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { hashPassword, comparePassword, generateToken, generateReferralCode } from '../utils/auth'
import { AppError, asyncHandler, sendSuccess, sendError } from '../utils/errors'

const prisma = new PrismaClient()

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, firstName, lastName, referralCode } = req.body

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    throw new AppError('Missing required fields', 400)
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new AppError('User already exists', 409)
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Find referrer if referral code provided
  let referredById: string | undefined
  if (referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    })
    if (referrer) {
      referredById = referrer.id
    }
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username: email.split('@')[0],
      referralCode: generateReferralCode(email),
      referredById,
    },
  })

  // Create wallet
  await prisma.wallet.create({
    data: {
      userId: user.id,
    },
  })

  // Create referral stats
  await prisma.referralStat.create({
    data: {
      userId: user.id,
    },
  })

  // Update referrer's stats
  if (referredById) {
    await prisma.referralStat.update({
      where: { userId: referredById },
      data: { totalReferrals: { increment: 1 }, level1Referrals: { increment: 1 } },
    })
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  sendSuccess(
    res,
    {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCode: user.referralCode,
      },
      token,
    },
    'User registered successfully',
    201
  )
})

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Email and password required', 400)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  const isPasswordValid = await comparePassword(password, user.password)
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401)
  }

  if (user.isSuspended) {
    throw new AppError('Account suspended', 403)
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), loginAttempts: 0 },
  })

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  sendSuccess(
    res,
    {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        referralCode: user.referralCode,
      },
      token,
    },
    'Login successful'
  )
})

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      wallet: true,
      referralStats: true,
    },
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  sendSuccess(res, {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    referralCode: user.referralCode,
    role: user.role,
    emailVerified: user.emailVerified,
    wallet: user.wallet,
    referralStats: user.referralStats,
    createdAt: user.createdAt,
  })
})

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401)
  }

  const { firstName, lastName, bio, avatar } = req.body

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(bio && { bio }),
      ...(avatar && { avatar }),
    },
  })

  sendSuccess(res, { user }, 'Profile updated successfully')
})
