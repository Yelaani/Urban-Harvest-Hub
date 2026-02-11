import { Workshop } from '../models/Workshop.js';
import { createController } from './factory.js';

const genericController = createController(Workshop);

export const getAllWorkshops = genericController.getAll;
export const getWorkshopById = genericController.getById;
// export const createWorkshop = genericController.create;
export const updateWorkshop = genericController.update;
export const deleteWorkshop = genericController.delete;

import { sendBroadcast } from '../routes/pushRoutes.js';

export const createWorkshop = async (req, res) => {
    try {
        const item = await Workshop.create(req.body);
        res.status(201).json(item);
        sendBroadcast('New Workshop Available!', `Join us for ${item.title}`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};