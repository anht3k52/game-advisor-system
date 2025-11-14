import { validationResult } from 'express-validator';
import Comment from '../models/Comment.js';

export async function listComments(req, res, next) {
  try {
    const { targetType, targetId } = req.params;
    const includeHidden = req.query.includeHidden === 'true';
    const filter = { targetType, targetId };
    if (!includeHidden) {
      filter.isHidden = false;
    }
    const comments = await Comment.find(filter)
      .populate('user', 'fullName avatar role')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ comments });
  } catch (error) {
    next(error);
  }
}

export async function createComment(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { targetType, targetId, content } = req.body;
    const comment = await Comment.create({
      targetType,
      targetId,
      content,
      user: req.user._id,
      article: targetType === 'article' ? targetId : undefined
    });

    await comment.populate('user', 'fullName avatar role');

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    comment.content = req.body.content ?? comment.content;
    await comment.save();
    await comment.populate('user', 'fullName avatar role');

    res.json({ comment });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await comment.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function moderateComment(req, res, next) {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.isHidden = !!isHidden;
    await comment.save();
    await comment.populate('user', 'fullName avatar role');

    res.json({ comment });
  } catch (error) {
    next(error);
  }
}
