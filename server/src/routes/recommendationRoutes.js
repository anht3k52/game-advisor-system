import { Router } from 'express';
import { getRecommendations, getAnonymousRecommendations } from '../controllers/recommendationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/games/guest', getAnonymousRecommendations);
router.get('/games/:userId', authMiddleware, getRecommendations);

export default router;
