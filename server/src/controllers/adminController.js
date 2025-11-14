import Comment from '../models/Comment.js';
import Article from '../models/Article.js';
import { aggregateUserStats, listUsers, updateUserRole } from './userController.js';

export async function getDashboard(_req, res, next) {
  try {
    const [stats, recentArticles, recentComments] = await Promise.all([
      aggregateUserStats(),
      Article.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'fullName')
        .lean(),
      Comment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'fullName role')
        .lean()
    ]);

    res.json({ stats, recentArticles, recentComments });
  } catch (error) {
    next(error);
  }
}

export { listUsers, updateUserRole };
