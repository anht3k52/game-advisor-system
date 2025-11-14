import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { comments } from '../data/comments.js';
import { games } from '../data/games.js';
import { users } from '../data/users.js';

const router = Router();

router.get('/', (req, res) => {
  const { gameId } = req.query;

  const filtered = gameId ? comments.filter((comment) => comment.gameId === gameId) : comments;

  const enriched = filtered.map((comment) => {
    const user = users.find((u) => u.id === comment.userId);
    return {
      ...comment,
      userName: user ? user.name : 'Ẩn danh'
    };
  });

  res.json(enriched);
});

router.post('/', (req, res) => {
  const { gameId, userId, rating, content } = req.body;

  if (!gameId || !userId || !content) {
    return res.status(400).json({ error: 'gameId, userId và content là bắt buộc' });
  }

  const gameExists = games.some((game) => game.id === gameId);
  const userExists = users.some((user) => user.id === userId);

  if (!gameExists || !userExists) {
    return res.status(404).json({ error: 'Game hoặc người dùng không tồn tại' });
  }

  const newComment = {
    id: uuid(),
    gameId,
    userId,
    rating: rating ?? null,
    content,
    createdAt: new Date().toISOString()
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

router.put('/:id', (req, res) => {
  const comment = comments.find((c) => c.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment không tồn tại' });
  }
  Object.assign(comment, req.body, { updatedAt: new Date().toISOString() });
  res.json(comment);
});

router.delete('/:id', (req, res) => {
  const index = comments.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Comment không tồn tại' });
  }
  const [deleted] = comments.splice(index, 1);
  res.json(deleted);
});

export default router;
