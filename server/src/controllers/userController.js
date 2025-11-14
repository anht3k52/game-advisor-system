import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import Comment from '../models/Comment.js';
import { fetchGamesByIds } from '../services/rawgService.js';

export async function updateProfile(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, avatar, favoriteGames } = req.body;
    if (fullName !== undefined) req.user.fullName = fullName;
    if (avatar !== undefined) req.user.avatar = avatar;
    if (Array.isArray(favoriteGames)) req.user.favoriteGames = favoriteGames;

    await req.user.save();

    res.json({ user: req.user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function getUserFavorites(req, res, next) {
  try {
    const targetUserId = req.params.userId || req.user._id;
    if (req.params.userId && req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(targetUserId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const games = await fetchGamesByIds(user.favoriteGames.slice(0, 50));
    res.json({ favorites: games });
  } catch (error) {
    next(error);
  }
}

export async function addFavoriteGame(req, res, next) {
  try {
    const { rawgGameId } = req.body;
    if (!rawgGameId) {
      return res.status(400).json({ error: 'rawgGameId is required' });
    }

    if (!req.user.favoriteGames.includes(rawgGameId)) {
      req.user.favoriteGames.push(rawgGameId);
      await req.user.save();
    }

    res.json({ favorites: req.user.favoriteGames });
  } catch (error) {
    next(error);
  }
}

export async function removeFavoriteGame(req, res, next) {
  try {
    const { rawgGameId } = req.params;
    req.user.favoriteGames = req.user.favoriteGames.filter((id) => id !== rawgGameId);
    await req.user.save();
    res.json({ favorites: req.user.favoriteGames });
  } catch (error) {
    next(error);
  }
}

export async function aggregateUserStats() {
  const [userCount, articleCount, commentCount, topFavorites, topRatings] = await Promise.all([
    User.countDocuments(),
    (await import('../models/Article.js')).default.countDocuments(),
    Comment.countDocuments({ isHidden: false }),
    User.aggregate([
      { $unwind: '$favoriteGames' },
      {
        $group: {
          _id: '$favoriteGames',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    Rating.aggregate([
      {
        $group: {
          _id: '$rawgGameId',
          avgScore: { $avg: '$score' },
          ratings: { $sum: 1 }
        }
      },
      { $sort: { avgScore: -1, ratings: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    userCount,
    articleCount,
    commentCount,
    topGames: {
      favorites: topFavorites,
      ratings: topRatings
    }
  };
}

export async function getUserStats(_req, res, next) {
  try {
    const stats = await aggregateUserStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.q;

    const filter = {};
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();
    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
}
