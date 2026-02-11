import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Workshop = sequelize.define('Workshop', {
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
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'workshops',
    },
    image: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING, // Storing as ISO string as per JSON
    },
    location: {
        type: DataTypes.STRING,
    },
    coordinates: {
        type: DataTypes.JSON, // Supported by SQLite in Sequelize
    },
});
