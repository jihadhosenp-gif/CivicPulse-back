import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Report } from '../models/Report';

export const analyticsSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [byStatus, byCategory, bySeverity] = await Promise.all([
    Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
  ]);
  res.status(200).json({ success: true, data: { byStatus, byCategory, bySeverity } });
});
