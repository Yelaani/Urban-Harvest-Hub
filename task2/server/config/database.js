import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For SQLite, the storage file path
const storagePath = path.join(__dirname, '../../database.sqlite');

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false, // Set to console.log to see SQL queries
});
