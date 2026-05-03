import { Router } from 'express'
import { getProducts, updateProduct } from '../controllers/productController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', requireAuth, getProducts)
router.put('/', requireAuth, updateProduct)


export default router