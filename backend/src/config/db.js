import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<user>')) {
    console.warn('MongoDB connection skipped. Set MONGODB_URI in backend/.env.');
    return;
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
