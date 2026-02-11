import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { sequelize } from './config/database.js';
import { Product } from './models/Product.js';
import { Workshop } from './models/Workshop.js';
import { Event } from './models/Event.js';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        // Read inventory data
        const dataPath = path.join(__dirname, '../src/data/inventory.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const inventory = JSON.parse(rawData);

        // Sync database
        await sequelize.sync({ force: true });
        console.log('Database synced (force: true).');

        // Filter data
        const products = inventory.filter(item => item.category === 'products');
        const workshops = inventory.filter(item => item.category === 'workshops');
        const events = inventory.filter(item => item.category === 'events');

        // Bulk create
        await Product.bulkCreate(products);
        console.log(`Seeded ${products.length} products.`);

        await Workshop.bulkCreate(workshops);
        console.log(`Seeded ${workshops.length} workshops.`);

        await Event.bulkCreate(events);
        console.log(`Seeded ${events.length} events.`);

        // Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Seeded admin user.');

        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
