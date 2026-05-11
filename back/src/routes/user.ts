import { Router } from 'express'
import { getAllUsers, getUserIsAdmin, updateUserRole, updateUserStatus, deleteUser } from '../controllers/userController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/all', requireAuth, getAllUsers)
router.get('/is-admin', requireAuth, getUserIsAdmin)
router.put('/update-role', requireAuth, updateUserRole)
router.put('/update-status', requireAuth, updateUserStatus)
router.delete('/delete/userId', requireAuth, deleteUser)
export default router