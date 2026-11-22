import { Router } from 'express';
import {
  createReport,
  listReports,
  getReport,
  updateReport,
  deleteReport,
  myReports,
  nearbyReports,
} from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createReportSchema, updateReportSchema } from '../validations/reportValidation';

const router = Router();

router.get('/', listReports);
router.get('/my-reports', authenticate, myReports);
router.get('/nearby', nearbyReports);
router.get('/:id', getReport);
router.post('/', authenticate, validate(createReportSchema), createReport);
router.patch('/:id', authenticate, validate(updateReportSchema), updateReport);
router.delete('/:id', authenticate, deleteReport);

export default router;
