export const analyzeImagePrompt = (description: string) => `
Analyze this civic issue image. Return ONLY valid JSON with keys:
visibleProblems (array of strings), damageDescription (string), detectedObjects (array of strings),
matchesDescription (boolean), confidence (number 0-1).
Do not infer unseen facts, identify individuals, or make unsupported safety claims.
Report description: ${description}
`;
