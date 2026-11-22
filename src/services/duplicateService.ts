import { Report } from '../models/Report';

const similarity = (a: string, b: string) => {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
};

export const duplicateService = {
  check: async (title: string, description: string, category: string, lng: number, lat: number) => {
    const candidates = await Report.find({
      category,
      location: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 500 } },
    }).limit(10);
    let best: any = null;
    let bestScore = 0;
    for (const r of candidates) {
      const t = similarity(title, r.title);
      const d = similarity(description, r.description);
      const score = (t + d) / 2;
      if (score > bestScore) {
        bestScore = score;
        best = r;
      }
    }
    const possible = bestScore >= 0.5;
    return {
      possibleDuplicate: possible,
      matchedReportId: possible ? best?._id : null,
      similarity: Number(bestScore.toFixed(2)),
      reason: possible ? 'Similar issue reported nearby' : 'No likely duplicate found',
    };
  },
};
