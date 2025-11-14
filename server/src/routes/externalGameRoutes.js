import { Router } from 'express';
import { getExternalGameDetails, searchExternalGames } from '../services/externalGameApi.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const { query = '', page = 1, pageSize } = req.query;
    const safeQuery =
      typeof query === 'string'
        ? query
        : Array.isArray(query)
        ? query.filter(Boolean).join(' ')
        : '';
    const parsedPage = Number(page);
    const parsedSize = Number(pageSize);

    const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const safeSize = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : undefined;

    const results = await searchExternalGames(safeQuery, safePage, safeSize);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const details = await getExternalGameDetails(req.params.id);
    res.json(details);
  } catch (error) {
    next(error);
  }
});

export default router;
