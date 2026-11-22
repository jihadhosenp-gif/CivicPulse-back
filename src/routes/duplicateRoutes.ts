import { Router } from 'express';
import { checkDuplicate } from '../controllers/duplicateController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.post('/check', authenticate, checkDuplicate);
export default router;
