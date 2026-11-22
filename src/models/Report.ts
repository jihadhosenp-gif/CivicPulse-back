import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  aiCategory?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  bengaliSummary?: string;
  recommendedActions?: string[];
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  location: { type: string; coordinates: number[] };
  address?: string;
  division?: string;
  district?: string;
  images: Array<{ url: string; publicId: string; uploadedAt: Date }>;
  reportedBy: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  upvoteCount: number;
  upvotedBy: mongoose.Types.ObjectId[];
  aiAnalysis?: Record<string, any>;
  adminNote?: string;
  resolvedAt?: Date;
  isActive: boolean;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    aiCategory: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'] },
    bengaliSummary: { type: String },
    recommendedActions: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
      required: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String },
    division: { type: String },
    district: { type: String },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    upvoteCount: { type: Number, default: 0 },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    aiAnalysis: { type: Schema.Types.Mixed },
    adminNote: { type: String },
    resolvedAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ category: 1 });
reportSchema.index({ reportedBy: 1 });

export const Report: Model<IReport> = mongoose.model<IReport>('Report', reportSchema);