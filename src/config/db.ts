import mongoose from 'mongoose';
import config from './index';

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      console.warn('[db] MONGO_URI not set; skipping MongoDB connection');
      return;
    }
    await mongoose.connect(config.mongoUri);
    console.log(`[db] Connected to MongoDB (${config.nodeEnv})`);
  } catch (error) {
    console.error('[db] MongoDB connection error:', error);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[db] Disconnected from MongoDB');
  } catch (error) {
    console.error('[db] Disconnect error:', error);
  }
};

export default { connectDB, disconnectDB };