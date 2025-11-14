import { validationResult } from 'express-validator';
import slugify from 'slugify';
import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { fetchGameDetails } from '../services/rawgService.js';

const DEFAULT_LIMIT = 10;

export async function createArticle(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, slug, thumbnailUrl, shortDescription, content, relatedGameId, tags, publishedAt } = req.body;
    const generatedSlug = slug
      ? slug.toLowerCase()
      : slugify(title, { lower: true, strict: true });

    const existing = await Article.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const article = await Article.create({
      title,
      slug: generatedSlug,
      thumbnailUrl,
      shortDescription,
      content,
      relatedGameId,
      author: req.user._id,
      tags,
      publishedAt: publishedAt || new Date()
    });

    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
}

export async function getArticles(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.q) {
      filter.$or = [
        { title: new RegExp(req.query.q, 'i') },
        { shortDescription: new RegExp(req.query.q, 'i') },
        { content: new RegExp(req.query.q, 'i') }
      ];
    }
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags) ? req.query.tags : String(req.query.tags).split(',');
      filter.tags = { $in: tags.map((tag) => tag.trim()).filter(Boolean) };
    }

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'fullName avatar role')
        .lean(),
      Article.countDocuments(filter)
    ]);

    res.json({
      data: articles,
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

export async function getArticleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug })
      .populate('author', 'fullName avatar role')
      .lean();

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    let relatedGame = null;
    if (article.relatedGameId) {
      try {
        relatedGame = await fetchGameDetails(article.relatedGameId);
      } catch (error) {
        console.warn('Failed to load related game', error.message);
      }
    }

    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { tags: { $in: article.tags || [] } },
        { relatedGameId: article.relatedGameId }
      ]
    })
      .limit(6)
      .select('title slug thumbnailUrl shortDescription publishedAt tags relatedGameId')
      .lean();

    res.json({ article, relatedGame, relatedArticles });
  } catch (error) {
    next(error);
  }
}

export async function updateArticle(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, slug, thumbnailUrl, shortDescription, content, relatedGameId, tags, publishedAt } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (title) article.title = title;
    if (slug) article.slug = slug.toLowerCase();
    if (thumbnailUrl !== undefined) article.thumbnailUrl = thumbnailUrl;
    if (shortDescription !== undefined) article.shortDescription = shortDescription;
    if (content !== undefined) article.content = content;
    if (relatedGameId !== undefined) article.relatedGameId = relatedGameId;
    if (tags !== undefined) article.tags = tags;
    if (publishedAt !== undefined) article.publishedAt = publishedAt;

    await article.save();

    res.json({ article });
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await Comment.deleteMany({ targetType: 'article', targetId: article._id.toString() });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function recordArticleRead(req, res, next) {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.readArticlesHistory.findIndex((item) => item.article?.toString() === articleId);

    if (existingIndex !== -1) {
      user.readArticlesHistory[existingIndex].readAt = new Date();
    } else {
      user.readArticlesHistory.push({ article: articleId, readAt: new Date() });
    }

    await user.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
