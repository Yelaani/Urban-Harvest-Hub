import { Booking } from '../models/Booking.js';
import { Product } from '../models/Product.js';
import { Workshop } from '../models/Workshop.js';
import { Event } from '../models/Event.js';

// Helper to get item by type and id
const getItemById = async (itemType, itemId) => {
    switch (itemType) {
        case 'product':
            return await Product.findByPk(itemId);
        case 'workshop':
            return await Workshop.findByPk(itemId);
        case 'event':
            return await Event.findByPk(itemId);
        default:
            return null;
    }
};

// Helper to enrich bookings with item details
const enrichBookings = async (bookings) => {
    return await Promise.all(
        bookings.map(async (booking) => {
            const item = await getItemById(booking.itemType, booking.itemId);

            return {
                id: booking.id,
                itemId: booking.itemId,
                itemType: booking.itemType,
                quantity: booking.quantity,
                totalPrice: booking.totalPrice,
                status: booking.status,
                bookingDate: booking.bookingDate,
                userEmail: booking.userEmail,
                userName: booking.userName,
                item: item ? {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    date: item.date || null,
                    location: item.location || null,
                    availability: item.availability || null
                } : null
            };
        })
    );
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            order: [['bookingDate', 'DESC']]
        });
        const enriched = await enrichBookings(bookings);
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const bookings = await Booking.findAll({
            where: { userId },
            order: [['bookingDate', 'DESC']]
        });

        const enriched = await enrichBookings(bookings);
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { itemId, itemType, userEmail, userName, quantity = 1 } = req.body;

        // Validate item exists
        const item = await getItemById(itemType, itemId);
        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }

        // Calculate total price
        const totalPrice = item.price * quantity;

        // Create booking
        const booking = await Booking.create({
            userId: req.userId || null, // Optional: can be null for guest bookings
            itemId,
            itemType,
            userEmail,
            userName,
            quantity,
            totalPrice,
            status: 'pending'
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Only allow updating status for now
        const { status } = req.body;
        if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
            await booking.update({ status });
            res.json(booking);
        } else {
            res.status(400).json({ message: 'Invalid status' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        await booking.destroy();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
