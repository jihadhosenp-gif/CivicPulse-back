import express from 'express';
import cors from 'cors';
import config, { validateEnv } from './config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { securityMiddleware } from './middleware/securityMiddleware';
import { apiRateLimiter } from './middleware/rateLimiter';
import { AppError } from './utils/AppError';
import { HTTP_STATUS } from './utils/constants';

const app = express();
const PORT = config.port;

validateEnv();
app.use(securityMiddleware);
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.use('/api/v1', routes);

// 404 handler for undefined routes
app.use((_req, _res, next) => {
  next(new AppError('Route not found', HTTP_STATUS.NOT_FOUND));
});

// Centralized error handler
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
    console.log(`[server] Environment: ${config.nodeEnv}`);
    console.log(`[server] Health: http://localhost:${PORT}/api/v1/health`);
  });
};

startServer().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});