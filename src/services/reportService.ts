import { Report } from '../models/Report';

export const reportService = {
  create: async (userId: string, data: any) => {
    return Report.create({ ...data, reportedBy: userId });
  },
  list: async (query: any) => {
    const page = Math.max(parseInt(query.page || '1', 10), 1);
    const limit = Math.min(parseInt(query.limit || '10', 10), 50);
    const filter: any = { isActive: true };
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.search) filter.title = { $regex: query.search, $options: 'i' };
    const [items, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Report.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  },
  getById: async (id: string) => Report.findById(id),
  update: async (id: string, data: any) => Report.findByIdAndUpdate(id, data, { new: true }),
  remove: async (id: string) => Report.findByIdAndUpdate(id, { isActive: false }, { new: true }),
  myReports: async (userId: string, query: any) => {
    const page = Math.max(parseInt(query.page || '1', 10), 1);
    const limit = Math.min(parseInt(query.limit || '10', 10), 50);
    const filter: any = { reportedBy: userId, isActive: true };
    const [items, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Report.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  },
  nearby: async (lng: number, lat: number, radius = 5000) => {
    return Report.find({
      location: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: radius } },
    });
  },
};
