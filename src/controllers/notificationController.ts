import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Notification } from '../models/Notification';
import { ReportActivity } from '../models/ReportActivity';
import { AuthRequest } from '../middleware/authMiddleware';
import { HTTP_STATUS } from '../utils/constants';

export const listNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const items = await Notification.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50);
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});

export const unreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const count = await Notification.countDocuments({ userId: req.user!.id, isRead: false });
  res.status(HTTP_STATUS.OK).json({ success: true, data: { count } });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const n = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.status(HTTP_STATUS.OK).json({ success: true, data: n });
});

export const listActivity = asyncHandler(async (req: Request, res: Response) => {
  const items = await ReportActivity.find({ reportId: req.params.reportId }).sort({ createdAt: -1 });
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});
