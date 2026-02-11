import { Product } from '../models/Product.js';
import { createController } from './factory.js';

const genericController = createController(Product);

export const getAllProducts = genericController.getAll;
export const getProductById = genericController.getById;
