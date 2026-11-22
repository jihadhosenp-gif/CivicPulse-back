import { Router } from 'express';
import { getDBStatus } from '../config/db';
import authRoutes from './authRoutes';
import reportRoutes from './reportRoutes';
import uploadRoutes from './uploadRoutes';
import imageAnalysisRoutes from './imageAnalysisRoutes';
import duplicateRoutes from './duplicateRoutes';
import analyticsRoutes from './analyticsRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CivicPulse AI backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.get('/health', (_req, res) => {
  const db = getDBStatus();
  res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    message: db.connected ? 'CivicPulse AI backend is running' : 'Backend degraded: database unavailable',
    uptime: process.uptime(),
    database: db,
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/uploads', uploadRoutes);
router.use('/ai', imageAnalysisRoutes);
router.use('/duplicates', duplicateRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
