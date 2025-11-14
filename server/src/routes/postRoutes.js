import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { posts } from '../data/posts.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (_req, res) => {
  const sorted = posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

router.get('/:id', (req, res) => {
  const post = posts.find((item) => item.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Bài viết không tồn tại.' });
  }

  res.json(post);
});

router.post('/', requireAdmin, (req, res) => {
  const { title, summary, content, tags = [], coverUrl } = req.body;

  if (!title || !summary || !content) {
    return res.status(400).json({ error: 'Tiêu đề, tóm tắt và nội dung là bắt buộc.' });
  }

  const post = {
    id: uuid(),
    title,
    summary,
    content,
    tags,
    coverUrl: coverUrl || null,
    authorId: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(post);

  res.status(201).json(post);
});

router.put('/:id', requireAdmin, (req, res) => {
  const post = posts.find((item) => item.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Bài viết không tồn tại.' });
  }

  const { title, summary, content, tags, coverUrl } = req.body;

  if (title !== undefined) post.title = title;
  if (summary !== undefined) post.summary = summary;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) post.tags = tags;
  if (coverUrl !== undefined) post.coverUrl = coverUrl;
  post.updatedAt = new Date().toISOString();

  res.json(post);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const index = posts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Bài viết không tồn tại.' });
  }

  const [deleted] = posts.splice(index, 1);
  res.json(deleted);
});

export default router;
