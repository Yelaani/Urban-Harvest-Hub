import { Event } from '../models/Event.js';
import { createController } from './factory.js';

const genericController = createController(Event);

export const getAllEvents = genericController.getAll;
export const getEventById = genericController.getById;
// export const createEvent = genericController.create;
export const updateEvent = genericController.update;
export const deleteEvent = genericController.delete;

import { sendBroadcast } from '../routes/pushRoutes.js';

export const createEvent = async (req, res) => {
    try {
        const item = await Event.create(req.body);
        res.status(201).json(item);
        sendBroadcast('Upcoming Event!', `Don't miss ${item.title}`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};