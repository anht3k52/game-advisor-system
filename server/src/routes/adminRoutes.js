import { Router } from 'express';
import { users } from '../data/users.js';
import { games } from '../data/games.js';
import { comments } from '../data/comments.js';

const router = Router();

router.get('/metrics', (_req, res) => {
  const avgRating =
    comments.reduce((acc, comment) => acc + (comment.rating || 0), 0) /
    Math.max(comments.length, 1);

  res.json({
    totalUsers: users.length,
    totalGames: games.length,
    totalComments: comments.length,
    averageRating: Number(avgRating.toFixed(2)),
    latestComments: comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  });
});

router.post('/broadcast', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  res.json({ status: 'sent', message });
});

export default router;
