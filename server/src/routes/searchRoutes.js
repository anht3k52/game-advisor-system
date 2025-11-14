import { Router } from 'express';
import { games } from '../data/games.js';

const router = Router();

router.get('/', (req, res) => {
  const {
    keyword = '',
    genre,
    platform,
    minRating,
    maxPrice,
    releaseYear,
    tag
  } = req.query;

  const lowerKeyword = keyword.toLowerCase();

  const filtered = games.filter((game) => {
    const matchKeyword =
      !keyword ||
      game.title.toLowerCase().includes(lowerKeyword) ||
      game.description.toLowerCase().includes(lowerKeyword);
    const matchGenre = !genre || game.genre === genre;
    const matchPlatform =
      !platform || game.platform.map((p) => p.toLowerCase()).includes(platform.toLowerCase());
    const matchRating = !minRating || game.rating >= Number(minRating);
    const matchPrice = !maxPrice || game.price <= Number(maxPrice);
    const matchRelease = !releaseYear || game.releaseYear === Number(releaseYear);
    const matchTag = !tag || game.tags.includes(tag);

    return (
      matchKeyword &&
      matchGenre &&
      matchPlatform &&
      matchRating &&
      matchPrice &&
      matchRelease &&
      matchTag
    );
  });

  res.json({ results: filtered });
});

export default router;
