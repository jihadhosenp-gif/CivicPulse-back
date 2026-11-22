import mongoose from 'mongoose';
import config from './index';

const MONGODB_URI = config.mongoUri;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.mongoose!;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((instance: typeof mongoose) => {
        cached.conn = instance;
        return instance;
      });
  }

  await cached.promise!;
  return cached.conn!;
};

export const getDBStatus = (): { connected: boolean; readyState: number } => {
  const readyState = mongoose.connection.readyState;
  return { connected: readyState === 1, readyState };
};

export default { connectDB, getDBStatus };
