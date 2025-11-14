export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { passwordHash, ...safe } = user;
  return safe;
}

export function sanitizeUsers(list) {
  return list.map((user) => sanitizeUser(user));
}
