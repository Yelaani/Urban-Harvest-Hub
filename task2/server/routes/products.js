import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', verifyToken, isAdmin, validateProduct, createProduct);
router.put('/:id', verifyToken, isAdmin, validateProduct, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
