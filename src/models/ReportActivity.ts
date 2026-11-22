import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReportActivity extends Document {
  reportId: mongoose.Types.ObjectId;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  message?: string;
  updatedBy: mongoose.Types.ObjectId;
}

const reportActivitySchema = new Schema<IReportActivity>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    action: { type: String, required: true },
    previousStatus: { type: String },
    newStatus: { type: String },
    message: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

reportActivitySchema.index({ reportId: 1, createdAt: -1 });
reportActivitySchema.index({ updatedBy: 1 });

export const ReportActivity: Model<IReportActivity> = mongoose.model<IReportActivity>(
  'ReportActivity',
  reportActivitySchema
);
