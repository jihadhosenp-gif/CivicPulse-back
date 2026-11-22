import { Router } from 'express';
import { analyzeImage } from '../controllers/imageAnalysisController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.post('/analyze-image', authenticate, analyzeImage);
export default router;
