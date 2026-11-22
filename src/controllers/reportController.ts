import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { reportService } from '../services/reportService';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../utils/constants';

import { aiService } from '../services/aiService';

export const createReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  let aiAnalysis;
  try {
    aiAnalysis = await aiService.analyzeReport(
      req.body.title,
      req.body.description,
      req.body.category,
      JSON.stringify(req.body.location)
    );
  } catch {
    aiAnalysis = null;
  }
  const report = await reportService.create(req.user!.id, { ...req.body, aiAnalysis });
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: report });
});

export const listReports = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportService.list(req.query);
  res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.getById(req.params.id);
  if (!report) throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  res.status(HTTP_STATUS.OK).json({ success: true, data: report });
});

export const updateReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.update(req.params.id, req.body);
  if (!report) throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  res.status(HTTP_STATUS.OK).json({ success: true, data: report });
});

export const deleteReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.remove(req.params.id);
  if (!report) throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Report deleted' });
});

export const myReports = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await reportService.myReports(req.user!.id, req.query);
  res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});

export const nearbyReports = asyncHandler(async (req: Request, res: Response) => {
  const lng = parseFloat(req.query.lng as string);
  const lat = parseFloat(req.query.lat as string);
  const radius = req.query.radius ? parseFloat(req.query.radius as string) : 5000;
  const items = await reportService.nearby(lng, lat, radius);
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});
