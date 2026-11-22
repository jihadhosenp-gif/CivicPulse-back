import app from './app';
import { connectDB } from './config/db';
import mongoose from 'mongoose';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`[server] Running on http://localhost:${PORT}`);
      logger.info(`[server] Environment: ${config.nodeEnv}`);
      logger.info(`[server] Health: http://localhost:${PORT}/api/health`);
      logger.info(`[server] CORS origins: ${config.clientUrls.join(', ')}`);
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`[server] Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        logger.info('[server] HTTP server closed');
        await mongoose.disconnect();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('[server] Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (err) {
    logger.error('[server] Failed to start:', err);
    process.exit(1);
  }
};

startServer();

export default app;
