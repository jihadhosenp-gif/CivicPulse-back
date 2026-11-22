import app from '../src/app';
import { connectDB } from '../src/config/db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isDbConnected = false;

async function ensureDbConnected(): Promise<void> {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (error) {
      console.error('[api] MongoDB connection failed:', error);
    }
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  await ensureDbConnected();
  return app(req, res);
}