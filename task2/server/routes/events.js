import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateEvent } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected admin routes
router.post('/', verifyToken, isAdmin, validateEvent, createEvent);
router.put('/:id', verifyToken, isAdmin, validateEvent, updateEvent);
router.delete('/:id', verifyToken, isAdmin, deleteEvent);

export default router;
