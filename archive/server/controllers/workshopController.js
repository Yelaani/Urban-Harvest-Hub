import { Workshop } from '../models/Workshop.js';
import { createController } from './factory.js';

const genericController = createController(Workshop);

export const getAllWorkshops = genericController.getAll;
export const getWorkshopById = genericController.getById;
