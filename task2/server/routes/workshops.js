import express from 'express';
import { getAllWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop } from '../controllers/workshopController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateWorkshop } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllWorkshops);
router.get('/:id', getWorkshopById);

// Protected admin routes
router.post('/', verifyToken, isAdmin, validateWorkshop, createWorkshop);
router.put('/:id', verifyToken, isAdmin, validateWorkshop, updateWorkshop);
router.delete('/:id', verifyToken, isAdmin, deleteWorkshop);

export default router;
