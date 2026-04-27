import { Router } from 'express'
import { getProducts } from '../controllers/productController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', getProducts)

export default router