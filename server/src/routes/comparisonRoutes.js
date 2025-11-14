import { Router } from 'express';
import { body } from 'express-validator';
import { compareGames } from '../controllers/comparisonController.js';

const router = Router();

router.post('/', [body('ids').isArray({ min: 1, max: 3 })], compareGames);

export default router;
