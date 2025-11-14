import User from '../models/User.js';
import Rating from '../models/Rating.js';
import { fetchGamesByIds, fetchGamesByGenres, fetchPopularGames } from '../services/rawgService.js';

export async function getRecommendations(req, res, next) {
  try {
    const { userId } = req.params;
    if (req.user && req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(userId).populate('readArticlesHistory.article').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favoriteIds = user.favoriteGames || [];

    const ratedGames = await Rating.find({ user: user._id }).lean();
    const ratedIds = ratedGames.map((rating) => rating.rawgGameId);

    const readGameIds = user.readArticlesHistory
      .map((item) => item.article?.relatedGameId)
      .filter(Boolean);

    const seedIds = Array.from(new Set([...favoriteIds, ...ratedIds, ...readGameIds])).slice(0, 10);

    if (!seedIds.length) {
      const popular = await fetchPopularGames({ pageSize: 10 });
      return res.json({ results: popular.results });
    }

    const seedDetails = await fetchGamesByIds(seedIds);
    const genreCounts = new Map();

    seedDetails.forEach((game) => {
      if (!game) return;
      (game.genres || []).forEach((genre) => {
        genreCounts.set(genre.slug, {
          slug: genre.slug,
          name: genre.name,
          count: (genreCounts.get(genre.slug)?.count || 0) + 1
        });
      });
    });

    const topGenres = Array.from(genreCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const genreSlugs = topGenres.map((genre) => genre.slug);

    const recommendations = await fetchGamesByGenres(genreSlugs, { pageSize: 20 });

    const excludedIds = new Set(seedIds);
    const filtered = (recommendations.results || recommendations)
      .filter((game) => !excludedIds.has(String(game.id)));

    res.json({
      results: filtered.slice(0, 10),
      genres: topGenres
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnonymousRecommendations(_req, res, next) {
  try {
    const popular = await fetchPopularGames({ pageSize: 10 });
    res.json({ results: popular.results });
  } catch (error) {
    next(error);
  }
}
