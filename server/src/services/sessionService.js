import crypto from 'node:crypto';

const sessions = new Map();

export function createSession(userId) {
  const token = crypto.randomUUID();
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
}

export function getSession(token) {
  if (!token) {
    return null;
  }
  return sessions.get(token) ?? null;
}

export function destroySession(token) {
  if (token) {
    sessions.delete(token);
  }
}
