import { fetchPopularGames, fetchGameDetails, searchGames, fetchGamesByIds } from '../services/rawgService.js';
import Comment from '../models/Comment.js';
import Rating from '../models/Rating.js';

export async function getPopularGames(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 20;
    const data = await fetchPopularGames({ page, pageSize });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getGameDetails(req, res, next) {
  try {
    const { id } = req.params;
    const [game, comments, ratings] = await Promise.all([
      fetchGameDetails(id),
      Comment.find({ targetType: 'game', targetId: id, isHidden: false })
        .populate('user', 'fullName avatar role')
        .sort({ createdAt: -1 })
        .lean(),
      Rating.aggregate([
        { $match: { rawgGameId: id } },
        {
          $group: {
            _id: '$rawgGameId',
            avgScore: { $avg: '$score' },
            ratings: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      game,
      comments,
      rating: ratings[0] || { _id: id, avgScore: 0, ratings: 0 }
    });
  } catch (error) {
    next(error);
  }
}

export async function searchGamesController(req, res, next) {
  try {
    const data = await searchGames(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getGamesByIds(req, res, next) {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (!ids.length) {
      return res.status(400).json({ error: 'ids parameter is required' });
    }
    const games = await fetchGamesByIds(ids.slice(0, 20));
    res.json({ results: games });
  } catch (error) {
    next(error);
  }
}
