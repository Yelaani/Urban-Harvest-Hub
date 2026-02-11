import { Event } from '../models/Event.js';
import { createController } from './factory.js';

const genericController = createController(Event);

export const getAllEvents = genericController.getAll;
export const getEventById = genericController.getById;
