import { Router } from 'express'
import { getUserIsAdmin } from '../controllers/userController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/is-admin', requireAuth, getUserIsAdmin)


export default router