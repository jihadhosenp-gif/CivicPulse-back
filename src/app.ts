import express from 'express';
import cors from 'cors';
import config, { validateEnv } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { securityMiddleware } from './middleware/securityMiddleware';
import { apiRateLimiter } from './middleware/rateLimiter';
import { AppError } from './utils/AppError';
import { HTTP_STATUS } from './utils/constants';

validateEnv();

const app = express();

app.use(securityMiddleware);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowed = config.clientUrls;
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('CORS policy violation', HTTP_STATUS.FORBIDDEN));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(apiRateLimiter);

app.use('/', routes);

app.use((_req, _res, next) => {
  next(new AppError('Route not found', HTTP_STATUS.NOT_FOUND));
});

app.use(errorHandler);

export default app;
