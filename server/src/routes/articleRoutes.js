import { Router } from 'express';
import { body } from 'express-validator';
import {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  recordArticleRead
} from '../controllers/articleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['editor', 'admin']),
  [
    body('title').notEmpty(),
    body('titleVi').optional().notEmpty(),
    body('shortDescription').notEmpty(),
    body('shortDescriptionVi').optional().notEmpty(),
    body('content').notEmpty(),
    body('contentVi').optional().notEmpty()
  ],
  createArticle
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['editor', 'admin']),
  [
    body('title').optional().notEmpty(),
    body('titleVi').optional().notEmpty(),
    body('shortDescription').optional().notEmpty(),
    body('shortDescriptionVi').optional().notEmpty(),
    body('content').optional().notEmpty(),
    body('contentVi').optional().notEmpty()
  ],
  updateArticle
);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteArticle);

router.post('/:articleId/read', authMiddleware, recordArticleRead);

export default router;
