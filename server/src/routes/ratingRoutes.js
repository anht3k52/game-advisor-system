import { Router } from 'express';
import { body } from 'express-validator';
import { upsertRating, getGameRating } from '../controllers/ratingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  [body('rawgGameId').notEmpty(), body('score').isInt({ min: 1, max: 5 })],
  upsertRating
);

router.get('/:rawgGameId', getGameRating);

export default router;
