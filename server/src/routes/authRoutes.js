import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { users } from '../data/users.js';
import { hashPassword, verifyPassword } from '../services/authService.js';
import { createSession, destroySession } from '../services/sessionService.js';
import { sanitizeUser } from '../utils/userUtils.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Họ tên, email và mật khẩu là bắt buộc.' });
  }

  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email đã được đăng ký.' });
  }

  const user = {
    id: uuid(),
    name,
    email,
    role: 'user',
    passwordHash: hashPassword(password),
    preferences: { favoriteGenres: [], preferredPlatforms: [], budget: null, playStyles: [] },
    createdAt: new Date().toISOString()
  };

  users.push(user);

  const token = createSession(user.id);

  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc.' });
  }

  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Thông tin đăng nhập không chính xác.' });
  }

  const token = createSession(user.id);

  res.json({ token, user: sanitizeUser(user) });
});

router.post('/logout', (req, res) => {
  const token = req.headers['x-auth-token'];
  destroySession(token);
  res.json({ success: true });
});

export default router;
