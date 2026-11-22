import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';

let model: any = null;

export const getGeminiModel = () => {
  if (!model) {
    if (!config.geminiApiKey) throw new Error('GEMINI_API_KEY is not configured');
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
};

export const generateWithRetry = async (prompt: string, retries = 2): Promise<string> => {
  const m = getGeminiModel();
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await Promise.race([
        m.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), 20000)),
      ]);
      return (result as any).response.text();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error('Gemini failed');
};
