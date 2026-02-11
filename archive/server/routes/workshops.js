import express from 'express';
import { getAllWorkshops, getWorkshopById } from '../controllers/workshopController.js';

const router = express.Router();

router.get('/', getAllWorkshops);
router.get('/:id', getWorkshopById);

export default router;
