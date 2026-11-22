import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { aiService } from '../services/aiService';
import { ImageAnalysis } from '../models/ImageAnalysis';

export const analyzeImage = asyncHandler(async (req: Request, res: Response) => {
  const { imageUrl, description, reportId } = req.body;
  const analysis = await aiService.analyzeImage(imageUrl, description || '');
  const saved = await ImageAnalysis.create({ reportId, imageUrl, analysis });
  res.status(200).json({ success: true, data: saved });
});
