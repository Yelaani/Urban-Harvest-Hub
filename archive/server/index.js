import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import workshopRoutes from './routes/workshops.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/events', eventRoutes);

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Urban Harvest Hub API is running' });
});

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // In production, use migrations. For dev, sync is okay but be careful with {force: true}
        // await sequelize.sync(); 

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
