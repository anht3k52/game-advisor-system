import { validationResult } from 'express-validator';
import Rating from '../models/Rating.js';

export async function upsertRating(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rawgGameId, score } = req.body;
    const rating = await Rating.findOneAndUpdate(
      { user: req.user._id, rawgGameId },
      { score },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ rating });
  } catch (error) {
    next(error);
  }
}

export async function getGameRating(req, res, next) {
  try {
    const { rawgGameId } = req.params;
    const ratings = await Rating.aggregate([
      { $match: { rawgGameId } },
      {
        $group: {
          _id: '$rawgGameId',
          avgScore: { $avg: '$score' },
          ratings: { $sum: 1 }
        }
      }
    ]);

    res.json(ratings[0] || { _id: rawgGameId, avgScore: 0, ratings: 0 });
  } catch (error) {
    next(error);
  }
}
