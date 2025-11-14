import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import postCommentRoutes from './routes/postCommentRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import comparisonRoutes from './routes/comparisonRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import externalGameRoutes from './routes/externalGameRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'Game Advisor API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', postCommentRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/external-games', externalGameRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
