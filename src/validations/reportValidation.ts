import { z } from 'zod';

export const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string(),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.array(z.number()).length(2),
  }),
  address: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
});

export const updateReportSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  status: z.enum(['pending','assigned','in_progress','resolved','rejected']).optional(),
  severity: z.enum(['low','medium','high','critical']).optional(),
  priority: z.enum(['low','medium','high','urgent']).optional(),
  adminNote: z.string().optional(),
});
