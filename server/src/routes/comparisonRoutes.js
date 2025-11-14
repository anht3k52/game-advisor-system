import { Router } from 'express';
import { games } from '../data/games.js';

const router = Router();

router.post('/', (req, res) => {
  const { gameIds = [] } = req.body;

  if (!Array.isArray(gameIds) || gameIds.length < 2) {
    return res.status(400).json({ error: 'Provide at least two game IDs to compare' });
  }

  const selectedGames = gameIds
    .map((id) => games.find((game) => game.id === id))
    .filter(Boolean);

  if (selectedGames.length < 2) {
    return res.status(404).json({ error: 'Not enough games found for comparison' });
  }

  const comparison = selectedGames.map((game) => ({
    id: game.id,
    title: game.title,
    genre: game.genre,
    rating: game.rating,
    price: game.price,
    platform: game.platform,
    tags: game.tags,
    releaseYear: game.releaseYear
  }));

  res.json({ comparison });
});

export default router;
