import { Router } from 'express';
import { listNotifications, unreadCount, markRead, listActivity } from '../controllers/notificationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.get('/', authenticate, listNotifications);
router.get('/unread-count', authenticate, unreadCount);
router.patch('/:id/read', authenticate, markRead);
router.get('/activity/:reportId', authenticate, listActivity);
export default router;
