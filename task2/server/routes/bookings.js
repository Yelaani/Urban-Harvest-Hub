import express from 'express';
import {
    getAllBookings,
    getBookingById,
    getUserBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    processPayment
} from '../controllers/bookingController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

// Booking validation schema
const bookingSchema = Joi.object({
    itemId: Joi.string().required(),
    itemType: Joi.string().valid('product', 'workshop', 'event').required(),
    userEmail: Joi.string().email().required(),
    userName: Joi.string().trim().min(1).required(),
    quantity: Joi.number().integer().min(1).default(1)
});

const validateBooking = (req, res, next) => {
    const { error, value } = bookingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: messages });
    }
    req.body = value;
    next();
};

// Public route - create booking (can be used by guests)
router.post('/', validateBooking, createBooking);
router.post('/process-payment', processPayment); // Added for cart-wide confirmation

// Protected routes - require authentication
router.get('/my-bookings', verifyToken, getUserBookings);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllBookings);
router.get('/:id', verifyToken, isAdmin, getBookingById);
router.put('/:id', verifyToken, isAdmin, updateBooking);
router.delete('/:id', verifyToken, isAdmin, deleteBooking);

export default router;
