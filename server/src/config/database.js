import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

export async function connectDB(uri) {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(uri, {
    autoIndex: true
  });

  console.log('Connected to MongoDB');
}
