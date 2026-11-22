import dotenv from 'dotenv';
dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  geminiApiKey: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  adminEmail: string;
  adminPassword: string;
  clientUrls: string[];
  logLevel: string;
  logPretty: boolean;
}

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parseClientUrls = (): string[] => {
  const urls = process.env.FRONTEND_URL || 'http://localhost:3000';
  return urls.split(',').map((u) => u.trim()).filter(Boolean);
};

export const config: EnvConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  clientUrls: parseClientUrls(),
  logLevel: process.env.LOG_LEVEL || 'info',
  logPretty: process.env.LOG_PRETTY === 'true',
};

export const validateEnv = (): void => {
  const missing: string[] = [];
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'FRONTEND_URL',
  ];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (config.nodeEnv === 'production') {
    if (config.jwtSecret === 'dev-secret' || config.jwtSecret.length < 32) {
      console.error('[env] ERROR: JWT_SECRET must be at least 32 characters in production');
      process.exit(1);
    }
    if (config.refreshTokenSecret === 'dev-refresh-secret' || config.refreshTokenSecret.length < 32) {
      console.error('[env] ERROR: REFRESH_TOKEN_SECRET must be at least 32 characters in production');
      process.exit(1);
    }
    if (config.adminPassword.length < 12) {
      console.error('[env] ERROR: ADMIN_PASSWORD must be at least 12 characters in production');
      process.exit(1);
    }
  }

  if (missing.length > 0) {
    const msg = `Missing required environment variables: ${missing.join(', ')}`;
    if (config.nodeEnv === 'production') {
      console.error('[env] ERROR:', msg);
      process.exit(1);
    }
    console.warn(`[env] Warning: ${msg}`);
  }
};

export default config;