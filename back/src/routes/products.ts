import { Router } from 'express'
import { getProducts, updateProduct, deleteProduct } from '../controllers/productController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', requireAuth, getProducts)
router.put('/', requireAuth, updateProduct)
router.delete('/', requireAuth, deleteProduct)


export default router