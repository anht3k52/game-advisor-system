import { Router } from 'express';
import { getPopularGames, getGameDetails, searchGamesController, getGamesByIds } from '../controllers/gameController.js';

const router = Router();

router.get('/popular', getPopularGames);
router.get('/search', searchGamesController);
router.get('/batch', getGamesByIds);
router.get('/:id', getGameDetails);

export default router;
