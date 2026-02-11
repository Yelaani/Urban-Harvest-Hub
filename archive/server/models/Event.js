import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'events',
    },
    image: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    coordinates: {
        type: DataTypes.JSON,
    },
});
