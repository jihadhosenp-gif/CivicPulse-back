import { Router } from 'express';
import { analyticsSummary } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.get('/summary', authenticate, analyticsSummary);
export default router;
