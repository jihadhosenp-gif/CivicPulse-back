export const reportAnalysisPrompt = (title: string, description: string, category: string, location: string) => `
You are an assistant that classifies civic reports. Return ONLY valid JSON with keys:
category, severity (low|medium|high|critical), priority (low|normal|high|urgent),
summary_bn, recommended_action_bn, reasoning, confidence (number 0-1).
Title: ${title}
Description: ${description}
Category: ${category}
Location: ${location}
`;
