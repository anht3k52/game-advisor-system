import { Router } from 'express';
import { body } from 'express-validator';
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
  moderateComment
} from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.get('/:targetType/:targetId', listComments);

router.post(
  '/',
  authMiddleware,
  [
    body('targetType').isIn(['game', 'article']),
    body('targetId').notEmpty(),
    body('content').notEmpty()
  ],
  createComment
);

router.put(
  '/:id',
  authMiddleware,
  [body('content').notEmpty()],
  updateComment
);

router.delete('/:id', authMiddleware, deleteComment);
router.patch('/:id/moderate', authMiddleware, roleMiddleware(['admin']), moderateComment);

export default router;
