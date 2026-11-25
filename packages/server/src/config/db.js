import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB ket noi thanh cong');
  } catch (err) {
    console.error('MongoDB ket noi that bai:', err.message);
    process.exit(1);
  }
}
