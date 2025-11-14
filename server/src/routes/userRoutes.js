import { Router } from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  getUserFavorites,
  addFavoriteGame,
  removeFavoriteGame
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.put(
  '/me',
  authMiddleware,
  [body('fullName').optional().notEmpty()],
  updateProfile
);

router.get('/me/favorites', authMiddleware, getUserFavorites);
router.post('/me/favorites', authMiddleware, addFavoriteGame);
router.delete('/me/favorites/:rawgGameId', authMiddleware, removeFavoriteGame);

router.get('/:userId/favorites', authMiddleware, getUserFavorites);

export default router;
