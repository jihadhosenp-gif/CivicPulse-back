import { Router } from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController';
import { upload } from '../middleware/uploadMiddleware';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.post('/images', authenticate, upload.array('images', 5), uploadImages);
router.delete('/images', authenticate, deleteImage);
export default router;
