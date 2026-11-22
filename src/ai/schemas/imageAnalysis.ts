import { z } from 'zod';

export const imageAnalysisSchema = z.object({
  visibleProblems: z.array(z.string()),
  damageDescription: z.string(),
  detectedObjects: z.array(z.string()),
  matchesDescription: z.boolean(),
  confidence: z.number().min(0).max(1),
});
