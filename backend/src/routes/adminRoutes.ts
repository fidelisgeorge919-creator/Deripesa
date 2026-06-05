import { Router } from 'express'
import * as adminController from '../controllers/adminController'
import { authMiddleware, adminMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/dashboard', adminController.getDashboard)
router.get('/users', adminController.getUsers)
router.post('/users/:userId/suspend', adminController.suspendUser)
router.post('/users/:userId/activate', adminController.activateUser)
router.get('/withdrawals/pending', adminController.getPendingWithdrawals)
router.post('/withdrawals/:withdrawalId/approve', adminController.approveWithdrawal)
router.post('/withdrawals/:withdrawalId/reject', adminController.rejectWithdrawal)

export default router
