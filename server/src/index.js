import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app.js';
import { connectDB } from './config/database.js';
import bootstrapData from './utils/bootstrapData.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/game-advisor';

async function bootstrap() {
  try {
    await connectDB(MONGODB_URI);
    await bootstrapData();

    app.listen(PORT, () => {
      console.log(`Game Advisor API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
