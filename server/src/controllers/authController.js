import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

export async function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, avatar, username } = req.body;

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username ? username.trim().toLowerCase() : undefined;

    if (normalizedUsername) {
      const usernameTaken = await User.findOne({ username: normalizedUsername });
      if (usernameTaken) {
        return res.status(409).json({ error: 'Username already taken' });
      }
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      avatar,
      ...(normalizedUsername ? { username: normalizedUsername } : {})
    });
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { identifier, password } = req.body;
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const query = normalizedIdentifier.includes('@')
      ? { email: normalizedIdentifier }
      : { username: normalizedIdentifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate('readArticlesHistory.article', 'title slug thumbnailUrl shortDescription publishedAt')
      .lean();

    res.json({ user });
  } catch (error) {
    next(error);
  }
}
