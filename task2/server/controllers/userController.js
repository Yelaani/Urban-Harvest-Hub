import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import { Workshop } from '../models/Workshop.js';
import { Op } from 'sequelize';

// Get all users with booking counts and search support
export const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;

        // Build where clause for search
        const whereClause = search ? {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ]
        } : {};

        const users = await User.findAll({
            where: whereClause,
            attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        // Get booking counts for each user
        const usersWithBookings = await Promise.all(
            users.map(async (user) => {
                const bookingCount = await Booking.count({
                    where: {
                        userId: user.id,
                        status: { [Op.in]: ['pending', 'confirmed'] }
                    }
                });

                return {
                    ...user.toJSON(),
                    activeBookings: bookingCount
                };
            })
        );

        res.json(usersWithBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bookings for a specific user (workshop bookings in Kandy only)
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.params;

        const bookings = await Booking.findAll({
            where: {
                userId: id,
                itemType: 'workshop'
            },
            order: [['bookingDate', 'DESC']]
        });

        // Fetch workshop details and filter by Kandy location
        const bookingsWithDetails = await Promise.all(
            bookings.map(async (booking) => {
                const workshop = await Workshop.findByPk(booking.itemId);

                // Only include if workshop exists and is in Kandy
                if (workshop && workshop.location && workshop.location.toLowerCase().includes('kandy')) {
                    return {
                        id: booking.id,
                        bookingDate: booking.bookingDate,
                        status: booking.status,
                        quantity: booking.quantity,
                        totalPrice: booking.totalPrice,
                        workshop: {
                            id: workshop.id,
                            title: workshop.title,
                            date: workshop.date,
                            location: workshop.location
                        }
                    };
                }
                return null;
            })
        );

        // Filter out null values (non-Kandy workshops)
        const kandyBookings = bookingsWithDetails.filter(b => b !== null);

        res.json(kandyBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.userId; // From auth middleware

        // Prevent self-deletion
        if (id === requestingUserId) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user status (suspend/activate)
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be "active" or "suspended"' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ status });
        res.json({
            message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role (promote to admin)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ role });
        res.json({
            message: `User promoted to ${role} successfully`,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
