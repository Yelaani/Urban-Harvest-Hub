// Define model relationships
import { User } from './User.js';
import { Booking } from './Booking.js';
import { Product } from './Product.js';
import { Workshop } from './Workshop.js';
import { Event } from './Event.js';

// User has many Bookings
User.hasMany(Booking, {
    foreignKey: 'userId',
    as: 'bookings'
});

// Booking belongs to User
Booking.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Note: Since Booking.itemId can reference Product, Workshop, or Event,
// we use a polymorphic relationship pattern. Sequelize doesn't natively support
// polymorphic associations, so we handle the relationship in the application logic.
// The itemType field indicates which model the itemId references.

export { User, Booking, Product, Workshop, Event };
