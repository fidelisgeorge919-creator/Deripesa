import { Router } from 'express'
import * as taskController from '../controllers/taskController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/', taskController.getTasks)
router.get('/:id', taskController.getTaskById)

// Protected routes
router.use(authMiddleware)
router.post('/complete', taskController.completeTask)
router.get('/completed', taskController.getCompletedTasks)

export default router
