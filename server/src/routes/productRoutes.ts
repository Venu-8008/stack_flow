import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => { getProducts(req, res).catch(next); });
router.post('/', (req, res, next) => { createProduct(req, res).catch(next); });
router.put('/:id', (req, res, next) => { updateProduct(req, res).catch(next); });
router.delete('/:id', (req, res, next) => { deleteProduct(req, res).catch(next); });

export default router;
