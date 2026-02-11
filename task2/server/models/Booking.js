import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Can reference Product.id, Workshop.id, or Event.id'
    },
    itemType: {
        type: DataTypes.ENUM('product', 'workshop', 'event'),
        allowNull: false,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});
