import { generateWithRetry } from '../ai/gemini';
import { getGeminiModel } from '../ai/gemini';
import { reportAnalysisPrompt } from '../ai/prompts/reportAnalysis';
import { reportAnalysisSchema } from '../ai/schemas/reportAnalysis';
import { imageAnalysisSchema } from '../ai/schemas/imageAnalysis';
import { analyzeImagePrompt } from '../ai/prompts/imageAnalysis';

export const aiService = {
  analyzeReport: async (title: string, description: string, category: string, location: string) => {
    const text = await generateWithRetry(reportAnalysisPrompt(title, description, category, location));
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return reportAnalysisSchema.parse(parsed);
  },
  analyzeImage: async (imageUrl: string, description: string) => {
    const res = await fetch(imageUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    const base64 = buf.toString('base64');
    const model = getGeminiModel();
    const result = await model.generateContent([
      analyzeImagePrompt(description),
      { inlineData: { data: base64, mimeType: res.headers.get('content-type') || 'image/jpeg' } },
    ]);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return imageAnalysisSchema.parse(JSON.parse(text));
  },
};
