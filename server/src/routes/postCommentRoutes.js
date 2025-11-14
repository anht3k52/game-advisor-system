import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { postComments } from '../data/postComments.js';
import { posts } from '../data/posts.js';
import { users } from '../data/users.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', (req, res) => {
  const { postId } = req.params;
  const filtered = postComments
    .filter((comment) => comment.postId === postId)
    .map((comment) => {
      const user = users.find((candidate) => candidate.id === comment.userId);
      return {
        ...comment,
        userName: user ? user.name : 'Ẩn danh'
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(filtered);
});

router.post('/', requireAuth, (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Nội dung bình luận là bắt buộc.' });
  }

  const postExists = posts.some((post) => post.id === postId);
  if (!postExists) {
    return res.status(404).json({ error: 'Bài viết không tồn tại.' });
  }

  const comment = {
    id: uuid(),
    postId,
    userId: req.user.id,
    content,
    createdAt: new Date().toISOString()
  };

  postComments.push(comment);

  res.status(201).json(comment);
});

router.delete('/:commentId', requireAdmin, (req, res) => {
  const { postId, commentId } = req.params;
  const index = postComments.findIndex((comment) => comment.id === commentId && comment.postId === postId);

  if (index === -1) {
    return res.status(404).json({ error: 'Bình luận không tồn tại.' });
  }

  const [deleted] = postComments.splice(index, 1);
  res.json(deleted);
});

export default router;
