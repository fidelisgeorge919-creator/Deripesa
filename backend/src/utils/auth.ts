import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { randomBytes } from 'crypto'

export interface JWTPayload {
  id: string
  email: string
  role: string
}

// Generate JWT token
export const generateToken = (payload: JWTPayload, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn })
}

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

// Compare password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash)
}

// Generate random token
export const generateRandomToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex')
}

// Generate referral code
export const generateReferralCode = (userId: string): string => {
  const hash = randomBytes(4).toString('hex').toUpperCase()
  return `REF${userId.substring(0, 4).toUpperCase()}${hash}`
}
