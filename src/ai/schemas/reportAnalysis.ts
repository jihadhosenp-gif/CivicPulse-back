import { z } from 'zod';

export const reportAnalysisSchema = z.object({
  category: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  summary_bn: z.string(),
  recommended_action_bn: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
});
