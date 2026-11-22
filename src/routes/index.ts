import { Router } from 'express';
import authRoutes from './authRoutes';
import reportRoutes from './reportRoutes';
import uploadRoutes from './uploadRoutes';
import imageAnalysisRoutes from './imageAnalysisRoutes';
import duplicateRoutes from './duplicateRoutes';
import analyticsRoutes from './analyticsRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CivicPulse AI backend is running',
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
