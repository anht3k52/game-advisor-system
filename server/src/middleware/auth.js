import { users } from '../data/users.js';
import { getSession } from '../services/sessionService.js';

function findUserByToken(token) {
  const session = getSession(token);
  if (!session) {
    return null;
  }
  return users.find((user) => user.id === session.userId) ?? null;
}

export function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  const user = findUserByToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }

  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  const token = req.headers['x-auth-token'];
  const user = findUserByToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.' });
  }

  req.user = user;
  next();
}

export function optionalAuth(req, _res, next) {
  const token = req.headers['x-auth-token'];
  const user = findUserByToken(token);
  if (user) {
    req.user = user;
  }
  next();
}
