import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

// Import models to establish relationships
import './models/relationships.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import workshopRoutes from './routes/workshops.js';
import eventRoutes from './routes/events.js';
import bookingRoutes from './routes/bookings.js';
import pushRoutes from './routes/pushRoutes.js';
import userRoutes from './routes/users.js';
import webpush from 'web-push';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Web Push Configuration
// Keys generated via `npx web-push generate-vapid-keys`
// REQUIRED: Replace these with the actual keys from the command output
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(
        'mailto:urbanharvest@example.com',
        publicVapidKey,
        privateVapidKey
    );
} else {
    console.warn("VAPID Keys not found in .env. Push notifications will not work.");
}


// Middleware
// 1. PLACE THIS BEFORE ALL ROUTES
app.use(cors({
    origin: '*', // Allows any origin to access the API
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/users', userRoutes);

// Mirror routes without /api prefix for robustness
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/workshops', workshopRoutes);
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
app.use('/push', pushRoutes);
app.use('/users', userRoutes);

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Urban Harvest Hub API is running' });
});

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync database tables (without force to preserve data)
        await sequelize.sync();
        console.log('Database tables synced.');

        // Check if database is empty and seed if needed
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('Database empty, seeding initial data...');
            await seedDatabase();
            console.log('Database seeded successfully.');
        } else {
            console.log(`Database already contains ${userCount} user(s). Skipping seed.`);
        }

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
