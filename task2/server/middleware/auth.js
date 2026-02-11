import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if user is suspended
        try {
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            if (user.status === 'suspended') {
                return res.status(403).json({ message: 'Account suspended. Please contact administrator.' });
            }

            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error verifying user status' });
        }
    });
};

export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
    next();
};
