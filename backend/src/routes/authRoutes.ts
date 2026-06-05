import { Router } from 'express'
import * as authController from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile)
router.put('/profile', authMiddleware, authController.updateProfile)

export default router
