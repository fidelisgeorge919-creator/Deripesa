import { Router } from 'express'
import * as walletController from '../controllers/walletController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/balance', walletController.getWallet)
router.get('/transactions', walletController.getTransactions)
router.get('/earnings', walletController.getEarnings)
router.get('/deposits', walletController.getDepositHistory)
router.get('/withdrawals', walletController.getWithdrawalHistory)

export default router
