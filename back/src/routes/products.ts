import { Router } from 'express'
import { getProducts, addProduct, updateProduct, updateProductViews, deleteProduct } from '../controllers/productController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', requireAuth, getProducts)
router.post('/', requireAuth, addProduct)
router.put('/', requireAuth, updateProduct)
router.patch('/views', requireAuth, updateProductViews)
router.delete('/:productId', requireAuth, deleteProduct)


export default router