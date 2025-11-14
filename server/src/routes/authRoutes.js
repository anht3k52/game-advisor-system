import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
  ],
  register
);

router.post(
  '/login',
  [body('identifier').notEmpty(), body('password').notEmpty()],
  login
);

router.get('/me', authMiddleware, getMe);

export default router;
