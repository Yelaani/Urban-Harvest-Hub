import { Product } from '../models/Product.js';
import { createController } from './factory.js';

const genericController = createController(Product);

export const getAllProducts = genericController.getAll;
export const getProductById = genericController.getById;
// export const createProduct = genericController.create;
export const updateProduct = genericController.update;
export const deleteProduct = genericController.delete;

import { sendBroadcast } from '../routes/pushRoutes.js';

export const createProduct = async (req, res) => {
    try {
        const item = await Product.create(req.body);
        res.status(201).json(item);
        sendBroadcast('New Product Arrived!', `Check out our new ${item.title}`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};