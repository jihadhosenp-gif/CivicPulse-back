import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { duplicateService } from '../services/duplicateService';

export const checkDuplicate = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, category, lng, lat } = req.body;
  const result = await duplicateService.check(title, description, category, Number(lng), Number(lat));
  res.status(200).json({ success: true, data: result });
});
