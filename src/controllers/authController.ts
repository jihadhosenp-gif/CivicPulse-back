import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authService } from '../services/authService';
import { registerSchema, loginSchema } from '../validations/authValidation';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data.email, data.password);
  res.status(200).json({ success: true, data: result });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).select('-password');
  res.status(200).json({ success: true, data: user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out' });
});
