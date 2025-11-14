import { Router } from 'express';
import { users } from '../data/users.js';
import { recommendByPreferences, recommendSimilarGames } from '../services/recommendationService.js';

const router = Router();

router.post('/', (req, res) => {
  const { userId, preferences, limit } = req.body;

  let preferenceSource = preferences;
  if (!preferenceSource && userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    preferenceSource = user.preferences;
  }

  if (!preferenceSource) {
    return res.status(400).json({ error: 'Preferences are required' });
  }

  const results = recommendByPreferences(preferenceSource, { limit });
  res.json({ recommendations: results });
});

router.get('/similar/:gameId', (req, res) => {
  const { gameId } = req.params;
  const { limit } = req.query;
  const results = recommendSimilarGames(gameId, {
    limit: limit ? Number(limit) : undefined
  });
  res.json({ recommendations: results });
});

export default router;
