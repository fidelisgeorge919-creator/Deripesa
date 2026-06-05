import { Router } from 'express'
import * as paymentController from '../controllers/paymentController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.post('/deposit', paymentController.initiateDeposit)
router.post('/verify-deposit', paymentController.verifyDeposit)
router.post('/withdrawal', paymentController.initiateWithdrawal)

export default router
