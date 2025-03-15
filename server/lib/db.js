import mongoose from 'mongoose';

const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017/bk-messenger';

export default function initializeDatabase() {
  return Promise.resolve(mongoose.connect(mongoUrl));
}
