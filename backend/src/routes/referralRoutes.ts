import { Router } from 'express'
import * as referralController from '../controllers/referralController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/my-referrals', referralController.getReferrals)
router.get('/stats', referralController.getReferralStats)
router.get('/link', referralController.getReferralLink)
router.get('/leaderboard', referralController.getLeaderboard)
router.post('/claim-reward', referralController.claimReferralReward)

export default router
