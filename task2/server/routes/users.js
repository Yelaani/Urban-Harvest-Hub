import express from 'express';
import {
    getAllUsers,
    getUserBookings,
    deleteUser,
    updateUserStatus,
    updateUserRole
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id/bookings', verifyToken, isAdmin, getUserBookings);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.patch('/:id/status', verifyToken, isAdmin, updateUserStatus);
router.patch('/:id/role', verifyToken, isAdmin, updateUserRole);

export default router;
