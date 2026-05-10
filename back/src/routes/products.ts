import { Router } from 'express'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', requireAuth, getProducts)
router.post('/', requireAuth, addProduct)
router.put('/', requireAuth, updateProduct)
router.delete('/', requireAuth, deleteProduct)


export default router