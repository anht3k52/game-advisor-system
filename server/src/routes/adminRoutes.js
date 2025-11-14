import { Router } from 'express';
import { getDashboard, listUsers, updateUserRole } from '../controllers/adminController.js';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';
import { moderateComment, listComments } from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { body } from 'express-validator';

const router = Router();

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/dashboard', getDashboard);

router.get('/users', listUsers);
router.patch('/users/:id', updateUserRole);

router.get('/articles', getArticles);
router.post(
  '/articles',
  [body('title').notEmpty(), body('shortDescription').notEmpty(), body('content').notEmpty()],
  createArticle
);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

router.get('/comments/:targetType/:targetId', (req, res, next) => {
  req.query.includeHidden = 'true';
  return listComments(req, res, next);
});
router.patch('/comments/:id/moderate', moderateComment);

export default router;
