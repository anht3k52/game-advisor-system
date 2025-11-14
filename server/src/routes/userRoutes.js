import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { users } from '../data/users.js';
import { requireAdmin } from '../middleware/auth.js';
import { hashPassword } from '../services/authService.js';
import { sanitizeUser, sanitizeUsers } from '../utils/userUtils.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(sanitizeUsers(users));
});

router.get('/:id', (req, res) => {
  const user = users.find((candidate) => candidate.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Người dùng không tồn tại.' });
  }

  res.json(sanitizeUser(user));
});

router.post('/', requireAdmin, (req, res) => {
  const { name, email, password, role = 'user', preferences = {} } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Họ tên, email và mật khẩu là bắt buộc.' });
  }

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
  }

  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Email đã được sử dụng.' });
  }

  const user = {
    id: uuid(),
    name,
    email,
    role,
    passwordHash: hashPassword(password),
    preferences,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.status(201).json(sanitizeUser(user));
});

router.put('/:id', requireAdmin, (req, res) => {
  const user = users.find((candidate) => candidate.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Người dùng không tồn tại.' });
  }

  const { name, email, role, password, preferences } = req.body;

  if (email) {
    const duplicate = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.id !== user.id
    );
    if (duplicate) {
      return res.status(409).json({ error: 'Email đã được sử dụng.' });
    }
    user.email = email;
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) {
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
    }
    user.role = role;
  }
  if (preferences !== undefined) {
    user.preferences = preferences;
  }
  if (password) {
    user.passwordHash = hashPassword(password);
  }

  res.json(sanitizeUser(user));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const index = users.findIndex((candidate) => candidate.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Người dùng không tồn tại.' });
  }

  const [deleted] = users.splice(index, 1);
  res.json(sanitizeUser(deleted));
});

export default router;
