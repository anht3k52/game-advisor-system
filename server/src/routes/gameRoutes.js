import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { games } from '../data/games.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(games);
});

router.get('/:id', (req, res) => {
  const game = games.find((g) => g.id === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

router.post('/', (req, res) => {
  const { title, genre, platform = [], price = 0 } = req.body;
  if (!title || !genre) {
    return res.status(400).json({ error: 'Title and genre are required' });
  }

  const newGame = {
    id: uuid(),
    rating: 0,
    tags: [],
    releaseYear: new Date().getFullYear(),
    playModes: [],
    description: '',
    ...req.body,
    platform
  };
  games.push(newGame);
  res.status(201).json(newGame);
});

router.put('/:id', (req, res) => {
  const game = games.find((g) => g.id === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  Object.assign(game, req.body);
  res.json(game);
});

router.delete('/:id', (req, res) => {
  const index = games.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Game not found' });
  }
  const [deleted] = games.splice(index, 1);
  res.json(deleted);
});

export default router;
