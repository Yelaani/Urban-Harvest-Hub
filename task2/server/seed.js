import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import bcrypt from 'bcrypt';
import { sequelize } from './config/database.js';
import './models/relationships.js'; // Import relationships
import { Product } from './models/Product.js';
import { Workshop } from './models/Workshop.js';
import { Event } from './models/Event.js';
import { User } from './models/User.js';
import { Booking } from './models/Booking.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
    try {
        // Read inventory data
        const dataPath = path.join(__dirname, '../frontend/src/data/inventory.json');
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
            email: 'admin@urbanharvest.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });
        console.log('Seeded admin user.');

        // Create sample regular users for testing
        const userPassword = await bcrypt.hash('user123', 10);
        const createdUsers = await User.bulkCreate([
            {
                username: 'john_doe',
                email: 'john.doe@gmail.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'jane_smith',
                email: 'jane.smith@yahoo.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'bob_wilson',
                email: 'bob.wilson@outlook.com',
                password: userPassword,
                role: 'user',
                status: 'suspended'
            },
            {
                username: 'sarah_johnson',
                email: 'sarah.johnson@gmail.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'michael_chen',
                email: 'michael.chen@hotmail.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'emily_davis',
                email: 'emily.davis@gmail.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'david_brown',
                email: 'david.brown@yahoo.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'lisa_anderson',
                email: 'lisa.anderson@outlook.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'robert_taylor',
                email: 'robert.taylor@gmail.com',
                password: userPassword,
                role: 'user',
                status: 'active'
            },
            {
                username: 'maria_garcia',
                email: 'maria.garcia@yahoo.com',
                password: userPassword,
                role: 'user',
                status: 'suspended'
            }
        ]);
        console.log('Seeded sample users.');

        // Create some workshops in Kandy location for booking purposes
        const kandyWorkshops = await Workshop.bulkCreate([
            {
                id: 'wk-kandy-001',
                title: 'Urban Gardening in Kandy',
                description: 'Learn urban gardening techniques specifically for Kandy\'s climate and environment.',
                price: 50.00,
                category: 'workshops',
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
                date: '2026-04-15',
                location: 'Kandy Community Center',
                coordinates: { lat: 7.2906, lng: 80.6337 }
            },
            {
                id: 'wk-kandy-002',
                title: 'Composting Workshop - Kandy',
                description: 'Sustainable composting methods for Kandy residents.',
                price: 45.00,
                category: 'workshops',
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
                date: '2026-05-20',
                location: 'Kandy Botanical Gardens',
                coordinates: { lat: 7.2906, lng: 80.6337 }
            },
            {
                id: 'wk-kandy-003',
                title: 'Herb Growing in Kandy',
                description: 'Learn to grow medicinal and culinary herbs in Kandy\'s unique climate.',
                price: 55.00,
                category: 'workshops',
                image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=800',
                date: '2026-06-10',
                location: 'Kandy Urban Farm',
                coordinates: { lat: 7.2906, lng: 80.6337 }
            }
        ]);
        console.log(`Created ${kandyWorkshops.length} Kandy workshops.`);

        // Create bookings for users - focusing on Kandy workshops
        const bookings = [];
        
        // Get all users (including admin)
        const allUsers = await User.findAll();
        const regularUsers = allUsers.filter(u => u.role === 'user');
        
        // Create bookings for different users
        if (regularUsers.length > 0 && kandyWorkshops.length > 0) {
            // John Doe - 2 bookings
            if (regularUsers[0]) {
                bookings.push({
                    userId: regularUsers[0].id,
                    itemId: kandyWorkshops[0].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[0].email,
                    userName: regularUsers[0].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[0].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-01')
                });
                bookings.push({
                    userId: regularUsers[0].id,
                    itemId: kandyWorkshops[1].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[0].email,
                    userName: regularUsers[0].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[1].price,
                    status: 'pending',
                    bookingDate: new Date('2026-03-15')
                });
            }

            // Jane Smith - 1 booking
            if (regularUsers[1]) {
                bookings.push({
                    userId: regularUsers[1].id,
                    itemId: kandyWorkshops[0].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[1].email,
                    userName: regularUsers[1].username,
                    quantity: 2,
                    totalPrice: kandyWorkshops[0].price * 2,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-05')
                });
            }

            // Sarah Johnson - 2 bookings
            if (regularUsers[3]) {
                bookings.push({
                    userId: regularUsers[3].id,
                    itemId: kandyWorkshops[1].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[3].email,
                    userName: regularUsers[3].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[1].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-10')
                });
                bookings.push({
                    userId: regularUsers[3].id,
                    itemId: kandyWorkshops[2].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[3].email,
                    userName: regularUsers[3].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[2].price,
                    status: 'pending',
                    bookingDate: new Date('2026-03-20')
                });
            }

            // Michael Chen - 1 booking
            if (regularUsers[4]) {
                bookings.push({
                    userId: regularUsers[4].id,
                    itemId: kandyWorkshops[2].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[4].email,
                    userName: regularUsers[4].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[2].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-12')
                });
            }

            // Emily Davis - 1 booking
            if (regularUsers[5]) {
                bookings.push({
                    userId: regularUsers[5].id,
                    itemId: kandyWorkshops[0].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[5].email,
                    userName: regularUsers[5].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[0].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-08')
                });
            }

            // David Brown - 2 bookings
            if (regularUsers[6]) {
                bookings.push({
                    userId: regularUsers[6].id,
                    itemId: kandyWorkshops[1].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[6].email,
                    userName: regularUsers[6].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[1].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-18')
                });
                bookings.push({
                    userId: regularUsers[6].id,
                    itemId: kandyWorkshops[2].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[6].email,
                    userName: regularUsers[6].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[2].price,
                    status: 'pending',
                    bookingDate: new Date('2026-03-25')
                });
            }

            // Lisa Anderson - 1 booking
            if (regularUsers[7]) {
                bookings.push({
                    userId: regularUsers[7].id,
                    itemId: kandyWorkshops[0].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[7].email,
                    userName: regularUsers[7].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[0].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-22')
                });
            }

            // Robert Taylor - 1 booking
            if (regularUsers[8]) {
                bookings.push({
                    userId: regularUsers[8].id,
                    itemId: kandyWorkshops[1].id,
                    itemType: 'workshop',
                    userEmail: regularUsers[8].email,
                    userName: regularUsers[8].username,
                    quantity: 1,
                    totalPrice: kandyWorkshops[1].price,
                    status: 'confirmed',
                    bookingDate: new Date('2026-03-14')
                });
            }

            await Booking.bulkCreate(bookings);
            console.log(`Created ${bookings.length} bookings for users.`);
        }

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error; // Re-throw so caller can handle it
    }
};

// Only run directly if this file is executed (not imported)
// Check if this is the main module by comparing the resolved file path
const isMainModule = pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMainModule) {
    seedDatabase().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });
}
