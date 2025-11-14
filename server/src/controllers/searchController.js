import Article from '../models/Article.js';
import { searchGames } from '../services/rawgService.js';

export async function advancedSearch(req, res, next) {
  try {
    const { q, type = 'all' } = req.query;
    const filters = { ...req.query };
    delete filters.q;
    delete filters.type;

    const response = { results: {} };

    if (type === 'game' || type === 'all') {
      const { tags, ...gameFilters } = filters;
      const gameParams = {
        search: q,
        ...gameFilters
      };
      response.results.games = await searchGames(gameParams);
    }

    if (type === 'article' || type === 'all') {
      const articleFilter = {};
      if (q) {
        articleFilter.$or = [
          { title: new RegExp(q, 'i') },
          { shortDescription: new RegExp(q, 'i') },
          { content: new RegExp(q, 'i') }
        ];
      }
      if (filters.tags) {
        articleFilter.tags = { $in: filters.tags.split(',') };
      }
      const articles = await Article.find(articleFilter)
        .sort({ publishedAt: -1 })
        .limit(20)
        .populate('author', 'fullName avatar role')
        .lean();
      response.results.articles = articles;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}
