import { fetchGamesByIds } from '../services/rawgService.js';

export async function compareGames(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length || ids.length > 3) {
      return res.status(400).json({ error: 'ids must be an array with 1-3 game IDs' });
    }

    const games = await fetchGamesByIds(ids);
    const comparison = games.map((game) => ({
      id: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      ratings_count: game.ratings_count,
      metacritic: game.metacritic,
      genres: game.genres,
      platforms: game.platforms,
      background_image: game.background_image,
      website: game.website,
      developers: game.developers,
      publishers: game.publishers
    }));

    res.json({ comparison });
  } catch (error) {
    next(error);
  }
}
